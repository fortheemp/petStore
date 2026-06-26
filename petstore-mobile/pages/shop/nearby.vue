<template>
  <view class="container">
    <view class="search-bar">
      <view class="search-wrap">
        <text class="search-icon">Q</text>
        <input
          class="search-input"
          placeholder="搜索附近宠物店..."
          v-model="keyword"
          @confirm="onSearch"
        />
      </view>
    </view>

    <scroll-view scroll-y class="shop-list">
      <view v-if="filteredShops.length > 0">
        <view
          class="shop-card"
          v-for="shop in filteredShops"
          :key="shop.id"
          @tap="goDetail(shop.id)"
        >
          <view class="card-body">
            <view class="card-left">
              <view class="shop-avatar">
                <text class="avatar-text">{{ shop.name.charAt(0) }}</text>
              </view>
            </view>
            <view class="card-right">
              <text class="shop-name">{{ shop.name }}</text>
              <text class="shop-address">{{ shop.address }}</text>
              <view class="shop-bottom">
                <text class="shop-distance">{{ shop.distance }}</text>
                <view class="rating-wrap">
                  <text class="star">★</text>
                  <text class="shop-rating">{{ shop.rating }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="card-footer">
            <view class="detail-btn" @tap.stop="goDetail(shop.id)">
              <text class="detail-btn-text">查看详情</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty">
        <text class="empty-icon">-</text>
        <text class="empty-text">未找到相关店铺</text>
        <text class="empty-hint">试试其他关键词</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
const mockShops = [
  { id: 1, name: '皇家宠物旗舰店', address: '朝阳区宠物大道100号', distance: '1.2km', rating: 4.8 },
  { id: 2, name: '渴望官方旗舰店', address: '海淀区宠物路200号', distance: '2.5km', rating: 4.9 },
  { id: 3, name: '爱宠生活馆', address: '西城区宠物街50号', distance: '0.8km', rating: 4.6 },
  { id: 4, name: '萌宠乐园', address: '东城区动物路88号', distance: '3.1km', rating: 4.7 },
  { id: 5, name: '喵星人用品店', address: '丰台区猫咪巷12号', distance: '1.8km', rating: 4.8 },
]

const keyword = ref('')

const filteredShops = computed(() => {
  if (!keyword.value.trim()) return mockShops
  const kw = keyword.value.trim().toLowerCase()
  return mockShops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(kw) ||
      shop.address.toLowerCase().includes(kw)
  )
})

const onSearch = () => {
  // search is reactive via computed
}

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/shop/detail?id=${id}` })
}
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
}

.search-bar {
  padding: 20rpx 24rpx;
  background: #fff;
}

.search-wrap {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 24rpx;
  height: 72rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  height: 72rpx;
  line-height: 72rpx;
}

.shop-list {
  height: calc(100vh - 112rpx);
  padding: 20rpx 24rpx;
}

.shop-card {
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-body {
  display: flex;
  padding: 24rpx;
}

.card-left {
  margin-right: 20rpx;
  flex-shrink: 0;
}

.shop-avatar {
  width: 96rpx;
  height: 96rpx;
  background: #f0f4ff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #1c49c2;
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 96rpx;
}

.shop-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #121212;
  display: block;
  margin-bottom: 8rpx;
}

.shop-address {
  font-size: 24rpx;
  color: #4d4d4d;
  display: block;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-distance {
  font-size: 24rpx;
  color: #1c49c2;
  font-weight: 500;
}

.rating-wrap {
  display: flex;
  align-items: center;
}

.star {
  font-size: 22rpx;
  margin-right: 4rpx;
}

.shop-rating {
  font-size: 24rpx;
  color: #ff6c10;
  font-weight: 500;
}

.card-footer {
  border-top: 1rpx solid #f0f0f0;
  padding: 16rpx 24rpx;
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  background: #ff6c10;
  border-radius: 12rpx;
  padding: 0 32rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-btn-text {
  color: #fff;
  font-size: 24rpx;
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
