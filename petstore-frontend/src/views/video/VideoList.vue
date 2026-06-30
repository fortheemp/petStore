<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { getVideoList, formatCount } from '@/api/video'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()

const videos = ref([])
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
    videos.value = await getVideoList(activeCategory.value)
  } finally {
    loading.value = false
  }
}

const handleCategoryChange = (cat) => {
  activeCategory.value = cat
  fetchVideos()
}

// Player
const showPlayer = ref(false)
const currentVideo = ref(null)
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
  if (playerVideoRef.value) {
    playerVideoRef.value.pause()
  }
  showPlayer.value = false
  currentVideo.value = null
  isPlaying.value = false
  currentTime.value = 0
  totalTime.value = 0
}

// 播放器真实视频 ref
const playerVideoRef = ref(null)

const onLoadedMetadata = () => {
  if (playerVideoRef.value) {
    totalTime.value = Math.floor(playerVideoRef.value.duration)
  }
}

const togglePlay = () => {
  if (!playerVideoRef.value) return
  if (isPlaying.value) {
    playerVideoRef.value.pause()
  } else {
    playerVideoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const onTimeUpdate = () => {
  if (playerVideoRef.value) {
    currentTime.value = Math.floor(playerVideoRef.value.currentTime)
  }
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const progressPercent = ref(0)
const seekVideo = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const pct = (e.clientX - rect.left) / rect.width
  progressPercent.value = Math.max(0, Math.min(100, pct * 100))
  if (playerVideoRef.value) {
    playerVideoRef.value.currentTime = pct * totalTime.value
  }
}

// Related product
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

// Mock video cover — 每个视频用不同的渐变主题
const coverThemes = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🐱' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🐕' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '🐾' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '🎾' },
]

onMounted(() => {
  fetchVideos()
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
          v-for="(video, idx) in videos"
          :key="video.id"
          class="video-card"
          @click="handlePlayVideo(video)"
        >
          <div
            v-if="video.cover"
            class="video-card__cover video-card__cover--image"
          >
            <img :src="video.cover" :alt="video.title" class="video-card__cover-img" />
            <div class="video-card__cover-overlay">
              <div class="video-card__play-btn">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.9)" stroke="none"/>
                  <polygon points="10 8 16 12 10 16" fill="#333" stroke="none"/>
                </svg>
              </div>
            </div>
          </div>
          <div
            v-else-if="video.url"
            class="video-card__cover video-card__cover--video"
          >
            <video
              :src="video.url"
              preload="metadata"
              muted
              class="video-card__video-thumb"
            ></video>
            <div class="video-card__cover-overlay">
              <div class="video-card__play-btn">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.9)" stroke="none"/>
                  <polygon points="10 8 16 12 10 16" fill="#333" stroke="none"/>
                </svg>
              </div>
            </div>
          </div>
          <div
            v-else
            class="video-card__cover"
            :style="{ background: coverThemes[idx % coverThemes.length].bg }"
          >
            <div class="video-card__cover-icon">{{ coverThemes[idx % coverThemes.length].icon }}</div>
            <div class="video-card__cover-overlay">
              <div class="video-card__play-btn">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.9)" stroke="none"/>
                  <polygon points="10 8 16 12 10 16" fill="#333" stroke="none"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="video-card__info">
            <h3 class="video-card__title">{{ video.title }}</h3>
            <div class="video-card__meta">
              <span class="video-card__author">{{ video.author }}</span>
            </div>
            <div v-if="video.relatedProduct" class="video-card__related">
              <span class="label">相关商品：</span>
              <span class="product-name">{{ video.relatedProduct.name }}</span>
              <span class="product-price">¥{{ video.relatedProduct.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Player Modal -->
    <div v-if="showPlayer" class="video-player">
      <div class="video-player__overlay" @click="handleClosePlayer"></div>
      <div class="video-player__modal">
        <div class="video-player__header">
          <span class="video-player__title">{{ currentVideo?.title }}</span>
          <button class="video-player__close" @click="handleClosePlayer">X</button>
        </div>

        <div class="video-player__content">
          <div v-if="currentVideo?.url" class="video-player__real-screen" @click="togglePlay">
            <video
              ref="playerVideoRef"
              :src="currentVideo.url"
              preload="metadata"
              class="video-player__video"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
              @ended="isPlaying = false"
            ></video>
          </div>
          <div v-else class="video-player__mock-screen" @click="togglePlay">
            <svg v-if="!isPlaying" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.3)" stroke="white"/>
              <polygon points="10 8 16 12 10 16" fill="white" stroke="none"/>
            </svg>
            <div v-else class="video-player__pause-hint">点击暂停</div>
          </div>
          <div class="video-player__controls">
            <button class="play-btn" @click.stop="togglePlay">
              <svg v-if="!isPlaying" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>
            <div class="progress-bar" @click="seekVideo">
              <div class="progress-bar__fill" :style="{ width: (totalTime ? (currentTime / totalTime) * 100 : 0) + '%' }"></div>
            </div>
            <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(totalTime) }}</span>
          </div>
        </div>

        <div class="video-player__info">
          <div class="video-player__meta">
            <span>发布于 {{ currentVideo?.createTime }}</span>
          </div>
          <p class="video-player__desc">{{ currentVideo?.description }}</p>
          <div class="video-player__tags">
            <span v-for="tag in currentVideo?.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>

        <div v-if="currentVideo?.relatedProduct" class="video-player__related">
          <h4>相关商品</h4>
          <div class="related-product">
            <div class="related-product__placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </div>
            <div class="related-product__info">
              <span class="related-product__name">{{ currentVideo.relatedProduct.name }}</span>
              <span class="related-product__price">¥{{ currentVideo.relatedProduct.price }}</span>
            </div>
            <div class="related-product__actions">
              <button class="btn-view" @click="handleViewProduct(currentVideo.relatedProduct.id)">查看详情</button>
              <button class="btn-add" @click="handleAddToCart(currentVideo.relatedProduct)">加入购物车</button>
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
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.video-card__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}

.video-card__cover-icon {
  font-size: 48px;
  opacity: 0.25;
  transition: all 0.3s ease;
}

.video-card__cover--video {
  background: #000;
  padding: 0;
}

.video-card__video-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-card__cover--image {
  padding: 0;
}

.video-card__cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-card:hover .video-card__cover-icon {
  opacity: 0.4;
  transform: scale(1.2);
}

.video-card__cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease;
}

.video-card:hover .video-card__cover-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.video-card__play-btn {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.video-card:hover .video-card__play-btn {
  opacity: 1;
  transform: scale(1);
}

.video-card__duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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
  margin-bottom: 12px;
}

.video-card__related {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
}

.video-card__related .label {
  color: #999;
}

.video-card__related .product-name {
  color: #333;
  margin-right: 6px;
}

.video-card__related .product-price {
  color: #bd2848;
  font-weight: 600;
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

.video-player__real-screen {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 480px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.video-player__video {
  width: 100%;
  height: 100%;
  max-height: 480px;
  object-fit: contain;
  display: block;
}

.video-player__mock-screen {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.video-player__pause-hint {
  font-size: 14px;
  opacity: 0.6;
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

.video-player__desc {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.video-player__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: #f8f9fa;
  border-radius: 16px;
  font-size: 13px;
  color: #1c49c2;
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
