<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const petCategories = ref([
  { name: '狗狗', count: 1280, key: 'dogs', productType: 'pet' },
  { name: '猫咪', count: 960, key: 'cats', productType: 'pet' },
  { name: '水族', count: 420, key: 'fish', productType: 'supply' },
  { name: '鸟类', count: 180, key: 'birds', productType: 'supply' },
  { name: '小宠', count: 320, key: 'small', productType: 'supply' },
])

const goToProducts = () => router.push('/products')
const goToCategory = (cat) => router.push({ path: '/products', query: { productType: cat.productType, category: cat.key } })
</script>

<template>
  <div class="home">
    <!-- Hero 横幅 -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          <h1 class="hero__title">为你的毛孩子<br />挑选最好的</h1>
          <p class="hero__subtitle">
            精选优质宠物食品、玩具和用品，让每一只宠物都健康快乐
          </p>
          <div class="hero__actions">
            <el-button type="primary" size="large" class="hero__btn-primary" @click="goToProducts">
              立即选购
            </el-button>
            <el-button size="large" class="hero__btn-secondary">
              了解更多
            </el-button>
          </div>
        </div>
        <div class="hero__image">
          <div class="hero__image-placeholder">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#1c49c2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
              <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
              <path d="M8 14v.5M16 14v.5"/>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类入口 -->
    <section class="categories">
      <div class="container">
        <h2 class="section-title">按宠物分类</h2>
        <div class="categories__grid">
          <router-link
            v-for="cat in petCategories"
            :key="cat.name"
            :to="{ path: '/products', query: { productType: cat.productType, category: cat.key } }"
            class="category-card"
          >
            <span class="category-card__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
            </span>
            <span class="category-card__name">{{ cat.name }}</span>
            <span class="category-card__count">{{ cat.count }}+ 商品</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 特色服务 -->
    <section class="features">
      <div class="container">
        <div class="features__grid">
          <div class="feature-item">
            <el-icon :size="32" color="var(--color-brand-blue)"><Van /></el-icon>
            <div>
              <h4 class="feature-item__title">快速配送</h4>
              <p class="feature-item__desc">满 199 元包邮，次日达</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon :size="32" color="var(--color-success)"><Lock /></el-icon>
            <div>
              <h4 class="feature-item__title">正品保证</h4>
              <p class="feature-item__desc">100% 正品，假一赔十</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon :size="32" color="var(--color-brand-orange)"><Service /></el-icon>
            <div>
              <h4 class="feature-item__title">专业客服</h4>
              <p class="feature-item__desc">7×24 小时在线服务</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon :size="32" color="var(--color-price-primary)"><RefreshRight /></el-icon>
            <div>
              <h4 class="feature-item__title">无忧退换</h4>
              <p class="feature-item__desc">30 天无理由退换货</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ========== Hero 区块 ========== */
.hero {
  background: linear-gradient(135deg, #eef2ff 0%, #fff5eb 100%);
  padding: var(--spacing-16) 0;
}

.hero__inner {
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
}

.hero__content {
  flex: 1;
}

.hero__title {
  font-size: 4.8rem;
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.hero__subtitle {
  font-size: var(--text-body-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin-bottom: var(--spacing-8);
  max-width: 48rem;
}

.hero__actions {
  display: flex;
  gap: var(--spacing-4);
}

.hero__btn-primary {
  height: 4.8rem;
  padding: 0 var(--spacing-8);
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  background-color: var(--color-brand-orange);
  border-color: var(--color-brand-orange);
}

.hero__btn-primary:hover {
  background-color: var(--color-brand-orange-hover);
  border-color: var(--color-brand-orange-hover);
}

.hero__btn-secondary {
  height: 4.8rem;
  padding: 0 var(--spacing-8);
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
}

.hero__image {
  flex-shrink: 0;
  width: 40rem;
  height: 40rem;
}

.hero__image-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  box-shadow: var(--shadow-md);
}

/* ========== 分类区块 ========== */
.categories {
  padding: var(--spacing-16) 0;
}

.section-title {
  font-size: var(--text-h2);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-8);
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-4);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-8) var(--spacing-4);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.category-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.4rem;
  height: 6.4rem;
  color: var(--color-brand-blue);
  background-color: #f0f4ff;
  border-radius: var(--radius-full);
}

.category-card__name {
  font-size: var(--text-body-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.category-card__count {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

/* ========== 特色服务 ========== */
.features {
  padding: var(--spacing-10) 0;
  background-color: var(--color-bg-secondary);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.feature-item__title {
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-1);
}

.feature-item__desc {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
}

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .hero__inner {
    flex-direction: column;
    text-align: center;
  }

  .hero__subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero__actions {
    justify-content: center;
  }

  .hero__image {
    width: 30rem;
    height: 30rem;
  }

  .categories__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .hero__title {
    font-size: 3.2rem;
  }

  .categories__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
