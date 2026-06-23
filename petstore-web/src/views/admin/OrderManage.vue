<template>
  <div>
    <div class="page-header"><h2>订单管理</h2></div>
    <el-tabs v-model="activeStatus" @tab-change="loadOrders">
      <el-tab-pane label="全部" name="" />
      <el-tab-pane label="待支付" name="0" />
      <el-tab-pane label="待发货" name="1" />
      <el-tab-pane label="待收货" name="2" />
      <el-tab-pane label="待评价" name="3" />
      <el-tab-pane label="已完成" name="4" />
      <el-tab-pane label="退单申请" name="-2" />
      <el-tab-pane label="已取消" name="-1" />
    </el-tabs>
    <el-table :data="orders" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="userId" label="用户ID" width="70" />
      <el-table-column prop="totalAmount" label="金额(¥)" width="100" />
      <el-table-column label="状态" width="130">
        <template #default="{ row }"><OrderStatusTag :status="row.status" /></template>
      </el-table-column>
      <el-table-column prop="createdAt" label="下单时间" width="180" />
      <el-table-column label="操作" min-width="200">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row.id)">详情</el-button>
          <el-button v-if="row.status === 1" size="small" type="success" @click="handleShip(row.id)">发货</el-button>
          <el-button v-if="row.status === -2" size="small" type="success" @click="handleApprove(row.id, true)">通过退单</el-button>
          <el-button v-if="row.status === -2" size="small" type="warning" @click="handleApprove(row.id, false)">拒绝退单</el-button>
          <el-button v-if="row.status === 3" size="small" type="danger" @click="showDirectRefund(row.id)">直接退单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="detailOrder">
        <p><strong>订单号：</strong>#{{ detailOrder.id }}</p>
        <p><strong>状态：</strong><OrderStatusTag :status="detailOrder.status" /></p>
        <p><strong>金额：</strong>¥{{ detailOrder.totalAmount }}</p>
        <p><strong>时间：</strong>{{ detailOrder.createdAt }}</p>
        <p v-if="detailOrder.cancelReason"><strong>取消原因：</strong>{{ detailOrder.cancelReason }}</p>
        <p v-if="detailOrder.refundReason"><strong>退单原因：</strong>{{ detailOrder.refundReason }}</p>
        <h4 style="margin-top: 12px;">商品明细</h4>
        <el-table :data="detailItems" size="small">
          <el-table-column prop="productName" label="商品" />
          <el-table-column prop="price" label="单价" width="80" />
          <el-table-column prop="quantity" label="数量" width="60" />
        </el-table>
      </div>
    </el-dialog>

    <!-- Direct Refund Dialog -->
    <el-dialog v-model="refundVisible" title="直接退单" width="400px">
      <el-input v-model="refundReason" placeholder="退单原因" />
      <template #footer>
        <el-button @click="refundVisible = false">取消</el-button>
        <el-button type="danger" @click="submitRefund">确认退单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminOrders, getAdminOrderDetail, shipOrder, approveRefund, directRefund } from '@/api/admin'
import OrderStatusTag from '@/components/OrderStatusTag.vue'

const orders = ref([])
const activeStatus = ref('')
const detailVisible = ref(false)
const detailOrder = ref(null)
const detailItems = ref([])
const refundVisible = ref(false)
const refundReason = ref('')
let refundOrderId = null

onMounted(loadOrders)

async function loadOrders() {
  try {
    const status = activeStatus.value === '' ? undefined : parseInt(activeStatus.value)
    const r = await getAdminOrders(status)
    orders.value = r.data || []
  } catch (e) {}
}

async function viewDetail(id) {
  try {
    const r = await getAdminOrderDetail(id)
    detailOrder.value = r.data.order
    detailItems.value = r.data.items || []
    detailVisible.value = true
  } catch (e) {}
}

async function handleShip(id) {
  try { await shipOrder(id); ElMessage.success('已发货'); loadOrders() } catch (e) {}
}

async function handleApprove(id, approved) {
  try {
    const msg = approved ? '确认通过退单？' : '确认拒绝退单？'
    await ElMessageBox.confirm(msg, '提示', { type: 'warning' })
    await approveRefund(id, approved)
    ElMessage.success('已处理'); loadOrders()
  } catch (e) {}
}

function showDirectRefund(id) {
  refundOrderId = id; refundReason.value = ''; refundVisible.value = true
}

async function submitRefund() {
  try { await directRefund(refundOrderId, refundReason.value || '管理员退单'); ElMessage.success('已退单'); refundVisible.value = false; loadOrders() } catch (e) {}
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { font-size: 20px; }
</style>