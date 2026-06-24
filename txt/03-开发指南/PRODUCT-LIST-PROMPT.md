# 商品列表页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发商品列表页

---

## 📋 任务目标

开发 PetStore 宠物商店的**商品列表页**，让用户可以从首页点击分类或「立即选购」按钮后，看到商品展示页面。

---

## 🎯 当前项目状态

### 已完成
- ✅ Vue 3 + Vite 项目框架
- ✅ Element Plus UI 库
- ✅ Vue Router 路由配置（目前只有首页 `/`）
- ✅ 首页 Hero 区块、分类入口卡片、特色服务展示
- ✅ Header / Footer 布局组件
- ✅ 设计系统 CSS 变量（Chewy 风格）

### 待开发
- ❌ 商品列表页 - 首页点击「立即选购」或分类卡片跳转目标
- ❌ 路由配置 - 需要添加 `/products` 路由

---

## 🎨 设计规范（Chewy 风格）

**重要**：请先阅读以下设计文档：

1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 完整设计规范
2. `txt/02-设计规范/DESIGN-CHEATSHEET.md` - 快速参考卡片

### 核心设计要点

#### 色彩
```css
品牌蓝：#1c49c2（导航、链接）
品牌橙：#ff6c10（CTA按钮）
价格红：#bd2848（价格显示）
成功绿：#00a651（快速配送标签）
背景：#f5f5f5（页面背景）
卡片：#ffffff（卡片背景）
文字：#121212（主文字）、#4d4d4d（次文字）
```

#### 商品卡片设计
```css
/* 参考 Chewy 商品卡片 */
- 圆角：8px
- 阴影：0 2px 8px rgba(0,0,0,0.08)
- Hover 阴影：0 4px 16px rgba(0,0,0,0.12)
- Hover 上浮：translateY(-2px)
- 图片比例：1:1（正方形）
- 价格字号：20px，字重700，颜色 #bd2848
- 标题字号：16px，字重600
```

#### 网格布局
```css
/* 响应式网格 */
- 手机（<576px）：2列
- 平板（576-992px）：3列
- 桌面（>992px）：4列
- 卡片间距：24px
```

---

## 📐 页面结构

### 1. 页面头部区域
```
┌─────────────────────────────────────────┐
│ 面包屑导航                               │
│ 首页 > 商品列表                           │
├─────────────────────────────────────────┤
│ 页面标题 + 商品数量                       │
│ "全部商品" (120件商品)                    │
├─────────────────────────────────────────┤
│ 筛选栏 + 排序选项                         │
│ [分类筛选] [价格筛选] [排序：综合/价格↑↓]  │
└─────────────────────────────────────────┘
```

### 2. 商品网格区域
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
│  │ 图片 │  │ 图片 │  │ 图片 │  │ 图片 ││
│  │      │  │      │  │      │  │      ││
│  ├──────┤  ├──────┤  ├──────┤  ├──────┤│
│  │ 标题 │  │ 标题 │  │ 标题 │  │ 标题 ││
│  │ ⭐4.5│  │ ⭐4.8│  │ ⭐4.2│  │ ⭐4.6││
│  │ ¥99  │  │ ¥159 │  │ ¥79  │  │ ¥199 ││
│  │[加购物车]│[加购物车]│[加购物车]│[加购物车]│
│  └──────┘  └──────┘  └──────┘  └──────┘│
│                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
│  │ ...  │  │ ...  │  │ ...  │  │ ...  ││
│  └──────┘  └──────┘  └──────┘  └──────┘│
│                                         │
└─────────────────────────────────────────┘
```

### 3. 分页区域
```
┌─────────────────────────────────────────┐
│           [< 1 2 3 4 5 ... 10 >]       │
└─────────────────────────────────────────┘
```

---

## 🧩 组件拆分建议

### 1. ProductList.vue (页面组件)
**位置**：`src/views/product/ProductList.vue`

**职责**：
- 页面整体布局
- 筛选、排序状态管理
- 调用商品列表 API
- 分页逻辑

### 2. ProductCard.vue (公共组件)
**位置**：`src/components/common/ProductCard.vue`

**职责**：
- 单个商品卡片展示
- 图片、标题、评分、价格
- 「加入购物车」按钮
- Hover 交互效果

**Props**：
```typescript
interface ProductCardProps {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number  // 原价（可选）
  rating: number          // 评分
  reviewCount: number     // 评价数
  shopName: string        // 店铺名称
  fastDelivery?: boolean  // 是否快速配送
}
```

### 3. ProductFilter.vue (可选)
**位置**：`src/components/business/ProductFilter.vue`

**职责**：
- 分类筛选
- 价格区间筛选
- 排序选项

---

## 📝 功能需求清单

### 必须实现（P0）
- [ ] 页面路由配置 `/products`
- [ ] 商品卡片网格展示（4列）
- [ ] 响应式布局（手机2列、平板3列、桌面4列）
- [ ] 分页功能
- [ ] 点击商品卡片跳转详情页 `/products/:id`
- [ ] 首页「立即选购」按钮跳转到 `/products`
- [ ] 首页分类卡片跳转到 `/products?category=dogs` 等

### 建议实现（P1）
- [ ] 分类筛选（狗狗、猫猫、水族等）
- [ ] 价格排序（从低到高、从高到低）
- [ ] 综合排序
- [ ] 加载状态（骨架屏或 Loading）
- [ ] 空状态提示

### 可选实现（P2）
- [ ] 价格区间筛选
- [ ] 商品搜索（如果有搜索框）
- [ ] 收藏功能（需要登录）
- [ ] 快速查看详情（弹窗预览）

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/index.ts 或 src/router/routes.ts

{
  path: '/products',
  name: 'ProductList',
  component: () => import('@/views/product/ProductList.vue'),
  meta: {
    title: '商品列表'
  }
}
```

### 2. 首页链接修改
```vue
<!-- 首页 Hero 区域的「立即选购」按钮 -->
<router-link to="/products" class="btn-hero">
  立即选购
</router-link>

<!-- 分类卡片 -->
<router-link 
  :to="{ path: '/products', query: { category: 'dogs' } }" 
  class="category-card"
>
  🐶 狗狗
</router-link>
```

### 3. API 接口（Mock 数据）
由于后端还未开发，先使用 Mock 数据：

```typescript
// src/api/product.ts

// Mock 数据
const mockProducts = [
  {
    id: 1,
    name: '皇家小型犬成犬粮',
    image: '/images/product-1.jpg',
    price: 159.00,
    originalPrice: 199.00,
    rating: 4.8,
    reviewCount: 2341,
    shopName: '皇家宠物旗舰店',
    fastDelivery: true,
    category: 'dogs'
  },
  // ... 更多商品
]

// 获取商品列表
export function getProducts(params?: {
  page?: number
  pageSize?: number
  category?: string
  sort?: string
}) {
  // 实际开发时替换为真实 API
  // return request.get('/api/products', { params })
  
  // Mock 实现
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: mockProducts,
        total: 120,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20
      })
    }, 500)
  })
}
```

### 4. 状态管理（可选）
如果需要全局状态，使用 Pinia：

```typescript
// src/stores/product.ts
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    filters: {
      category: '',
      sort: 'default'
    }
  }),
  
  actions: {
    async fetchProducts(params) {
      this.loading = true
      try {
        const data = await getProducts(params)
        this.products = data.list
      } finally {
        this.loading = false
      }
    }
  }
})
```

---

## 🎨 组件样式示例

### ProductCard.vue 样式参考
```scss
.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &__image {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    background-color: #f5f5f5;
  }

  &__info {
    padding: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #121212;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #4d4d4d;

    .stars {
      color: #ffc107;
    }
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;

    .current {
      font-size: 20px;
      font-weight: 700;
      color: #bd2848;
    }

    .original {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
    }
  }

  &__actions {
    .btn-add-cart {
      width: 100%;
      padding: 10px;
      background-color: #ff6c10;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #e55a00;
      }
    }
  }
}
```

### 商品网格样式
```scss
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 24px 0;

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
```

---

## 📂 参考文件

开发前请阅读：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 完整设计规范
2. `txt/02-设计规范/DESIGN-CHEATSHEET.md` - 快速参考
3. `txt/01-需求文档/design.txt` - 业务需求
4. `src/views/Home.vue` - 首页参考（了解现有风格）
5. `src/components/layout/Header.vue` - Header 参考

---

## ✅ 验收标准

### 功能验收
- [ ] 首页「立即选购」点击后跳转到商品列表页
- [ ] 首页分类卡片点击后跳转到对应分类的商品列表
- [ ] 商品卡片正确显示图片、标题、评分、价格
- [ ] 点击商品卡片跳转到商品详情页（`/products/:id`）
- [ ] 分页功能正常
- [ ] 响应式布局正常（手机、平板、桌面）

### 设计验收
- [ ] 符合 Chewy 设计风格
- [ ] 商品卡片有圆角、阴影
- [ ] Hover 有上浮效果
- [ ] 价格显示为红色（#bd2848）
- [ ] 按钮颜色为品牌橙（#ff6c10）
- [ ] 间距符合 8px 网格系统

### 代码验收
- [ ] 组件职责单一
- [ ] 使用 Composition API (`<script setup>`)
- [ ] 样式使用 scoped
- [ ] 响应式使用媒体查询
- [ ] 代码有适当注释

---

## 💬 启动指令示例

新会话开始时，可以这样说：

```
我们要开发 PetStore 的商品列表页。

当前状态：
- 首页已完成（Hero、分类入口、Header/Footer）
- 设计系统 CSS 变量已配置
- 需要创建商品列表页，让首页链接可以跳转

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md 了解设计规范
2. 创建商品列表页组件 src/views/product/ProductList.vue
3. 创建商品卡片组件 src/components/common/ProductCard.vue
4. 配置路由 /products
5. 修改首页链接指向商品列表页

设计风格参考 Chewy.com，使用 Mock 数据。
```

---

## 🎯 预期效果

完成后，用户可以：
1. ✅ 从首页点击「立即选购」看到商品列表
2. ✅ 从首页点击分类卡片（🐶狗狗、🐱猫猫）看到对应分类商品
3. ✅ 看到 Chewy 风格的商品卡片（图片、标题、评分、价格）
4. ✅ 点击商品卡片跳转到详情页（详情页下一步开发）
5. ✅ 使用分页浏览更多商品

---

**祝开发顺利！🐾**
