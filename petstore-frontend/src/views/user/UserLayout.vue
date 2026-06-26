<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const menuItems = [
  { path: '/user/profile', label: '个人资料', icon: 'User' },
  { path: '/user/address', label: '收货地址', icon: 'Location' },
  { path: '/user/orders', label: '我的订单', icon: 'Document' },
  { path: '/user/favorites', label: '我的收藏', icon: 'Star' },
]

const isActive = (path) => {
  if (path === '/user/orders') {
    return route.path.startsWith('/user/orders')
  }
  return route.path === path
}
</script>

<template>
  <div class="user-layout">
    <div class="container user-layout__inner">
      <!-- 左侧边栏 -->
      <aside class="user-sidebar">
        <div class="user-sidebar__user">
          <div class="user-sidebar__avatar">
            <img v-if="user.userInfo?.avatar" :src="user.userInfo.avatar" alt="头像" class="user-sidebar__avatar-img" />
            <span v-else>{{ user.displayName.charAt(0) }}</span>
          </div>
          <p class="user-sidebar__nickname">{{ user.displayName }}</p>
        </div>
        <nav class="user-sidebar__menu">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="user-sidebar__menu-item"
            :class="{ 'user-sidebar__menu-item--active': isActive(item.path) }"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </aside>

      <!-- 右侧内容 -->
      <main class="user-layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.user-layout {
  background: #f8f9fa;
  min-height: calc(100vh - 15.2rem);
  padding: 3.2rem 0 6.4rem;
}

.user-layout__inner {
  display: flex;
  gap: 3.2rem;
  align-items: flex-start;
}

/* ========== 侧边栏 ========== */
.user-sidebar {
  width: 24rem;
  flex-shrink: 0;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.user-sidebar__user {
  padding: 4rem 2.4rem 2.4rem;
  text-align: center;
  background: linear-gradient(135deg, #1c49c2 0%, #3a6fd8 100%);
  position: relative;
}

.user-sidebar__avatar {
  width: 7.2rem;
  height: 7.2rem;
  border-radius: 50%;
  background: #fff;
  color: var(--color-brand-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  font-size: 2.8rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.user-sidebar__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-sidebar__nickname {
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  position: relative;
  z-index: 1;
}

.user-sidebar__menu {
  padding: 1.2rem 0;
}

.user-sidebar__menu-item {
  display: flex;
  align-items: center;
  padding: 1.4rem 2.4rem;
  font-size: 1.5rem;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
}

.user-sidebar__menu-item:hover {
  background: #f8f9fa;
  color: var(--color-brand-blue);
}

.user-sidebar__menu-item--active {
  color: var(--color-brand-blue);
  background: #f0f6ff;
  font-weight: 600;
  border-right: 3px solid var(--color-brand-blue);
}

/* ========== 内容区 ========== */
.user-layout__content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .user-layout__inner {
    flex-direction: column;
  }
  .user-sidebar {
    width: 100%;
  }
  .user-sidebar__menu {
    display: flex;
    overflow-x: auto;
    padding: 0;
  }
  .user-sidebar__menu-item {
    white-space: nowrap;
    border-right: none !important;
    border-bottom: 3px solid transparent;
    padding: 1.2rem 2rem;
  }
  .user-sidebar__menu-item--active {
    border-right: none !important;
    border-bottom-color: var(--color-brand-blue);
  }
}
</style>
