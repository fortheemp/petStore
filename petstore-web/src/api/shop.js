import request from './request'

export function getNearbyShops(lat, lng) {
  return request.get('/shops', { params: { lat, lng } })
}

export function getShopDetail(id) {
  return request.get(`/shops/${id}`)
}