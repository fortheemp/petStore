import { get } from './request'

function fixImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) {
    return url.replace('http://10.171.141.181:8080', '')
  }
  return url
}

export const getShopList = (params) => get('/shops', params).then((list) => {
  const arr = Array.isArray(list) ? list : []
  return arr.map((shop) => ({
    ...shop,
    image: fixImageUrl(shop.image),
  }))
})

export const getShopById = (id) => get(`/shops/${id}`).then((shop) => {
  if (!shop) return null
  return { ...shop, image: fixImageUrl(shop.image) }
})
