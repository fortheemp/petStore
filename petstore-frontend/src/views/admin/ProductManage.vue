<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { createAdminProduct, updateAdminProduct } from '@/api/admin'
import { get } from '@/api/request'
import { subcategoriesMap } from '@/api/product'

const admin = useAdminStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8
const shops = ref([])

onMounted(async () => {
  try {
    const res = await get('/shops')
    shops.value = Array.isArray(res) ? res : []
  } catch { shops.value = [] }
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return admin.products
  const q = searchQuery.value.toLowerCase()
  return admin.products.filter((p) => p.name && p.name.toLowerCase().includes(q))
})

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const handleSearch = () => {
  currentPage.value = 1
}

// Dialog
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

const defaultForm = () => ({
  shopId: null,
  name: '',
  type: 'pet',
  subcategory: '',
  price: null,
  stock: null,
  description: '',
  imageFile: null,
  imagePreview: '',
})
const form = ref(defaultForm())

const rules = {
  shopId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

const productTypes = [
  { value: 'pet', label: '宠物' },
  { value: 'accessory', label: '宠物周边' },
]

const allSubcategories = Object.values(subcategoriesMap).flat()

const getTypeLabel = (val) => productTypes.find((t) => t.value === val)?.label || val || '-'
const getShopName = (id) => shops.value.find((s) => s.id === id)?.name || '-'

const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  dialogVisible.value = true
}

const openEdit = (product) => {
  isEditing.value = true
  editingId.value = product.id
  form.value = {
    shopId: product.shopId,
    name: product.name,
    type: product.type || 'pet',
    subcategory: product.subcategory || '',
    price: Number(product.price) || null,
    stock: product.stock,
    description: product.description || '',
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }

  const fd = new FormData()
  fd.append('shopId', form.value.shopId)
  fd.append('name', form.value.name)
  fd.append('type', form.value.type)
  if (form.value.subcategory) fd.append('subcategory', form.value.subcategory)
  fd.append('price', String(form.value.price))
  fd.append('stock', form.value.stock)
  if (form.value.description) fd.append('description', form.value.description)
  if (form.value.imageFile) fd.append('image', form.value.imageFile)

  try {
    if (isEditing.value) {
      await updateAdminProduct(editingId.value, fd)
      ElMessage.success('修改成功')
    } else {
      await createAdminProduct(fd)
      ElMessage.success('添加成功')
    }
    admin.loadProducts()
    dialogVisible.value = false
  } catch {
    ElMessage.error('操作失败')
  }
}

const handleDelete = (product) => {
  ElMessageBox.confirm(
    `确定要删除「${product.name}」吗？此操作不可撤销。`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
  ).then(() => {
    admin.deleteProduct(product.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const handleImageChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  form.value.imageFile = file
  form.value.imagePreview = URL.createObjectURL(file)
}
</script>

<template>
  <div class="product-manage">
    <div class="page-header">
      <h1 class="page-header__title">商品管理</h1>
      <button class="btn-primary" @click="openAdd">+ 添加商品</button>
    </div>

    <!-- 搜索 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索商品名称..."
        style="width: 320px"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-wrapper">
      <el-table :data="pagedProducts" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="商品名称" min-width="180">
          <template #default="{ row }">
            <span class="product-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="店铺" width="120">
          <template #default="{ row }">{{ getShopName(row.shopId) }}</template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">{{ getTypeLabel(row.type) }}</template>
        </el-table-column>
        <el-table-column label="价格" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <button class="action-btn action-btn--primary" @click="openEdit(row)">编辑</button>
            <button class="action-btn action-btn--danger" @click="handleDelete(row)">删除</button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredProducts.length"
        layout="prev, pager, next"
        background
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑商品' : '添加商品'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺" prop="shopId">
          <el-select v-model="form.shopId" placeholder="请选择店铺" style="width: 100%">
            <el-option v-for="shop in shops" :key="shop.id" :label="shop.name" :value="shop.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option v-for="t in productTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="子分类">
          <el-select v-model="form.subcategory" placeholder="请选择子分类（可不选）" clearable style="width: 100%">
            <el-option v-for="sub in allSubcategories" :key="sub" :label="sub" :value="sub" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="商品图片">
          <div class="image-upload">
            <label class="image-upload__btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              {{ form.imagePreview ? '重新选择' : '选择图片' }}
              <input type="file" accept="image/*" class="image-upload__input" @change="handleImageChange" />
            </label>
            <div v-if="form.imagePreview" class="image-upload__preview">
              <img :src="form.imagePreview" alt="预览" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header__title {
  font-size: 24px;
  font-weight: 700;
  color: #121212;
}

.btn-primary {
  padding: 10px 24px;
  background: #1c49c2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover { background: #1539a0; }

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.table-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.product-name {
  font-weight: 600;
  color: #121212;
}

.price {
  font-weight: 600;
  color: #bd2848;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.image-upload__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.image-upload__btn:hover {
  border-color: #1c49c2;
  color: #1c49c2;
}

.image-upload__input {
  display: none;
}

.image-upload__preview {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eee;
  flex-shrink: 0;
}

.image-upload__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  margin-right: 4px;
}

.action-btn--primary { color: #1c49c2; border-color: #1c49c2; }
.action-btn--primary:hover { background: #f0f6ff; }
.action-btn--danger { color: #e74c3c; border-color: #e74c3c; }
.action-btn--danger:hover { background: #fff0f0; }

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .page-header { flex-direction: column; gap: 12px; align-items: flex-start; }
}
</style>
