<template>
  <div>
    <div class="page-header"><h2>用户管理</h2></div>
    <el-table :data="users" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role==='admin'?'danger':row.role==='member'?'primary':'info'" size="small">
            {{ row.role==='admin'?'管理员':row.role==='member'?'会员':'游客' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级" width="80" />
      <el-table-column prop="createdAt" label="注册时间" width="180" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button v-if="row.role !== 'admin'" size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          <span v-else style="color:#999">受保护</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminUsers, deleteUser } from '@/api/admin'

const users = ref([])
onMounted(async () => { try { const r = await getAdminUsers(); users.value = r.data || [] } catch (e) {} })

async function handleDelete(id) {
  try { await ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' }); await deleteUser(id); ElMessage.success('已删除'); users.value = users.value.filter(u => u.id !== id) } catch (e) {}
}
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-header h2 { font-size: 20px; }
</style>