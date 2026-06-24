import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 购物车 Store
 * 使用 localStorage 持久化，刷新不丢失
 */
export const useCartStore = defineStore('cart', () => {
  // ========== State ==========
  const items = ref([])

  // 初始化：从 localStorage 读取
  const init = () => {
    const saved = localStorage.getItem('petstore_cart')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch {
        items.value = []
      }
    }
  }

  // ========== Getters ==========

  /** 购物车商品总数量 */
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  /** 已勾选的商品 */
  const checkedItems = computed(() =>
    items.value.filter((item) => item.checked),
  )

  /** 已勾选商品数量 */
  const checkedCount = computed(() => checkedItems.value.length)

  /** 已勾选商品小计之和 */
  const subtotal = computed(() =>
    checkedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  /** 运费：满 199 免运费，否则 10 元 */
  const shipping = computed(() => (subtotal.value >= 199 ? 0 : 10))

  /** 合计金额 */
  const total = computed(() => subtotal.value + shipping.value)

  /** 是否全选 */
  const isAllChecked = computed(() =>
    items.value.length > 0 && items.value.every((item) => item.checked),
  )

  // ========== Actions ==========

  /** 添加商品到购物车 */
  const addToCart = (product, quantity, spec) => {
    const itemId = `${product.id}-${spec.id}`
    const existing = items.value.find((item) => item.id === itemId)

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, existing.stock)
    } else {
      items.value.push({
        id: itemId,
        productId: product.id,
        name: product.name,
        image: '',
        price: product.price,
        originalPrice: product.originalPrice,
        spec: {
          id: spec.id,
          name: '规格',
          value: spec.name,
        },
        quantity,
        stock: product.stock || 50,
        checked: true,
      })
    }
    save()
  }

  /** 更新商品数量 */
  const updateQuantity = (itemId, quantity) => {
    const item = items.value.find((i) => i.id === itemId)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock))
      save()
    }
  }

  /** 切换单个商品勾选状态 */
  const toggleChecked = (itemId) => {
    const item = items.value.find((i) => i.id === itemId)
    if (item) {
      item.checked = !item.checked
      save()
    }
  }

  /** 全选/取消全选 */
  const toggleAllChecked = () => {
    const newState = !isAllChecked.value
    items.value.forEach((item) => {
      item.checked = newState
    })
    save()
  }

  /** 删除单个商品 */
  const removeItem = (itemId) => {
    const index = items.value.findIndex((i) => i.id === itemId)
    if (index >= 0) {
      items.value.splice(index, 1)
      save()
    }
  }

  /** 清空购物车 */
  const clearCart = () => {
    items.value = []
    save()
  }

  /** 持久化到 localStorage */
  const save = () => {
    localStorage.setItem('petstore_cart', JSON.stringify(items.value))
  }

  // 初始化
  init()

  return {
    items,
    totalItems,
    checkedItems,
    checkedCount,
    subtotal,
    shipping,
    total,
    isAllChecked,
    addToCart,
    updateQuantity,
    toggleChecked,
    toggleAllChecked,
    removeItem,
    clearCart,
  }
})
