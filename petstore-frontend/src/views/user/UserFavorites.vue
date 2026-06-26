<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@/api/request'

const router = useRouter()
const favorites = ref([])
const loading = ref(true)

const FAVORITES_KEY = 'petstore_favorites'

const loadFavorites = async () => {
  loading.value = true
  try {
    const ids = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    if (ids.length === 0) {
      favorites.value = []
      return
    }
    const allProducts = await get('/products')
    const list = Array.isArray(allProducts) ? allProducts : []
    favorites.value = list.filter((p) => ids.includes(p.id))
  } catch {
    favorites.value = []
  } finally {
    loading.value = false
  }
}

const removeFavorite = (productId) => {
  const ids = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  const updated = ids.filter((id) => id !== productId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  favorites.value = favorites.value.filter((p) => p.id !== productId)
  ElMessage.success('已取消收藏')
}

const goDetail = (id) => router.push(`/products/${id}`)

onMounted(loadFavorites)
</script>

<template>
  <div class="user-content-card">
    <h1 class="favorites-page__title">我的收藏</h1>

    <!-- 空状态 -->
    <div v-if="!loading && favorites.length === 0" class="favorites-empty">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <p>暂无收藏商品</p>
      <router-link to="/products" class="favorites-empty__btn">去逛逛</router-link>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="favorites-grid">
      <div
        v-for="product in favorites"
        :key="product.id"
        class="favorite-card"
      >
        <div class="favorite-card__image" @click="goDetail(product.id)">
          <img v-if="product.image" :src="product.image" :alt="product.name" />
          <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <div class="favorite-card__info">
          <p class="favorite-card__name" @click="goDetail(product.id)">{{ product.name }}</p>
          <p class="favorite-card__price">¥{{ Number(product.price).toFixed(2) }}</p>
        </div>
        <button class="favorite-card__remove" @click="removeFavorite(product.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-content-card {
  background: #fff;
  border-radius: 1.2rem;
  padding: 3.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.favorites-page__title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #121212;
  margin-bottom: 2.4rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid #f0f0f0;
}

.favorites-empty {
  text-align: center;
  padding: 6rem 2.4rem;
}
.favorites-empty p { margin-top: 2rem; color: #999; font-size: 1.6rem; }
.favorites-empty__btn {
  display: inline-block;
  margin-top: 2.4rem;
  padding: 1.2rem 3.2rem;
  background: var(--color-brand-blue);
  color: #fff;
  border-radius: 0.8rem;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}
.favorites-empty__btn:hover { background: #1539a0; color: #fff; }

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 2rem;
}

.favorite-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  transition: all 0.25s ease;
}
.favorite-card:hover { box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1); transform: translateY(-3px); }

.favorite-card__image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e8edf5 0%, #d5dce8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}
.favorite-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-card__info { padding: 1.2rem 1.6rem; }
.favorite-card__name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #121212;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.favorite-card__name:hover { color: var(--color-brand-blue); }
.favorite-card__price {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-price-primary);
  margin-top: 0.6rem;
}

.favorite-card__remove {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: all 0.2s;
}
.favorite-card__remove:hover { background: #fff; color: #e74c3c; }
</style>
