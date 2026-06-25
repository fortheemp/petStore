<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById, getRelatedProducts } from '@/api/product'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/common/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const product = ref(null)
const loading = ref(true)
const activeImageIndex = ref(0)
const selectedSpec = ref(null)
const quantity = ref(1)
const activeTab = ref('detail')
const relatedProducts = ref([])

const tabs = [
  { key: 'detail', label: '商品详情' },
  { key: 'specs', label: '规格参数' },
  { key: 'reviews', label: '用户评价' },
]

const fetchProduct = async () => {
  loading.value = true
  try {
    const data = await getProductById(route.params.id)
    if (!data) {
      router.replace('/products')
      return
    }
    product.value = data
    // 默认选中第一个可用规格
    if (data.specs?.length) {
      const firstAvailable = data.specs[0].options.find((o) => o.available)
      if (firstAvailable) selectedSpec.value = firstAvailable
    }
    // 加载相关商品
    if (data.relatedIds?.length) {
      relatedProducts.value = await getRelatedProducts(data.relatedIds)
    }
  } finally {
    loading.value = false
  }
}

// 数量操作
const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }
const increaseQty = () => { if (quantity.value < product.value.stock) quantity.value++ }

// 折扣计算
const discount = (() => {
  if (!product.value?.originalPrice || product.value.originalPrice <= product.value.price) return null
  return Math.round((1 - product.value.price / product.value.originalPrice) * 100)
})

// 加入购物车
const handleAddToCart = () => {
  if (!selectedSpec.value) {
    ElMessage.warning('请选择规格')
    return
  }
  cart.addToCart(product.value, quantity.value, selectedSpec.value)
  ElMessage.success('已加入购物车')
}

// 立即购买
const handleBuyNow = () => {
  if (!selectedSpec.value) {
    ElMessage.warning('请选择规格')
    return
  }
  cart.addToCart(product.value, quantity.value, selectedSpec.value)
  router.push('/cart')
}

// 生成星星
const renderStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return { full, half, empty: 5 - full - half }
}

watch(() => route.params.id, fetchProduct)
onMounted(fetchProduct)
</script>

<template>
  <div class="detail-page">
    <!-- 加载中 -->
    <div v-if="loading" class="container detail-loading">
      <div class="skeleton-row">
        <div class="skeleton-gallery"></div>
        <div class="skeleton-info">
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--short"></div>
          <div class="skeleton-line skeleton-line--price"></div>
          <div class="skeleton-line skeleton-line--btn"></div>
        </div>
      </div>
    </div>

    <template v-else-if="product">
      <!-- 面包屑 -->
      <div class="breadcrumb-section">
        <div class="container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/products', query: { category: product.category } }">
              {{ product.category ? (product.category === 'dogs' ? '狗狗用品' : product.category === 'cats' ? '猫咪用品' : product.category === 'fish' ? '水族用品' : product.category === 'birds' ? '鸟类用品' : '小宠用品') : '全部商品' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <!-- 主体区域：图片 + 信息 -->
      <div class="product-main">
        <div class="container product-main__inner">
          <!-- 左侧：图片画廊 -->
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img
                v-if="product.images && product.images[activeImageIndex]"
                :src="product.images[activeImageIndex]"
                :alt="product.name"
                class="product-gallery__img"
              />
              <div v-else class="product-gallery__placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="product-gallery__thumbs">
              <div
                v-for="(img, idx) in product.images"
                :key="idx"
                class="product-gallery__thumb"
                :class="{ 'product-gallery__thumb--active': activeImageIndex === idx }"
                @click="activeImageIndex = idx"
              >
                <img
                  v-if="img"
                  :src="img"
                  class="product-gallery__thumb-img"
                />
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- 右侧：商品信息 -->
          <div class="product-info">
            <div class="product-info__title-row">
              <h1 class="product-info__title">{{ product.name }}</h1>
              <span v-if="product.productType === 'pet'" class="product-info__pet-tag">活体宠物</span>
            </div>

            <!-- 评分 -->
            <div class="product-info__rating">
              <span class="stars">
                <span v-for="i in renderStars(product.rating).full" :key="'f'+i">★</span>
                <span v-if="renderStars(product.rating).half">☆</span>
                <span v-for="i in renderStars(product.rating).empty" :key="'e'+i" class="star-empty">★</span>
              </span>
              <span class="score">{{ product.rating }}</span>
              <span class="count">{{ product.reviewCount }} 条评价</span>
            </div>

            <!-- 价格 -->
            <div class="product-info__price-box">
              <span class="current-price">
                <span class="symbol">¥</span>{{ product.price.toFixed(2) }}
              </span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice.toFixed(2) }}
              </span>
              <span v-if="product.originalPrice" class="discount-tag">
                -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
              </span>
            </div>

            <!-- 配送信息 -->
            <div class="product-info__delivery">
              <el-icon color="#00a651"><Van /></el-icon>
              <span v-if="product.fastDelivery">次日达，满 199 元包邮</span>
              <span v-else>预计 3-5 天送达，满 199 元包邮</span>
            </div>

            <!-- 店铺 -->
            <div class="product-info__shop">
              <span class="label">店铺</span>
              <router-link
                :to="{ path: '/products', query: { shopId: String(product.shopId) } }"
                class="product-info__shop-link"
              >
                {{ product.shopName }}
              </router-link>
            </div>

            <!-- 规格选择 -->
            <div v-if="product.specs?.length" class="product-info__specs">
              <div v-for="spec in product.specs" :key="spec.id" class="spec-group">
                <span class="spec-label">{{ spec.name }}</span>
                <div class="spec-options">
                  <button
                    v-for="opt in spec.options"
                    :key="opt.id"
                    class="spec-option"
                    :class="{
                      'spec-option--active': selectedSpec?.id === opt.id,
                      'spec-option--disabled': !opt.available,
                    }"
                    :disabled="!opt.available"
                    @click="selectedSpec = opt"
                  >
                    {{ opt.name }}
                    <span v-if="opt.additionalPrice" class="spec-add-price">
                      +¥{{ opt.additionalPrice }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 数量选择（宠物显示"仅此一件"） -->
            <div v-if="product.productType === 'pet'" class="product-info__pet-only">
              <el-icon color="#1c49c2"><Warning /></el-icon>
              <span>活体宠物仅此一件，售出即止</span>
            </div>
            <div v-else class="product-info__quantity">
              <span class="label">数量</span>
              <div class="quantity-selector">
                <button class="qty-btn" :disabled="quantity <= 1" @click="decreaseQty">-</button>
                <span class="qty-value">{{ quantity }}</span>
                <button class="qty-btn" :disabled="quantity >= product.stock" @click="increaseQty">+</button>
              </div>
              <span class="stock-hint">库存 {{ product.stock }} 件</span>
            </div>

            <!-- 操作按钮 -->
            <div class="product-info__actions">
              <button class="btn btn-add-cart" @click="handleAddToCart">
                <el-icon><ShoppingCart /></el-icon>
                加入购物车
              </button>
              <button class="btn btn-buy-now" @click="handleBuyNow">
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页区域 -->
      <div class="product-tabs-section">
        <div class="container">
          <div class="product-tabs">
            <div class="product-tabs__nav">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                class="product-tabs__nav-item"
                :class="{ 'product-tabs__nav-item--active': activeTab === tab.key }"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span v-if="tab.key === 'reviews'" class="tab-count">({{ product.reviewCount }})</span>
              </button>
            </div>

            <div class="product-tabs__content">
              <!-- 商品详情 -->
              <div v-if="activeTab === 'detail'" class="tab-detail" v-html="product.description"></div>

              <!-- 规格参数 -->
              <div v-if="activeTab === 'specs'" class="tab-specs">
                <table class="specs-table">
                  <tr v-for="row in product.specsTable" :key="row.label">
                    <th>{{ row.label }}</th>
                    <td>{{ row.value }}</td>
                  </tr>
                </table>
              </div>

              <!-- 用户评价 -->
              <div v-if="activeTab === 'reviews'" class="tab-reviews">
                <div v-if="!product.reviews?.length" class="reviews-empty">
                  <p>暂无评价</p>
                  <router-link to="/user/orders" class="go-review-link">去评价</router-link>
                </div>
                <div v-for="review in product.reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <span class="review-user">{{ review.username }}</span>
                    <span class="review-stars">
                      <span v-for="i in review.rating" :key="i" class="star">★</span>
                    </span>
                    <span class="review-date">{{ review.createTime }}</span>
                  </div>
                  <p class="review-content">{{ review.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关商品 -->
      <div v-if="relatedProducts.length" class="related-section">
        <div class="container">
          <h2 class="section-title">相关商品推荐</h2>
          <div class="related-grid">
            <ProductCard
              v-for="item in relatedProducts"
              :key="item.id"
              v-bind="item"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
}

/* ========== 面包屑 ========== */
.breadcrumb-section {
  padding: 2rem 0;
}

/* ========== 主体布局 ========== */
.product-main {
  margin-bottom: 4.8rem;
}

.product-main__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4.8rem;
  background: #fff;
  border-radius: 1.2rem;
  padding: 3.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* ========== 图片画廊 ========== */
.product-gallery {
  position: sticky;
  top: 2.4rem;
}

.product-gallery__main {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f8f9fa;
  border-radius: 1.2rem;
  overflow: hidden;
  margin-bottom: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-gallery__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.8rem;
}

.product-gallery__placeholder {
  opacity: 0.4;
}

.product-gallery__thumbs {
  display: flex;
  gap: 1.2rem;
}

.product-gallery__thumb {
  width: 7.2rem;
  height: 7.2rem;
  border: 2px solid transparent;
  border-radius: 0.8rem;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s;
}

.product-gallery__thumb:hover { opacity: 0.8; }
.product-gallery__thumb--active {
  border-color: var(--color-brand-blue);
  opacity: 1;
}

/* ========== 商品信息 ========== */
.product-info__title-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
}

.product-info__title {
  font-size: 2.4rem;
  font-weight: var(--font-weight-bold);
  color: #121212;
  line-height: 1.4;
  margin: 0;
}

.product-info__pet-tag {
  flex-shrink: 0;
  font-size: var(--text-caption);
  font-weight: var(--font-weight-semibold);
  color: #fff;
  background-color: var(--color-brand-blue);
  padding: 0.4rem 1.2rem;
  border-radius: var(--radius-md);
}

.product-info__shop-link {
  color: var(--color-brand-blue);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.product-info__shop-link:hover {
  text-decoration: underline;
}

.product-info__pet-only {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.6rem;
  background-color: #f0f4ff;
  border-radius: var(--radius-md);
  color: var(--color-brand-blue);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: 2rem;
}

.product-info__rating {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.product-info__rating .stars { color: #ffc107; font-size: 1.6rem; letter-spacing: 1px; }
.product-info__rating .star-empty { color: #ddd; }
.product-info__rating .score { font-size: 1.6rem; font-weight: 600; color: #333; }
.product-info__rating .count { font-size: 1.4rem; color: #999; cursor: pointer; }
.product-info__rating .count:hover { color: var(--color-brand-blue); }

/* 价格区域 */
.product-info__price-box {
  background: #fff5f5;
  padding: 2rem;
  border-radius: 0.8rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: baseline;
  gap: 1.2rem;
}

.current-price {
  font-size: 3.2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-price-primary);
}
.current-price .symbol { font-size: 1.8rem; }
.original-price { font-size: 1.6rem; color: #999; text-decoration: line-through; }
.discount-tag {
  background: var(--color-price-primary);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  font-weight: 600;
}

/* 配送 */
.product-info__delivery {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
  font-size: 1.4rem;
  color: #333;
}

/* 店铺 */
.product-info__shop {
  margin-bottom: 2.4rem;
  font-size: 1.4rem;
  display: flex;
  gap: 1.2rem;
}
.product-info__shop .label { color: #666; }
.product-info__shop .value { color: var(--color-brand-blue); font-weight: 500; }

/* 规格 */
.product-info__specs { margin-bottom: 2.4rem; }
.spec-group { margin-bottom: 1.6rem; }
.spec-label { font-size: 1.4rem; color: #666; margin-bottom: 1.2rem; display: block; }
.spec-options { display: flex; flex-wrap: wrap; gap: 1.2rem; }

.spec-option {
  padding: 1rem 2rem;
  border: 2px solid #ddd;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.spec-option:hover:not(:disabled) { border-color: var(--color-brand-blue); }
.spec-option--active {
  border-color: var(--color-brand-blue);
  background: #f0f6ff;
  color: var(--color-brand-blue);
  font-weight: 600;
}
.spec-option--disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}
.spec-add-price { color: var(--color-price-primary); font-size: 1.2rem; margin-left: 0.4rem; }

/* 数量 */
.product-info__quantity {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 2.4rem;
}
.product-info__quantity .label { font-size: 1.4rem; color: #666; }
.stock-hint { font-size: 1.3rem; color: #999; }

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  overflow: hidden;
}
.qty-btn {
  width: 4rem;
  height: 4rem;
  background: #f8f9fa;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  transition: background 0.2s;
}
.qty-btn:hover:not(:disabled) { background: #e9ecef; }
.qty-btn:disabled { color: #ccc; cursor: not-allowed; }
.qty-value {
  width: 6rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 600;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

/* 操作按钮 */
.product-info__actions {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.btn {
  width: 100%;
  padding: 1.6rem;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}
.btn-add-cart {
  background: var(--color-brand-orange);
  color: #fff;
}
.btn-add-cart:hover { background: var(--color-brand-orange-hover); }
.btn-add-cart:active { transform: scale(0.98); }

.btn-buy-now {
  background: var(--color-price-primary);
  color: #fff;
}
.btn-buy-now:hover { background: #a02040; }

/* ========== 标签页 ========== */
.product-tabs-section {
  margin-bottom: 4.8rem;
}

.product-tabs__nav {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 3.2rem;
}

.product-tabs__nav-item {
  padding: 1.6rem 3.2rem;
  font-size: 1.6rem;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
}
.product-tabs__nav-item:hover { color: var(--color-brand-blue); }
.product-tabs__nav-item--active {
  color: var(--color-brand-blue);
  font-weight: 600;
  border-bottom-color: var(--color-brand-blue);
}

.tab-count { font-size: 1.3rem; color: #999; margin-left: 0.4rem; }

.product-tabs__content {
  background: #fff;
  border-radius: 1.2rem;
  padding: 3.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: 30rem;
}

/* 详情内容 */
.tab-detail :deep(h3) {
  font-size: 1.8rem;
  font-weight: 600;
  color: #121212;
  margin: 2.4rem 0 1.2rem;
}
.tab-detail :deep(h3:first-child) { margin-top: 0; }
.tab-detail :deep(ul) { padding-left: 2rem; margin-bottom: 1.6rem; }
.tab-detail :deep(li) { font-size: 1.5rem; color: #333; line-height: 1.8; margin-bottom: 0.6rem; }
.tab-detail :deep(p) { font-size: 1.5rem; color: #333; line-height: 1.8; }

/* 规格参数表 */
.specs-table { width: 100%; border-collapse: collapse; }
.specs-table th, .specs-table td { padding: 1.4rem 2rem; font-size: 1.4rem; border-bottom: 1px solid #f0f0f0; text-align: left; }
.specs-table th { width: 12rem; color: #666; font-weight: 500; background: #fafafa; }
.specs-table td { color: #333; }

/* 评价 */
.review-item {
  padding: 2rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.review-item:last-child { border-bottom: none; }
.review-header { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1rem; }
.review-user { font-size: 1.4rem; font-weight: 600; color: #333; }
.review-stars .star { color: #ffc107; font-size: 1.4rem; }
.review-date { font-size: 1.3rem; color: #999; margin-left: auto; }
.review-content { font-size: 1.4rem; color: #555; line-height: 1.6; }
.reviews-empty { text-align: center; padding: 4rem 0; color: #999; font-size: 1.5rem; }
.reviews-empty p { margin-bottom: 1.6rem; }
.go-review-link {
  display: inline-block;
  padding: 0.8rem 2.4rem;
  background: #ff6c10;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 600;
  transition: background 0.2s;
}
.go-review-link:hover { background: #e55a00; }

/* ========== 相关商品 ========== */
.related-section {
  padding-bottom: 6.4rem;
}
.section-title {
  font-size: 2.4rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: 3.2rem;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3.2rem;
}
@media (max-width: 992px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 576px) { .related-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; } }

/* ========== 骨架屏 ========== */
.detail-loading { padding: 3.2rem 0; }
.skeleton-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4.8rem; background: #fff; border-radius: 1.2rem; padding: 3.2rem; }
.skeleton-gallery { aspect-ratio: 1 / 1; background: #f0f0f0; border-radius: 1.2rem; animation: pulse 1.5s ease-in-out infinite; }
.skeleton-info { display: flex; flex-direction: column; gap: 2rem; padding-top: 2rem; }
.skeleton-line { background: #f0f0f0; border-radius: 0.6rem; animation: pulse 1.5s ease-in-out infinite; }
.skeleton-line--title { height: 3rem; width: 80%; }
.skeleton-line--short { height: 2rem; width: 40%; }
.skeleton-line--price { height: 4rem; width: 50%; }
.skeleton-line--btn { height: 5rem; width: 100%; border-radius: 0.8rem; }

@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .product-main__inner { grid-template-columns: 1fr; gap: 3.2rem; }
  .product-gallery { position: static; }
  .skeleton-row { grid-template-columns: 1fr; }
}
</style>
