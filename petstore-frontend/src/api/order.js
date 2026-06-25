import { get, post } from './request'

export const createOrder = (data, userId) => post('/orders', data, { params: { userId } })
export const getOrderList = (userId) => get('/orders', { userId })
export const getOrderDetail = (id) => get(`/orders/${id}`)
export const payOrder = (id) => post(`/orders/${id}/pay`)
export const cancelOrder = (id, data) => post(`/orders/${id}/cancel`, data || {})
export const confirmOrder = (id) => post(`/orders/${id}/confirm`)
export const refundOrder = (id, data) => post(`/orders/${id}/refund`, data || {})
export const reviewOrder = (id, data) => post(`/orders/${id}/review`, data)
