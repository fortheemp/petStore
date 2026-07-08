<template>
  <view class="container">
    <view v-if="locateStatus" class="locate-bar">
      <text class="locate-bar-text">{{ locateStatus }}</text>
    </view>

    <view class="search-bar">
      <view class="search-wrap">
        <text class="search-icon">Q</text>
        <input class="search-input" placeholder="搜索附近宠物店..." v-model="keyword" />
      </view>
    </view>

    <scroll-view scroll-y class="shop-list">
      <view v-if="loading" class="empty">
        <text class="empty-text">加载中...</text>
      </view>
      <view v-else>
        <view class="shop-count" v-if="shops.length > 0">
          <text class="shop-count-text">找到 {{ shops.length }} 家商店</text>
          <text v-if="hasLocation" class="shop-count-hint">（已按距离排序）</text>
        </view>
        <view class="shop-card" v-for="shop in shops" :key="shop.id" @tap="goDetail(shop.id)">
          <view class="card-body">
            <view v-if="shop.image" class="card-left">
              <image class="shop-img" :src="shop.image" mode="aspectFill" />
            </view>
            <view class="card-right">
              <view class="shop-header">
                <text class="shop-name">{{ shop.name }}</text>
                <view class="status-badge" :class="shop.status === 'open' ? 'status-badge--open' : 'status-badge--closed'">
                  <text class="status-badge-text">{{ shop.status === 'open' ? '营业中' : '已打烊' }}</text>
                </view>
                <text v-if="shop.distance != null" class="distance-badge">{{ formatDistance(shop.distance) }}</text>
              </view>
              <view v-if="shop.rating" class="shop-rating-row">
                <text class="stars">★</text>
                <text class="shop-rating">{{ shop.rating }}</text>
                <text class="review-count">({{ shop.reviewCount || 0 }}条评价)</text>
              </view>
              <text v-if="shop.phone" class="shop-phone">{{ shop.phone }}</text>
              <text class="shop-address">{{ shop.address }}</text>
              <text v-if="shop.businessHours" class="shop-hours">营业时间：{{ shop.businessHours }}</text>
            </view>
          </view>
          <view class="card-footer">
            <view v-if="shop._isPoi" class="nav-btn" @tap.stop="navigateTo(shop)">
              <text class="nav-btn-text">导航</text>
            </view>
            <view v-else class="detail-btn" @tap.stop="goDetail(shop.id)">
              <text class="detail-btn-text">查看详情</text>
            </view>
          </view>
        </view>
        <view v-if="shops.length === 0" class="empty">
          <text class="empty-text">未找到附近店铺</text>
          <text class="empty-hint">试试其他关键词或检查收货地址</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getAddressList } from '@/services/address'

const userStore = useUserStore()
const _isHttp = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:')
const AMAP_URL = _isHttp ? '/amap/v3/place/around' : 'https://restapi.amap.com/v3/place/around'
const AMAP_GEO_URL = _isHttp ? '/amap/v3/geocode/geo' : 'https://restapi.amap.com/v3/geocode/geo'
const AMAP_KEY = '1a514b06dfbb25f3a692564054e7df23'

const shops = ref([])
const keyword = ref('')
const loading = ref(true)
const hasLocation = ref(false)
const locateStatus = ref('')

const getDistance = (lng1, lat1, lng2, lat2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const formatDistance = (km) => {
  if (km < 1) return Math.round(km * 1000) + 'm'
  return km.toFixed(1) + 'km'
}

// AMap REST API 搜索附近宠物店（对应电脑端 searchNearbyPetShops）
const searchNearbyPetShops = (lng, lat) => {
  return new Promise((resolve) => {
    const url = `${AMAP_URL}?key=${AMAP_KEY}&location=${lng},${lat}&keywords=宠物&radius=5000&extensions=all`
    console.log('[nearby] AMap request:', url)
    uni.request({
      url,
      success: (res) => {
        console.log('[nearby] AMap response:', JSON.stringify(res.data).substring(0, 300))
        if (res.data?.status === '1' && res.data.pois) {
          const pois = res.data.pois.map((poi) => ({
            id: `poi_${poi.id}`,
            name: poi.name,
            address: poi.address || poi.cityname + poi.adname,
            lng: Number(poi.location?.split(',')[0]),
            lat: Number(poi.location?.split(',')[1]),
            phone: poi.tel,
            rating: null,
            reviewCount: null,
            status: 'open',
            businessHours: poi.biz_ext?.opening_time || null,
            _isPoi: true,
          }))
          console.log('[nearby] AMap pois count:', pois.length)
          resolve(pois)
        } else {
          console.log('[nearby] AMap no results, info:', res.data?.info)
          resolve([])
        }
      },
      fail: (err) => {
        console.error('[nearby] AMap request failed:', err)
        resolve([])
      },
    })
  })
}

// 高德地理编码：地址转坐标（对应电脑端 Geocoder.getLocation）
const geocodeAddress = (fullAddr) => {
  return new Promise((resolve) => {
    const url = `${AMAP_GEO_URL}?key=${AMAP_KEY}&address=${encodeURIComponent(fullAddr)}`
    console.log('[nearby] geocode request:', fullAddr)
    uni.request({
      url,
      success: (res) => {
        console.log('[nearby] geocode response:', JSON.stringify(res.data).substring(0, 300))
        if (res.data?.status === '1' && res.data.geocodes?.length) {
          const loc = res.data.geocodes[0].location.split(',')
          resolve({ lng: Number(loc[0]), lat: Number(loc[1]) })
        } else {
          resolve(null)
        }
      },
      fail: () => resolve(null),
    })
  })
}

// 根据收货地址定位（对应电脑端 locateByAddress）
const locateByAddress = async () => {
  if (!userStore.isLoggedIn) return null
  try {
    const userId = userStore.user?.id
    if (!userId) return null
    const res = await getAddressList(userId)
    const list = Array.isArray(res) ? res : []
    const addr = list.find((a) => a.isDefault === 1) || list[0]
    if (!addr) return null
    const fullAddr = [addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join('')
    if (!fullAddr) return null
    console.log('[nearby] locateByAddress:', fullAddr)
    return await geocodeAddress(fullAddr)
  } catch (e) {
    console.error('[nearby] locateByAddress error:', e)
    return null
  }
}

// GPS定位（备用方案）
const locateByGps = () => {
  return new Promise((resolve) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => resolve({ lng: res.longitude, lat: res.latitude }),
      fail: () => resolve(null),
    })
  })
}

// 主入口：先用收货地址，失败再用GPS（对应电脑端 locateByAddress + GPS fallback）
const locateAndSearch = async () => {
  loading.value = false
  locateStatus.value = '定位中...'

  // 方案1：用收货地址地理编码（不需要GPS权限）
  const addrLoc = await locateByAddress()
  if (addrLoc) {
    locateStatus.value = '搜索附近宠物店...'
    shops.value = await searchNearbyPetShops(addrLoc.lng, addrLoc.lat)
    hasLocation.value = true
    locateStatus.value = ''
    return
  }

  // 方案2：用GPS定位（需要定位权限）
  locateStatus.value = '正在GPS定位...'
  const gpsLoc = await locateByGps()
  if (gpsLoc) {
    locateStatus.value = '搜索附近宠物店...'
    shops.value = await searchNearbyPetShops(gpsLoc.lng, gpsLoc.lat)
    hasLocation.value = true
    locateStatus.value = ''
    return
  }

  locateStatus.value = ''
  uni.showToast({ title: '定位失败，请先设置收货地址', icon: 'none', duration: 3000 })
}

const goDetail = (id) => {
  if (typeof id === 'string' && id.startsWith('poi_')) return
  uni.navigateTo({ url: `/pages/shop/detail?id=${id}` })
}

const navigateTo = (shop) => {
  if (shop.lng && shop.lat) {
    const url = `https://uri.amap.com/navigation?to=${shop.lng},${shop.lat},${encodeURIComponent(shop.name)}&mode=car&policy=1&src=petstore`
    if (typeof plus !== 'undefined') {
      plus.runtime.openURL(url)
    } else {
      window.open(url, '_blank')
    }
  }
}

onShow(() => {
  locateAndSearch()
})
</script>

<style scoped>
.container { background: #f8f9fa; min-height: 100vh; }
.locate-bar { background: #eef2ff; padding: 16rpx 24rpx; text-align: center; }
.locate-bar-text { font-size: 24rpx; color: #1c49c2; }
.search-bar { padding: 20rpx 24rpx; background: #fff; }
.search-wrap { display: flex; align-items: center; background: #f5f5f5; border-radius: 32rpx; padding: 0 24rpx; height: 72rpx; }
.search-icon { font-size: 28rpx; margin-right: 12rpx; }
.search-input { flex: 1; font-size: 28rpx; height: 72rpx; line-height: 72rpx; }
.shop-list { height: calc(100vh - 112rpx); padding: 20rpx 24rpx; }
.shop-count { margin-bottom: 16rpx; }
.shop-count-text { font-size: 24rpx; color: #999; }
.shop-count-hint { font-size: 22rpx; color: #1c49c2; margin-left: 8rpx; }
.shop-card { background: #fff; border-radius: 24rpx; margin-bottom: 20rpx; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.card-body { display: flex; padding: 24rpx; }
.card-left { margin-right: 20rpx; flex-shrink: 0; }
.shop-img { width: 120rpx; height: 120rpx; border-radius: 16rpx; }
.shop-avatar { width: 120rpx; height: 120rpx; background: #f0f4ff; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; }
.avatar-text { font-size: 40rpx; font-weight: bold; color: #1c49c2; }
.card-right { flex: 1; display: flex; flex-direction: column; gap: 6rpx; min-width: 0; }
.shop-header { display: flex; align-items: center; gap: 12rpx; width: 100%; }
.shop-name { font-size: 30rpx; font-weight: 700; color: #121212; }
.status-badge { padding: 2rpx 12rpx; border-radius: 6rpx; flex-shrink: 0; }
.status-badge--open { background: #e6f7ee; }
.status-badge--closed { background: #fde8ee; }
.status-badge-text { font-size: 20rpx; }
.status-badge--open .status-badge-text { color: #00a651; }
.status-badge--closed .status-badge-text { color: #bd2848; }
.distance-badge { font-size: 22rpx; color: #1c49c2; background: #eef2ff; padding: 2rpx 12rpx; border-radius: 6rpx; margin-left: auto; }
.shop-rating-row { display: flex; align-items: center; gap: 4rpx; }
.stars { color: #ffc107; font-size: 22rpx; }
.shop-rating { font-size: 24rpx; color: #ff6c10; font-weight: 500; }
.review-count { font-size: 22rpx; color: #999; }
.shop-phone { font-size: 24rpx; color: #666; }
.shop-address { font-size: 24rpx; color: #4d4d4d; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.shop-hours { font-size: 22rpx; color: #999; }
.card-footer { border-top: 1rpx solid #f0f0f0; padding: 16rpx 24rpx; display: flex; justify-content: flex-end; }
.detail-btn { background: #ff6c10; border-radius: 12rpx; padding: 0 32rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; }
.detail-btn-text { color: #fff; font-size: 24rpx; }
.nav-btn { background: #1c49c2; border-radius: 12rpx; padding: 0 32rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; }
.nav-btn-text { color: #fff; font-size: 24rpx; }
.empty { display: flex; flex-direction: column; align-items: center; padding: 200rpx 0; }
.empty-text { font-size: 30rpx; color: #666; margin-bottom: 12rpx; }
.empty-hint { font-size: 24rpx; color: #999; }
</style>
