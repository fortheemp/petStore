<template>
  <view class="container">
    <!-- Status Tabs -->
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: currentTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @tap="switchTab(item.value)"
      >
        {{ item.label }}
      </view>
    </view>

    <!-- Order List -->
    <scroll-view scroll-y class="order-list">
      <view v-if="filteredOrders.length > 0">
        <view
          class="order-card"
          v-for="order in filteredOrders"
          :key="order.id"
          @tap="goDetail(order.id)"
        >
          <view class="order-header">
            <text class="order-no">订单号：{{ order.orderNo }}</text>
            <text class="order-status" :style="{ color: getStatusColor(order.status) }">
              {{ getStatusText(order.status) }}
            </text>
          </view>
          <view class="order-item" v-for="item in order.items" :key="item.productId || item.id">
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
          <view class="order-footer">
            <text class="total-text">
              共{{ get_order_totalCount(order) }}件 合计：
            </text>
            <text class="total-price">¥{{ order.totalPrice.toFixed(2) }}</text>
          </view>
        </view>
      </view>

      <!-- Empty State -->
      <view v-else class="empty">
        <view class="empty-icon-circle">
          <text class="empty-icon-text">订</text>
        </view>
        <text class="empty-text">暂无相关订单</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const mockOrders = [
  { id: 1, orderNo: 'PS20251220001', status: 1, statusText: '待付款', items: [{ productId: 1, name: '皇家小型犬成犬粮 2kg', price: 159, quantity: 1, spec: '2kg 标准装' }], goodsTotal: 159, freight: 0, totalPrice: 159, createTime: '2025-12-20 14:30:00' },
  { id: 2, orderNo: 'PS20251218002', status: 2, statusText: '待发货', items: [{ productId: 2, name: '渴望六种鱼猫粮 5.4kg', price: 428, quantity: 1, spec: '5.4kg 标准装' }], goodsTotal: 428, freight: 0, totalPrice: 428, createTime: '2025-12-18 10:15:00', payMethod: '微信支付' },
  { id: 3, orderNo: 'PS20251215003', status: 3, statusText: '待收货', items: [{ productId: 12, name: '猫砂豆腐砂活性炭 6L', price: 29.9, quantity: 2, spec: '标准款' }, { productId: 9, name: '猫咪自动饮水机', price: 79, quantity: 1, spec: '标准款' }], goodsTotal: 138.8, freight: 0, totalPrice: 138.8, createTime: '2025-12-15 09:00:00', payMethod: '支付宝' },
  { id: 4, orderNo: 'PS20251210004', status: 4, statusText: '已完成', items: [{ productId: 4, name: '猫抓板瓦楞纸耐磨款', price: 29.9, quantity: 3, spec: '标准款' }], goodsTotal: 89.7, freight: 0, totalPrice: 89.7, createTime: '2025-12-10 16:45:00', payMethod: '微信支付', reviewed: true },
  { id: 5, orderNo: 'PS20251205005', status: 4, statusText: '已完成', items: [{ productId: 22, name: '柯基犬幼犬 2月龄 已驱虫', price: 2800, quantity: 1, spec: '标准款' }], goodsTotal: 2800, freight: 0, totalPrice: 2800, createTime: '2025-12-05 11:20:00', payMethod: '支付宝', reviewed: false },
]

const currentTab = ref(0)
const tabs = [
  { label: '全部', value: 0 },
  { label: '待付款', value: 1 },
  { label: '待发货', value: 2 },
  { label: '待收货', value: 3 },
  { label: '已完成', value: 4 }
]

const orders = ref([])

const filteredOrders = computed(() => {
  if (currentTab.value === 0) return orders.value
  return orders.value.filter(o => o.status === currentTab.value)
})

const getStatusText = (status) => {
  const map = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '已完成',
    5: '已取消'
  }
  return map[status] || '未知状态'
}

const getStatusColor = (status) => {
  const map = {
    1: '#ff9800',
    2: '#1c49c2',
    3: '#1c49c2',
    4: '#999999',
    5: '#999999'
  }
  return map[status] || '#999999'
}

const get_order_totalCount = (order) => {
  if (order.totalCount) return order.totalCount
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const loadOrders = () => {
  // Load from localStorage first
  const stored = uni.getStorageSync('petstore_orders')
  if (stored && Array.isArray(stored) && stored.length > 0) {
    orders.value = stored
  } else {
    // Fallback to mockOrders
    orders.value = [...mockOrders]
  }
}

const switchTab = (value) => {
  currentTab.value = value
}

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}

// Use onShow to refresh data each time the page is shown
onShow(() => {
  loadOrders()
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Tabs */
.tabs {
  display: flex;
  background: #fff;
  padding: 16rpx 24rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 16rpx 0;
  position: relative;
}

.tab-item.active {
  color: #1c49c2;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 4rpx;
  background: #1c49c2;
  border-radius: 2rpx;
}

/* Order List */
.order-list {
  height: calc(100vh - 90rpx);
}

.order-card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-no {
  font-size: 24rpx;
  color: #999;
}

.order-status {
  font-size: 26rpx;
  font-weight: bold;
}

/* Order Item */
.order-item {
  display: flex;
  padding: 16rpx 0;
}

.item-image {
  width: 140rpx;
  height: 140rpx;
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
  margin-top: 6rpx;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 28rpx;
  color: #bd2848;
  font-weight: bold;
}

.item-qty {
  font-size: 26rpx;
  color: #999;
}

/* Footer */
.order-footer {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
  text-align: right;
}

.total-text {
  font-size: 28rpx;
}

.total-price {
  color: #bd2848;
  font-size: 32rpx;
  font-weight: bold;
}

/* Empty State */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0;
}

.empty-icon-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.empty-icon-text {
  font-size: 48rpx;
  color: #1c49c2;
  font-weight: 700;
}

.empty-text {
  display: block;
  color: #4d4d4d;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
