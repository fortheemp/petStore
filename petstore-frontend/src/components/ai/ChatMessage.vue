<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  content: { type: String, default: '' },
  sender: { type: String, default: 'ai' },
  typing: { type: Boolean, default: false },
  recommendProducts: { type: Array, default: () => [] },
})

const emit = defineEmits(['viewProduct', 'addToCart'])

const displayContent = ref('')

watch(
  () => props.content,
  (newContent) => {
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
      }, 30)
    } else {
      displayContent.value = newContent
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="chat-message" :class="sender === 'user' ? 'chat-message--user' : 'chat-message--ai'">
    <div v-if="sender === 'ai'" class="chat-message__avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
        <path d="M8 14v.5M16 14v.5"/>
        <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
      </svg>
    </div>
    <div class="chat-message__content">
      <div class="chat-message__bubble">{{ displayContent }}</div>
      <div v-if="sender === 'ai' && recommendProducts.length > 0" class="chat-message__recommend">
        <div class="recommend-title">推荐商品</div>
        <div
          v-for="product in recommendProducts"
          :key="product.id"
          class="recommend-item"
        >
          <div class="recommend-item__placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </div>
          <div class="recommend-item__info">
            <span class="recommend-item__name">{{ product.name }}</span>
            <span class="recommend-item__price">¥{{ product.price }}</span>
          </div>
          <div class="recommend-item__actions">
            <button class="btn btn-view" @click="emit('viewProduct', product.id)">查看详情</button>
            <button class="btn btn-add" @click="emit('addToCart', product)">加入购物车</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message--user .chat-message__bubble {
  background: #1c49c2;
  color: #fff;
  border-radius: 12px 12px 0 12px;
}

.chat-message--ai .chat-message__bubble {
  background: #fff;
  color: #333;
  border-radius: 12px 12px 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chat-message__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1c49c2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.chat-message__content {
  max-width: 75%;
}

.chat-message__bubble {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.chat-message__recommend {
  margin-top: 12px;
}

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
}

.recommend-item__placeholder {
  width: 48px;
  height: 48px;
  background: #e8e8e8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recommend-item__info {
  flex: 1;
}

.recommend-item__name {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.recommend-item__price {
  font-size: 16px;
  font-weight: 600;
  color: #bd2848;
}

.recommend-item__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
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
}

.btn-view:hover {
  border-color: #1c49c2;
  color: #1c49c2;
}

.btn-add {
  background: #ff6c10;
  color: #fff;
  border: none;
}

.btn-add:hover {
  background: #e55a00;
}
</style>
