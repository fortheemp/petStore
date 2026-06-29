<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById, getRelatedProducts } from '@/api/product'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const product = ref(null)
const loading = ref(true)
const activeImageIndex = ref(0)
const selectedSpec = ref(null)
const quantity = ref(1)
const activeTab = ref('detail')
const relatedProducts = ref([])
const isFavorited = ref(false)
const FAVORITES_KEY = 'petstore_favorites'
const showVideo = ref(false)
const productVideoRef = ref(null)

const toggleVideo = () => {
  showVideo.value = !showVideo.value
  if (!showVideo.value && productVideoRef.value) {
    productVideoRef.value.pause()
  }
}

const toggleFavorite = () => {
  const ids = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  const pid = product.value?.id
  if (!pid) return
  if (isFavorited.value) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids.filter((id) => id !== pid)))
    isFavorited.value = false
    ElMessage.success('已取消收藏')
  } else {
    ids.push(pid)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
    isFavorited.value = true
    ElMessage.success('已收藏')
  }
}

const tabs = [
  { key: 'detail', label: '商品详情' },
  { key: 'specs', label: '规格参数' },
  { key: 'reviews', label: '用户评价' },
]

const categoryLabels = { dogs: '狗狗用品', cats: '猫咪用品', fish: '水族用品', birds: '鸟类用品', small: '小宠用品' }

const fetchProduct = async () => {
  loading.value = true
  activeImageIndex.value = 0
  try {
    const data = await getProductById(route.params.id)
    if (!data) { router.replace('/products'); return }
    product.value = data
    if (data.specs?.length) {
      const firstAvailable = data.specs[0].options.find((o) => o.available)
      if (firstAvailable) selectedSpec.value = firstAvailable
    }
    if (data.relatedIds?.length) {
      relatedProducts.value = await getRelatedProducts(data.relatedIds)
    }
    const ids = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    isFavorited.value = ids.includes(data.id)
  } finally {
    loading.value = false
  }
}

const isSoldOut = computed(() => product.value?.stock === 0)

const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }
const increaseQty = () => { if (quantity.value < product.value?.stock) quantity.value++ }

const handleAddToCart = () => {
  if (!selectedSpec.value) { ElMessage.warning('请选择规格'); return }
  cart.addToCart(product.value, quantity.value, selectedSpec.value)
  ElMessage.success('已加入购物车')
}

const handleBuyNow = () => {
  if (!selectedSpec.value) { ElMessage.warning('请选择规格'); return }
  cart.addToCart(product.value, quantity.value, selectedSpec.value)
  router.push('/cart')
}

const renderStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return { full, half, empty: 5 - full - half }
}

const formatPrice = (p) => Number(p).toFixed(2)

watch(() => route.params.id, fetchProduct)
onMounted(fetchProduct)
</script>

<template>
  <div class="detail-page">
    <!-- 骨架屏 -->
    <div v-if="loading" class="container detail-loading">
      <div class="skeleton-main">
        <div class="skeleton-gallery">
          <div class="skeleton-pulse"></div>
        </div>
        <div class="skeleton-info">
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--short"></div>
          <div class="skeleton-line skeleton-line--price"></div>
          <div class="skeleton-line skeleton-line--text"></div>
          <div class="skeleton-line skeleton-line--text"></div>
          <div class="skeleton-line skeleton-line--btn"></div>
        </div>
      </div>
    </div>

    <template v-else-if="product">
      <!-- 面包屑 -->
      <div class="breadcrumb-bar">
        <div class="container">
          <nav class="breadcrumb">
            <router-link to="/" class="breadcrumb__link">首页</router-link>
            <span class="breadcrumb__sep">/</span>
            <router-link :to="{ path: '/products', query: { category: product.category } }" class="breadcrumb__link">
              {{ categoryLabels[product.category] || '全部商品' }}
            </router-link>
            <span class="breadcrumb__sep">/</span>
            <span class="breadcrumb__current">{{ product.name }}</span>
          </nav>
        </div>
      </div>

      <!-- 主体区域 -->
      <div class="product-main">
        <div class="container product-main__inner">
          <!-- 左侧：图片 -->
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img
                v-if="product.images.length && product.images[activeImageIndex]"
                :src="product.images[activeImageIndex]"
                :alt="product.name"
                class="product-gallery__img"
              />
              <div v-else class="product-gallery__empty">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect width="120" height="120" rx="16" fill="#f0f4ff"/>
                  <g transform="translate(30, 24)" stroke="#1c49c2" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.5">
                    <path d="M20 10.344C20 7.564 16.846 5.358 13 6c-5.646.94-8.226 12.012-8 14 .274 2.434 3 4 5 4s4-1 6-3c1-1 2-2 3-3"/>
                    <path d="M28.534 10.344c0-2.78 3.154-4.986 7-4.344 5.646.94 8.226 12.012 8 14-.274 2.434-3 4-5 4s-4-1-6-3c-1-1-2-2-3-3"/>
                    <path d="M16 28v1M24 28v1"/>
                    <path d="M22.5 32.5h3L24 34l-.75-.75"/>
                    <path d="M8.84 22.494A26.304 26.304 0 0 0 8 29.112C8 37.456 15.164 42 24 42s16-4.544 16-12.888a26.304 26.304 0 0 0-.84-6.618"/>
                  </g>
                </svg>
                <span class="product-gallery__empty-text">暂无图片</span>
              </div>
              <!-- 视频播放按钮 -->
              <button
                v-if="product.videoUrl && !showVideo"
                class="product-gallery__video-btn"
                @click="toggleVideo"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.92)" stroke="none"/>
                  <polygon points="10 8 16 12 10 16" fill="#333" stroke="none"/>
                </svg>
                <span class="product-gallery__video-label">播放视频</span>
              </button>
              <!-- 视频播放器覆盖层 -->
              <div v-if="showVideo && product.videoUrl" class="product-gallery__video-overlay">
                <div class="product-gallery__video-header">
                  <span>商品视频</span>
                  <button class="product-gallery__video-close" @click="toggleVideo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <video
                  ref="productVideoRef"
                  :src="product.videoUrl"
                  controls
                  autoplay
                  class="product-gallery__video-player"
                ></video>
              </div>
            </div>
            <!-- 缩略图 -->
            <div v-if="product.images.length > 1" class="product-gallery__thumbs">
              <button
                v-for="(img, idx) in product.images"
                :key="idx"
                class="gallery-thumb"
                :class="{ 'gallery-thumb--active': activeImageIndex === idx }"
                @click="activeImageIndex = idx"
              >
                <img :src="img" :alt="`${product.name} ${idx + 1}`" />
              </button>
            </div>
          </div>

          <!-- 右侧：商品信息 -->
          <div class="product-info">
            <div class="product-info__title-row">
              <h1 class="product-info__title">{{ product.name }}</h1>
              <span v-if="product.productType === 'pet'" class="pet-badge">活体宠物</span>
              <button class="favorite-btn" :class="{ 'favorite-btn--active': isFavorited }" @click="toggleFavorite">
                <svg width="22" height="22" viewBox="0 0 24 24" :fill="isFavorited ? '#e74c3c' : 'none'" :stroke="isFavorited ? '#e74c3c' : '#999'" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <!-- 评分 -->
            <div class="product-info__rating">
              <span class="stars-row">
                <svg v-for="i in renderStars(product.rating).full" :key="'f'+i" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg v-if="renderStars(product.rating).half" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="1"><defs><linearGradient id="half"><stop offset="50%" stop-color="#ffc107"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)"/></svg>
                <svg v-for="i in renderStars(product.rating).empty" :key="'e'+i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <span class="rating-score">{{ product.rating?.toFixed(1) }}</span>
              <span class="review-count">{{ product.reviewCount }} 条评价</span>
            </div>

            <!-- 价格 -->
            <div class="product-info__price">
              <span class="price-current">
                <span class="price-symbol">¥</span>{{ formatPrice(product.price) }}
              </span>
            </div>

            <!-- 配送 -->
            <div class="product-info__meta-row">
              <span class="meta-label">配送</span>
              <span class="meta-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00a651" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                次日达，满 199 元包邮
              </span>
            </div>

            <!-- 店铺 -->
            <div class="product-info__meta-row">
              <span class="meta-label">店铺</span>
              <router-link
                v-if="product.shopName"
                :to="{ path: '/products', query: { shopId: String(product.shopId) } }"
                class="meta-link"
              >
                {{ product.shopName }}
              </router-link>
              <span v-else class="meta-value">-</span>
            </div>

            <!-- 规格 -->
            <div v-if="product.specs?.length" class="product-info__specs">
              <div v-for="spec in product.specs" :key="spec.id" class="spec-group">
                <span class="spec-label">{{ spec.name }}</span>
                <div class="spec-options">
                  <button
                    v-for="opt in spec.options"
                    :key="opt.id"
                    class="spec-btn"
                    :class="{ 'spec-btn--active': selectedSpec?.id === opt.id }"
                    @click="selectedSpec = opt"
                  >
                    {{ opt.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 数量 -->
            <div v-if="product.productType === 'pet'" class="pet-only-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c49c2" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              活体宠物仅此一件，售出即止
            </div>
            <div v-else class="product-info__quantity">
              <span class="meta-label">数量</span>
              <div class="qty-selector">
                <button class="qty-btn" :disabled="quantity <= 1" @click="decreaseQty">-</button>
                <span class="qty-value">{{ quantity }}</span>
                <button class="qty-btn" :disabled="quantity >= product.stock" @click="increaseQty">+</button>
              </div>
              <span v-if="isSoldOut" class="stock-text stock-text--soldout">已售罄</span>
              <span v-else class="stock-text">库存 {{ product.stock }} 件</span>
            </div>

            <!-- 操作按钮 -->
            <div class="product-info__actions">
              <button class="action-btn action-btn--cart" :disabled="isSoldOut" @click="handleAddToCart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {{ isSoldOut ? '已售罄' : '加入购物车' }}
              </button>
              <button class="action-btn action-btn--buy" :disabled="isSoldOut" @click="handleBuyNow">{{ isSoldOut ? '已售罄' : '立即购买' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="tabs-section">
        <div class="container">
          <div class="tabs-card">
            <div class="tabs-nav">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                class="tabs-nav__item"
                :class="{ 'tabs-nav__item--active': activeTab === tab.key }"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span v-if="tab.key === 'reviews'" class="tabs-nav__count">({{ product.reviewCount }})</span>
              </button>
            </div>

            <div class="tabs-body">
              <div v-if="activeTab === 'detail'" class="tab-content" v-html="product.description"></div>

              <div v-if="activeTab === 'specs'" class="tab-content">
                <table class="specs-table">
                  <tr v-for="row in product.specsTable" :key="row.label">
                    <th>{{ row.label }}</th>
                    <td>{{ row.value }}</td>
                  </tr>
                </table>
              </div>

              <div v-if="activeTab === 'reviews'" class="tab-content">
                <div v-if="!product.reviews?.length" class="empty-reviews">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
                  <p>暂无评价</p>
                  <router-link to="/user/orders" class="review-link">去评价</router-link>
                </div>
                <div v-for="review in product.reviews" :key="review.id" class="review-item">
                  <div class="review-item__header">
                    <img v-if="review.avatar" :src="review.avatar" class="review-item__avatar review-item__avatar--img" />
                    <span v-else class="review-item__avatar">{{ (review.username || '').charAt(0) }}</span>
                    <span class="review-item__user">{{ review.username }}</span>
                    <span class="review-item__stars">
                      <svg v-for="i in review.rating" :key="i" width="14" height="14" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </span>
                    <span class="review-item__date">{{ formatDate(review.createdAt) }}</span>
                  </div>
                  <p class="review-item__content">{{ review.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关商品 -->
      <div v-if="relatedProducts.length" class="related-section">
        <div class="container">
          <h2 class="section-heading">相关商品推荐</h2>
          <div class="related-grid">
            <router-link
              v-for="item in relatedProducts"
              :key="item.id"
              :to="`/products/${item.id}`"
              class="related-card"
            >
              <div class="related-card__img">
                <img v-if="item.image" :src="item.image" :alt="item.name" />
                <div v-else class="related-card__placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
              </div>
              <div class="related-card__body">
                <h3 class="related-card__name">{{ item.name }}</h3>
                <span class="related-card__price">¥{{ formatPrice(item.price) }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page {
  background: #f5f7fa;
  min-height: calc(100vh - 15.2rem);
}

/* ========== 面包屑 ========== */
.breadcrumb-bar {
  background: transparent;
  padding: 2rem 0 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
}

.breadcrumb__link {
  color: #666;
  text-decoration: none;
}
.breadcrumb__link:hover { color: var(--color-brand-blue); }
.breadcrumb__sep { color: #ccc; }
.breadcrumb__current { color: #333; font-weight: 500; }

/* ========== 主体布局 ========== */
.product-main {
  padding: 3.2rem 0;
}

.product-main__inner {
  display: grid;
  grid-template-columns: 45fr 55fr;
  gap: 4.8rem;
  background: #fff;
  border-radius: 2rem;
  padding: 4rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

/* ========== 图片画廊 ========== */
.product-gallery {
  position: sticky;
  top: 8rem;
  align-self: start;
}

.product-gallery__main {
  width: 100%;
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e8edf5 0%, #d5dce8 100%);
  border-radius: 1.6rem;
  overflow: hidden;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.product-gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-gallery__main:hover .product-gallery__img {
  transform: scale(1.05);
}

.product-gallery__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.product-gallery__empty-text {
  font-size: 1.4rem;
  color: #bbb;
}

.product-gallery__video-btn {
  position: absolute;
  bottom: 1.6rem;
  left: 1.6rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  padding: 0.8rem 1.4rem;
  cursor: pointer;
  transition: background 0.2s;
}

.product-gallery__video-btn:hover {
  background: rgba(0, 0, 0, 0.75);
}

.product-gallery__video-label {
  font-size: 1.3rem;
  font-weight: 500;
}

.product-gallery__video-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  border-radius: 1.2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.product-gallery__video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.4rem;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.4);
}

.product-gallery__video-close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.product-gallery__video-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

.product-gallery__video-player {
  width: 100%;
  flex: 1;
  object-fit: contain;
  background: #000;
}

.product-gallery__thumbs {
  display: flex;
  gap: 1rem;
}

.gallery-thumb {
  width: 7.2rem;
  height: 7.2rem;
  border: 2px solid transparent;
  border-radius: 0.8rem;
  overflow: hidden;
  background: #f8f9fa;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s;
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-thumb:hover { border-color: #ccc; }
.gallery-thumb--active { border-color: var(--color-brand-blue); }

/* ========== 商品信息 ========== */
.product-info__title-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
}

.product-info__title {
  font-size: 2.6rem;
  font-weight: 700;
  color: #121212;
  line-height: 1.4;
  margin: 0;
}

.pet-badge {
  flex-shrink: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-brand-blue);
  padding: 0.4rem 1rem;
  border-radius: 0.4rem;
}

.favorite-btn {
  margin-left: auto;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
}
.favorite-btn:hover { background: #ffeaea; transform: scale(1.1); }
.favorite-btn--active { background: #ffeaea; }
.favorite-btn--active:hover { background: #fdd; }

/* 评分 */
.product-info__rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.stars-row {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rating-score {
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
}

.review-count {
  font-size: 1.4rem;
  color: #999;
  cursor: pointer;
}
.review-count:hover { color: var(--color-brand-blue); }

/* 价格 */
.product-info__price {
  background: linear-gradient(135deg, #fef5f5 0%, #fde8e8 100%);
  padding: 2.4rem;
  border-radius: 1.2rem;
  margin-bottom: 2.4rem;
  border: 1px solid #fce4e4;
}

.price-current {
  font-size: 3.6rem;
  font-weight: 700;
  color: var(--color-price-primary);
}

.price-symbol {
  font-size: 2rem;
}

/* 元信息行 */
.product-info__meta-row {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.2rem 0;
  font-size: 1.4rem;
}

.meta-label {
  color: #999;
  width: 4.8rem;
  flex-shrink: 0;
}

.meta-value {
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.meta-link {
  color: var(--color-brand-blue);
  text-decoration: none;
  font-weight: 500;
}
.meta-link:hover { text-decoration: underline; }

/* 规格 */
.product-info__specs {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.spec-group { margin-bottom: 1.6rem; }
.spec-label { font-size: 1.4rem; color: #666; margin-bottom: 1rem; display: block; }
.spec-options { display: flex; flex-wrap: wrap; gap: 1rem; }

.spec-btn {
  padding: 0.8rem 2.4rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.spec-btn:hover {
  border-color: var(--color-brand-blue);
  background: #f8fbff;
}
.spec-btn--active {
  border-color: var(--color-brand-blue);
  background: var(--color-brand-blue);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(28, 73, 194, 0.2);
}

/* 数量 */
.product-info__quantity {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin: 2rem 0;
}

.qty-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 0.8rem;
  overflow: hidden;
}

.qty-btn {
  width: 4rem;
  height: 4rem;
  background: #fafafa;
  border: none;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
}
.qty-btn:hover:not(:disabled) { background: #f0f0f0; }
.qty-btn:disabled { color: #ccc; cursor: not-allowed; }

.qty-value {
  width: 5.6rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 600;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

.stock-text { font-size: 1.3rem; color: #999; }
.stock-text--soldout { color: #e74c3c; font-weight: 600; }

/* 活体宠物提示 */
.pet-only-notice {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.4rem 1.6rem;
  background: #f0f4ff;
  border-radius: 0.8rem;
  color: var(--color-brand-blue);
  font-size: 1.4rem;
  font-weight: 500;
  margin: 2rem 0;
}

/* 操作按钮 */
.product-info__actions {
  display: flex;
  gap: 1.6rem;
  margin-top: 2.4rem;
}

.action-btn {
  flex: 1;
  padding: 1.6rem;
  border: none;
  border-radius: 1.2rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.action-btn--cart {
  background: linear-gradient(135deg, #ff8c1a 0%, #ff6c10 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(255, 108, 16, 0.3);
}
.action-btn--cart:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 108, 16, 0.4); }
.action-btn--cart:active { transform: scale(0.98) translateY(0); }
.action-btn--cart:disabled { background: #ccc; box-shadow: none; cursor: not-allowed; transform: none; }

.action-btn--buy {
  background: linear-gradient(135deg, #c2185b 0%, #a02040 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(160, 32, 64, 0.3);
}
.action-btn--buy:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(160, 32, 64, 0.4); }
.action-btn--buy:active { transform: scale(0.98) translateY(0); }
.action-btn--buy:disabled { background: #ccc; box-shadow: none; cursor: not-allowed; transform: none; }

/* ========== 标签页 ========== */
.tabs-section {
  padding: 0 0 4.8rem;
}

.tabs-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.tabs-nav {
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  padding: 0 3.2rem;
}

.tabs-nav__item {
  padding: 2rem 3.2rem;
  font-size: 1.6rem;
  color: #999;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}
.tabs-nav__item:hover { color: var(--color-brand-blue); }
.tabs-nav__item--active {
  color: var(--color-brand-blue);
  font-weight: 700;
  border-bottom-color: var(--color-brand-blue);
}
.tabs-nav__count { font-size: 1.3rem; color: #999; margin-left: 0.4rem; }

.tabs-body {
  padding: 3.2rem;
  min-height: 24rem;
}

/* 详情内容 */
.tab-content :deep(h3) {
  font-size: 1.8rem;
  font-weight: 600;
  color: #121212;
  margin: 2.4rem 0 1.2rem;
}
.tab-content :deep(h3:first-child) { margin-top: 0; }
.tab-content :deep(p) { font-size: 1.5rem; color: #333; line-height: 1.8; margin-bottom: 1.2rem; }

/* 规格参数表 */
.specs-table { width: 100%; border-collapse: collapse; }
.specs-table th, .specs-table td {
  padding: 1.4rem 2rem;
  font-size: 1.4rem;
  border-bottom: 1px solid #f5f5f5;
  text-align: left;
}
.specs-table th {
  width: 12rem;
  color: #999;
  font-weight: 500;
  background: #fafafa;
}
.specs-table td { color: #333; }

/* 空评价 */
.empty-reviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 4rem 0;
  color: #bbb;
}
.empty-reviews p { font-size: 1.5rem; }
.review-link {
  display: inline-block;
  padding: 0.8rem 2.4rem;
  background: var(--color-brand-orange);
  color: #fff;
  border-radius: 0.8rem;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 600;
}
.review-link:hover { background: var(--color-brand-orange-hover); }

/* 评价项 */
.review-item {
  padding: 2rem 0;
  border-bottom: 1px solid #f5f5f5;
}
.review-item:last-child { border-bottom: none; }
.review-item__header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.8rem;
}
.review-item__avatar {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: var(--color-brand-blue);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  flex-shrink: 0;
}
.review-item__avatar--img {
  object-fit: cover;
  background: #eee;
}
.review-item__user { font-size: 1.4rem; font-weight: 600; color: #333; }
.review-item__stars { display: flex; gap: 2px; }
.review-item__date { font-size: 1.3rem; color: #999; margin-left: auto; }
.review-item__content { font-size: 1.4rem; color: #555; line-height: 1.6; }

/* ========== 相关商品 ========== */
.related-section {
  padding-bottom: 6.4rem;
}

.section-heading {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2.4rem;
  padding-left: 1.6rem;
  border-left: 4px solid var(--color-brand-blue);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.4rem;
}

.related-card {
  display: block;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}
.related-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.related-card__img {
  width: 100%;
  aspect-ratio: 1;
  background: #f8f8f8;
  overflow: hidden;
}
.related-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.related-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-card__body {
  padding: 1.6rem;
}

.related-card__name {
  font-size: 1.4rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-card__price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-price-primary);
}

/* ========== 骨架屏 ========== */
.detail-loading { padding: 3.2rem 0; }

.skeleton-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4.8rem;
  background: #fff;
  border-radius: 1.6rem;
  padding: 3.2rem;
}

.skeleton-gallery {
  aspect-ratio: 1;
  background: #f0f0f0;
  border-radius: 1.2rem;
  overflow: hidden;
  position: relative;
}

.skeleton-pulse {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
  animation: shimmer 1.5s infinite;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1rem;
}

.skeleton-line {
  background: #f0f0f0;
  border-radius: 0.6rem;
  position: relative;
  overflow: hidden;
}

.skeleton-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
  animation: shimmer 1.5s infinite;
}

.skeleton-line--title { height: 3rem; width: 80%; }
.skeleton-line--short { height: 2rem; width: 40%; }
.skeleton-line--price { height: 4.8rem; width: 45%; border-radius: 1.2rem; }
.skeleton-line--text { height: 1.6rem; width: 90%; }
.skeleton-line--btn { height: 5.6rem; width: 100%; border-radius: 1.2rem; }

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .product-main__inner {
    grid-template-columns: 1fr;
    gap: 2.4rem;
    padding: 2.4rem;
  }
  .product-gallery { position: static; }
  .skeleton-main { grid-template-columns: 1fr; }
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 576px) {
  .product-main__inner { padding: 2rem; border-radius: 1.2rem; }
  .product-info__title { font-size: 2rem; }
  .price-current { font-size: 2.8rem; }
  .action-btn { font-size: 1.4rem; padding: 1.4rem; }
  .tabs-nav { padding: 0 1.6rem; }
  .tabs-nav__item { padding: 1.4rem 2rem; font-size: 1.4rem; }
  .tabs-body { padding: 2rem; }
  .related-grid { grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
}
</style>
