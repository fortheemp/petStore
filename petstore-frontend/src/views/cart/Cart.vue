<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

// 运费提示
const shippingTip = computed(() => {
  if (cart.shipping === 0) return ''
  const diff = (199 - cart.subtotal).toFixed(2)
  return `还差 ¥${diff} 免运费`
})

// 数量操作
const decreaseQty = (item) => {
  if (item.quantity > 1) cart.updateQuantity(item.id, item.quantity - 1)
}
const increaseQty = (item) => {
  if (item.quantity < item.stock) cart.updateQuantity(item.id, item.quantity + 1)
}

// 删除确认
const handleDelete = (item) => {
  ElMessageBox.confirm(
    `确定要删除「${item.name}」吗？`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
  ).then(() => {
    cart.removeItem(item.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 去结算
const hasOutOfStockChecked = computed(() =>
  cart.checkedItems.some((item) => item.stock === 0)
)

const handleCheckout = () => {
  if (hasOutOfStockChecked.value) {
    ElMessage.warning('有已售罄商品，请先取消勾选')
    return
  }
  router.push('/checkout')
}
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="cart-page__title">我的购物车</h1>

      <!-- 空购物车 -->
      <div v-if="cart.items.length === 0" class="empty-cart">
        <div class="empty-cart__icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <p class="empty-cart__title">购物车空空如也</p>
        <p class="empty-cart__tip">快去挑选心仪的商品吧</p>
        <router-link to="/products" class="empty-cart__btn">去逛逛</router-link>
      </div>

      <!-- 有商品 -->
      <div v-else class="cart-page__content">
        <!-- 左侧：商品列表 -->
        <div class="cart-list">
          <!-- 表头 -->
          <div class="cart-list__header">
            <el-checkbox
              :model-value="cart.isAllChecked"
              @change="cart.toggleAllChecked()"
            >
              全选
            </el-checkbox>
            <span class="col-info">商品信息</span>
            <span class="col-price">单价</span>
            <span class="col-qty">数量</span>
            <span class="col-subtotal">小计</span>
            <span class="col-action">操作</span>
          </div>

          <!-- 商品行 -->
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="cart-item"
          >
            <el-checkbox
              :model-value="item.checked"
              :disabled="item.stock === 0"
              @change="cart.toggleChecked(item.id)"
            />

            <!-- 图片 -->
            <div class="cart-item__image">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
              <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>

            <!-- 信息 -->
            <div class="cart-item__info">
              <router-link :to="`/products/${item.productId}`" class="cart-item__title">
                {{ item.name }}
              </router-link>
              <span v-if="item.stock === 0" class="cart-item__soldout">已售罄</span>
              <p v-if="item.spec" class="cart-item__spec">规格：{{ item.spec.value }}</p>
            </div>

            <!-- 单价 -->
            <div class="cart-item__price">
              <span class="price-current">¥{{ item.price.toFixed(2) }}</span>
              <span v-if="item.originalPrice" class="price-original">¥{{ item.originalPrice.toFixed(2) }}</span>
            </div>

            <!-- 数量 -->
            <div class="cart-item__quantity">
              <div class="quantity-selector">
                <button class="qty-btn" :disabled="item.quantity <= 1 || item.stock === 0" @click="decreaseQty(item)">-</button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button class="qty-btn" :disabled="item.quantity >= item.stock || item.stock === 0" @click="increaseQty(item)">+</button>
              </div>
            </div>

            <!-- 小计 -->
            <div class="cart-item__subtotal">
              <span class="subtotal-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>

            <!-- 删除 -->
            <div class="cart-item__action">
              <button class="btn-delete" @click="handleDelete(item)">删除</button>
            </div>
          </div>
        </div>

        <!-- 右侧：结算卡片 -->
        <div class="cart-summary">
          <div class="cart-summary__header">
            <span class="selected-count">
              已选 <strong>{{ cart.checkedCount }}</strong> 件
            </span>
          </div>

          <div class="cart-summary__row">
            <span class="label">商品总价</span>
            <span class="value">¥{{ cart.subtotal.toFixed(2) }}</span>
          </div>

          <div class="cart-summary__row cart-summary__row--shipping">
            <span class="label">运费</span>
            <span class="value" :class="{ free: cart.shipping === 0 }">
              {{ cart.shipping === 0 ? '免运费' : `¥${cart.shipping}` }}
            </span>
            <p v-if="shippingTip" class="shipping-tip">{{ shippingTip }}</p>
          </div>

          <div class="cart-summary__divider"></div>

          <div class="cart-summary__total">
            <span class="label">合计</span>
            <span class="value">
              <span class="symbol">¥</span>{{ cart.total.toFixed(2) }}
            </span>
          </div>

          <button
            class="cart-summary__checkout"
            :disabled="cart.checkedCount === 0 || hasOutOfStockChecked"
            @click="handleCheckout"
          >
            去结算
          </button>

          <p class="cart-summary__secure">
            <el-icon color="#00a651"><Lock /></el-icon>
            安全支付
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  background: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
  padding: 2.4rem 0 6.4rem;
}

.cart-page__title {
  font-size: 2.8rem;
  font-weight: var(--font-weight-bold);
  color: #121212;
  margin-bottom: 3.2rem;
}

/* ========== 内容布局 ========== */
.cart-page__content {
  display: grid;
  grid-template-columns: 1fr 36rem;
  gap: 3.2rem;
  align-items: start;
}

/* ========== 左侧列表 ========== */
.cart-list {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.cart-list__header {
  display: flex;
  align-items: center;
  padding: 1.6rem 2.4rem;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1.3rem;
  color: #666;
  gap: 1.6rem;
}
.col-info { flex: 1; }
.col-price { width: 12rem; text-align: center; }
.col-qty { width: 14rem; text-align: center; }
.col-subtotal { width: 10rem; text-align: right; }
.col-action { width: 8rem; text-align: center; }

/* ========== 商品行 ========== */
.cart-item {
  display: flex;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid #f0f0f0;
  gap: 1.6rem;
  transition: background 0.2s;
}
.cart-item:hover { background: #fafafa; }
.cart-item:last-child { border-bottom: none; }

.cart-item__image {
  width: 10rem;
  height: 10rem;
  border-radius: 0.8rem;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.cart-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__info {
  flex: 1;
  min-width: 0;
}

.cart-item__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #121212;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
  margin-bottom: 0.8rem;
}
.cart-item__title:hover { color: var(--color-brand-blue); }

.cart-item__soldout {
  display: inline-block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: #e74c3c;
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  margin-left: 0.8rem;
  vertical-align: middle;
}

.cart-item__spec {
  font-size: 1.3rem;
  color: #999;
}

.cart-item__price {
  width: 12rem;
  text-align: center;
}
.price-current { font-size: 1.5rem; font-weight: 600; color: #121212; display: block; }
.price-original { font-size: 1.2rem; color: #999; text-decoration: line-through; display: block; margin-top: 0.4rem; }

.cart-item__quantity {
  width: 14rem;
  display: flex;
  justify-content: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  overflow: hidden;
}
.qty-btn {
  width: 3.2rem;
  height: 3.2rem;
  background: #f8f9fa;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  transition: background 0.2s;
}
.qty-btn:hover:not(:disabled) { background: #e9ecef; }
.qty-btn:disabled { color: #ccc; cursor: not-allowed; }
.qty-value {
  width: 4.8rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  font-size: 1.4rem;
  font-weight: 600;
}

.cart-item__subtotal {
  width: 10rem;
  text-align: right;
}
.subtotal-price { font-size: 1.6rem; font-weight: 700; color: var(--color-price-primary); }

.cart-item__action {
  width: 8rem;
  text-align: center;
}
.btn-delete {
  color: #999;
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-delete:hover { color: #e74c3c; }

/* ========== 右侧结算卡片 ========== */
.cart-summary {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 2.4rem;
  position: sticky;
  top: 2.4rem;
}

.cart-summary__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid #f0f0f0;
}
.selected-count { font-size: 1.4rem; color: #666; }
.selected-count strong { color: var(--color-brand-blue); font-size: 1.6rem; }

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
}
.cart-summary__row .label { color: #666; }
.cart-summary__row .value { color: #121212; font-weight: 500; }
.cart-summary__row .value.free { color: #00a651; }

.shipping-tip {
  font-size: 1.2rem;
  color: var(--color-brand-orange);
  margin-top: 0.4rem;
  text-align: right;
  width: 100%;
}

.cart-summary__divider {
  height: 1px;
  background: #f0f0f0;
  margin: 1.6rem 0;
}

.cart-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2rem;
}
.cart-summary__total .label { font-size: 1.6rem; font-weight: 600; }
.cart-summary__total .value { font-size: 2.8rem; font-weight: 700; color: var(--color-price-primary); }
.cart-summary__total .symbol { font-size: 1.6rem; }

.cart-summary__checkout {
  width: 100%;
  padding: 1.6rem;
  background: var(--color-brand-orange);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cart-summary__checkout:hover:not(:disabled) { background: var(--color-brand-orange-hover); }
.cart-summary__checkout:disabled { background: #ccc; cursor: not-allowed; }
.cart-summary__checkout:active:not(:disabled) { transform: scale(0.98); }

.cart-summary__secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.6rem;
  font-size: 1.2rem;
  color: #999;
}

/* ========== 空购物车 ========== */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rem 2.4rem;
  text-align: center;
}
.empty-cart__icon { margin-bottom: 2.4rem; opacity: 0.6; }
.empty-cart__title { font-size: 2rem; font-weight: 600; color: #666; margin-bottom: 1.2rem; }
.empty-cart__tip { font-size: 1.4rem; color: #999; margin-bottom: 3.2rem; }
.empty-cart__btn {
  display: inline-block;
  padding: 1.4rem 4.8rem;
  background: var(--color-brand-orange);
  color: #fff;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.empty-cart__btn:hover { background: var(--color-brand-orange-hover); color: #fff; }

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .cart-page__content { grid-template-columns: 1fr; }
  .cart-summary { position: static; }
  .cart-list__header { display: none; }
  .cart-item { flex-wrap: wrap; }
  .cart-item__price, .cart-item__quantity, .cart-item__subtotal, .cart-item__action {
    width: auto;
    margin-top: 1.2rem;
  }
}
</style>
