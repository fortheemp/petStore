<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getProducts, categoryMap, productTypeMap, getCategoryCounts,
  subcategoriesMap, supplySubcategoriesMap, brandsMap, priceRanges, ratingOptions,
} from '@/api/product'
import { getShopById } from '@/api/shop'
import ProductCard from '@/components/common/ProductCard.vue'

const route = useRoute()
const router = useRouter()

// 子分类对应 SVG 图标
const animalIcons = {
  '狗狗': `<path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>`,
  '猫咪': `<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>`,
  '水族': `<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>`,
  '鸟类': `<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>`,
  '小宠': `<path d="M13 16a3 3 0 0 1 2.24 5"/><path d="M18 12h.01"/><path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"/><path d="M20 8.54V4a2 2 0 1 0-4 0v3"/><path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"/>`,
}
const supplyIconMap = {
  '狗粮': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '猫粮': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '鱼粮': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '鸟粮': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '兔粮': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '狗零食': `<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>`,
  '猫零食': `<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>`,
  '猫罐头': `<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>`,
  '狗玩具': `<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>`,
  '猫玩具': `<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>`,
  '鸟玩具': `<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>`,
  '项圈牵引': `<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>`,
  '清洁护理': `<path d="m4 4 2.5 2.5"/><path d="M13.5 6.5a4.95 4.95 0 0 0-7 7"/><path d="M15 5 5 15"/><path d="M14 17v.01"/><path d="M10 16v.01"/>`,
  '狗窝垫': `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/>`,
  '猫窝': `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/>`,
  '猫砂': `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m7.5 4.27 9 5.15"/>`,
  '猫抓板': `<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>`,
  '鱼缸': `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m7.5 4.27 9 5.15"/>`,
  '过滤器': `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m7.5 4.27 9 5.15"/>`,
  '加热棒': `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,
  '造景': `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,
  '药水': `<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>`,
  '鸟笼': `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m7.5 4.27 9 5.15"/>`,
  '仓鼠笼': `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m7.5 4.27 9 5.15"/>`,
  '站杆': `<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>`,
  '沙浴': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '保暖': `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,
  '跑轮': `<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>`,
  '垫料': `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m7.5 4.27 9 5.15"/>`,
  '喂食器': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
  '水壶': `<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/>`,
}
const subcategoryIcons = { ...animalIcons, ...supplyIconMap }

// 状态
const products = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const currentSort = ref('default')
const categoryCounts = ref({})
const currentShopId = computed(() => route.query.shopId || '')
const shopName = ref('')
const currentProductType = computed(() => route.query.productType || '')
const currentCategory = computed(() => route.query.category || '')
const currentKeyword = computed(() => route.query.keyword || '')

// 子分类 & 筛选状态
const currentSubcategory = ref('')
const selectedBrand = ref('')
const selectedPriceRange = ref('')
const selectedRating = ref('')

// 分类列表（动物类型）
const categoryList = computed(() => {
  return Object.keys(categoryMap).map((key) => ({
    key,
    label: categoryMap[key].label,
    count: categoryCounts.value[key] || 0,
  }))
})

// 当前大类下的子分类圆形图标（宠物→动物类型，宠物周边→用品类型）
const subcategoryList = computed(() => {
  if (!currentProductType.value) return []
  if (currentProductType.value === 'pet') {
    return Object.keys(categoryMap).map((k) => categoryMap[k].label)
  }
  // supply: 按动物类型显示周边子分类，当前已选动物则只显示该动物的周边
  if (currentCategory.value && supplySubcategoriesMap[currentCategory.value]) {
    return supplySubcategoriesMap[currentCategory.value]
  }
  // 未选动物：显示所有动物大类的周边入口
  return Object.keys(categoryMap).map((k) => categoryMap[k].label)
})

// 当前主分类下的品牌列表
const brandList = computed(() => {
  if (currentProductType.value === 'pet') {
    // 宠物：按动物类型显示品牌
    if (currentCategory.value && brandsMap[currentCategory.value]) {
      return brandsMap[currentCategory.value]
    }
    return []
  }
  // 宠物周边：按动物类型显示品牌
  if (currentCategory.value && brandsMap[currentCategory.value]) {
    return brandsMap[currentCategory.value]
  }
  return []
})

// 排序选项
const sortOptions = [
  { value: 'default', label: '综合排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'rating', label: '好评优先' },
]

// 面包屑文案
const pageTitle = computed(() => {
  if (currentKeyword.value) {
    return `搜索"${currentKeyword.value}"`
  }
  if (currentShopId.value) {
    return shopName.value || '商店商品'
  }
  if (currentProductType.value && productTypeMap[currentProductType.value]) {
    const typeLabel = productTypeMap[currentProductType.value].label
    if (currentCategory.value && categoryMap[currentCategory.value]) {
      return `${categoryMap[currentCategory.value].label}${typeLabel === '宠物周边' ? '用品' : ''}`
    }
    return typeLabel
  }
  return '全部商品'
})

// 加载商品
const fetchProducts = async () => {
  loading.value = true
  try {
    if (currentShopId.value) {
      getShopById(currentShopId.value).then((res) => { shopName.value = res?.name || '' })
    } else {
      shopName.value = ''
    }
    const data = await getProducts({
      page: currentPage.value,
      pageSize: pageSize.value,
      category: currentCategory.value,
      productType: currentProductType.value,
      shopId: currentShopId.value,
      keyword: currentKeyword.value,
      sort: currentSort.value,
    })
    products.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 筛选/排序变化时重置到第一页
const handleFilterChange = () => {
  currentPage.value = 1
  const query = {}
  if (currentKeyword.value) query.keyword = currentKeyword.value
  if (currentProductType.value) query.productType = currentProductType.value
  if (currentCategory.value) query.category = currentCategory.value
  router.push({ path: '/products', query })
}

// 翻页
const handlePageChange = (page) => {
  currentPage.value = page
  updateQuery()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 同步 URL 参数
const updateQuery = () => {
  const query = {}
  if (currentKeyword.value) query.keyword = currentKeyword.value
  if (currentProductType.value) query.productType = currentProductType.value
  if (currentCategory.value) query.category = currentCategory.value
  if (currentPage.value > 1) query.page = String(currentPage.value)
  router.push({ path: '/products', query })
}

// 加入购物车
const handleAddToCart = (id) => {
  ElMessage.success('已加入购物车')
}

// 主分类点击（侧边栏动物分类）
const handleCategoryClick = (key) => {
  currentSubcategory.value = ''
  selectedBrand.value = ''
  selectedPriceRange.value = ''
  selectedRating.value = ''
  const newCategory = currentCategory.value === key ? '' : key
  const query = { productType: currentProductType.value }
  if (newCategory) query.category = newCategory
  router.push({ path: '/products', query })
}

// 子分类点击（圆形图标）
const handleSubcategoryClick = (sub) => {
  if (currentSubcategory.value === sub) {
    currentSubcategory.value = ''
    return
  }
  currentSubcategory.value = sub
  const matchedKey = Object.keys(categoryMap).find((k) => categoryMap[k].label === sub)
  if (matchedKey) {
    const query = { productType: currentProductType.value, category: matchedKey }
    router.push({ path: '/products', query })
  }
}

// 重置所有筛选
const resetFilters = () => {
  currentSubcategory.value = ''
  selectedBrand.value = ''
  selectedPriceRange.value = ''
  selectedRating.value = ''
}

// 查看全部商品
const viewAllProducts = () => {
  currentSubcategory.value = ''
  selectedBrand.value = ''
  selectedPriceRange.value = ''
  selectedRating.value = ''
  currentPage.value = 1
  router.push({ path: '/products' })
}

// 大类点击（从 header 或本页触发）
const handleProductTypeClick = (type) => {
  currentSubcategory.value = ''
  selectedBrand.value = ''
  selectedPriceRange.value = ''
  selectedRating.value = ''
  const newType = currentProductType.value === type ? '' : type
  const query = {}
  if (newType) query.productType = newType
  currentPage.value = 1
  router.push({ path: '/products', query })
}

// 监听路由变化，触发数据加载
watch(
  () => route.fullPath,
  () => {
    currentPage.value = Number(route.query.page) || 1
    currentSubcategory.value = ''
    fetchProducts()
  },
)

onMounted(async () => {
  categoryCounts.value = await getCategoryCounts()
  fetchProducts()
})
</script>

<template>
  <div class="product-list-page">
    <!-- 合并：面包屑 + 标题 + 分类图标 + 排序 -->
    <div class="page-header">
      <div class="container">
        <!-- 第一行：面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 第二行：标题 + 分类图标 + 排序 -->
        <div class="page-header__main">
          <div class="page-header__left">
            <h1 class="page-header__title">{{ pageTitle }}</h1>
            <span class="page-header__count">共 {{ total }} 件商品</span>
          </div>

          <!-- 中间：分类圆形图标 -->
          <div class="page-header__categories">
            <!-- 未选大类：显示两大类 -->
            <div v-show="!currentProductType" class="page-header__cat-row">
              <button class="category-icon" @click="handleProductTypeClick('pet')">
                <span class="category-icon__circle category-icon__circle--lg">
                  <svg class="category-icon__svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM2 14.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm20 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 18c0 2.5 3.5 5 8 5s8-2.5 8-5c0-1.5-3.5-3-8-3s-8 1.5-8 3z"/>
                  </svg>
                </span>
                <span class="category-icon__label">宠物</span>
              </button>
              <button class="category-icon" @click="handleProductTypeClick('supply')">
                <span class="category-icon__circle category-icon__circle--lg">
                  <svg class="category-icon__svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.78 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
                  </svg>
                </span>
                <span class="category-icon__label">宠物周边</span>
              </button>
            </div>

            <!-- 已选大类：显示子分类 -->
            <div v-show="currentProductType && subcategoryList.length > 0" class="page-header__cat-row">
              <button
                v-for="sub in subcategoryList"
                :key="sub"
                class="category-icon"
                :class="{ 'category-icon--active': currentSubcategory === sub }"
                @click="handleSubcategoryClick(sub)"
              >
                <span class="category-icon__circle">
                  <svg class="category-icon__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="subcategoryIcons[sub] || subcategoryIcons['小宠']"></svg>
                </span>
                <span class="category-icon__label">{{ sub }}</span>
              </button>
            </div>
          </div>

          <!-- 右侧：排序 -->
          <div class="page-header__sort">
            <el-radio-group v-model="currentSort" @change="handleFilterChange">
              <el-radio-button
                v-for="opt in sortOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品区域 -->
    <div class="product-content">
      <div class="container product-content__layout">
        <!-- 左侧筛选栏 -->
        <aside class="sidebar">
          <!-- 品牌筛选（仅选中主分类后显示） -->
          <div v-if="brandList.length > 0" class="sidebar__section">
            <h3 class="sidebar__title">品牌</h3>
            <ul class="sidebar__list">
              <li
                v-for="brand in brandList"
                :key="brand"
                class="sidebar__item sidebar__item--filter"
                :class="{ 'sidebar__item--active': selectedBrand === brand }"
                @click="selectedBrand = selectedBrand === brand ? '' : brand"
              >
                <span class="sidebar__item-label">{{ brand }}</span>
              </li>
            </ul>
          </div>

          <!-- 价格区间 -->
          <div class="sidebar__section">
            <h3 class="sidebar__title">价格区间</h3>
            <ul class="sidebar__list">
              <li
                v-for="range in priceRanges"
                :key="range.label"
                class="sidebar__item sidebar__item--filter"
                :class="{ 'sidebar__item--active': selectedPriceRange === range.label }"
                @click="selectedPriceRange = selectedPriceRange === range.label ? '' : range.label"
              >
                <span class="sidebar__item-label">{{ range.label }}</span>
              </li>
            </ul>
          </div>

          <!-- 好评率 -->
          <div class="sidebar__section">
            <h3 class="sidebar__title">好评率</h3>
            <ul class="sidebar__list">
              <li
                v-for="opt in ratingOptions"
                :key="opt.label"
                class="sidebar__item sidebar__item--filter"
                :class="{ 'sidebar__item--active': selectedRating === opt.label }"
                @click="selectedRating = selectedRating === opt.label ? '' : opt.label"
              >
                <span class="sidebar__item-label">{{ opt.label }}</span>
              </li>
            </ul>
          </div>

          <!-- 重置按钮 -->
          <button
            v-if="selectedBrand || selectedPriceRange || selectedRating"
            class="sidebar__reset"
            @click="resetFilters"
          >
            清除所有筛选
          </button>
        </aside>

        <!-- 商品主区域 -->
        <div class="product-main">
          <!-- 加载中 -->
          <div v-if="loading" class="product-grid">
            <div v-for="i in 8" :key="i" class="skeleton-card">
              <div class="skeleton-card__image"></div>
              <div class="skeleton-card__line skeleton-card__line--title"></div>
              <div class="skeleton-card__line skeleton-card__line--short"></div>
              <div class="skeleton-card__line skeleton-card__line--price"></div>
              <div class="skeleton-card__btn"></div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="products.length === 0" class="empty-state">
            <el-icon :size="64" color="#ccc"><Box /></el-icon>
            <p class="empty-state__text">暂无商品</p>
            <el-button @click="viewAllProducts">
              查看全部商品
            </el-button>
          </div>

          <!-- 商品列表 -->
          <div v-else class="product-grid">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              v-bind="product"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <!-- 分页 -->
          <div v-if="total > pageSize" class="pagination">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
  padding-top: 2.4rem;
}

/* ========== 页面标题 + 分类 + 排序（合并卡片） ========== */
.page-header {
  background-color: var(--color-bg-primary);
  border-radius: 1.2rem;
  padding: 2rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.page-header .el-breadcrumb {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.page-header__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.page-header__left {
  flex-shrink: 0;
}

.page-header__title {
  font-size: 2.4rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 0.2rem 0;
}

.page-header__count {
  font-size: 1.4rem;
  color: #666;
  font-weight: var(--font-weight-regular);
  white-space: nowrap;
}

.page-header__categories {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.page-header__cat-row {
  display: flex;
  align-items: center;
  gap: 3.2rem;
}

.page-header__sort {
  flex-shrink: 0;
}

/* 分类圆形图标 */
.category-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  transition: transform 0.2s ease;
}

.category-icon:hover {
  transform: translateY(-2px);
}

.category-icon__circle {
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 50%;
  background-color: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}

.category-icon__circle--lg {
  width: 6.4rem;
  height: 6.4rem;
}

.category-icon__svg {
  width: 2.8rem;
  height: 2.8rem;
  color: var(--color-brand-blue);
  transition: color 0.25s ease;
}

.category-icon__circle--lg .category-icon__svg {
  width: 3.2rem;
  height: 3.2rem;
}

.category-icon:hover .category-icon__circle {
  background-color: #e8edff;
}

.category-icon--active .category-icon__circle {
  background-color: #e8edff;
  border-color: var(--color-brand-blue);
}

.category-icon__label {
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.category-icon--active .category-icon__label {
  color: var(--color-brand-blue);
  font-weight: var(--font-weight-semibold);
}

/* ========== 商品网格 ========== */
.product-content {
  padding-bottom: 6.4rem;
}

.product-content__layout {
  display: flex;
  gap: 3.2rem;
  align-items: flex-start;
}

.product-main {
  flex: 1;
  min-width: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;
}

/* ========== 侧边栏 ========== */
.sidebar {
  width: 24rem;
  flex-shrink: 0;
  background-color: var(--color-bg-primary);
  border-radius: 1.2rem;
  padding: 2.4rem 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 12.4rem;
}

.sidebar__section {
  padding: 0 var(--spacing-4);
  margin-bottom: 2.4rem;
}

.sidebar__section:last-child {
  margin-bottom: 0;
}

.sidebar__title {
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border-radius: var(--radius-md);
  margin-bottom: 0.2rem;
}

.sidebar__item:hover {
  background-color: var(--color-bg-secondary);
}

.sidebar__item--active {
  background-color: #f0f4ff;
}

.sidebar__item--filter {
  justify-content: flex-start;
  padding-left: var(--spacing-3);
}

.sidebar__item-label {
  font-size: var(--text-body-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.sidebar__item--active .sidebar__item-label {
  color: var(--color-brand-blue);
  font-weight: var(--font-weight-semibold);
}

.sidebar__item-count {
  font-size: var(--text-caption);
  color: var(--color-text-placeholder);
  background-color: var(--color-bg-secondary);
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  min-width: 2.4rem;
  text-align: center;
}

.sidebar__item--active .sidebar__item-count {
  background-color: var(--color-brand-blue);
  color: var(--color-text-inverse);
}

.sidebar__reset {
  display: block;
  width: calc(100% - 3.2rem);
  margin: 0 var(--spacing-4);
  padding: var(--spacing-2);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sidebar__reset:hover {
  border-color: var(--color-brand-blue);
  color: var(--color-brand-blue);
}

/* ========== 分页 ========== */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 4.8rem;
  margin-bottom: 6.4rem;
}

.pagination :deep(.el-pagination) {
  --el-pagination-hover-color: var(--color-brand-orange);
}

/* ========== 骨架屏 ========== */
.skeleton-card {
  background-color: var(--color-bg-card);
  border-radius: 1.2rem;
  padding: 2rem;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-card__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #f0f0f0;
  border-radius: 0.8rem;
  margin-bottom: 2rem;
}

.skeleton-card__line {
  height: 1.4rem;
  background-color: #f0f0f0;
  border-radius: var(--radius-sm);
  margin-bottom: 1.2rem;
}

.skeleton-card__line--title {
  width: 80%;
  height: 1.8rem;
}

.skeleton-card__line--short {
  width: 50%;
}

.skeleton-card__line--price {
  width: 35%;
  height: 2rem;
  margin-bottom: 1.6rem;
}

.skeleton-card__btn {
  width: 100%;
  height: 4rem;
  background-color: #f0f0f0;
  border-radius: 0.8rem;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  padding: 16rem 0;
}

.empty-state__text {
  font-size: var(--text-body-lg);
  color: var(--color-text-secondary);
}

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .sidebar {
    display: none;
  }

  .product-content__layout {
    display: block;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .page-header__main {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }

  .page-header__categories {
    width: 100%;
    justify-content: flex-start;
  }

  .page-header__cat-row {
    overflow-x: auto;
    flex-wrap: nowrap;
    gap: 2rem;
    padding-bottom: 0.4rem;
    -webkit-overflow-scrolling: touch;
  }

  .page-header__cat-row::-webkit-scrollbar {
    display: none;
  }

  .page-header__sort {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .page-header__sort::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 576px) {
  .page-header {
    border-radius: 0;
    margin-bottom: 1.6rem;
  }

  .category-icon__circle {
    width: 4.8rem;
    height: 4.8rem;
  }

  .category-icon__circle--lg {
    width: 5.6rem;
    height: 5.6rem;
  }

  .category-icon__svg {
    width: 2.4rem;
    height: 2.4rem;
  }

  .category-icon__label {
    font-size: 1.2rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;
  }
}
</style>
