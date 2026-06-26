import { reactive } from 'vue'

const CART_KEY = 'petstore_cart'

function loadCart() {
  try {
    const raw = uni.getStorageSync(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCart(items) {
  uni.setStorageSync(CART_KEY, JSON.stringify(items))
}

const state = reactive({
  items: loadCart(),
})

export const useCartStore = () => ({
  get items() { return state.items },
  get totalItems() { return state.items.reduce((sum, item) => sum + item.quantity, 0) },
  get totalPrice() { return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) },

  addItem(product, quantity = 1, spec = '标准款') {
    const existing = state.items.find(
      item => item.productId === product.id && item.spec === spec
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      state.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity,
        spec,
      })
    }
    saveCart(state.items)
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  },

  updateQuantity(productId, spec, quantity) {
    const item = state.items.find(
      i => i.productId === productId && i.spec === spec
    )
    if (item) {
      item.quantity = Math.max(1, quantity)
      saveCart(state.items)
    }
  },

  removeItem(productId, spec) {
    const idx = state.items.findIndex(
      i => i.productId === productId && i.spec === spec
    )
    if (idx > -1) {
      state.items.splice(idx, 1)
      saveCart(state.items)
    }
  },

  clearCart() {
    state.items = []
    saveCart(state.items)
  },
})
