<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAdminVideos, createAdminVideo, updateAdminVideo, deleteAdminVideo } from '@/api/admin'
import { getProducts } from '@/api/product'

const videos = ref([])
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 8

const fetchVideos = async () => {
  loading.value = true
  try {
    const res = await getAdminVideos()
    videos.value = Array.isArray(res) ? res : []
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  try {
    const res = await getProducts({ pageSize: 200 })
    products.value = res?.list || []
  } catch {
    products.value = []
  }
}

onMounted(() => {
  fetchVideos()
  fetchProducts()
})

const getProductName = (productId) => {
  if (!productId) return '-'
  const p = products.value.find((p) => p.id === productId)
  return p ? p.name : `商品#${productId}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const filteredVideos = computed(() => {
  if (!searchQuery.value) return videos.value
  const q = searchQuery.value.toLowerCase()
  return videos.value.filter((v) => v.title?.toLowerCase().includes(q))
})

const pagedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredVideos.value.slice(start, start + pageSize)
})

const handleSearch = () => {
  currentPage.value = 1
}

// ===== 弹窗 =====
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const videoFile = ref(null)
const useExternalUrl = ref(false)

const defaultForm = () => ({
  title: '',
  url: '',
  productId: null,
})
const form = ref(defaultForm())

const rules = {
  title: [{ required: true, message: '请输入视频标题', trigger: 'blur' }],
}

const openAdd = () => {
  isEditing.value = false
  editingId.value = null
  form.value = defaultForm()
  videoFile.value = null
  useExternalUrl.value = false
  dialogVisible.value = true
}

const openEdit = (video) => {
  isEditing.value = true
  editingId.value = video.id
  form.value = {
    title: video.title || '',
    url: video.url || '',
    productId: video.productId || null,
  }
  videoFile.value = null
  useExternalUrl.value = false
  dialogVisible.value = true
}

const handleFileChange = (file) => {
  videoFile.value = file.raw || file
}

const handleSave = async () => {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }

  if (isEditing.value) {
    const fd = new FormData()
    fd.append('title', form.value.title)
    if (form.value.url) fd.append('url', form.value.url)
    if (form.value.productId) fd.append('productId', form.value.productId)

    const res = await updateAdminVideo(editingId.value, fd)
    ElMessage.success('修改成功')
    dialogVisible.value = false
    fetchVideos()
  } else {
    if (!videoFile.value && !form.value.url) {
      ElMessage.warning('请上传视频文件或填写外部视频链接')
      return
    }

    const fd = new FormData()
    fd.append('title', form.value.title)
    if (videoFile.value) {
      fd.append('file', videoFile.value)
    } else if (form.value.url) {
      fd.append('url', form.value.url)
    }
    if (form.value.productId) {
      fd.append('productId', form.value.productId)
    }

    const res = await createAdminVideo(fd)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchVideos()
  }
}

const handleDelete = (video) => {
  ElMessageBox.confirm(
    `确定要删除视频「${video.title}」吗？此操作不可撤销。`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
  ).then(async () => {
    await deleteAdminVideo(video.id)
    ElMessage.success('已删除')
    fetchVideos()
  }).catch(() => {})
}
</script>

<template>
  <div class="video-manage">
    <div class="page-header">
      <h1 class="page-header__title">视频管理</h1>
      <button class="btn-primary" @click="openAdd">+ 上传视频</button>
    </div>

    <!-- 搜索 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索视频标题..."
        style="width: 320px"
        @keyup.enter="handleSearch"
        clearable
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-wrapper" v-loading="loading">
      <el-table :data="pagedVideos" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="视频标题" min-width="180">
          <template #default="{ row }">
            <span class="video-title">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预览" width="200">
          <template #default="{ row }">
            <div class="video-preview">
              <video
                v-if="row.url"
                :src="row.url"
                controls
                preload="metadata"
                class="video-preview__player"
              ></video>
              <span v-else class="video-preview__placeholder">无视频</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联商品" width="140">
          <template #default="{ row }">
            {{ getProductName(row.productId) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
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
    <div class="pagination" v-if="filteredVideos.length > pageSize">
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
      :title="isEditing ? '编辑视频' : '上传视频'"
      width="560px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入视频标题" />
        </el-form-item>

        <template v-if="!isEditing">
          <el-form-item label="上传方式">
            <el-radio-group v-model="useExternalUrl">
              <el-radio :value="false">本地文件</el-radio>
              <el-radio :value="true">外部链接</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="!useExternalUrl" label="视频文件">
            <el-upload
              :auto-upload="false"
              :limit="1"
              @change="handleFileChange"
              accept="video/*"
            >
              <el-button size="small" type="primary">选择视频文件</el-button>
              <template #tip>
                <div class="el-upload__tip">支持 MP4/WebM/OGG 格式，单个文件不超过 100MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item v-else label="视频链接">
            <el-input v-model="form.url" placeholder="请输入外部视频直链地址" />
          </el-form-item>
        </template>

        <el-form-item v-else label="视频链接">
          <el-input v-model="form.url" placeholder="可修改外部视频链接地址（选填）" />
          <div class="el-upload__tip" style="margin-top: 4px">
            编辑模式不支持替换已上传的视频文件，仅可修改外部链接
          </div>
        </el-form-item>

        <el-form-item label="关联商品">
          <el-select v-model="form.productId" placeholder="请选择关联商品（可选）" style="width: 100%" clearable>
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
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

.video-title {
  font-weight: 600;
  color: #121212;
}

.video-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.video-preview__player {
  width: 180px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  background: #000;
}

.video-preview__placeholder {
  color: #999;
  font-size: 13px;
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
