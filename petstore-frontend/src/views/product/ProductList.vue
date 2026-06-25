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

// 状态
const products = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const currentSort = ref('default')
const categoryCounts = ref({})
const currentShopId = computed(() => route.query.shopId || '')
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

// 商店名称（异步获取）
const currentShopName = ref('')
watch(currentShopId, async (id) => {
  if (id) {
    const shop = await getShopById(id)
    currentShopName.value = shop ? shop.name : '商店商品'
  } else {
    currentShopName.value = ''
  }
}, { immediate: true })

// 面包屑文案
const pageTitle = computed(() => {
  if (currentKeyword.value) {
    return `搜索"${currentKeyword.value}"`
  }
  if (currentShopId.value) {
    return currentShopName.value || '商店商品'
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

onMounted(() => {
  categoryCounts.value = getCategoryCounts()
  fetchProducts()
})
</script>

<template>
  <div class="product-list-page">
    <!-- 面包屑 + 标题 -->
    <div class="page-header">
      <div class="container">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 标题 -->
        <div class="page-header__title-row">
          <h1 class="page-header__title">{{ pageTitle }}</h1>
          <span class="page-header__count">（{{ total }} 件商品）</span>
        </div>
      </div>
    </div>

    <!-- 分类选择区：未选大类时显示两大类，已选大类时显示子分类 -->
    <div class="category-icons">
      <div class="container">
        <!-- 未选大类：显示「宠物」和「宠物周边」两个大圈 -->
        <div v-show="!currentProductType" class="category-icons__scroll">
          <button
            class="category-icon"
            @click="handleProductTypeClick('pet')"
          >
            <span class="category-icon__circle category-icon__circle--lg">
              <svg class="category-icon__svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM2 14.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm20 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 18c0 2.5 3.5 5 8 5s8-2.5 8-5c0-1.5-3.5-3-8-3s-8 1.5-8 3z"/>
              </svg>
            </span>
            <span class="category-icon__label">宠物</span>
            <span class="category-icon__count">（{{ categoryCounts._pet || 0 }}件）</span>
          </button>
          <button
            class="category-icon"
            @click="handleProductTypeClick('supply')"
          >
            <span class="category-icon__circle category-icon__circle--lg">
              <svg class="category-icon__svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.78 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
              </svg>
            </span>
            <span class="category-icon__label">宠物周边</span>
            <span class="category-icon__count">（{{ categoryCounts._supply || 0 }}件）</span>
          </button>
        </div>

        <!-- 已选大类：显示子分类圆形图标 -->
        <div v-show="currentProductType && subcategoryList.length > 0" class="category-icons__scroll">
          <button
            v-for="sub in subcategoryList"
            :key="sub"
            class="category-icon"
            :class="{ 'category-icon--active': currentSubcategory === sub }"
            @click="handleSubcategoryClick(sub)"
          >
            <span class="category-icon__circle">
              <svg class="category-icon__svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
              </svg>
            </span>
            <span class="category-icon__label">{{ sub }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="container filter-bar__inner">
        <div class="filter-bar__left">
          <span class="filter-bar__count">共 {{ total }} 件商品</span>
        </div>

        <div class="filter-bar__right">
          <!-- 排序 -->
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

/* ========== 面包屑 + 标题 ========== */
.page-header {
  background-color: var(--color-bg-primary);
  border-radius: 1.2rem;
  padding: 3.2rem 0;
  margin-bottom: 2.4rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.page-header__title-row {
  display: flex;
  align-items: baseline;
  gap: 1.2rem;
  margin-top: 2.4rem;
}

.page-header__title {
  font-size: 2.8rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.page-header__count {
  font-size: 1.6rem;
  color: #666;
  font-weight: var(--font-weight-regular);
}

/* ========== 筛选栏 ========== */
.filter-bar {
  background-color: var(--color-bg-primary);
  border-radius: 1.2rem;
  padding: 2rem 0;
  margin-bottom: 3.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.filter-bar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.6rem;
}

.filter-bar__count {
  font-size: 1.4rem;
  color: #666;
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

/* ========== 分类图标行 ========== */
.category-icons {
  background-color: var(--color-bg-primary);
  border-radius: 1.2rem;
  padding: 3.2rem 0;
  margin-bottom: 2.4rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.category-icons__scroll {
  display: flex;
  justify-content: center;
  gap: 7.2rem;
  padding: 0 var(--spacing-2);
}

.category-icons__scroll::-webkit-scrollbar {
  display: none;
}

.category-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
}

.category-icon__circle {
  width: 7.2rem;
  height: 7.2rem;
  border-radius: var(--radius-full);
  background-color: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.category-icon__circle--lg {
  width: 8.8rem;
  height: 8.8rem;
}

.category-icon__svg {
  width: 3.6rem;
  height: 3.6rem;
  color: var(--color-brand-blue);
  transition: color var(--transition-fast);
}

.category-icon__circle--lg .category-icon__svg {
  width: 4.4rem;
  height: 4.4rem;
}

.category-icon--active .category-icon__circle {
  background-color: #e8edff;
  border-color: var(--color-brand-blue);
}

.category-icon:hover .category-icon__circle {
  background-color: #e8edff;
}

.category-icon__label {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.category-icon__count {
  font-size: var(--text-caption);
  color: var(--color-text-placeholder);
}

.category-icon--active .category-icon__label {
  color: var(--color-brand-blue);
  font-weight: var(--font-weight-semibold);
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

@media (max-width: 576px) {
  .category-icons {
    padding: 2rem 0;
    margin-bottom: 1.6rem;
    border-radius: 0;
  }

  .category-icon__circle {
    width: 5.6rem;
    height: 5.6rem;
  }

  .category-icon__circle--lg {
    width: 7.2rem;
    height: 7.2rem;
  }

  .category-icon__svg {
    width: 2.8rem;
    height: 2.8rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;
  }
}
</style>
