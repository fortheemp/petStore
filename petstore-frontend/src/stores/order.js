import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createOrder as apiCreateOrder, getOrderList, getOrderDetail, payOrder as apiPayOrder, cancelOrder as apiCancelOrder, confirmOrder as apiConfirmOrder, reviewOrder as apiReviewOrder } from '@/api/order'
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
      orders.value = Array.isArray(res) ? res : []
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

  async function confirmReceive(orderId) {
    try { await apiConfirmOrder(orderId); await loadOrders() } catch {}
  }

  async function submitReview(orderId, data) {
    const userId = getUserId()
    if (!userId) return
    try { await apiReviewOrder(orderId, { userId, ...data }); await loadOrders() } catch {}
  }

  async function getOrderDetailById(orderId) {
    try {
      const res = await getOrderDetail(orderId)
      return res
    } catch { return null }
  }

  const getOrdersByStatus = (status) => {
    if (status === null) return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  const getOrderById = (orderId) => orders.value.find((o) => o.id === orderId)
  const getStatusText = (status) => statusMap[String(status)] || '未知'

  return {
    orders, loadOrders, createOrder, payOrder: payOrderAction, cancelOrder: cancelOrderAction,
    confirmReceive, submitReview, getOrderDetailById,
    getOrdersByStatus, getOrderById, getStatusText,
  }
})
