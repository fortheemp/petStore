<template>
  <AppLayout>
    <div class="home">
      <!-- Hero Banner -->
      <div class="hero">
        <div class="hero-content">
          <h1>🐾 欢迎来到宠物商店</h1>
          <p>发现你的人生伙伴，给宠物一个温暖的家</p>
          <el-button type="primary" size="large" @click="$router.push('/shops')">浏览商店</el-button>
        </div>
      </div>

      <!-- Map Section -->
      <div class="section">
        <h2 class="section-title">📍 附近商店</h2>
        <MapView :shops="shops" :center="[39.92, 116.46]" />
      </div>

      <!-- Products Section -->
      <div class="section">
        <h2 class="section-title">🐶 热门宠物</h2>
        <el-row :gutter="20">
          <el-col v-for="product in petProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
            <ProductCard :product="product" @add-to-cart="handleAddToCart" />
          </el-col>
        </el-row>
      </div>

      <div class="section">
        <h2 class="section-title">🛍️ 精选用品</h2>
        <el-row :gutter="20">
          <el-col v-for="product in accessoryProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
            <ProductCard :product="product" @add-to-cart="handleAddToCart" />
          </el-col>
        </el-row>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { getNearbyShops } from '@/api/shop'
import { getProducts } from '@/api/product'
import { addToCart } from '@/api/cart'
import AppLayout from '@/components/AppLayout.vue'
import MapView from '@/components/MapView.vue'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const userStore = useUserStore()
const shops = ref([])
const petProducts = ref([])
const accessoryProducts = ref([])

onMounted(async () => {
  try {
    const shopRes = await getNearbyShops(39.92, 116.46)
    shops.value = shopRes.data || []
  } catch (e) { /* ignore */ }

  try {
    const petRes = await getProducts({ type: 'pet' })
    petProducts.value = (petRes.data || []).slice(0, 4)
  } catch (e) { /* ignore */ }

  try {
    const accessoryRes = await getProducts({ type: 'accessory' })
    accessoryProducts.value = (accessoryRes.data || []).slice(0, 4)
  } catch (e) { /* ignore */ }
})

async function handleAddToCart(productId) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  try {
    await addToCart(userStore.user.id, productId, 1)
    ElMessage.success('已添加到购物车')
  } catch (e) { /* ignore */ }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 80px 40px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 32px;
}
.hero h1 { font-size: 36px; margin-bottom: 12px; color: #333; }
.hero p { font-size: 18px; color: #666; margin-bottom: 24px; }
.section { margin-bottom: 40px; }
.section-title { font-size: 22px; margin-bottom: 16px; color: #333; padding-left: 8px; border-left: 4px solid #667eea; }
</style>