<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const orderStore = useOrderStore()
const loading = ref(true)

onMounted(async () => {
  await orderStore.loadOrders()
  loading.value = false
})

const activeStatus = ref(null)

const statusTabs = [
  { label: '全部', value: null },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 },
]

const filteredOrders = computed(() => orderStore.getOrdersByStatus(activeStatus.value))

const statusClass = (status) => {
  const map = { '-1': 'cancelled', '0': 'pending', '1': 'paid', '2': 'shipped', '3': 'completed' }
  return map[String(status)] || ''
}

const handlePay = (orderId) => {
  orderStore.payOrder(orderId)
  ElMessage.success('支付成功（Mock）')
}

const handleCancel = (orderId) => {
  ElMessageBox.confirm('确定取消订单吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => {
    orderStore.cancelOrder(orderId)
    ElMessage.success('订单已取消')
  }).catch(() => {})
}

const handleConfirm = (orderId) => {
  ElMessageBox.confirm('确认已收到商品？', '确认收货', {
    confirmButtonText: '确认', cancelButtonText: '取消',
  }).then(() => {
    orderStore.confirmReceive(orderId)
    ElMessage.success('已确认收货')
  }).catch(() => {})
}

const goDetail = (orderId) => router.push(`/user/orders/${orderId}`)

const goReview = (orderId) => router.push(`/user/orders/${orderId}?review=1`)

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="orders-page__title">我的订单</h1>

      <!-- 状态 Tab -->
      <div class="orders-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.label"
          class="orders-tabs__item"
          :class="{ 'orders-tabs__item--active': activeStatus === tab.value }"
          @click="activeStatus = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="orders-skeleton">
        <div v-for="i in 3" :key="i" class="skeleton-order-card">
          <div class="skeleton-order-card__header"></div>
          <div class="skeleton-order-card__body">
            <div class="skeleton-order-card__img"></div>
            <div class="skeleton-order-card__info">
              <div class="skeleton-order-card__line"></div>
              <div class="skeleton-order-card__line skeleton-order-card__line--short"></div>
            </div>
          </div>
          <div class="skeleton-order-card__footer"></div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredOrders.length === 0" class="orders-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <p>暂无订单</p>
      </div>

      <!-- 订单列表 -->
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <span class="order-card__no">订单号：{{ order.orderNo }}</span>
          <span class="order-card__date">{{ formatDate(order.createTime) }}</span>
          <span class="order-card__status" :class="statusClass(order.status)">
            {{ orderStore.getStatusText(order.status) }}
          </span>
        </div>

        <div class="order-card__body">
          <div v-for="item in order.items" :key="item.productId" class="order-card__item">
            <div class="order-card__image">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
              <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div class="order-card__info">
              <p class="order-card__name">{{ item.name }}</p>
              <p v-if="item.spec" class="order-card__spec">规格：{{ item.spec }}</p>
            </div>
            <div class="order-card__price">¥{{ (Number(item.price) || 0).toFixed(2) }}</div>
            <div class="order-card__qty">x{{ item.quantity }}</div>
          </div>
        </div>

        <div class="order-card__footer">
          <div class="order-card__total">
            共{{ (order.items || []).reduce((s, i) => s + (i.quantity || 0), 0) }}件，实付：
            <span class="order-card__amount">¥{{ (Number(order.payAmount) || 0).toFixed(2) }}</span>
          </div>
          <div class="order-card__actions">
            <button v-if="order.status === 0" class="btn btn--outline" @click="handleCancel(order.id)">取消订单</button>
            <button v-if="order.status === 0" class="btn btn--primary" @click="handlePay(order.id)">去付款</button>
            <button v-if="order.status === 2" class="btn btn--primary" @click="handleConfirm(order.id)">确认收货</button>
            <button v-if="order.status === 3 && !order.reviewed" class="btn btn--review" @click="goReview(order.id)">写评价</button>
            <span v-if="order.status === 3 && order.reviewed" class="order-card__reviewed">已评价</span>
            <button class="btn btn--outline" @click="goDetail(order.id)">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  background: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
  padding: 2.4rem 0 6.4rem;
}

.orders-page__title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #121212;
  margin-bottom: 2.4rem;
}

/* 骨架屏 */
.orders-skeleton {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.skeleton-order-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.skeleton-order-card__header {
  height: 4.8rem;
  background: #fafafa;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-order-card__body {
  display: flex;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
}

.skeleton-order-card__img {
  width: 5rem;
  height: 5rem;
  background: #f0f0f0;
  border-radius: 6px;
  flex-shrink: 0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-order-card__info {
  flex: 1;
}

.skeleton-order-card__line {
  height: 1.4rem;
  width: 60%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 0.8rem;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-order-card__line--short {
  width: 40%;
}

.skeleton-order-card__footer {
  height: 4.8rem;
  border-top: 1px solid #f0f0f0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ========== Tabs ========== */
.orders-tabs {
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 2.4rem;
  overflow: hidden;
}

.orders-tabs__item {
  flex: 1;
  padding: 1.6rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.orders-tabs__item:hover { color: #1c49c2; background: #f8f9fa; }
.orders-tabs__item--active { color: #1c49c2; font-weight: 600; border-bottom: 2px solid #1c49c2; }

/* ========== 空状态 ========== */
.orders-empty {
  text-align: center;
  padding: 8rem 2.4rem;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.orders-empty p { margin-top: 2rem; color: #999; font-size: 1.6rem; }

/* ========== 订单卡片 ========== */
.order-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 2.4rem;
  overflow: hidden;
  transition: all 0.25s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

.order-card__header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.6rem 2.4rem;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.order-card__no { font-size: 1.4rem; color: #666; }
.order-card__date { font-size: 1.3rem; color: #999; }
.order-card__status { font-size: 1.4rem; font-weight: 600; margin-left: auto; }
.order-card__status.pending { color: #ff6c10; }
.order-card__status.paid { color: #1c49c2; }
.order-card__status.shipped { color: #1c49c2; }
.order-card__status.completed { color: #00a651; }
.order-card__status.cancelled { color: #999; }

.order-card__body { padding: 1.6rem 2.4rem; }

.order-card__item {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid #f5f5f5;
}
.order-card__item:last-child { border-bottom: none; }

.order-card__image {
  width: 5rem;
  height: 5rem;
  background: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.order-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-card__info { flex: 1; min-width: 0; }
.order-card__name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-card__spec { font-size: 1.2rem; color: #999; }

.order-card__price { width: 10rem; text-align: center; font-size: 1.4rem; }
.order-card__qty { width: 6rem; text-align: center; font-size: 1.4rem; color: #666; }

.order-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
  border-top: 1px solid #f0f0f0;
}

.order-card__total { font-size: 1.4rem; color: #666; }
.order-card__amount { font-size: 2rem; font-weight: 700; color: #bd2848; }

.order-card__actions { display: flex; gap: 1.2rem; }

.btn {
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn--primary { background: #ff6c10; color: #fff; border: none; }
.btn--primary:hover { background: #e55d00; }
.btn--outline { background: #fff; color: #666; border: 1px solid #ddd; }
.btn--outline:hover { border-color: #999; color: #121212; }
.btn--review { background: #ff6c10; color: #fff; border: none; }
.btn--review:hover { background: #e55a00; }

.order-card__reviewed {
  font-size: 1.3rem;
  color: #999;
  background: #f5f5f5;
  padding: 0.4rem 1.6rem;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .order-card__price, .order-card__qty { display: none; }
  .order-card__header { flex-wrap: wrap; gap: 0.8rem; }
  .order-card__footer { flex-direction: column; gap: 1.2rem; align-items: flex-end; }
}
</style>
