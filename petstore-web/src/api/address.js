import request from './request'

export function getAddresses(userId) {
  return request.get('/addresses', { params: { userId } })
}

export function addAddress(data) {
  return request.post('/addresses', data)
}

export function updateAddress(id, data) {
  return request.put(`/addresses/${id}`, data)
}

export function deleteAddress(id) {
  return request.delete(`/addresses/${id}`)
}

export function setDefaultAddress(id) {
  return request.post(`/addresses/${id}/default`)
}