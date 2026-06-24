<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredUsers = computed(() => {
  if (!searchQuery.value) return admin.users
  const q = searchQuery.value.toLowerCase()
  return admin.users.filter(
    (u) => u.username.toLowerCase().includes(q) || u.nickname.toLowerCase().includes(q) || u.phone.includes(q),
  )
})

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const handleSearch = () => {
  currentPage.value = 1
}

const maskPhone = (phone) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
</script>

<template>
  <div class="user-manage">
    <h1 class="page-title">用户管理</h1>

    <!-- 搜索 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名、昵称、手机号..."
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
        <el-table-column label="手机号" width="140">
          <template #default="{ row }">{{ maskPhone(row.phone) }}</template>
        </el-table-column>
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <span class="tag" :class="row.role === 'admin' ? 'tag--admin' : 'tag--user'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <span class="tag tag--success">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="120" />
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
</style>
