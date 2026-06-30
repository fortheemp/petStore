import { post } from '@/api/request'
import { getProducts, getProductById } from '@/api/product'

let _cachedProducts = null

async function loadProducts() {
  if (!_cachedProducts) {
    const res = await getProducts({ pageSize: 100 })
    _cachedProducts = res?.list || []
  }
  return _cachedProducts
}

export async function getAIReply(userMessage) {
  try {
    const raw = await post('/ai/chat', { question: userMessage })
    const content = raw || '暂时无法回答，请稍后再试。'

    let cleanContent = content
    let recommendProducts = []

    const match = content.match(/【推荐[:：](\d[\d,]*)】/)
    if (match) {
      const ids = match[1].split(',').map(Number)
      cleanContent = content.replace(/\n?【推荐[:：][\d,]*】/, '').trim()
      const allProducts = await loadProducts()
      recommendProducts = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean).slice(0, 3)
    }

    return {
      id: Date.now(),
      content: cleanContent,
      sender: 'ai',
      timestamp: new Date(),
      recommendProducts,
    }
  } catch {
    return {
      id: Date.now(),
      content: 'AI服务暂时不可用，请稍后再试。',
      sender: 'ai',
      timestamp: new Date(),
      recommendProducts: [],
    }
  }
}

export function getWelcomeMessage() {
  return {
    id: Date.now(),
    content:
      '你好！我是PetStore智能助手，可以为你提供：\n\n- 宠物喂养知识\n- 商品推荐\n- 订单咨询\n- 附近商店\n\n请问有什么可以帮你的？',
    sender: 'ai',
    timestamp: new Date(),
  }
}
