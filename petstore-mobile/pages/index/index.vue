<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="header__top">
        <view class="header__logo" @tap="goHome">
          <image class="header__logo-img" src="/static/icons/paw.png" mode="aspectFit" />
          <text class="header__brand">PetStore</text>
        </view>
        <view class="header__actions">
          <view class="header__action" @tap="goToUser">
            <view class="header__icon-circle">
              <image class="header__icon-img" src="/static/icons/user.png" mode="aspectFit" />
            </view>
          </view>
          <view class="header__action" @tap="goToCart">
            <view class="header__icon-circle">
              <image class="header__icon-img" src="/static/icons/cart.png" mode="aspectFit" />
            </view>
            <view v-if="cartCount > 0" class="header__badge">
              <text class="header__badge-text">{{ cartCount > 99 ? '99+' : cartCount }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="header__search" @tap="goToSearch">
        <image class="header__search-icon" src="/static/icons/search.png" mode="aspectFit" />
        <text class="header__search-placeholder">搜索宠物食品、玩具、用品...</text>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      <!-- Hero -->
      <view class="hero">
        <view class="hero__content">
          <text class="hero__badge">精选好物 · 品质保障</text>
          <text class="hero__title">为你的毛孩子挑选最好的</text>
          <text class="hero__subtitle">精选优质宠物食品、玩具和用品，让每一只宠物都健康快乐</text>
          <view class="hero__actions">
            <view class="hero__btn hero__btn--primary" @tap="goToList()">
              <text class="hero__btn-text">立即选购</text>
            </view>
            <view class="hero__btn hero__btn--outline" @tap="goToList('', 'pet')">
              <text class="hero__btn-text-outline">查看全部</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Categories -->
      <view class="section">
        <view class="section__container">
          <view class="section-header">
            <view class="section-header__left">
              <view class="section-header__accent"></view>
              <text class="section-header__title">按宠物分类</text>
            </view>
          </view>
          <view class="category-grid">
            <view class="category-card" v-for="cat in categories" :key="cat.key" @tap="goToList(cat.category, cat.productType)">
              <view class="category-card__icon" :style="{ background: cat.bg }">
                <image class="category-card__icon-img" :src="cat.icon" mode="aspectFit" />
              </view>
              <text class="category-card__name">{{ cat.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Features -->
      <view class="section">
        <view class="section__container">
          <view class="features-grid">
            <view class="feature-item" v-for="f in features" :key="f.label">
              <view class="feature-item__icon" :style="{ background: f.bg }">
                <image class="feature-item__icon-img" :src="f.icon" mode="aspectFit" />
              </view>
              <view class="feature-item__info">
                <text class="feature-item__title">{{ f.label }}</text>
                <text class="feature-item__desc">{{ f.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Hot Products -->
      <view class="section">
        <view class="section__container">
          <view class="section-header">
            <view class="section-header__left">
              <view class="section-header__accent"></view>
              <text class="section-header__title">热门推荐</text>
            </view>
            <text class="section-header__more" @tap="goToList()">查看全部</text>
          </view>
          <scroll-view scroll-x class="product-scroll" :show-scrollbar="false">
            <view class="product-scroll-inner">
              <view class="product-scroll-item" v-for="item in hotProducts" :key="item.id" @tap="goToDetail(item.id)">
                <view class="product-card">
                  <view class="product-card__image-wrapper">
                    <image v-if="item.image" class="product-card__image" :src="item.image" mode="aspectFill" />
                    <view v-else class="product-card__image-placeholder">
                      <image class="product-card__placeholder-img" src="/static/icons/placeholder.png" mode="aspectFit" />
                    </view>
                    <view v-if="item.fastDelivery" class="product-card__badge">
                      <text class="product-card__badge-text product-card__badge-text--green">次日达</text>
                    </view>
                    <view v-if="item.productType === 'pet'" class="product-card__pet-badge">
                      <text class="product-card__badge-text product-card__badge-text--white">活体宠物</text>
                    </view>
                  </view>
                  <view class="product-card__info">
                    <text class="product-card__title">{{ item.name }}</text>
                    <view class="product-card__price">
                      <text class="product-card__price-current">¥{{ item.price }}</text>
                    </view>
                    <view class="product-card__rating">
                      <image class="product-card__star" src="/static/icons/star.png" mode="aspectFit" />
                      <text class="product-card__rating-value">{{ item.rating }}</text>
                      <text class="product-card__review-count">({{ item.reviewCount }})</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- Recommend -->
      <view class="section">
        <view class="section__container">
          <view class="section-header">
            <view class="section-header__left">
              <view class="section-header__accent"></view>
              <text class="section-header__title">为你推荐</text>
            </view>
          </view>
          <view class="product-grid">
            <view class="product-grid__item" v-for="item in recommendProducts" :key="item.id" @tap="goToDetail(item.id)">
              <view class="product-card">
                <view class="product-card__image-wrapper">
                  <image v-if="item.image" class="product-card__image" :src="item.image" mode="aspectFill" />
                  <view v-else class="product-card__image-placeholder">
                    <image class="product-card__placeholder-img" src="/static/icons/placeholder.png" mode="aspectFit" />
                  </view>
                </view>
                <view class="product-card__info">
                  <text class="product-card__title">{{ item.name }}</text>
                  <view class="product-card__price">
                    <text class="product-card__price-current">¥{{ item.price }}</text>
                  </view>
                  <view class="product-card__rating">
                    <image class="product-card__star" src="/static/icons/star.png" mode="aspectFit" />
                    <text class="product-card__rating-value">{{ item.rating }}</text>
                    <text class="product-card__sales">已售{{ formatSales(item.sales) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- AI FAB -->
    <view class="ai-fab" @tap="openAI">
      <image class="ai-fab__icon" src="/static/icons/robot.png" mode="aspectFit" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProducts } from '@/services/product'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const cartCount = ref(0)

const goHome = () => uni.switchTab({ url: '/pages/index/index' })
const goToCart = () => uni.switchTab({ url: '/pages/cart/cart' })
const goToUser = () => uni.switchTab({ url: '/pages/user/profile' })
const goToSearch = () => uni.navigateTo({ url: '/pages/product/list' })
const openAI = () => uni.navigateTo({ url: '/pages/ai/chat' })

const categories = ref([
  { name: '狗狗', key: 'dogs', category: 'dogs', productType: 'pet', icon: '/static/icons/cat-dogs.png', bg: 'rgba(255,108,16,0.07)' },
  { name: '猫咪', key: 'cats', category: 'cats', productType: 'pet', icon: '/static/icons/cat-cats.png', bg: 'rgba(139,92,246,0.07)' },
  { name: '水族', key: 'fish', category: 'fish', productType: 'supply', icon: '/static/icons/cat-fish.png', bg: 'rgba(28,73,194,0.07)' },
  { name: '鸟类', key: 'birds', category: 'birds', productType: 'supply', icon: '/static/icons/cat-birds.png', bg: 'rgba(0,166,81,0.07)' },
  { name: '小宠', key: 'small', category: 'small', productType: 'supply', icon: '/static/icons/cat-small.png', bg: 'rgba(230,126,34,0.07)' },
])

const features = ref([
  { label: '快速配送', desc: '满 199 元包邮', icon: '/static/icons/feat-truck.png', bg: 'rgba(28,73,194,0.08)' },
  { label: '正品保证', desc: '100% 正品保障', icon: '/static/icons/feat-shield.png', bg: 'rgba(0,166,81,0.08)' },
  { label: '专业客服', desc: '7×24 在线服务', icon: '/static/icons/feat-chat.png', bg: 'rgba(255,108,16,0.08)' },
  { label: '无忧退换', desc: '30 天无理由退换', icon: '/static/icons/feat-return.png', bg: 'rgba(189,40,72,0.08)' },
])

const hotProducts = ref([])
const recommendProducts = ref([])

onLoad(async () => {
  try {
    const res = await getProducts({ pageSize: 5, sort: 'sales' })
    hotProducts.value = res.list
    const recRes = await getProducts({ pageSize: 4, sort: 'default' })
    recommendProducts.value = recRes.list
  } catch {}
  try {
    await cartStore.loadCart()
    cartCount.value = cartStore.totalItems
  } catch {}
})

const formatSales = (count) => {
  if (count >= 10000) return (count / 10000).toFixed(1) + 'w'
  return count.toLocaleString()
}

const goToList = (category, productType) => {
  let url = '/pages/product/list'
  const params = []
  if (productType) params.push('productType=' + productType)
  if (category) params.push('category=' + category)
  if (params.length) url += '?' + params.join('&')
  uni.navigateTo({ url })
}

const goToDetail = (id) => {
  uni.navigateTo({ url: '/pages/product/detail?id=' + id })
}
</script>

<style scoped>
.page { background: #f8f9fa; min-height: 100vh; display: flex; flex-direction: column; }
.content-scroll { flex: 1; height: 0; }

/* Header */
.header { background: linear-gradient(135deg, #1c49c2, #2558d6); padding-top: 80rpx; padding-bottom: 24rpx; flex-shrink: 0; z-index: 100; }
.header__top { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 32rpx 16rpx; }
.header__logo { display: flex; align-items: center; gap: 12rpx; }
.header__logo-img { width: 40rpx; height: 40rpx; }
.header__brand { font-size: 40rpx; font-weight: 700; color: #fff; letter-spacing: -1rpx; }
.header__actions { display: flex; align-items: center; gap: 20rpx; }
.header__action { position: relative; }
.header__icon-circle { width: 64rpx; height: 64rpx; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
.header__icon-img { width: 32rpx; height: 32rpx; }
.header__badge { position: absolute; top: -4rpx; right: -8rpx; min-width: 32rpx; height: 32rpx; border-radius: 16rpx; background: #ff6c10; display: flex; align-items: center; justify-content: center; padding: 0 8rpx; }
.header__badge-text { font-size: 18rpx; color: #fff; font-weight: 700; }
.header__search { margin: 0 30rpx; height: 76rpx; background: #fff; border-radius: 38rpx; display: flex; align-items: center; padding: 0 28rpx; gap: 14rpx; }
.header__search-icon { width: 28rpx; height: 28rpx; flex-shrink: 0; }
.header__search-placeholder { font-size: 26rpx; color: #999; }

/* Hero */
.hero { background: linear-gradient(135deg, #eef2ff 0%, #fff5eb 50%, #f0f7ff 100%); padding: 60rpx 40rpx 56rpx; }
.hero__content { max-width: 600rpx; }
.hero__badge { display: inline-block; padding: 8rpx 24rpx; background: rgba(28,73,194,0.08); color: #1c49c2; border-radius: 32rpx; font-size: 24rpx; font-weight: 500; margin-bottom: 24rpx; }
.hero__title { font-size: 52rpx; font-weight: 700; line-height: 1.3; color: #121212; margin-bottom: 20rpx; display: block; }
.hero__subtitle { font-size: 28rpx; color: #666; line-height: 1.6; margin-bottom: 40rpx; }
.hero__actions { display: flex; gap: 24rpx; }
.hero__btn { padding: 24rpx 48rpx; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; }
.hero__btn--primary { background: #ff6c10; }
.hero__btn-text { color: #fff; font-size: 28rpx; font-weight: 600; }
.hero__btn--outline { background: #fff; border: 2rpx solid #e0e0e0; }
.hero__btn-text-outline { color: #333; font-size: 28rpx; font-weight: 600; }

/* Section */
.section { margin-bottom: 16rpx; }
.section__container { padding: 32rpx 24rpx; background: #fff; margin: 0 24rpx 16rpx; border-radius: 24rpx; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28rpx; }
.section-header__left { display: flex; align-items: center; gap: 12rpx; }
.section-header__accent { width: 6rpx; height: 28rpx; border-radius: 3rpx; background: #ff6c10; }
.section-header__title { font-size: 34rpx; font-weight: 700; color: #121212; }
.section-header__more { font-size: 24rpx; color: #999; }

/* Categories */
.category-grid { display: flex; flex-wrap: wrap; }
.category-card { width: 20%; display: flex; flex-direction: column; align-items: center; padding: 16rpx 0; }
.category-card__icon { width: 112rpx; height: 112rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 12rpx; }
.category-card__icon-img { width: 56rpx; height: 56rpx; }
.category-card__name { font-size: 24rpx; color: #333; font-weight: 500; }

/* Features */
.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; }
.feature-item { display: flex; align-items: center; gap: 16rpx; padding: 20rpx; background: #fff; border-radius: 16rpx; border: 1rpx solid #f0f0f0; }
.feature-item__icon { width: 72rpx; height: 72rpx; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.feature-item__icon-img { width: 36rpx; height: 36rpx; }
.feature-item__info { display: flex; flex-direction: column; gap: 4rpx; }
.feature-item__title { font-size: 26rpx; font-weight: 600; color: #121212; }
.feature-item__desc { font-size: 22rpx; color: #999; }

/* Product Card */
.product-card { background: #fff; border-radius: 24rpx; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.product-card__image-wrapper { position: relative; background: #f8f8f8; overflow: hidden; }
.product-card__image { width: 100%; aspect-ratio: 1 / 1; display: block; }
.product-card__image-placeholder { width: 100%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; background: #f0f0f0; }
.product-card__placeholder-img { width: 64rpx; height: 64rpx; }
.product-card__badge { position: absolute; top: 12rpx; left: 12rpx; padding: 2rpx 10rpx; border-radius: 6rpx; background: #00a651; }
.product-card__pet-badge { position: absolute; top: 12rpx; right: 12rpx; padding: 2rpx 10rpx; border-radius: 6rpx; background: #1c49c2; }
.product-card__badge-text { font-size: 18rpx; font-weight: 600; color: #fff; }
.product-card__badge-text--green { color: #fff; }
.product-card__badge-text--white { color: #fff; }
.product-card__info { padding: 20rpx; }
.product-card__title { font-size: 26rpx; font-weight: 500; color: #121212; margin-bottom: 10rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-card__price { margin-bottom: 8rpx; }
.product-card__price-current { font-size: 34rpx; font-weight: 700; color: #bd2848; }
.product-card__rating { display: flex; align-items: center; gap: 6rpx; }
.product-card__star { width: 24rpx; height: 24rpx; }
.product-card__rating-value { font-size: 24rpx; font-weight: 600; color: #121212; }
.product-card__review-count { font-size: 22rpx; color: #999; }
.product-card__sales { font-size: 22rpx; color: #999; margin-left: auto; }

/* Product Scroll */
.product-scroll { white-space: nowrap; }
.product-scroll-inner { display: flex; gap: 20rpx; }
.product-scroll-item { width: 300rpx; flex-shrink: 0; }

/* Product Grid */
.product-grid { display: flex; flex-wrap: wrap; gap: 20rpx; }
.product-grid__item { width: calc(50% - 10rpx); }

/* AI FAB */
.ai-fab { position: fixed; right: 30rpx; bottom: 200rpx; width: 96rpx; height: 96rpx; border-radius: 50%; background: linear-gradient(135deg, #1c49c2, #2558d6); display: flex; align-items: center; justify-content: center; box-shadow: 0 6rpx 24rpx rgba(28,73,194,0.4); z-index: 999; }
.ai-fab__icon { width: 44rpx; height: 44rpx; }
</style>
