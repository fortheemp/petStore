import { mockProducts, mockProductDetails, queryProducts as _queryProducts, queryProductById as _queryProductById } from './mock'

const delay = (fn) => new Promise((resolve) => setTimeout(() => resolve(fn()), 200))

export const getProductList = (params = {}) => delay(() => {
  const result = _queryProducts(params)
  return { code: 200, data: result.list, total: result.total }
})

export const getProductDetail = (id) => delay(() => {
  const product = _queryProductById(id)
  if (!product) return { code: 404, message: '商品不存在' }
  return { code: 200, data: product }
})

export const searchProducts = (keyword) => delay(() => {
  const result = _queryProducts({ keyword })
  return { code: 200, data: result.list }
})

export const getHotProducts = () => delay(() => {
  const result = _queryProducts({ sort: 'sales', pageSize: 10 })
  return { code: 200, data: result.list }
})
