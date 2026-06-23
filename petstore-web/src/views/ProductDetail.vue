<template>
  <AppLayout>
    <div class="product-detail" v-if="product">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/shop/${product.shopId}` }">商店</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-main">
        <div class="detail-image">
          <el-image :src="product.image" fit="cover" style="width: 100%; height: 400px; border-radius: 12px;">
            <template #error><div class="image-placeholder">🐾</div></template>
          </el-image>
        </div>
        <div class="detail-info">
          <el-tag :type="product.type === 'pet' ? 'success' : ''" size="large">
            {{ product.type === 'pet' ? '宠物' : '用品' }}
          </el-tag>
          <h1>{{ product.name }}</h1>
          <div class="price">¥{{ product.price }}</div>
          <div class="stock">库存: {{ product.stock }} 件</div>
          <p class="desc">{{ product.description || '暂无描述' }}</p>
          <div class="actions">
            <el-input-number v-model="quantity" :min="1" :max="product.stock" size="large" />
            <el-button type="primary" size="large" @click="handleAddToCart" style="margin-left: 12px;">
              <el-icon><ShoppingCartFull /></el-icon> 加入购物车
            </el-button>
          </div>
          <div class="actions" style="margin-top: 12px;">
            <el-button type="success" size="large" @click="handleBuyNow" :disabled="product.stock <= 0">
              立即购买
            </el-button>
          </div>
        </div>
      </div>

      <!-- Related Video -->
      <div v-if="product.videoId" class="video-section">
        <h2>📹 相关视频</h2>
        <video v-if="videoUrl" :src="videoUrl" controls style="max-width: 600px; width: 100%; border-radius: 8px;"></video>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { ShoppingCartFull } from '@element-plus/icons-vue'
import { getProductDetail } from '@/api/product'
import { addToCart } from '@/api/cart'
import { getVideoDetail } from '@/api/video'
import AppLayout from '@/components/AppLayout.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const product = ref(null)
const quantity = ref(1)
const videoUrl = ref('')

onMounted(async () => {
  try {
    const res = await getProductDetail(route.params.id)
    product.value = res.data
    if (product.value.videoId) {
      try {
        const vRes = await getVideoDetail(product.value.videoId)
        videoUrl.value = vRes.data.url
      } catch (e) {}
    }
  } catch (e) {}
})

async function handleAddToCart() {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); router.push('/login'); return }
  try {
    await addToCart(userStore.user.id, product.value.id, quantity.value)
    ElMessage.success('已添加到购物车')
  } catch (e) {}
}

function handleBuyNow() {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); router.push('/login'); return }
  handleAddToCart()
  router.push('/cart')
}
</script>

<style scoped>
.product-detail { max-width: 1200px; margin: 0 auto; padding: 20px; }
.detail-main { display: flex; gap: 40px; margin: 24px 0; flex-wrap: wrap; }
.detail-image { flex: 1; min-width: 350px; }
.detail-info { flex: 1; min-width: 350px; }
.detail-info h1 { font-size: 28px; margin: 12px 0; }
.price { font-size: 32px; color: #f56c6c; font-weight: bold; margin: 12px 0; }
.stock { color: #999; margin-bottom: 12px; }
.desc { color: #666; line-height: 1.8; margin: 16px 0; font-size: 15px; }
.actions { display: flex; align-items: center; }
.video-section { margin-top: 40px; }
.video-section h2 { font-size: 20px; margin-bottom: 12px; }
.image-placeholder { height: 400px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; font-size: 80px; }
</style>