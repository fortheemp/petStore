# 管理员后台开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发管理员后台

---

## 📋 任务目标

开发 PetStore 宠物商店的**管理员后台**，包括商品管理、订单管理、用户管理、数据概览。

---

## 🎯 当前项目状态

### 已完成
- ✅ 所有用户端页面（首页、商品列表、详情、购物车、结算、订单、个人中心）
- ✅ 用户认证体系（登录/注册/路由守卫）

### 待开发
- ❌ 管理后台入口 `/admin`
- ❌ 数据概览仪表盘
- ❌ 商品管理（CRUD）
- ❌ 订单管理（发货、退款）
- ❌ 用户管理

---

## 🎨 设计规范

**重要**：请先阅读 `txt/02-设计规范/DESIGN-SYSTEM.md`

### 后台专用色彩
```css
品牌蓝：#1c49c2（主色、选中、按钮）
成功绿：#00a651（在线、成功状态）
警告橙：#ff6c10（待处理）
危险红：#e74c3c（删除、异常）
背景：#f5f7fa（后台背景）
侧边栏：#001529（深色）
卡片：#ffffff
文字：#333333（主文字）、#666666（次文字）、#999999（辅助）
```

---

## 📐 页面结构设计

### 1. 后台整体布局

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  PetStore 管理后台         [管理员头像] [退出]   │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  数据概览  │  右侧内容区                                │
│  商品管理  │  （根据左侧菜单切换）                       │
│  订单管理  │                                            │
│  用户管理  │                                            │
│            │                                            │
├────────────┴────────────────────────────────────────────┤
```

### 2. 数据概览 /admin/dashboard

```
┌─────────────────────────────────────────────────────────┐
│  数据概览                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 今日订单  │ │ 今日销售额│ │ 总用户数  │ │ 商品总数  │   │
│  │   12     │ │  ¥3,580  │ │   256    │ │   89     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  ┌─────────────────────────────┐ ┌───────────────────┐ │
│  │  待处理订单                 │ │  近7天销售额      │ │
│  │                            │ │                   │ │
│  │  待付款    3单              │ │  [折线图]         │ │
│  │  待发货    2单              │ │                   │ │
│  │  退款中    1单              │ │                   │ │
│  │                            │ │                   │ │
│  │  [去处理]                   │ │                   │ │
│  └─────────────────────────────┘ └───────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3. 商品管理 /admin/products

```
┌─────────────────────────────────────────────────────────┐
│  商品管理                                [+ 添加商品]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  搜索：[                    ] [搜索]                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  │ ID │ 商品名称      │ 价格  │ 库存 │ 状态 │ 操作 │  │
│  │  ├────┼──────────────┼──────┼─────┼─────┼──────┤  │
│  │  │ 1  │ 皇家小型犬粮  │ ¥159 │  50 │ 上架│ 编辑 │  │
│  │  │    │              │      │     │     │ 删除 │  │
│  │  ├────┼──────────────┼──────┼─────┼─────┼──────┤  │
│  │  │ 2  │ 猫咪饮水机    │ ¥199 │  30 │ 上架│ 编辑 │  │
│  │  │    │              │      │     │     │ 删除 │  │
│  │  ├────┼──────────────┼──────┼─────┼─────┼──────┤  │
│  │  │ 3  │ 宠物项圈      │ ¥39  │   0 │ 下架│ 编辑 │  │
│  │  │    │              │      │     │     │ 删除 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│                  共 89 件  [< 1 2 3 ... 9 >]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4. 订单管理 /admin/orders

```
┌─────────────────────────────────────────────────────────┐
│  订单管理                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [全部] [待付款(3)] [待发货(2)] [退款中(1)]              │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单号：PET20240115001                           │  │
│  │  用户：张三   下单时间：2024-01-15 10:30           │  │
│  │  商品：皇家小型犬粮 x1  ¥159.00                   │  │
│  │  实付：¥159.00                                    │  │
│  │                                [发货] [详情]       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  订单号：PET20240115002                           │  │
│  │  用户：李四   下单时间：2024-01-15 11:20           │  │
│  │  商品：猫咪饮水机 x1  ¥199.00                     │  │
│  │  实付：¥199.00                                    │  │
│  │                          [同意退款] [拒绝] [详情]  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5. 用户管理 /admin/users

```
┌─────────────────────────────────────────────────────────┐
│  用户管理                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  搜索：[                    ] [搜索]                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  │ ID │ 用户名   │ 手机号      │ 注册时间 │ 状态 │  │
│  │  ├────┼─────────┼────────────┼─────────┼──────┤  │
│  │  │ 1  │ admin   │ 138****8888│ 2024-01 │ 管理员│  │
│  │  ├────┼─────────┼────────────┼─────────┼──────┤  │
│  │  │ 2  │ 张三    │ 159****6666│ 2024-01 │ 正常 │  │
│  │  ├────┼─────────┼────────────┼─────────┼──────┤  │
│  │  │ 3  │ 李四    │ 137****5555│ 2024-01 │ 正常 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分

### 页面组件
- **AdminLayout.vue** (`src/views/admin/AdminLayout.vue`)
- **Dashboard.vue** (`src/views/admin/Dashboard.vue`)
- **ProductManage.vue** (`src/views/admin/ProductManage.vue`)
- **OrderManage.vue** (`src/views/admin/OrderManage.vue`)
- **UserManage.vue** (`src/views/admin/UserManage.vue`)

### 子组件
- AdminSidebar.vue - 侧边栏
- AdminHeader.vue - 顶部栏
- StatsCard.vue - 统计卡片
- OrderTable.vue - 订单表格
- ProductDialog.vue - 新增/编辑商品弹窗

---

## 📝 功能需求清单

### 后台布局 P0
- [ ] 顶部栏（Logo、管理员信息、退出）
- [ ] 深色侧边栏（菜单导航）
- [ ] 右侧内容区
- [ ] 路由 `/admin/dashboard`、`/admin/products`、`/admin/orders`、`/admin/users`

### 权限控制 P0
- [ ] 未登录不能访问后台
- [ ] 非管理员不能访问后台
- [ ] 后台入口（登录后Header显示"管理后台"）

### 数据概览 P0
- [ ] 统计卡片（今日订单、今日销售额、总用户数、商品总数）
- [ ] 待处理订单提示

### 商品管理 P0
- [ ] 商品列表（表格）
- [ ] 商品搜索
- [ ] 商品分页
- [ ] 添加商品（弹窗表单）
- [ ] 编辑商品（弹窗表单）
- [ ] 删除商品（二次确认）
- [ ] 商品状态切换（上架/下架）

### 订单管理 P0
- [ ] 订单列表（表格）
- [ ] 订单状态筛选（Tab）
- [ ] 订单详情
- [ ] 发货操作
- [ ] 退款处理（同意/拒绝）

### 用户管理 P0
- [ ] 用户列表（表格）
- [ ] 用户搜索
- [ ] 用户状态展示

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/admin',
  name: 'Admin',
  component: () => import('@/views/admin/AdminLayout.vue'),
  meta: { requireAuth: true, requireAdmin: true },
  redirect: '/admin/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { title: '数据概览' }
    },
    {
      path: 'products',
      name: 'ProductManage',
      component: () => import('@/views/admin/ProductManage.vue'),
      meta: { title: '商品管理' }
    },
    {
      path: 'orders',
      name: 'OrderManage',
      component: () => import('@/views/admin/OrderManage.vue'),
      meta: { title: '订单管理' }
    },
    {
      path: 'users',
      name: 'UserManage',
      component: () => import('@/views/admin/UserManage.vue'),
      meta: { title: '用户管理' }
    }
  ]
}
```

### 2. 路由守卫增加管理员权限
```typescript
// src/router/index.ts

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requireAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  }
  else if (to.meta.requireAdmin && !userStore.isAdmin) {
    ElMessage.error('无管理员权限')
    next('/')
  }
  else if (to.meta.guest && userStore.isLoggedIn) {
    next('/')
  }
  else {
    next()
  }
})
```

### 3. Pinia Admin Store
```typescript
// src/stores/admin.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mock 商品数据
const mockProducts = [
  { id: 1, name: '皇家小型犬成犬粮', price: 159, stock: 50, status: '上架', image: '/images/product-1.jpg' },
  { id: 2, name: '猫咪智能饮水机', price: 199, stock: 30, status: '上架', image: '/images/product-2.jpg' },
  { id: 3, name: '宠物蝴蝶结项圈', price: 39, stock: 0, status: '下架', image: '/images/product-3.jpg' }
]

// Mock 订单数据
const mockOrders = [
  {
    id: 'ORD001',
    orderNo: 'PET20240115001',
    userId: 2,
    username: '张三',
    status: 0,
    statusText: '待付款',
    totalAmount: 159,
    createTime: '2024-01-15 10:30',
    items: [{ name: '皇家小型犬粮', quantity: 1, price: 159 }]
  },
  {
    id: 'ORD002',
    orderNo: 'PET20240115002',
    userId: 3,
    username: '李四',
    status: 2,
    statusText: '退款中',
    totalAmount: 199,
    createTime: '2024-01-15 11:20',
    items: [{ name: '猫咪饮水机', quantity: 1, price: 199 }]
  }
]

export const useAdminStore = defineStore('admin', () => {
  const products = ref(mockProducts)
  const orders = ref(mockOrders)
  const users = ref([
    { id: 1, username: 'admin', phone: '13888888888', role: 'admin', createTime: '2024-01-01' },
    { id: 2, username: '张三', phone: '15966666666', role: 'user', createTime: '2024-01-10' },
    { id: 3, username: '李四', phone: '13755555555', role: 'user', createTime: '2024-01-12' }
  ])

  // 商品管理
  const addProduct = (product: any) => {
    const newId = Math.max(...products.value.map(p => p.id)) + 1
    products.value.push({ ...product, id: newId })
  }

  const updateProduct = (id: number, data: any) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index >= 0) {
      products.value[index] = { ...products.value[index], ...data }
    }
  }

  const deleteProduct = (id: number) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const toggleProductStatus = (id: number) => {
    const product = products.value.find(p => p.id === id)
    if (product) {
      product.status = product.status === '上架' ? '下架' : '上架'
    }
  }

  // 订单管理
  const shipOrder = (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 2
      order.statusText = '已发货'
    }
  }

  const approveRefund = (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = -3
      order.statusText = '退款成功'
    }
  }

  const rejectRefund = (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 2
      order.statusText = '已发货'
    }
  }

  return {
    products,
    orders,
    users,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    shipOrder,
    approveRefund,
    rejectRefund
  }
})
```

### 4. Dashboard 统计数据
```typescript
// src/views/admin/Dashboard.vue

import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const stats = computed(() => ({
  todayOrders: 12,
  todaySales: 3580,
  totalUsers: adminStore.users.length,
  totalProducts: adminStore.products.length
}))

const pendingOrders = computed(() => ({
  unpaid: adminStore.orders.filter(o => o.status === 0).length,
  unshipped: adminStore.orders.filter(o => o.status === 1).length,
  refunding: adminStore.orders.filter(o => o.status === 2).length
}))
```

---

## 🎨 样式示例

### 后台布局
```scss
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;

  // 侧边栏
  &__sidebar {
    width: 220px;
    background: #001529;
    color: #fff;
    flex-shrink: 0;
  }

  // 主内容区
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  // 顶部栏
  &__header {
    height: 64px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
  }

  // 内容区
  &__content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }
}
```

### 侧边栏
```scss
.admin-sidebar {
  &__logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__menu {
    padding: 16px 0;
  }

  &__menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    &.active {
      color: #fff;
      background: #1c49c2;
    }
  }
}
```

### 统计卡片
```scss
.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  &__title {
    font-size: 14px;
    color: #999;
    margin-bottom: 12px;
  }

  &__value {
    font-size: 32px;
    font-weight: 700;
    color: #121212;
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 16px;

    &.blue {
      background: #e6f0ff;
      color: #1c49c2;
    }

    &.orange {
      background: #fff5e6;
      color: #ff6c10;
    }

    &.green {
      background: #e6f9ee;
      color: #00a651;
    }

    &.purple {
      background: #f3e8ff;
      color: #8b5cf6;
    }
  }
}
```

### 表格
```scss
.admin-table {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  // 表格头部
  .el-table__header {
    th {
      background: #f8f9fa;
      color: #666;
      font-weight: 600;
    }
  }

  // 操作按钮
  .action-btn {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &.primary {
      background: #1c49c2;
      color: #fff;

      &:hover {
        background: #163da0;
      }
    }

    &.danger {
      background: #fff;
      color: #e74c3c;
      border: 1px solid #e74c3c;

      &:hover {
        background: #fff5f5;
      }
    }

    &.default {
      background: #fff;
      color: #666;
      border: 1px solid #ddd;

      &:hover {
        border-color: #1c49c2;
        color: #1c49c2;
      }
    }
  }
}
```

---

## 📂 参考文件
1. `txt/02-设计规范/DESIGN-SYSTEM.md`
2. `src/stores/user.ts` - 用户 Store（管理员判断）
3. `src/router/index.ts` - 路由守卫

---

## ✅ 验收标准

### 布局
- [ ] 后台整体布局正常（深色侧边栏）
- [ ] 菜单切换正常
- [ ] 路由 `/admin/*` 正常访问

### 权限控制
- [ ] 未登录不能访问后台
- [ ] 非管理员不能访问后台
- [ ] 登录后 Header 显示"管理后台"入口

### 数据概览
- [ ] 统计卡片正常
- [ ] 待处理订单数量正确

### 商品管理
- [ ] 商品列表正常
- [ ] 添加/编辑商品弹窗正常
- [ ] 删除商品二次确认
- [ ] 状态切换正常
- [ ] 分页正常

### 订单管理
- [ ] 订单列表正常
- [ ] 状态筛选正常
- [ ] 发货操作正常
- [ ] 退款处理正常

### 用户管理
- [ ] 用户列表正常
- [ ] 搜索正常

---

## 💬 启动指令示例

```
开发 PetStore 的管理员后台。

当前状态：
- 用户端页面全部完成
- 需要管理员后台管理商品、订单、用户

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md
2. 创建 Pinia Admin Store（Mock数据）
3. 配置路由 /admin/*
4. 更新路由守卫（增加管理员权限判断）
5. 实现 AdminLayout.vue（顶部+侧边栏布局）
6. 实现 Dashboard.vue（数据概览）
7. 实现 ProductManage.vue（商品CRUD）
8. 实现 OrderManage.vue（订单管理）
9. 实现 UserManage.vue（用户列表）
10. 修改 Header（管理员可见"管理后台"入口）

设计风格保持 Chewy 后台简洁专业，不要emoji。
```

---

**祝开发顺利！**
