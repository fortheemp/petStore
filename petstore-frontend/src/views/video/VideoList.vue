<script setup>
import { ref, onMounted } from 'vue'
import { getVideoList, formatCount } from '@/api/video'
import { get as apiGet } from '@/api'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()

const videos = ref([])
const products = ref([])
const loading = ref(true)
const activeCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '狗狗', value: 'dogs' },
  { label: '猫咪', value: 'cats' },
  { label: '训练', value: 'training' },
  { label: '趣味', value: 'funny' },
]

const fetchVideos = async () => {
  loading.value = true
  try {
    const res = await getVideoList()
    if (res && res.data && res.data.code === 200) {
      videos.value = res.data.data || []
    } else {
      videos.value = []
    }
  } catch (e) {
    console.error('获取视频列表失败:', e)
    videos.value = []
  } finally {
    loading.value = false
  }
}

// 加载所有商品，用于根据 productId 查找商品信息
const fetchProducts = async () => {
  try {
    const res = await apiGet('/products', { page: 1, size: 200 })
    if (res.data && res.data.code === 200) {
      products.value = res.data.data || []
    }
  } catch (e) {
    console.error('获取商品列表失败:', e)
  }
}

const getProductName = (productId) => {
  if (!productId) return ''
  const p = products.value.find((p) => p.id === productId)
  return p ? p.name : ''
}

const getProduct = (productId) => {
  if (!productId) return null
  return products.value.find((p) => p.id === productId) || null
}

const handleCategoryChange = (cat) => {
  activeCategory.value = cat
  fetchVideos()
}

// ===== 播放器 =====
const showPlayer = ref(false)
const currentVideo = ref(null)
const videoRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const totalTime = ref(0)

const handlePlayVideo = (video) => {
  currentVideo.value = video
  currentTime.value = 0
  totalTime.value = 0
  isPlaying.value = false
  showPlayer.value = true
}

const handleClosePlayer = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
  showPlayer.value = false
  currentVideo.value = null
  isPlaying.value = false
  currentTime.value = 0
  totalTime.value = 0
}

const togglePlay = () => {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = Math.floor(videoRef.value.currentTime)
  }
}

const onLoadedMetadata = () => {
  if (videoRef.value) {
    totalTime.value = Math.floor(videoRef.value.duration)
  }
}

const onVideoEnded = () => {
  isPlaying.value = false
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const seekVideo = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  if (videoRef.value && totalTime.value) {
    videoRef.value.currentTime = pct * totalTime.value
  }
}

// Related product actions
const handleAddToCart = (product) => {
  cartStore.addToCart(
    { id: product.id, name: product.name, price: product.price, originalPrice: product.price, stock: 50 },
    1,
    { id: 'default', name: '默认', value: '默认规格' },
  )
  ElMessage.success('已加入购物车')
}

const handleViewProduct = (productId) => {
  showPlayer.value = false
  router.push(`/products/${productId}`)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

onMounted(() => {
  fetchVideos()
  fetchProducts()
})
</script>

<template>
  <div class="video-list-page">
    <div class="video-list-page__container">
      <h1 class="video-list-page__title">宠物视频</h1>

      <!-- Categories -->
      <div class="video-list-page__categories">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="category-tab"
          :class="{ 'category-tab--active': activeCategory === cat.value }"
          @click="handleCategoryChange(cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="video-list-page__loading">
        加载中...
      </div>

      <!-- Empty -->
      <div v-else-if="videos.length === 0" class="video-list-page__empty">
        暂无视频
      </div>

      <!-- Video Grid -->
      <div v-else class="video-list-page__grid">
        <div
          v-for="video in videos"
          :key="video.id"
          class="video-card"
          @click="handlePlayVideo(video)"
        >
          <div class="video-card__cover">
            <video
              v-if="video.url"
              :src="video.url"
              preload="metadata"
              class="video-card__thumb"
              muted
            ></video>
            <div v-else class="video-card__cover-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" opacity="0.7"/>
              </svg>
            </div>
            <div class="video-card__cover-overlay">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" opacity="0.7"/>
              </svg>
            </div>
          </div>
          <div class="video-card__info">
            <h3 class="video-card__title">{{ video.title }}</h3>
            <div class="video-card__meta">
              <span v-if="getProductName(video.productId)" class="video-card__product">
                关联商品：{{ getProductName(video.productId) }}
              </span>
              <span v-else class="video-card__product">无关联商品</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Player Modal -->
    <div v-if="showPlayer" class="video-player" @keydown.escape="handleClosePlayer">
      <div class="video-player__overlay" @click="handleClosePlayer"></div>
      <div class="video-player__modal">
        <div class="video-player__header">
          <span class="video-player__title">{{ currentVideo?.title }}</span>
          <button class="video-player__close" @click="handleClosePlayer">✕</button>
        </div>

        <div class="video-player__content">
          <!-- 真实 video 元素 -->
          <video
            v-if="currentVideo?.url"
            ref="videoRef"
            :src="currentVideo.url"
            class="video-player__video"
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata"
            @ended="onVideoEnded"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            controlsList="nodownload"
            playsinline
          ></video>
          <div v-else class="video-player__no-video">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8"/><line x1="12" y1="17" x2="12" y2="21"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p>暂无视频资源</p>
          </div>

          <div class="video-player__controls">
            <button class="play-btn" @click.stop="togglePlay">
              <svg v-if="!isPlaying" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
            <div class="progress-bar" @click="seekVideo">
              <div
                class="progress-bar__fill"
                :style="{ width: (totalTime ? (currentTime / totalTime) * 100 : 0) + '%' }"
              ></div>
            </div>
            <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(totalTime) }}</span>
          </div>
        </div>

        <div class="video-player__info">
          <div class="video-player__meta">
            <span>发布于 {{ formatDate(currentVideo?.createdAt) }}</span>
          </div>
        </div>

        <!-- 关联商品 -->
        <div v-if="currentVideo?.productId && getProduct(currentVideo.productId)" class="video-player__related">
          <h4>相关商品</h4>
          <div class="related-product">
            <div class="related-product__placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <div class="related-product__info">
              <span class="related-product__name">{{ getProduct(currentVideo.productId).name }}</span>
              <span class="related-product__price">¥{{ getProduct(currentVideo.productId).price }}</span>
            </div>
            <div class="related-product__actions">
              <button class="btn-view" @click="handleViewProduct(currentVideo.productId)">查看详情</button>
              <button class="btn-add" @click="handleAddToCart(getProduct(currentVideo.productId))">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-list-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0 64px;
}

.video-list-page__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px;
}

.video-list-page__title {
  font-size: 28px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 24px;
}

.video-list-page__categories {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.category-tab {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  border-color: #1c49c2;
  color: #1c49c2;
}

.category-tab--active {
  background: #1c49c2;
  border-color: #1c49c2;
  color: #fff;
}

.video-list-page__loading,
.video-list-page__empty {
  text-align: center;
  padding: 80px 0;
  color: #999;
  font-size: 16px;
}

.video-list-page__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Video Card */
.video-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.video-card__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #1a1a2e;
  overflow: hidden;
}

.video-card__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.video-card__cover-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  background: #1a1a2e;
}

.video-card__cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
  color: #fff;
}

.video-card:hover .video-card__cover-overlay {
  background: rgba(0, 0, 0, 0.35);
}

.video-card__info {
  padding: 16px;
}

.video-card__title {
  font-size: 15px;
  font-weight: 600;
  color: #121212;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.video-card__product {
  font-size: 12px;
  color: #888;
}

/* Video Player Modal */
.video-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.video-player__modal {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.video-player__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.video-player__title {
  font-size: 16px;
  font-weight: 600;
  color: #121212;
}

.video-player__close {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
}

.video-player__close:hover {
  background: #f5f5f5;
  color: #333;
}

.video-player__content {
  background: #000;
}

.video-player__video {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 480px;
  display: block;
  background: #000;
}

.video-player__no-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #1a1a2e;
  gap: 12px;
}

.video-player__no-video p {
  font-size: 14px;
}

.video-player__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #111;
}

.play-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #333;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-bar:hover {
  height: 6px;
}

.progress-bar__fill {
  height: 100%;
  background: #1c49c2;
  border-radius: 2px;
  transition: width 0.1s;
}

.time-display {
  font-size: 12px;
  color: #999;
  min-width: 90px;
  text-align: right;
}

.video-player__info {
  padding: 20px;
  overflow-y: auto;
}

.video-player__meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.video-player__related {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.video-player__related h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.related-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.related-product__placeholder {
  width: 48px;
  height: 48px;
  background: #e8e8e8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.related-product__info {
  flex: 1;
}

.related-product__name {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.related-product__price {
  font-size: 16px;
  font-weight: 600;
  color: #bd2848;
}

.related-product__actions {
  display: flex;
  gap: 8px;
}

.btn-view {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}

.btn-view:hover {
  border-color: #1c49c2;
  color: #1c49c2;
}

.btn-add {
  padding: 8px 16px;
  background: #ff6c10;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.btn-add:hover {
  background: #e55a00;
}

@media (max-width: 1200px) {
  .video-list-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .video-list-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .video-list-page__container {
    padding: 0 16px;
  }

  .video-list-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>