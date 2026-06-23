<template>
  <div>
    <div class="page-header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="showAdd">添加商品</el-button>
    </div>
    <el-table :data="products" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="图片" width="100">
        <template #default="{ row }"><el-image :src="row.image" style="width:60px;height:60px" fit="cover"><template #error>🐾</template></el-image></template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column label="类型" width="80">
        <template #default="{ row }"><el-tag :type="row.type==='pet'?'success':''" size="small">{{ row.type==='pet'?'宠物':'用品' }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="price" label="价格(¥)" width="100" />
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="showEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="editing ? '编辑商品' : '添加商品'" width="550px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="所属商店" prop="shopId" :rules="[{required:true}]">
          <el-select v-model="form.shopId" placeholder="选择商店" style="width:100%">
            <el-option v-for="s in shops" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{required:true}]"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型" prop="type" :rules="[{required:true}]">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="宠物 pet" value="pet" />
            <el-option label="用品 accessory" value="accessory" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格"><el-input v-model="form.price" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="form.stock" :min="0" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" /></el-form-item>
        <el-form-item label="关联视频ID"><el-input-number v-model="form.videoId" :min="0" /></el-form-item>
        <el-form-item label="图片">
          <el-upload :action="uploadUrl" :on-success="onImgSuccess" :before-upload="checkImg" list-type="picture" :limit="1">
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
import { getAdminProducts, addProduct, updateProduct, deleteProduct } from '@/api/admin'
import { getAdminShops } from '@/api/admin'

const products = ref([])
const shops = ref([])
const visible = ref(false)
const editing = ref(false)
const saving = ref(false)
const formRef = ref(null)
const uploadUrl = '/api/upload/image'
let editId = null

const form = reactive({ shopId: null, name: '', type: 'pet', stock: 0, price: '0', description: '', videoId: null, image: '' })

onMounted(async () => { loadProducts(); loadShops() })

async function loadProducts() { try { const r = await getAdminProducts(); products.value = r.data || [] } catch (e) {} }
async function loadShops() { try { const r = await getAdminShops(); shops.value = r.data || [] } catch (e) {} }

function resetForm() {
  Object.assign(form, { shopId: null, name: '', type: 'pet', stock: 0, price: '0', description: '', videoId: null, image: '' })
}

function showAdd() { editing.value = false; editId = null; resetForm(); visible.value = true }
function showEdit(row) {
  editing.value = true; editId = row.id
  Object.assign(form, { shopId: row.shopId, name: row.name, type: row.type, stock: row.stock, price: row.price, description: row.description || '', videoId: row.videoId, image: row.image || '' })
  visible.value = true
}

function onImgSuccess(res) { form.image = res.data || '' }
function checkImg(file) { if (!file.type.startsWith('image/')) { ElMessage.error('只能上传图片'); return false } return true }

async function submit() {
  await formRef.value.validate()
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('shopId', form.shopId); fd.append('name', form.name); fd.append('type', form.type)
    fd.append('stock', form.stock); fd.append('price', form.price)
    fd.append('description', form.description || '')
    if (form.videoId) fd.append('videoId', form.videoId)
    fd.append('imageUrl', form.image || '')
    if (editing.value) { await updateProduct(editId, fd) } else { await addProduct(fd) }
    ElMessage.success('操作成功'); visible.value = false; loadProducts()
  } catch (e) {} finally { saving.value = false }
}

async function handleDelete(id) {
  try { await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }); await deleteProduct(id); ElMessage.success('已删除'); loadProducts() } catch (e) {}
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h2 { font-size: 20px; }
</style>