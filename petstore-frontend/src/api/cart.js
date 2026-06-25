import { get, post, put, del } from './request'

export const getCartList = (userId) => get('/cart', { userId })
export const addToCart = (data) => post('/cart', data)
export const updateCartItem = (id, data) => put(`/cart/${id}`, data)
export const removeCartItem = (id) => del(`/cart/${id}`)
export const clearCart = (userId) => del(`/cart/clear`, { params: { userId } })
