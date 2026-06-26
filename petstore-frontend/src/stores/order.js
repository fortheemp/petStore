import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createOrder as apiCreateOrder, getOrderList, getOrderDetail, payOrder as apiPayOrder, cancelOrder as apiCancelOrder, confirmOrder as apiConfirmOrder, reviewOrder as apiReviewOrder, refundOrder as apiRefundOrder } from '@/api/order'
import { useUserStore } from './user'

const statusMap = {
  '-4': '管理员退款',
  '-3': '退款成功',
  '-2': '退款中',
  '-1': '已取消',
  '0': '待付款',
  '1': '已付款',
  '2': '已发货',
  '3': '已收货',
  '4': '已完成',
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])

  function getUserId() {
    const userStore = useUserStore()
    return userStore.userInfo?.id
  }

  async function loadOrders() {
    const userId = getUserId()
    if (!userId) { orders.value = []; return }
    try {
      const res = await getOrderList(userId)
      const list = Array.isArray(res) ? res : []
      // 后端 list 不含 items，逐个获取明细
      const enriched = await Promise.all(list.map(async (o) => {
        let items = []
        try {
          const detail = await getOrderDetail(o.id)
          items = Array.isArray(detail?.items) ? detail.items : []
        } catch {}
        return {
          ...o,
          orderNo: `PS${String(o.id).padStart(8, '0')}`,
          createTime: o.createdAt,
          payAmount: Number(o.totalAmount) || 0,
          items: items.map((it) => ({
            productId: it.productId,
            name: it.productName,
            image: it.productImage || '',
            price: Number(it.price) || 0,
            quantity: it.quantity || 1,
            spec: it.spec || '',
          })),
        }
      }))
      orders.value = enriched
    } catch { orders.value = [] }
  }

  async function createOrder({ addressId, cartItemIds }) {
    const userId = getUserId()
    if (!userId) return null
    try {
      const res = await apiCreateOrder({ addressId, cartItemIds }, userId)
      await loadOrders()
      return res
    } catch { return null }
  }

  async function payOrderAction(orderId) {
    try { await apiPayOrder(orderId); await loadOrders() } catch {}
  }

  async function cancelOrderAction(orderId, reason) {
    try { await apiCancelOrder(orderId, { reason }); await loadOrders() } catch {}
  }

  async function applyRefundAction(orderId, reason) {
    try {
      await apiRefundOrder(orderId, { reason })
      await loadOrders()
    } catch (e) {
      console.error('applyRefund failed:', e)
      throw e
    }
  }

  async function confirmReceive(orderId) {
    try { await apiConfirmOrder(orderId); await loadOrders() } catch {}
  }

  async function submitReview(orderId, data) {
    const userId = getUserId()
    if (!userId) return
    try { await apiReviewOrder(orderId, { userId, reviews: data }); await loadOrders() } catch {}
  }

  async function getOrderDetailById(orderId) {
    try {
      const res = await getOrderDetail(orderId)
      if (res && res.order) {
        const o = res.order
        let address = {}
        try { address = JSON.parse(o.addressSnapshot || '{}') } catch {}
        const totalAmount = Number(o.totalAmount) || 0
        return {
          ...o,
          orderNo: `PS${String(o.id).padStart(8, '0')}`,
          createTime: o.createdAt,
          payTime: o.updatedAt,
          totalAmount,
          payAmount: totalAmount,
          shippingFee: totalAmount >= 199 ? 0 : 10,
          address,
          payMethod: 'wechat',
          remark: '',
          reviewed: false,
          items: Array.isArray(res.items) ? res.items.map((it) => ({
            productId: it.productId,
            name: it.productName,
            image: it.productImage || '',
            price: Number(it.price) || 0,
            quantity: it.quantity || 1,
            spec: it.spec || '',
          })) : [],
        }
      }
      return null
    } catch (e) {
      console.error('store.getOrderDetailById: error=', e)
      return null
    }
  }

  const getOrdersByStatus = (status) => {
    if (status === null) return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  const getOrderById = (orderId) => orders.value.find((o) => o.id === orderId)
  const getStatusText = (status) => statusMap[String(status)] || '未知'

  return {
    orders, loadOrders, createOrder, payOrder: payOrderAction, cancelOrder: cancelOrderAction,
    confirmReceive, submitReview, applyRefund: applyRefundAction, getOrderDetailById,
    getOrdersByStatus, getOrderById, getStatusText,
  }
})
