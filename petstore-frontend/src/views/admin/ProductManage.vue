<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8

const filteredProducts = computed(() => {
  if (!searchQuery.value) return admin.products
  const q = searchQuery.value.toLowerCase()
  return admin.products.filter((p) => p.name.toLowerCase().includes(q))
})

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const handleSearch = () => {
  currentPage.value = 1
}

onMounted(() => {
  admin.loadAll()
})

// ===== 类型映射 =====
const typeMap = { pet: '宠物', accessory: '宠物周边' }
const getTypeLabel = (val) => typeMap[val] || val
const getShopName = (shopId) => {
  const shop = admin.shops.find((s) => s.id === shopId)
  return shop ? shop.name : '未知商店'
}

// ===== 弹窗 =====
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const imageFile = ref(null)

const defaultForm = () => ({
  shopId: '',
  name: '',
  type: '',
  stock: null,
  price: null,
  description: '',
})
const form = ref(defaultForm())

const rules = {
  shopId: [{ required: true, message: '请选择所属商店', trigger: 'change' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
}

const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  imageFile.value = null
  dialogVisible.value = true
}

const openEdit = (product) => {
  isEditing.value = true
  editingId.value = product.id
  form.value = {
    shopId: product.shopId || '',
    name: product.name,
    type: product.type,
    stock: product.stock,
    price: product.price,
    description: product.description || '',
  }
  imageFile.value = null
  dialogVisible.value = true
}

const handleFileChange = (file) => {
  imageFile.value = file.raw || file
}

const handleSave = async () => {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }

  const fd = new FormData()
  fd.append('shopId', form.value.shopId)
  fd.append('name', form.value.name)
  fd.append('type', form.value.type)
  fd.append('stock', form.value.stock)
  fd.append('price', String(form.value.price))
  if (form.value.description) fd.append('description', form.value.description)
  if (imageFile.value) fd.append('image', imageFile.value)

  const res = isEditing.value
    ? await admin.updateProduct(editingId.value, fd)
    : await admin.addProduct(fd)

  if (res.code === 200) {
    ElMessage.success(isEditing.value ? '修改成功' : '添加成功')
    dialogVisible.value = false
  } else {
    ElMessage.error(res.message || '操作失败')
  }
}

const handleDelete = (product) => {
  ElMessageBox.confirm(
    `确定要删除「${product.name}」吗？此操作不可撤销。`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
  ).then(async () => {
    const res = await admin.deleteProduct(product.id)
    if (res.code === 200) {
      ElMessage.success('已删除')
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  }).catch(() => {})
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
    <div class="table-wrapper" v-loading="admin.loading">
      <el-table :data="pagedProducts" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="商品名称" min-width="160">
          <template #default="{ row }">
            <span class="product-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">{{ getTypeLabel(row.type) }}</template>
        </el-table-column>
        <el-table-column label="所属商店" width="140">
          <template #default="{ row }">{{ getShopName(row.shopId) }}</template>
        </el-table-column>
        <el-table-column label="价格" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <span class="tag" :class="row.stock > 0 ? 'tag--success' : 'tag--muted'">
              {{ row.stock > 0 ? '上架' : '下架' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
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
        <el-form-item label="所属商店" prop="shopId">
          <el-select v-model="form.shopId" placeholder="请选择商店" style="width: 100%">
            <el-option
              v-for="shop in admin.shops"
              :key="shop.id"
              :label="shop.name"
              :value="shop.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="宠物 (活体)" value="pet" />
            <el-option label="宠物周边" value="accessory" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :auto-upload="false"
            :limit="1"
            list-type="picture"
            @change="handleFileChange"
            accept="image/*"
          >
            <el-button size="small" type="primary">选择图片</el-button>
            <template #tip>
              <div class="el-upload__tip">仅支持 JPG/PNG，尺寸建议 800×800</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="false">保存</el-button>
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

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag--success { background: #e6f9ee; color: #00a651; }
.tag--muted { background: #f5f5f5; color: #999; }

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