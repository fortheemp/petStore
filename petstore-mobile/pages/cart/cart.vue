<template>
  <view class="page">
    <!-- Empty state -->
    <view v-if="cart.items.length === 0" class="empty">
      <view class="empty-circle">
        <text class="empty-icon-text">购</text>
      </view>
      <text class="empty-text">购物车是空的</text>
      <text class="empty-hint">去挑选心仪的商品吧</text>
      <button class="empty-btn" @tap="goHome">去逛逛</button>
    </view>

    <!-- Cart list -->
    <view v-else class="cart-list">
      <view class="cart-item" v-for="item in cart.items" :key="item.id">
        <image class="item-image" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-spec">标准款</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price }}</text>
            <view class="quantity-control">
              <view
                class="qty-btn minus"
                :class="{ disabled: item.quantity <= 1 }"
                @tap="onMinus(item)"
              >-</view>
              <text class="qty-num">{{ item.quantity }}</text>
              <view class="qty-btn plus" @tap="onPlus(item)">+</view>
            </view>
          </view>
        </view>
        <view class="delete-btn" @tap="onRemove(item)">
          <text class="delete-text">删除</text>
        </view>
      </view>
    </view>

    <!-- Bottom bar -->
    <view v-if="cart.items.length > 0" class="bottom-bar">
      <view class="total-area">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ cart.totalPrice.toFixed(2) }}</text>
      </view>
      <button class="checkout-btn" @tap="goCheckout">去结算({{ cart.totalItems }})</button>
    </view>

  </view>
</template>

<script setup>
import { computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const updateTitle = () => {
  uni.setNavigationBarTitle({ title: `购物车(${cart.totalItems})` })
}

// Update title whenever totalItems changes
watch(() => cart.totalItems, updateTitle)

// Also refresh title when page is shown (e.g. returning from product detail)
onShow(() => {
  cart.loadCart()
  updateTitle()
})

const onMinus = (item) => {
  if (item.quantity <= 1) {
    cart.removeItem(item.id)
  } else {
    cart.updateQuantity(item.id, item.quantity - 1)
  }
}

const onPlus = (item) => {
  cart.updateQuantity(item.id, item.quantity + 1)
}

const onRemove = (item) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该商品吗？',
    success: (res) => {
      if (res.confirm) {
        cart.removeItem(item.id)
      }
    },
  })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const goCheckout = () => {
  uni.navigateTo({ url: '/pages/order/checkout' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 160rpx;
}

/* Empty state */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 260rpx;
}

.empty-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.empty-icon-text {
  font-size: 56rpx;
  color: #1c49c2;
  font-weight: 700;
}

.empty-text {
  font-size: 30rpx;
  color: #4d4d4d;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.empty-btn {
  background: #ff6c10;
  color: #fff;
  font-size: 28rpx;
  padding: 16rpx 80rpx;
  border-radius: 16rpx;
  line-height: 1.5;
  font-weight: 600;
}

/* Cart list */
.cart-list {
  padding: 20rpx 0;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  background: #fff;
  padding: 24rpx 24rpx;
  margin: 0 24rpx 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.item-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  background: #f8f9fa;
}

.item-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.item-price {
  font-size: 34rpx;
  color: #bd2848;
  font-weight: bold;
}

/* Quantity controls */
.quantity-control {
  display: flex;
  align-items: center;
}

.qty-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
}

.qty-btn.minus {
  background: #f0f0f0;
  color: #666;
}

.qty-btn.minus.disabled {
  color: #ccc;
}

.qty-btn.plus {
  background: #1c49c2;
  color: #fff;
}

.qty-num {
  width: 64rpx;
  text-align: center;
  font-size: 28rpx;
}

/* Delete button */
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 180rpx;
  flex-shrink: 0;
}

.delete-text {
  font-size: 24rpx;
  color: #999;
}

/* Bottom bar */
.bottom-bar {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.total-area {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 38rpx;
  color: #bd2848;
  font-weight: bold;
}

.checkout-btn {
  background: #ff6c10;
  color: #fff;
  font-size: 30rpx;
  padding: 0 48rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 16rpx;
  text-align: center;
  font-weight: 600;
}
</style>
