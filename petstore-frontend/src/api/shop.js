import { get } from './request'

export const getShopList = (params) => get('/shops', params)
export const getShopById = (id) => get(`/shops/${id}`)
