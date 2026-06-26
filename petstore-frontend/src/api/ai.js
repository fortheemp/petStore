import { getProducts } from '@/api/product'

let _cachedProducts = null

async function loadProducts() {
  if (!_cachedProducts) {
    const res = await getProducts({ pageSize: 100 })
    _cachedProducts = res?.list || []
  }
  return _cachedProducts
}

function matchProducts(products, keywords) {
  return products.filter((p) => {
    const text = (p.name + ' ' + (p.category || '')).toLowerCase()
    return keywords.some((kw) => text.includes(kw))
  }).slice(0, 3)
}

const rules = [
  {
    keywords: ['狗粮', '狗狗吃什么', '狗粮食', '狗粮推荐'],
    reply: '狗狗的粮食选择很重要，要根据年龄、体型来选择。以下是店里几款口碑不错的：',
    matchKeywords: ['粮', '狗'],
  },
  {
    keywords: ['猫粮', '猫咪吃什么', '猫粮食', '猫粮推荐'],
    reply: '猫咪的粮食推荐以下几款，都是知名品牌：',
    matchKeywords: ['粮', '猫'],
  },
  {
    keywords: ['洗澡', '沐浴', '清洁'],
    reply: '给宠物洗澡建议使用专用的宠物沐浴露，人用的可能会伤害宠物皮肤。店里有这些清洁用品：',
    matchKeywords: ['沐浴', '清洁', '洗'],
  },
  {
    keywords: ['玩具', '逗猫', '互动'],
    reply: '给宠物买玩具可以增进感情，让它们多运动：',
    matchKeywords: ['玩具', '逗'],
  },
  {
    keywords: ['牵引', '遛狗', '出门'],
    reply: '遛狗必备牵引绳，保护狗狗安全：',
    matchKeywords: ['牵引', '绳'],
  },
  {
    keywords: ['猫砂', '猫厕所'],
    reply: '猫砂是养猫必备用品，推荐这几款：',
    matchKeywords: ['猫砂'],
  },
  {
    keywords: ['水族', '鱼缸', '养鱼'],
    reply: '水族用品推荐：',
    matchKeywords: ['鱼', '水族', '鱼缸'],
  },
  {
    keywords: ['鸟', '鹦鹉', '鸟笼'],
    reply: '鸟类用品推荐：',
    matchKeywords: ['鸟', '鹦鹉'],
  },
  {
    keywords: ['订单', '物流', '快递', '发货'],
    reply: '关于订单和物流的问题，您可以：\n\n1. 点击下方快捷入口查看「我的订单」\n2. 联系客服：400-888-8888\n\n请问还有什么可以帮你的？',
  },
  {
    keywords: ['附近', '商店', '店铺', '门店'],
    reply: '我们有多个线下门店，点击下方快捷入口可以查看附近宠物商店：',
  },
  {
    keywords: ['你好', '在吗', '有人吗', '客服'],
    reply: '你好！我是PetStore智能助手，可以为你提供：\n\n- 宠物喂养知识\n- 商品推荐\n- 订单咨询\n- 附近商店\n\n请问有什么可以帮你的？',
  },
  {
    keywords: ['谢谢', '感谢', '多谢'],
    reply: '不客气！如果还有其他问题，随时可以问我哦~ 祝你和你的宠物都开心！',
  },
]

const defaultReply = '抱歉，我没有完全理解你的问题。你可以尝试问我：\n\n- 狗狗/猫咪吃什么粮食好？\n- 有什么宠物玩具推荐？\n- 如何给宠物洗澡？\n- 订单物流问题\n- 附近宠物商店\n\n或者直接联系人工客服：400-888-8888'

export async function getAIReply(userMessage) {
  const products = await loadProducts()
  const lowerMessage = userMessage.toLowerCase()
  let reply = defaultReply
  let recommendProducts = []

  for (const rule of rules) {
    if (rule.keywords.some((kw) => lowerMessage.includes(kw))) {
      reply = rule.reply
      if (rule.matchKeywords) {
        recommendProducts = matchProducts(products, rule.matchKeywords)
      }
      break
    }
  }

  return {
    id: Date.now(),
    content: reply,
    sender: 'ai',
    timestamp: new Date(),
    recommendProducts,
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
