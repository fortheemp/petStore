import { defineStore } from 'pinia'
import { ref } from 'vue'

const statusMap = {
  '-1': '已取消',
  '0': '待付款',
  '1': '已付款',
  '2': '已发货',
  '3': '已收货',
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])

  const init = () => {
    const saved = localStorage.getItem('petstore_orders')
    if (saved) {
      try { orders.value = JSON.parse(saved) } catch { orders.value = [] }
    }
  }

  const createOrder = ({ items, address, remark, payMethod, totalAmount, shippingFee }) => {
    const now = new Date()
    const order = {
      id: 'ORD' + Date.now(),
      orderNo: 'PET' + Date.now(),
      status: 0,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        spec: item.spec.value,
      })),
      address: { ...address },
      totalAmount,
      shippingFee,
      payAmount: totalAmount + shippingFee,
      payMethod,
      remark,
      createTime: now.toISOString(),
      payTime: null,
      shipTime: null,
      receiveTime: null,
    }
    orders.value.unshift(order)
    save()
    return order
  }

  const payOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 1
      order.payTime = new Date().toISOString()
      save()
    }
  }

  const shipOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 2
      order.shipTime = new Date().toISOString()
      save()
    }
  }

  const cancelOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = -1
      save()
    }
  }

  const confirmReceive = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 3
      order.receiveTime = new Date().toISOString()
      save()
    }
  }

  const getOrdersByStatus = (status) => {
    if (status === null) return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  const getOrderById = (orderId) => {
    return orders.value.find((o) => o.id === orderId)
  }

  const getStatusText = (status) => statusMap[String(status)] || '未知'

  // 评价相关
  const REVIEWS_KEY = 'petstore_reviews'

  const submitReview = (orderId, reviews) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (!order) return false
    order.reviewed = true
    order.reviewAt = new Date().toISOString()
    save()

    const allReviews = loadReviews()
    reviews.forEach((r) => {
      allReviews.push({
        orderId,
        productId: r.productId,
        rating: r.rating,
        content: r.content,
        createTime: order.reviewAt,
      })
    })
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews))
    return true
  }

  const getOrderReviews = (orderId) => {
    return loadReviews().filter((r) => r.orderId === orderId)
  }

  const getProductReviews = (productId) => {
    return loadReviews().filter((r) => r.productId === productId)
  }

  function loadReviews() {
    const saved = localStorage.getItem(REVIEWS_KEY)
    if (saved) {
      try { return JSON.parse(saved) } catch { }
    }
    return []
  }

  const save = () => {
    localStorage.setItem('petstore_orders', JSON.stringify(orders.value))
  }

  init()

  return {
    orders,
    createOrder, payOrder, shipOrder, cancelOrder, confirmReceive,
    getOrdersByStatus, getOrderById, getStatusText,
    submitReview, getOrderReviews, getProductReviews,
    _save: save, // 供 Checkout.vue 同步后端订单到 localStorage
  }
})
