<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const admin = useAdminStore()

const stats = computed(() => [
  { label: '今日订单', value: 12, icon: 'order', color: '#1c49c2' },
  { label: '今日销售额', value: `¥${admin.todaySales.toLocaleString()}`, icon: 'sale', color: '#ff6c10' },
  { label: '总用户数', value: admin.totalUsers, icon: 'user', color: '#00a651' },
  { label: '商品总数', value: admin.totalProducts, icon: 'product', color: '#8b5cf6' },
])

const pendingOrders = computed(() => ({
  unpaid: admin.orders.filter((o) => o.status === 0).length,
  unshipped: admin.orders.filter((o) => o.status === 1).length,
  refunding: admin.orders.filter((o) => o.status === -2).length,
}))

const recentOrders = computed(() => admin.orders.slice(0, 5))
const getStatusText = (status) => {
  const map = { '-3': '退款成功', '-2': '退款中', '-1': '已取消', '0': '待付款', '1': '已付款', '2': '已发货', '3': '已收货' }
  return map[String(status)] || '未知'
}
const getStatusClass = (status) => {
  if (status === 0) return 'status--warning'
  if (status === 1) return 'status--info'
  if (status === 2) return 'status--success'
  if (status === 3) return 'status--done'
  if (status === -2) return 'status--danger'
  return 'status--muted'
}
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">数据概览</h1>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stats-card">
        <div class="stats-card__icon" :style="{ background: stat.color + '14', color: stat.color }">
          <svg v-if="stat.icon === 'order'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <svg v-else-if="stat.icon === 'sale'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          <svg v-else-if="stat.icon === 'user'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <svg v-else-if="stat.icon === 'product'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </div>
        <div class="stats-card__info">
          <p class="stats-card__label">{{ stat.label }}</p>
          <p class="stats-card__value">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard__grid">
      <!-- 待处理订单 -->
      <div class="dashboard__panel">
        <div class="panel-header">
          <h2 class="panel-header__title">待处理订单</h2>
          <router-link to="/admin/orders" class="panel-header__link">去处理</router-link>
        </div>
        <div class="pending-list">
          <div class="pending-item">
            <span class="pending-item__label">待付款</span>
            <span class="pending-item__count pending-item__count--warning">{{ pendingOrders.unpaid }}单</span>
          </div>
          <div class="pending-item">
            <span class="pending-item__label">待发货</span>
            <span class="pending-item__count pending-item__count--info">{{ pendingOrders.unshipped }}单</span>
          </div>
          <div class="pending-item">
            <span class="pending-item__label">退款中</span>
            <span class="pending-item__count pending-item__count--danger">{{ pendingOrders.refunding }}单</span>
          </div>
        </div>
      </div>

      <!-- 近期订单 -->
      <div class="dashboard__panel">
        <div class="panel-header">
          <h2 class="panel-header__title">近期订单</h2>
          <router-link to="/admin/orders" class="panel-header__link">查看全部</router-link>
        </div>
        <div class="recent-orders">
          <div v-for="order in recentOrders" :key="order.id" class="recent-order">
            <div class="recent-order__info">
              <span class="recent-order__no">订单 #{{ order.id }}</span>
              <span class="recent-order__user">用户ID：{{ order.userId }}</span>
            </div>
            <div class="recent-order__right">
              <span class="recent-order__amount">¥{{ order.totalAmount }}</span>
              <span class="status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard__title {
  font-size: 24px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 24px;
}

/* ========== 统计卡片 ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-card__label {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.stats-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #121212;
}

/* ========== 下方面板 ========== */
.dashboard__grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.dashboard__panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-header__title {
  font-size: 16px;
  font-weight: 600;
  color: #121212;
}

.panel-header__link {
  font-size: 13px;
  color: #1c49c2;
  text-decoration: none;
}

.panel-header__link:hover {
  text-decoration: underline;
}

/* ========== 待处理订单 ========== */
.pending-list {
  padding: 8px 24px 20px;
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.pending-item:last-child {
  border-bottom: none;
}

.pending-item__label {
  font-size: 14px;
  color: #666;
}

.pending-item__count {
  font-size: 16px;
  font-weight: 600;
}

.pending-item__count--warning { color: #ff6c10; }
.pending-item__count--info { color: #1c49c2; }
.pending-item__count--danger { color: #e74c3c; }

/* ========== 近期订单 ========== */
.recent-orders {
  padding: 4px 0;
}

.recent-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid #f5f5f5;
}

.recent-order:last-child {
  border-bottom: none;
}

.recent-order__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-order__no {
  font-size: 14px;
  font-weight: 600;
  color: #121212;
}

.recent-order__user {
  font-size: 13px;
  color: #999;
}

.recent-order__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recent-order__amount {
  font-size: 15px;
  font-weight: 600;
  color: #121212;
}

/* ========== 状态 ========== */
.status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status--warning { background: #fff5e6; color: #ff6c10; }
.status--info { background: #e6f0ff; color: #1c49c2; }
.status--success { background: #e6f9ee; color: #00a651; }
.status--done { background: #f0f0f0; color: #999; }
.status--danger { background: #fff0f0; color: #e74c3c; }
.status--muted { background: #f5f5f5; color: #999; }

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
