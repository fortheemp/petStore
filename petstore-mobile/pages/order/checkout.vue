<template>
  <view class="container">
    <!-- Address Section -->
    <view class="address-section" @tap="selectAddress">
      <view v-if="address" class="address-info">
        <view class="address-top">
          <text class="name">{{ address.name }}</text>
          <text class="phone">{{ address.phone }}</text>
        </view>
        <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
      </view>
      <view v-else class="no-address">
        <text>请选择收货地址</text>
      </view>
      <text class="arrow">></text>
    </view>

    <!-- Order Items -->
    <view class="order-section">
      <view class="section-title">商品清单</view>
      <view class="order-item" v-for="item in orderItems" :key="item.id">
        <image class="item-image" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-spec" v-if="item.spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price.toFixed(2) }}</text>
            <text class="item-qty">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
      <view v-if="orderItems.length === 0" class="empty">
        <text>没有待结算的商品</text>
      </view>
    </view>

    <!-- Price Summary -->
    <view class="summary-section">
      <view class="summary-row">
        <text>商品金额</text>
        <text>¥{{ goodsTotal }}</text>
      </view>
      <view class="summary-row">
        <text>运费</text>
        <text>¥{{ freight.toFixed(2) }}</text>
      </view>
      <view class="summary-row total">
        <text>合计</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- Footer -->
    <view class="footer">
      <view class="footer-info">
        <text>共{{ totalCount }}件</text>
        <text class="footer-price">合计：¥{{ totalPrice }}</text>
      </view>
      <button class="submit-btn" @tap="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const mockAddresses = [
  { id: 1, name: '张三', phone: '13800138000', province: '北京市', city: '北京市', district: '朝阳区', detail: '宠物大道100号1栋1单元101', isDefault: true },
  { id: 2, name: '张三', phone: '13800138000', province: '北京市', city: '北京市', district: '海淀区', detail: '中关村大街50号', isDefault: false },
]

const address = ref(null)
const orderItems = ref([])
const freight = ref(0)

const goodsTotal = computed(() => {
  return orderItems.value
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2)
})

const totalCount = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return (parseFloat(goodsTotal.value) + freight.value).toFixed(2)
})

// Load checkout items from URL params or localStorage
const loadCheckoutItems = (options) => {
  // Try URL params first
  if (options?.items) {
    try {
      orderItems.value = JSON.parse(decodeURIComponent(options.items))
    } catch (e) {
      orderItems.value = []
    }
  }

  // Fallback to localStorage
  if (orderItems.value.length === 0) {
    const stored = uni.getStorageSync('petstore_checkout_items')
    if (stored) {
      try {
        orderItems.value = typeof stored === 'string' ? JSON.parse(stored) : stored
      } catch (e) {
        orderItems.value = []
      }
    }
  }
}

// Load default address
const loadDefaultAddress = () => {
  address.value = mockAddresses.find(a => a.isDefault) || mockAddresses[0] || null
}

const selectAddress = () => {
  uni.navigateTo({ url: '/pages/user/address?select=1' })
}

const submitOrder = () => {
  if (!address.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  if (orderItems.value.length === 0) {
    uni.showToast({ title: '订单商品不能为空', icon: 'none' })
    return
  }

  // Build order object
  const order = {
    id: Date.now(),
    orderNo: 'PS' + Date.now(),
    status: 1,
    statusText: '待付款',
    address: { ...address.value },
    items: orderItems.value.map(item => ({ ...item })),
    goodsTotal: parseFloat(goodsTotal.value),
    freight: freight.value,
    totalPrice: parseFloat(totalPrice.value),
    totalCount: totalCount.value,
    createTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\//g, '-'),
    payMethod: ''
  }

  // Save order to localStorage
  const orders = uni.getStorageSync('petstore_orders') || []
  orders.unshift(order)
  uni.setStorageSync('petstore_orders', orders)

  // Clear checkout items from localStorage
  uni.removeStorageSync('petstore_checkout_items')
  uni.removeStorageSync('petstore_cart')

  uni.showToast({ title: '订单提交成功', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({ url: '/pages/order/list' })
  }, 1500)
}

// Initialize
onLoad((options) => {
  loadDefaultAddress()
  loadCheckoutItems(options)
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* Address */
.address-section {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
}

.address-info {
  flex: 1;
}

.address-top {
  margin-bottom: 10rpx;
}

.name {
  font-size: 30rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.address-detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.no-address {
  flex: 1;
  color: #999;
  font-size: 28rpx;
}

.arrow {
  color: #ccc;
  font-size: 28rpx;
  margin-left: 10rpx;
}

/* Order Items */
.order-section {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.order-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  background: #f8f9fa;
}

.item-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 28rpx;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.item-price {
  font-size: 30rpx;
  color: #bd2848;
  font-weight: bold;
}

.item-qty {
  font-size: 26rpx;
  color: #999;
}

.empty {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* Summary */
.summary-section {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 28rpx;
}

.summary-row.total {
  border-top: 1rpx solid #f5f5f5;
  margin-top: 10rpx;
  padding-top: 20rpx;
}

.total-price {
  color: #bd2848;
  font-size: 34rpx;
  font-weight: bold;
}

/* Footer */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.footer-info {
  flex: 1;
  font-size: 26rpx;
}

.footer-price {
  color: #bd2848;
  font-size: 34rpx;
  font-weight: bold;
}

.submit-btn {
  background: #ff6c10;
  color: #fff;
  font-size: 30rpx;
  padding: 0 40rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 16rpx;
  font-weight: 600;
}
</style>
