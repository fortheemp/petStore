import axios from 'axios'
import request from './request'

// === 商店管理 ===
export function getAdminShops() {
  return request.get('/admin/shops')
}
export function addShop(formData) {
  return axios.post('/api/admin/shops', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}
export function updateShop(id, formData) {
  return axios.put(`/api/admin/shops/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}
export function deleteShop(id) {
  return request.delete(`/admin/shops/${id}`)
}

// === 商品管理 ===
export function getAdminProducts() {
  return request.get('/admin/products')
}
export function addProduct(formData) {
  return axios.post('/api/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}
export function updateProduct(id, formData) {
  return axios.put(`/api/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}
export function deleteProduct(id) {
  return request.delete(`/admin/products/${id}`)
}

// === 视频管理 ===
export function getAdminVideos() {
  return request.get('/admin/videos')
}
export function addVideo(formData) {
  return axios.post('/api/admin/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}
export function updateVideo(id, data) {
  return request.put(`/admin/videos/${id}`, data)
}
export function deleteVideo(id) {
  return request.delete(`/admin/videos/${id}`)
}

// === 用户管理 ===
export function getAdminUsers() {
  return request.get('/admin/users')
}
export function deleteUser(id) {
  return request.delete(`/admin/users/${id}`)
}

// === 订单管理 ===
export function getAdminOrders(status) {
  return request.get('/admin/orders', { params: { status } })
}
export function getAdminOrderDetail(id) {
  return request.get(`/admin/orders/${id}`)
}
export function shipOrder(id) {
  return request.post(`/admin/orders/${id}/ship`)
}
export function approveRefund(id, approved) {
  return request.post(`/admin/orders/${id}/approve-refund`, { approved })
}
export function directRefund(id, reason) {
  return request.post(`/admin/orders/${id}/direct-refund`, { reason })
}