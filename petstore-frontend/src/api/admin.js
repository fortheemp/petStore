import { get, post, put, del } from './request'

// Products
export const getAdminProducts = () => get('/admin/products')
export const createAdminProduct = (formData) => post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateAdminProduct = (id, formData) => put(`/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteAdminProduct = (id) => del(`/admin/products/${id}`)

// Orders
export const getAdminOrders = (status) => get('/admin/orders', status !== undefined ? { status } : {})
export const getAdminOrderDetail = (id) => get(`/admin/orders/${id}`)
export const shipOrder = (id) => post(`/admin/orders/${id}/ship`)
export const approveRefund = (id, approved) => post(`/admin/orders/${id}/approve-refund`, { approved })
export const directRefund = (id, reason) => post(`/admin/orders/${id}/direct-refund`, { reason })

// Users
export const getAdminUsers = () => get('/admin/users')
export const deleteAdminUser = (id) => del(`/admin/users/${id}`)
