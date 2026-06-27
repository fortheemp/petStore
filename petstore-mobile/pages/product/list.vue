<template>
  <view class="page">
    <!-- Search Bar -->
    <view class="search-bar">
      <view class="search-wrap">
        <view class="search-icon-circle">
          <text class="search-icon-text">S</text>
        </view>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索宠物食品、玩具、用品..."
          confirm-type="search"
          @confirm="onSearch"
        />
      </view>
    </view>

    <!-- ProductType Tabs (compact pills) -->
    <view class="type-pills">
      <view
        v-for="tab in typeTabs"
        :key="tab.value"
        class="type-pill"
        :class="{ 'type-pill--active': activeProductType === tab.value }"
        @tap="selectProductType(tab.value)"
      >
        <view class="type-pill__dot" :style="{ background: tab.dotColor }"></view>
        <text class="type-pill__label">{{ tab.label }}</text>
      </view>
    </view>

    <!-- Category Icons (colorful, horizontal scroll) -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view
          class="category-chip"
          :class="{ 'category-chip--active': activeCategory === '' }"
          @tap="selectCategory('')"
        >
          <text class="category-chip__text" :class="{ 'category-chip__text--active': activeCategory === '' }">全部</text>
        </view>
        <view
          v-for="(info, key) in currentCategoryMap"
          :key="key"
          class="category-chip"
          :class="{ 'category-chip--active': activeCategory === key }"
          @tap="selectCategory(key)"
        >
          <view class="category-chip__icon" :style="{ background: info.bg }">
            <text class="category-chip__letter" :style="{ color: info.color }">{{ info.letter }}</text>
          </view>
          <text class="category-chip__text" :class="{ 'category-chip__text--active': activeCategory === key }">{{ info.label }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- Filter Bar -->
    <view class="filter-bar">
      <text class="filter-bar__count">{{ total }} 件商品</text>
      <view class="filter-bar__sorts">
        <view
          v-for="opt in sortOptions"
          :key="opt.value"
          class="sort-tag"
          :class="{ 'sort-tag--active': sortBy === opt.value }"
          @tap="selectSort(opt.value)"
        >
          <text class="sort-tag__text" :class="{ 'sort-tag__text--active': sortBy === opt.value }">{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <!-- Product Grid -->
    <view class="product-grid">
      <view
        v-for="item in displayProducts"
        :key="item.id"
        class="product-grid__item"
        @tap="goDetail(item.id)"
      >
        <view class="product-card">
          <view class="product-card__img">
            <view class="product-card__img-placeholder" :style="{ background: getCardBg(item) }">
              <text class="product-card__img-letter" :style="{ color: getCardColor(item) }">{{ item.name.charAt(0) }}</text>
            </view>
            <view v-if="item.fastDelivery" class="product-card__badge product-card__badge--green">
              <text class="product-card__badge-text">次日达</text>
            </view>
            <view v-if="item.productType === 'pet'" class="product-card__badge product-card__badge--blue">
              <text class="product-card__badge-text">活体</text>
            </view>
          </view>
          <view class="product-card__body">
            <text class="product-card__name">{{ item.name }}</text>
            <view class="product-card__rating">
              <text class="product-card__stars">{{ renderStars(item.rating) }}</text>
              <text class="product-card__score">{{ item.rating }}</text>
              <text class="product-card__reviews">({{ item.reviewCount }})</text>
            </view>
            <view class="product-card__price-row">
              <text class="product-card__price">¥{{ item.price.toFixed(2) }}</text>
              <text v-if="item.originalPrice" class="product-card__original">¥{{ item.originalPrice.toFixed(2) }}</text>
            </view>
            <view class="product-card__action" @tap.stop="addToCart(item)">
              <text class="product-card__action-text">加入购物车</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="status-tip">加载中...</view>
    <view v-if="noMore && displayProducts.length > 0" class="status-tip">没有更多了</view>

    <view v-if="!loading && displayProducts.length === 0" class="empty-state">
      <view class="empty-state__circle">
        <text class="empty-state__icon">?</text>
      </view>
      <text class="empty-state__text">暂无商品</text>
      <view class="empty-state__btn" @tap="resetFilters">
        <text class="empty-state__btn-text">查看全部商品</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { getProducts, invalidateProductCache } from '@/services/product'

const categoryMap = {
  dogs: { label: '狗狗', letter: '犬', color: '#1c49c2', bg: '#f0f4ff' },
  cats: { label: '猫咪', letter: '猫', color: '#ff6c10', bg: '#fff5eb' },
  fish: { label: '水族', letter: '鱼', color: '#00a651', bg: '#e6f7ee' },
  birds: { label: '鸟类', letter: '鸟', color: '#9c27b0', bg: '#f3e5f5' },
  small: { label: '小宠', letter: '宠', color: '#e91e63', bg: '#fce4ec' },
}

const supplySubMap = {
  royal: { label: '皇家', letter: '皇', color: '#1c49c2', bg: '#f0f4ff' },
  orijen: { label: '渴望', letter: '渴', color: '#ff6c10', bg: '#fff5eb' },
  sen: { label: '森森', letter: '森', color: '#00a651', bg: '#e6f7ee' },
  cute: { label: '喵星人', letter: '喵', color: '#e91e63', bg: '#fce4ec' },
  love: { label: '爱宠', letter: '爱', color: '#9c27b0', bg: '#f3e5f5' },
}

const currentCategoryMap = computed(() => {
  if (activeProductType.value === 'pet') return categoryMap
  if (activeProductType.value === 'supply') return supplySubMap
  return categoryMap
})

const typeTabs = [
  { value: '', label: '全部', dotColor: '#999' },
  { value: 'pet', label: '宠物', dotColor: '#00a651' },
  { value: 'supply', label: '宠物周边', dotColor: '#ff6c10' },
]

const sortOptions = [
  { value: 'default', label: '综合' },
  { value: 'sales', label: '销量' },
  { value: 'price-asc', label: '价格↑' },
  { value: 'price-desc', label: '价格↓' },
]

const categoryColors = {
  dogs: { bg: '#f0f4ff', color: '#1c49c2' },
  cats: { bg: '#fff5eb', color: '#ff6c10' },
  fish: { bg: '#e6f7ee', color: '#00a651' },
  birds: { bg: '#f3e5f5', color: '#9c27b0' },
  small: { bg: '#fce4ec', color: '#e91e63' },
}

const getCardBg = (item) => categoryColors[item.category]?.bg || '#f0f4ff'
const getCardColor = (item) => categoryColors[item.category]?.color || '#1c49c2'

const keyword = ref('')
const activeProductType = ref('')
const activeCategory = ref('')
const sortBy = ref('default')
const page = ref(1)
const pageSize = 10
const allProducts = ref([])
const total = ref(0)
const loading = ref(false)

const noMore = computed(() => allProducts.value.length >= total.value)
const displayProducts = computed(() => allProducts.value)

const renderStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(5 - full - half)
}

async function loadProducts(reset = false) {
  if (loading.value) return
  if (!reset && noMore.value) return
  loading.value = true
  if (reset) { page.value = 1; allProducts.value = [] }
  try {
    const res = await getProducts({
      page: page.value, pageSize, keyword: keyword.value,
      category: activeCategory.value, productType: activeProductType.value,
      sort: sortBy.value,
    })
    allProducts.value = reset ? res.list : [...allProducts.value, ...res.list]
    total.value = res.total
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function onSearch() { loadProducts(true) }
function selectProductType(type) { if (activeProductType.value === type) return; activeProductType.value = type; activeCategory.value = ''; loadProducts(true) }
function selectCategory(cat) { if (activeCategory.value === cat) return; activeCategory.value = cat; loadProducts(true) }
function selectSort(sort) { if (sortBy.value === sort) return; sortBy.value = sort; loadProducts(true) }
function resetFilters() { activeProductType.value = ''; activeCategory.value = ''; keyword.value = ''; sortBy.value = 'default'; loadProducts(true) }
function goDetail(id) { uni.navigateTo({ url: `/pages/product/detail?id=${id}` }) }
function addToCart(item) { useCartStore().addItem(item, 1, '标准款'); uni.showToast({ title: '已加入购物车', icon: 'success' }) }

let firstShow = true
onShow(() => {
  if (firstShow) {
    firstShow = false
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    const opts = page?.$page?.options || page?.options || {}
    if (opts.productType) activeProductType.value = opts.productType
    if (opts.category) activeCategory.value = opts.category
    if (opts.keyword) keyword.value = opts.keyword
  }
  loadProducts(true)
})
onReachBottom(() => { if (!noMore.value) { page.value++; loadProducts() } })
</script>

<style scoped>
.page {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 32rpx;
}

/* Search */
.search-bar {
  background: linear-gradient(135deg, #1c49c2, #2558d6);
  padding: 16rpx 24rpx 20rpx;
}
.search-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 36rpx;
  padding: 0 28rpx;
  height: 76rpx;
  gap: 14rpx;
}
.search-icon-circle {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #1c49c2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.search-icon-text {
  font-size: 22rpx;
  color: #fff;
  font-weight: 700;
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  height: 76rpx;
}

/* Type Pills */
.type-pills {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 24rpx 0;
}
.type-pill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 18rpx 0;
  background: #fff;
  border-radius: 16rpx;
  border: 2rpx solid #eee;
}
.type-pill--active {
  border-color: #1c49c2;
  background: #f0f4ff;
}
.type-pill__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}
.type-pill__label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}
.type-pill--active .type-pill__label {
  color: #1c49c2;
  font-weight: 600;
}

/* Category Chips */
.category-section {
  background: #fff;
  margin: 16rpx 24rpx 0;
  border-radius: 16rpx;
  padding: 16rpx 0;
}
.category-scroll {
  white-space: nowrap;
  padding: 0 16rpx;
}
.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  margin-right: 12rpx;
  border-radius: 32rpx;
  background: #f5f6f8;
}
.category-chip--active {
  background: #f0f4ff;
}
.category-chip__icon {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-chip__letter {
  font-size: 22rpx;
  font-weight: 700;
}
.category-chip__text {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}
.category-chip__text--active {
  color: #1c49c2;
  font-weight: 600;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  margin: 12rpx 24rpx 0;
}
.filter-bar__count {
  font-size: 24rpx;
  color: #999;
}
.filter-bar__sorts {
  display: flex;
  gap: 12rpx;
}
.sort-tag {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  background: #f0f0f0;
}
.sort-tag--active {
  background: #1c49c2;
}
.sort-tag__text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}
.sort-tag__text--active {
  color: #fff;
}

/* Product Grid */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 12rpx 24rpx 0;
}
.product-grid__item {
  width: calc(50% - 8rpx);
}

/* Product Card */
.product-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.product-card__img {
  position: relative;
  padding: 16rpx;
}
.product-card__img-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-card__img-letter {
  font-size: 56rpx;
  font-weight: 700;
  opacity: 0.35;
}
.product-card__badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}
.product-card__badge--green {
  background: #e6f7ee;
}
.product-card__badge--blue {
  background: #1c49c2;
  left: auto;
  right: 16rpx;
}
.product-card__badge-text {
  font-size: 20rpx;
  font-weight: 600;
  color: #00a651;
}
.product-card__badge--blue .product-card__badge-text {
  color: #fff;
}

.product-card__body {
  padding: 4rpx 20rpx 20rpx;
}
.product-card__name {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 72rpx;
  margin-bottom: 8rpx;
}
.product-card__rating {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-bottom: 8rpx;
}
.product-card__stars {
  color: #ff6c10;
  font-size: 22rpx;
  letter-spacing: 1rpx;
}
.product-card__score {
  font-size: 22rpx;
  font-weight: 600;
  color: #121212;
}
.product-card__reviews {
  font-size: 20rpx;
  color: #bbb;
}
.product-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-bottom: 12rpx;
}
.product-card__price {
  font-size: 32rpx;
  font-weight: 700;
  color: #bd2848;
}
.product-card__original {
  font-size: 22rpx;
  color: #ccc;
  text-decoration: line-through;
}
.product-card__action {
  width: 100%;
  padding: 14rpx 0;
  background: linear-gradient(135deg, #ff6c10, #ff8533);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-card__action-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
}

/* Status */
.status-tip {
  text-align: center;
  padding: 32rpx;
  color: #bbb;
  font-size: 26rpx;
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}
.empty-state__circle {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28rpx;
}
.empty-state__icon {
  font-size: 52rpx;
  color: #1c49c2;
  font-weight: 700;
}
.empty-state__text {
  font-size: 30rpx;
  color: #666;
  font-weight: 600;
  margin-bottom: 28rpx;
}
.empty-state__btn {
  padding: 16rpx 48rpx;
  background: #1c49c2;
  border-radius: 12rpx;
}
.empty-state__btn-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}
</style>
