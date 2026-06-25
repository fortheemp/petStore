import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get, post, put, del, postForm, putForm } from '@/api'

export const useAdminStore = defineStore('admin', () => {
  // ===== 状态 =====
  const products = ref([])
  const orders = ref([])
  const users = ref([])
  const shops = ref([])
  const videos = ref([])
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

  const addProduct = async (fd) => {
    const res = await postForm('/admin/products', fd)
    if (res.data.code === 200) await fetchProducts()
    return res.data
  }

  const updateProduct = async (id, fd) => {
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

  // ===== 视频管理 =====
  const fetchVideos = async () => {
    const res = await get('/admin/videos')
    if (res.data.code === 200) videos.value = res.data.data || []
    return res.data
  }

  const addVideo = async (fd) => {
    const res = await postForm('/admin/videos', fd)
    if (res.data.code === 200) await fetchVideos()
    return res.data
  }

  const updateVideo = async (id, data) => {
    // 后端使用 @RequestParam，必须用 FormData 或 query params
    const fd = data instanceof FormData ? data : new FormData()
    if (!(data instanceof FormData)) {
      if (data.title !== undefined) fd.append('title', data.title)
      if (data.url !== undefined) fd.append('url', data.url || '')
      if (data.productId !== undefined) fd.append('productId', data.productId)
    }
    const res = await putForm(`/admin/videos/${id}`, fd)
    if (res.data.code === 200) await fetchVideos()
    return res.data
  }

  const deleteVideo = async (id) => {
    const res = await del(`/admin/videos/${id}`)
    if (res.data.code === 200) {
      videos.value = videos.value.filter((v) => v.id !== id)
    }
    return res.data
  }

  // ===== 全部加载 =====
  const loadAll = async () => {
    if (loaded.value) return
    loading.value = true
    try {
      await Promise.all([fetchProducts(), fetchOrders(), fetchUsers(), fetchShops(), fetchVideos()])
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    products, orders, users, shops, videos, loading, loaded,
    totalProducts, totalUsers, totalOrders, pendingOrders, todaySales,
    fetchProducts, addProduct, updateProduct, deleteProduct,
    fetchShops,
    fetchOrders, shipOrder, approveRefund, rejectRefund,
    fetchUsers, deleteUser,
    fetchVideos, addVideo, updateVideo, deleteVideo,
    loadAll,
  }
})


