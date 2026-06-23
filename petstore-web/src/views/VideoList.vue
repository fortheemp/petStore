<template>
  <AppLayout>
    <div class="video-page">
      <h2 class="page-title">🎬 宠物视频</h2>
      <el-row :gutter="20">
        <el-col v-for="video in videos" :key="video.id" :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="video-card">
            <video :src="video.url" controls style="width: 100%; border-radius: 8px"></video>
            <div class="video-info">
              <h4>{{ video.title }}</h4>
              <p v-if="video.productId" class="link" @click="$router.push(`/product/${video.productId}`)">查看关联商品 →</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-if="videos.length === 0" description="暂无视频" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getVideos } from '@/api/video'
import AppLayout from '@/components/AppLayout.vue'

const videos = ref([])
onMounted(async () => {
  try { const res = await getVideos(); videos.value = res.data || [] } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.video-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; color: #333; }
.video-card { margin-bottom: 20px; }
.video-info { padding: 12px 0 0; }
.video-info h4 { font-size: 16px; margin-bottom: 4px; }
.video-info .link { color: #667eea; cursor: pointer; font-size: 14px; }
</style>