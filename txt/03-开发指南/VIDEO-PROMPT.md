# 宠物视频页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发宠物视频浏览页

---

## 📋 任务目标

开发 PetStore 宠物商店的**宠物视频浏览页**，展示宠物相关视频，支持播放和关联商品。

---

## 🎯 当前项目状态

### 已完成
- ✅ 商品浏览、购物车、订单、用户系统、管理后台

### 待开发
- ❌ 视频列表页 `/videos`
- ❌ 视频播放功能
- ❌ 视频关联商品
- ❌ 商品详情嵌入视频

---

## 🎨 设计规范

**重要**：请先阅读 `txt/02-设计规范/DESIGN-SYSTEM.md`

### 核心色彩
```css
品牌蓝：#1c49c2（链接、播放按钮）
品牌橙：#ff6c10（CTA）
背景：#f8f9fa
卡片：#ffffff
文字：#121212、#666666、#999999
```

---

## 📐 页面结构设计

### 1. 视频列表页 /videos

```
┌─────────────────────────────────────────────────────────┐
│  宠物视频                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [全部] [狗狗] [猫咪] [训练] [趣味]                     │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │   ┌─────────┐   │  │   ┌─────────┐   │               │
│  │   │ ▶ 播放  │   │  │   │ ▶ 播放  │   │               │
│  │   │  视频   │   │  │   │  视频   │   │               │
│  │   └─────────┘   │  │   └─────────┘   │               │
│  │  03:25          │  │  05:12          │               │
│  ├─────────────────┤  ├─────────────────┤               │
│  │ 狗狗洗澡全流程   │  │ 猫咪逗猫棒教程  │               │
│  │ 观看 1.2万次    │  │ 观看 8560次     │               │
│  │ 👤 宠物达人     │  │ 👤 猫奴日记     │               │
│  │                 │  │                 │               │
│  │ 相关商品：      │  │ 相关商品：      │               │
│  │ 宠物沐浴露 ¥39  │  │ 逗猫棒 ¥19     │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │   ┌─────────┐   │  │   ┌─────────┐   │               │
│  │   │ ▶ 播放  │   │  │   │ ▶ 播放  │   │               │
│  │   │  视频   │   │  │   │  视频   │   │               │
│  │   └─────────┘   │  │   └─────────┘   │               │
│  │  02:48          │  │  08:33          │               │
│  ├─────────────────┤  ├─────────────────┤               │
│  │ 狗狗训练坐下     │  │ 萌宠搞笑合集    │               │
│  │ 观看 2.3万次    │  │ 观看 5.6万次    │               │
│  │ 👤 训练师老王    │  │ 👤 搞笑宠物     │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. 视频播放弹窗/页面

```
┌─────────────────────────────────────────────────────────┐
│  [x] 关闭                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │                                                   │  │
│  │                 ▶  视频播放器                      │  │
│  │                   （HTML5 Video）                  │  │
│  │                                                   │  │
│  │                                                   │  │
│  │  ────────────────────────────────────────────────  │  │
│  │  ▶  ━━━━━━━━━●━━━━━━━━━━━━━━━━  02:15 / 03:25   │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  观看 1.2万次   发布于 2024-01-15                       │
│                                                         │
│  狗狗洗澡全流程，教你如何在家给狗狗洗澡                 │
│  #宠物护理 #洗澡教程 #狗狗                             │
│                                                         │
│  ────────────────────────────────────────────────────  │
│                                                         │
│  相关商品                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [图片] 宠物沐浴露  ¥39.00  [加入购物车]          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分

### 页面组件
- **VideoList.vue** (`src/views/video/VideoList.vue`)

### 子组件
- VideoCard.vue - 视频卡片
- VideoPlayer.vue - 视频播放器（弹窗或内嵌）
- VideoCategories.vue - 视频分类Tab
- RelatedProducts.vue - 相关商品

---

## 📝 功能需求清单

### 视频列表页 P0
- [ ] 路由 `/videos`
- [ ] 视频分类Tab筛选（全部、狗狗、猫咪、训练、趣味）
- [ ] 视频网格布局（响应式：4/3/2列）
- [ ] 视频卡片展示（封面、时长、标题、观看次数、作者）
- [ ] 点击视频卡片打开播放
- [ ] 视频列表空状态

### 视频播放 P0
- [ ] 播放弹窗或跳转页面
- [ ] HTML5 Video 播放器
- [ ] 播放/暂停控制
- [ ] 进度条拖拽
- [ ] 时间显示（当前/总时长）
- [ ] 全屏播放
- [ ] 关闭播放器

### 视频详情 P0
- [ ] 视频标题
- [ ] 观看次数
- [ ] 发布时间
- [ ] 视频描述
- [ ] 标签展示

### 视频关联商品 P0
- [ ] 相关商品展示
- [ ] 商品图片、名称、价格
- [ ] 点击跳转商品详情
- [ ] 加入购物车按钮

### 商品详情嵌入视频 P0
- [ ] 商品详情页 Tab 增加「视频介绍」
- [ ] 嵌入关联视频播放器

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/videos',
  name: 'VideoList',
  component: () => import('@/views/video/VideoList.vue'),
  meta: { title: '宠物视频' }
}
```

### 2. Mock 视频数据
```typescript
// src/api/video.ts

export interface Video {
  id: number
  title: string
  url: string  // 视频地址（Mock用占位符）
  cover: string  // 封面图
  duration: string  // 时长 03:25
  durationSeconds: number  // 总秒数
  viewCount: number
  author: string
  category: string  // dogs/cats/training/funny
  description: string
  tags: string[]
  createTime: string
  relatedProductId?: number  // 关联商品ID
}

const mockVideos: Video[] = [
  {
    id: 1,
    title: '狗狗洗澡全流程教程',
    url: '/videos/dog-bath.mp4',
    cover: '/images/video-1.jpg',
    duration: '03:25',
    durationSeconds: 205,
    viewCount: 12560,
    author: '宠物达人',
    category: 'dogs',
    description: '教你如何在家给狗狗洗澡，包括准备工作、洗澡步骤、吹干技巧等。',
    tags: ['宠物护理', '洗澡教程', '狗狗'],
    createTime: '2024-01-15',
    relatedProductId: 101
  },
  {
    id: 2,
    title: '猫咪逗猫棒互动教程',
    url: '/videos/cat-toy.mp4',
    cover: '/images/video-2.jpg',
    duration: '05:12',
    durationSeconds: 312,
    viewCount: 8560,
    author: '猫奴日记',
    category: 'cats',
    description: '如何正确使用逗猫棒与猫咪互动，让猫咪爱上运动。',
    tags: ['猫咪', '逗猫棒', '互动'],
    createTime: '2024-01-14',
    relatedProductId: 102
  },
  {
    id: 3,
    title: '狗狗训练：坐下、握手、趴下',
    url: '/videos/dog-training.mp4',
    cover: '/images/video-3.jpg',
    duration: '02:48',
    durationSeconds: 168,
    viewCount: 23000,
    author: '训练师老王',
    category: 'training',
    description: '基础狗狗训练教程，让你的狗狗学会基本指令。',
    tags: ['狗狗训练', '服从训练', '新手'],
    createTime: '2024-01-13'
  },
  {
    id: 4,
    title: '萌宠搞笑瞬间合集',
    url: '/videos/funny-pets.mp4',
    cover: '/images/video-4.jpg',
    duration: '08:33',
    durationSeconds: 513,
    viewCount: 56000,
    author: '搞笑宠物',
    category: 'funny',
    description: '超搞笑的萌宠瞬间，让你笑到停不下来！',
    tags: ['搞笑', '萌宠', '合集'],
    createTime: '2024-01-12'
  }
]

// 获取视频列表
export function getVideoList(category?: string) {
  return new Promise<Video[]>((resolve) => {
    setTimeout(() => {
      if (category && category !== 'all') {
        resolve(mockVideos.filter(v => v.category === category))
      } else {
        resolve(mockVideos)
      }
    }, 300)
  })
}

// 获取视频详情
export function getVideoDetail(id: number) {
  return new Promise<Video | undefined>((resolve) => {
    setTimeout(() => {
      resolve(mockVideos.find(v => v.id === id))
    }, 200)
  })
}

// 获取关联商品（Mock）
export function getRelatedProduct(productId: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: productId,
        name: '宠物沐浴露',
        price: 39,
        image: '/images/product-101.jpg'
      })
    }, 200)
  })
}
```

### 3. 视频列表逻辑
```typescript
// src/views/video/VideoList.vue

import { ref, onMounted } from 'vue'
import { getVideoList, Video } from '@/api/video'

const videos = ref<Video[]>([])
const loading = ref(true)
const activeCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '狗狗', value: 'dogs' },
  { label: '猫咪', value: 'cats' },
  { label: '训练', value: 'training' },
  { label: '趣味', value: 'funny' }
]

const fetchVideos = async () => {
  loading.value = true
  try {
    videos.value = await getVideoList(activeCategory.value)
  } finally {
    loading.value = false
  }
}

const handleCategoryChange = (category: string) => {
  activeCategory.value = category
  fetchVideos()
}

// 播放相关
const showPlayer = ref(false)
const currentVideo = ref<Video | null>(null)

const handlePlayVideo = (video: Video) => {
  currentVideo.value = video
  showPlayer.value = true
}

const handleClosePlayer = () => {
  showPlayer.value = false
  currentVideo.value = null
}

onMounted(() => {
  fetchVideos()
})
```

### 4. 视频播放器组件
```vue
<!-- src/components/video/VideoPlayer.vue -->

<template>
  <div class="video-player" v-if="visible">
    <div class="video-player__overlay" @click="handleClose"></div>
    <div class="video-player__modal">
      <div class="video-player__header">
        <span class="video-player__title">{{ video?.title }}</span>
        <button class="video-player__close" @click="handleClose">
          ✕
        </button>
      </div>

      <div class="video-player__content">
        <video
          ref="videoRef"
          :src="video?.url"
          :poster="video?.cover"
          controls
          preload="metadata"
          class="video-player__video"
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <div class="video-player__info">
        <div class="video-player__meta">
          <span>观看 {{ formatCount(video?.viewCount) }}次</span>
          <span>发布于 {{ video?.createTime }}</span>
        </div>
        <p class="video-player__desc">{{ video?.description }}</p>
        <div class="video-player__tags">
          <span
            v-for="tag in video?.tags"
            :key="tag"
            class="tag"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- 相关商品 -->
      <div class="video-player__related" v-if="relatedProduct">
        <h4>相关商品</h4>
        <div class="related-product">
          <img :src="relatedProduct.image" :alt="relatedProduct.name" />
          <div class="related-product__info">
            <span class="related-product__name">{{ relatedProduct.name }}</span>
            <span class="related-product__price">¥{{ relatedProduct.price }}</span>
          </div>
          <button class="related-product__btn" @click="handleAddToCart">
            加入购物车
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Video, getRelatedProduct } from '@/api/video'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  visible: boolean
  video: Video | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const videoRef = ref<HTMLVideoElement>()
const relatedProduct = ref<any>(null)
const cartStore = useCartStore()

watch(() => props.video, async (newVideo) => {
  if (newVideo?.relatedProductId) {
    relatedProduct.value = await getRelatedProduct(newVideo.relatedProductId)
  } else {
    relatedProduct.value = null
  }
})

const handleClose = () => {
  // 暂停视频
  if (videoRef.value) {
    videoRef.value.pause()
  }
  emit('update:visible', false)
}

const formatCount = (count?: number) => {
  if (!count) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

const handleAddToCart = () => {
  if (relatedProduct.value) {
    // Mock：添加到购物车
    ElMessage.success('已加入购物车')
  }
}
</script>
```

---

## 🎨 样式示例

### 视频列表页
```scss
.video-list-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 24px 0 64px;

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

  &__categories {
    margin-bottom: 32px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }
}
```

### 视频卡片
```scss
.video-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__cover {
    position: relative;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.8;
      transition: opacity 0.3s;
    }

    &:hover img {
      opacity: 0.6;
    }
  }

  &__play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    background: rgba(28, 73, 194, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:hover {
      background: #1c49c2;
      transform: translate(-50%, -50%) scale(1.1);
    }

    &::after {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 0 10px 18px;
      border-color: transparent transparent transparent #fff;
      margin-left: 4px;
    }
  }

  &__duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  &__info {
    padding: 16px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #121212;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__related {
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .label {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }

    .product-mini {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;

      img {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        object-fit: cover;
      }

      .name {
        flex: 1;
        font-size: 12px;
        color: #333;
      }

      .price {
        font-size: 13px;
        font-weight: 600;
        color: #bd2848;
      }
    }
  }
}
```

### 视频播放弹窗
```scss
.video-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  &__modal {
    position: relative;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #121212;
  }

  &__close {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    font-size: 18px;
    color: #999;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  }

  &__content {
    background: #000;
  }

  &__video {
    width: 100%;
    max-height: 500px;
    display: block;
  }

  &__info {
    padding: 20px;
    overflow-y: auto;
  }

  &__meta {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
  }

  &__desc {
    font-size: 14px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .tag {
      padding: 4px 12px;
      background: #f8f9fa;
      border-radius: 16px;
      font-size: 13px;
      color: #1c49c2;
    }
  }

  &__related {
    padding: 20px;
    border-top: 1px solid #f0f0f0;

    h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .related-product {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;

      img {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        object-fit: cover;
      }

      &__info {
        flex: 1;
      }

      &__name {
        display: block;
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }

      &__price {
        font-size: 16px;
        font-weight: 600;
        color: #bd2848;
      }

      &__btn {
        padding: 8px 16px;
        background: #ff6c10;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #e55a00;
        }
      }
    }
  }
}
```

---

## 📂 参考文件
1. `txt/02-设计规范/DESIGN-SYSTEM.md`
2. `src/router/index.ts` - 路由配置
3. `src/stores/cart.ts` - 购物车 Store

---

## ✅ 验收标准

### 视频列表页
- [ ] 路由 `/videos` 正常访问
- [ ] 分类Tab切换正常
- [ ] 视频网格布局正常
- [ ] 视频卡片展示完整（封面、时长、标题、观看数、作者）
- [ ] 点击卡片打开播放器

### 视频播放
- [ ] 播放弹窗正常弹出
- [ ] HTML5 Video 播放器正常
- [ ] 播放/暂停控制正常
- [ ] 进度条可拖拽
- [ ] 时间显示正常
- [ ] 关闭弹窗正常

### 视频详情
- [ ] 标题、观看次数、发布时间正常
- [ ] 描述和标签正常展示

### 关联商品
- [ ] 相关商品展示正常
- [ ] 商品信息正确（图片、名称、价格）
- [ ] 加入购物车按钮可点击

### 商品详情嵌入
- [ ] 商品详情页增加「视频介绍」Tab
- [ ] 嵌入视频播放正常

---

## 💬 启动指令示例

```
开发 PetStore 的宠物视频浏览页。

当前状态：
- 其他用户端页面已完成
- 需要实现视频浏览和播放功能

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md
2. 配置路由 /videos
3. 创建 Mock 视频数据
4. 实现 VideoList.vue 页面
5. 实现 VideoCard.vue 卡片组件
6. 实现 VideoPlayer.vue 播放器弹窗
7. 实现视频分类筛选
8. 实现关联商品展示
9. 在商品详情页增加「视频介绍」Tab

视频用 Mock URL 模拟，使用 HTML5 Video 播放器。
设计风格参考 Chewy.com，不要emoji。
```

---

**祝开发顺利！**
