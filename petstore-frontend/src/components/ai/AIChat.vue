<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { getAIReply, getWelcomeMessage } from '@/api/ai'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ChatMessage from './ChatMessage.vue'

const router = useRouter()
const cartStore = useCartStore()

const visible = ref(false)
const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const messagesContainer = ref(null)
const hasWelcome = ref(false)

const openChat = () => {
  visible.value = true
  if (!hasWelcome.value) {
    messages.value.push(getWelcomeMessage())
    hasWelcome.value = true
  }
}

const closeChat = () => {
  visible.value = false
}

const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || loading.value) return

  messages.value.push({
    id: Date.now(),
    content,
    sender: 'user',
    timestamp: new Date(),
  })

  inputMessage.value = ''
  loading.value = true

  await nextTick()
  scrollToBottom()

  try {
    const reply = await getAIReply(content)
    messages.value.push(reply)
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const handleQuickQuestion = (item) => {
  if (item.action === 'navigate') {
    router.push(item.path)
    visible.value = false
    return
  }
  inputMessage.value = item.text
  sendMessage()
}

const handleViewProduct = (productId) => {
  router.push(`/products/${productId}`)
  visible.value = false
}

const handleAddToCart = (product) => {
  cartStore.addToCart(
    { id: product.id, name: product.name, price: product.price, originalPrice: product.price, stock: 50 },
    1,
    { id: 'default', name: '默认', value: '默认规格' },
  )
  ElMessage.success(`已将 ${product.name} 加入购物车`)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const quickQuestions = [
  { text: '查看我的订单', action: 'navigate', path: '/user/orders' },
  { text: '附近宠物商店', action: 'navigate', path: '/nearby-shops' },
  { text: '浏览全部商品', action: 'navigate', path: '/products' },
  { text: '狗狗吃什么粮食好？', action: 'chat' },
  { text: '猫咪玩具推荐', action: 'chat' },
  { text: '如何给宠物洗澡？', action: 'chat' },
]

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <!-- Floating Button -->
  <div v-if="!visible" class="ai-fab" @click="openChat">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>

  <!-- Chat Window -->
  <div v-if="visible" class="ai-chat">
    <div class="ai-chat__header">
      <div class="ai-chat__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
          <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
          <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
        </svg>
        <span>PetStore 智能助手</span>
      </div>
      <button class="ai-chat__close" @click="closeChat">X</button>
    </div>

    <div ref="messagesContainer" class="ai-chat__messages">
      <ChatMessage
        v-for="msg in messages"
        :key="msg.id"
        :content="msg.content"
        :sender="msg.sender"
        :recommend-products="msg.recommendProducts || []"
        :typing="loading && msg.sender === 'ai' && msg.id === messages[messages.length - 1]?.id"
        @view-product="handleViewProduct"
        @add-to-cart="handleAddToCart"
      />

      <!-- Loading dots -->
      <div v-if="loading" class="chat-message chat-message--ai">
        <div class="chat-message__avatar-placeholder"></div>
        <div class="chat-loading">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- Quick questions -->
    <div v-if="messages.length <= 1" class="ai-chat__quick">
      <button
        v-for="q in quickQuestions"
        :key="q.text"
        class="quick-btn"
        :class="{ 'quick-btn--nav': q.action === 'navigate' }"
        @click="handleQuickQuestion(q)"
      >
        {{ q.text }}
      </button>
    </div>

    <div class="ai-chat__input-area">
      <div class="ai-chat__input-wrapper">
        <input
          v-model="inputMessage"
          class="ai-chat__input"
          placeholder="输入消息..."
          :disabled="loading"
          @keydown="handleKeydown"
        />
        <button
          class="ai-chat__send"
          :disabled="!inputMessage.trim() || loading"
          @click="sendMessage"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Floating Button */
.ai-fab {
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
  color: #fff;
}

.ai-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(28, 73, 194, 0.5);
}

/* Chat Window */
.ai-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 400px;
  height: 560px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
}

.ai-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #1c49c2;
  color: #fff;
}

.ai-chat__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.ai-chat__close {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.ai-chat__close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.ai-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.ai-chat__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 20px 12px;
  background: #f8f9fa;
}

.quick-btn {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  font-size: 12px;
  color: #1c49c2;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #f0f6ff;
  border-color: #1c49c2;
}

.quick-btn--nav {
  background: #f0f6ff;
  border-color: #1c49c2;
  color: #fff;
  background: #1c49c2;
}

.quick-btn--nav:hover {
  background: #163da0;
  border-color: #163da0;
}

.ai-chat__input-area {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.ai-chat__input-wrapper {
  display: flex;
  gap: 12px;
}

.ai-chat__input {
  flex: 1;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 22px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.ai-chat__input:focus {
  border-color: #1c49c2;
}

.ai-chat__send {
  width: 44px;
  height: 44px;
  background: #1c49c2;
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.ai-chat__send:hover:not(:disabled) {
  background: #163da0;
}

.ai-chat__send:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Loading animation */
.chat-loading {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.chat-loading span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.chat-loading span:nth-child(1) { animation-delay: -0.32s; }
.chat-loading span:nth-child(2) { animation-delay: -0.16s; }

.chat-message__avatar-placeholder {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@media (max-width: 480px) {
  .ai-chat {
    width: calc(100% - 32px);
    right: 16px;
    bottom: 16px;
    height: calc(100% - 100px);
  }
}
</style>
