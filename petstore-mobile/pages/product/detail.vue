<template>
  <view class="detail-page" v-if="product">
    <!-- Product Main (from PC .product-main) -->
    <view class="product-main">
      <!-- Gallery (from PC .product-gallery) -->
      <view class="product-gallery">
        <view class="product-gallery__main">
          <view class="product-gallery__placeholder">
            <text class="product-gallery__placeholder-text">{{ product.name.charAt(0) }}</text>
          </view>
        </view>
      </view>

      <!-- Product Info (from PC .product-info) -->
      <view class="product-info">
        <!-- Title row -->
        <view class="product-info__title-row">
          <text class="product-info__title">{{ product.name }}</text>
          <view v-if="product.productType === 'pet'" class="product-info__pet-tag">
            <text class="product-info__pet-tag-text">活体宠物</text>
          </view>
        </view>

        <!-- Rating (from PC .product-info__rating) -->
        <view class="product-info__rating">
          <text class="product-info__stars">{{ starText }}</text>
          <text class="product-info__score">{{ product.rating }}</text>
          <text class="product-info__count">{{ product.reviewCount }} 条评价</text>
        </view>

        <!-- Price box (from PC .product-info__price-box) -->
        <view class="product-info__price-box">
          <text class="product-info__current-price">
            <text class="product-info__symbol">¥</text>{{ product.price.toFixed(2) }}
          </text>
          <text v-if="product.originalPrice" class="product-info__original-price">
            ¥{{ product.originalPrice.toFixed(2) }}
          </text>
          <text v-if="product.originalPrice" class="product-info__discount-tag">
            -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
          </text>
        </view>

        <!-- Delivery (from PC .product-info__delivery) -->
        <view class="product-info__delivery">
          <view class="product-info__delivery-badge">
            <text class="product-info__delivery-badge-text">次日达</text>
          </view>
          <text class="product-info__delivery-text">满 199 元包邮</text>
        </view>

        <!-- Shop (from PC .product-info__shop) -->
        <view class="product-info__shop">
          <text class="product-info__shop-label">店铺</text>
          <text class="product-info__shop-name">{{ product.shopName }}</text>
        </view>

        <!-- Specs (from PC .product-info__specs) -->
        <view v-if="product.specs && product.specs.length" class="product-info__specs">
          <view v-for="(specGroup, gi) in product.specs" :key="gi" class="spec-group">
            <text class="spec-label">{{ specGroup.name }}</text>
            <view class="spec-options">
              <view
                v-for="(opt, oi) in specGroup.options"
                :key="oi"
                class="spec-option"
                :class="{ 'spec-option--active': selectedSpecIndex[gi] === oi }"
                @tap="selectedSpecIndex[gi] = oi"
              >
                <text class="spec-option__text" :class="{ 'spec-option__text--active': selectedSpecIndex[gi] === oi }">{{ typeof opt === 'string' ? opt : opt.name }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Pet only notice -->
        <view v-if="product.productType === 'pet'" class="product-info__pet-only">
          <text class="product-info__pet-only-text">活体宠物仅此一件，售出即止</text>
        </view>

        <!-- Quantity (from PC .product-info__quantity) -->
        <view v-else class="product-info__quantity">
          <text class="product-info__qty-label">数量</text>
          <view class="quantity-selector">
            <view class="qty-btn" :class="{ 'qty-btn--disabled': quantity <= 1 }" @tap="decreaseQty">
              <text class="qty-btn-text">-</text>
            </view>
            <text class="qty-value">{{ quantity }}</text>
            <view class="qty-btn" :class="{ 'qty-btn--disabled': quantity >= product.stock }" @tap="increaseQty">
              <text class="qty-btn-text">+</text>
            </view>
          </view>
          <text class="product-info__stock-hint">库存 {{ product.stock }} 件</text>
        </view>

        <!-- Action buttons (from PC .product-info__actions) -->
        <view class="product-info__actions">
          <view class="product-info__btn product-info__btn--cart" @tap="addToCart">
            <text class="product-info__btn-text">加入购物车</text>
          </view>
          <view class="product-info__btn product-info__btn--buy" @tap="buyNow">
            <text class="product-info__btn-text">立即购买</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Tabs (from PC .product-tabs-section) -->
    <view class="product-tabs-section">
      <view class="product-tabs">
        <view class="product-tabs__nav">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="product-tabs__nav-item"
            :class="{ 'product-tabs__nav-item--active': activeTab === tab.key }"
            @tap="activeTab = tab.key"
          >
            <text class="product-tabs__nav-text" :class="{ 'product-tabs__nav-text--active': activeTab === tab.key }">{{ tab.label }}</text>
          </view>
        </view>

        <view class="product-tabs__content">
          <!-- Detail -->
          <view v-if="activeTab === 'detail'" class="tab-detail">
            <text class="tab-detail__text">{{ plainDescription }}</text>
          </view>

          <!-- Specs table (from PC .specs-table) -->
          <view v-if="activeTab === 'specs'" class="tab-specs">
            <view v-for="(row, i) in product.specsTable" :key="i" class="specs-table__row">
              <text class="specs-table__th">{{ row.label }}</text>
              <text class="specs-table__td">{{ row.value }}</text>
            </view>
          </view>

          <!-- Reviews (from PC .tab-reviews) -->
          <view v-if="activeTab === 'reviews'" class="tab-reviews">
            <view v-if="!product.reviews || !product.reviews.length" class="reviews-empty">
              <text class="reviews-empty__text">暂无评价</text>
            </view>
            <view v-for="review in product.reviews" :key="review.id" class="review-item">
              <view class="review-header">
                <text class="review-user">{{ review.username }}</text>
                <text class="review-stars">
                  <text v-for="i in review.rating" :key="i" class="review-star">★</text>
                </text>
                <text class="review-date">{{ review.createTime }}</text>
              </view>
              <text class="review-content">{{ review.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom bar (fixed) -->
    <view class="bottom-bar">
      <view class="bottom-bar__btn bottom-bar__btn--cart" @tap="addToCart">
        <text class="bottom-bar__btn-text">加入购物车</text>
      </view>
      <view class="bottom-bar__btn bottom-bar__btn--buy" @tap="buyNow">
        <text class="bottom-bar__btn-text">立即购买</text>
      </view>
    </view>
  </view>

  <!-- Not found -->
  <view class="not-found" v-else>
    <view class="not-found__circle">
      <text class="not-found__icon">?</text>
    </view>
    <text class="not-found__text">商品不存在或已下架</text>
    <view class="not-found__btn" @tap="goBack">
      <text class="not-found__btn-text">返回</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { getProductById } from '@/services/product'

const tabs = [
  { key: 'detail', label: '商品详情' },
  { key: 'specs', label: '规格参数' },
  { key: 'reviews', label: '用户评价' },
]

const product = ref(null)
const selectedSpecIndex = ref([])
const quantity = ref(1)
const activeTab = ref('detail')

const starText = computed(() => {
  if (!product.value) return ''
  const full = Math.floor(product.value.rating)
  const half = product.value.rating - full >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(5 - full - half)
})

const plainDescription = computed(() => {
  if (!product.value?.description) return ''
  return product.value.description.replace(/<[^>]+>/g, '')
})

const currentSpec = computed(() => {
  if (!product.value?.specs?.length) return '标准款'
  return product.value.specs
    .map((g, i) => g.options[selectedSpecIndex.value[i]] || g.options[0])
    .join(' / ')
})

onLoad(async (query) => {
  const id = query?.id
  if (!id) return
  try {
    const result = await getProductById(Number(id))
    if (result) {
      product.value = result
      selectedSpecIndex.value = (result.specs || []).map(() => 0)
    }
  } catch {}
})

const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }
const increaseQty = () => { if (quantity.value < product.value.stock) quantity.value++ }

const addToCart = () => {
  if (!product.value) return
  useCartStore().addItem(product.value, quantity.value, currentSpec.value)
}

const buyNow = () => {
  if (!product.value) return
  useCartStore().addItem(product.value, quantity.value, currentSpec.value)
  uni.navigateTo({ url: '/pages/order/checkout' })
}

const goBack = () => {
  uni.navigateBack({ delta: 1 })
}
</script>

<style scoped>
.detail-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 130rpx;
}

/* ========== Product Main (from PC .product-main) ========== */
.product-main {
  margin-bottom: 20rpx;
}

/* Gallery (from PC .product-gallery__main) */
.product-gallery__main {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-gallery__placeholder-text {
  font-size: 160rpx;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.05);
}

/* ========== Product Info (from PC .product-info) ========== */
.product-info {
  background: #fff;
  padding: 32rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Title */
.product-info__title-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.product-info__title {
  font-size: 36rpx;
  font-weight: 700;
  color: #121212;
  line-height: 1.4;
  flex: 1;
}
.product-info__pet-tag {
  flex-shrink: 0;
  background-color: #1c49c2;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}
.product-info__pet-tag-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #ffffff;
}

/* Rating (from PC .product-info__rating) */
.product-info__rating {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}
.product-info__stars {
  color: #ffc107;
  font-size: 28rpx;
  letter-spacing: 2rpx;
}
.product-info__score {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}
.product-info__count {
  font-size: 24rpx;
  color: #999;
}

/* Price box (from PC .product-info__price-box) */
.product-info__price-box {
  background: #fff5f5;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}
.product-info__current-price {
  font-size: 48rpx;
  font-weight: 700;
  color: #bd2848;
}
.product-info__symbol {
  font-size: 28rpx;
}
.product-info__original-price {
  font-size: 26rpx;
  color: #999;
  text-decoration: line-through;
}
.product-info__discount-tag {
  background: #bd2848;
  color: #fff;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  font-weight: 600;
}

/* Delivery (from PC .product-info__delivery) */
.product-info__delivery {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.product-info__delivery-badge {
  background: #e6f7ee;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}
.product-info__delivery-badge-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #00a651;
}
.product-info__delivery-text {
  font-size: 24rpx;
  color: #333;
}

/* Shop (from PC .product-info__shop) */
.product-info__shop {
  margin-bottom: 24rpx;
  display: flex;
  gap: 12rpx;
  font-size: 26rpx;
}
.product-info__shop-label {
  color: #666;
}
.product-info__shop-name {
  color: #1c49c2;
  font-weight: 500;
}

/* Specs (from PC .spec-option) */
.product-info__specs {
  margin-bottom: 24rpx;
}
.spec-group {
  margin-bottom: 16rpx;
}
.spec-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}
.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.spec-option {
  padding: 12rpx 28rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  background: #fff;
}
.spec-option--active {
  border-color: #1c49c2;
  background: #f0f6ff;
}
.spec-option__text {
  font-size: 26rpx;
  color: #333;
}
.spec-option__text--active {
  color: #1c49c2;
  font-weight: 600;
}

/* Pet only */
.product-info__pet-only {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background-color: #f0f4ff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.product-info__pet-only-text {
  font-size: 24rpx;
  font-weight: 500;
  color: #1c49c2;
}

/* Quantity (from PC .quantity-selector) */
.product-info__quantity {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.product-info__qty-label {
  font-size: 26rpx;
  color: #666;
}
.quantity-selector {
  display: flex;
  align-items: center;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  overflow: hidden;
}
.qty-btn {
  width: 64rpx;
  height: 64rpx;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-btn--disabled {
  color: #ccc;
}
.qty-btn-text {
  font-size: 32rpx;
  color: #333;
}
.qty-value {
  width: 80rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  border-left: 1rpx solid #ddd;
  border-right: 1rpx solid #ddd;
}
.product-info__stock-hint {
  font-size: 22rpx;
  color: #999;
}

/* Action buttons (from PC .product-info__actions) */
.product-info__actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.product-info__btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border-radius: 16rpx;
}
.product-info__btn--cart {
  background: #ff6c10;
}
.product-info__btn--buy {
  background: #bd2848;
}
.product-info__btn-text {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}

/* ========== Tabs (from PC .product-tabs-section) ========== */
.product-tabs-section {
  margin: 0 24rpx 32rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.product-tabs__nav {
  display: flex;
  border-bottom: 2rpx solid #eee;
}
.product-tabs__nav-item {
  flex: 1;
  padding: 24rpx 0;
  text-align: center;
  position: relative;
}
.product-tabs__nav-item--active {
  border-bottom-color: #1c49c2;
}
.product-tabs__nav-text {
  font-size: 28rpx;
  color: #666;
}
.product-tabs__nav-text--active {
  color: #1c49c2;
  font-weight: 600;
}
.product-tabs__content {
  padding: 32rpx;
  min-height: 300rpx;
}

/* Detail tab */
.tab-detail__text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
}

/* Specs table (from PC .specs-table) */
.specs-table__row {
  display: flex;
  border-bottom: 1rpx solid #f0f0f0;
  padding: 20rpx 0;
}
.specs-table__th {
  width: 200rpx;
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
  background: #fafafa;
  padding: 12rpx 20rpx;
  flex-shrink: 0;
}
.specs-table__td {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  padding: 12rpx 20rpx;
}

/* Reviews */
.review-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.review-item:last-child {
  border-bottom: none;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.review-user {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
}
.review-stars .review-star {
  color: #ffc107;
  font-size: 24rpx;
}
.review-date {
  font-size: 22rpx;
  color: #999;
  margin-left: auto;
}
.review-content {
  font-size: 26rpx;
  color: #555;
  line-height: 1.6;
}
.reviews-empty {
  text-align: center;
  padding: 64rpx 0;
}
.reviews-empty__text {
  color: #999;
  font-size: 28rpx;
}

/* ========== Bottom Bar (fixed) ========== */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  box-shadow: 0 -2rpx 12px rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom-bar__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bottom-bar__btn--cart {
  background: #ff6c10;
}
.bottom-bar__btn--buy {
  background: #bd2848;
}
.bottom-bar__btn-text {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
}

/* ========== Not Found ========== */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}
.not-found__circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}
.not-found__icon {
  font-size: 64rpx;
  color: #1c49c2;
  font-weight: 700;
}
.not-found__text {
  font-size: 30rpx;
  color: #4d4d4d;
  margin-bottom: 32rpx;
}
.not-found__btn {
  background: #1c49c2;
  padding: 16rpx 64rpx;
  border-radius: 16rpx;
}
.not-found__btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}
</style>
