<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const admin = useAdminStore()

const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

const tabs = [
  { key: 'all', label: '全部' },
  { key: '0', label: '待付款' },
  { key: '1', label: '已付款' },
  { key: '2', label: '已发货' },
  { key: '-2', label: '退款中' },
]

const switchTab = (key) => {
  activeTab.value = key
  currentPage.value = 1
}

const filteredOrders = computed(() => {
  let list = admin.orders
  if (activeTab.value !== 'all') {
    list = list.filter((o) => o.status === Number(activeTab.value))
  }
  if (searchQuery.value) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((o) =>
      String(o.id).includes(q) || String(o.userId).includes(q)
    )
  }
  // 优先级排序：退款中(-2) > 已付款待发货(1) > 已收货待评价(3) > 其余按时间倒序
  const priority = { '-2': 0, '1': 1, '3': 2 }
  return [...list].sort((a, b) => {
    const pa = priority[String(a.status)] ?? 99
    const pb = priority[String(b.status)] ?? 99
    if (pa !== pb) return pa - pb
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

const getStatusText = (status) => {
  const map = { '-4': '管理员退单', '-3': '退款成功', '-2': '退款中', '-1': '已取消', '0': '待付款', '1': '已付款', '2': '已发货', '3': '已收货', '4': '已完成' }
  return map[String(status)] || '未知'
}

const getStatusClass = (status) => {
  if (status === 0) return 'status--warning'
  if (status === 1) return 'status--info'
  if (status === 2) return 'status--success'
  if (status === 3 || status === 4) return 'status--done'
  if (status === -2) return 'status--danger'
  return 'status--muted'
}

const parseAddress = (snapshot) => {
  if (!snapshot) return '-'
  try {
    const addr = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
    const parts = [addr.receiverName, addr.phone, addr.province, addr.city, addr.district, addr.detail].filter(Boolean)
    return parts.join(' ') || '-'
  } catch {
    return snapshot
  }
}

const formatItems = (items) => {
  if (!items || !items.length) return '-'
  return items.map((i) => `${i.productName || i.product_name || ''} x${i.quantity || i.qty || 0}`).join('、')
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

const showDirectRefundDialog = ref(false)
const directRefundTarget = ref(null)
const directRefundReason = ref('')

const openDirectRefundDialog = (order) => {
  directRefundTarget.value = order
  directRefundReason.value = ''
  showDirectRefundDialog.value = true
}

const submitDirectRefund = async () => {
  if (!directRefundTarget.value) return
  await admin.directRefund(directRefundTarget.value.id, directRefundReason.value)
  showDirectRefundDialog.value = false
  directRefundTarget.value = null
  ElMessage.success('退单已处理')
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
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span v-if="tab.key !== 'all'" class="tabs__count">
          {{ admin.orders.filter((o) => o.status === Number(tab.key)).length }}
        </span>
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号、用户ID..."
        style="width: 320px"
        clearable
        @input="currentPage = 1"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 订单表格 -->
    <div class="table-wrapper">
      <el-table :data="pagedOrders" stripe style="width: 100%">
        <el-table-column prop="id" label="订单号" width="90" sortable>
          <template #default="{ row }">
            <span class="order-id">#{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="userId" label="用户ID" width="80" />

        <el-table-column label="收货地址" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="address-text">{{ parseAddress(row.addressSnapshot) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品明细" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="items-text">{{ formatItems(row.items) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="totalAmount" label="实付金额" width="110" sortable>
          <template #default="{ row }">
            <span class="amount">¥{{ row.totalAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status" :class="getStatusClass(row.status)">{{ getStatusText(row.status) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="下单时间" width="170" sortable :default-sort="{ prop: 'createdAt', order: 'descending' }">
          <template #default="{ row }">
            <span class="time-text">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <button v-if="row.status === 1" class="action-btn action-btn--primary" @click="handleShip(row)">发货</button>
              <button v-if="row.status === 3" class="action-btn action-btn--danger" @click="openDirectRefundDialog(row)">直接退单</button>
              <template v-if="row.status === -2">
                <button class="action-btn action-btn--success" @click="handleApproveRefund(row)">同意退款</button>
                <button class="action-btn action-btn--danger" @click="handleRejectRefund(row)">拒绝</button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredOrders.length"
        layout="total, prev, pager, next"
        background
      />
    </div>

    <!-- 直接退单弹窗 -->
    <div v-if="showDirectRefundDialog" class="dialog-mask" @click.self="showDirectRefundDialog = false">
      <div class="dialog">
        <h3 class="dialog__title">直接退单</h3>
        <p class="dialog__hint">确认对订单「#{{ directRefundTarget?.id }}」进行直接退单操作？</p>
        <textarea
          v-model="directRefundReason"
          class="dialog__textarea"
          placeholder="请输入退单原因（可不填）"
          rows="4"
        ></textarea>
        <div class="dialog__actions">
          <button class="dialog__btn dialog__btn--cancel" @click="showDirectRefundDialog = false">取消</button>
          <button class="dialog__btn dialog__btn--confirm" @click="submitDirectRefund">确认退单</button>
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
  margin-bottom: 20px;
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

/* ========== 搜索栏 ========== */
.search-bar {
  margin-bottom: 20px;
}

/* ========== 表格 ========== */
.table-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.order-id {
  font-weight: 600;
  color: #121212;
}

.amount {
  font-weight: 700;
  color: #bd2848;
}

.time-text {
  font-size: 13px;
  color: #666;
}

.address-text,
.items-text {
  font-size: 13px;
  color: #333;
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
.action-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
  background: #fff;
  white-space: nowrap;
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

/* ========== 分页 ========== */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* ========== 弹窗 ========== */
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.dialog__title {
  font-size: 18px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 8px;
}

.dialog__hint {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.dialog__textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.dialog__textarea:focus { border-color: #e74c3c; }

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.dialog__btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.dialog__btn--cancel { background: #f5f5f5; color: #666; }
.dialog__btn--cancel:hover { background: #eee; }
.dialog__btn--confirm { background: #e74c3c; color: #fff; }
.dialog__btn--confirm:hover { background: #c0392b; }

@media (max-width: 768px) {
  .tabs { flex-wrap: wrap; }
  .tabs__item { flex: unset; min-width: 80px; }
}
</style>
