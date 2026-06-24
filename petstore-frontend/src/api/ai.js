const mockProducts = [
  { id: 1, name: '皇家小型犬成犬粮', price: 159, category: 'dog-food' },
  { id: 2, name: '渴望六种鱼犬粮', price: 289, category: 'dog-food' },
  { id: 3, name: '纽翠斯黑钻系列', price: 245, category: 'dog-food' },
  { id: 4, name: '皇家幼猫猫粮', price: 139, category: 'cat-food' },
  { id: 5, name: '渴望六种鱼猫粮', price: 269, category: 'cat-food' },
  { id: 6, name: '宠物沐浴露', price: 39, category: 'supplies' },
  { id: 7, name: '逗猫棒', price: 19, category: 'toys' },
  { id: 8, name: '狗狗牵引绳', price: 49, category: 'supplies' },
]

const rules = [
  {
    keywords: ['狗粮', '狗狗吃什么', '狗粮食', '狗粮推荐'],
    reply: '狗狗的粮食选择很重要，要根据年龄、体型来选择。以下是几款口碑很好的狗粮：',
    products: [1, 2, 3],
  },
  {
    keywords: ['猫粮', '猫咪吃什么', '猫粮食', '猫粮推荐'],
    reply: '猫咪的粮食推荐以下几款，都是知名品牌：',
    products: [4, 5],
  },
  {
    keywords: ['洗澡', '沐浴', '清洁'],
    reply: '给宠物洗澡建议使用专用的宠物沐浴露，人用的沐浴露可能会伤害宠物皮肤。推荐这款：',
    products: [6],
  },
  {
    keywords: ['玩具', '逗猫', '互动'],
    reply: '给猫咪买玩具推荐逗猫棒，可以增进感情，让猫咪多运动：',
    products: [7],
  },
  {
    keywords: ['牵引', '遛狗', '出门'],
    reply: '遛狗必备牵引绳，保护狗狗安全，推荐这款：',
    products: [8],
  },
  {
    keywords: ['订单', '物流', '快递', '发货'],
    reply: '关于订单和物流的问题，您可以：\n\n1. 登录后在「我的订单」查看物流信息\n2. 联系客服：400-888-8888\n3. 发送订单号给我，我帮您查询\n\n请问您还有什么问题吗？',
  },
  {
    keywords: ['你好', '在吗', '有人吗', '客服'],
    reply: '你好！我是PetStore智能助手，可以为你提供：\n\n- 宠物喂养知识\n- 商品推荐\n- 订单咨询\n\n请问有什么可以帮你的？',
  },
  {
    keywords: ['谢谢', '感谢', '多谢'],
    reply: '不客气！如果还有其他问题，随时可以问我哦~ 祝你和你的宠物都开心！',
  },
]

const defaultReply = '抱歉，我没有完全理解你的问题。你可以尝试问我：\n\n- 狗狗/猫咪吃什么粮食好？\n- 有什么宠物玩具推荐？\n- 如何给宠物洗澡？\n- 订单物流问题\n\n或者直接联系人工客服：400-888-8888'

export function getAIReply(userMessage) {
  return new Promise((resolve) => {
    const delay = 500 + Math.random() * 1000
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase()
      let reply = defaultReply
      let recommendProducts = []

      for (const rule of rules) {
        if (rule.keywords.some((kw) => lowerMessage.includes(kw))) {
          reply = rule.reply
          recommendProducts = rule.products
            .map((id) => mockProducts.find((p) => p.id === id))
            .filter(Boolean)
          break
        }
      }

      resolve({
        id: Date.now(),
        content: reply,
        sender: 'ai',
        timestamp: new Date(),
        recommendProducts,
      })
    }, delay)
  })
}

export function getWelcomeMessage() {
  return {
    id: Date.now(),
    content:
      '你好！我是PetStore智能助手，可以为你提供：\n\n- 宠物喂养知识\n- 商品推荐\n- 订单咨询\n\n请问有什么可以帮你的？',
    sender: 'ai',
    timestamp: new Date(),
  }
}
