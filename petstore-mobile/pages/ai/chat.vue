<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="header__left" @tap="goBack">
        <text class="header__back"><</text>
      </view>
      <view class="header__center">
        <image class="header__avatar" src="/static/icons/robot.png" mode="aspectFit" />
        <text class="header__title">PetStore 智能助手</text>
      </view>
      <view class="header__right"></view>
    </view>

    <!-- Messages -->
    <view
      class="messages"
      ref="messagesRef"
      @scroll="onMessagesScroll"
    >
      <view v-for="msg in messages" :key="msg.id" :id="'msg-' + msg.id" class="msg-row">
        <!-- AI Message -->
        <view v-if="msg.sender === 'ai'" class="msg msg--ai">
          <image class="msg__avatar msg__avatar--ai" src="/static/icons/robot.png" mode="aspectFit" />
          <view class="msg__body">
            <view class="msg__bubble msg__bubble--ai">
              <text class="msg__text">{{ msg.displayContent || msg.content }}</text>
            </view>
            <!-- Recommend Products -->
            <view v-if="msg.recommendProducts && msg.recommendProducts.length > 0" class="msg__recommend">
              <text class="msg__recommend-title">推荐商品</text>
              <view
                v-for="product in msg.recommendProducts"
                :key="product.id"
                class="recommend-card"
              >
                <view class="recommend-card__icon">
                  <text class="recommend-card__letter">{{ product.name.charAt(0) }}</text>
                </view>
                <view class="recommend-card__info">
                  <text class="recommend-card__name">{{ product.name }}</text>
                  <text class="recommend-card__price">¥{{ product.price }}</text>
                </view>
                <view class="recommend-card__actions">
                  <view class="recommend-btn recommend-btn--view" @tap="viewProduct(product.id)">
                    <text class="recommend-btn__text">详情</text>
                  </view>
                  <view class="recommend-btn recommend-btn--add" @tap="addToCart(product)">
                    <text class="recommend-btn__text recommend-btn__text--white">加购</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- User Message -->
        <view v-else class="msg msg--user">
          <view class="msg__body">
            <view class="msg__bubble msg__bubble--user">
              <text class="msg__text msg__text--user">{{ msg.content }}</text>
            </view>
          </view>
          <image class="msg__avatar msg__avatar--user" src="/static/icons/user.png" mode="aspectFit" />
        </view>
      </view>

      <!-- Loading dots -->
      <view v-if="loading" class="msg msg--ai">
        <image class="msg__avatar msg__avatar--ai" src="/static/icons/robot.png" mode="aspectFit" />
        <view class="msg__bubble msg__bubble--ai msg__bubble--loading">
          <view class="loading-dots">
            <view class="loading-dot"></view>
            <view class="loading-dot"></view>
            <view class="loading-dot"></view>
          </view>
        </view>
      </view>

      <view id="msg-bottom" style="height: 1rpx;"></view>
    </view>

    <!-- Quick Questions -->
    <view v-if="messages.length <= 1" class="quick-bar">
      <view
        v-for="q in quickQuestions"
        :key="q"
        class="quick-chip"
        @tap="sendQuick(q)"
      >
        <text class="quick-chip__text">{{ q }}</text>
      </view>
    </view>

    <!-- Input Bar -->
    <view class="input-bar">
      <input
        class="input-bar__field"
        v-model="inputText"
        placeholder="输入消息..."
        :disabled="loading"
        confirm-type="send"
        @confirm="send"
      />
      <view
        class="input-bar__send"
        :class="{ 'input-bar__send--disabled': !inputText.trim() || loading }"
        @tap="send"
      >
        <text class="input-bar__send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { getAIReply, getWelcomeMessage } from '@/services/ai'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const messages = ref([])
const inputText = ref('')
const loading = ref(false)
const scrollTarget = ref('')
const hasWelcome = ref(false)

const quickQuestions = [
  '狗狗吃什么粮食好？',
  '猫咪玩具推荐',
  '如何给宠物洗澡？',
]

const messagesRef = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    const el = messagesRef.value?.$el || messagesRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

const send = async () => {
  const content = inputText.value.trim()
  if (!content || loading.value) return

  messages.value.push({
    id: Date.now(),
    content,
    sender: 'user',
    timestamp: new Date(),
  })

  inputText.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const reply = await getAIReply(content)
    messages.value.push(reply)

    // Typewriter effect for AI reply
    const msg = messages.value[messages.value.length - 1]
    if (msg.sender === 'ai') {
      const fullText = msg.content
      msg.displayContent = ''
      let idx = 0
      const timer = setInterval(() => {
        if (idx < fullText.length) {
          msg.displayContent += fullText[idx]
          idx++
        } else {
          clearInterval(timer)
        }
      }, 30)
    }
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const sendQuick = (q) => {
  inputText.value = q
  send()
}

const viewProduct = (id) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

const addToCart = (product) => {
  cartStore.addItem(product, 1, '标准款')
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

const goBack = () => {
  uni.navigateBack()
}

// Show welcome message on load
if (!hasWelcome.value) {
  messages.value.push(getWelcomeMessage())
  hasWelcome.value = true
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 20rpx;
  background: linear-gradient(135deg, #1c49c2, #2558d6);
  flex-shrink: 0;
  z-index: 10;
}
.header__left, .header__right {
  width: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header__back {
  font-size: 36rpx;
  color: #fff;
  font-weight: 600;
}
.header__center {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.header__avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  overflow: hidden;
}
.header__avatar-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}
.header__title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

/* Messages */
.messages {
  flex: 1;
  height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20rpx 20rpx;
}

/* Message row */
.msg-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 28rpx;
}
.msg {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
}
.msg--user {
  margin-left: auto;
}

.msg__avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.msg__avatar--ai {
  background: #1c49c2;
}
.msg__avatar--user {
  background: #ff6c10;
}
.msg__avatar-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}

/* Body */
.msg__body {
  max-width: 72%;
}
.msg--user .msg__body {
  max-width: none;
}

/* Bubble */
.msg__bubble {
  padding: 20rpx 24rpx;
  border-radius: 20rpx;
  word-break: break-all;
}
.msg__bubble--ai {
  background: #fff;
  border-radius: 4rpx 20rpx 20rpx 20rpx;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.msg__bubble--user {
  background: #1c49c2;
  border-radius: 20rpx 4rpx 20rpx 20rpx;
}
.msg__bubble--loading {
  padding: 20rpx 28rpx;
}
.msg__text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.7;
  white-space: pre-wrap;
}
.msg__text--user {
  color: #fff;
}

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 10rpx;
  align-items: center;
  height: 32rpx;
}
.loading-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ccc;
  animation: dotBounce 1.4s infinite ease-in-out;
}
.loading-dot:nth-child(2) { animation-delay: 0.16s; }
.loading-dot:nth-child(3) { animation-delay: 0.32s; }
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Recommend */
.msg__recommend {
  margin-top: 16rpx;
}
.msg__recommend-title {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 12rpx;
}
.recommend-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
}
.recommend-card__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.recommend-card__letter {
  font-size: 28rpx;
  font-weight: 700;
  color: #1c49c2;
}
.recommend-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.recommend-card__name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}
.recommend-card__price {
  font-size: 26rpx;
  font-weight: 700;
  color: #bd2848;
}
.recommend-card__actions {
  display: flex;
  gap: 8rpx;
  flex-shrink: 0;
}
.recommend-btn {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}
.recommend-btn--view {
  background: #fff;
  border: 1rpx solid #ddd;
}
.recommend-btn--add {
  background: #ff6c10;
}
.recommend-btn__text {
  font-size: 22rpx;
  color: #333;
  font-weight: 500;
}
.recommend-btn__text--white {
  color: #fff;
}

/* Quick questions */
.quick-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  padding: 12rpx 24rpx 16rpx;
}
.quick-chip {
  padding: 14rpx 24rpx;
  background: #fff;
  border: 1rpx solid #e8e8e8;
  border-radius: 32rpx;
}
.quick-chip__text {
  font-size: 24rpx;
  color: #1c49c2;
  font-weight: 500;
}

/* Input bar */
.input-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  flex-shrink: 0;
}
.input-bar__field {
  flex: 1;
  height: 76rpx;
  background: #f5f6f8;
  border-radius: 38rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
}
.input-bar__send {
  width: 120rpx;
  height: 76rpx;
  background: #1c49c2;
  border-radius: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.input-bar__send--disabled {
  background: #ccc;
}
.input-bar__send-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}
</style>
