<template>
  <view class="container">
    <view class="user-card">
      <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" />
      <view v-if="isLoggedIn" class="user-info">
        <text class="username">{{ userInfo.nickname }}</text>
        <text class="user-id">ID: {{ userInfo.id }}</text>
      </view>
      <view v-else class="user-info" @tap="goLogin">
        <text class="login-text">点击登录</text>
      </view>
    </view>

    <view class="order-section">
      <view class="section-title">我的订单</view>
      <view class="order-tabs">
        <view class="tab-item" @tap="goOrders('')">
          <text>全部订单</text>
        </view>
        <view class="tab-item" @tap="goOrders('pending')">
          <text>待付款</text>
        </view>
        <view class="tab-item" @tap="goOrders('shipped')">
          <text>待收货</text>
        </view>
        <view class="tab-item" @tap="goOrders('completed')">
          <text>已完成</text>
        </view>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @tap="goPage('/pages/user/address')">
        <text>收货地址</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/shop/nearby')">
        <text>附近店铺</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/video/list')">
        <text>宠物视频</text>
        <text class="arrow">></text>
      </view>
    </view>

    <button v-if="isLoggedIn" class="logout-btn" @tap="logout">退出登录</button>

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.user)

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
  userStore.logout()
  uni.showToast({ title: '已退出登录', icon: 'success' })
}
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 160rpx;
}

.user-card {
  background: linear-gradient(135deg, #1c49c2, #2d6be0);
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
  border-radius: 0 0 24rpx 24rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
}

.order-section {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #121212;
  margin-bottom: 30rpx;
}

.order-tabs {
  display: flex;
  justify-content: space-around;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 26rpx;
  color: #666;
}

.menu-list {
  background: #fff;
  margin: 20rpx 24rpx 0;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 30rpx;
  border-bottom: 1rpx solid #eeeeee;
  font-size: 28rpx;
  color: #121212;
}

.menu-item:last-child {
  border-bottom: none;
}

.arrow {
  color: #ccc;
  font-size: 28rpx;
}

.logout-btn {
  margin: 40rpx 24rpx;
  background: #fff;
  color: #bd2848;
  font-size: 30rpx;
  border: 2rpx solid #bd2848;
  border-radius: 16rpx;
  font-weight: 600;
}
</style>
