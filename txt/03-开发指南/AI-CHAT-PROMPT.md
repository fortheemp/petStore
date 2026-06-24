# AI智能问答助手开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发AI客服助手

---

## 📋 任务目标

开发 PetStore 宠物商店的**AI智能问答助手**，提供宠物喂养知识问答、商品推荐、客服咨询功能。

---

## 🎯 当前项目状态

### 已完成
- ✅ 所有用户端和管理端页面

### 待开发
- ❌ AI助手入口（悬浮按钮）
- ❌ 聊天窗口
- ❌ Mock AI回答
- ❌ 商品推荐功能

---

## 🎨 设计规范

**重要**：请先阅读 `txt/02-设计规范/DESIGN-SYSTEM.md`

### 核心色彩
```css
品牌蓝：#1c49c2（发送按钮、AI头像）
品牌橙：#ff6c10（推荐商品）
背景：#f8f9fa（聊天背景）
用户消息：#1c49c2（蓝色气泡）
AI消息：#ffffff（白色气泡）
文字：#121212、#666666
```

---

## 📐 页面结构设计

### AI助手入口

```
                              ┌─────────────┐
                              │  💬 AI助手  │  ← 悬浮按钮
                              │    (圆形)   │     右下角固定
                              └─────────────┘
```

### 聊天窗口

```
┌─────────────────────────────────────┐
│  🐾 PetStore 智能助手     [x] 关闭  │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │     👋 你好！我是PetStore   │   │
│  │     智能助手，可以为你提供：  │   │
│  │                             │   │
│  │     • 宠物喂养知识          │   │
│  │     • 商品推荐              │   │
│  │     • 订单咨询              │   │
│  │                             │   │
│  │     请问有什么可以帮你的？   │   │
│  └─────────────────────────────┘   │
│                                     │
│              ┌─────────────────┐   │
│              │ 狗狗吃什么粮食好 │   │
│              │      (用户)     │   │
│              └─────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  根据您的需求，我推荐以下    │   │
│  │  狗粮：                     │   │
│  │                             │   │
│  │  1. 皇家小型犬成犬粮 ¥159   │   │
│  │  2. 渴望六种鱼犬粮 ¥289     │   │
│  │  3. 纽翠斯黑钻系列 ¥245     │   │
│  │                             │   │
│  │  这些都是口碑很好的品牌，    │   │
│  │  适合不同体型的狗狗~         │   │
│  │                             │   │
│  │  [查看皇家小型犬粮]          │   │
│  │  [查看渴望六种鱼]            │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [输入消息...]           [发送]     │
└─────────────────────────────────────┘
```

---

## 🧩 组件拆分

### 组件
- **AIChat.vue** (`src/components/ai/AIChat.vue`)
  - 整体聊天窗口
  - 消息列表
  - 输入框
  - 发送按钮

- **ChatMessage.vue** (`src/components/ai/ChatMessage.vue`)
  - 单条消息展示
  - 区分用户/AI消息
  - 渲染推荐商品

- **ChatInput.vue** (`src/components/ai/ChatInput.vue`)
  - 输入框
  - 发送按钮
  - 快捷问题

- **ChatRecommend.vue** (`src/components/ai/ChatRecommend.vue`)
  - 推荐商品卡片
  - 加入购物车按钮

---

## 📝 功能需求清单

### AI助手入口 P0
- [ ] 全局悬浮按钮（右下角）
- [ ] 点击打开聊天窗口
- [ ] 未读消息提示（可选）

### 聊天窗口 P0
- [ ] 聊天弹窗展示
- [ ] 关闭按钮
- [ ] 欢迎消息（自动发送）
- [ ] 消息列表（滚动显示）
- [ ] 输入框
- [ ] 发送按钮
- [ ] 发送中状态

### 消息功能 P0
- [ ] 用户消息展示（蓝色气泡，右侧）
- [ ] AI消息展示（白色气泡，左侧）
- [ ] AI头像
- [ ] 打字机效果（逐字显示）
- [ ] 消息时间

### Mock AI回答 P0
- [ ] 关键词匹配回答
- [ ] 宠物喂养知识
- [ ] 商品推荐
- [ ] 订单咨询引导
- [ ] 默认回复

### 商品推荐 P0
- [ ] 推荐商品卡片
- [ ] 商品图片、名称、价格
- [ ] 查看详情按钮
- [ ] 加入购物车按钮

---

## 🔧 技术实现要点

### 1. 全局组件注册

```typescript
// src/main.ts

import AIChat from '@/components/ai/AIChat.vue'

// 在 App.vue 中使用
```

```vue
<!-- src/App.vue -->

<template>
  <router-view />
  <AIChat />
</template>

<script setup lang="ts">
import AIChat from '@/components/ai/AIChat.vue'
</script>
```

### 2. Mock AI 回答逻辑

```typescript
// src/api/ai.ts

interface Message {
  id: number
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  recommendProducts?: any[]
}

// Mock 商品数据
const mockProducts = [
  { id: 1, name: '皇家小型犬成犬粮', price: 159, image: '/images/product-1.jpg', category: 'dog-food' },
  { id: 2, name: '渴望六种鱼犬粮', price: 289, image: '/images/product-2.jpg', category: 'dog-food' },
  { id: 3, name: '纽翠斯黑钻系列', price: 245, image: '/images/product-3.jpg', category: 'dog-food' },
  { id: 4, name: '皇家幼猫猫粮', price: 139, image: '/images/product-4.jpg', category: 'cat-food' },
  { id: 5, name: '渴望六种鱼猫粮', price: 269, image: '/images/product-5.jpg', category: 'cat-food' },
  { id: 6, name: '宠物沐浴露', price: 39, image: '/images/product-6.jpg', category: 'supplies' },
  { id: 7, name: '逗猫棒', price: 19, image: '/images/product-7.jpg', category: 'toys' },
  { id: 8, name: '狗狗牵引绳', price: 49, image: '/images/product-8.jpg', category: 'supplies' }
]

// 关键词匹配规则
const rules = [
  {
    keywords: ['狗粮', '狗狗吃什么', '狗粮食', '狗粮推荐'],
    reply: '狗狗的粮食选择很重要，要根据年龄、体型来选择。以下是几款口碑很好的狗粮：',
    products: [1, 2, 3]
  },
  {
    keywords: ['猫粮', '猫咪吃什么', '猫粮食', '猫粮推荐'],
    reply: '猫咪的粮食推荐以下几款，都是知名品牌：',
    products: [4, 5]
  },
  {
    keywords: ['洗澡', '沐浴', '清洁'],
    reply: '给宠物洗澡建议使用专用的宠物沐浴露，人用的沐浴露可能会伤害宠物皮肤。推荐这款：',
    products: [6]
  },
  {
    keywords: ['玩具', '逗猫', '互动'],
    reply: '给猫咪买玩具推荐逗猫棒，可以增进感情，让猫咪多运动：',
    products: [7]
  },
  {
    keywords: ['牵引', '遛狗', '出门'],
    reply: '遛狗必备牵引绳，保护狗狗安全，推荐这款：',
    products: [8]
  },
  {
    keywords: ['订单', '物流', '快递', '发货'],
    reply: '关于订单和物流的问题，您可以：\n\n1. 登录后在「我的订单」查看物流信息\n2. 联系客服：400-888-8888\n3. 发送订单号给我，我帮您查询\n\n请问您还有什么问题吗？'
  },
  {
    keywords: ['你好', '在吗', '有人吗', '客服'],
    reply: '你好！我是PetStore智能助手，可以为你提供：\n\n• 宠物喂养知识\n• 商品推荐\n• 订单咨询\n\n请问有什么可以帮你的？'
  },
  {
    keywords: ['谢谢', '感谢', '多谢'],
    reply: '不客气！如果还有其他问题，随时可以问我哦~ 祝你和你的宠物都开心！'
  }
]

// 默认回复
const defaultReply = '抱歉，我没有完全理解你的问题。你可以尝试问我：\n\n• 狗狗/猫咪吃什么粮食好？\n• 有什么宠物玩具推荐？\n• 如何给宠物洗澡？\n• 订单物流问题\n\n或者直接联系人工客服：400-888-8888'

// 获取AI回答
export function getAIReply(userMessage: string): Promise<Message> {
  return new Promise((resolve) => {
    // 模拟AI思考时间
    const delay = 500 + Math.random() * 1000

    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase()
      let reply = defaultReply
      let recommendProducts: any[] = []

      // 匹配规则
      for (const rule of rules) {
        const matched = rule.keywords.some(keyword =>
          lowerMessage.includes(keyword)
        )

        if (matched) {
          reply = rule.reply
          recommendProducts = rule.products.map(id =>
            mockProducts.find(p => p.id === id)
          ).filter(Boolean)
          break
        }
      }

      resolve({
        id: Date.now(),
        content: reply,
        sender: 'ai',
        timestamp: new Date(),
        recommendProducts
      })
    }, delay)
  })
}

// 获取欢迎消息
export function getWelcomeMessage(): Message {
  return {
    id: Date.now(),
    content: '你好！我是PetStore智能助手，可以为你提供：\n\n• 宠物喂养知识\n• 商品推荐\n• 订单咨询\n\n请问有什么可以帮你的？',
    sender: 'ai',
    timestamp: new Date()
  }
}
```

### 3. 聊天组件逻辑

```typescript
// src/components/ai/AIChat.vue

import { ref, nextTick } from 'vue'
import { getAIReply, getWelcomeMessage, Message } from '@/api/ai'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useChatStore()

const visible = ref(false)
const messages = ref<Message[]>([])
const inputMessage = ref('')
const loading = ref(false)
const messagesContainer = ref<HTMLElement>()

// 打开聊天窗口
const openChat = () => {
  visible.value = true
  if (messages.value.length === 0) {
    messages.value.push(getWelcomeMessage())
  }
}

// 关闭聊天窗口
const closeChat = () => {
  visible.value = false
}

// 发送消息
const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || loading.value) return

  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    content,
    sender: 'user',
    timestamp: new Date()
  })

  inputMessage.value = ''
  loading.value = true

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  // 获取AI回复
  try {
    const reply = await getAIReply(content)
    messages.value.push(reply)
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 快捷问题
const handleQuickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

// 查看商品详情
const handleViewProduct = (productId: number) => {
  router.push(`/products/${productId}`)
  visible.value = false
}

// 加入购物车
const handleAddToCart = (product: any) => {
  // Mock：实际需要规格选择
  ElMessage.success(`已将 ${product.name} 加入购物车`)
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
```

### 4. 打字机效果

```typescript
// src/components/ai/ChatMessage.vue

import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  content: string
  sender: 'user' | 'ai'
  typing?: boolean
}>()

const displayContent = ref('')

// 打字机效果
watch(() => props.content, (newContent) => {
  if (props.typing && props.sender === 'ai') {
    let index = 0
    displayContent.value = ''

    const timer = setInterval(() => {
      if (index < newContent.length) {
        displayContent.value += newContent[index]
        index++
      } else {
        clearInterval(timer)
      }
    }, 30)  // 每30ms显示一个字

    return () => clearInterval(timer)
  } else {
    displayContent.value = newContent
  }
}, { immediate: true })
```

---

## 🎨 样式示例

### AI助手悬浮按钮
```scss
.ai-chat-trigger {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 60px;
  height: 60px;
  background: #1c49c2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(28, 73, 194, 0.4);
  transition: all 0.3s;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(28, 73, 194, 0.5);
  }

  &__icon {
    font-size: 28px;
    color: #fff;
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    background: #ff6c10;
    border-radius: 50%;
    font-size: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

### 聊天窗口
```scss
.ai-chat {
  position: fixed;
  right: 24px;
  bottom: 100px;
  width: 400px;
  height: 560px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;

  @media (max-width: 480px) {
    width: calc(100% - 32px);
    right: 16px;
    bottom: 16px;
    height: calc(100% - 100px);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #1c49c2;
    color: #fff;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
  }

  &__close {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
  }

  &__input-area {
    padding: 16px 20px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }

  &__input-wrapper {
    display: flex;
    gap: 12px;
  }

  &__input {
    flex: 1;
    height: 44px;
    border: 1px solid #ddd;
    border-radius: 22px;
    padding: 0 16px;
    font-size: 14px;

    &:focus {
      border-color: #1c49c2;
      outline: none;
    }
  }

  &__send {
    width: 44px;
    height: 44px;
    background: #1c49c2;
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
      background: #163da0;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}
```

### 消息气泡
```scss
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  &--user {
    flex-direction: row-reverse;

    .chat-message__bubble {
      background: #1c49c2;
      color: #fff;
      border-radius: 12px 12px 0 12px;
    }
  }

  &--ai {
    .chat-message__bubble {
      background: #fff;
      color: #333;
      border-radius: 12px 12px 12px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #1c49c2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    flex-shrink: 0;
  }

  &__content {
    max-width: 75%;
  }

  &__bubble {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  &__time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
  }

  &__recommend {
    margin-top: 12px;

    .recommend-title {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }

    .recommend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;

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
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }

      &__price {
        font-size: 16px;
        font-weight: 600;
        color: #bd2848;
      }

      &__actions {
        display: flex;
        gap: 8px;
      }

      .btn {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-view {
        background: #fff;
        border: 1px solid #ddd;
        color: #333;

        &:hover {
          border-color: #1c49c2;
          color: #1c49c2;
        }
      }

      .btn-add {
        background: #ff6c10;
        color: #fff;
        border: none;

        &:hover {
          background: #e55a00;
        }
      }
    }
  }
}
```

### 加载动画
```scss
.chat-loading {
  display: flex;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
```

---

## 📂 参考文件
1. `txt/02-设计规范/DESIGN-SYSTEM.md`
2. `src/stores/cart.ts` - 购物车 Store
3. `src/router/index.ts` - 路由配置

---

## ✅ 验收标准

### 入口和窗口
- [ ] 全局悬浮按钮显示正常
- [ ] 点击打开聊天窗口
- [ ] 窗口关闭正常

### 聊天功能
- [ ] 欢迎消息自动发送
- [ ] 用户消息展示正常（蓝色气泡）
- [ ] AI回复展示正常（白色气泡）
- [ ] 输入框可输入
- [ ] 发送按钮可点击
- [ ] 发送中状态显示

### Mock AI回答
- [ ] 关键词匹配正常（狗粮、猫粮、洗澡、玩具等）
- [ ] 回答内容合理
- [ ] 默认回复正常

### 商品推荐
- [ ] 推荐商品卡片展示
- [ ] 商品信息正确
- [ ] 查看详情跳转正常
- [ ] 加入购物车提示正常

### 体验
- [ ] 消息滚动到底部
- [ ] 加载动画正常
- [ ] 响应式适配

---

## 💬 启动指令示例

```
开发 PetStore 的AI智能问答助手。

当前状态：
- 所有页面已完成
- 需要全局AI助手功能

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md
2. 创建 Mock AI 回答逻辑（关键词匹配）
3. 创建 AIChat.vue 全局组件
4. 创建 ChatMessage.vue 消息组件
5. 创建 ChatInput.vue 输入组件
6. 实现聊天窗口（打开/关闭/发送/接收）
7. 实现商品推荐功能
8. 在 App.vue 中引入全局组件
9. 添加悬浮按钮

Mock AI回答使用关键词匹配，不需要真实后端。
设计风格参考 Chewy.com，不要emoji。
```

---

**祝开发顺利！**
