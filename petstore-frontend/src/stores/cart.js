import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCartList, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem, clearCart as apiClearCart } from '@/api/cart'
import { useUserStore } from './user'

const PRODUCT_CACHE_KEY = 'petstore_cart_products'

function loadProductCache() {
  try { return JSON.parse(localStorage.getItem(PRODUCT_CACHE_KEY) || '{}') } catch { return {} }
}

function saveProductCache(cache) {
  localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(cache))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const checkedItems = computed(() => items.value.filter((item) => item.checked))
  const checkedCount = computed(() => checkedItems.value.length)
  const subtotal = computed(() => checkedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const shipping = computed(() => (subtotal.value >= 199 ? 0 : 10))
  const total = computed(() => subtotal.value + shipping.value)
  const isAllChecked = computed(() => items.value.length > 0 && items.value.every((item) => item.checked))

  function getUserId() {
    const userStore = useUserStore()
    return userStore.userInfo?.id
  }

  async function loadCart() {
    const userId = getUserId()
    if (!userId) { items.value = []; return }
    try {
      const res = await getCartList(userId)
      const list = Array.isArray(res) ? res : []
      const cache = loadProductCache()
      items.value = list.map((item) => {
        const p = cache[item.productId] || {}
        return {
          id: item.id,
          backendId: item.id,
          productId: item.productId,
          name: p.name || `商品#${item.productId}`,
          image: p.image || '',
          price: Number(p.price) || 0,
          quantity: item.quantity,
          stock: p.stock || 99,
          checked: true,
        }
      })
    } catch { items.value = [] }
  }

  async function addToCart(product, quantity = 1, spec = null) {
    const userId = getUserId()
    if (!userId) return

    const cache = loadProductCache()
    cache[product.id] = { name: product.name, image: product.image, price: product.price, stock: product.stock || 50 }
    saveProductCache(cache)

    const existing = items.value.find((item) => item.productId === product.id)
    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, existing.stock)
      existing.quantity = newQty
      if (existing.backendId) {
        try { await apiUpdateCartItem(existing.backendId, { quantity: newQty }) } catch {}
      }
    } else {
      try {
        const res = await apiAddToCart({ userId, productId: product.id, quantity })
        const backendId = res?.id
        items.value.push({
          id: backendId || `local-${product.id}`,
          backendId,
          productId: product.id,
          name: product.name,
          image: product.image || '',
          price: product.price,
          quantity,
          stock: product.stock || 50,
          checked: true,
        })
      } catch {}
    }
  }

  async function updateQuantity(itemId, quantity) {
    const item = items.value.find((i) => i.id === itemId)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock))
      if (item.backendId) {
        try { await apiUpdateCartItem(item.backendId, { quantity: item.quantity }) } catch {}
      }
    }
  }

  function toggleChecked(itemId) {
    const item = items.value.find((i) => i.id === itemId)
    if (item) item.checked = !item.checked
  }

  function toggleAllChecked() {
    const newState = !isAllChecked.value
    items.value.forEach((item) => { item.checked = newState })
  }

  async function removeItem(itemId) {
    const item = items.value.find((i) => i.id === itemId)
    if (item?.backendId) {
      try { await apiRemoveCartItem(item.backendId) } catch {}
    }
    items.value = items.value.filter((i) => i.id !== itemId)
  }

  async function clearAllCart() {
    const userId = getUserId()
    if (userId) {
      try { await apiClearCart(userId) } catch {}
    }
    items.value = []
  }

  async function init() {
    await loadCart()
  }

  init()

  return {
    items, totalItems, checkedItems, checkedCount, subtotal, shipping, total, isAllChecked,
    addToCart, updateQuantity, toggleChecked, toggleAllChecked, removeItem, clearCart: clearAllCart, loadCart,
  }
})
