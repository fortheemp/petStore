import request from './request'

export function getCart(userId) {
  return request.get('/cart', { params: { userId } })
}

export function addToCart(userId, productId, quantity) {
  return request.post('/cart', { userId, productId, quantity })
}

export function updateCartQuantity(id, quantity) {
  return request.put(`/cart/${id}`, { quantity })
}

export function removeFromCart(id) {
  return request.delete(`/cart/${id}`)
}

export function clearCart(userId) {
  return request.delete('/cart/clear', { params: { userId } })
}