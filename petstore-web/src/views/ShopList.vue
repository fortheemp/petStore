<template>
  <AppLayout>
    <div class="shop-page">
      <h2 class="page-title">🏪 宠物商店列表</h2>
      <el-row :gutter="20">
        <el-col v-for="shop in shops" :key="shop.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card shadow="hover" class="shop-card" @click="$router.push(`/shop/${shop.id}`)">
            <el-image :src="shop.image" fit="cover" style="height: 180px; width: 100%; border-radius: 8px;">
              <template #error>
                <div class="image-placeholder">🏪</div>
              </template>
            </el-image>
            <div class="shop-info">
              <h3>{{ shop.name }}</h3>
              <p class="address">📍 {{ shop.address }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-if="shops.length === 0" description="暂无商店" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNearbyShops } from '@/api/shop'
import AppLayout from '@/components/AppLayout.vue'

const shops = ref([])
onMounted(async () => {
  try { const res = await getNearbyShops(39.92, 116.46); shops.value = res.data || [] } catch (e) {}
})
</script>

<style scoped>
.shop-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; color: #333; }
.shop-card { margin-bottom: 20px; cursor: pointer; transition: transform 0.2s; }
.shop-card:hover { transform: translateY(-4px); }
.shop-info { padding: 12px 0 0; }
.shop-info h3 { font-size: 18px; margin-bottom: 4px; }
.shop-info .address { color: #999; font-size: 14px; }
.image-placeholder { height: 180px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; font-size: 48px; }
</style>