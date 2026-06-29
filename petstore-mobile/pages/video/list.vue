<template>
  <view class="container">
    <view class="video-list">
      <view v-if="loading" class="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="videos.length > 0">
        <view
          class="video-card"
          v-for="(video, idx) in videos"
          :key="video.id"
          @tap="playVideo(video)"
        >
          <view class="video-cover">
            <image
              v-if="video.cover"
              class="cover-img"
              :src="fixImageUrl(video.cover)"
              mode="aspectFill"
            />
            <view
              v-else
              class="cover-placeholder"
              :style="{ background: coverThemes[idx % coverThemes.length].bg }"
            >
              <text class="cover-emoji">{{ coverThemes[idx % coverThemes.length].icon }}</text>
            </view>
            <view class="play-overlay">
              <view class="play-btn">
                <text class="play-icon">▶</text>
              </view>
            </view>
            <view class="duration-badge" v-if="video.duration">
              <text class="duration-text">{{ video.duration }}</text>
            </view>
          </view>
          <view class="video-info">
            <text class="video-title">{{ video.title }}</text>
            <view class="video-meta">
              <text class="views">▶ {{ formatViews(video.viewCount) }}次播放</text>
              <text class="date">{{ formatDate(video.createdAt) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty">
        <view class="empty-icon-wrap">
          <image class="empty-icon-img" src="/static/icons/video-empty.png" mode="aspectFit" />
        </view>
        <text class="empty-text">暂无视频</text>
        <text class="empty-hint">精彩内容即将上线</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getVideoList } from '@/services/video'
import { fixImageUrl } from '@/services/request'

const videos = ref([])
const loading = ref(true)

const coverThemes = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🐱' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🐕' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '🐾' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '🎾' },
]

const formatViews = (count) => {
  if (!count) return '0'
  if (count >= 10000) return (count / 10000).toFixed(1) + 'w'
  return count.toLocaleString()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}

const playVideo = (video) => {
  uni.navigateTo({ url: '/pages/video/play?id=' + video.id })
}

onShow(async () => {
  loading.value = true
  try {
    const res = await getVideoList()
    videos.value = Array.isArray(res) ? res : []
  } catch {
    videos.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0 24rpx;
}

.video-list {
  padding: 20rpx 0;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 200rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.video-card {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.video-cover {
  position: relative;
  width: 100%;
  height: 280rpx;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-emoji {
  font-size: 80rpx;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn {
  width: 88rpx;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.play-icon {
  color: #1c49c2;
  font-size: 36rpx;
  margin-left: 4rpx;
}

.duration-badge {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 8rpx;
  padding: 4rpx 14rpx;
}

.duration-text {
  color: #fff;
  font-size: 22rpx;
}

.video-info {
  padding: 20rpx 24rpx 24rpx;
}

.video-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #121212;
  display: block;
  margin-bottom: 12rpx;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.views {
  font-size: 24rpx;
  color: #999;
}

.date {
  font-size: 24rpx;
  color: #bbb;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0;
}

.empty-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.empty-icon-img {
  width: 60rpx;
  height: 60rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #999;
}
</style>
