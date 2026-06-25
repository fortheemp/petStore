// ===== 商品 API（调用真实后端） =====
import { get } from '@/api'

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

// 子分类
export const subcategoriesMap = {
  dogs: ['粮食', '零食', '玩具', '项圈', '清洁', '窝垫'],
  cats: ['猫粮', '猫砂', '猫玩具', '猫抓板', '猫罐头', '猫窝'],
  fish: ['鱼粮', '鱼缸', '过滤器', '加热棒', '造景', '药水'],
  birds: ['鸟粮', '鸟笼', '鸟玩具', '站杆', '沙浴', '保暖'],
  small: ['兔粮', '仓鼠笼', '跑轮', '垫料', '喂食器', '水壶'],
}

export const supplySubcategoriesMap = subcategoriesMap

export const brandsMap = {
  dogs: ['皇家', '冠能', '渴望', '比瑞吉', '伯纳天纯'],
  cats: ['渴望', '纽翠斯', '爱肯拿', 'go!', '百利'],
  fish: ['森森', '伊罕', '创星', '松宝', '日生'],
  birds: ['顶制', '滋养', 'F.M. Brown', 'Harrisons', 'TOPS'],
  small: ['Oxbow', 'Vitakraft', '马祖瑞', 'Kaytee', 'Bunny'],
}

export const priceRanges = [
  { label: '0-50元', min: 0, max: 50 },
  { label: '50-100元', min: 50, max: 100 },
  { label: '100-200元', min: 100, max: 200 },
  { label: '200-500元', min: 200, max: 500 },
  { label: '500元以上', min: 500, max: Infinity },
]

export const ratingOptions = [
  { label: '4.5星及以上', min: 4.5 },
  { label: '4星及以上', min: 4.0 },
  { label: '3.5星及以上', min: 3.5 },
]

// ===== 内部缓存 =====
let cachedShops = null
let cachedProducts = null

async function loadShops() {
  if (cachedShops) return cachedShops
  try {
    const res = await get('/shops')
    if (res.data.code === 200) cachedShops = res.data.data || []
  } catch { cachedShops = [] }
  return cachedShops
}

async function loadProducts() {
  if (cachedProducts) return cachedProducts
  try {
    const res = await get('/products')
    if (res.data.code === 200) cachedProducts = res.data.data || []
  } catch { cachedProducts = [] }
  return cachedProducts
}

// 从商品名称推断动物分类
function inferCategory(name) {
  if (!name) return ''
  const n = name.toLowerCase()
  if (/猫|猫咪|暹罗|布偶|英短|美短|橘猫|加菲/.test(n)) return 'cats'
  if (/狗|犬|金毛|泰迪|柯基|哈士奇|拉布拉多|柴犬|边牧/.test(n)) return 'dogs'
  if (/鱼|水族|龙鱼|热带鱼|金鱼|锦鲤/.test(n)) return 'fish'
  if (/鸟|鹦鹉|画眉|金丝雀|文鸟|百灵/.test(n)) return 'birds'
  if (/仓鼠|兔|龙猫|荷兰猪|松鼠|刺猬/.test(n)) return 'small'
  return ''
}

// 后端 Product → 前端形状
async function transformProduct(p) {
  const shops = await loadShops()
  const shop = shops.find((s) => s.id === p.shopId)
  const category = inferCategory(p.name)
  return {
    id: p.id,
    name: p.name,
    image: p.image || '',
    price: Number(p.price) || 0,
    originalPrice: null,
    rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 500) + 10,
    shopId: p.shopId,
    shopName: shop ? shop.name : '未知商店',
    fastDelivery: p.type === 'accessory',
    category,
    productType: p.type === 'pet' ? 'pet' : 'supply',
    stock: p.stock,
    type: p.type,
    description: p.description || '',
    videoId: p.videoId,
  }
}

// 为商品详情生成默认扩展数据
function buildDefaultDetail(product) {
  return {
    images: [product.image || '', product.image || '', product.image || '', product.image || ''],
    stock: product.stock,
    specs: [
      {
        id: 1,
        name: '规格',
        options: [
          { id: 101, name: '标准款', value: 'standard', available: true, additionalPrice: 0 },
        ],
      },
    ],
    description: product.description
      ? `<h3>产品介绍</h3><p>${product.description}</p>`
      : '<h3>产品介绍</h3><p>详情请咨询客服。</p>',
    specsTable: [
      { label: '品牌', value: product.shopName },
      { label: '适用对象', value: categoryMap[product.category]?.label || '通用' },
      { label: '库存', value: product.stock + ' 件' },
    ],
    reviews: [
      { id: 1, username: '宠物爱好者', rating: 5, content: '质量不错，很满意！', createTime: '2026-06-15' },
      { id: 2, username: '爱宠达人', rating: 4, content: '性价比很高，推荐购买。', createTime: '2026-06-10' },
    ],
    relatedIds: [],
  }
}

// ===== 对外 API =====

/**
 * 获取商品列表（从后端数据库 + 字段转换）
 */
export async function getProducts(params = {}) {
  const {
    page = 1,
    pageSize = 12,
    category = '',
    productType = '',
    shopId = '',
    keyword = '',
    sort = 'default',
  } = params

  const all = await loadProducts()
  let filtered = await Promise.all(all.map(transformProduct))

  // 关键词搜索
  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw))
  }

  // 大类筛选
  if (productType) {
    filtered = filtered.filter((p) => p.productType === productType)
  }

  // 分类筛选
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
      filtered.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)

  return { list, total, page, pageSize }
}

/**
 * 获取商品详情（从后端 API）
 */
export async function getProductById(id) {
  try {
    const res = await get(`/products/${id}`)
    if (res.data.code !== 200 || !res.data.data) return null

    const product = await transformProduct(res.data.data)
    const detail = buildDefaultDetail(product)
    return { ...product, ...detail }
  } catch {
    return null
  }
}

/**
 * 获取相关商品
 */
export async function getRelatedProducts(ids = []) {
  const all = await loadProducts()
  const transformed = await Promise.all(
    all.filter((p) => ids.includes(p.id)).map(transformProduct),
  )
  return transformed
}

/**
 * 获取各分类商品数量
 */
export function getCategoryCounts() {
  return { _all: 0, _pet: 0, _supply: 0, dogs: 0, cats: 0, fish: 0, birds: 0, small: 0 }
}

/** 强制刷新缓存（管理后台操作后调用） */
export function clearProductCache() {
  cachedProducts = null
  cachedShops = null
}