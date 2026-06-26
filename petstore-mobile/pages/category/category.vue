<template>
  <view class="page">
    <!-- Header (matches homepage) -->
    <view class="header">
      <view class="header__top">
        <view class="header__logo">
          <view class="header__logo-icon">
            <text class="header__logo-text">P</text>
          </view>
          <text class="header__brand">PetStore</text>
        </view>
        <view class="header__search" @tap="goSearch">
          <view class="header__search-icon-circle">
            <text class="header__search-icon-text">S</text>
          </view>
          <text class="header__search-placeholder">搜索分类...</text>
        </view>
      </view>
    </view>

    <!-- Category Body: Left sidebar + Right content -->
    <view class="category-body">
      <!-- Left Sidebar -->
      <scroll-view scroll-y class="sidebar" :show-scrollbar="false">
        <view
          v-for="(group, idx) in sidebarGroups"
          :key="group.key"
          class="sidebar-item"
          :class="{ 'sidebar-item--active': activeIdx === idx }"
          @tap="activeIdx = idx"
        >
          <view class="sidebar-item__bar" v-if="activeIdx === idx"></view>
          <text class="sidebar-item__label">{{ group.label }}</text>
        </view>
      </scroll-view>

      <!-- Right Content -->
      <scroll-view scroll-y class="content" :show-scrollbar="false">
        <!-- Banner for active group -->
        <view class="content-banner" :style="{ background: activeGroup.bannerBg }">
          <view class="content-banner__text">
            <text class="content-banner__title">{{ activeGroup.bannerTitle }}</text>
            <text class="content-banner__desc">{{ activeGroup.bannerDesc }}</text>
          </view>
          <view class="content-banner__icon-wrap">
            <text class="content-banner__icon" :style="{ color: activeGroup.bannerIconColor }">{{ activeGroup.bannerLetter }}</text>
          </view>
        </view>

        <!-- Subcategories -->
        <view class="content-section">
          <view class="content-section__title-wrap">
            <view class="content-section__bar" :style="{ background: activeGroup.accent }"></view>
            <text class="content-section__title">{{ activeGroup.label }}</text>
          </view>
          <view class="content-grid">
            <view
              v-for="item in activeGroup.items"
              :key="item.key"
              class="content-grid__item"
              @tap="goToList(item.key, activeGroup.productType)"
            >
              <view class="content-grid__icon" :style="{ background: item.bg }">
                <text class="content-grid__letter" :style="{ color: item.color }">{{ item.letter }}</text>
              </view>
              <text class="content-grid__label">{{ item.label }}</text>
            </view>
          </view>
        </view>

        <!-- Hot picks for this category -->
        <view class="content-section">
          <view class="content-section__title-wrap">
            <view class="content-section__bar" :style="{ background: activeGroup.accent }"></view>
            <text class="content-section__title">热门推荐</text>
          </view>
          <view class="hot-list">
            <view
              v-for="item in activeGroup.hotItems"
              :key="item.name"
              class="hot-item"
              @tap="goToDetail(item.id)"
            >
              <view class="hot-item__icon" :style="{ background: activeGroup.bannerBg }">
                <text class="hot-item__letter" :style="{ color: activeGroup.accent }">{{ item.name.charAt(0) }}</text>
              </view>
              <view class="hot-item__info">
                <text class="hot-item__name">{{ item.name }}</text>
                <text class="hot-item__price">¥{{ item.price }}</text>
              </view>
              <view class="hot-item__arrow">
                <text class="hot-item__arrow-text">></text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeIdx = ref(0)

const sidebarGroups = ref([
  {
    key: 'dogs', label: '狗狗', productType: 'pet', accent: '#1c49c2',
    bannerBg: 'linear-gradient(135deg, #eef2ff, #f0f4ff)',
    bannerTitle: '狗狗专区', bannerDesc: '为爱犬精选好物', bannerLetter: '犬', bannerIconColor: '#1c49c2',
    items: [
      { key: 'food', label: '狗粮', letter: '粮', color: '#1c49c2', bg: '#f0f4ff' },
      { key: 'snack', label: '零食', letter: '零', color: '#ff6c10', bg: '#fff5eb' },
      { key: 'toy', label: '玩具', letter: '玩', color: '#00a651', bg: '#e6f7ee' },
      { key: 'clothes', label: '服饰', letter: '衣', color: '#9c27b0', bg: '#f3e5f5' },
      { key: 'wash', label: '洗护', letter: '洗', color: '#e91e63', bg: '#fce4ec' },
      { key: 'medical', label: '医疗', letter: '医', color: '#f44336', bg: '#ffebee' },
    ],
    hotItems: [
      { id: 1, name: '皇家小型犬成犬粮 2kg', price: 159 },
      { id: 10, name: '狗狗磨牙棒洁齿骨', price: 19.9 },
      { id: 11, name: '自动喂食器 5L', price: 89 },
    ],
  },
  {
    key: 'cats', label: '猫咪', productType: 'pet', accent: '#ff6c10',
    bannerBg: 'linear-gradient(135deg, #fff5eb, #fff0e0)',
    bannerTitle: '猫咪专区', bannerDesc: '给喵星人最好的', bannerLetter: '猫', bannerIconColor: '#ff6c10',
    items: [
      { key: 'food', label: '猫粮', letter: '粮', color: '#1c49c2', bg: '#f0f4ff' },
      { key: 'snack', label: '零食', letter: '零', color: '#ff6c10', bg: '#fff5eb' },
      { key: 'litter', label: '猫砂', letter: '砂', color: '#00a651', bg: '#e6f7ee' },
      { key: 'toy', label: '玩具', letter: '玩', color: '#9c27b0', bg: '#f3e5f5' },
      { key: 'scratcher', label: '猫抓板', letter: '抓', color: '#e91e63', bg: '#fce4ec' },
      { key: 'tower', label: '猫爬架', letter: '架', color: '#795548', bg: '#efebe9' },
    ],
    hotItems: [
      { id: 2, name: '渴望六种鱼猫粮 5.4kg', price: 428 },
      { id: 12, name: '猫砂豆腐砂活性炭 6L', price: 29.9 },
      { id: 9, name: '猫咪自动饮水机 静音', price: 79 },
    ],
  },
  {
    key: 'fish', label: '水族', productType: 'supply', accent: '#00a651',
    bannerBg: 'linear-gradient(135deg, #e6f7ee, #f0faf4)',
    bannerTitle: '水族世界', bannerDesc: '鱼缸器材一站购齐', bannerLetter: '鱼', bannerIconColor: '#00a651',
    items: [
      { key: 'tank', label: '鱼缸', letter: '缸', color: '#00a651', bg: '#e6f7ee' },
      { key: 'filter', label: '过滤器', letter: '滤', color: '#1c49c2', bg: '#f0f4ff' },
      { key: 'fishfood', label: '鱼粮', letter: '粮', color: '#ff6c10', bg: '#fff5eb' },
      { key: 'light', label: '鱼灯', letter: '灯', color: '#ffc107', bg: '#fff8e1' },
      { key: 'plant', label: '水草', letter: '草', color: '#4caf50', bg: '#e8f5e9' },
    ],
    hotItems: [
      { id: 20, name: '森森超静音过滤器', price: 69 },
      { id: 21, name: 'LED鱼缸灯防水', price: 45 },
    ],
  },
  {
    key: 'birds', label: '鸟类', productType: 'supply', accent: '#9c27b0',
    bannerBg: 'linear-gradient(135deg, #f3e5f5, #f8eef9)',
    bannerTitle: '鸟语花香', bannerDesc: '鸟儿的快乐家园', bannerLetter: '鸟', bannerIconColor: '#9c27b0',
    items: [
      { key: 'birdfood', label: '鸟粮', letter: '粮', color: '#9c27b0', bg: '#f3e5f5' },
      { key: 'cage', label: '鸟笼', letter: '笼', color: '#795548', bg: '#efebe9' },
      { key: 'toy', label: '玩具', letter: '玩', color: '#ff6c10', bg: '#fff5eb' },
      { key: 'accessory', label: '配件', letter: '配', color: '#607d8b', bg: '#eceff1' },
    ],
    hotItems: [
      { id: 30, name: '混合鸟粮 2kg', price: 25 },
      { id: 31, name: '不锈钢鸟笼 大号', price: 128 },
    ],
  },
  {
    key: 'small', label: '小宠', productType: 'supply', accent: '#e91e63',
    bannerBg: 'linear-gradient(135deg, #fce4ec, #fdf0f3)',
    bannerTitle: '小宠乐园', bannerDesc: '仓鼠兔兔的窝', bannerLetter: '宠', bannerIconColor: '#e91e63',
    items: [
      { key: 'hamster', label: '仓鼠', letter: '鼠', color: '#e91e63', bg: '#fce4ec' },
      { key: 'rabbit', label: '兔子', letter: '兔', color: '#ff6c10', bg: '#fff5eb' },
      { key: 'food', label: '主粮', letter: '粮', color: '#00a651', bg: '#e6f7ee' },
      { key: 'cage', label: '笼子', letter: '笼', color: '#795548', bg: '#efebe9' },
    ],
    hotItems: [
      { id: 40, name: '仓鼠跑轮静音', price: 35 },
      { id: 41, name: '兔子磨牙棒', price: 12.9 },
    ],
  },
  {
    key: 'supplies', label: '宠物周边', productType: 'supply', accent: '#1c49c2',
    bannerBg: 'linear-gradient(135deg, #eef2ff, #fff5eb)',
    bannerTitle: '精选周边', bannerDesc: '正品行货 品质保证', bannerLetter: '品', bannerIconColor: '#1c49c2',
    items: [
      { key: 'royal', label: '皇家', letter: '皇', color: '#1c49c2', bg: '#f0f4ff' },
      { key: 'orijen', label: '渴望', letter: '渴', color: '#ff6c10', bg: '#fff5eb' },
      { key: 'sen', label: '森森', letter: '森', color: '#00a651', bg: '#e6f7ee' },
      { key: 'cute', label: '喵星人', letter: '喵', color: '#e91e63', bg: '#fce4ec' },
      { key: 'love', label: '爱宠', letter: '爱', color: '#9c27b0', bg: '#f3e5f5' },
    ],
    hotItems: [
      { id: 1, name: '皇家小型犬成犬粮 2kg', price: 159 },
      { id: 2, name: '渴望六种鱼猫粮 5.4kg', price: 428 },
    ],
  },
  {
    key: 'services', label: '更多服务', productType: 'supply', accent: '#00a651',
    bannerBg: 'linear-gradient(135deg, #e6f7ee, #f0faf4)',
    bannerTitle: '贴心服务', bannerDesc: '一站式宠物服务平台', bannerLetter: '服', bannerIconColor: '#00a651',
    items: [
      { key: 'shop', label: '附近商店', letter: '店', color: '#00a651', bg: '#e6f7ee' },
      { key: 'video', label: '宠物视频', letter: '视', color: '#ff6c10', bg: '#fff5eb' },
    ],
    hotItems: [],
  },
])

const activeGroup = computed(() => sidebarGroups.value[activeIdx.value])

const goSearch = () => { uni.navigateTo({ url: '/pages/product/list' }) }

const goToList = (category, productType) => {
  if (category === 'shop') { uni.navigateTo({ url: '/pages/shop/nearby' }); return }
  if (category === 'video') { uni.switchTab({ url: '/pages/video/list' }); return }
  uni.navigateTo({ url: `/pages/product/list?category=${category}&productType=${productType}` })
}

const goToDetail = (id) => {
  uni.navigateTo({ url: '/pages/product/detail?id=' + id })
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
}

/* ========== Header ========== */
.header {
  background: linear-gradient(135deg, #1c49c2, #2558d6);
  padding-top: 80rpx;
  padding-bottom: 20rpx;
  flex-shrink: 0;
  z-index: 100;
}
.header__top {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  gap: 20rpx;
}
.header__logo {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;
}
.header__logo-icon {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.header__logo-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}
.header__brand {
  font-size: 34rpx;
  font-weight: 700;
  color: #fff;
}
.header__search {
  flex: 1;
  height: 68rpx;
  background: #fff;
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  gap: 12rpx;
}
.header__search-icon-circle {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #1c49c2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.header__search-icon-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: 700;
}
.header__search-placeholder {
  font-size: 24rpx;
  color: #999;
}

/* ========== Category Body ========== */
.category-body {
  flex: 1;
  display: flex;
  height: 0;
}

/* Left Sidebar */
.sidebar {
  width: 176rpx;
  background: #f0f1f3;
  height: 100%;
  flex-shrink: 0;
}
.sidebar-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110rpx;
  padding: 0 8rpx;
}
.sidebar-item--active {
  background: #fff;
}
.sidebar-item__bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 48rpx;
  border-radius: 0 3rpx 3rpx 0;
  background: #ff6c10;
}
.sidebar-item__label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
  text-align: center;
}
.sidebar-item--active .sidebar-item__label {
  color: #121212;
  font-weight: 700;
}

/* Right Content */
.content {
  flex: 1;
  height: 100%;
  padding: 0 0 160rpx 0;
}

/* Banner */
.content-banner {
  margin: 20rpx 20rpx 0;
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content-banner__text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.content-banner__title {
  font-size: 32rpx;
  font-weight: 700;
  color: #121212;
}
.content-banner__desc {
  font-size: 24rpx;
  color: #666;
}
.content-banner__icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-banner__icon {
  font-size: 44rpx;
  font-weight: 700;
}

/* Section */
.content-section {
  margin: 20rpx 20rpx 0;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}
.content-section__title-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
}
.content-section__bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
}
.content-section__title {
  font-size: 28rpx;
  font-weight: 700;
  color: #121212;
}

/* Grid */
.content-grid {
  display: flex;
  flex-wrap: wrap;
}
.content-grid__item {
  width: 33.333%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
}
.content-grid__icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}
.content-grid__letter {
  font-size: 36rpx;
  font-weight: 700;
}
.content-grid__label {
  font-size: 24rpx;
  color: #4d4d4d;
  font-weight: 500;
}

/* Hot list */
.hot-list {
  display: flex;
  flex-direction: column;
}
.hot-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.hot-item:last-child {
  border-bottom: none;
}
.hot-item__icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hot-item__letter {
  font-size: 32rpx;
  font-weight: 700;
}
.hot-item__info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.hot-item__name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}
.hot-item__price {
  font-size: 28rpx;
  color: #bd2848;
  font-weight: 700;
}
.hot-item__arrow {
  flex-shrink: 0;
  padding: 0 8rpx;
}
.hot-item__arrow-text {
  font-size: 24rpx;
  color: #ccc;
}
</style>
