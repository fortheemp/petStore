import request from './request'

export function createOrder(userId, data) {
  return request.post('/orders', data, { params: { userId } })
}

export function getOrders(userId) {
  return request.get('/orders', { params: { userId } })
}

export function getOrderDetail(id) {
  return request.get(`/orders/${id}`)
}

export function payOrder(id) {
  return request.post(`/orders/${id}/pay`)
}

export function cancelOrder(id, reason) {
  return request.post(`/orders/${id}/cancel`, { reason })
}

export function confirmReceipt(id) {
  return request.post(`/orders/${id}/confirm`)
}

export function applyRefund(id, reason) {
  return request.post(`/orders/${id}/refund`, { reason })
}

export function reviewOrder(id, userId, content, rating) {
  return request.post(`/orders/${id}/review`, { userId, content, rating })
}