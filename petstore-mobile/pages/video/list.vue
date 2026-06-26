<template>
  <view class="container">
    <scroll-view scroll-y class="video-list">
      <view v-if="videos.length > 0">
        <view
          class="video-card"
          v-for="video in videos"
          :key="video.id"
          @tap="playVideo(video)"
        >
          <view class="video-cover">
            <view class="cover-placeholder">
              <text class="cover-text">{{ video.title.charAt(0) }}</text>
            </view>
            <view class="play-overlay">
              <view class="play-btn">
                <text class="play-icon">▶</text>
              </view>
            </view>
            <view class="duration-badge">
              <text class="duration-text">{{ video.duration }}</text>
            </view>
          </view>
          <view class="video-info">
            <text class="video-title">{{ video.title }}</text>
            <view class="video-meta">
              <text class="views">▶ {{ formatViews(video.views) }}次播放</text>
              <text class="date">{{ video.date }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty">
        <text class="empty-icon">-</text>
        <text class="empty-text">暂无视频</text>
        <text class="empty-hint">精彩内容即将上线</text>
      </view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref } from 'vue'
const mockVideos = [
  { id: 1, title: '柯基犬的快乐日常', cover: '', duration: '03:25', views: 12800, date: '2025-12-20' },
  { id: 2, title: '猫咪逗猫棒挑战', cover: '', duration: '02:18', views: 8900, date: '2025-12-18' },
  { id: 3, title: '金毛寻回犬训练教程', cover: '', duration: '05:42', views: 15600, date: '2025-12-15' },
  { id: 4, title: '仓鼠的迷宫冒险', cover: '', duration: '01:55', views: 6700, date: '2025-12-12' },
  { id: 5, title: '热带鱼缸造景教程', cover: '', duration: '04:30', views: 4300, date: '2025-12-10' },
]

const videos = ref(mockVideos)

const formatViews = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toLocaleString()
}

const playVideo = (video) => {
  uni.showToast({ title: '播放: ' + video.title, icon: 'none' })
}
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 160rpx;
}

.video-list {
  height: 100vh;
  padding: 20rpx 24rpx;
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
  height: 360rpx;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-text {
  font-size: 60rpx;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.06);
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

.empty-icon {
  font-size: 60rpx;
  margin-bottom: 24rpx;
  color: #ccc;
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
