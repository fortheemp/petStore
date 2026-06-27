<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="header__top">
        <image class="header__logo" src="/static/icons/paw.png" mode="aspectFit" />
        <text class="header__brand">PetStore</text>
        <view class="header__search" @tap="goSearch">
          <image class="header__search-icon" src="/static/icons/search.png" mode="aspectFit" />
          <text class="header__search-placeholder">搜索商品...</text>
        </view>
      </view>
    </view>

    <!-- Category Body -->
    <view class="category-body">
      <!-- Left Sidebar -->
      <scroll-view scroll-y class="sidebar" :show-scrollbar="false">
        <view
          v-for="sub in sidebarItems"
          :key="sub.key"
          class="sidebar-item"
          :class="{ 'sidebar-item--active': activeKey === sub.key }"
          @tap="selectSub(sub.key)"
        >
          <view class="sidebar-item__bar" v-if="activeKey === sub.key"></view>
          <image class="sidebar-item__icon" :src="sub.icon" mode="aspectFit" />
          <text class="sidebar-item__label">{{ sub.label }}</text>
        </view>

        <!-- 更多服务 -->
        <view class="sidebar-group-header sidebar-group-header--service" @tap="selectSub('service')">
          <text class="sidebar-group-header__label">更多服务</text>
        </view>
      </scroll-view>

      <!-- Right Content -->
      <scroll-view scroll-y class="content" :show-scrollbar="false">
        <view class="content-section">
          <view class="content-section__title-wrap">
            <view class="content-section__bar" style="background: #1c49c2"></view>
            <text class="content-section__title">{{ currentTitle }}</text>
          </view>
          <view class="content-grid">
            <view
              v-for="item in currentGridItems"
              :key="item.label"
              class="content-grid__item"
              @tap="goToList(item.filterCategory, item.productType)"
            >
              <view class="content-grid__icon-wrap" :style="{ background: item.bg }">
                <image class="content-grid__icon" :src="item.icon" mode="aspectFit" />
              </view>
              <text class="content-grid__label">{{ item.label }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeKey = ref('dogs')

const sidebarItems = [
  { key: 'dogs', label: '狗狗', icon: '/static/icons/cat-dogs.png' },
  { key: 'cats', label: '猫咪', icon: '/static/icons/cat-cats.png' },
  { key: 'fish', label: '水族', icon: '/static/icons/cat-fish.png' },
  { key: 'birds', label: '鸟类', icon: '/static/icons/cat-birds.png' },
  { key: 'small', label: '小宠', icon: '/static/icons/cat-small.png' },
]

const detailItems = {
  dogs: [
    { label: '活体', icon: '/static/icons/cat-dogs.png', bg: '#f0f4ff', productType: 'pet', filterCategory: 'dogs' },
    { label: '狗粮', icon: '/static/icons/food-dog.png', bg: '#fff5eb', productType: 'supply', filterCategory: 'dogs' },
    { label: '零食', icon: '/static/icons/snack-dog.png', bg: '#e6f7ee', productType: 'supply', filterCategory: 'dogs' },
    { label: '玩具', icon: '/static/icons/toy-dog.png', bg: '#f3e5f5', productType: 'supply', filterCategory: 'dogs' },
    { label: '项圈牵引', icon: '/static/icons/collar.png', bg: '#fce4ec', productType: 'supply', filterCategory: 'dogs' },
    { label: '清洁护理', icon: '/static/icons/clean.png', bg: '#ffebee', productType: 'supply', filterCategory: 'dogs' },
    { label: '狗窝垫', icon: '/static/icons/bed.png', bg: '#e8f5e9', productType: 'supply', filterCategory: 'dogs' },
  ],
  cats: [
    { label: '活体', icon: '/static/icons/cat-cats.png', bg: '#fff5eb', productType: 'pet', filterCategory: 'cats' },
    { label: '猫粮', icon: '/static/icons/food-cat.png', bg: '#f0f4ff', productType: 'supply', filterCategory: 'cats' },
    { label: '零食', icon: '/static/icons/snack-cat.png', bg: '#e6f7ee', productType: 'supply', filterCategory: 'cats' },
    { label: '猫砂', icon: '/static/icons/litter.png', bg: '#f3e5f5', productType: 'supply', filterCategory: 'cats' },
    { label: '玩具', icon: '/static/icons/toy-cat.png', bg: '#fce4ec', productType: 'supply', filterCategory: 'cats' },
    { label: '猫抓板', icon: '/static/icons/scratcher.png', bg: '#ffebee', productType: 'supply', filterCategory: 'cats' },
    { label: '猫爬架', icon: '/static/icons/cat-tree.png', bg: '#e8f5e9', productType: 'supply', filterCategory: 'cats' },
  ],
  fish: [
    { label: '活体', icon: '/static/icons/cat-fish.png', bg: '#e6f7ee', productType: 'pet', filterCategory: 'fish' },
    { label: '鱼缸', icon: '/static/icons/tank.png', bg: '#f0f4ff', productType: 'supply', filterCategory: 'fish' },
    { label: '过滤器', icon: '/static/icons/filter.png', bg: '#fff5eb', productType: 'supply', filterCategory: 'fish' },
    { label: '鱼粮', icon: '/static/icons/fish-food.png', bg: '#f3e5f5', productType: 'supply', filterCategory: 'fish' },
    { label: '加热棒', icon: '/static/icons/heater.png', bg: '#fce4ec', productType: 'supply', filterCategory: 'fish' },
    { label: '药水', icon: '/static/icons/medicine.png', bg: '#e8f5e9', productType: 'supply', filterCategory: 'fish' },
  ],
  birds: [
    { label: '活体', icon: '/static/icons/cat-birds.png', bg: '#f3e5f5', productType: 'pet', filterCategory: 'birds' },
    { label: '鸟粮', icon: '/static/icons/bird-food.png', bg: '#f0f4ff', productType: 'supply', filterCategory: 'birds' },
    { label: '鸟笼', icon: '/static/icons/cage.png', bg: '#fff5eb', productType: 'supply', filterCategory: 'birds' },
    { label: '玩具', icon: '/static/icons/bird-toy.png', bg: '#e6f7ee', productType: 'supply', filterCategory: 'birds' },
    { label: '站杆', icon: '/static/icons/perch.png', bg: '#fce4ec', productType: 'supply', filterCategory: 'birds' },
  ],
  small: [
    { label: '活体', icon: '/static/icons/cat-small.png', bg: '#fce4ec', productType: 'pet', filterCategory: 'small' },
    { label: '仓鼠', icon: '/static/icons/hamster.png', bg: '#f0f4ff', productType: 'supply', filterCategory: 'small' },
    { label: '兔子', icon: '/static/icons/rabbit.png', bg: '#fff5eb', productType: 'supply', filterCategory: 'small' },
    { label: '喂食器', icon: '/static/icons/feeder.png', bg: '#e6f7ee', productType: 'supply', filterCategory: 'small' },
    { label: '笼子', icon: '/static/icons/hamster-cage.png', bg: '#f3e5f5', productType: 'supply', filterCategory: 'small' },
    { label: '跑轮', icon: '/static/icons/wheel.png', bg: '#ffebee', productType: 'supply', filterCategory: 'small' },
    { label: '垫料', icon: '/static/icons/bedding.png', bg: '#e8f5e9', productType: 'supply', filterCategory: 'small' },
  ],
  service: [
    { label: '附近商店', icon: '/static/icons/menu-shop.png', bg: '#e6f7ee', productType: 'supply', filterCategory: 'shop' },
    { label: '宠物视频', icon: '/static/icons/menu-video.png', bg: '#fff5eb', productType: 'supply', filterCategory: 'video' },
  ],
}

const currentTitle = computed(() => {
  const found = sidebarItems.find(s => s.key === activeKey.value)
  return found ? found.label : '更多服务'
})

const currentGridItems = computed(() => detailItems[activeKey.value] || [])

const selectSub = (key) => { activeKey.value = key }

const goSearch = () => { uni.navigateTo({ url: '/pages/product/list' }) }

const goToList = (category, productType) => {
  if (category === 'shop') { uni.navigateTo({ url: '/pages/shop/nearby' }); return }
  if (category === 'video') { uni.switchTab({ url: '/pages/video/list' }); return }
  uni.navigateTo({ url: `/pages/product/list?category=${category}&productType=${productType}` })
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
  gap: 16rpx;
}
.header__logo { width: 56rpx; height: 56rpx; flex-shrink: 0; }
.header__brand { font-size: 34rpx; font-weight: 700; color: #fff; flex-shrink: 0; }
.header__search {
  flex: 1; height: 68rpx; background: rgba(255,255,255,0.95);
  border-radius: 34rpx; display: flex; align-items: center; padding: 0 24rpx; gap: 12rpx;
}
.header__search-icon { width: 36rpx; height: 36rpx; flex-shrink: 0; }
.header__search-placeholder { font-size: 24rpx; color: #999; }

/* ========== Body ========== */
.category-body { flex: 1; display: flex; height: 0; }

/* Sidebar */
.sidebar { width: 176rpx; background: #f0f1f3; height: 100%; flex-shrink: 0; }

.sidebar-group-header {
  display: flex; flex-direction: row; align-items: center; justify-content: flex-start;
  height: 80rpx; gap: 10rpx; background: #e8e9eb; padding: 0 16rpx;
  border-left: 6rpx solid transparent;
}
.sidebar-group-header--service { background: #e4e8df; }
.sidebar-group-header__label { font-size: 22rpx; color: #888; font-weight: 700; letter-spacing: 1rpx; }

.sidebar-item {
  position: relative; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 100rpx; padding: 8rpx; gap: 4rpx;
}
.sidebar-item--active { background: #fff; }
.sidebar-item__bar {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 6rpx; height: 40rpx; border-radius: 0 3rpx 3rpx 0; background: #ff6c10;
}
.sidebar-item__icon { width: 36rpx; height: 36rpx; }
.sidebar-item__label { font-size: 20rpx; color: #666; font-weight: 500; text-align: center; }
.sidebar-item--active .sidebar-item__label { color: #121212; font-weight: 700; }

/* Content */
.content { flex: 1; height: 100%; padding: 0 0 160rpx 0; }

.content-section {
  margin: 20rpx 20rpx 0; background: #fff; border-radius: 16rpx; padding: 24rpx;
}
.content-section__title-wrap { display: flex; align-items: center; gap: 10rpx; margin-bottom: 20rpx; }
.content-section__bar { width: 6rpx; height: 28rpx; border-radius: 3rpx; }
.content-section__title { font-size: 28rpx; font-weight: 700; color: #121212; }

.content-grid { display: flex; flex-wrap: wrap; }
.content-grid__item {
  width: 33.333%; display: flex; flex-direction: column;
  align-items: center; padding: 16rpx 0;
}
.content-grid__icon-wrap {
  width: 96rpx; height: 96rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin-bottom: 12rpx;
}
.content-grid__icon { width: 48rpx; height: 48rpx; }
.content-grid__label { font-size: 22rpx; color: #4d4d4d; font-weight: 500; }
</style>
