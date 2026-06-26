<template>
  <view class="page">
    <!-- Custom Header (fixed at top) -->
    <view class="header">
      <view class="header__top">
        <view class="header__logo" @tap="goHome">
          <view class="header__logo-icon">
            <text class="header__logo-text">P</text>
          </view>
          <text class="header__brand">PetStore</text>
        </view>
        <view class="header__actions">
          <view class="header__action" @tap="goToUser">
            <view class="header__icon-circle">
              <text class="header__icon-text">我</text>
            </view>
          </view>
          <view class="header__action header__action--cart" @tap="goToCart">
            <view class="header__icon-circle">
              <text class="header__icon-text">购</text>
            </view>
            <view v-if="cartCount > 0" class="header__badge">
              <text class="header__badge-text">{{ cartCount > 99 ? '99+' : cartCount }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="header__search" @tap="goToSearch">
        <view class="header__search-icon-circle">
          <text class="header__search-icon-text">S</text>
        </view>
        <text class="header__search-placeholder">搜索宠物食品、玩具、用品...</text>
      </view>
    </view>

    <!-- Scrollable Content -->
    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <!-- Hero Section -->
      <view class="hero">
        <view class="hero__content">
          <text class="hero__badge">NEW USER SPECIAL</text>
          <text class="hero__title">宠爱有加，好物相伴</text>
          <text class="hero__subtitle">为您的毛孩子找到最优质的产品和最贴心的服务</text>
          <view class="hero__actions">
            <view class="hero__btn hero__btn--primary" @tap="goToList()">
              <text class="hero__btn-text">立即选购</text>
            </view>
            <view class="hero__btn hero__btn--outline" @tap="goToList('', 'pet')">
              <text class="hero__btn-text-outline">浏览宠物</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Categories -->
      <view class="section">
        <view class="section__container">
          <view class="category-grid">
            <view class="category-card" v-for="cat in categories" :key="cat.id" @tap="goToList(cat.category, cat.type)">
              <view class="category-card__icon">
                <text class="category-card__icon-text">{{ cat.letter }}</text>
              </view>
              <text class="category-card__label">{{ cat.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Features -->
      <view class="section">
        <view class="section__container">
          <view class="features-grid">
            <view class="feature-item" v-for="f in features" :key="f.label">
              <view class="feature-item__icon" :style="{ background: f.bg }">
                <text class="feature-item__icon-text" :style="{ color: f.color }">{{ f.letter }}</text>
              </view>
              <view class="feature-item__info">
                <text class="feature-item__title">{{ f.label }}</text>
                <text class="feature-item__desc">{{ f.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Hot Products -->
      <view class="section">
        <view class="section__container">
          <view class="section-header">
            <text class="section-header__title">热门商品</text>
            <text class="section-header__more" @tap="goToList()">查看全部</text>
          </view>
          <scroll-view scroll-x class="product-scroll" :show-scrollbar="false">
            <view class="product-scroll-inner">
              <view class="product-scroll-item" v-for="item in hotProducts" :key="item.id" @tap="goToDetail(item.id)">
                <view class="product-card">
                  <view class="product-card__image-wrapper">
                    <view class="product-card__image-placeholder">
                      <text class="product-card__placeholder-text">{{ item.name.charAt(0) }}</text>
                    </view>
                    <view v-if="item.fastDelivery" class="product-card__badge">
                      <text class="product-card__badge-text product-card__badge-text--green">次日达</text>
                    </view>
                    <view v-if="item.productType === 'pet'" class="product-card__pet-badge">
                      <text class="product-card__badge-text product-card__badge-text--white">活体宠物</text>
                    </view>
                  </view>
                  <view class="product-card__info">
                    <text class="product-card__title">{{ item.name }}</text>
                    <view class="product-card__rating">
                      <text class="product-card__stars">{{ renderStars(item.rating) }}</text>
                      <text class="product-card__rating-value">{{ item.rating }}</text>
                      <text class="product-card__review-count">({{ item.reviewCount }})</text>
                    </view>
                    <view class="product-card__price">
                      <text class="product-card__price-current">¥{{ item.price }}</text>
                      <text v-if="item.originalPrice" class="product-card__price-original">¥{{ item.originalPrice }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- Recommend -->
      <view class="section">
        <view class="section__container">
          <view class="section-header">
            <text class="section-header__title">为你推荐</text>
          </view>
          <view class="product-grid">
            <view class="product-grid__item" v-for="item in recommendProducts" :key="item.id" @tap="goToDetail(item.id)">
              <view class="product-card">
                <view class="product-card__image-wrapper">
                  <view class="product-card__image-placeholder">
                    <text class="product-card__placeholder-text">{{ item.name.charAt(0) }}</text>
                  </view>
                  <view v-if="item.fastDelivery" class="product-card__badge">
                    <text class="product-card__badge-text product-card__badge-text--green">次日达</text>
                  </view>
                </view>
                <view class="product-card__info">
                  <text class="product-card__title">{{ item.name }}</text>
                  <view class="product-card__rating">
                    <text class="product-card__stars">{{ renderStars(item.rating) }}</text>
                    <text class="product-card__rating-value">{{ item.rating }}</text>
                    <text class="product-card__sales">已售{{ formatSales(item.sales) }}</text>
                  </view>
                  <view class="product-card__price">
                    <text class="product-card__price-current">¥{{ item.price }}</text>
                    <text v-if="item.originalPrice" class="product-card__price-original">¥{{ item.originalPrice }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- AI Assistant FAB -->
    <view class="ai-fab" @tap="openAI">
      <text class="ai-fab__text">助</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const cartCount = ref(0)

try {
  const cartItems = uni.getStorageSync('petstore_cart')
  if (Array.isArray(cartItems)) cartCount.value = cartItems.reduce((s, i) => s + (i.quantity || 1), 0)
} catch {}

const goHome = () => { uni.switchTab({ url: '/pages/index/index' }) }
const goToCart = () => { uni.switchTab({ url: '/pages/cart/cart' }) }
const goToUser = () => { uni.switchTab({ url: '/pages/user/profile' }) }
const goToSearch = () => { uni.navigateTo({ url: '/pages/product/list' }) }
const openAI = () => { uni.navigateTo({ url: '/pages/ai/chat' }) }

const categories = ref([
  { id: 1, name: '狗狗', letter: '犬', category: 'dogs' },
  { id: 2, name: '猫咪', letter: '猫', category: 'cats' },
  { id: 3, name: '水族', letter: '鱼', category: 'fish' },
  { id: 4, name: '鸟类', letter: '鸟', category: 'birds' },
  { id: 5, name: '小宠', letter: '宠', category: 'small' },
  { id: 6, name: '宠物', letter: '活', type: 'pet' },
  { id: 7, name: '用品', letter: '品', type: 'supply' },
])

const features = ref([
  { label: '正品保证', desc: '100%正品保障', letter: '正', color: '#1c49c2', bg: '#f0f4ff' },
  { label: '闪电发货', desc: '24小时内发货', letter: '闪', color: '#ff6c10', bg: '#fff5eb' },
  { label: '次日达', desc: '城市次日送达', letter: '速', color: '#00a651', bg: '#e6f7ee' },
  { label: '安全支付', desc: '资金安全保障', letter: '安', color: '#bd2848', bg: '#fde8ee' },
])

const hotProducts = ref([
  { id: 1, name: '皇家小型犬成犬粮 2kg', price: 159, originalPrice: 199, rating: 4.8, reviewCount: 2341, fastDelivery: true, productType: 'supply' },
  { id: 2, name: '渴望六种鱼猫粮 5.4kg', price: 428, originalPrice: 528, rating: 4.9, reviewCount: 1892, fastDelivery: true, productType: 'supply' },
  { id: 4, name: '猫抓板瓦楞纸耐磨款', price: 29.9, originalPrice: 49.9, rating: 4.6, reviewCount: 3201, fastDelivery: true, productType: 'supply' },
  { id: 12, name: '猫砂豆腐砂活性炭 6L', price: 29.9, originalPrice: 39.9, rating: 4.8, reviewCount: 5672, fastDelivery: true, productType: 'supply' },
  { id: 9, name: '猫咪自动饮水机 静音', price: 79, originalPrice: 119, rating: 4.7, reviewCount: 2103, fastDelivery: false, productType: 'supply' },
])

const recommendProducts = ref([
  { id: 12, name: '猫砂豆腐砂活性炭 6L', price: 29.9, originalPrice: 39.9, rating: 4.8, reviewCount: 5672, sales: 12000, fastDelivery: true },
  { id: 1, name: '皇家小型犬成犬粮 2kg', price: 159, originalPrice: 199, rating: 4.8, reviewCount: 2341, sales: 5600, fastDelivery: true },
  { id: 9, name: '猫咪自动饮水机 静音', price: 79, originalPrice: 119, rating: 4.7, reviewCount: 2103, sales: 6700, fastDelivery: false },
  { id: 4, name: '猫抓板瓦楞纸耐磨款', price: 29.9, originalPrice: 49.9, rating: 4.6, reviewCount: 3201, sales: 8900, fastDelivery: true },
])

const renderStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(5 - full - half)
}

const formatSales = (count) => {
  if (count >= 10000) return (count / 10000).toFixed(1) + 'w'
  return count.toLocaleString()
}

const goToList = (category, type) => {
  let url = '/pages/product/list'
  const params = []
  if (category) params.push('category=' + category)
  if (type) params.push('productType=' + type)
  if (params.length) url += '?' + params.join('&')
  uni.navigateTo({ url })
}

const goToDetail = (id) => {
  uni.navigateTo({ url: '/pages/product/detail?id=' + id })
}
</script>

<style scoped>
.page {
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  height: 0;
}

/* ========== Custom Header (from PC AppHeader.vue) ========== */
.header {
  background: linear-gradient(135deg, #1c49c2, #2558d6);
  padding-top: 80rpx;
  padding-bottom: 24rpx;
  flex-shrink: 0;
  z-index: 100;
}
.header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx 16rpx;
}
.header__logo {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.header__logo-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.header__logo-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
}
.header__brand {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1rpx;
}
.header__actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
}
.header__action {
  position: relative;
  padding: 8rpx;
}
.header__icon-circle {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.header__icon-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
}
.header__badge {
  position: absolute;
  top: 0;
  right: -4rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  background: #ff6c10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}
.header__badge-text {
  font-size: 18rpx;
  color: #fff;
  font-weight: 700;
}
.header__search {
  margin: 0 30rpx;
  height: 76rpx;
  background: #fff;
  border-radius: 38rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  gap: 14rpx;
}
.header__search-icon-circle {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #1c49c2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.header__search-icon-text {
  font-size: 22rpx;
  color: #fff;
  font-weight: 700;
}
.header__search-placeholder {
  font-size: 26rpx;
  color: #999;
}

/* ========== Hero (from PC .hero) ========== */
.hero {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #ffffff;
  padding: 80rpx 40rpx;
}
.hero__content {
  max-width: 600rpx;
}
.hero__badge {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffc107;
  letter-spacing: 4rpx;
  margin-bottom: 20rpx;
  display: block;
}
.hero__title {
  font-size: 60rpx;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24rpx;
  display: block;
}
.hero__subtitle {
  font-size: 30rpx;
  opacity: 0.9;
  margin-bottom: 40rpx;
  line-height: 1.6;
  display: block;
}
.hero__actions {
  display: flex;
  gap: 24rpx;
}
.hero__btn {
  padding: 24rpx 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero__btn--primary {
  background-color: #ff6c10;
}
.hero__btn-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
}
.hero__btn--outline {
  border: 2rpx solid rgba(255,255,255,0.5);
}
.hero__btn-text-outline {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
}

/* ========== Section (from PC .section) ========== */
.section {
  margin-bottom: 16rpx;
}
.section__container {
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  margin: 0 24rpx 16rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}
.section-header__title {
  font-size: 36rpx;
  font-weight: 700;
  color: #121212;
}
.section-header__more {
  font-size: 26rpx;
  color: #1c49c2;
  font-weight: 500;
}

/* ========== Categories (from PC .category-grid) ========== */
.category-grid {
  display: flex;
  flex-wrap: wrap;
}
.category-card {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
}
.category-card__icon {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  background-color: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  transition: background-color 0.2s;
}
.category-card__icon-text {
  font-size: 52rpx;
  font-weight: 700;
  color: #1c49c2;
}
.category-card__label {
  font-size: 26rpx;
  color: #4d4d4d;
  font-weight: 500;
}

/* ========== Features (from PC .features-grid) ========== */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  border: 1rpx solid #f0f0f0;
}
.feature-item__icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.feature-item__icon-text {
  font-size: 36rpx;
  font-weight: 700;
}
.feature-item__info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.feature-item__title {
  font-size: 28rpx;
  font-weight: 600;
  color: #121212;
}
.feature-item__desc {
  font-size: 22rpx;
  color: #999;
}

/* ========== Product Card (from PC ProductCard.vue) ========== */
.product-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.product-card__image-wrapper {
  position: relative;
  padding: 24rpx;
  background-color: #f8f9fa;
}
.product-card__image-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background-color: #ffffff;
}
.product-card__placeholder-text {
  font-size: 72rpx;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.06);
}

/* Badges (from PC .product-card__badge) */
.product-card__badge {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  background-color: #e6f7ee;
}
.product-card__pet-badge {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  background-color: #1c49c2;
}
.product-card__badge-text {
  font-size: 22rpx;
  font-weight: 600;
}
.product-card__badge-text--green {
  color: #00a651;
}
.product-card__badge-text--white {
  color: #ffffff;
}

/* Info (from PC .product-card__info) */
.product-card__info {
  padding: 24rpx;
}
.product-card__title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 80rpx;
}

/* Rating (from PC .product-card__rating) */
.product-card__rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
}
.product-card__stars {
  color: #ff6c10;
  font-size: 24rpx;
  letter-spacing: 2rpx;
  line-height: 1;
}
.product-card__rating-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #121212;
}
.product-card__review-count {
  font-size: 22rpx;
  color: #999;
}
.product-card__sales {
  font-size: 22rpx;
  color: #999;
  margin-left: auto;
}

/* Price (from PC .product-card__price) */
.product-card__price {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}
.product-card__price-current {
  font-size: 36rpx;
  font-weight: 700;
  color: #bd2848;
}
.product-card__price-original {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

/* ========== Product Scroll (horizontal) ========== */
.product-scroll {
  white-space: nowrap;
}
.product-scroll-inner {
  display: flex;
  gap: 20rpx;
}
.product-scroll-item {
  width: 300rpx;
  flex-shrink: 0;
}

/* ========== Product Grid (2 columns) ========== */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.product-grid__item {
  width: calc(50% - 10rpx);
}

/* ========== AI Assistant FAB ========== */
.ai-fab {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #1c49c2, #2558d6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 24rpx rgba(28, 73, 194, 0.4);
  z-index: 999;
}
.ai-fab__text {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}
</style>
