<template>
  <view class="tabbar">
    <view
      v-for="tab in tabs"
      :key="tab.pagePath"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': current === tab.pagePath }"
      @tap="switchTab(tab)"
    >
      <view class="tabbar__icon-wrap">
        <text class="tabbar__icon">{{ tab.icon }}</text>
        <view v-if="tab.badge > 0" class="tabbar__badge">
          <text class="tabbar__badge-text">{{ tab.badge > 99 ? '99+' : tab.badge }}</text>
        </view>
      </view>
      <text class="tabbar__label">{{ tab.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  current: { type: String, default: 'pages/index/index' }
})

const tabs = ref([
  { pagePath: 'pages/index/index', text: '首页', icon: '首', badge: 0 },
  { pagePath: 'pages/category/category', text: '分类', icon: '类', badge: 0 },
  { pagePath: 'pages/video/list', text: '宠物视频', icon: '播', badge: 0 },
  { pagePath: 'pages/cart/cart', text: '购物车', icon: '购', badge: 0 },
  { pagePath: 'pages/user/profile', text: '我的', icon: '我', badge: 0 },
])

onMounted(() => {
  try {
    const cart = uni.getStorageSync('petstore_cart')
    if (Array.isArray(cart)) {
      const total = cart.reduce((s, i) => s + (i.quantity || 1), 0)
      tabs.value[3].badge = total
    }
  } catch {}
})

const switchTab = (tab) => {
  uni.switchTab({ url: '/' + tab.pagePath })
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 130rpx;
  background: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-top: 12rpx;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.08);
  z-index: 999;
  border-top: 1rpx solid #f0f0f0;
}

.tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 6rpx 0 8rpx;
  position: relative;
}

.tabbar__item--active {
  color: #1c49c2;
}

.tabbar__icon-wrap {
  position: relative;
  margin-bottom: 6rpx;
}

.tabbar__icon {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #999;
  font-weight: 600;
  line-height: 1;
}

.tabbar__item--active .tabbar__icon {
  background: #1c49c2;
  color: #fff;
  font-weight: 700;
}

.tabbar__badge {
  position: absolute;
  top: -8rpx;
  right: -18rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  background: #ff6c10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.tabbar__badge-text {
  font-size: 18rpx;
  color: #fff;
  font-weight: 700;
}

.tabbar__label {
  font-size: 22rpx;
  color: #999;
  line-height: 1.3;
}

.tabbar__item--active .tabbar__label {
  color: #1c49c2;
  font-weight: 600;
}
</style>
