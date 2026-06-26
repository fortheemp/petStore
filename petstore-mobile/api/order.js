import { mockOrders } from './mock'

const ORDERS_KEY = 'petstore_orders'

const delay = (fn) => new Promise((resolve) => setTimeout(() => resolve(fn()), 200))

const getStoredOrders = () => {
  try {
    const stored = JSON.parse(uni.getStorageSync(ORDERS_KEY))
    if (stored && stored.length > 0) return stored
  } catch { /* ignore */ }
  return [...mockOrders]
}

const saveOrders = (orders) => {
  uni.setStorageSync(ORDERS_KEY, JSON.stringify(orders))
}

export const createOrder = (data) => delay(() => {
  const orders = getStoredOrders()
  const newOrder = {
    id: orders.length + 1,
    orderNo: 'PS' + Date.now(),
    status: 1,
    statusText: '待付款',
    items: data.items || [],
    goodsTotal: data.goodsTotal || 0,
    freight: 0,
    totalPrice: data.totalPrice || data.goodsTotal || 0,
    createTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).replace(/\//g, '-'),
    payMethod: null,
  }
  orders.unshift(newOrder)
  saveOrders(orders)
  return { code: 200, data: newOrder, message: '下单成功' }
})

export const getOrderList = (params = {}) => delay(() => {
  let orders = getStoredOrders()
  if (params.status !== undefined && params.status !== '' && params.status !== 0) {
    orders = orders.filter((o) => o.status === params.status)
  }
  return { code: 200, data: orders, total: orders.length }
})

export const getOrderDetail = (id) => delay(() => {
  const orders = getStoredOrders()
  const order = orders.find((o) => o.id === Number(id))
  if (!order) return { code: 404, message: '订单不存在' }
  return { code: 200, data: order }
})

export const cancelOrder = (id) => delay(() => {
  const orders = getStoredOrders()
  const order = orders.find((o) => o.id === Number(id))
  if (!order) return { code: 404, message: '订单不存在' }
  if (order.status !== 1) return { code: 400, message: '当前订单状态不可取消' }
  order.status = 0
  order.statusText = '已取消'
  saveOrders(orders)
  return { code: 200, data: order, message: '订单已取消' }
})

export const confirmReceive = (id) => delay(() => {
  const orders = getStoredOrders()
  const order = orders.find((o) => o.id === Number(id))
  if (!order) return { code: 404, message: '订单不存在' }
  if (order.status !== 3) return { code: 400, message: '当前订单状态不可确认收货' }
  order.status = 4
  order.statusText = '已完成'
  saveOrders(orders)
  return { code: 200, data: order, message: '已确认收货' }
})
