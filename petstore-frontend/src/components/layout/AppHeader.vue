<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cart = useCartStore()
const user = useUserStore()
const searchQuery = ref('')

const mainCategories = [
  { key: 'pet', label: '宠物', query: { productType: 'pet' } },
  { key: 'supply', label: '宠物周边', query: { productType: 'supply' } },
]

const navLinks = [
  { to: '/nearby-shops', label: '附近商店' },
  { to: '/videos', label: '宠物视频' },
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { keyword: searchQuery.value.trim() } })
  }
}

const currentType = ref('')

const handleLogout = () => {
  user.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    handleLogout()
  } else if (cmd) {
    router.push(cmd)
  }
}
</script>

<template>
  <header class="header">
    <div class="header__main">
      <div class="container header__main-inner">
        <!-- Logo -->
        <router-link to="/" class="header__logo">
          <span class="header__logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
              <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
              <path d="M8 14v.5M16 14v.5"/>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
            </svg>
          </span>
          <span class="header__logo-text">PetStore</span>
        </router-link>

        <!-- 分类标签（合并到第一行） -->
        <div class="header__nav-tags">
          <button
            v-for="cat in mainCategories"
            :key="cat.key"
            class="header__nav-tag"
            @click="currentType = cat.key; router.push({ path: '/products', query: cat.query })"
          >
            {{ cat.label }}
          </button>
          <span class="header__nav-divider"></span>
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="header__nav-tag header__nav-tag--link"
          >
            {{ link.label }}
          </router-link>
        </div>

        <!-- 搜索栏（缩小，靠右） -->
        <div class="header__search">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品..."
            size="default"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 右侧操作区 -->
        <div class="header__actions">
          <!-- 未登录 -->
          <template v-if="!user.isLoggedIn">
            <router-link to="/login" class="header__action-item">
              <el-icon :size="24"><User /></el-icon>
              <span class="header__action-label">登录</span>
            </router-link>
            <router-link to="/register" class="header__action-item">
              <el-icon :size="24"><UserFilled /></el-icon>
              <span class="header__action-label">注册</span>
            </router-link>
          </template>

          <!-- 已登录 -->
          <template v-else>
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="header__action-item header__user">
                <el-avatar :size="28" class="header__avatar">
                  {{ user.displayName.charAt(0) }}
                </el-avatar>
                <span class="header__action-label">{{ user.displayName }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="user.isAdmin" command="/admin/dashboard">
                    <span class="dropdown-link dropdown-link--admin">管理后台</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="/user/profile">
                    <span class="dropdown-link">个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="/user/orders">
                    <span class="dropdown-link">我的订单</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <span class="dropdown-link logout">退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>

          <router-link to="/cart" class="header__action-item">
            <el-badge :value="cart.totalItems" :hidden="cart.totalItems === 0">
              <el-icon :size="24"><ShoppingCart /></el-icon>
            </el-badge>
            <span class="header__action-label">购物车</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ========== Header 整体 ========== */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--color-brand-blue);
  color: #fff;
}

/* ========== 主导航栏 ========== */
.header__main {
  background-color: var(--color-brand-blue);
  height: 6rem;
  display: flex;
  align-items: center;
}

.header__main-inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-4);
}

/* Logo */
.header__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  flex-shrink: 0;
}

.header__logo-icon {
  display: flex;
  align-items: center;
  color: #fff;
}

.header__logo-text {
  font-size: var(--text-h2);
  font-weight: var(--font-weight-bold);
  color: #fff;
  letter-spacing: -0.02em;
}

/* 分类标签（第一行） */
.header__nav-tags {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  flex-shrink: 0;
}

.header__nav-tag {
  padding: 0.5rem 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  white-space: nowrap;
  transition: all var(--transition-fast);
  border: none;
  background: none;
  cursor: pointer;
}

.header__nav-tag:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.header__nav-tag--link {
  background: rgba(255, 255, 255, 0.1);
}

.header__nav-tag--link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header__nav-divider {
  width: 1px;
  height: 1.6rem;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 var(--spacing-1);
  flex-shrink: 0;
}

/* 搜索栏（缩小，靠右） */
.header__search {
  flex: 1;
  max-width: 42rem;
  margin-left: auto;
}

.header__search :deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
  box-shadow: none;
  background: #fff;
}

.header__search :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.header__search :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.header__search :deep(.el-input__append) {
  background: var(--color-brand-blue);
  color: #fff;
  border: none;
  box-shadow: none;
}

.header__search :deep(.el-input__append .el-icon) {
  color: #fff;
}

/* 右侧操作 */
.header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
  flex-shrink: 0;
  color: #fff;
}

.header__action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #fff;
  text-decoration: none;
  position: relative;
  transition: color var(--transition-fast);
  min-height: 4.8rem;
}

.header__actions :deep(.el-dropdown) {
  color: #fff;
}

.header__actions :deep(.el-dropdown .el-tooltip__trigger) {
  color: #fff;
}

.header__actions :deep(.el-icon) {
  color: #fff;
}

.header__actions :deep(.el-badge__content) {
  color: #fff;
}

.header__action-item :deep(.el-badge) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.header__action-item :deep(.el-icon) {
  color: #fff;
}

.header__action-item:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.header__action-label {
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
}

/* 用户头像 */
.header__user {
  cursor: pointer;
}

.header__avatar {
  background: #fff;
  color: var(--color-brand-blue);
  font-size: 1.2rem;
  font-weight: 600;
}

.dropdown-link {
  font-size: 1.4rem;
}

.dropdown-link--admin {
  color: #1c49c2;
  font-weight: 600;
}

.dropdown-link.logout {
  color: #bd2848;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .header__main-inner {
    gap: var(--spacing-3);
  }

  .header__logo-text {
    display: none;
  }

  .header__nav-tags {
    display: none;
  }

  .header__action-label {
    display: none;
  }
}
</style>
