import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get, post, del, postForm, putForm } from '@/api'

export const useAdminStore = defineStore('admin', () => {
  // ===== 状态 =====
  const products = ref([])
  const orders = ref([])
  const users = ref([])
  const shops = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  // ===== 计算属性 =====
  const totalProducts = computed(() => products.value.length)
  const totalUsers = computed(() => users.value.length)
  const totalOrders = computed(() => orders.value.length)
  const pendingOrders = computed(() => orders.value.filter((o) => o.status === 0).length)
  const todaySales = computed(() => {
    return orders.value
      .filter((o) => o.status !== -1 && o.status !== -2)
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
  })

  // ===== 商品管理 =====
  const fetchProducts = async () => {
    const res = await get('/admin/products')
    if (res.data.code === 200) products.value = res.data.data || []
    return res.data
  }

  const addProduct = async (formData) => {
    // formData 应为 FormData 对象，或自动转为 FormData 的普通对象
    const fd = formData instanceof FormData ? formData : objectToFormData(formData)
    const res = await postForm('/admin/products', fd)
    if (res.data.code === 200) await fetchProducts()
    return res.data
  }

  const updateProduct = async (id, formData) => {
    const fd = formData instanceof FormData ? formData : objectToFormData(formData)
    const res = await putForm(`/admin/products/${id}`, fd)
    if (res.data.code === 200) await fetchProducts()
    return res.data
  }

  const deleteProduct = async (id) => {
    const res = await del(`/admin/products/${id}`)
    if (res.data.code === 200) {
      products.value = products.value.filter((p) => p.id !== id)
    }
    return res.data
  }

  // ===== 商店管理 =====
  const fetchShops = async () => {
    const res = await get('/admin/shops')
    if (res.data.code === 200) shops.value = res.data.data || []
    return res.data
  }

  // ===== 订单管理 =====
  const fetchOrders = async (status) => {
    const params = status !== undefined && status !== '' ? { status } : {}
    const res = await get('/admin/orders', params)
    if (res.data.code === 200) orders.value = res.data.data || []
    return res.data
  }

  const shipOrder = async (orderId) => {
    const res = await post(`/admin/orders/${orderId}/ship`)
    if (res.data.code === 200) {
      const order = orders.value.find((o) => o.id === orderId)
      if (order) order.status = 2
    }
    return res.data
  }

  const approveRefund = async (orderId) => {
    const res = await post(`/admin/orders/${orderId}/approve-refund`, { approved: true })
    if (res.data.code === 200) {
      const order = orders.value.find((o) => o.id === orderId)
      if (order) order.status = -3
    }
    return res.data
  }

  const rejectRefund = async (orderId) => {
    const res = await post(`/admin/orders/${orderId}/approve-refund`, { approved: false })
    if (res.data.code === 200) {
      const order = orders.value.find((o) => o.id === orderId)
      if (order) order.status = 2
    }
    return res.data
  }

  // ===== 用户管理 =====
  const fetchUsers = async () => {
    const res = await get('/admin/users')
    if (res.data.code === 200) users.value = res.data.data || []
    return res.data
  }

  const deleteUser = async (id) => {
    const res = await del(`/admin/users/${id}`)
    if (res.data.code === 200) {
      users.value = users.value.filter((u) => u.id !== id)
    }
    return res.data
  }

  // ===== 全部加载 =====
  const loadAll = async () => {
    if (loaded.value) return
    loading.value = true
    try {
      await Promise.all([fetchProducts(), fetchOrders(), fetchUsers(), fetchShops()])
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    products, orders, users, shops, loading, loaded,
    totalProducts, totalUsers, totalOrders, pendingOrders, todaySales,
    fetchProducts, addProduct, updateProduct, deleteProduct,
    fetchShops,
    fetchOrders, shipOrder, approveRefund, rejectRefund,
    fetchUsers, deleteUser,
    loadAll,
  }
})

// 工具函数：普通对象 → FormData
function objectToFormData(obj) {
  const fd = new FormData()
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (val === undefined || val === null) continue
    if (val instanceof File) {
      fd.append(key, val)
    } else {
      fd.append(key, String(val))
    }
  }
  return fd
}

