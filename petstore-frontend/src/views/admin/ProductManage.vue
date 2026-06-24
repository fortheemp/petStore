<script setup>
import { ref, computed } from 'vue'
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

// Dialog
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

const defaultForm = () => ({
  name: '',
  category: '',
  price: null,
  stock: null,
  description: '',
})
const form = ref(defaultForm())

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

const categories = [
  { value: 'dogs', label: '狗狗' },
  { value: 'cats', label: '猫咪' },
  { value: 'fish', label: '水族' },
  { value: 'birds', label: '鸟类' },
  { value: 'small', label: '小宠' },
]

const getCategoryLabel = (val) => categories.find((c) => c.value === val)?.label || val

const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  dialogVisible.value = true
}

const openEdit = (product) => {
  isEditing.value = true
  editingId.value = product.id
  form.value = { name: product.name, category: product.category, price: product.price, stock: product.stock, description: product.description || '' }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }

  if (isEditing.value) {
    admin.updateProduct(editingId.value, { ...form.value })
    ElMessage.success('修改成功')
  } else {
    admin.addProduct({ ...form.value })
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
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

const handleToggleStatus = (product) => {
  admin.toggleProductStatus(product.id)
  ElMessage.success(product.status === '上架' ? '已下架' : '已上架')
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
        <el-table-column label="分类" width="100">
          <template #default="{ row }">{{ getCategoryLabel(row.category) }}</template>
        </el-table-column>
        <el-table-column label="价格" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <span class="tag" :class="row.status === '上架' ? 'tag--success' : 'tag--muted'">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <button class="action-btn action-btn--primary" @click="openEdit(row)">编辑</button>
            <button
              class="action-btn"
              :class="row.status === '上架' ? 'action-btn--warning' : 'action-btn--success'"
              @click="handleToggleStatus(row)"
            >{{ row.status === '上架' ? '下架' : '上架' }}</button>
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
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
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
.action-btn--warning { color: #ff6c10; border-color: #ff6c10; }
.action-btn--warning:hover { background: #fff5e6; }
.action-btn--success { color: #00a651; border-color: #00a651; }
.action-btn--success:hover { background: #e6f9ee; }
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
