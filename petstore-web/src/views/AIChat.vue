<template>
  <AppLayout>
    <div class="chat-container">
      <div class="chat-header">
        <h2>🤖 AI 宠物助手</h2>
        <p>有任何关于宠物的问题，随时问我！</p>
      </div>
      <div class="chat-messages" ref="msgContainer">
        <div v-if="messages.length === 0" class="chat-empty">
          <p>👋 你好！我是宠物商店AI助手。</p>
          <p>你可以问我：</p>
          <ul>
            <li>"新手适合养什么宠物？"</li>
            <li>"猫咪日常护理需要注意什么？"</li>
            <li>"如何挑选健康的狗狗？"</li>
          </ul>
        </div>
        <div v-for="(msg, i) in messages" :key="i" :class="['msg-item', msg.role]">
          <div class="msg-avatar">{{ msg.role === 'user' ? '🙋' : '🤖' }}</div>
          <div class="msg-content">{{ msg.content }}</div>
        </div>
        <div v-if="loading" class="msg-item assistant">
          <div class="msg-avatar">🤖</div>
          <div class="msg-content typing">正在思考中...</div>
        </div>
      </div>
      <div class="chat-input">
        <el-input
          v-model="input"
          placeholder="输入你的问题，按 Enter 发送..."
          @keyup.enter="send"
          :disabled="loading"
          size="large"
        >
          <template #append>
            <el-button @click="send" :disabled="loading" :icon="'Promotion'">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { chat } from '@/api/ai'
import AppLayout from '@/components/AppLayout.vue'

const messages = ref([])
const input = ref('')
const loading = ref(false)
const msgContainer = ref(null)

watch(messages, async () => {
  await nextTick()
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
}, { deep: true })

async function send() {
  if (!input.value.trim() || loading.value) return
  const question = input.value.trim()
  messages.value.push({ role: 'user', content: question })
  input.value = ''
  loading.value = true
  try {
    const res = await chat(question)
    messages.value.push({ role: 'assistant', content: res.data || '抱歉，暂时无法回复。' })
  } catch (e) {
    messages.value.push({ role: 'assistant', content: '抱歉，AI服务暂时不可用。请确保后端已配置AI API Key。' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}
.chat-header {
  text-align: center;
  padding: 16px 0;
  margin-bottom: 16px;
}
.chat-header h2 { font-size: 24px; color: #333; }
.chat-header p { color: #999; margin-top: 4px; }
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-bottom: 16px;
}
.chat-empty { text-align: center; color: #999; padding: 40px; }
.chat-empty ul { text-align: left; display: inline-block; margin-top: 12px; }
.chat-empty li { margin: 4px 0; color: #667eea; cursor: pointer; }
.msg-item { display: flex; gap: 12px; margin-bottom: 16px; }
.msg-item.user { flex-direction: row-reverse; }
.msg-avatar { width: 36px; height: 36px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.msg-content { max-width: 70%; padding: 12px 16px; border-radius: 12px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
.msg-item.user .msg-content { background: #667eea; color: #fff; border-bottom-right-radius: 4px; }
.msg-item.assistant .msg-content { background: #f0f2f5; color: #333; border-bottom-left-radius: 4px; }
.typing { color: #999; font-style: italic; }
.chat-input { flex-shrink: 0; }
</style>