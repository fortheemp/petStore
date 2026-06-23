<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">🐾</span>
          <span class="logo-text">宠物商店</span>
        </router-link>

        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :ellipsis="false"
          router
          class="nav-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/shops">商店</el-menu-item>
          <el-menu-item index="/videos">视频</el-menu-item>
          <el-menu-item index="/ai">AI助手</el-menu-item>
          <el-menu-item v-if="userStore.isAdmin" index="/admin/shops">后台管理</el-menu-item>
        </el-menu>

        <div class="header-right">
          <template v-if="userStore.isLoggedIn">
            <span class="user-nickname">{{ userStore.user?.nickname || userStore.user?.username }}</span>
            <router-link to="/cart" class="header-link">
              <el-button text>购物车</el-button>
            </router-link>
            <router-link to="/orders" class="header-link">
              <el-button text>我的订单</el-button>
            </router-link>
            <router-link to="/profile" class="header-link">
              <el-button text>个人中心</el-button>
            </router-link>
            <el-button type="danger" text @click="handleLogout">退出</el-button>
          </template>
          <template v-else>
            <router-link to="/login" class="header-link">
              <el-button type="primary" size="small">登录</el-button>
            </router-link>
            <router-link to="/register" class="header-link">
              <el-button size="small">注册</el-button>
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/admin')) return '/admin/shops'
  if (path.startsWith('/shop')) return '/shops'
  if (path.startsWith('/product')) return '/'
  if (path.startsWith('/order')) return '/orders'
  if (path.startsWith('/cart')) return '/cart'
  if (path.startsWith('/profile')) return '/profile'
  if (path.startsWith('/video')) return '/videos'
  if (path.startsWith('/ai')) return '/ai'
  return path
})

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  gap: 0;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: 20px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  margin-right: 6px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  letter-spacing: 1px;
}

.nav-menu {
  flex: 1;
  border-bottom: none !important;
}

.nav-menu :deep(.el-menu-item) {
  font-size: 15px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-left: 16px;
}

.user-nickname {
  font-size: 14px;
  color: #409eff;
  margin-right: 12px;
  font-weight: 500;
}

.header-link {
  text-decoration: none;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
</style>