import { get } from './request'

let _productCache = null

async function getProductById(id) {
  if (!_productCache) {
    const list = await get('/products')
    _productCache = Array.isArray(list) ? list : []
  }
  return _productCache.find((p) => p.id === id) || null
}

export const getVideoList = (category) => {
  return get('/videos').then(async (list) => {
    let arr = Array.isArray(list) ? list : []
    if (category && category !== 'all') {
      arr = arr.filter((v) => v.category === category)
    }
    const enriched = await Promise.all(arr.map(async (v) => {
      if (v.productId) {
        const product = await getProductById(v.productId)
        if (product) {
          v.relatedProduct = { id: product.id, name: product.name, price: Number(product.price) || 0, image: product.image || '' }
        }
      }
      return v
    }))
    return enriched
  })
}

export const getVideoById = (id) => get(`/videos/${id}`)

export function formatCount(count) {
  if (!count) return '0'
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return count.toString()
}
