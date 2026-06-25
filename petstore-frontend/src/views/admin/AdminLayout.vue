<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const isCollapsed = ref(false)

const menuItems = [
  { path: '/admin/dashboard', label: '数据概览', icon: 'dashboard' },
  { path: '/admin/products', label: '商品管理', icon: 'product' },
  { path: '/admin/orders', label: '订单管理', icon: 'order' },
  { path: '/admin/users', label: '用户管理', icon: 'user' },
  { path: '/admin/videos', label: '视频管理', icon: 'video' },
]

const isActive = (path) => route.path === path

const handleLogout = () => {
  user.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="admin-sidebar" :class="{ 'admin-sidebar--collapsed': isCollapsed }">
      <div class="admin-sidebar__logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
          <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
          <path d="M8 14v.5M16 14v.5"/>
          <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
          <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
        </svg>
        <span v-if="!isCollapsed" class="admin-sidebar__logo-text">PetStore</span>
      </div>

      <nav class="admin-sidebar__menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="admin-sidebar__item"
          :class="{ 'admin-sidebar__item--active': isActive(item.path) }"
        >
          <span class="admin-sidebar__icon">
            <svg v-if="item.icon === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <svg v-else-if="item.icon === 'product'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            <svg v-else-if="item.icon === 'order'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <svg v-else-if="item.icon === 'user'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <svg v-else-if="item.icon === 'video'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </span>
          <span v-if="!isCollapsed" class="admin-sidebar__label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 右侧主区域 -->
    <div class="admin-main">
      <!-- 顶部栏 -->
      <header class="admin-header">
        <button class="admin-header__toggle" @click="isCollapsed = !isCollapsed">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="admin-header__right">
          <router-link to="/" class="admin-header__link">前台首页</router-link>
          <el-dropdown trigger="click">
            <div class="admin-header__user">
              <el-avatar :size="28" class="admin-header__avatar">
                {{ user.displayName.charAt(0) }}
              </el-avatar>
              <span class="admin-header__username">{{ user.displayName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <span style="color: #e74c3c;">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* ========== 侧边栏 ========== */
.admin-sidebar {
  width: 220px;
  background: #001529;
  color: #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.admin-sidebar--collapsed {
  width: 64px;
}

.admin-sidebar__logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  color: #fff;
}

.admin-sidebar__logo-text {
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}

.admin-sidebar__menu {
  padding: 16px 0;
  flex: 1;
}

.admin-sidebar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.2s;
  font-size: 14px;
}

.admin-sidebar--collapsed .admin-sidebar__item {
  padding: 14px 0;
  justify-content: center;
}

.admin-sidebar__item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.admin-sidebar__item--active {
  color: #fff;
  background: #1c49c2;
}

.admin-sidebar__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.admin-sidebar__label {
  white-space: nowrap;
}

/* ========== 主区域 ========== */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ========== 顶部栏 ========== */
.admin-header {
  height: 64px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.admin-header__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.admin-header__toggle:hover {
  background: #f5f5f5;
  color: #1c49c2;
}

.admin-header__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.admin-header__link {
  font-size: 14px;
  color: #1c49c2;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.admin-header__link:hover {
  background: #f0f6ff;
}

.admin-header__user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.admin-header__user:hover {
  background: #f5f5f5;
}

.admin-header__avatar {
  background: #1c49c2;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.admin-header__username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* ========== 内容区 ========== */
.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 64px;
  }
  .admin-sidebar__label {
    display: none;
  }
  .admin-sidebar__item {
    padding: 14px 0;
    justify-content: center;
  }
  .admin-header__username {
    display: none;
  }
}
</style>
