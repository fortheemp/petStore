# 结算页/订单页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发结算页和订单功能

---

## 📋 任务目标

开发 PetStore 宠物商店的**结算页和订单管理**，包括订单确认、下单、订单列表、订单详情、订单状态流转。

---

## 🎯 当前项目状态

### 已完成
- ✅ 首页、商品列表、商品详情、购物车页
- ✅ 登录/注册页、路由守卫、Pinia User Store
- ✅ Pinia Cart Store（含 localStorage 持久化）
- ✅ Header 登录状态切换

### 待开发
- ❌ 结算页 `/checkout`
- ❌ 订单列表页 `/user/orders`
- ❌ 订单详情页 `/user/orders/:id`

---

## 🎨 设计规范

**重要**：请先阅读 `txt/02-设计规范/DESIGN-SYSTEM.md`

### 核心色彩
```css
品牌蓝：#1c49c2（链接、选中）
品牌橙：#ff6c10（主CTA）
价格红：#bd2848（价格、金额）
成功绿：#00a651（完成状态）
警告橙：#ff6c10（待处理）
危险红：#e74c3c（取消、删除）
背景：#f8f9fa
卡片：#ffffff
```

### 订单状态色
```
待付款(0)：#ff6c10 橙色
已付款(1)：#1c49c2 蓝色
已发货(2)：#1c49c2 蓝色
已收货(3)：#00a651 绿色
已完成(4)：#00a651 绿色
已取消(-1)：#999 灰色
退款中(-2)：#ff6c10 橙色
退款成功(-3)：#00a651 绿色
管理员退款(-4)：#00a651 绿色
```

---

## 📐 页面结构设计

### 1. 结算页 /checkout

```
┌─────────────────────────────────────────────────────────┐
│  确认订单                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  收货地址                                          │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [☑] 张三  138****8888                      │  │  │
│  │  │      广东省广州市天河区xxx路xxx号            │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  [+ 添加新地址]                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  商品清单                                          │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  [图片] 皇家小型犬成犬粮   中犬3kg   x1  ¥159│  │  │
│  │  │  [图片] 猫咪智能饮水机     白色     x1  ¥199│  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  买家留言                                          │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  请输入留言信息（选填）                       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  支付方式                                          │  │
│  │  [☑] 微信支付  [☐] 支付宝                         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单摘要                                          │  │
│  │  商品总价：           ¥358.00                      │  │
│  │  运费：               ¥0.00（免运费）              │  │
│  │  ─────────────────────────────────               │  │
│  │  实付金额：           ¥358.00                      │  │
│  │                                                   │  │
│  │            [ 提交订单 ]                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. 订单列表页 /user/orders

```
┌─────────────────────────────────────────────────────────┐
│  我的订单                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [全部] [待付款(2)] [待发货(1)] [待收货(3)] [已完成]     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单号：20240115001    2024-01-15    待付款       │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  [图片] 皇家小型犬成犬粮   x1   ¥159.00           │  │
│  │                                                   │  │
│  │                共1件  实付：¥159.00               │  │
│  │                                                   │  │
│  │            [取消订单] [去付款]                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单号：20240114002    2024-01-14    已发货       │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  [图片] 猫咪智能饮水机     x1   ¥199.00           │  │
│  │                                                   │  │
│  │                共1件  实付：¥199.00               │  │
│  │                                                   │  │
│  │               [确认收货] [查看详情]                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3. 订单详情页 /user/orders/:id

```
┌─────────────────────────────────────────────────────────┐
│  订单详情                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单状态                                          │  │
│  │  ● 已付款 ● 已发货 ● 待收货 ○ 已完成              │  │
│  │                                                   │  │
│  │  预计 2024-01-20 送达                              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  收货信息                                          │  │
│  │  收货人：张三  138****8888                         │  │
│  │  地址：广东省广州市天河区xxx路xxx号                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  商品信息                                          │  │
│  │  [图片] 皇家小型犬成犬粮   中犬3kg   x1   ¥159.00 │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  商品总价：¥159.00                                │  │
│  │  运费：    ¥0.00                                  │  │
│  │  实付：    ¥159.00                                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单信息                                          │  │
│  │  订单编号：20240115001                             │  │
│  │  创建时间：2024-01-15 10:30:00                    │  │
│  │  支付时间：2024-01-15 10:35:00                    │  │
│  │  支付方式：微信支付                                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分

### 结算页
- **Checkout.vue** (`src/views/order/Checkout.vue`)
  - OrderAddress.vue - 地址选择
  - OrderItemList.vue - 商品清单
  - OrderRemark.vue - 买家留言
  - PaymentMethod.vue - 支付方式
  - OrderSummary.vue - 订单摘要

### 订单页
- **OrderList.vue** (`src/views/order/OrderList.vue`)
  - OrderCard.vue - 订单卡片
- **OrderDetail.vue** (`src/views/order/OrderDetail.vue`)

---

## 📝 功能需求清单

### 结算页 P0
- [ ] 路由 `/checkout`（需登录）
- [ ] 收货地址展示（Mock数据）
- [ ] 商品清单展示
- [ ] 买家留言输入
- [ ] 支付方式选择（微信/支付宝 Mock）
- [ ] 订单摘要计算
- [ ] 提交订单（Mock，跳转订单列表）

### 订单列表 P0
- [ ] 路由 `/user/orders`
- [ ] 订单状态 Tab 筛选（全部/待付款/待发货/待收货/已完成）
- [ ] 订单卡片展示（订单号、时间、状态、商品、金额）
- [ ] 订单操作按钮（根据状态显示：取消订单/去付款/确认收货/查看详情）
- [ ] 订单列表空状态

### 订单详情 P0
- [ ] 路由 `/user/orders/:id`
- [ ] 订单状态进度条
- [ ] 收货信息展示
- [ ] 商品信息展示
- [ ] 订单信息展示

### 订单状态流转（Mock）P0
- [ ] 提交订单 → 待付款(0)
- [ ] 点击去付款 → 已付款(1)
- [ ] 管理员发货（Mock）→ 已发货(2)
- [ ] 确认收货 → 已收货(3)
- [ ] 取消订单 → 已取消(-1)

### 状态管理 P0
- [ ] Pinia Order Store
- [ ] localStorage 持久化

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/checkout',
  name: 'Checkout',
  component: () => import('@/views/order/Checkout.vue'),
  meta: { title: '确认订单', requireAuth: true }
},
{
  path: '/user/orders',
  name: 'OrderList',
  component: () => import('@/views/order/OrderList.vue'),
  meta: { title: '我的订单', requireAuth: true }
},
{
  path: '/user/orders/:id',
  name: 'OrderDetail',
  component: () => import('@/views/order/OrderDetail.vue'),
  meta: { title: '订单详情', requireAuth: true },
  props: true
}
```

### 2. Pinia Order Store
```typescript
// src/stores/order.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface OrderItem {
  productId: number
  name: string
  image: string
  price: number
  quantity: number
  spec: string
}

export interface Address {
  id: number
  name: string
  phone: string
  address: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNo: string
  status: number
  statusText: string
  items: OrderItem[]
  address: Address
  totalAmount: number
  shippingFee: number
  payAmount: number
  payMethod: string
  remark: string
  createTime: string
  payTime?: string
  shipTime?: string
  receiveTime?: string
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])

  const init = () => {
    const saved = localStorage.getItem('orders')
    if (saved) {
      orders.value = JSON.parse(saved)
    }
  }

  const createOrder = (data: {
    items: OrderItem[]
    address: Address
    remark: string
    payMethod: string
    totalAmount: number
    shippingFee: number
  }) => {
    const order: Order = {
      id: 'ORD' + Date.now(),
      orderNo: 'PET' + Date.now(),
      status: 0,
      statusText: '待付款',
      items: data.items,
      address: data.address,
      totalAmount: data.totalAmount,
      shippingFee: data.shippingFee,
      payAmount: data.totalAmount + data.shippingFee,
      payMethod: data.payMethod,
      remark: data.remark,
      createTime: new Date().toISOString()
    }
    orders.value.unshift(order)
    saveToStorage()
    return order
  }

  const payOrder = (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 1
      order.statusText = '已付款'
      order.payTime = new Date().toISOString()
      saveToStorage()
    }
  }

  const cancelOrder = (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = -1
      order.statusText = '已取消'
      saveToStorage()
    }
  }

  const confirmReceive = (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 3
      order.statusText = '已收货'
      order.receiveTime = new Date().toISOString()
      saveToStorage()
    }
  }

  const getOrdersByStatus = (status: number | null) => {
    if (status === null) return orders.value
    return orders.value.filter(o => o.status === status)
  }

  const getOrderById = (orderId: string) => {
    return orders.value.find(o => o.id === orderId)
  }

  const saveToStorage = () => {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  return {
    orders,
    init,
    createOrder,
    payOrder,
    cancelOrder,
    confirmReceive,
    getOrdersByStatus,
    getOrderById
  }
})
```

### 3. 结算页逻辑
```typescript
// src/views/order/Checkout.vue

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

// 从购物车获取已勾选商品
const selectedItems = computed(() => cartStore.checkedItems)

const totalAmount = computed(() => cartStore.subtotal)
const shippingFee = computed(() => cartStore.shipping)
const payAmount = computed(() => totalAmount.value + shippingFee.value)

const submitOrder = async () => {
  const order = orderStore.createOrder({
    items: selectedItems.value.map(item => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      spec: item.spec.value
    })),
    address: selectedAddress.value,
    remark: remark.value,
    payMethod: payMethod.value,
    totalAmount: totalAmount.value,
    shippingFee: shippingFee.value
  })

  // 清除购物车已选商品
  selectedItems.value.forEach(item => {
    cartStore.removeItem(item.id)
  })

  ElMessage.success('订单创建成功')
  router.push('/user/orders')
}
```

### 4. 订单列表逻辑
```typescript
// src/views/order/OrderList.vue

import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

const activeStatus = ref<number | null>(null)

const statusTabs = [
  { label: '全部', value: null },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 }
]

const filteredOrders = computed(() => {
  return orderStore.getOrdersByStatus(activeStatus.value)
})

const handlePay = (orderId: string) => {
  orderStore.payOrder(orderId)
  ElMessage.success('支付成功（Mock）')
}

const handleCancel = (orderId: string) => {
  ElMessageBox.confirm('确定取消订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    orderStore.cancelOrder(orderId)
    ElMessage.success('订单已取消')
  })
}

const handleConfirm = (orderId: string) => {
  ElMessageBox.confirm('确认已收到商品？', '确认收货', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    orderStore.confirmReceive(orderId)
    ElMessage.success('已确认收货')
  })
}
```

---

## 🎨 样式示例

### 结算页整体
```scss
.checkout-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0 64px;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #121212;
    margin-bottom: 32px;
  }

  &__section {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    padding: 24px;
    margin-bottom: 24px;
  }

  &__section-title {
    font-size: 18px;
    font-weight: 600;
    color: #121212;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
}
```

### 订单卡片
```scss
.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #f0f0f0;
  }

  &__order-no {
    font-size: 14px;
    color: #666;
  }

  &__status {
    font-size: 14px;
    font-weight: 600;

    &.pending { color: #ff6c10; }
    &.paid { color: #1c49c2; }
    &.shipped { color: #1c49c2; }
    &.received { color: #00a651; }
    &.completed { color: #00a651; }
    &.cancelled { color: #999; }
  }

  &__body {
    padding: 24px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }

  &__total {
    margin-top: 16px;
    text-align: right;
    font-size: 14px;
    color: #666;

    .amount {
      font-size: 20px;
      font-weight: 700;
      color: #bd2848;
      margin-left: 8px;
    }
  }
}
```

### 订单状态进度条
```scss
.order-status-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 10%;
    right: 10%;
    height: 3px;
    background: #eee;
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;

    &.active {
      .order-status-bar__icon {
        background: #1c49c2;
        color: #fff;
      }
      .order-status-bar__text {
        color: #1c49c2;
        font-weight: 600;
      }
    }

    &.completed {
      .order-status-bar__icon {
        background: #00a651;
        color: #fff;
      }
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eee;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  &__text {
    font-size: 13px;
    color: #999;
  }
}
```

---

## 📂 参考文件
1. `txt/02-设计规范/DESIGN-SYSTEM.md`
2. `src/stores/cart.ts` - 购物车 Store
3. `src/stores/user.ts` - 用户 Store

---

## ✅ 验收标准

### 结算页
- [ ] 路由 `/checkout` 正常访问
- [ ] 收货地址展示正常
- [ ] 商品清单正确
- [ ] 实付金额计算正确
- [ ] 提交订单跳转订单列表

### 订单列表
- [ ] 路由 `/user/orders` 正常访问
- [ ] 订单状态 Tab 筛选正常
- [ ] 订单卡片信息完整
- [ ] 操作按钮显示正确
- [ ] 空订单状态正常

### 订单详情
- [ ] 路由 `/user/orders/:id` 正常
- [ ] 状态进度条正常
- [ ] 收货信息正常

### 状态流转
- [ ] 待付款 → 已付款
- [ ] 已付款 → 已收货
- [ ] 取消订单
- [ ] 状态更新后页面同步

---

## 💬 启动指令示例

```
开发 PetStore 的结算页和订单功能。

当前状态：
- 购物车已完成，商品可以勾选
- 需要从购物车跳转结算页下单
- 需要订单列表和详情页

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md
2. 创建 Pinia Order Store
3. 配置路由 /checkout、/user/orders、/user/orders/:id
4. 实现结算页（地址、商品清单、支付方式、提交订单）
5. 实现订单列表页（Tab筛选、订单卡片、操作按钮）
6. 实现订单详情页
7. 对接购物车（结算后清除已购商品）

设计风格参考 Chewy.com，留白充足，不要emoji。
```

---

**祝开发顺利！**
