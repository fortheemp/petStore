<template>
  <view class="root">
  <view class="container">
    <!-- Status Bar -->
    <view class="status-bar">
      <text class="status-text">{{ statusText }}</text>
    </view>

    <!-- Progress Steps (from PC .status-bar) -->
    <view v-if="order.status !== -1 && order.status !== 5" class="progress-section">
      <view
        v-for="(step, index) in steps"
        :key="step.label"
        class="progress-step"
        :class="{
          'progress-step--completed': index <= currentStepIndex,
          'progress-step--active': index === currentStepIndex,
        }"
      >
        <view class="progress-step__icon">
          <text v-if="index <= currentStepIndex" class="progress-check">✓</text>
          <text v-else class="progress-num">{{ index + 1 }}</text>
        </view>
        <text class="progress-step__text">{{ step.label }}</text>
      </view>
    </view>

    <!-- Cancelled Banner -->
    <view v-if="order.status === -1 || order.status === 5" class="cancelled-banner">
      <text class="cancelled-text">订单已取消</text>
    </view>

    <!-- 退单状态提示 -->
    <view v-if="order.status === -2" class="refund-banner refund-banner--pending">
      <text class="refund-banner__text">退单申请审核中</text>
      <text v-if="order.refundReason" class="refund-banner__reason">原因：{{ order.refundReason }}</text>
    </view>
    <view v-if="order.status === -3" class="refund-banner refund-banner--success">
      <text class="refund-banner__text">退单成功</text>
      <text v-if="order.refundReason" class="refund-banner__reason">原因：{{ order.refundReason }}</text>
    </view>
    <view v-if="order.status === -4" class="refund-banner refund-banner--admin">
      <text class="refund-banner__text">管理员已退单</text>
      <text v-if="order.refundReason" class="refund-banner__reason">原因：{{ order.refundReason }}</text>
    </view>
    <view v-if="(order.status === 2 || order.status === 3) && order.refundReason" class="refund-banner refund-banner--rejected">
      <text class="refund-banner__text">退单被拒绝</text>
      <text class="refund-banner__reason">原因：{{ order.refundReason }}</text>
    </view>

    <!-- Address Section -->
    <view class="card" v-if="order.address">
      <text class="card__title">收货信息</text>
      <view class="address-info">
        <view class="address-top">
          <text class="name">{{ order.address.name }}</text>
          <text class="phone">{{ order.address.phone }}</text>
        </view>
        <text class="address-detail">{{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}</text>
      </view>
    </view>

    <!-- Order Items -->
    <view class="card">
      <text class="card__title">商品信息</text>
      <view class="order-item" v-for="item in order.items" :key="item.productId || item.id">
        <view class="item-image">
          <text class="item-image-text">{{ item.name.charAt(0) }}</text>
        </view>
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-spec" v-if="item.spec">规格：{{ item.spec }}</text>
        </view>
        <view class="item-right">
          <text class="item-price">¥{{ item.price.toFixed(2) }}</text>
          <text class="item-qty">x{{ item.quantity }}</text>
        </view>
      </view>

      <!-- Price Breakdown -->
      <view class="price-breakdown">
        <view class="price-row">
          <text>商品总价</text>
          <text>¥{{ order.goodsTotal.toFixed(2) }}</text>
        </view>
        <view class="price-row">
          <text>运费</text>
          <text :class="{ 'free-shipping': order.freight === 0 }">
            {{ order.freight === 0 ? '免运费' : '¥' + order.freight.toFixed(2) }}
          </text>
        </view>
        <view class="price-divider"></view>
        <view class="price-row price-row--total">
          <text>实付金额</text>
          <text class="total-price">¥{{ order.totalPrice.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- Order Info -->
    <view class="card">
      <text class="card__title">订单信息</text>
      <view class="info-row">
        <text class="info-label">订单编号</text>
        <text class="info-value">{{ order.orderNo }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">创建时间</text>
        <text class="info-value">{{ order.createTime }}</text>
      </view>
      <view class="info-row" v-if="order.payTime">
        <text class="info-label">支付时间</text>
        <text class="info-value">{{ order.payTime }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">支付方式</text>
        <text class="info-value">{{ order.payMethod || '待支付' }}</text>
      </view>
      <view class="info-row" v-if="order.remark">
        <text class="info-label">买家留言</text>
        <text class="info-value">{{ order.remark }}</text>
      </view>
    </view>

    <!-- Review Section (completed orders) -->
    <view v-if="order.status === 4" class="card">
      <view class="review-header">
        <text class="card__title">商品评价</text>
        <view v-if="!order.reviewed && !showReviewForm" class="review-write-btn" @tap="initReview">
          <text class="review-write-btn-text">写评价</text>
        </view>
        <view v-if="order.reviewed" class="reviewed-badge">
          <text class="reviewed-badge-text">已评价</text>
        </view>
      </view>

      <!-- Review Form -->
      <view v-if="showReviewForm" class="review-form">
        <view v-for="item in order.items" :key="item.productId" class="review-card">
          <text class="review-card__name">{{ item.name }}</text>
          <view class="review-card__stars">
            <text
              v-for="star in 5"
              :key="star"
              class="star"
              :class="star <= (reviewForm[item.productId]?.rating || 0) ? 'star--active' : 'star--inactive'"
              @tap="setRating(item.productId, star)"
            >★</text>
          </view>
          <textarea
            class="review-card__input"
            v-model="reviewForm[item.productId].content"
            placeholder="分享您的使用体验（可不填）"
            :maxlength="500"
          ></textarea>
        </view>
        <view class="review-actions">
          <view class="review-submit-btn" @tap="submitReview">
            <text class="review-submit-btn-text">提交评价</text>
          </view>
          <view class="review-cancel-btn" @tap="showReviewForm = false">
            <text class="review-cancel-btn-text">取消</text>
          </view>
        </view>
      </view>

      <!-- Existing Reviews -->
      <view v-if="order.reviewed && existingReviews.length" class="review-list">
        <view v-for="item in order.items" :key="item.productId" class="review-item">
          <text class="review-item__name">{{ item.name }}</text>
          <view class="review-item__stars">
            <text
              v-for="star in 5"
              :key="star"
              class="star star--small"
              :class="star <= (existingReviews.find(r => r.productId === item.productId)?.rating || 0) ? 'star--active' : 'star--inactive'"
            >★</text>
          </view>
          <text v-if="existingReviews.find(r => r.productId === item.productId)?.content" class="review-item__content">
            {{ existingReviews.find(r => r.productId === item.productId)?.content }}
          </text>
          <text class="review-item__time">{{ formatDate(order.reviewAt) }}</text>
        </view>
      </view>
    </view>

    <!-- Action Buttons -->
    <view class="footer" v-if="order.status === 0">
      <view class="cancel-btn" @tap="cancelOrder">
        <text class="cancel-btn-text">取消订单</text>
      </view>
      <view class="pay-btn" @tap="payOrder">
        <text class="pay-btn-text">去付款</text>
      </view>
    </view>
    <view class="footer" v-else-if="order.status === 2">
      <view class="refund-btn" @tap="openRefundDialog">
        <text class="refund-btn-text">申请退单</text>
      </view>
      <view class="confirm-btn" @tap="confirmReceive">
        <text class="confirm-btn-text">确认收货</text>
      </view>
    </view>
    <view class="footer" v-else-if="order.status === 3 && !order.reviewed">
      <view class="refund-btn" @tap="openRefundDialog">
        <text class="refund-btn-text">申请退单</text>
      </view>
      <view class="pay-btn" @tap="initReview">
        <text class="pay-btn-text">写评价</text>
      </view>
    </view>
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
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail, cancelOrder as apiCancelOrder, payOrder as apiPayOrder, confirmOrder as apiConfirmOrder, reviewOrder as apiReviewOrder, refundOrder as apiRefundOrder } from '@/services/order'

const order = ref({
  id: 0, orderNo: '', status: 0, address: null, items: [],
  goodsTotal: 0, freight: 0, totalPrice: 0, createTime: '', payMethod: '', reviewed: false,
})

const steps = [
  { label: '提交订单', status: 0 },
  { label: '已付款', status: 1 },
  { label: '已发货', status: 2 },
  { label: '已收货', status: 3 },
]

const currentStepIndex = computed(() => {
  if (!order.value || order.value.status === -1 || order.value.status === 5) return -1
  return steps.findIndex(s => s.status === order.value.status)
})

const statusText = computed(() => {
  const map = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '待评价', 4: '已完成', '-1': '已取消', '-2': '退款申请中', '-3': '退款成功', '-4': '管理员退单' }
  return map[String(order.value.status)] || '未知'
})

// Review
const showReviewForm = ref(false)
const reviewForm = ref({})
const existingReviews = ref([])

const initReview = () => {
  const form = {}
  order.value.items.forEach(item => {
    form[item.productId] = { rating: 0, content: '' }
  })
  reviewForm.value = form
  showReviewForm.value = true
}

const setRating = (productId, rating) => {
  reviewForm.value[productId].rating = rating
}

const formatDate = (iso) => {
  if (!iso) return '-'
  return iso
}

const loadOrder = async (orderId) => {
  try {
    const res = await getOrderDetail(orderId)
    if (res) order.value = res
  } catch {}
}

const cancelOrder = async () => {
  uni.showModal({
    title: '提示', content: '确定取消订单？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await apiCancelOrder(order.value.id)
          order.value.status = -1
          uni.showToast({ title: '订单已取消', icon: 'success' })
        } catch {}
      }
    }
  })
}

const payOrder = async () => {
  uni.showModal({
    title: '提示', content: `确认支付 ¥${Number(order.value.totalPrice).toFixed(2)}？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await apiPayOrder(order.value.id)
          await loadOrder(order.value.id)
          uni.showToast({ title: '支付成功', icon: 'success' })
        } catch {}
      }
    }
  })
}

const confirmReceive = async () => {
  uni.showModal({
    title: '提示', content: '确认已收到货物？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await apiConfirmOrder(order.value.id)
          await loadOrder(order.value.id)
          uni.showToast({ title: '确认收货成功', icon: 'success' })
        } catch {}
      }
    }
  })
}

// 退单相关
const showRefundDialog = ref(false)
const refundReason = ref('')

const openRefundDialog = () => {
  refundReason.value = ''
  showRefundDialog.value = true
}

const submitRefund = async () => {
  if (!order.value) return
  try {
    await apiRefundOrder(order.value.id, { reason: refundReason.value })
    await loadOrder(order.value.id)
    showRefundDialog.value = false
    uni.showToast({ title: '退单申请已提交', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '退单申请失败', icon: 'none' })
  }
}

const submitReview = async () => {
  const reviews = Object.entries(reviewForm.value)
  const hasEmpty = reviews.some(([, data]) => data.rating === 0)
  if (hasEmpty) {
    uni.showToast({ title: '请为每个商品选择评分', icon: 'none' })
    return
  }
  try {
    await apiReviewOrder(order.value.id, {
      userId: uni.getStorageSync('petstore_user') ? JSON.parse(uni.getStorageSync('petstore_user')).id : 0,
      reviews: reviews.map(([productId, data]) => ({
        productId: Number(productId), rating: data.rating, content: data.content,
      })),
    })
    order.value.reviewed = true
    existingReviews.value = reviews.map(([productId, data]) => ({
      productId: Number(productId), rating: data.rating, content: data.content,
    }))
    showReviewForm.value = false
    uni.showToast({ title: '评价提交成功', icon: 'success' })
  } catch {}
}

onLoad((query) => {
  const orderId = Number(query?.id)
  if (orderId) loadOrder(orderId)
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
  padding-bottom: 160rpx;
}

.status-bar {
  background: linear-gradient(135deg, #1c49c2, #2d6be0);
  padding: 40rpx 30rpx;
}

.status-text {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

/* Progress Steps (from PC .status-bar) */
.progress-section {
  background: #fff;
  margin: 20rpx 24rpx 0;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.progress-step__icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.progress-step--completed .progress-step__icon {
  background: #00a651;
}

.progress-step--active .progress-step__icon {
  background: #1c49c2;
}

.progress-check {
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}

.progress-num {
  color: #999;
  font-size: 26rpx;
  font-weight: 600;
}

.progress-step__text {
  font-size: 22rpx;
  color: #999;
}

.progress-step--active .progress-step__text {
  color: #1c49c2;
  font-weight: 600;
}

.cancelled-banner {
  background: #fff3e0;
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
  border-radius: 24rpx;
  text-align: center;
}

.cancelled-text {
  color: #e65100;
  font-size: 30rpx;
  font-weight: 600;
}

/* Cards (from PC .detail-section) */
.card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card__title {
  font-size: 30rpx;
  font-weight: 600;
  color: #121212;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: block;
}

/* Address */
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
  display: block;
}

/* Order Items (from PC .detail-item) */
.order-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image-text {
  font-size: 40rpx;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.06);
}

.item-info {
  flex: 1;
  margin-left: 20rpx;
  min-width: 0;
}

.item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #121212;
  margin-bottom: 6rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
}

.item-right {
  text-align: right;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.item-price {
  font-size: 28rpx;
  color: #bd2848;
  font-weight: bold;
  display: block;
}

.item-qty {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 4rpx;
}

/* Price Breakdown (from PC .detail-amounts) */
.price-breakdown {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
  font-size: 28rpx;
  color: #666;
}

.free-shipping {
  color: #00a651;
}

.price-divider {
  height: 1rpx;
  background: #f0f0f0;
  margin: 16rpx 0;
}

.price-row--total {
  font-size: 30rpx;
  font-weight: 600;
  color: #121212;
}

.total-price {
  font-size: 36rpx;
  font-weight: 700;
  color: #bd2848;
}

/* Info Rows */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 0;
  font-size: 26rpx;
}

.info-label {
  color: #999;
}

.info-value {
  color: #333;
}

/* Review (from PC .review-*) */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 20rpx;
}

.review-header .card__title {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.review-write-btn {
  padding: 12rpx 24rpx;
  background: #ff6c10;
  border-radius: 8rpx;
}

.review-write-btn-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}

.reviewed-badge {
  background: #f5f5f5;
  padding: 8rpx 24rpx;
  border-radius: 6rpx;
}

.reviewed-badge-text {
  font-size: 24rpx;
  color: #999;
}

.review-card {
  padding: 24rpx;
  background: #fafafa;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.review-card__name {
  font-size: 28rpx;
  font-weight: 600;
  color: #121212;
  margin-bottom: 12rpx;
  display: block;
}

.review-card__stars {
  display: flex;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.star {
  font-size: 44rpx;
}

.star--small {
  font-size: 30rpx;
}

.star--active {
  color: #ff6c10;
}

.star--inactive {
  color: #ddd;
}

.review-card__input {
  width: 100%;
  min-height: 120rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  box-sizing: border-box;
  background: #fff;
}

.review-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 24rpx;
}

.review-submit-btn {
  flex: 1;
  height: 80rpx;
  background: #ff6c10;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-submit-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.review-cancel-btn {
  padding: 0 32rpx;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-cancel-btn-text {
  color: #666;
  font-size: 28rpx;
}

.review-list {
  margin-top: 20rpx;
}

.review-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-item__name {
  font-size: 28rpx;
  font-weight: 600;
  color: #121212;
  margin-bottom: 8rpx;
  display: block;
}

.review-item__stars {
  display: flex;
  gap: 4rpx;
  margin-bottom: 8rpx;
}

.review-item__content {
  font-size: 26rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 8rpx;
  display: block;
}

.review-item__time {
  font-size: 22rpx;
  color: #999;
  display: block;
}

/* Footer (from PC buttons) */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 30rpx;
  gap: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.cancel-btn {
  padding: 0 30rpx;
  height: 64rpx;
  border: 1rpx solid #ddd;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn-text {
  color: #999;
  font-size: 28rpx;
}

.pay-btn {
  padding: 0 40rpx;
  height: 64rpx;
  background: #ff6c10;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.confirm-btn {
  padding: 0 40rpx;
  height: 64rpx;
  background: #1c49c2;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

/* Refund */
.refund-btn {
  padding: 0 40rpx;
  height: 64rpx;
  border: 2rpx solid #e74c3c;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refund-btn-text {
  color: #e74c3c;
  font-size: 28rpx;
  font-weight: 600;
}

.refund-banner {
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.refund-banner--pending { background: #fff3e0; }
.refund-banner--success { background: #e6f9ee; }
.refund-banner--admin { background: #fff0f0; }
.refund-banner--rejected { background: #fff3f0; }

.refund-banner__text {
  font-size: 30rpx;
  font-weight: 600;
}

.refund-banner--pending .refund-banner__text { color: #e65100; }
.refund-banner--success .refund-banner__text { color: #00a651; }
.refund-banner--admin .refund-banner__text { color: #e74c3c; }
.refund-banner--rejected .refund-banner__text { color: #e74c3c; }

.refund-banner__reason {
  font-size: 24rpx;
  opacity: 0.8;
}

.refund-banner--pending .refund-banner__reason { color: #e65100; }
.refund-banner--success .refund-banner__reason { color: #00a651; }
.refund-banner--admin .refund-banner__reason { color: #e74c3c; }
.refund-banner--rejected .refund-banner__reason { color: #e74c3c; }

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
</style>
