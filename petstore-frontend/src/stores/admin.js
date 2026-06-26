import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAdminProducts, deleteAdminProduct as apiDeleteProduct } from '@/api/admin'
import { getAdminOrders, shipOrder as apiShipOrder, approveRefund as apiApproveRefund } from '@/api/admin'
import { getAdminUsers } from '@/api/admin'
import { getAdminVideos, deleteAdminVideo as apiDeleteVideo } from '@/api/admin'

export const useAdminStore = defineStore('admin', () => {
  const products = ref([])
  const orders = ref([])
  const users = ref([])
  const videos = ref([])

  const totalProducts = computed(() => products.value.length)
  const totalUsers = computed(() => users.value.length)
  const totalOrders = computed(() => orders.value.length)
  const pendingOrders = computed(() => orders.value.filter((o) => o.status === 0).length)
  const todaySales = computed(() =>
    orders.value.filter((o) => o.status !== -1 && o.status !== -2).reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
  )

  async function loadProducts() {
    try {
      const res = await getAdminProducts()
      products.value = Array.isArray(res) ? res : []
    } catch { products.value = [] }
  }

  async function loadOrders() {
    try {
      const res = await getAdminOrders()
      orders.value = Array.isArray(res) ? res : []
    } catch { orders.value = [] }
  }

  async function loadUsers() {
    try {
      const res = await getAdminUsers()
      users.value = Array.isArray(res) ? res : []
    } catch { users.value = [] }
  }

  async function loadVideos() {
    try {
      const res = await getAdminVideos()
      videos.value = Array.isArray(res) ? res : []
    } catch { videos.value = [] }
  }

  async function loadAll() {
    await Promise.all([loadProducts(), loadOrders(), loadUsers(), loadVideos()])
  }

  async function deleteProduct(id) {
    try { await apiDeleteProduct(id); await loadProducts() } catch {}
  }

  async function deleteVideo(id) {
    try { await apiDeleteVideo(id); await loadVideos() } catch {}
  }

  async function shipOrderAction(orderId) {
    try { await apiShipOrder(orderId); await loadOrders() } catch {}
  }

  async function approveRefundAction(orderId) {
    try { await apiApproveRefund(orderId, true); await loadOrders() } catch {}
  }

  async function rejectRefundAction(orderId) {
    try { await apiApproveRefund(orderId, false); await loadOrders() } catch {}
  }

  async function init() {
    await loadAll()
  }

  init()

  return {
    products, orders, users, videos, totalProducts, totalUsers, totalOrders, pendingOrders, todaySales,
    loadProducts, loadOrders, loadUsers, loadVideos, loadAll, deleteProduct, deleteVideo,
    shipOrder: shipOrderAction, approveRefund: approveRefundAction, rejectRefund: rejectRefundAction,
  }
})
