<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()

const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: '0', label: '待付款' },
  { key: '1', label: '已付款' },
  { key: '2', label: '已发货' },
  { key: '-2', label: '退款中' },
]

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return admin.orders
  return admin.orders.filter((o) => o.status === Number(activeTab.value))
})

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

const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const handleShip = (order) => {
  ElMessageBox.confirm(
    `确认对订单「#${order.id}」进行发货操作？`,
    '发货确认',
    { confirmButtonText: '确认发货', cancelButtonText: '取消', type: 'info' },
  ).then(() => {
    admin.shipOrder(order.id)
    ElMessage.success('发货成功')
  }).catch(() => {})
}

const handleApproveRefund = (order) => {
  ElMessageBox.confirm(
    `确认同意订单「#${order.id}」的退款申请？`,
    '退款确认',
    { confirmButtonText: '同意退款', cancelButtonText: '取消', type: 'warning' },
  ).then(() => {
    admin.approveRefund(order.id)
    ElMessage.success('退款已处理')
  }).catch(() => {})
}

const handleRejectRefund = (order) => {
  ElMessageBox.confirm(
    `确认拒绝订单「#${order.id}」的退款申请？`,
    '拒绝退款',
    { confirmButtonText: '拒绝', cancelButtonText: '取消', type: 'warning' },
  ).then(() => {
    admin.rejectRefund(order.id)
    ElMessage.success('已拒绝退款')
  }).catch(() => {})
}
</script>

<template>
  <div class="order-manage">
    <h1 class="page-title">订单管理</h1>

    <!-- 状态筛选 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.key !== 'all'" class="tabs__count">
          {{ admin.orders.filter((o) => o.status === Number(tab.key)).length }}
        </span>
      </button>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <p>暂无订单数据</p>
      </div>

      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <div class="order-card__header-left">
            <span class="order-card__order-no">订单 #{{ order.id }}</span>
            <span class="status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
          </div>
          <span class="order-card__time">{{ formatDate(order.createdAt) }}</span>
        </div>

        <div class="order-card__body">
          <div class="order-card__user">用户ID：{{ order.userId }}</div>
          <div class="order-card__address">收货地址：{{ order.addressSnapshot || '-' }}</div>
        </div>

        <div class="order-card__footer">
          <div class="order-card__total">
            实付：<span class="order-card__amount">¥{{ order.totalAmount }}</span>
          </div>
          <div class="order-card__actions">
            <button
              v-if="order.status === 1"
              class="action-btn action-btn--primary"
              @click="handleShip(order)"
            >发货</button>
            <template v-if="order.status === -2">
              <button class="action-btn action-btn--success" @click="handleApproveRefund(order)">同意退款</button>
              <button class="action-btn action-btn--danger" @click="handleRejectRefund(order)">拒绝</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 24px;
}

/* ========== Tabs ========== */
.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.tabs__item {
  flex: 1;
  padding: 14px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom: 2px solid transparent;
}

.tabs__item:hover {
  color: #1c49c2;
  background: #f8f9fa;
}

.tabs__item--active {
  color: #1c49c2;
  border-bottom-color: #1c49c2;
  font-weight: 600;
}

.tabs__count {
  background: #f0f0f0;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.tabs__item--active .tabs__count {
  background: #e6f0ff;
  color: #1c49c2;
}

/* ========== 空状态 ========== */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: #fff;
  border-radius: 12px;
  color: #999;
  font-size: 14px;
}

/* ========== 订单卡片 ========== */
.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  overflow: hidden;
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
}

.order-card__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-card__order-no {
  font-size: 14px;
  font-weight: 600;
  color: #121212;
}

.order-card__time {
  font-size: 13px;
  color: #999;
}

.order-card__body {
  padding: 20px 24px;
}

.order-card__items {
  margin-bottom: 12px;
}

.order-card__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 0;
  font-size: 14px;
}

.order-card__item-name {
  flex: 1;
  color: #333;
}

.order-card__item-qty {
  color: #999;
  width: 50px;
  text-align: center;
}

.order-card__item-price {
  width: 80px;
  text-align: right;
  color: #121212;
  font-weight: 500;
}

.order-card__user {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.order-card__address {
  font-size: 13px;
  color: #999;
}

.order-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.order-card__total {
  font-size: 14px;
  color: #666;
}

.order-card__amount {
  font-size: 18px;
  font-weight: 700;
  color: #bd2848;
}

.order-card__actions {
  display: flex;
  gap: 8px;
}

/* ========== 状态标签 ========== */
.status {
  display: inline-block;
  padding: 2px 10px;
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

/* ========== 操作按钮 ========== */
.action-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
  background: #fff;
}

.action-btn--primary {
  background: #1c49c2;
  color: #fff;
  border-color: #1c49c2;
}
.action-btn--primary:hover { background: #1539a0; }

.action-btn--success {
  color: #00a651;
  border-color: #00a651;
}
.action-btn--success:hover { background: #e6f9ee; }

.action-btn--danger {
  color: #e74c3c;
  border-color: #e74c3c;
}
.action-btn--danger:hover { background: #fff0f0; }

@media (max-width: 768px) {
  .tabs { flex-wrap: wrap; }
  .tabs__item { flex: unset; min-width: 80px; }
  .order-card__header { flex-direction: column; align-items: flex-start; gap: 8px; }
}
</style>
