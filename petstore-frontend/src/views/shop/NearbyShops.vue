<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getShopList } from '@/api/shop'
import AMapLoader from '@amap/amap-jsapi-loader'

const router = useRouter()

const districts = [
  { key: 'jimei', label: '集美区', center: [118.080, 24.600], zoom: 13 },
  { key: 'siming', label: '思明区', center: [118.082, 24.445], zoom: 13 },
  { key: 'huli', label: '湖里区', center: [118.110, 24.510], zoom: 13 },
  { key: 'haicang', label: '海沧区', center: [117.998, 24.485], zoom: 13 },
  { key: 'tongan', label: '同安区', center: [118.158, 24.730], zoom: 13 },
]

const currentDistrict = ref('jimei')
const shops = ref([])

const loadShops = async () => {
  try {
    const res = await getShopList()
    shops.value = Array.isArray(res) ? res : []
  } catch {
    shops.value = []
  }
}
const selectedShop = ref(null)
const searchKeyword = ref('')

const filteredShops = computed(() => {
  let list = shops.value.filter((s) => s.district === currentDistrict.value)
  if (searchKeyword.value) {
    const kw = searchKeyword.value
    list = list.filter((s) => s.name.includes(kw) || s.address.includes(kw))
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

const switchDistrict = (key) => {
  currentDistrict.value = key
  selectedShop.value = null
  searchKeyword.value = ''
  const d = districts.find((item) => item.key === key)
  if (map && d) {
    map.setCenter(d.center)
    map.setZoom(d.zoom)
  }
}

// AMap
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
    const marker = new AMap.Marker({
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

    const AMap = await AMapLoader.load({
      key: 'e6579887e28a5e152a6353a57a61e8fe',
      version: '2.0',
      plugins: ['AMap.InfoWindow'],
    })

    const d = districts.find((item) => item.key === currentDistrict.value)
    map = new AMap.Map(mapContainer.value, {
      zoom: d.zoom,
      center: d.center,
      resizeEnable: true,
    })

    infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })

    addMarkers(filteredShops.value)
  } catch (e) {
    console.error('AMap load failed:', e)
  }
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

      <!-- 地区切换 -->
      <div class="district-selector">
        <button
          v-for="d in districts"
          :key="d.key"
          class="district-btn"
          :class="{ 'district-btn--active': currentDistrict === d.key }"
          @click="switchDistrict(d.key)"
        >
          {{ d.label }}
        </button>
      </div>

      <div class="nearby-shops-page__content">
        <!-- Map Area -->
        <div class="map-section">
          <div ref="mapContainer" class="amap-container"></div>
        </div>

        <!-- Shop List -->
        <div class="shop-list">
          <div class="shop-list__header">
            <input
              v-model="searchKeyword"
              class="shop-list__search"
              placeholder="搜索商店名称或地址..."
            />
          </div>
          <div class="shop-list__count">
            找到 {{ filteredShops.length }} 家商店
          </div>
          <div class="shop-list__items">
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
                  class="shop-card__status"
                  :class="shop.status === 'open' ? 'shop-card__status--open' : 'shop-card__status--closed'"
                >
                  {{ shop.status === 'open' ? '营业中' : '已打烊' }}
                </span>
              </div>
              <div class="shop-card__rating">
                <span class="stars">{{ renderStars(shop.rating) }}</span>
                <span class="score">{{ shop.rating }}</span>
                <span class="count">({{ shop.reviewCount }}条评价)</span>
              </div>
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

/* District Selector */
.district-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

.district-btn--active {
  background: #1c49c2;
  border-color: #1c49c2;
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

.shop-list__header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.shop-list__search {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.shop-list__search:focus {
  border-color: #1c49c2;
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
