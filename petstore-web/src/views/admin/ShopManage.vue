<template>
  <div>
    <div class="page-header">
      <h2>商店管理</h2>
      <el-button type="primary" @click="showAdd">添加商店</el-button>
    </div>
    <el-table :data="shops" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="图片" width="100">
        <template #default="{ row }"><el-image :src="row.image" style="width:60px;height:60px" fit="cover"><template #error>🏪</template></el-image></template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="longitude" label="经度" width="100" />
      <el-table-column prop="latitude" label="纬度" width="100" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="showEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="editing ? '编辑商店' : '添加商店'" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name" :rules="[{required:true}]"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="地址" prop="address" :rules="[{required:true}]"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="经度" prop="longitude"><el-input-number v-model="form.longitude" :precision="6" /></el-form-item>
        <el-form-item label="纬度" prop="latitude"><el-input-number v-model="form.latitude" :precision="6" /></el-form-item>
        <el-form-item label="图片">
          <el-upload :action="uploadUrl" :on-success="onImageSuccess" :before-upload="checkImage" list-type="picture" :limit="1">
            <el-button>上传图片</el-button>
          </el-upload>
        </el-form-item>
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
import { getAdminShops, addShop, updateShop, deleteShop } from '@/api/admin'

const shops = ref([])
const visible = ref(false)
const editing = ref(false)
const saving = ref(false)
const formRef = ref(null)
const uploadUrl = '/api/upload/image'
let editId = null

const form = reactive({ name: '', address: '', longitude: 0, latitude: 0, image: '' })

onMounted(loadShops)

async function loadShops() {
  try { const res = await getAdminShops(); shops.value = res.data || [] } catch (e) {}
}

function showAdd() {
  editing.value = false; editId = null
  Object.assign(form, { name: '', address: '', longitude: 0, latitude: 0, image: '' })
  visible.value = true
}

function showEdit(row) {
  editing.value = true; editId = row.id
  Object.assign(form, { name: row.name, address: row.address, longitude: row.longitude, latitude: row.latitude, image: row.image || '' })
  visible.value = true
}

function onImageSuccess(res) { form.image = res.data || '' }
function checkImage(file) {
  if (!file.type.startsWith('image/')) { ElMessage.error('只能上传图片'); return false }
  return true
}

async function submit() {
  await formRef.value.validate()
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.name); fd.append('address', form.address)
    fd.append('longitude', form.longitude); fd.append('latitude', form.latitude)
    fd.append('imageUrl', form.image || '')
    if (editing.value) { await updateShop(editId, fd) } else { await addShop(fd) }
    ElMessage.success('操作成功'); visible.value = false; loadShops()
  } catch (e) {} finally { saving.value = false }
}

async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定删除该商店？', '提示', { type: 'warning' })
    await deleteShop(id); ElMessage.success('已删除'); loadShops()
  } catch (e) {}
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h2 { font-size: 20px; }
</style>