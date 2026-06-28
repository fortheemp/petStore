import { reactive } from 'vue'
import { getCartList, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem, clearCart as apiClearCart } from '../services/cart'
import { useUserStore } from './user'

const PRODUCT_CACHE_KEY = 'petstore_cart_products'

function loadProductCache() {
  try { return JSON.parse(uni.getStorageSync(PRODUCT_CACHE_KEY) || '{}') } catch { return {} }
}

function saveProductCache(cache) {
  uni.setStorageSync(PRODUCT_CACHE_KEY, JSON.stringify(cache))
}

const state = reactive({
  items: [],
})

export const useCartStore = () => ({
  get items() { return state.items },
  get totalItems() { return state.items.reduce((sum, item) => sum + item.quantity, 0) },
  get totalPrice() { return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) },

  async loadCart() {
    const userId = useUserStore().user?.id
    if (!userId) { state.items = []; return }
    try {
      const res = await getCartList(userId)
      const list = Array.isArray(res) ? res : []
      const cache = loadProductCache()
      state.items = list.map((item) => {
        const p = cache[item.productId] || {}
        return {
          id: item.id,
          productId: item.productId,
          name: p.name || `商品#${item.productId}`,
          image: p.image || '',
          price: Number(p.price) || 0,
          quantity: item.quantity,
          stock: p.stock || 99,
        }
      })
    } catch { state.items = [] }
  },

  async addItem(product, quantity = 1, spec = '标准款') {
    const userId = useUserStore().user?.id
    if (!userId) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const cache = loadProductCache()
    cache[product.id] = { name: product.name, image: product.image, price: product.price, stock: product.stock || 50 }
    saveProductCache(cache)

    const existing = state.items.find((item) => item.productId === product.id)
    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, existing.stock)
      existing.quantity = newQty
      try { await apiUpdateCartItem(existing.id, { quantity: newQty }) } catch {}
    } else {
      try {
        const res = await apiAddToCart({ userId, productId: product.id, quantity })
        state.items.push({
          id: res?.id || Date.now(),
          productId: product.id,
          name: product.name,
          image: product.image || '',
          price: product.price,
          quantity,
          stock: product.stock || 50,
        })
      } catch {}
    }
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  },

  async updateQuantity(itemId, quantity) {
    const item = state.items.find((i) => i.id === itemId)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock))
      try { await apiUpdateCartItem(itemId, { quantity: item.quantity }) } catch {}
    }
  },

  async removeItem(itemId) {
    try { await apiRemoveCartItem(itemId) } catch {}
    state.items = state.items.filter((i) => i.id !== itemId)
  },

  async clearCart() {
    const userId = useUserStore().user?.id
    if (userId) {
      try { await apiClearCart(userId) } catch {}
    }
    state.items = []
  },
})
