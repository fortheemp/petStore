import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAdminProducts, deleteAdminProduct as apiDeleteProduct } from '@/api/admin'
import { getAdminOrders, getAdminOrderDetail, shipOrder as apiShipOrder, approveRefund as apiApproveRefund, directRefund as apiDirectRefund } from '@/api/admin'
import { getAdminUsers, deleteAdminUser as apiDeleteUser } from '@/api/admin'

export const useAdminStore = defineStore('admin', () => {
  const products = ref([])
  const orders = ref([])
  const users = ref([])

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
      const list = Array.isArray(res) ? res : []
      const enriched = await Promise.all(list.map(async (o) => {
        try {
          const detail = await getAdminOrderDetail(o.id)
          return { ...o, items: detail?.items || [] }
        } catch {
          return { ...o, items: [] }
        }
      }))
      orders.value = enriched
    } catch { orders.value = [] }
  }

  async function loadUsers() {
    try {
      const res = await getAdminUsers()
      users.value = Array.isArray(res) ? res : []
    } catch { users.value = [] }
  }

  async function loadAll() {
    await Promise.all([loadProducts(), loadOrders(), loadUsers()])
  }

  async function deleteProduct(id) {
    try { await apiDeleteProduct(id); await loadProducts() } catch {}
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

  async function directRefundAction(orderId, reason) {
    try { await apiDirectRefund(orderId, reason); await loadOrders() } catch {}
  }

  async function deleteUserAction(id) {
    try { await apiDeleteUser(id); await loadUsers() } catch {}
  }

  async function init() {
    await loadAll()
  }

  init()

  return {
    products, orders, users, totalProducts, totalUsers, totalOrders, pendingOrders, todaySales,
    loadProducts, loadOrders, loadUsers, loadAll, deleteProduct, deleteUser: deleteUserAction,
    shipOrder: shipOrderAction, approveRefund: approveRefundAction, rejectRefund: rejectRefundAction, directRefund: directRefundAction,
  }
})
