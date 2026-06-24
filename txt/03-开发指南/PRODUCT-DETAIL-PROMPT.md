# 商品详情页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发商品详情页

---

## 📋 任务目标

开发 PetStore 宠物商店的**商品详情页**，让用户从商品列表页点击商品卡片后，能看到完整的商品信息并进行规格选择、加入购物车等操作。

---

## 🎯 当前项目状态

### 已完成
- ✅ 首页（Hero、分类入口、Header/Footer）
- ✅ 商品列表页（商品卡片网格、筛选排序、分页）
- ✅ 路由配置（`/products`）
- ✅ 设计系统 CSS 变量（Chewy 风格）
- ✅ 商品卡片组件 `ProductCard.vue`
- ✅ 首页链接跳转功能

### 待开发
- ❌ 商品详情页 `/products/:id`
- ❌ 点击商品卡片跳转详情页（目前列表页卡片点击无响应或跳转未实现）

---

## 🎨 设计规范

**重要**：请先阅读以下文档：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 完整设计规范
2. `txt/02-设计规范/DESIGN-CHEATSHEET.md` - 快速参考

### 核心设计要点

#### 色彩（Chewy 风格）
```css
品牌蓝：#1c49c2（链接、选中状态）
品牌橙：#ff6c10（CTA按钮：加入购物车、立即购买）
价格红：#bd2848（现价）
成功绿：#00a651（快速配送标签）
背景：#f8f9fa（页面背景）
卡片：#ffffff（内容卡片）
文字：#121212（主文字）、#4d4d4d（次文字）、#999999（辅助）
```

#### 圆角和阴影
```css
大卡片：12px
小卡片：8px
按钮：8px
输入框：6px
标签：4px

卡片阴影：0 2px 12px rgba(0,0,0,0.06)
卡片hover：0 8px 24px rgba(0,0,0,0.12)
弹窗：0 12px 40px rgba(0,0,0,0.15)
```

---

## 📐 页面结构设计

### 整体布局
```
┌─────────────────────────────────────────────────────────┐
│  首页 / 狗狗用品 / 皇家小型犬成犬粮                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐   ┌─────────────────────────┐  │
│  │                     │   │ 皇家小型犬成犬粮         │  │
│  │   商品主图           │   │                         │  │
│  │   （可放大查看）      │   │ 评分 ⭐4.8  2341条评价   │  │
│  │                     │   │                         │  │
│  │                     │   │ ¥159  ¥199  -20%        │  │
│  └─────────────────────┘   │                         │  │
│                             │ 配送 🚚 次日达，满199包邮  │  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │                         │  │
│  │缩略│ │缩略│ │缩略│ │缩略│  │ 规格选择                │  │
│  │图1 │ │图2 │ │图3 │ │图4 │  │ [小犬1kg] [中犬3kg] [大犬10kg] │  │
│  └───┘ └───┘ └───┘ └───┘  │                         │  │
│                             │ 数量 [-] 1 [+]         │  │
│                             │ 库存：仅剩 3 件         │  │
│                             │                         │  │
│                             │ ┌─────────────────────┐ │  │
│                             │ │    加入购物车        │ │  │
│                             │ └─────────────────────┘ │  │
│                             │ ┌─────────────────────┐ │  │
│                             │ │    立即购买          │ │  │
│                             │ └─────────────────────┘ │  │
│                             └─────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [商品详情] [规格参数] [用户评价]  ← 标签页切换          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  商品详情内容：                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 皇家小型犬成犬粮，专为小型犬设计...                 │  │
│  │                                                   │  │
│  │ • 优质蛋白来源                                     │  │
│  │ • 科学配方                                         │  │
│  │ • 均衡营养                                         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  规格参数：                                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 品牌：皇家                                        │  │
│  │ 产地：法国                                        │  │
│  │ 适用犬种：小型犬                                   │  │
│  │ 保质期：18个月                                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  用户评价 (2341条)：                                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │ ⭐⭐⭐⭐⭐ 用户1  2024-01-15                        │  │
│  │ 家里狗狗很喜欢吃，毛色也变好了                      │  │
│  ├───────────────────────────────────────────────────┤  │
│  │ ⭐⭐⭐⭐⭐ 用户2  2024-01-10                        │  │
│  │ 皇家品质一直很稳定，回购很多次了                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  猜你喜欢                                                │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │商品卡片 │ │商品卡片 │ │商品卡片 │ │商品卡片 │           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分建议

### 页面组件
**ProductDetail.vue** - 页面主组件
**位置**：`src/views/product/ProductDetail.vue`

**职责**：
- 页面整体布局
- 面包屑导航
- 图片展示区域 + 信息区域
- 标签页切换（详情/参数/评价）
- 相关商品推荐

### 子组件

#### 1. ProductImageGallery.vue
**位置**：`src/components/product/ProductImageGallery.vue`

**职责**：
- 商品主图展示
- 缩略图列表
- 主图切换（点击缩略图）
- 图片放大查看（可选）

**Props**：
```typescript
interface Props {
  images: string[]  // 图片URL数组
  mainImage?: string  // 默认主图
}
```

#### 2. ProductInfo.vue
**位置**：`src/components/product/ProductInfo.vue`

**职责**：
- 商品标题
- 评分和评价数
- 价格（现价、原价、折扣）
- 配送信息
- 规格选择
- 数量选择
- 加入购物车/立即购买按钮

**Props**：
```typescript
interface Props {
  product: {
    id: number
    name: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount: number
    stock: number
    fastDelivery: boolean
    specs: ProductSpec[]
  }
}

interface ProductSpec {
  id: number
  name: string  // 规格名称
  options: SpecOption[]
}

interface SpecOption {
  id: number
  name: string  // 选项名称
  value: string
  available: boolean
  additionalPrice?: number  // 加价
}
```

#### 3. ProductTabs.vue
**位置**：`src/components/product/ProductTabs.vue`

**职责**：
- 标签页导航（详情/参数/评价）
- 内容切换

#### 4. ProductDetailInfo.vue
**位置**：`src/components/product/ProductDetailInfo.vue`

**职责**：
- 商品详情富文本
- 图文混排

#### 5. ProductReviews.vue
**位置**：`src/components/product/ProductReviews.vue`

**职责**：
- 评价列表
- 评分统计
- 分页

#### 6. RelatedProducts.vue
**位置**：`src/components/product/RelatedProducts.vue`

**职责**：
- 猜你喜欢/相关商品
- 复用 ProductCard 组件

---

## 📝 功能需求清单

### 必须实现（P0）
- [ ] 路由配置 `/products/:id`
- [ ] 商品卡片点击跳转详情页
- [ ] 商品图片展示（主图 + 缩略图切换）
- [ ] 商品信息展示（标题、评分、价格）
- [ ] 规格选择（选中状态、库存检查）
- [ ] 数量选择（+/- 按钮，限制最大库存）
- [ ] 「加入购物车」按钮（调用API或提示）
- [ ] 「立即购买」按钮
- [ ] 面包屑导航
- [ ] 商品详情内容展示

### 建议实现（P1）
- [ ] 图片放大查看
- [ ] 标签页切换动画
- [ ] 评价列表展示
- [ ] 评分统计（好评率）
- [ ] 相关商品推荐
- [ ] 配送信息展示
- [ ] 库存提示（仅剩X件）

### 可选实现（P2）
- [ ] 收藏功能（需登录）
- [ ] 分享功能
- [ ] 规格联动（库存变化）
- [ ] 加入购物车动画
- [ ] 立即购买跳转结算页

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/products/:id',
  name: 'ProductDetail',
  component: () => import('@/views/product/ProductDetail.vue'),
  meta: {
    title: '商品详情'
  },
  props: true  // 将路由参数作为props传递
}
```

### 2. 商品列表页卡片链接修改
```vue
<!-- src/views/product/ProductList.vue 或 ProductCard.vue -->

<!-- 修改前 -->
<div class="product-card" @click="handleClick">

<!-- 修改后 -->
<router-link 
  :to="`/products/${product.id}`" 
  class="product-card"
>
  <!-- 卡片内容 -->
</router-link>
```

### 3. API 接口（Mock 数据）
```typescript
// src/api/product.ts

// Mock 商品详情数据
const mockProductDetail = {
  id: 1,
  name: '皇家小型犬成犬粮',
  images: [
    '/images/product-1-1.jpg',
    '/images/product-1-2.jpg',
    '/images/product-1-3.jpg',
    '/images/product-1-4.jpg'
  ],
  price: 159.00,
  originalPrice: 199.00,
  discount: 20,
  rating: 4.8,
  reviewCount: 2341,
  stock: 50,
  fastDelivery: true,
  shop: {
    id: 101,
    name: '皇家宠物旗舰店'
  },
  specs: [
    {
      id: 1,
      name: '规格',
      options: [
        { id: 101, name: '小犬1kg', value: '1kg', available: true },
        { id: 102, name: '中犬3kg', value: '3kg', available: true },
        { id: 103, name: '大犬10kg', value: '10kg', available: false, additionalPrice: 120 }
      ]
    }
  ],
  description: `
    <h3>产品特点</h3>
    <ul>
      <li>专为小型犬设计</li>
      <li>优质蛋白来源</li>
      <li>科学配方，均衡营养</li>
    </ul>
  `,
  specsTable: [
    { label: '品牌', value: '皇家' },
    { label: '产地', value: '法国' },
    { label: '适用犬种', value: '小型犬' },
    { label: '保质期', value: '18个月' },
    { label: '储存方式', value: '阴凉干燥处' }
  ],
  reviews: [
    {
      id: 1,
      userId: 1001,
      username: '爱狗人士',
      rating: 5,
      content: '家里狗狗很喜欢吃，毛色也变好了',
      createTime: '2024-01-15'
    },
    {
      id: 2,
      userId: 1002,
      username: '宠物达人',
      rating: 5,
      content: '皇家品质一直很稳定，回购很多次了',
      createTime: '2024-01-10'
    }
  ],
  relatedProducts: [2, 3, 4, 5]  // 相关商品ID列表
}

// 获取商品详情
export function getProductDetail(id: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProductDetail)
    }, 300)
  })
}

// 获取相关商品
export function getRelatedProducts(ids: number[]) {
  // 返回商品列表...
}
```

### 4. 状态管理（Pinia）
```typescript
// src/stores/cart.ts

import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),
  
  actions: {
    addToCart(product: any, quantity: number, spec: any) {
      // 检查是否已存在
      const existingIndex = this.items.findIndex(
        item => item.productId === product.id && item.specId === spec.id
      )
      
      if (existingIndex >= 0) {
        // 更新数量
        this.items[existingIndex].quantity += quantity
      } else {
        // 新增
        this.items.push({
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          spec,
          quantity
        })
      }
      
      this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      // 保存到localStorage
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
})
```

### 5. 数量选择器逻辑
```typescript
// 数量选择
const quantity = ref(1)

const decrease = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increase = () => {
  if (quantity.value < maxStock.value) {
    quantity.value++
  }
}

// 最大库存（根据选中规格）
const maxStock = computed(() => {
  if (selectedSpec.value) {
    return selectedSpec.value.stock || product.value.stock
  }
  return product.value.stock
})
```

---

## 🎨 样式示例

### 图片画廊样式
```scss
.product-gallery {
  position: sticky;
  top: 24px;
  
  &__main {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: zoom-in;
      
      &:hover {
        transform: scale(1.05);
        transition: transform 0.3s;
      }
    }
  }
  
  &__thumbnails {
    display: flex;
    gap: 12px;
  }
  
  &__thumbnail {
    width: 72px;
    height: 72px;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
    
    &:hover {
      opacity: 1;
    }
    
    &.active {
      border-color: #1c49c2;
      opacity: 1;
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
```

### 商品信息样式
```scss
.product-info {
  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #121212;
    margin-bottom: 16px;
    line-height: 1.4;
  }
  
  &__rating {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    
    .stars {
      color: #ffc107;
      font-size: 16px;
    }
    
    .score {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .count {
      font-size: 14px;
      color: #999;
      cursor: pointer;
      
      &:hover {
        color: #1c49c2;
      }
    }
  }
  
  &__price {
    background: #fff5f5;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    .current-price {
      font-size: 32px;
      font-weight: 700;
      color: #bd2848;
      
      .symbol {
        font-size: 18px;
      }
    }
    
    .original-price {
      font-size: 16px;
      color: #999;
      text-decoration: line-through;
      margin-left: 12px;
    }
    
    .discount-tag {
      background: #bd2848;
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin-left: 12px;
    }
  }
  
  &__delivery {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #333;
    
    .icon {
      color: #00a651;
    }
  }
  
  &__specs {
    margin-bottom: 24px;
    
    .spec-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }
    
    .spec-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .spec-option {
      padding: 10px 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover:not(.disabled) {
        border-color: #1c49c2;
      }
      
      &.active {
        border-color: #1c49c2;
        background: #f0f6ff;
        color: #1c49c2;
      }
      
      &.disabled {
        background: #f5f5f5;
        color: #ccc;
        cursor: not-allowed;
      }
    }
  }
  
  &__quantity {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    
    .label {
      font-size: 14px;
      color: #666;
    }
    
    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      
      .btn {
        width: 40px;
        height: 40px;
        background: #f8f9fa;
        border: none;
        font-size: 18px;
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
        width: 60px;
        height: 40px;
        border: none;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .stock {
      font-size: 14px;
      color: #999;
    }
  }
  
  &__actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
    
    .btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-add-cart {
      background: #ff6c10;
      color: #fff;
      
      &:hover {
        background: #e55a00;
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
    
    .btn-buy-now {
      background: #bd2848;
      color: #fff;
      
      &:hover {
        background: #a02040;
      }
    }
  }
}
```

### 标签页样式
```scss
.product-tabs {
  margin-top: 48px;
  
  &__nav {
    display: flex;
    border-bottom: 2px solid #eee;
    margin-bottom: 32px;
  }
  
  &__nav-item {
    padding: 16px 32px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
    
    &:hover {
      color: #1c49c2;
    }
    
    &.active {
      color: #1c49c2;
      font-weight: 600;
      border-bottom-color: #1c49c2;
    }
  }
  
  &__content {
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    min-height: 400px;
  }
}
```

---

## 📂 参考文件

开发前请阅读：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 设计规范
2. `src/views/product/ProductList.vue` - 列表页参考（了解现有风格）
3. `src/components/common/ProductCard.vue` - 卡片组件（复用相关商品）
4. `src/views/Home.vue` - 首页参考

---

## ✅ 验收标准

### 功能验收
- [ ] 商品列表页卡片点击跳转到详情页 `/products/:id`
- [ ] 面包屑导航正确（首页 / 分类 / 商品名称）
- [ ] 商品图片显示正常（主图 + 缩略图切换）
- [ ] 商品信息完整（标题、评分、价格、折扣）
- [ ] 规格选择可用（选中状态、不可选状态）
- [ ] 数量选择可用（+/-、限制范围）
- [ ] 「加入购物车」按钮可用（调用API或提示）
- [ ] 面包屑、标签页切换正常
- [ ] 相关商品展示

### 设计验收
- [ ] 符合 Chewy 设计风格
- [ ] 左右布局合理（图片 + 信息）
- [ ] 留白充足（参考 LAYOUT-FIX-PROMPT.md）
- [ ] 价格显示突出（红色大字体）
- [ ] CTA按钮颜色正确（橙色）
- [ ] 无emoji
- [ ] 响应式适配（桌面、平板、手机）

### 代码验收
- [ ] 组件拆分合理
- [ ] 使用 Composition API
- [ ] Props 类型定义完整
- [ ] Mock 数据结构合理
- [ ] 状态管理（Pinia）使用得当
- [ ] 代码有适当注释

---

## 💬 启动指令示例

```
我们要开发 PetStore 的商品详情页。

当前状态：
- 商品列表页已完成，卡片点击需要跳转到详情页
- 需要实现完整的商品详情展示功能

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md 了解设计规范
2. 查看 src/views/product/ProductList.vue 了解现有代码
3. 配置路由 /products/:id
4. 修改商品卡片点击跳转逻辑
5. 创建 ProductDetail.vue 页面组件
6. 创建子组件：图片画廊、商品信息、标签页、相关商品
7. 实现 Mock 数据和功能逻辑

设计风格参考 Chewy.com，留白充足，不要emoji。
```

---

## 🎯 预期效果

完成后，用户可以：
1. ✅ 从商品列表页点击商品卡片
2. ✅ 跳转到商品详情页，看到完整商品信息
3. ✅ 查看多张商品图片（切换缩略图）
4. ✅ 选择规格和数量
5. ✅ 点击「加入购物车」（提示成功或调用API）
6. ✅ 查看商品详情、规格参数、用户评价
7. ✅ 看到相关商品推荐
8. ✅ 使用面包屑导航返回列表页

---

**祝开发顺利！🐾**（好吧，去掉emoji：祝开发顺利！）
