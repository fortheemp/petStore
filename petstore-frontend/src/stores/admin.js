import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const mockProducts = [
  { id: 1, name: '皇家小型犬成犬粮', category: 'dogs', price: 159, stock: 50, status: '上架', image: '/images/product-1.jpg', description: '专为小型犬设计的营养配方' },
  { id: 2, name: '猫咪智能饮水机', category: 'cats', price: 199, stock: 30, status: '上架', image: '/images/product-2.jpg', description: '智能循环过滤，保持水质新鲜' },
  { id: 3, name: '宠物蝴蝶结项圈', category: 'dogs', price: 39, stock: 0, status: '下架', image: '/images/product-3.jpg', description: '精美蝴蝶结设计，让宠物更可爱' },
  { id: 4, name: '猫咪冻干零食', category: 'cats', price: 49, stock: 120, status: '上架', image: '/images/product-4.jpg', description: '纯肉冻干，健康美味' },
  { id: 5, name: '狗狗自动喂食器', category: 'dogs', price: 299, stock: 15, status: '上架', image: '/images/product-5.jpg', description: '定时定量，远程控制' },
  { id: 6, name: '水族箱过滤器', category: 'fish', price: 89, stock: 40, status: '上架', image: '/images/product-6.jpg', description: '静音高效，水质清澈' },
  { id: 7, name: '鸟类栖木站架', category: 'birds', price: 59, stock: 25, status: '上架', image: '/images/product-7.jpg', description: '天然木材，安全舒适' },
  { id: 8, name: '仓鼠跑轮', category: 'small', price: 29, stock: 60, status: '上架', image: '/images/product-8.jpg', description: '静音设计，不打扰休息' },
  { id: 9, name: '猫抓板瓦楞纸', category: 'cats', price: 19, stock: 200, status: '上架', image: '/images/product-9.jpg', description: '耐磨耐抓，保护家具' },
  { id: 10, name: '狗狗雨衣', category: 'dogs', price: 45, stock: 0, status: '下架', image: '/images/product-10.jpg', description: '防水透气，外出必备' },
]

const mockOrders = [
  {
    id: 'ORD1700000001',
    orderNo: 'PET20240115001',
    username: '张三',
    userId: 2,
    status: 0,
    totalAmount: 159,
    shippingFee: 0,
    payAmount: 159,
    items: [{ name: '皇家小型犬成犬粮', quantity: 1, price: 159 }],
    address: '广东省广州市天河区珠江新城华夏路30号',
    createTime: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'ORD1700000002',
    orderNo: 'PET20240115002',
    username: '李四',
    userId: 3,
    status: 1,
    totalAmount: 199,
    shippingFee: 0,
    payAmount: 199,
    items: [{ name: '猫咪智能饮水机', quantity: 1, price: 199 }],
    address: '北京市朝阳区望京SOHO T3 12层',
    createTime: '2024-01-15T11:20:00.000Z',
  },
  {
    id: 'ORD1700000003',
    orderNo: 'PET20240116001',
    username: '王五',
    userId: 4,
    status: 2,
    totalAmount: 248,
    shippingFee: 0,
    payAmount: 248,
    items: [
      { name: '猫咪冻干零食', quantity: 2, price: 49 },
      { name: '狗狗自动喂食器', quantity: 1, price: 299 },
    ],
    address: '上海市浦东新区世纪大道100号',
    createTime: '2024-01-16T09:15:00.000Z',
  },
  {
    id: 'ORD1700000004',
    orderNo: 'PET20240117001',
    username: '张三',
    userId: 2,
    status: 3,
    totalAmount: 89,
    shippingFee: 0,
    payAmount: 89,
    items: [{ name: '水族箱过滤器', quantity: 1, price: 89 }],
    address: '广东省广州市天河区珠江新城华夏路30号',
    createTime: '2024-01-17T14:00:00.000Z',
  },
  {
    id: 'ORD1700000005',
    orderNo: 'PET20240118001',
    username: '李四',
    userId: 3,
    status: -2,
    totalAmount: 49,
    shippingFee: 0,
    payAmount: 49,
    items: [{ name: '猫咪冻干零食', quantity: 1, price: 49 }],
    address: '北京市朝阳区望京SOHO T3 12层',
    createTime: '2024-01-18T16:45:00.000Z',
  },
]

const mockUsers = [
  { id: 1, username: 'admin', phone: '13888888888', nickname: '管理员', role: 'admin', status: '正常', createTime: '2024-01-01' },
  { id: 2, username: 'zhangsan', phone: '15966666666', nickname: '张三', role: 'user', status: '正常', createTime: '2024-01-10' },
  { id: 3, username: 'lisi', phone: '13755555555', nickname: '李四', role: 'user', status: '正常', createTime: '2024-01-12' },
  { id: 4, username: 'wangwu', phone: '13644444444', nickname: '王五', role: 'user', status: '正常', createTime: '2024-01-14' },
  { id: 5, username: 'zhaoliu', phone: '13533333333', nickname: '赵六', role: 'user', status: '正常', createTime: '2024-01-16' },
]

export const useAdminStore = defineStore('admin', () => {
  const products = ref([...mockProducts])
  const orders = ref([...mockOrders])
  const users = ref([...mockUsers])

  const totalProducts = computed(() => products.value.length)
  const totalUsers = computed(() => users.value.length)
  const totalOrders = computed(() => orders.value.length)
  const pendingOrders = computed(() => orders.value.filter((o) => o.status === 0).length)
  const todaySales = computed(() => {
    return orders.value
      .filter((o) => o.status !== -1 && o.status !== -2)
      .reduce((sum, o) => sum + o.payAmount, 0)
  })

  // Products
  const addProduct = (product) => {
    const newId = Math.max(...products.value.map((p) => p.id), 0) + 1
    products.value.push({ ...product, id: newId, status: '上架' })
  }

  const updateProduct = (id, data) => {
    const index = products.value.findIndex((p) => p.id === id)
    if (index >= 0) {
      products.value[index] = { ...products.value[index], ...data }
    }
  }

  const deleteProduct = (id) => {
    products.value = products.value.filter((p) => p.id !== id)
  }

  const toggleProductStatus = (id) => {
    const product = products.value.find((p) => p.id === id)
    if (product) {
      product.status = product.status === '上架' ? '下架' : '上架'
    }
  }

  // Orders
  const shipOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 2
      order.shipTime = new Date().toISOString()
    }
  }

  const approveRefund = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = -3
      order.statusText = '退款成功'
    }
  }

  const rejectRefund = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 2
      order.statusText = '已发货'
    }
  }

  return {
    products,
    orders,
    users,
    totalProducts,
    totalUsers,
    totalOrders,
    pendingOrders,
    todaySales,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    shipOrder,
    approveRefund,
    rejectRefund,
  }
})
