<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  shopName: { type: String, default: '' },
  fastDelivery: { type: Boolean, default: false },
  productType: { type: String, default: 'supply' },
})

const emit = defineEmits(['add-to-cart'])

// 生成星星数组（满星/半星/空星）
const stars = (() => {
  const full = Math.floor(props.rating)
  const half = props.rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
})()

const discount = (() => {
  if (!props.originalPrice || props.originalPrice <= props.price) return null
  return Math.round((1 - props.price / props.originalPrice) * 100)
})()
</script>

<template>
  <router-link :to="`/products/${id}`" class="product-card">
    <!-- 商品图片 -->
    <div class="product-card__image-wrapper">
      <img
        v-if="image"
        :src="image"
        :alt="name"
        class="product-card__image"
      />
      <div v-else class="product-card__image-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <span v-if="fastDelivery" class="product-card__badge">
        次日达
      </span>
      <span v-if="productType === 'pet'" class="product-card__pet-badge">
        活体宠物
      </span>
      <span v-if="discount" class="product-card__deal-badge">
        <span class="product-card__deal-label">Deal</span>
        <span class="product-card__deal-percent">-{{ discount }}%</span>
      </span>
    </div>

    <!-- 商品信息 -->
    <div class="product-card__info">
      <h3 class="product-card__title">{{ name }}</h3>

      <!-- 评分 -->
      <div class="product-card__rating">
        <span class="stars">
          <span v-for="i in stars.full" :key="'f'+i">★</span>
          <span v-if="stars.half">☆</span>
          <span v-for="i in stars.empty" :key="'e'+i" class="star-empty">★</span>
        </span>
        <span class="rating-value">{{ rating }}</span>
        <span class="review-count">({{ reviewCount }})</span>
      </div>

      <!-- 价格 -->
      <div class="product-card__price">
        <span class="price-current">¥{{ price.toFixed(2) }}</span>
        <span v-if="originalPrice" class="price-original">
          ¥{{ originalPrice.toFixed(2) }}
        </span>
      </div>

      <!-- 加入购物车 -->
      <button class="product-card__cart-btn" @click.prevent="emit('add-to-cart', id)">
        <el-icon><ShoppingCart /></el-icon>
        加入购物车
      </button>
    </div>
  </router-link>
</template>

<style scoped>
.product-card {
  display: block;
  background-color: var(--color-bg-card);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 图片区域 */
.product-card__image-wrapper {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background-color: #f8f9fa;
}

.product-card__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.8rem;
  display: block;
}

.product-card__image-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  background-color: #ffffff;
}

.product-card__badge {
  position: absolute;
  top: var(--spacing-3);
  left: var(--spacing-3);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
  background-color: #e6f7ee;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
}

.product-card__pet-badge {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-semibold);
  color: #fff;
  background-color: var(--color-brand-blue);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
}

.product-card__deal-badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-deal-bg);
  color: var(--color-deal-text);
  padding: var(--spacing-2) var(--spacing-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 var(--radius-lg) 0;
  z-index: 2;
}

.product-card__deal-label {
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.05em;
  line-height: 1;
}

.product-card__deal-percent {
  font-size: var(--text-caption);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

/* 信息区域 */
.product-card__info {
  padding: 2rem;
}

.product-card__title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: #333333;
  margin-bottom: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 4.2rem;
}

/* 评分 */
.product-card__rating {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
  font-size: 1.3rem;
}

.stars {
  color: var(--color-brand-orange);
  font-size: 1.6rem;
  letter-spacing: 2px;
  line-height: 1;
}

.star-empty {
  color: var(--color-border);
}

.rating-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.review-count {
  color: #999;
}

/* 价格 */
.product-card__price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
  margin-bottom: 1.6rem;
}

.price-current {
  font-size: 2.2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-price-primary);
}

.price-original {
  font-size: var(--text-body-sm);
  color: #999;
  text-decoration: line-through;
}

/* 加入购物车按钮 */
.product-card__cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: 1.2rem;
  background-color: var(--color-brand-orange);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.8rem;
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-card__cart-btn:hover {
  background-color: var(--color-brand-orange-hover);
  transform: scale(1.02);
}

.product-card__cart-btn:active {
  transform: scale(0.98);
}
</style>
