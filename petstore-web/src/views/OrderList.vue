<template>
  <AppLayout>
    <div class="order-page">
      <h2 class="page-title">📋 我的订单</h2>
      <el-tabs v-model="activeStatus" @tab-change="loadOrders">
        <el-tab-pane label="全部" name="" />
        <el-tab-pane label="待支付" name="0" />
        <el-tab-pane label="待发货" name="1" />
        <el-tab-pane label="待收货" name="2" />
        <el-tab-pane label="待评价" name="3" />
        <el-tab-pane label="已完成" name="4" />
        <el-tab-pane label="退单/取消" name="refund" />
      </el-tabs>
      <el-empty v-if="filteredOrders.length === 0" description="暂无订单" />
      <div v-else>
        <el-card v-for="order in filteredOrders" :key="order.id" class="order-card" shadow="hover">
          <div class="order-header">
            <span>订单号：#{{ order.id }}</span>
            <OrderStatusTag :status="order.status" />
            <span class="order-time">{{ order.createdAt }}</span>
          </div>
          <div class="order-body">
            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <el-image :src="item.productImage" style="width:60px;height:60px;border-radius:6px;" fit="cover">
                  <template #error><div style="width:60px;height:60px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;">🐾</div></template>
                </el-image>
                <div class="item-info">
                  <div>{{ item.productName }}</div>
                  <div class="item-price">¥{{ item.price }} × {{ item.quantity }}</div>
                </div>
              </div>
            </div>
            <div class="order-total">合计：<span>¥{{ order.totalAmount }}</span></div>
          </div>
          <div class="order-actions">
            <el-button size="small" @click="$router.push(`/order/${order.id}`)">查看详情</el-button>
            <el-button v-if="order.status === 0" type="primary" size="small" @click="handlePay(order.id)">支付</el-button>
            <el-button v-if="order.status === 0 || order.status === 1" type="warning" size="small" @click="handleCancel(order.id)">取消</el-button>
            <el-button v-if="order.status === 2" type="success" size="small" @click="handleConfirm(order.id)">确认收货</el-button>
            <el-button v-if="order.status === 3" type="primary" size="small" @click="$router.push(`/order/${order.id}`)">评价</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrders, getOrderDetail, payOrder, cancelOrder, confirmReceipt } from '@/api/order'
import AppLayout from '@/components/AppLayout.vue'
import OrderStatusTag from '@/components/OrderStatusTag.vue'

const userStore = useUserStore()
const orders = ref([])
const activeStatus = ref('')

const filteredOrders = computed(() => {
  if (activeStatus.value === '') return orders.value
  if (activeStatus.value === 'refund') return orders.value.filter(o => o.status < 0)
  return orders.value.filter(o => o.status === parseInt(activeStatus.value))
})

onMounted(loadOrders)

async function loadOrders() {
  try {
    const res = await getOrders(userStore.user.id)
    const list = res.data || []
    for (const order of list) {
      try { const d = await getOrderDetail(order.id); order.items = d.data.items || [] } catch (e) { order.items = [] }
    }
    orders.value = list
  } catch (e) {}
}

async function handlePay(id) {
  try { await payOrder(id); ElMessage.success('支付成功'); loadOrders() } catch (e) {}
}

async function handleCancel(id) {
  try {
    await ElMessageBox.prompt('请输入取消原因', '取消订单', { confirmButtonText: '确认', cancelButtonText: '返回' })
    await cancelOrder(id, '用户主动取消')
    ElMessage.success('已取消')
    loadOrders()
  } catch (e) {}
}

async function handleConfirm(id) {
  try {
    await ElMessageBox.confirm('确认已收到货物？', '确认收货', { type: 'warning' })
    await confirmReceipt(id)
    ElMessage.success('已确认收货')
    loadOrders()
  } catch (e) {}
}
</script>

<style scoped>
.order-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; }
.order-card { margin-bottom: 16px; }
.order-header { display: flex; align-items: center; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid #ebeef5; margin-bottom: 12px; }
.order-time { color: #999; font-size: 13px; margin-left: auto; }
.order-items { display: flex; flex-wrap: wrap; gap: 12px; }
.order-item { display: flex; gap: 10px; align-items: center; }
.item-info { font-size: 14px; }
.item-price { color: #999; font-size: 13px; }
.order-total { text-align: right; font-size: 16px; margin-top: 12px; }
.order-total span { color: #f56c6c; font-size: 20px; font-weight: bold; }
.order-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; padding-top: 12px; border-top: 1px solid #ebeef5; }
</style>