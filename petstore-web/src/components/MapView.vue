<template>
  <div class="map-wrapper">
    <div
      ref="mapContainer"
      class="map-container"
      :class="{ 'map-loading': loading, 'map-error': error }"
    >
      <div v-if="loading" class="map-overlay">
        <span class="overlay-icon">🗺️</span>
        <span class="overlay-text">地图加载中...</span>
      </div>
      <div v-if="error" class="map-overlay">
        <span class="overlay-icon">⚠️</span>
        <span class="overlay-text">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 高德地图 JS API 密钥
 * 请替换为你自己的高德地图 Key:
 * 前往 https://console.amap.com/dev/key/app 申请 Web端(JS API) Key
 */
const AMAP_KEY = 'YOUR_KEY'

const props = defineProps({
  shops: {
    type: Array,
    default: () => []
  },
  center: {
    type: Array,
    default: () => [116.397428, 39.90923]
  }
})

const router = useRouter()
const mapContainer = ref(null)
const loading = ref(true)
const error = ref('')

let mapInstance = null
let markers = []
let infoWindow = null
let scriptEl = null

onMounted(() => {
  loadAMap()
})

onBeforeUnmount(() => {
  destroyMap()
})

function loadAMap() {
  if (typeof window.AMap !== 'undefined') {
    nextTick(() => initMap())
    return
  }

  window.onAMapLoaded = () => {
    delete window.onAMapLoaded
    nextTick(() => initMap())
  }

  scriptEl = document.createElement('script')
  scriptEl.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&callback=onAMapLoaded`
  scriptEl.onerror = () => {
    loading.value = false
    error.value = '地图加载失败，请检查网络连接或高德地图 API Key 配置'
  }
  document.head.appendChild(scriptEl)
}

function initMap() {
  try {
    mapInstance = new window.AMap.Map(mapContainer.value, {
      center: props.center,
      zoom: 12,
      resizeEnable: true
    })

    infoWindow = new window.AMap.InfoWindow({
      offset: new window.AMap.Pixel(0, -30)
    })

    renderMarkers()
    loading.value = false
  } catch (e) {
    loading.value = false
    error.value = '地图初始化失败: ' + (e.message || '未知错误')
  }
}

function renderMarkers() {
  clearMarkers()

  if (!mapInstance || !props.shops.length) return

  props.shops.forEach((shop) => {
    if (shop.longitude == null || shop.latitude == null) return

    const position = [shop.longitude, shop.latitude]

    const markerContent = document.createElement('div')
    markerContent.className = 'custom-marker'
    markerContent.innerHTML = `
      <div class="marker-dot"></div>
      <div class="marker-label">${escapeHtml(shop.name || '')}</div>
    `

    const marker = new window.AMap.Marker({
      position,
      content: markerContent,
      offset: new window.AMap.Pixel(-10, -40),
      zIndex: 100
    })

    marker.on('click', () => {
      openInfoWindow(shop, position)
    })

    marker.setMap(mapInstance)
    markers.push(marker)
  })
}

function openInfoWindow(shop, position) {
  const content = `
    <div class="info-window-content">
      <img src="${escapeHtml(shop.image || '')}" class="info-window-img" onerror="this.style.display='none'" />
      <div class="info-window-text">
        <div class="info-window-title">${escapeHtml(shop.name || '')}</div>
        <a href="javascript:void(0)" class="info-window-link" data-shop-id="${shop.id}">查看详情 →</a>
      </div>
    </div>
  `

  infoWindow.setContent(content)
  infoWindow.open(mapInstance, position)

  setTimeout(() => {
    const link = document.querySelector(`.info-window-link[data-shop-id="${shop.id}"]`)
    if (link) {
      link.addEventListener('click', () => {
        router.push(`/shop/${shop.id}`)
      })
    }
  }, 100)
}

function clearMarkers() {
  markers.forEach((m) => {
    m.setMap(null)
  })
  markers = []
}

function destroyMap() {
  clearMarkers()
  if (scriptEl) {
    document.head.removeChild(scriptEl)
    scriptEl = null
  }
  mapInstance = null
}

function escapeHtml(str) {
  if (!str) return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

watch(
  () => props.shops,
  () => {
    nextTick(() => renderMarkers())
  },
  { deep: true }
)

watch(
  () => props.center,
  (newCenter) => {
    if (mapInstance && newCenter) {
      mapInstance.setCenter(newCenter)
    }
  }
)
</script>

<style scoped>
.map-wrapper {
  width: 100%;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f7fa;
  position: relative;
}

.map-container.map-loading,
.map-container.map-error {
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #909399;
}

.overlay-icon {
  font-size: 48px;
}

.overlay-text {
  font-size: 15px;
}

/* Custom marker styles injected into AMap DOM */
:deep(.custom-marker) {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

:deep(.marker-dot) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #409eff;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(.marker-label) {
  margin-top: 4px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  font-size: 12px;
  color: #303133;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

/* Info window styles */
:deep(.info-window-content) {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 160px;
}

:deep(.info-window-img) {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

:deep(.info-window-text) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.info-window-title) {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

:deep(.info-window-link) {
  font-size: 12px;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}

:deep(.info-window-link:hover) {
  text-decoration: underline;
}
</style>