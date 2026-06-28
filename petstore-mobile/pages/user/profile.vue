<template>
  <view class="container">
    <!-- User Card -->
    <view class="user-card">
      <view class="avatar-wrap">
        <image
          v-if="avatarUrl"
          class="avatar"
          :src="avatarUrl"
          mode="aspectFill"
        />
        <view v-else class="avatar avatar--text">
          <text class="avatar-letter">{{ (userInfo.nickname || userInfo.username || '?').charAt(0) }}</text>
        </view>
      </view>
      <view v-if="isLoggedIn" class="user-info">
        <text class="username">{{ userInfo.nickname || userInfo.username }}</text>
        <text class="user-id">ID: {{ userInfo.id }}</text>
      </view>
      <view v-else class="user-info" @tap="goLogin">
        <text class="login-text">点击登录</text>
      </view>
    </view>

    <!-- Order Section -->
    <view class="card">
      <view class="card__header">
        <text class="card__title">我的订单</text>
        <text class="card__more" @tap="goOrders('')">查看全部 ></text>
      </view>
      <view class="order-tabs">
        <view class="tab-item" @tap="goOrders('pending')">
          <view class="tab-icon tab-icon--pay">
            <image class="tab-icon-img" src="/static/icons/order-pay.png" mode="aspectFit" />
          </view>
          <text class="tab-label">待付款</text>
        </view>
        <view class="tab-item" @tap="goOrders('shipped')">
          <view class="tab-icon tab-icon--ship">
            <image class="tab-icon-img" src="/static/icons/order-ship.png" mode="aspectFit" />
          </view>
          <text class="tab-label">待收货</text>
        </view>
        <view class="tab-item" @tap="goOrders('review')">
          <view class="tab-icon tab-icon--review">
            <image class="tab-icon-img" src="/static/icons/order-review.png" mode="aspectFit" />
          </view>
          <text class="tab-label">待评价</text>
        </view>
        <view class="tab-item" @tap="goOrders('completed')">
          <view class="tab-icon tab-icon--done">
            <image class="tab-icon-img" src="/static/icons/order-done.png" mode="aspectFit" />
          </view>
          <text class="tab-label">已完成</text>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="card">
      <view class="menu-item" @tap="goPage('/pages/user/address')">
        <view class="menu-left">
          <image class="menu-icon-img" src="/static/icons/menu-address.png" mode="aspectFit" />
          <text class="menu-text">收货地址</text>
        </view>
        <image class="menu-arrow-img" src="/static/icons/arrow.png" mode="aspectFit" />
      </view>
      <view class="menu-item" @tap="goPage('/pages/shop/nearby')">
        <view class="menu-left">
          <image class="menu-icon-img" src="/static/icons/menu-shop.png" mode="aspectFit" />
          <text class="menu-text">附近店铺</text>
        </view>
        <image class="menu-arrow-img" src="/static/icons/arrow.png" mode="aspectFit" />
      </view>
      <view class="menu-item" @tap="goPage('/pages/video/list')">
        <view class="menu-left">
          <image class="menu-icon-img" src="/static/icons/menu-video.png" mode="aspectFit" />
          <text class="menu-text">宠物视频</text>
        </view>
        <image class="menu-arrow-img" src="/static/icons/arrow.png" mode="aspectFit" />
      </view>
    </view>

    <!-- Logout -->
    <view v-if="isLoggedIn" class="logout-wrap">
      <view class="logout-btn" @tap="logout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getProfile } from '@/services/user'
import { fixImageUrl } from '@/services/request'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.user)
const avatarUrl = computed(() => fixImageUrl(userInfo.value?.avatar || ''))

const goLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

const goOrders = (status) => {
  uni.navigateTo({ url: `/pages/order/list?status=${status}` })
}

const goPage = (url) => {
  if (url === '/pages/video/list') {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}

onShow(async () => {
  if (!isLoggedIn.value) return
  try {
    const profile = await getProfile(userInfo.value.id)
    if (profile) userStore.updateUserInfo(profile)
  } catch {}
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 160rpx;
}

/* User Card */
.user-card {
  background: linear-gradient(135deg, #1c49c2, #2d6be0);
  padding: 80rpx 40rpx 48rpx;
  display: flex;
  align-items: center;
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.avatar--text {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.avatar-letter {
  font-size: 52rpx;
  font-weight: 700;
  color: #fff;
}

.user-info {
  margin-left: 30rpx;
  color: #fff;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}

.user-id {
  font-size: 24rpx;
  opacity: 0.8;
  display: block;
  margin-top: 10rpx;
}

.login-text {
  font-size: 32rpx;
  color: #fff;
}

/* Card */
.card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card__title {
  font-size: 30rpx;
  font-weight: 700;
  color: #121212;
}

.card__more {
  font-size: 24rpx;
  color: #1c49c2;
}

/* Order Tabs */
.order-tabs {
  display: flex;
  justify-content: space-around;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 0;
}

.tab-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.tab-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.tab-icon--pay { background: #fff5eb; }
.tab-icon--ship { background: #f0f4ff; }
.tab-icon--review { background: #e6f7ee; }
.tab-icon--done { background: #fde8ee; }

.tab-label {
  font-size: 24rpx;
  color: #666;
}

/* Menu */
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.menu-icon-img {
  width: 36rpx;
  height: 36rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #121212;
}

.menu-arrow-img {
  width: 28rpx;
  height: 28rpx;
}

/* Logout */
.logout-wrap {
  margin: 40rpx 24rpx 0;
}

.logout-btn {
  background: #fff;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  border: 2rpx solid #bd2848;
}

.logout-text {
  color: #bd2848;
  font-size: 30rpx;
  font-weight: 600;
}
</style>
