import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/register', component: () => import('@/views/Register.vue') },
  { path: '/shops', component: () => import('@/views/ShopList.vue') },
  { path: '/shop/:id', component: () => import('@/views/ShopDetail.vue') },
  { path: '/product/:id', component: () => import('@/views/ProductDetail.vue') },
  { path: '/cart', component: () => import('@/views/Cart.vue'), meta: { requiresAuth: true } },
  { path: '/orders', component: () => import('@/views/OrderList.vue'), meta: { requiresAuth: true } },
  { path: '/order/:id', component: () => import('@/views/OrderDetail.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('@/views/PersonalCenter.vue'), meta: { requiresAuth: true } },
  { path: '/videos', component: () => import('@/views/VideoList.vue') },
  { path: '/ai', component: () => import('@/views/AIChat.vue') },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: 'shops', component: () => import('@/views/admin/ShopManage.vue') },
      { path: 'products', component: () => import('@/views/admin/ProductManage.vue') },
      { path: 'videos', component: () => import('@/views/admin/VideoManage.vue') },
      { path: 'users', component: () => import('@/views/admin/UserManage.vue') },
      { path: 'orders', component: () => import('@/views/admin/OrderManage.vue') },
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router