import { get, fixImageUrl } from './request'
import { getShopById } from './shop'
import { getVideoById } from './video'

// ========== UI 元数据（前端专用） ==========

export const productTypeMap = {
  pet: { label: '宠物' },
  supply: { label: '宠物周边' },
}

export const categoryMap = {
  dogs: { label: '狗狗' },
  cats: { label: '猫咪' },
  fish: { label: '水族' },
  birds: { label: '鸟类' },
  small: { label: '小宠' },
}

export const subcategoriesMap = {
  dogs: ['粮食', '零食', '玩具', '项圈', '清洁', '窝垫'],
  cats: ['猫粮', '猫砂', '猫玩具', '猫抓板', '猫罐头', '猫窝'],
  fish: ['鱼粮', '鱼缸', '过滤器', '加热棒', '造景', '药水'],
  birds: ['鸟粮', '鸟笼', '鸟玩具', '站杆', '沙浴', '保暖'],
  small: ['兔粮', '仓鼠笼', '跑轮', '垫料', '喂食器', '水壶'],
}

export const supplySubcategoriesMap = {
  dogs: ['狗粮', '狗零食', '狗玩具', '项圈牵引', '清洁护理', '狗窝垫'],
  cats: ['猫粮', '猫砂', '猫玩具', '猫零食', '猫护理', '猫窝'],
  fish: ['鱼粮', '鱼缸', '鱼药', '水草造景', '过滤设备', '加热棒'],
  birds: ['鸟粮', '鸟笼', '鸟玩具', '鸟零食', '鸟用品', '鸟药'],
  small: ['兔粮', '仓鼠笼', '仓鼠粮', '仓鼠玩具', '仓鼠用品', '小宠窝'],
}

export const subcategoryLabelToKey = {
  '狗粮': 'dog_food', '狗零食': 'dog_snack', '狗玩具': 'dog_toy',
  '项圈牵引': 'dog_collar', '清洁护理': 'dog_care', '狗窝垫': 'dog_bed',
  '猫粮': 'cat_food', '猫砂': 'cat_litter', '猫玩具': 'cat_toy',
  '猫零食': 'cat_snack', '猫护理': 'cat_care', '猫窝': 'cat_bed',
  '鱼粮': 'fish_food', '鱼缸': 'fish_tank', '鱼药': 'fish_medicine',
  '水草造景': 'fish_aqua', '过滤设备': 'fish_filter', '加热棒': 'fish_heater',
  '鸟粮': 'bird_food', '鸟笼': 'bird_cage', '鸟玩具': 'bird_toy',
  '鸟零食': 'bird_snack', '鸟用品': 'bird_supply', '鸟药': 'bird_medicine',
  '兔粮': 'rabbit_food', '仓鼠笼': 'hamster_cage', '仓鼠粮': 'hamster_food',
  '仓鼠玩具': 'hamster_toy', '仓鼠用品': 'hamster_supply', '小宠窝': 'small_bed',
}

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

// ========== 后端数据适配 ==========

function deriveCategory(name) {
  if (!name) return 'dogs'
  if (/猫|暹罗|布偶|英短/.test(name)) return 'cats'
  if (/鱼|水族|龙鱼/.test(name)) return 'fish'
  if (/鸟|鹦鹉|画眉|金丝雀/.test(name)) return 'birds'
  if (/兔|仓鼠|龙猫|荷兰猪/.test(name)) return 'small'
  return 'dogs'
}

function deriveBrand(name, category) {
  if (!name) return ''
  const cats = brandsMap[category]
  if (!cats) return ''
  return cats.find((b) => name.includes(b)) || ''
}

export function adaptProduct(p) {
  const category = deriveCategory(p.name)
  return {
    id: p.id,
    name: p.name,
    image: fixImageUrl(p.image),
    price: Number(p.price) || 0,
    originalPrice: null,
    rating: p.avgRating || 0,
    reviewCount: p.reviewCount || 0,
    shopId: p.shopId,
    shopName: p.shopName || '',
    fastDelivery: true,
    category,
    subcategory: p.subcategory || '',
    brand: deriveBrand(p.name, category),
    productType: p.type === 'pet' ? 'pet' : 'supply',
    stock: p.stock,
    sales: p.reviewCount || 0,
    videoId: p.videoId || null,
  }
}

// ========== API 函数 ==========

let _cachedProducts = null

export async function fetchAllProducts() {
  if (!_cachedProducts) {
    const res = await get('/products')
    const list = Array.isArray(res) ? res : (res?.list || [])
    _cachedProducts = list.map(adaptProduct)
  }
  return _cachedProducts
}

export function invalidateProductCache() {
  _cachedProducts = null
}

export function getProducts(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    category = '',
    productType = '',
    subcategory = '',
    shopId = '',
    keyword = '',
    brand = '',
    sort = 'default',
    priceRange = '',
    rating = '',
  } = params

  return fetchAllProducts().then((all) => {
    let filtered = [...all]

    if (keyword) {
      const kw = keyword.toLowerCase()
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(kw) ||
        (p.shopName || '').toLowerCase().includes(kw)
      )
    }
    if (productType) {
      filtered = filtered.filter((p) => p.productType === productType)
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }
    if (subcategory) {
      filtered = filtered.filter((p) => p.subcategory === subcategory)
    }
    if (brand) {
      filtered = filtered.filter((p) => p.brand === brand)
    }
    if (shopId) {
      filtered = filtered.filter((p) => p.shopId === Number(shopId))
    }
    if (priceRange) {
      const range = priceRanges.find((r) => r.label === priceRange)
      if (range) {
        filtered = filtered.filter((p) => p.price >= range.min && p.price < range.max)
      }
    }
    if (rating) {
      const opt = ratingOptions.find((r) => r.label === rating)
      if (opt) {
        filtered = filtered.filter((p) => p.rating >= opt.min)
      }
    }

    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales)
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
  })
}

export async function getProductById(id) {
  const res = await get(`/products/${id}`)
  if (!res) return null
  const product = adaptProduct(res)

  let shopName = ''
  if (res.shopId) {
    try {
      const shop = await getShopById(res.shopId)
      shopName = shop?.name || ''
    } catch {}
  }

  const images = [fixImageUrl(res.image)].filter(Boolean)

  let videoUrl = null
  if (res.videoId) {
    try {
      const video = await getVideoById(res.videoId)
      videoUrl = video?.url || null
    } catch {}
  }

  let reviews = []
  try {
    const reviewRes = await get(`/products/${id}/reviews`)
    reviews = Array.isArray(reviewRes) ? reviewRes : []
  } catch {}

  return {
    ...product,
    shopName: shopName || product.shopName,
    images,
    videoUrl,
    stock: res.stock,
    specs: [
      {
        id: 1,
        name: '规格',
        options: [
          { id: 101, name: '标准款', value: 'standard', available: true, additionalPrice: 0 },
        ],
      },
    ],
    description: res.description
      ? `<h3>产品介绍</h3><p>${res.description}</p>`
      : `<h3>产品介绍</h3><p>${res.name}，品质保证。</p>`,
    specsTable: [
      { label: '商品名称', value: res.name },
      { label: '商品类型', value: res.type === 'pet' ? '活体宠物' : '宠物用品' },
      { label: '库存', value: `${res.stock} 件` },
      { label: '价格', value: `¥${res.price}` },
    ],
    reviews,
    relatedIds: [],
  }
}

export async function getCategoryCounts() {
  const all = await fetchAllProducts()
  const counts = {}
  for (const key of Object.keys(categoryMap)) {
    counts[key] = all.filter((p) => p.category === key).length
  }
  counts._pet = all.filter((p) => p.productType === 'pet').length
  counts._supply = all.filter((p) => p.productType === 'supply').length
  counts._all = all.length
  return counts
}
