import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('@/views/product/ProductList.vue'),
    meta: { title: '商品列表' },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/ProductDetail.vue'),
    meta: { title: '商品详情' },
    props: true,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/Cart.vue'),
    meta: { title: '购物车', requireAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { title: '注册', guest: true },
  },
  {
    path: '/nearby-shops',
    name: 'NearbyShops',
    component: () => import('@/views/shop/NearbyShops.vue'),
    meta: { title: '附近宠物商店' },
  },
  {
    path: '/videos',
    name: 'VideoList',
    component: () => import('@/views/video/VideoList.vue'),
    meta: { title: '宠物视频' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/order/Checkout.vue'),
    meta: { title: '确认订单', requireAuth: true },
  },
  {
    path: '/user',
    component: () => import('@/views/user/UserLayout.vue'),
    meta: { requireAuth: true },
    children: [
      {
        path: '',
        redirect: '/user/profile',
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/UserProfile.vue'),
        meta: { title: '个人中心' },
      },
      {
        path: 'address',
        name: 'AddressManage',
        component: () => import('@/views/user/AddressManage.vue'),
        meta: { title: '收货地址' },
      },
      {
        path: 'orders',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue'),
        meta: { title: '我的订单' },
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/OrderDetail.vue'),
        meta: { title: '订单详情' },
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/UserFavorites.vue'),
        meta: { title: '我的收藏' },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requireAuth: true, requireAdmin: true },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '数据概览' },
      },
      {
        path: 'products',
        name: 'ProductManage',
        component: () => import('@/views/admin/ProductManage.vue'),
        meta: { title: '商品管理' },
      },
      {
        path: 'orders',
        name: 'OrderManage',
        component: () => import('@/views/admin/OrderManage.vue'),
        meta: { title: '订单管理' },
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'videos',
        name: 'VideoManage',
        component: () => import('@/views/admin/VideoManage.vue'),
        meta: { title: '视频管理' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('petstore_token')
  const isLoggedIn = !!token

  if (to.meta.requireAuth && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.meta.requireAdmin) {
    const savedUser = localStorage.getItem('petstore_user')
    let isAdmin = false
    try { isAdmin = JSON.parse(savedUser)?.role === 'admin' } catch {}
    if (!isLoggedIn || !isAdmin) {
      ElMessage.error('无管理员权限')
      next('/')
    } else {
      next()
    }
  } else if (to.meta.guest && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

router.afterEach((to) => {
  const title = to.meta.title
  if (title) {
    document.title = `${title} - PetStore`
  }
})

export default router
