<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategoryCounts, getProducts } from '@/api/product'
import { getAddressList } from '@/api/address'
import { useUserStore } from '@/stores/user'
import AMapLoader from '@amap/amap-jsapi-loader'

const router = useRouter()
const userStore = useUserStore()

const categoryCounts = ref({ _all: 0, dogs: 0, cats: 0, fish: 0, birds: 0, small: 0 })
const hotProducts = ref([])
const shops = ref([])
const loading = ref(true)

const petCategories = ref([
  { name: '狗狗', key: 'dogs', productType: 'pet', color: '#ff6c10' },
  { name: '猫咪', key: 'cats', productType: 'pet', color: '#8b5cf6' },
  { name: '水族', key: 'fish', productType: 'supply', color: '#1c49c2' },
  { name: '鸟类', key: 'birds', productType: 'supply', color: '#00a651' },
  { name: '小宠', key: 'small', productType: 'supply', color: '#e67e22' },
])

const loadNearbyShops = async (lng, lat) => {
  try {
    window._AMapSecurityConfig = { securityJsCode: '14895041b0729be0b72daa42d8c6fc15' }
    const AMap = await AMapLoader.load({
      key: 'e6579887e28a5e152a6353a57a61e8fe',
      version: '2.0',
      plugins: ['AMap.PlaceSearch'],
    })
    const placeSearch = new AMap.PlaceSearch({ pageSize: 3, pageIndex: 1, extensions: 'all' })
    const center = new AMap.LngLat(lng, lat)
    placeSearch.searchNearBy('宠物', center, 5000, (status, result) => {
      if (status === 'complete' && result.poiList?.pois) {
        shops.value = result.poiList.pois.map((poi) => ({
          id: `poi_${poi.id}`,
          name: poi.name,
          address: poi.address || poi.cityname + poi.adname,
          lng: poi.location?.lng,
          lat: poi.location?.lat,
          phone: poi.tel,
        }))
      }
    })
  } catch {}
}

const locateAndLoadShops = async () => {
  if (!userStore.isLoggedIn) return
  try {
    const userId = userStore.userInfo?.id
    if (!userId) return
    const res = await getAddressList(userId)
    const list = Array.isArray(res) ? res : []
    const addr = list.find((a) => a.isDefault === 1) || list[0]
    if (!addr) return
    const fullAddr = [addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join('')

    window._AMapSecurityConfig = { securityJsCode: '14895041b0729be0b72daa42d8c6fc15' }
    const AMap = await AMapLoader.load({
      key: 'e6579887e28a5e152a6353a57a61e8fe',
      version: '2.0',
      plugins: ['AMap.Geocoder'],
    })
    const geocoder = new AMap.Geocoder()
    geocoder.getLocation(fullAddr, (status, result) => {
      if (status === 'complete' && result.geocodes?.length) {
        const loc = result.geocodes[0].location
        loadNearbyShops(loc.lng, loc.lat)
      }
    })
  } catch {}
}

onMounted(async () => {
  try {
    const counts = await getCategoryCounts()
    categoryCounts.value = counts
  } catch {}

  try {
    const res = await getProducts({ pageSize: 8, sort: 'default' })
    hotProducts.value = res.list || []
  } catch {}

  locateAndLoadShops()

  loading.value = false
})

const goToProducts = () => router.push('/products')
const goToCategory = (cat) => router.push({ path: '/products', query: { productType: cat.productType, category: cat.key } })
const goToProduct = (id) => router.push(`/products/${id}`)
const goToShops = () => router.push('/nearby-shops')

const formatPrice = (p) => Number(p).toFixed(0)
</script>

<template>
  <div class="home">
    <!-- Hero 横幅 -->
    <section class="hero">
      <div class="hero__decorations">
        <span class="hero__circle hero__circle--1"></span>
        <span class="hero__circle hero__circle--2"></span>
        <span class="hero__circle hero__circle--3"></span>
        <span class="hero__dots"></span>
      </div>
      <div class="container hero__inner">
        <div class="hero__content">
          <span class="hero__badge">精选好物 · 品质保障</span>
          <h1 class="hero__title">为你的毛孩子<br />挑选最好的</h1>
          <p class="hero__subtitle">
            精选优质宠物食品、玩具和用品，让每一只宠物都健康快乐
          </p>
          <div class="hero__actions">
            <el-button type="primary" size="large" class="hero__btn-primary" @click="goToProducts">
              立即选购
            </el-button>
            <el-button size="large" class="hero__btn-secondary" @click="goToShops">
              附近商店
            </el-button>
          </div>
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-value">{{ categoryCounts._all || '100+' }}</span>
              <span class="hero__stat-label">在售商品</span>
            </div>
            <div class="hero__stat-divider"></div>
            <div class="hero__stat">
              <span class="hero__stat-value">5</span>
              <span class="hero__stat-label">宠物分类</span>
            </div>
            <div class="hero__stat-divider"></div>
            <div class="hero__stat">
              <span class="hero__stat-value">100%</span>
              <span class="hero__stat-label">正品保证</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类入口 -->
    <section class="categories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">按宠物分类</h2>
          <router-link to="/products" class="section-link">查看全部 →</router-link>
        </div>
        <div class="categories__grid">
          <button
            v-for="cat in petCategories"
            :key="cat.key"
            class="category-card"
            @click="goToCategory(cat)"
          >
            <span class="category-card__icon" :style="{ background: cat.color + '12', color: cat.color }">
              <!-- 狗 -->
              <svg v-if="cat.key === 'dogs'" width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="24" cy="26" r="12"/>
                <path d="M12 14c-1-4 0-9 3-11 1.5 2 3 3 5 3h8c2 0 3.5-1 5-3 3 2 4 7 3 11"/>
                <circle cx="19" cy="24" r="1.5" fill="currentColor"/>
                <circle cx="29" cy="24" r="1.5" fill="currentColor"/>
                <ellipse cx="24" cy="29" rx="2" ry="1.5" fill="currentColor"/>
                <path d="M21 32c1.5 1.5 4.5 1.5 6 0"/>
              </svg>
              <!-- 猫 -->
              <svg v-else-if="cat.key === 'cats'" width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="24" cy="28" r="12"/>
                <path d="M14 16l-2-10 7 8"/>
                <path d="M34 16l2-10-7 8"/>
                <circle cx="19" cy="26" r="1.5" fill="currentColor"/>
                <circle cx="29" cy="26" r="1.5" fill="currentColor"/>
                <ellipse cx="24" cy="30" rx="1.5" ry="1" fill="currentColor"/>
                <path d="M22 32c1 1.2 3 1.2 4 0"/>
              </svg>
              <!-- 鱼 -->
              <svg v-else-if="cat.key === 'fish'" width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 24c4-8 12-10 18-10 4 0 8 1 10 3-3 3-5 7-5 10s2 7 5 10c-2 2-6 3-10 3-6 0-14-2-18-10z"/>
                <circle cx="18" cy="24" r="2" fill="currentColor"/>
                <path d="M36 18c4-2 8-1 10 1-2 4-4 7-6 9"/>
                <path d="M36 30c4 2 8 1 10-1"/>
              </svg>
              <!-- 鸟 -->
              <svg v-else-if="cat.key === 'birds'" width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M24 8c-5 0-10 4-10 10 0 2 .5 4 1.5 5.5C12 25 10 28 10 32h28c0-4-2-7-5.5-8.5 1-1.5 1.5-3.5 1.5-5.5 0-6-5-10-10-10z"/>
                <circle cx="20" cy="19" r="1.5" fill="currentColor"/>
                <path d="M24 23v3"/>
                <path d="M18 36h12"/>
                <path d="M20 32h8"/>
              </svg>
              <!-- 小宠 -->
              <svg v-else width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="24" cy="30" r="10"/>
                <path d="M18 10c-1-5 1-9 4-10 0 3 1 6 2 7"/>
                <path d="M30 10c1-5-1-9-4-10 0 3-1 6-2 7"/>
                <circle cx="20" cy="28" r="1.5" fill="currentColor"/>
                <circle cx="28" cy="28" r="1.5" fill="currentColor"/>
                <ellipse cx="24" cy="32" rx="1.5" ry="1" fill="currentColor"/>
                <path d="M22 34c1 1 3 1 4 0"/>
              </svg>
            </span>
            <span class="category-card__name">{{ cat.name }}</span>
            <span class="category-card__count">{{ categoryCounts[cat.key] || 0 }}+ 商品</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 热门商品 -->
    <section class="hot-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热门推荐</h2>
          <router-link to="/products" class="section-link">查看全部 →</router-link>
        </div>
        <!-- 骨架屏 -->
        <div v-if="loading" class="products-grid">
          <div v-for="i in 4" :key="i" class="skeleton-home-card">
            <div class="skeleton-home-card__img"></div>
            <div class="skeleton-home-card__title"></div>
            <div class="skeleton-home-card__line"></div>
          </div>
        </div>
        <div v-else class="products-grid">
          <div
            v-for="product in hotProducts"
            :key="product.id"
            class="product-card"
            @click="goToProduct(product.id)"
          >
            <div class="product-card__image">
              <img v-if="product.image" :src="product.image" :alt="product.name" />
              <div v-else class="product-card__placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </div>
            </div>
            <div class="product-card__body">
              <h3 class="product-card__name">{{ product.name }}</h3>
              <div class="product-card__bottom">
                <span class="product-card__price">¥{{ formatPrice(product.price) }}</span>
                <span class="product-card__rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffa500" stroke="#ffa500" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {{ product.rating?.toFixed(1) || '4.5' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 附近商店 -->
    <section class="nearby-shops" v-if="shops.length">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">附近商店</h2>
          <button class="section-link" @click="goToShops">查看全部 →</button>
        </div>
        <div class="shops-grid">
          <div
            v-for="shop in shops"
            :key="shop.id"
            class="shop-card"
            @click="goToShops"
          >
            <div class="shop-card__image">
              <div class="shop-card__placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            </div>
            <div class="shop-card__body">
              <h3 class="shop-card__name">{{ shop.name }}</h3>
              <p class="shop-card__address">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ shop.address }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色服务 -->
    <section class="features">
      <div class="container">
        <div class="features__grid">
          <div class="feature-item">
            <div class="feature-item__icon feature-item__icon--blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div>
              <h4 class="feature-item__title">快速配送</h4>
              <p class="feature-item__desc">满 199 元包邮，次日达</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item__icon feature-item__icon--green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <div>
              <h4 class="feature-item__title">正品保证</h4>
              <p class="feature-item__desc">100% 正品，假一赔十</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item__icon feature-item__icon--orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
            </div>
            <div>
              <h4 class="feature-item__title">专业客服</h4>
              <p class="feature-item__desc">7×24 小时在线服务</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-item__icon feature-item__icon--red">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            </div>
            <div>
              <h4 class="feature-item__title">无忧退换</h4>
              <p class="feature-item__desc">30 天无理由退换货</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 骨架屏 */
.skeleton-home-card {
  background: #fff;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 1.6rem;
}

.skeleton-home-card__img {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f0f0f0;
  border-radius: 0.8rem;
  margin-bottom: 1.2rem;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-home-card__img--shop {
  aspect-ratio: 16 / 9;
}

.skeleton-home-card__title {
  height: 1.6rem;
  width: 70%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 0.8rem;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-home-card__line {
  height: 1.2rem;
  width: 50%;
  background: #f0f0f0;
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ========== Hero 区块 ========== */
.hero {
  background: linear-gradient(135deg, #eef2ff 0%, #fff5eb 50%, #f0f7ff 100%);
  padding: var(--spacing-16) 0 var(--spacing-12);
  position: relative;
  overflow: hidden;
}

.hero__decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
}

.hero__circle--1 {
  width: 320px;
  height: 320px;
  background: var(--color-brand-orange);
  top: -80px;
  right: 10%;
}

.hero__circle--2 {
  width: 200px;
  height: 200px;
  background: var(--color-brand-blue);
  bottom: -60px;
  right: 25%;
}

.hero__circle--3 {
  width: 120px;
  height: 120px;
  background: var(--color-success);
  top: 30%;
  left: 5%;
}

.hero__dots {
  position: absolute;
  top: 20%;
  right: 5%;
  width: 160px;
  height: 160px;
  background-image: radial-gradient(circle, var(--color-brand-blue) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
  opacity: 0.1;
}

.hero__inner {
  position: relative;
  z-index: 1;
}

.hero__content {
  max-width: 640px;
}

.hero__badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(28, 73, 194, 0.08);
  color: var(--color-brand-blue);
  border-radius: 20px;
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-5);
}

.hero__title {
  font-size: 4.8rem;
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.hero__subtitle {
  font-size: var(--text-body-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin-bottom: var(--spacing-8);
  max-width: 48rem;
}

.hero__actions {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-10);
}

.hero__btn-primary {
  height: 4.8rem;
  padding: 0 var(--spacing-8);
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  background-color: var(--color-brand-orange);
  border-color: var(--color-brand-orange);
}

.hero__btn-primary:hover {
  background-color: var(--color-brand-orange-hover);
  border-color: var(--color-brand-orange-hover);
}

.hero__btn-secondary {
  height: 4.8rem;
  padding: 0 var(--spacing-8);
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
}

.hero__stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero__stat-value {
  font-size: var(--text-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-brand-blue);
}

.hero__stat-label {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.hero__stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

/* ========== 通用区块头 ========== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.section-title {
  font-size: var(--text-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.section-link {
  font-size: var(--text-body-sm);
  color: var(--color-brand-blue);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  background: none;
  border: none;
  transition: color var(--transition-fast);
}

.section-link:hover {
  color: var(--color-brand-blue-hover);
}

/* ========== 分类区块 ========== */
.categories {
  padding: var(--spacing-12) 0;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-5);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-8) var(--spacing-4);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--transition-normal);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-brand-blue);
}

.category-card:active {
  transform: translateY(-2px) scale(0.97);
  box-shadow: var(--shadow-sm);
}

.category-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7.2rem;
  height: 7.2rem;
  border-radius: var(--radius-full);
  transition: transform var(--transition-normal);
}

.category-card:hover .category-card__icon {
  transform: scale(1.1);
}

.category-card__name {
  font-size: var(--text-body-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.category-card__count {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

/* ========== 热门商品 ========== */
.hot-products {
  padding: var(--spacing-4) 0 var(--spacing-12);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-5);
}

.product-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-card__image {
  width: 100%;
  aspect-ratio: 1;
  background: #f8f8f8;
  overflow: hidden;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.product-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__body {
  padding: var(--spacing-4);
}

.product-card__name {
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-card__price {
  font-size: var(--text-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-price-primary);
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

/* ========== 附近商店 ========== */
.nearby-shops {
  padding: var(--spacing-4) 0 var(--spacing-12);
}

.shops-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-5);
}

.shop-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.shop-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.shop-card__image {
  width: 100%;
  height: 180px;
  background: #f0f0f0;
  overflow: hidden;
}

.shop-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shop-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.shop-card__body {
  padding: var(--spacing-4) var(--spacing-5);
}

.shop-card__name {
  font-size: var(--text-body-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.shop-card__address {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
}

/* ========== 特色服务 ========== */
.features {
  padding: var(--spacing-10) 0;
  background-color: var(--color-bg-secondary);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-5);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.feature-item__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-item__icon--blue { background: rgba(28, 73, 194, 0.1); color: var(--color-brand-blue); }
.feature-item__icon--green { background: rgba(0, 166, 81, 0.1); color: var(--color-success); }
.feature-item__icon--orange { background: rgba(255, 108, 16, 0.1); color: var(--color-brand-orange); }
.feature-item__icon--red { background: rgba(189, 40, 72, 0.1); color: var(--color-price-primary); }

.feature-item__title {
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-1);
}

.feature-item__desc {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
}

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .hero__title {
    font-size: 3.6rem;
  }

  .categories__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .shops-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .hero__title {
    font-size: 2.8rem;
  }

  .hero__stats {
    gap: var(--spacing-4);
  }

  .hero__stat-value {
    font-size: var(--text-h3);
  }

  .categories__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .shops-grid {
    grid-template-columns: 1fr;
  }

  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
