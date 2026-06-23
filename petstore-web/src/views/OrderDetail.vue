<template>
  <AppLayout>
    <div class="order-detail" v-if="order">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orders' }">我的订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单 #{{ order.id }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="order-header-card">
        <div class="status-area">
          <OrderStatusTag :status="order.status" />
          <span class="status-desc">{{ getStatusDesc(order.status) }}</span>
        </div>
        <div class="order-meta">
          <span>下单时间：{{ order.createdAt }}</span>
          <span>订单编号：{{ order.id }}</span>
        </div>
      </div>

      <!-- Address -->
      <el-card class="section-card">
        <template #header>📍 收货地址</template>
        <div v-if="addressSnapshot">
          <p><strong>{{ addressSnapshot.receiverName }}</strong> {{ addressSnapshot.phone }}</p>
          <p>{{ addressSnapshot.province }}{{ addressSnapshot.city }}{{ addressSnapshot.district }} {{ addressSnapshot.detail }}</p>
        </div>
      </el-card>

      <!-- Items -->
      <el-card class="section-card">
        <template #header>🛒 订单商品</template>
        <el-table :data="items" style="width: 100%">
          <el-table-column label="商品" min-width="250">
            <template #default="{ row }">
              <div class="product-cell">
                <el-image :src="row.productImage" style="width:60px;height:60px;border-radius:6px;" fit="cover">
                  <template #error><div class="img-ph">🐾</div></template>
                </el-image>
                <span>{{ row.productName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="100">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column label="数量" width="80">
            <template #default="{ row }">{{ row.quantity }}</template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">¥{{ (parseFloat(row.price) * row.quantity).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
        <div class="total-line">总计：<span class="total-price">¥{{ order.totalAmount }}</span></div>
      </el-card>

      <!-- Actions -->
      <div class="actions-area">
        <el-button v-if="order.status === 0" type="primary" size="large" @click="handlePay">去支付</el-button>
        <el-button v-if="order.status === 0 || order.status === 1" type="warning" size="large" @click="handleCancel">取消订单</el-button>
        <el-button v-if="order.status === 2" type="success" size="large" @click="handleConfirm">确认收货</el-button>
        <el-button v-if="order.status === 2 || order.status === 3" type="danger" size="large" @click="handleRefund">申请退单</el-button>
        <el-button v-if="order.status === 3" type="primary" size="large" @click="showReviewDialog">评价</el-button>
      </div>

      <!-- Cancel reason -->
      <el-card v-if="order.cancelReason" class="section-card">
        <template #header>取消原因</template>
        <p>{{ order.cancelReason }}</p>
      </el-card>

      <!-- Refund info -->
      <el-card v-if="order.refundReason" class="section-card">
        <template #header>退单信息</template>
        <p>{{ order.refundReason }}</p>
      </el-card>

      <!-- Review Dialog -->
      <el-dialog v-model="reviewVisible" title="评价订单" width="450px">
        <el-form>
          <el-form-item label="评分">
            <el-rate v-model="reviewRating" :max="5" show-score />
          </el-form-item>
          <el-form-item label="评价内容">
            <el-input v-model="reviewContent" type="textarea" :rows="3" placeholder="分享你的体验..." />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="reviewVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview">提交评价</el-button>
        </template>
      </el-dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderDetail, payOrder, cancelOrder, confirmReceipt, applyRefund, reviewOrder } from '@/api/order'
import AppLayout from '@/components/AppLayout.vue'
import OrderStatusTag from '@/components/OrderStatusTag.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const order = ref(null)
const items = ref([])
const reviewVisible = ref(false)
const reviewRating = ref(5)
const reviewContent = ref('')

const addressSnapshot = computed(() => {
  if (!order.value?.addressSnapshot) return null
  try {
    return typeof order.value.addressSnapshot === 'string'
      ? JSON.parse(order.value.addressSnapshot)
      : order.value.addressSnapshot
  } catch (e) { return null }
})

function getStatusDesc(status) {
  const map = { 0: '请尽快完成支付', 1: '商家正在备货中', 2: '商品已发货，请留意收货', 3: '请对本次购物进行评价', 4: '订单已完成，感谢您的购买', '-1': '订单已取消', '-2': '退单正在审核中', '-3': '退单已通过', '-4': '管理员已处理退单' }
  return map[status] || ''
}

onMounted(async () => {
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = res.data.order
    items.value = res.data.items || []
  } catch (e) {}
})

async function handlePay() {
  try { await payOrder(order.value.id); ElMessage.success('支付成功'); loadOrder() } catch (e) {}
}

async function handleCancel() {
  try {
    await ElMessageBox.prompt('取消原因', '取消订单', { confirmButtonText: '确认' })
    await cancelOrder(order.value.id, '用户取消')
    ElMessage.success('已取消'); loadOrder()
  } catch (e) {}
}

async function handleConfirm() {
  try {
    await ElMessageBox.confirm('确认已收到货物？', '确认收货', { type: 'warning' })
    await confirmReceipt(order.value.id)
    ElMessage.success('已确认收货'); loadOrder()
  } catch (e) {}
}

async function handleRefund() {
  try {
    const { value } = await ElMessageBox.prompt('请输入退单原因', '申请退单', { confirmButtonText: '提交' })
    await applyRefund(order.value.id, value || '用户申请退单')
    ElMessage.success('退单申请已提交'); loadOrder()
  } catch (e) {}
}

function showReviewDialog() {
  reviewRating.value = 5
  reviewContent.value = ''
  reviewVisible.value = true
}

async function submitReview() {
  try {
    await reviewOrder(order.value.id, userStore.user.id, reviewContent.value || '好评！', reviewRating.value)
    ElMessage.success('评价成功'); reviewVisible.value = false; loadOrder()
  } catch (e) {}
}

async function loadOrder() {
  const res = await getOrderDetail(order.value.id)
  order.value = res.data.order
  items.value = res.data.items || []
}
</script>

<style scoped>
.order-detail { max-width: 1000px; margin: 0 auto; padding: 20px; }
.order-header-card { background: #fff; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.status-area { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.status-desc { color: #666; font-size: 14px; }
.order-meta { display: flex; gap: 24px; color: #999; font-size: 13px; }
.section-card { margin-bottom: 16px; }
.product-cell { display: flex; gap: 12px; align-items: center; }
.img-ph { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; }
.total-line { text-align: right; font-size: 18px; margin-top: 16px; }
.total-price { color: #f56c6c; font-size: 24px; font-weight: bold; margin-left: 8px; }
.actions-area { display: flex; gap: 12px; padding: 20px; background: #fff; border-radius: 12px; margin: 16px 0; }
</style>