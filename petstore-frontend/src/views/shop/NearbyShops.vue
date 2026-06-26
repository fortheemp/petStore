<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getShopList } from '@/api/shop'
import { getAddressList } from '@/api/address'
import { useUserStore } from '@/stores/user'
import AMapLoader from '@amap/amap-jsapi-loader'

const router = useRouter()
const userStore = useUserStore()

const shops = ref([])
const nearbyPois = ref([])
const shopsLoading = ref(true)
const mapCenter = ref([116.397, 39.908]) // 跟踪地图中心点

const loadShops = async () => {
  shopsLoading.value = true
  try {
    const res = await getShopList()
    const list = Array.isArray(res) ? res : []
    shops.value = list.map((s) => ({
      ...s,
      lng: s.lng ?? s.longitude,
      lat: s.lat ?? s.latitude,
    }))
  } catch {
    shops.value = []
  } finally {
    shopsLoading.value = false
  }
}
const selectedShop = ref(null)
const searchKeyword = ref('')

// Haversine 公式计算两点距离（km）
const getDistance = (lng1, lat1, lng2, lat2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const filteredShops = computed(() => {
  // POI结果直接显示（高德搜索已按位置过滤）
  // 后端商店只在距离地图中心50km内才显示
  const nearbyBackend = shops.value.filter((s) => {
    if (!s.lng || !s.lat) return false
    return getDistance(mapCenter.value[0], mapCenter.value[1], s.lng, s.lat) <= 50
  })
  let list = [...nearbyBackend, ...nearbyPois.value]
  if (searchKeyword.value) {
    const kw = searchKeyword.value
    list = list.filter((s) => s.name.includes(kw) || s.address?.includes(kw))
  }
  return list
})

const handleShopClick = (shop) => {
  selectedShop.value = shop
}

const handleNavigate = (shop) => {
  const url = `https://uri.amap.com/navigation?to=${shop.lng},${shop.lat},${encodeURIComponent(shop.name)}&mode=car&policy=1&src=petsotre`
  window.open(url, '_blank')
}

const handleViewProducts = (shopId) => {
  router.push({ path: '/products', query: { shopId: String(shopId) } })
}

const renderStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half)
}

const locateMe = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.info('请先登录')
    return
  }
  locateByAddress()
}

// AMap
let AMapLib = null
let map = null
let markers = []
let infoWindow = null
const mapContainer = ref(null)

function clearMarkers() {
  markers.forEach((m) => m.setMap(null))
  markers = []
}

function addMarkers(list) {
  if (!map) return
  list.forEach((shop) => {
    const marker = new AMapLib.Marker({
      position: [shop.lng, shop.lat],
      title: shop.name,
      extData: shop,
    })
    marker.on('click', () => {
      selectedShop.value = shop
      infoWindow.setContent(`
        <div style="padding:6px 10px;font-size:13px;">
          <div style="font-weight:600;margin-bottom:4px;">${shop.name}</div>
          <div style="color:#999;">${shop.address}</div>
        </div>
      `)
      infoWindow.open(map, marker.getPosition())
    })
    marker.setMap(map)
    markers.push(marker)
  })
}

const initMap = async () => {
  try {
    window._AMapSecurityConfig = {
      securityJsCode: '14895041b0729be0b72daa42d8c6fc15',
    }

    AMapLib = await AMapLoader.load({
      key: 'e6579887e28a5e152a6353a57a61e8fe',
      version: '2.0',
      plugins: ['AMap.InfoWindow', 'AMap.Geocoder', 'AMap.PlaceSearch'],
    })

    map = new AMapLib.Map(mapContainer.value, {
      zoom: 12,
      center: [116.397, 39.908],
      resizeEnable: true,
    })

    infoWindow = new AMapLib.InfoWindow({ offset: new AMapLib.Pixel(0, -30) })

    map.on('moveend', () => {
      const c = map.getCenter()
      mapCenter.value = [c.lng, c.lat]
    })

    addMarkers(filteredShops.value)

    // 尝试根据默认收货地址定位
    locateByAddress()
  } catch (e) {
    console.error('AMap load failed:', e)
  }
}

const locateByAddress = async () => {
  if (!userStore.isLoggedIn) return
  try {
    const userId = userStore.userInfo?.id
    if (!userId) return
    const res = await getAddressList(userId)
    const list = Array.isArray(res) ? res : []
    const addr = list.find((a) => a.isDefault === 1) || list[0]
    if (!addr) return

    const fullAddr = [addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join('')

    nearbyPois.value = []

    const geocoder = new AMapLib.Geocoder()
    geocoder.getLocation(fullAddr, (status, result) => {
      if (status === 'complete' && result.geocodes?.length) {
        const loc = result.geocodes[0].location
        map.setCenter([loc.lng, loc.lat])
        map.setZoom(14)
        searchNearbyPetShops(loc.lng, loc.lat)
      }
    })
  } catch {
    // 静默失败，保持默认定位
  }
}

const searchNearbyPetShops = (lng, lat) => {
  if (!AMapLib) {
    setTimeout(() => searchNearbyPetShops(lng, lat), 500)
    return
  }
  mapCenter.value = [lng, lat]
  const placeSearch = new AMapLib.PlaceSearch({
    pageSize: 20,
    pageIndex: 1,
    extensions: 'all',
  })
  const center = new AMapLib.LngLat(lng, lat)
  placeSearch.searchNearBy('宠物', center, 5000, (status, result) => {
    if (status === 'complete' && result.poiList?.pois) {
      nearbyPois.value = result.poiList.pois.map((poi) => ({
        id: `poi_${poi.id}`,
        name: poi.name,
        address: poi.address || poi.cityname + poi.adname,
        lng: poi.location?.lng,
        lat: poi.location?.lat,
        phone: poi.tel,
        rating: null,
        reviewCount: null,
        status: 'open',
        businessHours: null,
        _isPoi: true,
      }))
    }
  })
}

watch(selectedShop, (shop) => {
  if (!map || !shop) return
  const marker = markers.find((m) => m.extData.id === shop.id)
  if (marker) {
    map.setCenter([shop.lng, shop.lat])
    map.setZoom(15)
    infoWindow.setContent(`
      <div style="padding:6px 10px;font-size:13px;">
        <div style="font-weight:600;margin-bottom:4px;">${shop.name}</div>
        <div style="color:#999;">${shop.address}</div>
      </div>
    `)
    infoWindow.open(map, marker.getPosition())
  }
})

watch(filteredShops, (list) => {
  if (!map) return
  clearMarkers()
  addMarkers(list)
})

onMounted(() => {
  loadShops()
  nextTick(() => initMap())
})

onBeforeUnmount(() => {
  if (map) {
    map.destroy()
    map = null
  }
})
</script>

<template>
  <div class="nearby-shops-page">
    <div class="nearby-shops-page__container">
      <h1 class="nearby-shops-page__title">附近宠物商店</h1>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <input
          v-model="searchKeyword"
          class="shop-list__search"
          placeholder="搜索商店名称或地址..."
        />
        <button class="district-btn district-btn--locate" @click="locateMe">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:-2px;">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
          </svg>
          定位到我的地址
        </button>
      </div>

      <div class="nearby-shops-page__content">
        <!-- Map Area -->
        <div class="map-section">
          <div ref="mapContainer" class="amap-container"></div>
        </div>

        <!-- Shop List -->
        <div class="shop-list">
          <div class="shop-list__count">
            {{ shopsLoading ? '加载中...' : `找到 ${filteredShops.length} 家商店` }}
          </div>
          <!-- 骨架屏 -->
          <div v-if="shopsLoading" class="shop-list__items">
            <div v-for="i in 5" :key="i" class="skeleton-shop-card">
              <div class="skeleton-shop-card__title"></div>
              <div class="skeleton-shop-card__line"></div>
              <div class="skeleton-shop-card__line skeleton-shop-card__line--short"></div>
            </div>
          </div>
          <div v-else class="shop-list__items">
            <div
              v-for="shop in filteredShops"
              :key="shop.id"
              class="shop-card"
              :class="{ 'shop-card--active': selectedShop?.id === shop.id }"
              @click="handleShopClick(shop)"
            >
              <div class="shop-card__header">
                <span class="shop-card__name">{{ shop.name }}</span>
                <span
                  v-if="shop._isPoi"
                  class="shop-card__status shop-card__status--open"
                >附近推荐</span>
                <span
                  v-else
                  class="shop-card__status"
                  :class="shop.status === 'open' ? 'shop-card__status--open' : 'shop-card__status--closed'"
                >
                  {{ shop.status === 'open' ? '营业中' : '已打烊' }}
                </span>
              </div>
              <div v-if="shop.rating" class="shop-card__rating">
                <span class="stars">{{ renderStars(shop.rating) }}</span>
                <span class="score">{{ shop.rating }}</span>
                <span class="count">({{ shop.reviewCount }}条评价)</span>
              </div>
              <div v-if="shop.phone" class="shop-card__phone">{{ shop.phone }}</div>
              <div class="shop-card__address">{{ shop.address }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shop Detail -->
      <div v-if="selectedShop" class="shop-detail">
        <div class="shop-detail__header">
          <div>
            <h2 class="shop-detail__name">{{ selectedShop.name }}</h2>
            <div class="shop-detail__rating">
              <span class="stars">{{ renderStars(selectedShop.rating) }}</span>
              <span class="score">{{ selectedShop.rating }}</span>
              <span class="count">({{ selectedShop.reviewCount }}条评价)</span>
              <span
                class="shop-detail__status"
                :class="selectedShop.status === 'open' ? 'shop-detail__status--open' : 'shop-detail__status--closed'"
              >
                {{ selectedShop.status === 'open' ? '营业中' : '已打烊' }}
              </span>
            </div>
          </div>
        </div>
        <div class="shop-detail__info">
          <div class="info-item">
            <span class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/></svg>
            </span>
            <span>{{ selectedShop.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span>{{ selectedShop.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <span>营业时间：{{ selectedShop.businessHours }}</span>
          </div>
        </div>
        <div class="shop-detail__actions">
          <button class="btn btn--navigate" @click="handleNavigate(selectedShop)">导航到这里</button>
          <button class="btn btn--products" @click="handleViewProducts(selectedShop.id)">查看商品</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nearby-shops-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0;
}

.nearby-shops-page__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px;
}

.nearby-shops-page__title {
  font-size: 28px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 16px;
}

/* 骨架屏 */
.skeleton-shop-card {
  padding: 16px;
}

.skeleton-shop-card__title {
  height: 16px;
  width: 60%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-shop-card__line {
  height: 12px;
  width: 100%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-shop-card__line--short {
  width: 40%;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Search Bar */
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.search-bar .shop-list__search {
  flex: 1;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar .shop-list__search:focus {
  border-color: #1c49c2;
}

.district-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.district-btn:hover {
  border-color: #1c49c2;
  color: #1c49c2;
}

.district-btn--locate {
  margin-left: auto;
  border-color: #1c49c2;
  color: #1c49c2;
}

.district-btn--locate:hover {
  background: #1c49c2;
  color: #fff;
}

.nearby-shops-page__content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  height: 560px;
}

/* Map */
.map-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
}

.amap-container {
  width: 100%;
  height: 100%;
}

/* Shop List */
.shop-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.shop-list__count {
  padding: 12px 16px;
  font-size: 13px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
}

.shop-list__items {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* Shop Card */
.shop-card {
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  margin-bottom: 4px;
}

.shop-card:hover {
  background: #f8f9fa;
}

.shop-card--active {
  border-color: #1c49c2;
  background: #f0f6ff;
}

.shop-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.shop-card__name {
  font-size: 16px;
  font-weight: 600;
  color: #121212;
}

.shop-card__status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.shop-card__status--open {
  background: #e6f9ee;
  color: #00a651;
}

.shop-card__status--closed {
  background: #f5f5f5;
  color: #999;
}

.shop-card__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.shop-card__rating .stars {
  color: #ffc107;
  font-size: 14px;
}

.shop-card__rating .score {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.shop-card__rating .count {
  font-size: 12px;
  color: #999;
}

.shop-card__address {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shop-card__phone {
  font-size: 13px;
  color: #1c49c2;
  margin-bottom: 4px;
}

/* Shop Detail */
.shop-detail {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-top: 24px;
}

.shop-detail__name {
  font-size: 20px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 8px;
}

.shop-detail__rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shop-detail__rating .stars {
  color: #ffc107;
}

.shop-detail__rating .score {
  font-weight: 600;
}

.shop-detail__rating .count {
  color: #999;
  font-size: 14px;
}

.shop-detail__status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
}

.shop-detail__status--open {
  background: #e6f9ee;
  color: #00a651;
}

.shop-detail__status--closed {
  background: #f5f5f5;
  color: #999;
}

.shop-detail__info {
  margin: 20px 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.info-icon {
  color: #999;
  margin-top: 2px;
  flex-shrink: 0;
}

.shop-detail__actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  border: none;
}

.btn--navigate {
  background: #1c49c2;
  color: #fff;
}

.btn--navigate:hover {
  background: #163da0;
}

.btn--products {
  background: #ff6c10;
  color: #fff;
}

.btn--products:hover {
  background: #e55a00;
}

@media (max-width: 992px) {
  .nearby-shops-page__container {
    padding: 0 16px;
  }

  .nearby-shops-page__content {
    grid-template-columns: 1fr;
    height: auto;
  }

  .map-section {
    height: 360px;
  }
}
</style>
