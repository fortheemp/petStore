// Mock 数据 - 同步自 PC 端 petstore-frontend/src/api/product.js

export const productTypeMap = {
  pet: { label: '宠物' },
  supply: { label: '宠物周边' },
}

export const categoryMap = {
  dogs: { label: '狗狗', emoji: '🐶' },
  cats: { label: '猫咪', emoji: '🐱' },
  fish: { label: '水族', emoji: '🐟' },
  birds: { label: '鸟类', emoji: '🐦' },
  small: { label: '小宠', emoji: '🐹' },
}

export const mockProducts = [
  { id: 1, name: '皇家小型犬成犬粮 2kg', price: 159.00, originalPrice: 199.00, rating: 4.8, reviewCount: 2341, shopId: 1, shopName: '皇家宠物旗舰店', category: 'dogs', productType: 'supply', stock: 200, sales: 5600 },
  { id: 2, name: '渴望六种鱼猫粮 5.4kg', price: 428.00, originalPrice: 528.00, rating: 4.9, reviewCount: 1892, shopId: 2, shopName: '渴望官方旗舰店', category: 'cats', productType: 'supply', stock: 150, sales: 3200 },
  { id: 3, name: '小型犬磨牙棒玩具套装', price: 39.90, originalPrice: null, rating: 4.5, reviewCount: 567, shopId: 3, shopName: '爱宠生活馆', category: 'dogs', productType: 'supply', stock: 300, sales: 1800 },
  { id: 4, name: '猫抓板瓦楞纸耐磨款', price: 29.90, originalPrice: 49.90, rating: 4.6, reviewCount: 3201, shopId: 5, shopName: '喵星人用品店', category: 'cats', productType: 'supply', stock: 500, sales: 8900 },
  { id: 5, name: '森森鱼缸超白玻璃 40cm', price: 258.00, originalPrice: 328.00, rating: 4.7, reviewCount: 421, shopId: 6, shopName: '森森水族旗舰店', category: 'fish', productType: 'supply', stock: 80, sales: 890 },
  { id: 6, name: '鹦鹉混合鸟粮 1kg', price: 25.80, originalPrice: null, rating: 4.3, reviewCount: 189, shopId: 7, shopName: '鸟语花香', category: 'birds', productType: 'supply', stock: 400, sales: 560 },
  { id: 7, name: '仓鼠笼子亚克力透明别墅', price: 89.00, originalPrice: 129.00, rating: 4.4, reviewCount: 734, shopId: 8, shopName: '小宠之家', category: 'small', productType: 'supply', stock: 120, sales: 2100 },
  { id: 8, name: '比瑞吉天然成犬粮 10kg', price: 299.00, originalPrice: 399.00, rating: 4.6, reviewCount: 1567, shopId: 1, shopName: '皇家宠物旗舰店', category: 'dogs', productType: 'supply', stock: 100, sales: 4300 },
  { id: 9, name: '猫咪自动饮水机 静音循环', price: 79.00, originalPrice: 119.00, rating: 4.7, reviewCount: 2103, shopId: 5, shopName: '喵星人用品店', category: 'cats', productType: 'supply', stock: 250, sales: 6700 },
  { id: 10, name: '热带鱼饲料增色缓沉型 500g', price: 35.00, originalPrice: null, rating: 4.5, reviewCount: 298, shopId: 6, shopName: '森森水族旗舰店', category: 'fish', productType: 'supply', stock: 350, sales: 890 },
  { id: 11, name: '狗狗牵引绳伸缩可调节 5m', price: 45.00, originalPrice: 68.00, rating: 4.4, reviewCount: 892, shopId: 3, shopName: '爱宠生活馆', category: 'dogs', productType: 'supply', stock: 180, sales: 3400 },
  { id: 12, name: '猫砂豆腐砂活性炭 6L', price: 29.90, originalPrice: 39.90, rating: 4.8, reviewCount: 5672, shopId: 5, shopName: '喵星人用品店', category: 'cats', productType: 'supply', stock: 800, sales: 12000 },
  { id: 13, name: '龙鱼专用饲料增色型 200g', price: 58.00, originalPrice: null, rating: 4.6, reviewCount: 156, shopId: 6, shopName: '森森水族旗舰店', category: 'fish', productType: 'supply', stock: 200, sales: 450 },
  { id: 14, name: '画眉鸟饲料精品配方 500g', price: 32.00, originalPrice: 45.00, rating: 4.2, reviewCount: 87, shopId: 7, shopName: '鸟语花香', category: 'birds', productType: 'supply', stock: 250, sales: 320 },
  { id: 15, name: '兔子磨牙草饼天然提摩西', price: 18.90, originalPrice: null, rating: 4.5, reviewCount: 423, shopId: 8, shopName: '小宠之家', category: 'small', productType: 'supply', stock: 300, sales: 1500 },
  { id: 16, name: '中大型犬关节营养膏 120g', price: 89.00, originalPrice: 128.00, rating: 4.7, reviewCount: 634, shopId: 1, shopName: '皇家宠物旗舰店', category: 'dogs', productType: 'supply', stock: 160, sales: 2800 },
  { id: 17, name: '猫咪冻干零食鸡肉粒 500g', price: 68.00, originalPrice: 88.00, rating: 4.8, reviewCount: 3456, shopId: 2, shopName: '渴望官方旗舰店', category: 'cats', productType: 'supply', stock: 400, sales: 7800 },
  { id: 18, name: '水族箱LED灯全光谱防水', price: 128.00, originalPrice: 168.00, rating: 4.5, reviewCount: 234, shopId: 6, shopName: '森森水族旗舰店', category: 'fish', productType: 'supply', stock: 90, sales: 670 },
  { id: 19, name: '金丝雀繁殖箱木质鸟窝', price: 22.00, originalPrice: null, rating: 4.1, reviewCount: 56, shopId: 7, shopName: '鸟语花香', category: 'birds', productType: 'supply', stock: 150, sales: 210 },
  { id: 20, name: '龙猫专用浴沙 2kg', price: 28.00, originalPrice: 38.00, rating: 4.6, reviewCount: 312, shopId: 8, shopName: '小宠之家', category: 'small', productType: 'supply', stock: 220, sales: 1200 },
  { id: 21, name: '英短蓝猫幼猫 3月龄 已疫苗', price: 1200.00, originalPrice: 1500.00, rating: 4.9, reviewCount: 42, shopId: 3, shopName: '爱宠生活馆', category: 'cats', productType: 'pet', stock: 1, sales: 42 },
  { id: 22, name: '柯基犬幼犬 2月龄 已驱虫', price: 2800.00, originalPrice: 3500.00, rating: 4.8, reviewCount: 28, shopId: 4, shopName: '萌宠乐园', category: 'dogs', productType: 'pet', stock: 1, sales: 28 },
  { id: 23, name: '布偶猫成猫 甜美的蓝眼睛', price: 5500.00, originalPrice: 6800.00, rating: 4.9, reviewCount: 15, shopId: 4, shopName: '萌宠乐园', category: 'cats', productType: 'pet', stock: 1, sales: 15 },
  { id: 24, name: '金毛寻回犬幼犬 专业犬舍', price: 3200.00, originalPrice: 4000.00, rating: 4.7, reviewCount: 33, shopId: 4, shopName: '萌宠乐园', category: 'dogs', productType: 'pet', stock: 1, sales: 33 },
  { id: 25, name: '荷兰猪幼崽 一对装', price: 60.00, originalPrice: 80.00, rating: 4.5, reviewCount: 89, shopId: 8, shopName: '小宠之家', category: 'small', productType: 'pet', stock: 1, sales: 89 },
]

export const mockProductDetails = {
  1: {
    description: '专为小型犬设计，颗粒小巧易咀嚼。优质动物蛋白，添加益生元呵护肠道。',
    specs: [{ name: '规格', options: ['1kg 试吃装', '2kg 标准装', '8kg 家庭装'] }],
    images: ['', '', ''],
  },
  2: {
    description: '六种深海鱼配方，高蛋白低碳水，无谷物配方降低过敏风险。',
    specs: [{ name: '规格', options: ['1.8kg 试吃装', '5.4kg 标准装'] }],
    images: ['', '', ''],
  },
}

export const mockShops = [
  { id: 1, name: '皇家宠物旗舰店', address: '朝阳区宠物大道100号', distance: '1.2km', rating: 4.8 },
  { id: 2, name: '渴望官方旗舰店', address: '海淀区宠物路200号', distance: '2.5km', rating: 4.9 },
  { id: 3, name: '爱宠生活馆', address: '西城区宠物街50号', distance: '0.8km', rating: 4.6 },
  { id: 4, name: '萌宠乐园', address: '东城区动物路88号', distance: '3.1km', rating: 4.7 },
  { id: 5, name: '喵星人用品店', address: '丰台区猫咪巷12号', distance: '1.8km', rating: 4.8 },
]

export const mockVideos = [
  { id: 1, title: '柯基犬的快乐日常', cover: '', duration: '03:25', views: 12800, date: '2025-12-20' },
  { id: 2, title: '猫咪逗猫棒挑战', cover: '', duration: '02:18', views: 8900, date: '2025-12-18' },
  { id: 3, title: '金毛寻回犬训练教程', cover: '', duration: '05:42', views: 15600, date: '2025-12-15' },
  { id: 4, title: '仓鼠的迷宫冒险', cover: '', duration: '01:55', views: 6700, date: '2025-12-12' },
  { id: 5, title: '热带鱼缸造景教程', cover: '', duration: '04:30', views: 4300, date: '2025-12-10' },
]

export const mockAddresses = [
  { id: 1, name: '张三', phone: '13800138000', province: '北京市', city: '北京市', district: '朝阳区', detail: '宠物大道100号1栋1单元101', isDefault: true },
  { id: 2, name: '张三', phone: '13800138000', province: '北京市', city: '北京市', district: '海淀区', detail: '中关村大街50号', isDefault: false },
]

export const mockUser = {
  id: 1,
  username: 'petlover',
  nickname: '爱宠达人',
  phone: '13800138000',
  avatar: '',
}

export const mockOrders = [
  {
    id: 1, orderNo: 'PS20251220001', status: 1, statusText: '待付款',
    items: [{ productId: 1, name: '皇家小型犬成犬粮 2kg', price: 159.00, quantity: 1, spec: '2kg 标准装' }],
    goodsTotal: 159.00, freight: 0, totalPrice: 159.00, createTime: '2025-12-20 14:30:00',
  },
  {
    id: 2, orderNo: 'PS20251218002', status: 2, statusText: '待发货',
    items: [{ productId: 2, name: '渴望六种鱼猫粮 5.4kg', price: 428.00, quantity: 1, spec: '5.4kg 标准装' }],
    goodsTotal: 428.00, freight: 0, totalPrice: 428.00, createTime: '2025-12-18 10:15:00', payMethod: '微信支付',
  },
  {
    id: 3, orderNo: 'PS20251215003', status: 3, statusText: '待收货',
    items: [
      { productId: 12, name: '猫砂豆腐砂活性炭 6L', price: 29.90, quantity: 2, spec: '标准款' },
      { productId: 9, name: '猫咪自动饮水机 静音循环', price: 79.00, quantity: 1, spec: '标准款' },
    ],
    goodsTotal: 138.80, freight: 0, totalPrice: 138.80, createTime: '2025-12-15 09:00:00', payMethod: '支付宝',
  },
  {
    id: 4, orderNo: 'PS20251210004', status: 4, statusText: '已完成',
    items: [{ productId: 4, name: '猫抓板瓦楞纸耐磨款', price: 29.90, quantity: 3, spec: '标准款' }],
    goodsTotal: 89.70, freight: 0, totalPrice: 89.70, createTime: '2025-12-10 16:45:00', payMethod: '微信支付', reviewed: true,
  },
  {
    id: 5, orderNo: 'PS20251205005', status: 4, statusText: '已完成',
    items: [{ productId: 22, name: '柯基犬幼犬 2月龄 已驱虫', price: 2800.00, quantity: 1, spec: '标准款' }],
    goodsTotal: 2800.00, freight: 0, totalPrice: 2800.00, createTime: '2025-12-05 11:20:00', payMethod: '支付宝', reviewed: false,
  },
]

// 商品列表查询（mock）
export function queryProducts({ page = 1, pageSize = 10, keyword = '', category = '', productType = '', sort = 'default' } = {}) {
  let list = [...mockProducts]
  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(kw))
  }
  if (category) list = list.filter(p => p.category === category)
  if (productType) list = list.filter(p => p.productType === productType)
  switch (sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break
    case 'price-desc': list.sort((a, b) => b.price - a.price); break
    case 'sales': list.sort((a, b) => b.sales - a.sales); break
    default: list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
  }
  const total = list.length
  const start = (page - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total, page, pageSize }
}

export function queryProductById(id) {
  const product = mockProducts.find(p => p.id === Number(id))
  if (!product) return null
  const detail = mockProductDetails[product.id] || {
    description: `${product.name}，精选优质原料，品质保证。`,
    specs: [{ name: '规格', options: ['标准款'] }],
    images: ['', '', ''],
  }
  return { ...product, ...detail }
}
