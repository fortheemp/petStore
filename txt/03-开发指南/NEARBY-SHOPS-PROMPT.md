# 附近宠物商店页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发附近商店地图浏览页

---

## 📋 任务目标

开发 PetStore 宠物商店的**附近商店地图浏览页**，用地图形式展示本地商店位置，支持查看商店详情和路线导航。

---

## 🎯 当前项目状态

### 已完成
- ✅ 商品浏览、购物车、订单、用户系统、管理后台

### 待开发
- ❌ 附近商店页 `/nearby-shops`
- ❌ 地图展示商店标记
- ❌ 商店详情弹窗/卡片
- ❌ 路线导航

---

## 🎨 设计规范

**重要**：请先阅读 `txt/02-设计规范/DESIGN-SYSTEM.md`

### 核心色彩
```css
品牌蓝：#1c49c2（地图标记选中）
品牌橙：#ff6c10（CTA按钮）
成功绿：#00a651（营业状态）
背景：#f8f9fa
卡片：#ffffff
```

---

## 📐 页面结构设计

### 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  附近宠物商店                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────┐  ┌──────────────────────┐│
│  │                          │  │  商店列表            ││
│  │                          │  │                      ││
│  │       地图区域            │  │  🔍 搜索商店...      ││
│  │     （高德地图）           │  │                      ││
│  │                          │  │  ┌────────────────┐  ││
│  │    [标记1] [标记2]        │  │  │ 🏠 皇家宠物店  │  ││
│  │         [标记3]           │  │  │ ⭐ 4.8  营业中  │  ││
│  │                          │  │  │ 广州天河区xxx  │  ││
│  │                          │  │  │ [查看详情]      │  ││
│  │                          │  │  └────────────────┘  ││
│  │                          │  │                      ││
│  │                          │  │  ┌────────────────┐  ││
│  │                          │  │  │ 🏠 爱宠生活馆  │  ││
│  │                          │  │  │ ⭐ 4.6  营业中  │  ││
│  │                          │  │  │ 广州番禺区xxx  │  ││
│  │                          │  │  │ [查看详情]      │  ││
│  │                          │  │  └────────────────┘  ││
│  │                          │  │                      ││
│  └──────────────────────────┘  └──────────────────────┘│
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  商店详情卡片（点击标记或列表项后显示）              │  │
│  │                                                   │  │
│  │  皇家宠物旗舰店                                   │  │
│  │  ⭐ 4.8 (236条评价)   🟢 营业中                   │  │
│  │  📍 广东省广州市天河区xxx路xxx号                   │  │
│  │  📞 020-88888888                                 │  │
│  │  ⏰ 营业时间：09:00-21:00                         │  │
│  │                                                   │  │
│  │  [导航到这里]  [查看商品]                          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分

### 页面组件
- **NearbyShops.vue** (`src/views/shop/NearbyShops.vue`)

### 子组件
- ShopMap.vue - 地图容器
- ShopList.vue - 商店列表
- ShopCard.vue - 单个商店卡片
- ShopDetail.vue - 商店详情弹窗/卡片
- ShopMarker.vue - 地图标记（可选）

---

## 📝 功能需求清单

### 地图功能 P0
- [ ] 路由 `/nearby-shops`
- [ ] 集成高德地图 JS API（或百度地图）
- [ ] 地图初始化（中心点：用户位置或默认城市）
- [ ] 地图缩放、拖拽
- [ ] 商店标记（Marker）显示在地图上
- [ ] 点击标记显示商店名称
- [ ] 定位按钮（获取用户当前位置）

### 商店列表 P0
- [ ] 左侧/右侧商店列表
- [ ] 商店搜索（按名称）
- [ ] 商店卡片展示（名称、评分、地址、营业状态）
- [ ] 点击商店卡片，地图飞到对应位置
- [ ] 点击商店卡片，显示详情

### 商店详情 P0
- [ ] 商店名称、评分、评价数
- [ ] 营业状态（营业中/已打烊）
- [ ] 详细地址
- [ ] 联系电话
- [ ] 营业时间
- [ ] 商店图片（可选）
- [ ] 「导航到这里」按钮
- [ ] 「查看商品」按钮（跳转商品列表，筛选该商店）

### 路线导航 P0
- [ ] 点击「导航到这里」
- [ ] 调用地图 SDK 的导航功能
- [ ] 或跳转到高德/百度地图 APP

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/nearby-shops',
  name: 'NearbyShops',
  component: () => import('@/views/shop/NearbyShops.vue'),
  meta: { title: '附近宠物商店' }
}
```

### 2. 高德地图集成（前端 Mock 版本）

**注意**：真实项目需要申请高德地图 Key，这里用 Mock 模拟效果。

```typescript
// src/views/shop/NearbyShops.vue

import { ref, onMounted } from 'vue'

// Mock 商店数据
const mockShops = [
  {
    id: 1,
    name: '皇家宠物旗舰店',
    rating: 4.8,
    reviewCount: 236,
    address: '广东省广州市天河区体育西路xxx号',
    phone: '020-88888888',
    businessHours: '09:00-21:00',
    status: 'open',  // open/closed
    longitude: 113.335,
    latitude: 23.135,
    image: '/images/shop-1.jpg',
    productCount: 128
  },
  {
    id: 2,
    name: '爱宠生活馆',
    rating: 4.6,
    reviewCount: 189,
    address: '广东省广州市番禺区市桥大道xxx号',
    phone: '020-66666666',
    businessHours: '09:30-20:30',
    status: 'open',
    longitude: 113.355,
    latitude: 23.015,
    image: '/images/shop-2.jpg',
    productCount: 86
  },
  {
    id: 3,
    name: '萌宠乐园',
    rating: 4.5,
    reviewCount: 156,
    address: '广东省广州市白云区白云大道xxx号',
    phone: '020-77777777',
    businessHours: '10:00-20:00',
    status: 'closed',
    longitude: 113.285,
    latitude: 23.165,
    image: '/images/shop-3.jpg',
    productCount: 64
  }
]

const shops = ref(mockShops)
const selectedShop = ref(null)
const searchKeyword = ref('')

// 地图相关（Mock）
const mapLoaded = ref(false)

onMounted(() => {
  // 模拟地图加载
  setTimeout(() => {
    mapLoaded.value = true
  }, 500)
})

// 点击商店卡片
const handleShopClick = (shop: any) => {
  selectedShop.value = shop
  // 实际项目：地图飞到对应坐标
  // map.panTo([shop.longitude, shop.latitude])
}

// 导航功能
const handleNavigate = (shop: any) => {
  // 实际项目：调用高德地图导航
  // 这里跳转到高德地图网页版
  const url = `https://uri.amap.com/navigation?to=${shop.longitude},${shop.latitude},${encodeURIComponent(shop.name)}&mode=car&policy=1&src=petsotre`
  window.open(url, '_blank')
}

// 查看商品
const handleViewProducts = (shopId: number) => {
  // 跳转到商品列表，筛选该商店
  router.push({ path: '/products', query: { shopId: shopId.toString() } })
}

// 搜索过滤
const filteredShops = computed(() => {
  if (!searchKeyword.value) return shops.value
  return shops.value.filter(shop =>
    shop.name.includes(searchKeyword.value) ||
    shop.address.includes(searchKeyword.value)
  )
})
```

### 3. 地图组件（实际项目使用）

```vue
<!-- src/components/shop/ShopMap.vue -->

<template>
  <div class="shop-map">
    <div id="map-container" class="map-container"></div>
    <div class="map-controls">
      <button class="locate-btn" @click="handleLocate">
        定位
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// 实际项目中需要：
// 1. 在 index.html 中引入高德地图 JS API
//    <script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_KEY"></script>
//
// 2. 初始化地图
// onMounted(() => {
//   const map = new AMap.Map('map-container', {
//     zoom: 13,
//     center: [113.335, 23.135]  // 广州
//   })
//
//   // 添加标记
//   shops.value.forEach(shop => {
//     const marker = new AMap.Marker({
//       position: [shop.longitude, shop.latitude],
//       title: shop.name
//     })
//     marker.on('click', () => {
//       emit('shopClick', shop)
//     })
//     map.add(marker)
//   })
// })

defineProps<{
  shops: any[]
}>()

const emit = defineEmits<{
  (e: 'shopClick', shop: any): void
}>()

const handleLocate = () => {
  // 获取用户位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 实际项目：移动地图到用户位置
        console.log('定位成功:', position.coords)
      },
      (error) => {
        console.error('定位失败:', error)
      }
    )
  }
}
</script>

<style scoped>
.shop-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.map-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
}

.locate-btn {
  width: 40px;
  height: 40px;
  background: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
  }
}
</style>
```

### 4. Header 导航链接
```vue
<!-- src/components/layout/Header.vue -->

<!-- 在分类导航中添加 -->
<router-link to="/nearby-shops" class="category-nav__link">
  附近商店
</router-link>
```

---

## 🎨 样式示例

### 页面整体布局
```scss
.nearby-shops-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0;

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 48px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #121212;
    margin-bottom: 24px;
  }

  &__content {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 24px;
    height: calc(100vh - 200px);
    min-height: 500px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      height: auto;
    }
  }
}
```

### 商店列表
```scss
.shop-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__search {
    width: 100%;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0 16px;
    font-size: 14px;

    &:focus {
      border-color: #1c49c2;
      outline: none;
    }
  }

  &__count {
    padding: 12px 16px;
    font-size: 13px;
    color: #999;
    border-bottom: 1px solid #f0f0f0;
  }

  &__items {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
}
```

### 商店卡片
```scss
.shop-card {
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  &:hover {
    background: #f8f9fa;
  }

  &.active {
    border-color: #1c49c2;
    background: #f0f6ff;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: #121212;
  }

  &__status {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;

    &.open {
      background: #e6f9ee;
      color: #00a651;
    }

    &.closed {
      background: #f5f5f5;
      color: #999;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .stars {
      color: #ffc107;
      font-size: 14px;
    }

    .score {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .count {
      font-size: 12px;
      color: #999;
    }
  }

  &__address {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### 商店详情卡片
```scss
.shop-detail {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-top: 24px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  &__name {
    font-size: 20px;
    font-weight: 700;
    color: #121212;
    margin-bottom: 8px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 12px;

    .stars {
      color: #ffc107;
    }

    .score {
      font-weight: 600;
    }

    .count {
      color: #999;
      font-size: 14px;
    }
  }

  &__info {
    margin-bottom: 20px;

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;

      .icon {
        color: #999;
        margin-top: 2px;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;

    .btn {
      flex: 1;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .btn-navigate {
      background: #1c49c2;
      color: #fff;

      &:hover {
        background: #163da0;
      }
    }

    .btn-view-products {
      background: #ff6c10;
      color: #fff;

      &:hover {
        background: #e55a00;
      }
    }
  }
}
```

### 地图区域
```scss
.map-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;

  // Mock 地图背景
  .mock-map {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    position: relative;

    .map-placeholder {
      text-align: center;

      .icon {
        font-size: 48px;
        margin-bottom: 16px;
        color: #ccc;
      }

      .text {
        font-size: 16px;
      }
    }

    // Mock 地图标记
    .map-marker {
      position: absolute;
      width: 32px;
      height: 32px;
      background: #1c49c2;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: rotate(-45deg) scale(1.2);
        background: #ff6c10;
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
}
```

---

## 📂 参考文件
1. `txt/02-设计规范/DESIGN-SYSTEM.md`
2. `src/router/index.ts` - 路由配置
3. `src/components/layout/Header.vue` - 添加导航链接

---

## ✅ 验收标准

### 地图功能
- [ ] 路由 `/nearby-shops` 正常访问
- [ ] 地图区域正常展示（Mock背景或真实地图）
- [ ] 商店标记显示在地图上（Mock定位点）
- [ ] 点击标记显示商店名称

### 商店列表
- [ ] 商店列表正常展示
- [ ] 搜索功能正常
- [ ] 点击商店卡片高亮
- [ ] 点击商店卡片，详情区更新

### 商店详情
- [ ] 商店信息完整（名称、评分、地址、电话、营业时间）
- [ ] 营业状态标识正确
- [ ] 「导航到这里」按钮可点击
- [ ] 「查看商品」按钮跳转正确

### 导航功能
- [ ] 点击导航跳转到高德地图网页版
- [ ] 坐标和店名正确传递

---

## 💬 启动指令示例

```
开发 PetStore 的附近宠物商店地图浏览页。

当前状态：
- 其他用户端页面已完成
- 需要实现地图展示附近商店功能

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md
2. 配置路由 /nearby-shops
3. 创建 NearbyShops.vue 页面
4. 实现 Mock 商店数据
5. 实现地图区域（Mock背景+标记点）
6. 实现商店列表（搜索、卡片、点击高亮）
7. 实现商店详情卡片
8. 实现导航功能（跳转高德地图网页版）
9. 在 Header 分类导航添加「附近商店」入口

地图暂时用 Mock 模拟，标注真实项目需要高德地图 Key。
设计风格参考 Chewy.com，不要emoji。
```

---

**祝开发顺利！**
