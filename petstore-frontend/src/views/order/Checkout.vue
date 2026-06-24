<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAddressStore } from '@/stores/address'

const router = useRouter()
const cart = useCartStore()
const orderStore = useOrderStore()
const addressStore = useAddressStore()

const selectedItems = computed(() => cart.checkedItems)
const totalAmount = computed(() => cart.subtotal)
const shippingFee = computed(() => cart.shipping)
const payAmount = computed(() => totalAmount.value + shippingFee.value)

const addresses = computed(() => addressStore.addresses)
const defaultAddr = computed(() => addressStore.getDefault())
const selectedAddressId = ref(defaultAddr.value?.id || (addresses.value[0]?.id ?? null))
const selectedAddress = computed(() => addresses.value.find((a) => a.id === selectedAddressId.value))

const remark = ref('')
const payMethod = ref('wechat')

const submitOrder = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('没有可结算的商品')
    return
  }
  const orderData = {
    items: selectedItems.value,
    address: {
      ...selectedAddress.value,
      address: `${selectedAddress.value.province}${selectedAddress.value.city}${selectedAddress.value.district}${selectedAddress.value.detail}`,
    },
    remark: remark.value,
    payMethod: payMethod.value,
    totalAmount: totalAmount.value,
    shippingFee: shippingFee.value,
  }
  const order = orderStore.createOrder(orderData)
  selectedItems.value.forEach((item) => cart.removeItem(item.id))
  ElMessage.success('订单创建成功')
  router.push('/user/orders')
}
</script>

<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="checkout-page__title">确认订单</h1>

      <div v-if="selectedItems.length === 0" class="checkout-empty">
        <p>没有可结算的商品，请先返回购物车选择商品</p>
        <router-link to="/cart" class="checkout-empty__link">返回购物车</router-link>
      </div>

      <template v-else>
        <!-- 收货地址 -->
        <div class="checkout-section">
          <h2 class="checkout-section__title">收货地址</h2>
          <div class="address-list">
            <label
              v-for="addr in addresses"
              :key="addr.id"
              class="address-card"
              :class="{ 'address-card--active': selectedAddressId === addr.id }"
            >
              <input
                v-model="selectedAddressId"
                type="radio"
                :value="addr.id"
                class="address-card__radio"
              />
              <div class="address-card__info">
                <div class="address-card__head">
                  <span class="address-card__name">{{ addr.name }}</span>
                  <span class="address-card__phone">{{ addr.phone }}</span>
                  <span v-if="addr.isDefault" class="address-card__tag">默认</span>
                </div>
                <p class="address-card__detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 商品清单 -->
        <div class="checkout-section">
          <h2 class="checkout-section__title">商品清单</h2>
          <div class="checkout-items">
            <div v-for="item in selectedItems" :key="item.id" class="checkout-item">
              <div class="checkout-item__image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div class="checkout-item__info">
                <p class="checkout-item__name">{{ item.name }}</p>
                <p class="checkout-item__spec">规格：{{ item.spec.value }}</p>
              </div>
              <div class="checkout-item__price">¥{{ item.price.toFixed(2) }}</div>
              <div class="checkout-item__qty">x{{ item.quantity }}</div>
              <div class="checkout-item__subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 买家留言 -->
        <div class="checkout-section">
          <h2 class="checkout-section__title">买家留言</h2>
          <el-input
            v-model="remark"
            type="textarea"
            :rows="3"
            placeholder="请输入留言信息（选填）"
            maxlength="200"
            show-word-limit
          />
        </div>

        <!-- 支付方式 -->
        <div class="checkout-section">
          <h2 class="checkout-section__title">支付方式</h2>
          <div class="pay-methods">
            <label class="pay-method" :class="{ 'pay-method--active': payMethod === 'wechat' }">
              <input v-model="payMethod" type="radio" value="wechat" class="pay-method__radio" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#07c160">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
              </svg>
              微信支付
            </label>
            <label class="pay-method" :class="{ 'pay-method--active': payMethod === 'alipay' }">
              <input v-model="payMethod" type="radio" value="alipay" class="pay-method__radio" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1677ff">
                <path d="M21.422 15.358c-.372-.174-3.24-1.47-3.24-1.47-.24-.116-.546-.058-.702.116l-1.332 1.532c-.702.804-1.728 1.164-2.712.804-.996-.36-1.578-1.26-1.728-2.256-.15-.996.15-2.022.804-2.712l1.532-1.332c.174-.156.232-.462.116-.702 0 0-1.296-2.868-1.47-3.24a.558.558 0 0 0-.516-.312H9.6C8.604 4.4 7.578 4.89 6.834 5.694c-1.074 1.17-1.38 2.88-.702 4.32.348.756.96 1.38 1.728 1.728l3.24 1.47-1.47 3.24c-.348.768-.972 1.38-1.728 1.728-1.44.678-3.15.372-4.32-.702C3.69 16.53 3.2 15.504 3.2 14.508v-2.016c0-.372.198-.708.516-.876 0 0 2.868-1.296 3.24-1.47.24-.116.372-.372.372-.63 0-.036-.012-.072-.012-.108l-.36-1.62c-.456-2.022.372-4.14 2.196-5.304C11.1 1.428 13.38.876 15.6.984l2.232.108c1.836.096 3.54.924 4.632 2.268.9.912 1.38 2.124 1.38 3.396v1.188c0 .504-.396.9-.9.9-.108 0-.216-.024-.312-.06l-1.2-.468c-.504-.192-1.068-.06-1.44.372l-.552.636c-.168.192-.432.252-.66.144 0 0-3.24-1.47-3.6-1.632-.468-.216-.984-.084-1.296.336l-.828 1.116c-.78.924-1.14 2.124-.96 3.3.18 1.176.84 2.208 1.8 2.88l.6.432c.192.144.24.432.108.648z"/>
              </svg>
              支付宝
            </label>
          </div>
        </div>

        <!-- 订单摘要 -->
        <div class="checkout-summary">
          <div class="checkout-summary__row">
            <span>商品总价</span>
            <span>¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="checkout-summary__row">
            <span>运费</span>
            <span :class="{ 'free': shippingFee === 0 }">
              {{ shippingFee === 0 ? '免运费' : `¥${shippingFee}` }}
            </span>
          </div>
          <div class="checkout-summary__divider"></div>
          <div class="checkout-summary__total">
            <span>实付金额</span>
            <span class="checkout-summary__amount">¥{{ payAmount.toFixed(2) }}</span>
          </div>
          <button class="checkout-summary__btn" @click="submitOrder">
            提交订单
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  background: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
  padding: 2.4rem 0 6.4rem;
}

.checkout-page__title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #121212;
  margin-bottom: 3.2rem;
}

.checkout-empty {
  text-align: center;
  padding: 8rem 2.4rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  color: #666;
  font-size: 1.6rem;
}
.checkout-empty__link {
  display: inline-block;
  margin-top: 2.4rem;
  padding: 1.2rem 3.2rem;
  background: #1c49c2;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}
.checkout-empty__link:hover { background: #1539a0; color: #fff; }

/* ========== Section ========== */
.checkout-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 2.4rem;
  margin-bottom: 2.4rem;
}

.checkout-section__title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 2rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid #f0f0f0;
}

/* ========== 地址 ========== */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.address-card {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.6rem;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.address-card:hover { border-color: #ccc; }
.address-card--active { border-color: #1c49c2; background: #f0f6ff; }

.address-card__radio { margin-top: 0.4rem; accent-color: #1c49c2; }
.address-card__info { flex: 1; }
.address-card__head {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.6rem;
}
.address-card__name { font-weight: 600; font-size: 1.5rem; }
.address-card__phone { color: #666; font-size: 1.4rem; }
.address-card__tag {
  background: #1c49c2;
  color: #fff;
  font-size: 1.1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 4px;
}
.address-card__detail { font-size: 1.4rem; color: #666; }

/* ========== 商品 ========== */
.checkout-items {
  display: flex;
  flex-direction: column;
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.checkout-item:last-child { border-bottom: none; }

.checkout-item__image {
  width: 6rem;
  height: 6rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkout-item__info { flex: 1; min-width: 0; }
.checkout-item__name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.checkout-item__spec { font-size: 1.3rem; color: #999; }

.checkout-item__price { width: 10rem; text-align: center; font-size: 1.4rem; color: #121212; }
.checkout-item__qty { width: 6rem; text-align: center; font-size: 1.4rem; color: #666; }
.checkout-item__subtotal { width: 10rem; text-align: right; font-size: 1.5rem; font-weight: 700; color: #bd2848; }

/* ========== 支付方式 ========== */
.pay-methods {
  display: flex;
  gap: 1.6rem;
}

.pay-method {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.4rem;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s;
}
.pay-method:hover { border-color: #ccc; }
.pay-method--active { border-color: #1c49c2; background: #f0f6ff; }
.pay-method__radio { accent-color: #1c49c2; }

/* ========== 摘要 ========== */
.checkout-summary {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 2.4rem;
  text-align: right;
}

.checkout-summary__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  color: #666;
}
.checkout-summary__row .free { color: #00a651; }

.checkout-summary__divider {
  height: 1px;
  background: #f0f0f0;
  margin: 1.6rem 0;
}

.checkout-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2.4rem;
  font-size: 1.6rem;
  font-weight: 600;
}

.checkout-summary__amount {
  font-size: 2.8rem;
  font-weight: 700;
  color: #bd2848;
}

.checkout-summary__btn {
  display: inline-block;
  padding: 1.6rem 6.4rem;
  background: #ff6c10;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.checkout-summary__btn:hover { background: #e55d00; }

@media (max-width: 768px) {
  .checkout-item__price, .checkout-item__qty { display: none; }
  .pay-methods { flex-direction: column; }
}
</style>
