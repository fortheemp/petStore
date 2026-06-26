const CART_KEY = 'petstore_cart'

const delay = (fn) => new Promise((resolve) => setTimeout(() => resolve(fn()), 200))

const getCart = () => {
  try {
    return JSON.parse(uni.getStorageSync(CART_KEY)) || []
  } catch {
    return []
  }
}

const saveCart = (cart) => {
  uni.setStorageSync(CART_KEY, JSON.stringify(cart))
}

export const getCartList = () => delay(() => {
  const cart = getCart()
  return { code: 200, data: cart }
})

export const addToCart = (data) => delay(() => {
  const cart = getCart()
  const { productId, name, price, quantity = 1, spec = '标准款', image = '' } = data
  const existing = cart.find((item) => item.productId === productId && item.spec === spec)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      id: Date.now(),
      productId,
      name,
      price,
      quantity,
      spec,
      image,
    })
  }
  saveCart(cart)
  return { code: 200, data: cart, message: '已加入购物车' }
})

export const updateCartQuantity = (data) => delay(() => {
  const cart = getCart()
  const { id, quantity } = data
  const item = cart.find((item) => item.id === id)
  if (item) {
    if (quantity <= 0) {
      const idx = cart.indexOf(item)
      cart.splice(idx, 1)
    } else {
      item.quantity = quantity
    }
  }
  saveCart(cart)
  return { code: 200, data: cart }
})

export const removeFromCart = (id) => delay(() => {
  const cart = getCart().filter((item) => item.id !== id)
  saveCart(cart)
  return { code: 200, data: cart, message: '已移除' }
})

export const clearCart = () => delay(() => {
  saveCart([])
  return { code: 200, data: [], message: '购物车已清空' }
})
