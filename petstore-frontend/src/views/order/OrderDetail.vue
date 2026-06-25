<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref(null)

onMounted(async () => {
  const id = route.params.id
  order.value = await orderStore.getOrderDetailById(id)
  if (route.query.review === '1' && order.value?.status === 3 && !order.value?.reviewed) {
    initReviewForm()
    showReviewForm.value = true
  }
})

// 评价相关
const showReviewForm = ref(false)
const reviewForm = ref({})
const existingReviews = ref([])

const initReviewForm = () => {
  if (!order.value) return
  order.value.items.forEach((item) => {
    reviewForm.value[item.productId] = { rating: 0, content: '' }
  })
}

const hoverRating = ref({})

const setRating = (productId, rating) => {
  reviewForm.value[productId].rating = rating
}

const setHoverRating = (productId, rating) => {
  hoverRating.value[productId] = rating
}

const clearHoverRating = (productId) => {
  hoverRating.value[productId] = 0
}

const getStarClass = (productId, star) => {
  const active = (hoverRating.value[productId] || reviewForm.value[productId]?.rating || 0) >= star
  return active ? 'star--active' : 'star--inactive'
}

const submitReview = async () => {
  const reviews = Object.entries(reviewForm.value).map(([productId, data]) => ({
    productId: Number(productId),
    rating: data.rating,
    content: data.content,
  }))

  const hasEmpty = reviews.some((r) => r.rating === 0)
  if (hasEmpty) {
    ElMessage.warning('请为每个商品选择评分')
    return
  }

  orderStore.submitReview(order.value.id, reviews)
  ElMessage.success('评价提交成功')
  showReviewForm.value = false
  loadExistingReviews()
}

const loadExistingReviews = () => {
  if (!order.value) return
  existingReviews.value = order.value.reviews || []
}

const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

const steps = [
  { label: '提交订单', status: 0 },
  { label: '已付款', status: 1 },
  { label: '已发货', status: 2 },
  { label: '已收货', status: 3 },
]

const currentStepIndex = computed(() => {
  if (!order.value) return -1
  if (order.value.status === -1) return -1
  return steps.findIndex((s) => s.status === order.value.status)
})
</script>

<template>
  <div class="order-detail-page">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span class="breadcrumb__sep">/</span>
        <router-link to="/user/orders">我的订单</router-link>
        <span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">订单详情</span>
      </div>

      <!-- 订单不存在 -->
      <div v-if="!order" class="order-not-found">
        <p>订单不存在</p>
        <router-link to="/user/orders" class="order-not-found__link">返回订单列表</router-link>
      </div>

      <template v-else>
        <h1 class="order-detail__title">订单详情</h1>

        <!-- 已取消提示 -->
        <div v-if="order.status === -1" class="order-cancelled-banner">
          订单已取消
        </div>

        <!-- 状态进度条 -->
        <div v-if="order.status !== -1" class="status-bar">
          <div
            v-for="(step, index) in steps"
            :key="step.label"
            class="status-bar__step"
            :class="{
              'status-bar__step--completed': index <= currentStepIndex,
              'status-bar__step--active': index === currentStepIndex,
            }"
          >
            <div class="status-bar__icon">
              <svg v-if="index <= currentStepIndex" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="status-bar__text">{{ step.label }}</span>
          </div>
        </div>

        <!-- 收货信息 -->
        <div class="detail-section">
          <h2 class="detail-section__title">收货信息</h2>
          <div class="detail-info">
            <p><span class="detail-info__label">收货人：</span>{{ order.address.name }}  {{ order.address.phone }}</p>
            <p><span class="detail-info__label">地址：</span>{{ order.address.address }}</p>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="detail-section">
          <h2 class="detail-section__title">商品信息</h2>
          <div class="detail-items">
            <div v-for="item in order.items" :key="item.productId" class="detail-item">
              <div class="detail-item__image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div class="detail-item__info">
                <p class="detail-item__name">{{ item.name }}</p>
                <p class="detail-item__spec">规格：{{ item.spec }}</p>
              </div>
              <div class="detail-item__price">¥{{ item.price.toFixed(2) }}</div>
              <div class="detail-item__qty">x{{ item.quantity }}</div>
              <div class="detail-item__subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>

          <div class="detail-amounts">
            <div class="detail-amounts__row">
              <span>商品总价</span>
              <span>¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
            <div class="detail-amounts__row">
              <span>运费</span>
              <span :class="{ free: order.shippingFee === 0 }">
                {{ order.shippingFee === 0 ? '免运费' : `¥${order.shippingFee}` }}
              </span>
            </div>
            <div class="detail-amounts__divider"></div>
            <div class="detail-amounts__row detail-amounts__row--total">
              <span>实付金额</span>
              <span class="detail-amounts__pay">¥{{ order.payAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="detail-section">
          <h2 class="detail-section__title">订单信息</h2>
          <div class="detail-info">
            <p><span class="detail-info__label">订单编号：</span>{{ order.orderNo }}</p>
            <p><span class="detail-info__label">创建时间：</span>{{ formatDate(order.createTime) }}</p>
            <p><span class="detail-info__label">支付时间：</span>{{ formatDate(order.payTime) }}</p>
            <p><span class="detail-info__label">支付方式：</span>{{ order.payMethod === 'wechat' ? '微信支付' : '支付宝' }}</p>
            <p v-if="order.remark"><span class="detail-info__label">买家留言：</span>{{ order.remark }}</p>
          </div>
        </div>

        <!-- 评价区域 (已完成订单) -->
        <div v-if="order.status === 3" class="detail-section">
          <div class="review-header">
            <h2 class="detail-section__title">商品评价</h2>
            <button
              v-if="!order.reviewed && !showReviewForm"
              class="review-btn"
              @click="initReviewForm(); showReviewForm = true"
            >写评价</button>
            <span v-if="order.reviewed" class="reviewed-badge">已评价</span>
          </div>

          <!-- 评价表单 -->
          <div v-if="showReviewForm" class="review-form">
            <div v-for="item in order.items" :key="item.productId" class="review-card">
              <div class="review-card__name">{{ item.name }}</div>
              <div class="review-card__stars">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="getStarClass(item.productId, star)"
                  @click="setRating(item.productId, star)"
                  @mouseenter="setHoverRating(item.productId, star)"
                  @mouseleave="clearHoverRating(item.productId)"
                >★</span>
              </div>
              <textarea
                v-model="reviewForm[item.productId].content"
                class="review-card__input"
                placeholder="分享您的使用体验（可不填）"
                rows="3"
              ></textarea>
            </div>
            <div class="review-form__actions">
              <button class="review-form__submit" @click="submitReview">提交评价</button>
              <button class="review-form__cancel" @click="showReviewForm = false">取消</button>
            </div>
          </div>

          <!-- 已评价展示 -->
          <div v-if="order.reviewed && existingReviews.length" class="review-list">
            <div v-for="item in order.items" :key="item.productId" class="review-item">
              <div class="review-item__name">{{ item.name }}</div>
              <div class="review-item__stars">
                <span v-for="star in 5" :key="star" class="star" :class="star <= (existingReviews.find(r => r.productId === item.productId)?.rating || 0) ? 'star--active' : 'star--inactive'">★</span>
              </div>
              <div v-if="existingReviews.find(r => r.productId === item.productId)?.content" class="review-item__content">
                {{ existingReviews.find(r => r.productId === item.productId)?.content }}
              </div>
              <div class="review-item__time">{{ formatDate(order.reviewAt) }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.order-detail-page {
  background: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
  padding: 2.4rem 0 6.4rem;
}

.breadcrumb {
  font-size: 1.3rem;
  color: #999;
  margin-bottom: 2.4rem;
}
.breadcrumb a { color: #666; text-decoration: none; }
.breadcrumb a:hover { color: #1c49c2; }
.breadcrumb__sep { margin: 0 0.8rem; }
.breadcrumb__current { color: #121212; }

.order-not-found {
  text-align: center;
  padding: 8rem 2.4rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  font-size: 1.6rem;
  color: #666;
}
.order-not-found__link {
  display: inline-block;
  margin-top: 2.4rem;
  padding: 1.2rem 3.2rem;
  background: #1c49c2;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.order-detail__title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #121212;
  margin-bottom: 2.4rem;
}

.order-cancelled-banner {
  background: #fff3e0;
  color: #e65100;
  padding: 2rem;
  border-radius: 12px;
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2.4rem;
}

/* ========== 状态进度条 ========== */
.status-bar {
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 3.2rem 4rem;
  margin-bottom: 2.4rem;
  position: relative;
}

.status-bar::before {
  content: '';
  position: absolute;
  top: 4.4rem;
  left: 15%;
  right: 15%;
  height: 3px;
  background: #eee;
}

.status-bar__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.status-bar__icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #eee;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  transition: all 0.3s;
}

.status-bar__step--completed .status-bar__icon {
  background: #00a651;
  color: #fff;
}

.status-bar__step--active .status-bar__icon {
  background: #1c49c2;
  color: #fff;
}

.status-bar__text {
  font-size: 1.3rem;
  color: #999;
}

.status-bar__step--active .status-bar__text {
  color: #1c49c2;
  font-weight: 600;
}

/* ========== Detail Sections ========== */
.detail-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 2.4rem;
  margin-bottom: 2.4rem;
}

.detail-section__title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 2rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid #f0f0f0;
}

.detail-info p {
  font-size: 1.4rem;
  color: #333;
  line-height: 2;
}
.detail-info__label { color: #999; }

/* ========== Items ========== */
.detail-item {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem 0;
  border-bottom: 1px solid #f5f5f5;
}
.detail-item:last-child { border-bottom: none; }

.detail-item__image {
  width: 6rem;
  height: 6rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-item__info { flex: 1; min-width: 0; }
.detail-item__name { font-size: 1.5rem; font-weight: 600; color: #121212; margin-bottom: 0.4rem; }
.detail-item__spec { font-size: 1.3rem; color: #999; }

.detail-item__price { width: 10rem; text-align: center; font-size: 1.4rem; }
.detail-item__qty { width: 6rem; text-align: center; font-size: 1.4rem; color: #666; }
.detail-item__subtotal { width: 10rem; text-align: right; font-size: 1.5rem; font-weight: 700; color: #bd2848; }

/* ========== Amounts ========== */
.detail-amounts {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.detail-amounts__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  color: #666;
}
.detail-amounts__row .free { color: #00a651; }

.detail-amounts__divider {
  height: 1px;
  background: #f0f0f0;
  margin: 1.6rem 0;
}

.detail-amounts__row--total {
  font-size: 1.6rem;
  font-weight: 600;
  color: #121212;
}
.detail-amounts__pay { font-size: 2.4rem; font-weight: 700; color: #bd2848; }

@media (max-width: 768px) {
  .status-bar { padding: 2.4rem 1.6rem; }
  .detail-item__price, .detail-item__qty { display: none; }
}

/* ========== 评价 ========== */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-header .detail-section__title {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.review-btn {
  padding: 0.8rem 2.4rem;
  background: #ff6c10;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.review-btn:hover { background: #e55a00; }

.reviewed-badge {
  font-size: 1.3rem;
  color: #999;
  background: #f5f5f5;
  padding: 0.4rem 1.6rem;
  border-radius: 4px;
}

/* 评价表单 */
.review-form { margin-top: 2rem; }

.review-card {
  padding: 2rem;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 1.2rem;
}

.review-card__name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 1rem;
}

.review-card__stars {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.star {
  font-size: 2.4rem;
  cursor: pointer;
  transition: color 0.15s;
  user-select: none;
}

.star--active { color: #ff6c10; }
.star--inactive { color: #ddd; }
.star--inactive:hover { color: #ffb088; }

.review-card__input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1.2rem;
  font-size: 1.3rem;
  resize: vertical;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.review-card__input:focus { border-color: #ff6c10; }

.review-form__actions {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.6rem;
}

.review-form__submit {
  padding: 1rem 3.2rem;
  background: #ff6c10;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.review-form__submit:hover { background: #e55a00; }

.review-form__cancel {
  padding: 1rem 3.2rem;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.2s;
}

.review-form__cancel:hover { background: #eee; }

/* 已评价展示 */
.review-list { margin-top: 2rem; }

.review-item {
  padding: 1.6rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child { border-bottom: none; }

.review-item__name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 0.8rem;
}

.review-item__stars {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.8rem;
}

.review-item__stars .star {
  cursor: default;
  font-size: 1.6rem;
}

.review-item__content {
  font-size: 1.4rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.review-item__time {
  font-size: 1.2rem;
  color: #999;
}
</style>
