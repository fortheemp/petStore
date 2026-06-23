<template>
  <AppLayout>
    <div class="cart-page">
      <h2 class="page-title">🛒 我的购物车</h2>
      <div v-if="cartItems.length > 0">
        <el-table :data="cartItemsWithProduct" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品" min-width="300">
            <template #default="{ row }">
              <div class="product-cell">
                <el-image :src="row.image" style="width: 80px; height: 80px; border-radius: 8px;" fit="cover">
                  <template #error><div class="img-placeholder">🐾</div></template>
                </el-image>
                <div class="product-info">
                  <div class="name">{{ row.productName || '商品' + row.productId }}</div>
                  <el-tag size="small" :type="row.type === 'pet' ? 'success' : ''">{{ row.type === 'pet' ? '宠物' : '用品' }}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column label="数量" width="160">
            <template #default="{ row }">
              <el-input-number v-model="row.quantity" :min="1" :max="row.stock || 99" size="small" @change="updateQty(row)" />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">¥{{ (parseFloat(row.price) * row.quantity).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="removeItem(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="cart-footer">
          <div class="total">合计：<span class="total-price">¥{{ totalPrice }}</span></div>
          <el-button type="primary" size="large" @click="handleCheckout" :disabled="selectedIds.length === 0">
            结算 ({{ selectedIds.length }})
          </el-button>
        </div>
      </div>
      <el-empty v-else description="购物车空空如也">
        <el-button type="primary" @click="$router.push('/shops')">去逛逛</el-button>
      </el-empty>

      <!-- Checkout Dialog -->
      <el-dialog v-model="checkoutVisible" title="确认订单" width="500px">
        <div v-if="selectedItems.length > 0">
          <h4 style="margin-bottom:12px">收货地址</h4>
          <el-select v-model="selectedAddressId" placeholder="请选择收货地址" style="width:100%">
            <el-option v-for="addr in addresses" :key="addr.id" :label="addr.receiverName + ' ' + addr.phone + ' - ' + addr.province + addr.city + addr.district + addr.detail" :value="addr.id" />
          </el-select>
          <div style="margin-top:16px">
            <h4>订单概要</h4>
            <div v-for="item in selectedItems" :key="item.id" style="padding:4px 0;color:#666">
              {{ item.productName }} × {{ item.quantity }} = ¥{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
            </div>
            <div style="font-size:20px;font-weight:bold;color:#f56c6c;margin-top:8px">合计: ¥{{ totalPrice }}</div>
          </div>
        </div>
        <template #footer>
          <el-button @click="checkoutVisible = false">取消</el-button>
          <el-button type="primary" @click="submitOrder" :loading="submitting">确认下单</el-button>
        </template>
      </el-dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { getCart, updateCartQuantity, removeFromCart } from '@/api/cart'
import { getProductDetail } from '@/api/product'
import { getAddresses } from '@/api/address'
import { createOrder } from '@/api/order'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const cartItems = ref([])
const selectedIds = ref([])
const checkoutVisible = ref(false)
const selectedAddressId = ref(null)
const addresses = ref([])
const submitting = ref(false)

const cartItemsWithProduct = computed(() => cartItems.value)

const selectedItems = computed(() => {
  return cartItems.value.filter(item => selectedIds.value.includes(item.id))
})

const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + parseFloat(item.price || 0) * item.quantity
  }, 0).toFixed(2)
})

onMounted(async () => {
  await loadCart()
})

async function loadCart() {
  try {
    const res = await getCart(userStore.user.id)
    const items = res.data || []
    // Enrich with product info
    for (const item of items) {
      try {
        const prodRes = await getProductDetail(item.productId)
        const p = prodRes.data
        item.productName = p.name
        item.price = p.price
        item.image = p.image
        item.type = p.type
        item.stock = p.stock
      } catch (e) {
        item.productName = '未知商品'
        item.price = '0'
      }
    }
    cartItems.value = items
  } catch (e) {}
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

async function updateQty(row) {
  try { await updateCartQuantity(row.id, row.quantity) } catch (e) { loadCart() }
}

async function removeItem(id) {
  try { await removeFromCart(id); cartItems.value = cartItems.value.filter(i => i.id !== id); ElMessage.success('已删除') } catch (e) {}
}

async function handleCheckout() {
  try {
    const addrRes = await getAddresses(userStore.user.id)
    addresses.value = addrRes.data || []
    const defaultAddr = addresses.value.find(a => a.isDefault === 1)
    selectedAddressId.value = defaultAddr ? defaultAddr.id : (addresses.value[0]?.id || null)
    checkoutVisible.value = true
  } catch (e) {
    ElMessage.warning('请先添加收货地址')
  }
}

async function submitOrder() {
  if (!selectedAddressId.value) { ElMessage.warning('请选择收货地址'); return }
  submitting.value = true
  try {
    await createOrder(userStore.user.id, {
      addressId: selectedAddressId.value,
      cartItemIds: selectedIds.value
    })
    ElMessage.success('下单成功')
    checkoutVisible.value = false
    router.push('/orders')
  } catch (e) {
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.cart-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; }
.product-cell { display: flex; gap: 12px; align-items: center; }
.product-info .name { font-size: 15px; margin-bottom: 4px; }
.cart-footer { display: flex; justify-content: flex-end; align-items: center; gap: 20px; margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; }
.total { font-size: 18px; }
.total-price { color: #f56c6c; font-size: 24px; font-weight: bold; }
.img-placeholder { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; font-size: 32px; }
</style>