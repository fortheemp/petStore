<template>
  <div>
    <div class="page-header">
      <h2>视频管理</h2>
      <el-button type="primary" @click="showAdd">添加视频</el-button>
    </div>
    <el-table :data="videos" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" />
      <el-table-column label="预览" width="200">
        <template #default="{ row }"><video :src="row.url" controls style="width:180px;height:100px" /></template>
      </el-table-column>
      <el-table-column prop="productId" label="关联商品ID" width="120" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="showEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="editing ? '编辑视频' : '添加视频'" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="标题" prop="title" :rules="[{required:true}]"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="关联商品ID"><el-input-number v-model="form.productId" /></el-form-item>
        <el-form-item label="视频文件">
          <el-upload :action="uploadUrl" :on-success="onUpload" :before-upload="checkVideo" list-type="text" :limit="1">
            <el-button>上传视频</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="或视频URL"><el-input v-model="form.url" placeholder="直接输入URL" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="saving">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminVideos, addVideo, updateVideo, deleteVideo } from '@/api/admin'

const videos = ref([])
const visible = ref(false)
const editing = ref(false)
const saving = ref(false)
const formRef = ref(null)
const uploadUrl = '/api/upload/video'
let editId = null

const form = reactive({ title: '', url: '', productId: null })

onMounted(loadVideos)
async function loadVideos() { try { const r = await getAdminVideos(); videos.value = r.data || [] } catch (e) {} }

function showAdd() { editing.value = false; editId = null; Object.assign(form, { title: '', url: '', productId: null }); visible.value = true }
function showEdit(row) { editing.value = true; editId = row.id; Object.assign(form, { title: row.title, url: row.url, productId: row.productId }); visible.value = true }

function onUpload(res) { form.url = res.data || '' }
function checkVideo(file) {
  if (!file.type.startsWith('video/')) { ElMessage.error('只能上传视频'); return false }
  return true
}

async function submit() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (editing.value) {
      await updateVideo(editId, { title: form.title, url: form.url, productId: form.productId })
    } else {
      const fd = new FormData()
      fd.append('title', form.title)
      if (form.url) fd.append('url', form.url)
      if (form.productId) fd.append('productId', form.productId)
      await addVideo(fd)
    }
    ElMessage.success('操作成功'); visible.value = false; loadVideos()
  } catch (e) {} finally { saving.value = false }
}

async function handleDelete(id) {
  try { await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }); await deleteVideo(id); ElMessage.success('已删除'); loadVideos() } catch (e) {}
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h2 { font-size: 20px; }
</style>