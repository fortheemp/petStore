<template>
  <AppLayout>
    <div class="shop-detail" v-if="shop">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/shops' }">商店列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ shop.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="shop-header">
        <el-image :src="shop.image" fit="cover" style="width: 100%; height: 300px; border-radius: 12px;">
          <template #error><div class="image-placeholder">🏪</div></template>
        </el-image>
        <h1>{{ shop.name }}</h1>
        <p>📍 {{ shop.address }}</p>
      </div>
      <h2 class="section-title">🐾 本店商品</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="宠物" name="pet" />
        <el-tab-pane label="用品" name="accessory" />
      </el-tabs>
      <el-row :gutter="20">
        <el-col v-for="product in filteredProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
          <ProductCard :product="product" @add-to-cart="handleAddToCart" />
        </el-col>
      </el-row>
      <el-empty v-if="filteredProducts.length === 0" description="暂无商品" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { getShopDetail } from '@/api/shop'
import { getProducts } from '@/api/product'
import { addToCart } from '@/api/cart'
import AppLayout from '@/components/AppLayout.vue'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const shop = ref(null)
const products = ref([])
const activeTab = ref('all')

const filteredProducts = computed(() => {
  if (activeTab.value === 'all') return products.value
  return products.value.filter(p => p.type === activeTab.value)
})

onMounted(async () => {
  try {
    const shopRes = await getShopDetail(route.params.id)
    shop.value = shopRes.data
    const prodRes = await getProducts({ shopId: shop.value.id })
    products.value = prodRes.data || []
  } catch (e) {}
})

async function handleAddToCart(productId) {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); router.push('/login'); return }
  try { await addToCart(userStore.user.id, productId, 1); ElMessage.success('已添加到购物车') } catch (e) {}
}
</script>

<style scoped>
.shop-detail { max-width: 1200px; margin: 0 auto; padding: 20px; }
.shop-header { margin: 20px 0; }
.shop-header h1 { font-size: 28px; margin: 12px 0 4px; }
.shop-header p { color: #666; font-size: 16px; }
.section-title { font-size: 22px; margin: 16px 0 12px; color: #333; }
.image-placeholder { height: 300px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; font-size: 64px; }
</style>