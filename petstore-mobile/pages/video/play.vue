<template>
  <view class="container">
    <view class="player-wrap">
      <video
        v-if="videoUrl"
        class="player"
        :src="videoUrl"
        :autoplay="true"
        controls
        show-fullscreen-btn
        show-play-btn
        show-center-play-btn
        enable-progress-gesture
        object-fit="contain"
      />
      <view v-else class="player-placeholder">
        <text class="player-placeholder-icon">▶</text>
        <text class="player-placeholder-text">暂无视频源</text>
      </view>
    </view>

    <view class="info-card" v-if="video">
      <text class="video-title">{{ video.title }}</text>
      <view class="video-meta">
        <text class="meta-item" v-if="video.author">{{ video.author }}</text>
        <text class="meta-item">{{ formatDate(video.createdAt) }}</text>
      </view>
      <view class="video-desc" v-if="video.description">
        <text class="desc-text">{{ video.description }}</text>
      </view>
    </view>

    <view class="product-card" v-if="video?.relatedProduct" @tap="goProduct">
      <image
        v-if="video.relatedProduct.image"
        class="product-img"
        :src="fixImageUrl(video.relatedProduct.image)"
        mode="aspectFill"
      />
      <view class="product-info">
        <text class="product-name">{{ video.relatedProduct.name }}</text>
        <text class="product-price">¥{{ video.relatedProduct.price }}</text>
      </view>
      <text class="product-arrow">></text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getVideoById } from '@/services/video'
import { fixImageUrl } from '@/services/request'

const video = ref(null)
const videoUrl = ref('')

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}

const goProduct = () => {
  if (video.value?.relatedProduct?.id) {
    uni.navigateTo({ url: '/pages/product/detail?id=' + video.value.relatedProduct.id })
  }
}

let firstShow = true
onShow(async () => {
  if (!firstShow) return
  firstShow = false
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const opts = page?.$page?.options || page?.options || {}
  const id = Number(opts.id)
  if (!id) return
  try {
    const res = await getVideoById(id)
    if (res) {
      video.value = res
      videoUrl.value = fixImageUrl(res.url || '')
    }
  } catch {}
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
}

.player-wrap {
  width: 100%;
  background: #000;
}

.player {
  width: 100%;
  height: 420rpx;
}

.player-placeholder {
  width: 100%;
  height: 420rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a1a2e;
}

.player-placeholder-icon {
  font-size: 80rpx;
  color: rgba(255,255,255,0.3);
  margin-bottom: 16rpx;
}

.player-placeholder-text {
  font-size: 28rpx;
  color: rgba(255,255,255,0.5);
}

.info-card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 28rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.video-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #121212;
  display: block;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.video-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}

.video-desc {
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.desc-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.7;
}

.product-card {
  background: #fff;
  margin: 20rpx 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
}

.product-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-left: 20rpx;
  min-width: 0;
}

.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #121212;
  display: block;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #bd2848;
  display: block;
}

.product-arrow {
  font-size: 28rpx;
  color: #ccc;
  margin-left: 12rpx;
}
</style>
