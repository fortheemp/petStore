// 商品大类映射（宠物 vs 宠物周边）
export const productTypeMap = {
  pet: { label: '宠物' },
  supply: { label: '宠物周边' },
}

// 商品分类映射（按动物类型细分）
export const categoryMap = {
  dogs: { label: '狗狗' },
  cats: { label: '猫咪' },
  fish: { label: '水族' },
  birds: { label: '鸟类' },
  small: { label: '小宠' },
}

// Mock 商品数据
// productType: 'pet'=活体宠物(唯一，库存1), 'supply'=宠物周边(库存不限)
const mockProducts = [
  {
    id: 1,
    name: '皇家小型犬成犬粮 2kg',
    image: '',
    price: 159.00,
    originalPrice: 199.00,
    rating: 4.8,
    reviewCount: 2341,
    shopId: 1,
    shopName: '皇家宠物旗舰店',
    fastDelivery: true,
    category: 'dogs',
    productType: 'supply',
    stock: 200,
  },
  {
    id: 2,
    name: '渴望六种鱼猫粮 5.4kg',
    image: '',
    price: 428.00,
    originalPrice: 528.00,
    rating: 4.9,
    reviewCount: 1892,
    shopId: 2,
    shopName: '渴望官方旗舰店',
    fastDelivery: true,
    category: 'cats',
    productType: 'supply',
    stock: 150,
  },
  {
    id: 3,
    name: '小型犬磨牙棒玩具套装',
    image: '',
    price: 39.90,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 567,
    shopId: 3,
    shopName: '爱宠生活馆',
    fastDelivery: false,
    category: 'dogs',
    productType: 'supply',
    stock: 300,
  },
  {
    id: 4,
    name: '猫抓板瓦楞纸耐磨款',
    image: '',
    price: 29.90,
    originalPrice: 49.90,
    rating: 4.6,
    reviewCount: 3201,
    shopId: 5,
    shopName: '喵星人用品店',
    fastDelivery: true,
    category: 'cats',
    productType: 'supply',
    stock: 500,
  },
  {
    id: 5,
    name: '森森鱼缸超白玻璃 40cm',
    image: '',
    price: 258.00,
    originalPrice: 328.00,
    rating: 4.7,
    reviewCount: 421,
    shopId: 6,
    shopName: '森森水族旗舰店',
    fastDelivery: true,
    category: 'fish',
    productType: 'supply',
    stock: 80,
  },
  {
    id: 6,
    name: '鹦鹉混合鸟粮 1kg',
    image: '',
    price: 25.80,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 189,
    shopId: 7,
    shopName: '鸟语花香',
    fastDelivery: false,
    category: 'birds',
    productType: 'supply',
    stock: 400,
  },
  {
    id: 7,
    name: '仓鼠笼子亚克力透明别墅',
    image: '',
    price: 89.00,
    originalPrice: 129.00,
    rating: 4.4,
    reviewCount: 734,
    shopId: 8,
    shopName: '小宠之家',
    fastDelivery: true,
    category: 'small',
    productType: 'supply',
    stock: 120,
  },
  {
    id: 8,
    name: '比瑞吉天然成犬粮 10kg',
    image: '',
    price: 299.00,
    originalPrice: 399.00,
    rating: 4.6,
    reviewCount: 1567,
    shopId: 1,
    shopName: '皇家宠物旗舰店',
    fastDelivery: true,
    category: 'dogs',
    productType: 'supply',
    stock: 100,
  },
  {
    id: 9,
    name: '猫咪自动饮水机 静音循环',
    image: '',
    price: 79.00,
    originalPrice: 119.00,
    rating: 4.7,
    reviewCount: 2103,
    shopId: 5,
    shopName: '喵星人用品店',
    fastDelivery: true,
    category: 'cats',
    productType: 'supply',
    stock: 250,
  },
  {
    id: 10,
    name: '热带鱼饲料增色缓沉型 500g',
    image: '',
    price: 35.00,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 298,
    shopId: 6,
    shopName: '森森水族旗舰店',
    fastDelivery: false,
    category: 'fish',
    productType: 'supply',
    stock: 350,
  },
  {
    id: 11,
    name: '狗狗牵引绳伸缩可调节 5m',
    image: '',
    price: 45.00,
    originalPrice: 68.00,
    rating: 4.4,
    reviewCount: 892,
    shopId: 3,
    shopName: '爱宠生活馆',
    fastDelivery: true,
    category: 'dogs',
    productType: 'supply',
    stock: 180,
  },
  {
    id: 12,
    name: '猫砂豆腐砂活性炭 6L',
    image: '',
    price: 29.90,
    originalPrice: 39.90,
    rating: 4.8,
    reviewCount: 5672,
    shopId: 5,
    shopName: '喵星人用品店',
    fastDelivery: true,
    category: 'cats',
    productType: 'supply',
    stock: 800,
  },
  {
    id: 13,
    name: '龙鱼专用饲料增色型 200g',
    image: '',
    price: 58.00,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 156,
    shopId: 6,
    shopName: '森森水族旗舰店',
    fastDelivery: false,
    category: 'fish',
    productType: 'supply',
    stock: 200,
  },
  {
    id: 14,
    name: '画眉鸟饲料精品配方 500g',
    image: '',
    price: 32.00,
    originalPrice: 45.00,
    rating: 4.2,
    reviewCount: 87,
    shopId: 7,
    shopName: '鸟语花香',
    fastDelivery: false,
    category: 'birds',
    productType: 'supply',
    stock: 250,
  },
  {
    id: 15,
    name: '兔子磨牙草饼天然提摩西',
    image: '',
    price: 18.90,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 423,
    shopId: 8,
    shopName: '小宠之家',
    fastDelivery: true,
    category: 'small',
    productType: 'supply',
    stock: 300,
  },
  {
    id: 16,
    name: '中大型犬关节营养膏 120g',
    image: '',
    price: 89.00,
    originalPrice: 128.00,
    rating: 4.7,
    reviewCount: 634,
    shopId: 1,
    shopName: '皇家宠物旗舰店',
    fastDelivery: true,
    category: 'dogs',
    productType: 'supply',
    stock: 160,
  },
  {
    id: 17,
    name: '猫咪冻干零食鸡肉粒 500g',
    image: '',
    price: 68.00,
    originalPrice: 88.00,
    rating: 4.8,
    reviewCount: 3456,
    shopId: 2,
    shopName: '渴望官方旗舰店',
    fastDelivery: true,
    category: 'cats',
    productType: 'supply',
    stock: 400,
  },
  {
    id: 18,
    name: '水族箱LED灯全光谱防水',
    image: '',
    price: 128.00,
    originalPrice: 168.00,
    rating: 4.5,
    reviewCount: 234,
    shopId: 6,
    shopName: '森森水族旗舰店',
    fastDelivery: true,
    category: 'fish',
    productType: 'supply',
    stock: 90,
  },
  {
    id: 19,
    name: '金丝雀繁殖箱木质鸟窝',
    image: '',
    price: 22.00,
    originalPrice: null,
    rating: 4.1,
    reviewCount: 56,
    shopId: 7,
    shopName: '鸟语花香',
    fastDelivery: false,
    category: 'birds',
    productType: 'supply',
    stock: 150,
  },
  {
    id: 20,
    name: '龙猫专用浴沙 2kg',
    image: '',
    price: 28.00,
    originalPrice: 38.00,
    rating: 4.6,
    reviewCount: 312,
    shopId: 8,
    shopName: '小宠之家',
    fastDelivery: true,
    category: 'small',
    productType: 'supply',
    stock: 220,
  },
  {
    id: 21,
    name: '英短蓝猫幼猫 3月龄 已疫苗',
    image: '',
    price: 1200.00,
    originalPrice: 1500.00,
    rating: 4.9,
    reviewCount: 42,
    shopId: 3,
    shopName: '爱宠生活馆',
    fastDelivery: false,
    category: 'cats',
    productType: 'pet',
    stock: 1,
  },
  {
    id: 22,
    name: '柯基犬幼犬 2月龄 已驱虫',
    image: '',
    price: 2800.00,
    originalPrice: 3500.00,
    rating: 4.8,
    reviewCount: 28,
    shopId: 4,
    shopName: '萌宠乐园',
    fastDelivery: false,
    category: 'dogs',
    productType: 'pet',
    stock: 1,
  },
  {
    id: 23,
    name: '布偶猫成猫 甜美的蓝眼睛',
    image: '',
    price: 5500.00,
    originalPrice: 6800.00,
    rating: 4.9,
    reviewCount: 15,
    shopId: 4,
    shopName: '萌宠乐园',
    fastDelivery: false,
    category: 'cats',
    productType: 'pet',
    stock: 1,
  },
  {
    id: 24,
    name: '金毛寻回犬幼犬 专业犬舍',
    image: '',
    price: 3200.00,
    originalPrice: 4000.00,
    rating: 4.7,
    reviewCount: 33,
    shopId: 4,
    shopName: '萌宠乐园',
    fastDelivery: false,
    category: 'dogs',
    productType: 'pet',
    stock: 1,
  },
  {
    id: 25,
    name: '荷兰猪幼崽 一对装',
    image: '',
    price: 60.00,
    originalPrice: 80.00,
    rating: 4.5,
    reviewCount: 89,
    shopId: 8,
    shopName: '小宠之家',
    fastDelivery: false,
    category: 'small',
    productType: 'pet',
    stock: 1,
  },
]

/**
 * 获取商品列表（Mock 实现）
 * @param {Object} params
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.category - 分类筛选
 * @param {string} params.sort - 排序方式: default | price-asc | price-desc | rating
 */
export function getProducts(params = {}) {
  const {
    page = 1,
    pageSize = 12,
    category = '',
    productType = '',
    shopId = '',
    keyword = '',
    sort = 'default',
  } = params

  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockProducts]

      // 关键词搜索
      if (keyword) {
        const kw = keyword.toLowerCase()
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw))
      }

      // 大类筛选（宠物 / 宠物周边）
      if (productType) {
        filtered = filtered.filter((p) => p.productType === productType)
      }

      // 分类筛选（动物类型）
      if (category) {
        filtered = filtered.filter((p) => p.category === category)
      }

      // 商店筛选
      if (shopId) {
        filtered = filtered.filter((p) => p.shopId === Number(shopId))
      }

      // 排序
      switch (sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        default:
          // 综合排序：按评分 × 评价数加权
          filtered.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      }

      const total = filtered.length
      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)

      resolve({ list, total, page, pageSize })
    }, 300)
  })
}

// 商品详情扩展数据（按 id 索引）
const mockProductDetails = {
  1: {
    images: ['', '', '', ''],
    stock: 50,
    specs: [
      {
        id: 1,
        name: '规格',
        options: [
          { id: 101, name: '1kg 试吃装', value: '1kg', available: true, additionalPrice: 0 },
          { id: 102, name: '2kg 标准装', value: '2kg', available: true, additionalPrice: 40 },
          { id: 103, name: '8kg 家庭装', value: '8kg', available: true, additionalPrice: 200 },
        ],
      },
    ],
    description: `
      <h3>产品特点</h3>
      <ul>
        <li>专为小型犬设计，颗粒小巧易咀嚼</li>
        <li>优质动物蛋白，满足日常营养需求</li>
        <li>添加益生元，呵护肠道健康</li>
        <li>科学钙磷比，支持骨骼发育</li>
      </ul>
      <h3>适用对象</h3>
      <p>适用于成年小型犬（体重 1-10kg），建议每日喂食量参考包装背面喂食指南。</p>
    `,
    specsTable: [
      { label: '品牌', value: '皇家 Royal Canin' },
      { label: '产地', value: '法国' },
      { label: '适用犬种', value: '小型犬' },
      { label: '适用年龄', value: '成犬' },
      { label: '保质期', value: '18 个月' },
      { label: '储存方式', value: '阴凉干燥处密封保存' },
      { label: '主要原料', value: '脱水禽肉、大米、动物脂肪' },
    ],
    reviews: [
      { id: 1, username: '爱狗人士', rating: 5, content: '家里泰迪吃了三年了，毛色一直很好，便便也很正常。', createTime: '2025-12-15' },
      { id: 2, username: '宠物达人', rating: 5, content: '皇家品质一直很稳定，回购很多次了，小包装很适合小型犬。', createTime: '2025-11-20' },
      { id: 3, username: '柯基妈妈', rating: 4, content: '颗粒大小合适，狗狗挺爱吃的，就是价格稍贵。', createTime: '2025-10-08' },
    ],
    relatedIds: [8, 11, 16, 3],
  },
  2: {
    images: ['', '', '', ''],
    stock: 30,
    specs: [
      {
        id: 2,
        name: '规格',
        options: [
          { id: 201, name: '1.8kg 试吃装', value: '1.8kg', available: true, additionalPrice: 0 },
          { id: 202, name: '5.4kg 标准装', value: '5.4kg', available: true, additionalPrice: 250 },
        ],
      },
    ],
    description: `
      <h3>产品特点</h3>
      <ul>
        <li>六种深海鱼配方，高蛋白低碳水</li>
        <li>无谷物配方，降低过敏风险</li>
        <li>添加冻干颗粒，适口性更佳</li>
        <li>富含 Omega-3/6，美毛护肤</li>
      </ul>
    `,
    specsTable: [
      { label: '品牌', value: '渴望 Orijen' },
      { label: '产地', value: '加拿大' },
      { label: '适用对象', value: '全猫种成猫' },
      { label: '保质期', value: '18 个月' },
      { label: '主要原料', value: '新鲜鲱鱼、沙丁鱼、鲭鱼' },
    ],
    reviews: [
      { id: 4, username: '猫奴一号', rating: 5, content: '渴望的品质不用多说，猫咪吃得毛发油亮。', createTime: '2025-12-01' },
      { id: 5, username: '布偶铲屎官', rating: 5, content: '家里两只布偶都很爱吃，便便成型好。', createTime: '2025-11-15' },
    ],
    relatedIds: [12, 17, 9, 4],
  },
}

// 为没有详情数据的商品生成默认详情
function buildDefaultDetail(product) {
  return {
    images: ['', '', '', ''],
    stock: Math.floor(Math.random() * 80) + 10,
    specs: [
      {
        id: 99,
        name: '规格',
        options: [
          { id: 9901, name: '标准款', value: 'standard', available: true, additionalPrice: 0 },
          { id: 9902, name: '升级款', value: 'premium', available: true, additionalPrice: 30 },
        ],
      },
    ],
    description: `
      <h3>产品介绍</h3>
      <p>${product.name}，精选优质原料，品质保证。适合日常使用，让您的宠物享受更好的生活。</p>
      <h3>使用说明</h3>
      <p>请按照产品包装上的说明使用，如有疑问请联系客服。</p>
    `,
    specsTable: [
      { label: '品牌', value: product.shopName },
      { label: '适用对象', value: categoryMap[product.category]?.label || '通用' },
    ],
    reviews: [
      { id: 100, username: '匿名用户', rating: 5, content: '质量不错，宠物很喜欢。', createTime: '2025-12-01' },
      { id: 101, username: '资深铲屎官', rating: 4, content: '性价比很高，推荐购买。', createTime: '2025-11-20' },
    ],
    relatedIds: mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4).map((p) => p.id),
  }
}

/**
 * 获取商品详情（Mock）
 */
export function getProductById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === Number(id))
      if (!product) return resolve(null)
      const detail = mockProductDetails[product.id] || buildDefaultDetail(product)
      resolve({ ...product, ...detail })
    }, 200)
  })
}

/**
 * 获取相关商品（Mock）
 */
export function getRelatedProducts(ids = []) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = ids.map((id) => mockProducts.find((p) => p.id === id)).filter(Boolean)
      resolve(list)
    }, 150)
  })
}

/**
 * 获取各分类商品数量
 */
export function getCategoryCounts() {
  const counts = {}
  for (const key of Object.keys(categoryMap)) {
    counts[key] = mockProducts.filter((p) => p.category === key).length
  }
  // 大类计数
  counts._pet = mockProducts.filter((p) => p.productType === 'pet').length
  counts._supply = mockProducts.filter((p) => p.productType === 'supply').length
  counts._all = mockProducts.length
  return counts
}

// 子分类（按主分类展开）
export const subcategoriesMap = {
  dogs: ['粮食', '零食', '玩具', '项圈', '清洁', '窝垫'],
  cats: ['猫粮', '猫砂', '猫玩具', '猫抓板', '猫罐头', '猫窝'],
  fish: ['鱼粮', '鱼缸', '过滤器', '加热棒', '造景', '药水'],
  birds: ['鸟粮', '鸟笼', '鸟玩具', '站杆', '沙浴', '保暖'],
  small: ['兔粮', '仓鼠笼', '跑轮', '垫料', '喂食器', '水壶'],
}

// 宠物周边子分类（按动物类型展开）
export const supplySubcategoriesMap = {
  dogs: ['狗粮', '狗零食', '狗玩具', '项圈牵引', '清洁护理', '狗窝垫'],
  cats: ['猫粮', '猫砂', '猫玩具', '猫抓板', '猫罐头', '猫窝'],
  fish: ['鱼粮', '鱼缸', '过滤器', '加热棒', '造景', '药水'],
  birds: ['鸟粮', '鸟笼', '鸟玩具', '站杆', '沙浴', '保暖'],
  small: ['兔粮', '仓鼠笼', '跑轮', '垫料', '喂食器', '水壶'],
}

// 品牌列表（按主分类）
export const brandsMap = {
  dogs: ['皇家', '冠能', '渴望', '比瑞吉', '伯纳天纯'],
  cats: ['渴望', '纽翠斯', '爱肯拿', 'go!', '百利'],
  fish: ['森森', '伊罕', '创星', '松宝', '日生'],
  birds: ['顶制', '滋养', 'F.M. Brown', 'Harrisons', 'TOPS'],
  small: ['Oxbow', 'Vitakraft', '马祖瑞', 'Kaytee', 'Bunny'],
}

// 价格区间
export const priceRanges = [
  { label: '0-50元', min: 0, max: 50 },
  { label: '50-100元', min: 50, max: 100 },
  { label: '100-200元', min: 100, max: 200 },
  { label: '200-500元', min: 200, max: 500 },
  { label: '500元以上', min: 500, max: Infinity },
]

// 好评率筛选
export const ratingOptions = [
  { label: '4.5星及以上', min: 4.5 },
  { label: '4星及以上', min: 4.0 },
  { label: '3.5星及以上', min: 3.5 },
]
