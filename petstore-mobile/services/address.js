import { get, post, put, del } from './request'

export const getAddressList = (userId) => get('/addresses', { userId })
export const getAddressById = (id) => get(`/addresses/${id}`)
export const addAddress = (data) => post('/addresses', data)
export const updateAddress = (id, data) => put(`/addresses/${id}`, data)
export const deleteAddress = (id) => del(`/addresses/${id}`)
export const setDefaultAddress = (id) => post(`/addresses/${id}/default`)
