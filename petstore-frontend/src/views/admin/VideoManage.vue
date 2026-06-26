<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { createAdminVideo, updateAdminVideo } from '@/api/admin'

const admin = useAdminStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8

const filteredVideos = computed(() => {
  if (!searchQuery.value) return admin.videos
  const q = searchQuery.value.toLowerCase()
  return admin.videos.filter((v) => v.title && v.title.toLowerCase().includes(q))
})

const pagedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredVideos.value.slice(start, start + pageSize)
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
  title: '',
  url: '',
  productId: null,
  videoFile: null,
  videoPreview: '',
})
const form = ref(defaultForm())

const rules = {
  title: [{ required: true, message: '请输入视频标题', trigger: 'blur' }],
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const getProductName = (video) => {
  return video.relatedProduct?.name || (video.productId ? `商品ID: ${video.productId}` : '-')
}

const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  dialogVisible.value = true
}

const openEdit = (video) => {
  isEditing.value = true
  editingId.value = video.id
  form.value = {
    title: video.title,
    url: video.url || '',
    productId: video.productId || null,
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }

  const fd = new FormData()
  fd.append('title', form.value.title)
  if (form.value.productId) fd.append('productId', String(form.value.productId))
  if (form.value.videoFile) {
    fd.append('file', form.value.videoFile)
  } else if (form.value.url) {
    fd.append('url', form.value.url)
  }

  try {
    if (isEditing.value) {
      await updateAdminVideo(editingId.value, fd)
      ElMessage.success('修改成功')
    } else {
      await createAdminVideo(fd)
      ElMessage.success('添加成功')
    }
    admin.loadVideos()
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}

const handleDelete = (video) => {
  ElMessageBox.confirm(
    `确定要删除视频「${video.title}」吗？此操作不可撤销。`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
  ).then(() => {
    admin.deleteVideo(video.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const handleVideoChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  form.value.videoFile = file
  form.value.videoPreview = file.name
}
</script>

<template>
  <div class="product-manage">
    <div class="page-header">
      <h1 class="page-header__title">视频管理</h1>
      <button class="btn-primary" @click="openAdd">+ 添加视频</button>
    </div>

    <!-- 搜索 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索视频标题..."
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
      <el-table :data="pagedVideos" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="视频标题" min-width="180">
          <template #default="{ row }">
            <span class="product-name">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联商品" width="160">
          <template #default="{ row }">{{ getProductName(row) }}</template>
        </el-table-column>
        <el-table-column label="视频链接" min-width="200">
          <template #default="{ row }">
            <a v-if="row.url" :href="row.url" target="_blank" class="video-link">{{ row.url }}</a>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
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
        :total="filteredVideos.length"
        layout="prev, pager, next"
        background
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑视频' : '添加视频'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入视频标题" />
        </el-form-item>
        <el-form-item label="关联商品">
          <el-select v-model="form.productId" placeholder="请选择关联商品（可选）" style="width: 100%" clearable filterable>
            <el-option
              v-for="p in admin.products"
              :key="p.id"
              :label="`${p.name} (¥${p.price})`"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频文件">
          <div class="image-upload">
            <label class="image-upload__btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {{ form.videoPreview && !isEditing ? '重新选择' : '选择视频文件' }}
              <input type="file" accept="video/*" class="image-upload__input" @change="handleVideoChange" />
            </label>
            <span v-if="form.videoPreview && !isEditing" class="video-upload__name">{{ form.videoPreview }}</span>
          </div>
        </el-form-item>
        <el-form-item v-if="isEditing" label="视频 URL">
          <el-input v-model="form.url" placeholder="当前视频链接（可修改）" />
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

.video-link {
  color: #1c49c2;
  font-size: 13px;
  word-break: break-all;
  text-decoration: none;
}

.video-link:hover {
  text-decoration: underline;
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

.video-upload__name {
  font-size: 13px;
  color: #666;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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