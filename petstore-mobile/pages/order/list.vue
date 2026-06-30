<template>
  <view class="root">
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
            <text v-if="order.createTime" class="order-time">{{ formatTime(order.createTime) }}</text>
            <text class="order-status" :style="{ color: getStatusColor(order.status) }">
              {{ getStatusText(order.status) }}
            </text>
          </view>
          <view class="order-item" v-for="item in order.items" :key="item.productId || item.id">
            <view class="item-image">
              <image v-if="item.image" class="item-image-img" :src="item.image" mode="aspectFill" />
              <text v-else class="item-image-text">{{ item.name.charAt(0) }}</text>
            </view>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-spec" v-if="item.spec">{{ item.spec }}</text>
              <view class="item-bottom">
                <text class="item-price">¥{{ (Number(item.price) || 0).toFixed(2) }}</text>
                <text class="item-qty">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
          <view class="order-footer">
            <text class="total-text">
              共{{ get_order_totalCount(order) }}件 合计：
            </text>
            <text class="total-price">¥{{ (order.payAmount || order.totalPrice || 0).toFixed(2) }}</text>
          </view>
          <view class="order-actions">
            <view class="action-btn" @tap.stop="goDetail(order.id)">
              <text class="action-btn-text">查看详情</text>
            </view>
            <view v-if="order.status === 0" class="action-btn" @tap.stop="cancelOrder(order.id)">
              <text class="action-btn-text">取消订单</text>
            </view>
            <view v-if="order.status === 0" class="action-btn action-btn--primary" @tap.stop="payOrder(order.id)">
              <text class="action-btn-text action-btn-text--white">去付款</text>
            </view>
            <view v-if="order.status === 2 || order.status === 3" class="action-btn action-btn--refund" @tap.stop="openRefundDialog(order)">
              <text class="action-btn-text action-btn-text--refund">申请退单</text>
            </view>
            <view v-if="order.status === 2" class="action-btn action-btn--primary" @tap.stop="confirmOrder(order.id)">
              <text class="action-btn-text action-btn-text--white">确认收货</text>
            </view>
            <view v-if="order.status === 3 && !order.reviewed" class="action-btn action-btn--primary" @tap.stop="goReview(order.id)">
              <text class="action-btn-text action-btn-text--white">写评价</text>
            </view>
          </view>
          <!-- 退单原因/状态 -->
          <view v-if="order.status === -2 || order.status === -3 || order.status === -4" class="refund-info">
            <text class="refund-info__label">退单原因：</text>
            <text class="refund-info__reason">{{ order.refundReason || '未填写' }}</text>
          </view>
          <view v-if="(order.status === 2 || order.status === 3) && order.refundReason" class="refund-rejected">
            <text>退单被拒绝：{{ order.refundReason }}</text>
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

    <!-- 退单原因弹窗 -->
    <view v-if="showRefundDialog" class="dialog-mask" @tap.self="showRefundDialog = false">
      <view class="dialog">
        <text class="dialog__title">申请退单</text>
        <text class="dialog__hint">请填写退单原因，提交后等待管理员审核。</text>
        <textarea
          class="dialog__textarea"
          v-model="refundReason"
          placeholder="请输入退单原因（可不填）"
          :maxlength="200"
        ></textarea>
        <view class="dialog__actions">
          <view class="dialog__btn dialog__btn--cancel" @tap="showRefundDialog = false">
            <text class="dialog__btn-text">取消</text>
          </view>
          <view class="dialog__btn dialog__btn--confirm" @tap="submitRefund">
            <text class="dialog__btn-text dialog__btn-text--white">提交申请</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getOrderList, payOrder as payOrderApi, cancelOrder as cancelOrderApi, confirmOrder as confirmOrderApi, refundOrder as refundOrderApi } from '@/services/order'

const STATUS_QUERY_MAP = {
  pending: 0,
  shipped: 2,
  review: 3,
  completed: 4,
}

const currentTab = ref(null)
const tabs = [
  { label: '全部', value: null },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 }
]

const orders = ref([])

const filteredOrders = computed(() => {
  if (currentTab.value === null) return orders.value
  return orders.value.filter(o => o.status === currentTab.value)
})

const getStatusText = (status) => {
  const map = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '待评价',
    4: '已完成',
    '-1': '已取消',
    '-2': '退款申请中',
    '-3': '退款成功',
    '-4': '管理员退单',
  }
  return map[String(status)] || '未知'
}

const getStatusColor = (status) => {
  const map = {
    0: '#ff6c10',
    1: '#1c49c2',
    2: '#1c49c2',
    3: '#999999',
    4: '#52c41a',
    '-1': '#999999',
    '-2': '#ff4d4f',
    '-3': '#52c41a',
    '-4': '#ff4d4f',
  }
  return map[String(status)] || '#999999'
}

const get_order_totalCount = (order) => {
  if (order.totalCount) return order.totalCount
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const loadOrders = async () => {
  try {
    const list = await getOrderList()
    const arr = Array.isArray(list) ? list : []
    arr.sort((a, b) => {
      const ta = a.createTime ? new Date(a.createTime).getTime() : 0
      const tb = b.createTime ? new Date(b.createTime).getTime() : 0
      return tb - ta
    })
    orders.value = arr
  } catch {
    orders.value = []
  }
}

const formatTime = (t) => {
  if (!t) return ''
  const d = new Date(t)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const switchTab = (value) => {
  currentTab.value = value
}

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}

const goReview = (id) => {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}&review=1` })
}

const payOrder = async (id) => {
  try {
    await payOrderApi(id)
    uni.showToast({ title: '支付成功', icon: 'success' })
    loadOrders()
  } catch {}
}

const cancelOrder = async (id) => {
  uni.showModal({
    title: '提示',
    content: '确定取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrderApi(id)
          uni.showToast({ title: '订单已取消', icon: 'success' })
          loadOrders()
        } catch {}
      }
    },
  })
}

const confirmOrder = async (id) => {
  try {
    await confirmOrderApi(id)
    uni.showToast({ title: '已确认收货', icon: 'success' })
    loadOrders()
  } catch {}
}

// 退单相关
const showRefundDialog = ref(false)
const refundTarget = ref(null)
const refundReason = ref('')

const openRefundDialog = (order) => {
  refundTarget.value = order
  refundReason.value = ''
  showRefundDialog.value = true
}

const submitRefund = async () => {
  if (!refundTarget.value) return
  try {
    await refundOrderApi(refundTarget.value.id, { reason: refundReason.value })
    showRefundDialog.value = false
    refundTarget.value = null
    uni.showToast({ title: '退单申请已提交', icon: 'success' })
    loadOrders()
  } catch (e) {
    uni.showToast({ title: '退单申请失败', icon: 'none' })
  }
}

// Read query param on first show, then load orders
let firstShow = true
onShow(() => {
  if (firstShow) {
    firstShow = false
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    const status = page?.$page?.options?.status || page?.options?.status
    if (status) {
      const tabValue = STATUS_QUERY_MAP[status]
      if (tabValue !== undefined) currentTab.value = tabValue
    }
  }
  loadOrders()
})
</script>

<style scoped>
.root {
  position: relative;
  min-height: 100vh;
}

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

.order-time {
  font-size: 22rpx;
  color: #bbb;
  margin-left: 12rpx;
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.item-image-img {
  width: 100%;
  height: 100%;
}

.item-image-text {
  font-size: 44rpx;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.06);
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

/* Actions */
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.action-btn {
  padding: 0 24rpx;
  height: 56rpx;
  border-radius: 12rpx;
  border: 1rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn--primary {
  background: #ff6c10;
  border-color: #ff6c10;
}

.action-btn-text {
  font-size: 24rpx;
  color: #666;
}

.action-btn-text--white {
  color: #fff;
}

.action-btn--refund {
  border-color: #e74c3c;
}

.action-btn-text--refund {
  color: #e74c3c;
}

/* Refund Info */
.refund-info {
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: #fff8f8;
  border-radius: 12rpx;
  font-size: 24rpx;
}

.refund-info__label {
  color: #999;
}

.refund-info__reason {
  color: #e74c3c;
  font-weight: 500;
}

.refund-rejected {
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: #fff3f0;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #e74c3c;
}

/* Dialog */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog {
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  width: 600rpx;
  max-width: 85vw;
}

.dialog__title {
  font-size: 34rpx;
  font-weight: 700;
  color: #121212;
  margin-bottom: 12rpx;
  display: block;
}

.dialog__hint {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 24rpx;
  display: block;
}

.dialog__textarea {
  width: 100%;
  min-height: 180rpx;
  border: 2rpx solid #ddd;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  background: #fff;
  outline: none;
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 32rpx;
}

.dialog__btn {
  padding: 16rpx 40rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog__btn--cancel {
  background: #f5f5f5;
}

.dialog__btn--confirm {
  background: #e74c3c;
}

.dialog__btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #666;
}

.dialog__btn-text--white {
  color: #fff;
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
