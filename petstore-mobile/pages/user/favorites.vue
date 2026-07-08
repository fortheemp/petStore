<template>
  <view class="container">
    <view v-if="!isLoggedIn" class="empty">
      <view class="empty-circle">
        <text class="empty-circle-icon">♥</text>
      </view>
      <text class="empty-text">请先登录查看收藏</text>
      <view class="empty-btn" @tap="goLogin">
        <text class="empty-btn-text">去登录</text>
      </view>
    </view>

    <template v-else>
      <view v-if="loading" class="empty">
        <text class="empty-text">加载中...</text>
      </view>

      <template v-else>
        <view v-if="favorites.length === 0" class="empty">
          <view class="empty-circle">
            <text class="empty-circle-icon">♡</text>
          </view>
          <text class="empty-text">暂无收藏商品</text>
          <view class="empty-btn" @tap="goShop">
            <text class="empty-btn-text">去逛逛</text>
          </view>
        </view>

        <template v-else>
          <view class="count-bar">
            <text class="count-text">共 {{ favorites.length }} 件收藏</text>
          </view>
          <view class="product-grid">
            <view
              v-for="item in favorites"
              :key="item.id"
              class="product-card"
              @tap="goDetail(item.id)"
            >
              <image
                v-if="item.image"
                class="product-img"
                :src="item.image"
                mode="aspectFill"
              />
              <view v-else class="product-img product-img--empty">
                <text class="product-img-placeholder">暂无图片</text>
              </view>
              <view class="product-info">
                <text class="product-name">{{ item.name }}</text>
                <view class="product-bottom">
                  <text class="product-price">¥{{ item.price.toFixed(2) }}</text>
                  <view class="remove-btn" @tap.stop="removeFavorite(item.id)">
                    <text class="remove-btn-text">删除</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </template>
    </template>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { fetchAllProducts } from '@/services/product'

const userStore = useUserStore()
const isLoggedIn = ref(false)
const loading = ref(true)
const favorites = ref([])

const loadFavorites = async () => {
  loading.value = true
  const ids = uni.getStorageSync('petstore_favorites') || []
  if (!ids.length) {
    favorites.value = []
    loading.value = false
    return
  }
  try {
    const allProducts = await fetchAllProducts()
    favorites.value = allProducts.filter((p) => ids.includes(p.id))
  } catch {
    favorites.value = []
  }
  loading.value = false
}

const removeFavorite = (productId) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏该商品？',
    success: (res) => {
      if (res.confirm) {
        const ids = uni.getStorageSync('petstore_favorites') || []
        const newIds = ids.filter((id) => id !== productId)
        uni.setStorageSync('petstore_favorites', newIds)
        favorites.value = favorites.value.filter((p) => p.id !== productId)
        uni.showToast({ title: '已取消收藏', icon: 'success' })
      }
    }
  })
}

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

const goShop = () => {
  uni.switchTab({ url: '/pages/category/category' })
}

const goLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

onShow(() => {
  isLoggedIn.value = !!userStore.user
  if (isLoggedIn.value) {
    loadFavorites()
  }
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-circle {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.empty-circle-icon {
  font-size: 56rpx;
  color: #1c49c2;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.empty-btn {
  padding: 20rpx 48rpx;
  background: #1c49c2;
  border-radius: 16rpx;
}

.empty-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.count-bar {
  padding: 20rpx 24rpx 0;
}

.count-text {
  font-size: 24rpx;
  color: #999;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx 16rpx 0;
}

.product-card {
  width: calc(50% - 24rpx);
  margin: 8rpx 12rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-img {
  width: 100%;
  aspect-ratio: 1 / 1;
}

.product-img--empty {
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img-placeholder {
  font-size: 24rpx;
  color: #ccc;
}

.product-info {
  padding: 16rpx 20rpx 20rpx;
}

.product-name {
  font-size: 26rpx;
  color: #121212;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 72rpx;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.product-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #bd2848;
}

.remove-btn {
  padding: 6rpx 16rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
}

.remove-btn-text {
  font-size: 22rpx;
  color: #999;
}
</style>
