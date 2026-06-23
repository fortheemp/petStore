<template>
  <el-card
    class="product-card"
    shadow="hover"
    :body-style="{ padding: '0' }"
    @click="goToDetail"
  >
    <div class="card-image">
      <el-image
        :src="product.image"
        fit="cover"
        class="product-image"
        :preview-src-list="[product.image]"
      >
        <template #error>
          <div class="image-placeholder">
            <span class="placeholder-icon">📦</span>
            <span class="placeholder-text">暂无图片</span>
          </div>
        </template>
        <template #placeholder>
          <div class="image-placeholder">
            <span class="placeholder-icon">⏳</span>
            <span class="placeholder-text">加载中...</span>
          </div>
        </template>
      </el-image>
      <el-tag
        class="type-tag"
        :type="product.type === 'pet' ? 'success' : ''"
        size="small"
      >
        {{ product.type === 'pet' ? '宠物' : '用品' }}
      </el-tag>
    </div>

    <div class="card-body">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-desc">{{ truncatedDescription }}</p>
      <div class="card-footer">
        <span class="product-price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ product.price }}</span>
        </span>
        <el-button
          type="primary"
          size="small"
          :icon="ShoppingCartFull"
          circle
          @click.stop="handleAddToCart"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCartFull } from '@element-plus/icons-vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      name: '',
      type: '',
      price: 0,
      image: '',
      description: '',
      shopId: null
    })
  }
})

const emit = defineEmits(['add-to-cart'])
const router = useRouter()

const truncatedDescription = computed(() => {
  const desc = props.product.description || ''
  return desc.length > 30 ? desc.slice(0, 30) + '...' : desc
})

function goToDetail() {
  if (props.product.id) {
    router.push(`/product/${props.product.id}`)
  }
}

function handleAddToCart() {
  if (props.product.id) {
    emit('add-to-cart', props.product.id)
    ElMessage.success(`已将 "${props.product.name}" 加入购物车`)
  }
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f7fa;
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-image :deep(img) {
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  color: #909399;
}

.placeholder-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 13px;
}

.type-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}

.card-body {
  padding: 14px 16px 16px;
}

.product-name {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  margin: 0 0 14px;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  min-height: 39px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  color: #f56c6c;
}

.price-symbol {
  font-size: 14px;
  font-weight: 500;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
}
</style>