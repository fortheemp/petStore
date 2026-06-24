# 购物车页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发购物车页

---

## 📋 任务目标

开发 PetStore 宠物商店的**购物车页**，让用户可以查看已添加的商品、修改数量、删除商品，并进入结算流程。

---

## 🎯 当前项目状态

### 已完成
- ✅ 首页（Hero、分类入口、Header/Footer）
- ✅ 商品列表页（商品卡片网格、筛选排序）
- ✅ 商品详情页（图片画廊、规格选择、加入购物车）
- ✅ 路由配置（`/products`、`/products/:id`）
- ✅ 设计系统 CSS 变量（Chewy 风格）
- ✅ Pinia 购物车 store（基础）

### 待开发
- ❌ 购物车页 `/cart`
- ❌ Header 购物车图标点击跳转
- ❌ 购物车商品数量 Badge 显示

---

## 🎨 设计规范

**重要**：请先阅读以下文档：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 完整设计规范
2. `txt/02-设计规范/DESIGN-CHEATSHEET.md` - 快速参考

### 核心设计要点

#### 色彩（Chewy 风格）
```css
品牌蓝：#1c49c2（链接、选中状态）
品牌橙：#ff6c10（CTA按钮：去结算）
价格红：#bd2848（价格显示）
成功绿：#00a651（快速配送标签）
危险红：#e74c3c（删除按钮、库存不足）
背景：#f8f9fa（页面背景）
卡片：#ffffff（商品卡片、结算卡片）
文字：#121212（主文字）、#4d4d4d（次文字）、#999999（辅助）
```

#### 圆角和阴影
```css
大卡片：12px
小卡片：8px
按钮：8px
输入框：6px

卡片阴影：0 2px 12px rgba(0,0,0,0.06)
卡片hover：0 8px 24px rgba(0,0,0,0.12)
```

---

## 📐 页面结构设计

### 整体布局

#### 状态1：购物车有商品
```
┌─────────────────────────────────────────────────────────┐
│  我的购物车                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  全选  商品信息              单价    数量   小计   操作│  │
│  ├───────────────────────────────────────────────────┤  │
│  │                                                   │  │
│  │  [☑] [图片] 皇家小型犬成犬粮    ¥159  [-]1[+]  ¥159 删除 │  │
│  │      规格：中犬3kg                                    │  │
│  │                                                   │  │
│  │  [☐] [图片] 宠物蝴蝶结项圈      ¥39   [-]2[+]  ¥78  删除 │  │
│  │      规格：粉色                                      │  │
│  │                                                   │  │
│  │  [☑] [图片] 猫咪智能饮水机      ¥199  [-]1[+]  ¥199 删除 │  │
│  │      规格：白色                                      │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                        已选 2 件   │  │
│  │  商品总价：¥358                                     │  │
│  │  运费：¥0（满199免运费）                              │  │
│  │  ─────────────────────────                        │  │
│  │  合计：¥358                                        │  │
│  │                                        [去结算 >]  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  你可能还喜欢                                            │
│  [商品卡片] [商品卡片] [商品卡片] [商品卡片]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 状态2：购物车为空
```
┌─────────────────────────────────────────────────────────┐
│  我的购物车                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                      ┌─────────┐                        │
│                      │  🛒     │                        │
│                      │ (空购物车图标)                    │
│                      └─────────┘                        │
│                                                         │
│                   购物车空空如也~                         │
│          快去挑选心仪的商品吧！                           │
│                                                         │
│                   [ 去逛逛 > ]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分建议

### 页面组件
**Cart.vue** - 页面主组件
**位置**：`src/views/cart/Cart.vue`

**职责**：
- 页面整体布局
- 购物车商品列表
- 结算卡片
- 空购物车状态
- 相关推荐

### 子组件

#### 1. CartItem.vue
**位置**：`src/components/cart/CartItem.vue`

**职责**：
- 单个购物车商品展示
- 勾选框
- 商品图片、标题、规格
- 单价显示
- 数量选择器（+/-）
- 小计金额
- 删除按钮

**Props**：
```typescript
interface CartItemProps {
  id: number
  productId: number
  name: string
  image: string
  price: number
  spec: {
    id: number
    name: string
    value: string
  }
  quantity: number
  stock: number
  checked: boolean
}

// Emits
interface CartItemEmits {
  (e: 'update:checked', value: boolean): void
  (e: 'update:quantity', quantity: number): void
  (e: 'delete'): void
}
```

#### 2. CartSummary.vue
**位置**：`src/components/cart/CartSummary.vue`

**职责**：
- 勾选商品数量
- 商品总价计算
- 运费计算
- 合计金额
- 去结算按钮

**Props**：
```typescript
interface CartSummaryProps {
  selectedCount: number
  totalCount: number
  subtotal: number
  shipping: number
  total: number
  disabled: boolean  // 没有勾选商品时禁用
}
```

#### 3. EmptyCart.vue
**位置**：`src/components/cart/EmptyCart.vue`

**职责**：
- 空购物车图标
- 提示文字
- 「去逛逛」按钮

#### 4. CartRecommend.vue（可选）
**位置**：`src/components/cart/CartRecommend.vue`

**职责**：
- 你可能还喜欢
- 复用 ProductCard 组件

---

## 📝 功能需求清单

### 必须实现（P0）
- [ ] 路由配置 `/cart`
- [ ] Header 购物车图标点击跳转
- [ ] 购物车商品列表展示
- [ ] 单个商品勾选/取消勾选
- [ ] 全选/取消全选
- [ ] 修改商品数量（+/- 按钮）
- [ ] 删除商品（单个删除）
- [ ] 删除确认提示（二次确认）
- [ ] 小计金额计算（单价 × 数量）
- [ ] 总价计算（所有勾选商品小计之和）
- [ ] 运费计算（满199免运费，否则10元）
- [ ] 合计显示（总价 + 运费）
- [ ] 去结算按钮（跳转到结算页或提示）
- [ ] 空购物车状态展示
- [ ] 数量限制（不超过库存）

### 建议实现（P1）
- [ ] 购物车商品数量 Badge（Header图标右上角数字）
- [ ] 批量删除已选商品
- [ ] 降价提醒（如果商品降价了）
- [ ] 库存不足提示
- [ ] 规格修改（点击规格可换）
- [ ] 相关商品推荐

### 可选实现（P2）
- [ ] 加入购物车成功动画
- [ ] 商品失效提示（商品下架或库存为0）
- [ ] 收藏功能
- [ ] 对比功能

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/cart',
  name: 'Cart',
  component: () => import('@/views/cart/Cart.vue'),
  meta: {
    title: '购物车',
    requireAuth: false  // 游客也可以看购物车（但结算需要登录）
  }
}
```

### 2. Header 购物车链接修改
```vue
<!-- src/components/layout/Header.vue -->

<router-link to="/cart" class="header-action">
  <el-badge :value="cartStore.totalItems" :hidden="cartStore.totalItems === 0">
    <el-icon :size="24"><ShoppingCart /></el-icon>
  </el-badge>
  <span class="header-action__text">购物车</span>
</router-link>
```

### 3. Pinia 购物车 Store 完整实现
```typescript
// src/stores/cart.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string  // 购物车项ID（商品ID + 规格ID）
  productId: number
  name: string
  image: string
  price: number
  originalPrice?: number
  spec: {
    id: number
    name: string
    value: string
  }
  quantity: number
  stock: number
  checked: boolean
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  
  // 初始化时从 localStorage 读取
  const init = () => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }
  
  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  const checkedItems = computed(() => {
    return items.value.filter(item => item.checked)
  })
  
  const checkedCount = computed(() => {
    return checkedItems.value.length
  })
  
  const subtotal = computed(() => {
    return checkedItems.value.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
  })
  
  const shipping = computed(() => {
    // 满199免运费
    return subtotal.value >= 199 ? 0 : 10
  })
  
  const total = computed(() => {
    return subtotal.value + shipping.value
  })
  
  const isAllChecked = computed(() => {
    return items.value.length > 0 && items.value.every(item => item.checked)
  })
  
  // Actions
  const addToCart = (product: any, quantity: number, spec: any) => {
    const itemId = `${product.id}-${spec.id}`
    const existingIndex = items.value.findIndex(item => item.id === itemId)
    
    if (existingIndex >= 0) {
      // 更新数量
      const newQuantity = items.value[existingIndex].quantity + quantity
      items.value[existingIndex].quantity = Math.min(newQuantity, items.value[existingIndex].stock)
    } else {
      // 新增
      items.value.push({
        id: itemId,
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        originalPrice: product.originalPrice,
        spec: {
          id: spec.id,
          name: '规格',
          value: spec.name
        },
        quantity: quantity,
        stock: product.stock,
        checked: true
      })
    }
    
    saveToStorage()
  }
  
  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock))
      saveToStorage()
    }
  }
  
  const toggleChecked = (itemId: string) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.checked = !item.checked
      saveToStorage()
    }
  }
  
  const toggleAllChecked = () => {
    const newState = !isAllChecked.value
    items.value.forEach(item => {
      item.checked = newState
    })
    saveToStorage()
  }
  
  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index >= 0) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  const clearCart = () => {
    items.value = []
    saveToStorage()
  }
  
  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  return {
    items,
    totalItems,
    checkedItems,
    checkedCount,
    subtotal,
    shipping,
    total,
    isAllChecked,
    init,
    addToCart,
    updateQuantity,
    toggleChecked,
    toggleAllChecked,
    removeItem,
    clearCart
  }
})
```

### 4. 商品详情页加入购物车逻辑
```typescript
// src/views/product/ProductDetail.vue

import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()

const handleAddToCart = () => {
  // 验证规格选择
  if (selectedSpec.value === null) {
    ElMessage.warning('请选择规格')
    return
  }
  
  // 验证库存
  if (quantity.value > maxStock.value) {
    ElMessage.warning(`库存不足，最多可购买 ${maxStock.value} 件`)
    return
  }
  
  // 添加到购物车
  cartStore.addToCart(product.value, quantity.value, selectedSpec.value)
  
  ElMessage.success('已加入购物车')
}

const handleBuyNow = () => {
  handleAddToCart()
  // 跳转到结算页（后续开发）
  // router.push('/checkout')
  ElMessage.info('结算功能开发中...')
}
```

### 5. 运费计算逻辑
```typescript
// 购物车结算卡片
const shippingFee = computed(() => {
  if (cartStore.subtotal >= 199) {
    return 0
  }
  return 10
})

const shippingText = computed(() => {
  if (shippingFee.value === 0) {
    return '免运费'
  }
  return `¥${shippingFee.value}`
})

const freeShippingTip = computed(() => {
  if (shippingFee.value === 0) {
    return ''
  }
  const diff = 199 - cartStore.subtotal
  return `还差¥${diff.toFixed(2)}免运费`
})
```

---

## 🎨 样式示例

### 购物车页面整体样式
```scss
.cart-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0 64px;
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
    
    @media (max-width: 768px) {
      padding: 0 24px;
    }
  }
  
  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #121212;
    margin-bottom: 32px;
  }
  
  &__content {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__list {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }
  
  &__summary {
    position: sticky;
    top: 24px;
  }
}
```

### 购物车商品项样式
```scss
.cart-item {
  display: flex;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
  
  &:hover {
    background: #fafafa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  // 勾选框
  &__checkbox {
    margin-right: 16px;
    margin-top: 24px;
    
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #1c49c2;
      border-color: #1c49c2;
    }
  }
  
  // 商品图片
  &__image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 20px;
    background: #f8f9fa;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  // 商品信息
  &__info {
    flex: 1;
    min-width: 0;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #121212;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    
    &:hover {
      color: #1c49c2;
      cursor: pointer;
    }
  }
  
  &__spec {
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
  }
  
  &__stock {
    font-size: 12px;
    color: #999;
    
    &.low {
      color: #e74c3c;
    }
  }
  
  // 单价
  &__price {
    width: 120px;
    text-align: center;
    
    .price-current {
      font-size: 16px;
      font-weight: 600;
      color: #121212;
    }
    
    .price-original {
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
      margin-top: 4px;
    }
  }
  
  // 数量选择器
  &__quantity {
    width: 140px;
    display: flex;
    justify-content: center;
    
    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      
      .btn {
        width: 32px;
        height: 32px;
        background: #f8f9fa;
        border: none;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
        
        &:hover:not(:disabled) {
          background: #e9ecef;
        }
        
        &:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
      }
      
      .input {
        width: 48px;
        height: 32px;
        border: none;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        text-align: center;
        font-size: 14px;
      }
    }
  }
  
  // 小计
  &__subtotal {
    width: 100px;
    text-align: right;
    
    .subtotal-price {
      font-size: 16px;
      font-weight: 700;
      color: #bd2848;
    }
  }
  
  // 删除按钮
  &__action {
    width: 80px;
    display: flex;
    justify-content: center;
    
    .btn-delete {
      color: #999;
      background: none;
      border: none;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #e74c3c;
      }
    }
  }
  
  // 响应式：移动端布局
  @media (max-width: 992px) {
    flex-wrap: wrap;
    
    &__checkbox {
      order: -1;
      margin-right: auto;
    }
    
    &__image {
      width: 100px;
      height: 100px;
    }
    
    &__price,
    &__quantity,
    &__subtotal,
    &__action {
      width: auto;
      margin-top: 12px;
    }
  }
}
```

### 结算卡片样式
```scss
.cart-summary {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    
    .selected-count {
      font-size: 14px;
      color: #666;
      
      strong {
        color: #1c49c2;
        font-size: 16px;
      }
    }
    
    .btn-select-all {
      color: #1c49c2;
      background: none;
      border: none;
      font-size: 14px;
      cursor: pointer;
    }
  }
  
  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    
    .label {
      color: #666;
    }
    
    .value {
      color: #121212;
      font-weight: 500;
    }
    
    &.shipping {
      .value.free {
        color: #00a651;
      }
      
      .tip {
        font-size: 12px;
        color: #ff6c10;
        margin-top: 4px;
      }
    }
  }
  
  &__divider {
    height: 1px;
    background: #f0f0f0;
    margin: 16px 0;
  }
  
  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
    
    .label {
      font-size: 16px;
      font-weight: 600;
    }
    
    .value {
      font-size: 28px;
      font-weight: 700;
      color: #bd2848;
      
      .symbol {
        font-size: 16px;
      }
    }
  }
  
  &__checkout {
    width: 100%;
    padding: 16px;
    background: #ff6c10;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      background: #e55a00;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }
  
  &__secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    font-size: 12px;
    color: #999;
    
    .icon {
      color: #00a651;
    }
  }
}
```

### 空购物车样式
```scss
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  
  &__icon {
    width: 120px;
    height: 120px;
    margin-bottom: 24px;
    
    .icon {
      font-size: 80px;
      color: #ddd;
    }
  }
  
  &__title {
    font-size: 20px;
    font-weight: 600;
    color: #666;
    margin-bottom: 12px;
  }
  
  &__tip {
    font-size: 14px;
    color: #999;
    margin-bottom: 32px;
  }
  
  &__btn {
    display: inline-block;
    padding: 14px 48px;
    background: #ff6c10;
    color: #fff;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
    
    &:hover {
      background: #e55a00;
    }
  }
}
```

---

## 📂 参考文件

开发前请阅读：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 设计规范
2. `src/stores/cart.ts` - 购物车 Store（如果没有则参考上面的完整实现）
3. `src/views/product/ProductDetail.vue` - 详情页（加入购物车逻辑）
4. `src/components/layout/Header.vue` - Header（购物车图标）

---

## ✅ 验收标准

### 功能验收
- [ ] Header 购物车图标点击跳转到 `/cart`
- [ ] 购物车图标显示商品数量 Badge
- [ ] 购物车商品列表正确展示（图片、标题、规格、单价、数量、小计）
- [ ] 单个商品勾选/取消勾选正常
- [ ] 全选/取消全选正常
- [ ] 数量 +/- 按钮正常（限制最小1、最大库存）
- [ ] 修改数量后小计和总价自动更新
- [ ] 删除商品有二次确认提示
- [ ] 总价计算正确（勾选商品小计之和）
- [ ] 运费计算正确（满199免运费，否则10元）
- [ ] 合计金额正确（总价 + 运费）
- [ ] 去结算按钮可点击
- [ ] 空购物车状态展示正常
- [ ] 刷新页面购物车数据不丢失（localStorage）

### 设计验收
- [ ] 符合 Chewy 设计风格
- [ ] 留白充足，不拥挤
- [ ] 颜色使用正确（价格红、CTA橙）
- [ ] 无 emoji
- [ ] 响应式适配（桌面、平板、手机）
- [ ] 空购物车状态美观

### 代码验收
- [ ] 组件拆分合理
- [ ] 使用 Composition API
- [ ] Pinia Store 实现完整
- [ ] localStorage 持久化
- [ ] 数量限制逻辑正确
- [ ] 代码有适当注释

---

## 💬 启动指令示例

```
我们要开发 PetStore 的购物车页面。

当前状态：
- 商品详情页已完成，可以加入购物车
- 需要开发购物车页面，展示已添加商品

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md 了解设计规范
2. 检查 src/stores/cart.ts 是否有购物车 Store，如果没有请创建完整实现
3. 配置路由 /cart
4. 修改 Header 购物车图标跳转逻辑
5. 创建 Cart.vue 页面组件
6. 创建子组件：CartItem、CartSummary、EmptyCart
7. 实现完整的购物车功能

设计风格参考 Chewy.com，留白充足，不要emoji。
```

---

## 🎯 预期效果

完成后，用户可以：
1. ✅ 在 Header 点击购物车图标看到数量 Badge
2. ✅ 跳转到购物车页面查看所有已添加商品
3. ✅ 勾选/取消勾选商品
4. ✅ 全选/取消全选
5. ✅ 修改商品数量（自动更新小计和总价）
6. ✅ 删除商品（二次确认）
7. ✅ 看到正确的总价、运费、合计
8. ✅ 点击去结算（跳转到结算页或提示）
9. ✅ 空购物车状态有友好提示
10. ✅ 刷新页面购物车数据不丢失

---

**祝开发顺利！**
