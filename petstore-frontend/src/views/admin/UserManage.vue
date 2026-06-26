<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const admin = useAdminStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredUsers = computed(() => {
  if (!searchQuery.value) return admin.users
  const q = searchQuery.value.toLowerCase()
  return admin.users.filter(
    (u) => (u.username && u.username.toLowerCase().includes(q)) || (u.nickname && u.nickname.toLowerCase().includes(q)),
  )
})

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleDelete = (user) => {
  ElMessageBox.confirm(
    `确认删除用户「${user.nickname || user.username}」？此操作不可恢复。`,
    '删除确认',
    { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' },
  ).then(async () => {
    await admin.deleteUser(user.id)
    ElMessage.success('用户已删除')
  }).catch(() => {})
}

const roleLabel = (role) => {
  const map = { admin: '管理员', member: '普通用户', tourist: '游客' }
  return map[role] || '普通用户'
}

const formatTime = (t) => {
  if (!t) return '-'
  return String(t).slice(0, 10)
}
</script>

<template>
  <div class="user-manage">
    <h1 class="page-title">用户管理</h1>

    <!-- 搜索 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名、昵称..."
        style="width: 360px"
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
      <el-table :data="pagedUsers" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="用户名" width="130">
          <template #default="{ row }">
            <span class="username">{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <span class="tag" :class="row.role === 'admin' ? 'tag--admin' : 'tag--user'">
              {{ roleLabel(row.role) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="80">
          <template #default="{ row }">{{ row.level ?? 0 }}</template>
        </el-table-column>
        <el-table-column label="注册时间">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <button
              v-if="row.role !== 'admin'"
              class="action-btn action-btn--danger"
              @click="handleDelete(row)"
            >删除</button>
            <span v-else class="no-action">-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredUsers.length"
        layout="prev, pager, next"
        background
      />
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #121212;
  margin-bottom: 24px;
}

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

.username {
  font-weight: 600;
  color: #121212;
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag--admin { background: #f3e8ff; color: #8b5cf6; }
.tag--user { background: #f0f6ff; color: #1c49c2; }
.tag--success { background: #e6f9ee; color: #00a651; }

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.action-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
  background: #fff;
  white-space: nowrap;
}

.action-btn--danger {
  color: #e74c3c;
  border-color: #e74c3c;
}
.action-btn--danger:hover { background: #fff0f0; }

.no-action { color: #999; }
</style>
