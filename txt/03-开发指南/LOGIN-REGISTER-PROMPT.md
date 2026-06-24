# 登录/注册页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发登录/注册页

---

## 📋 任务目标

开发 PetStore 宠物商店的**登录页和注册页**，建立完整的用户认证体系，让已登录用户可以进行下单等操作。

---

## 🎯 当前项目状态

### 已完成
- ✅ 首页、商品列表页、商品详情页、购物车页
- ✅ 路由配置（`/products`、`/products/:id`、`/cart`）
- ✅ 设计系统 CSS 变量（Chewy 风格）
- ✅ Pinia 购物车 Store

### 待开发
- ❌ 登录页 `/login`
- ❌ 注册页 `/register`
- ❌ 用户状态管理（Pinia User Store）
- ❌ 路由守卫（未登录访问受限页面时跳转登录）
- ❌ Header 登录/用户信息展示切换

---

## 🎨 设计规范

**重要**：请先阅读以下文档：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 完整设计规范
2. `txt/02-设计规范/DESIGN-CHEATSHEET.md` - 快速参考

### 核心设计要点

#### 色彩（Chewy 风格）
```css
品牌蓝：#1c49c2（主按钮、链接）
品牌橙：#ff6c10（次要CTA）
价格红：#bd2848（错误提示）
成功绿：#00a651（成功提示）
背景：#f8f9fa（页面背景）
卡片：#ffffff（表单卡片）
文字：#121212（主文字）、#4d4d4d（次文字）
```

#### 圆角和阴影
```css
卡片：12px
按钮：8px
输入框：8px

卡片阴影：0 4px 24px rgba(0, 0, 0, 0.08)
输入框focus：0 0 0 3px rgba(28, 73, 194, 0.1)
```

---

## 📐 页面结构设计

### 1. 登录页 /login

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [PetStore Logo]                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │                      欢迎回来                      │  │
│  │                 登录您的 PetStore 账户             │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  用户名 / 手机号 / 邮箱                      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌────────────────────────────────────┐ ┌─────┐  │  │
│  │  │  密码                             │ 👁  │  │  │
│  │  └────────────────────────────────────┘ └─────┘  │  │
│  │                                                   │  │
│  │  [ ] 记住我                  忘记密码？            │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │                  登 录                       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ───────────── 或者 ─────────────                 │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │          使用微信登录                         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │                                                   │  │
│  │  还没有账户？ 立即注册                             │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. 注册页 /register

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [PetStore Logo]                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │                      创建账户                      │  │
│  │              加入 PetStore 开始购物                 │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  用户名                                      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  手机号                                      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ┌──────────────────────────────┐ ┌────────────┐  │  │
│  │  │  验证码                      │ │ 获取验证码  │  │  │
│  │  └──────────────────────────────┘ └────────────┘  │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  密码                                        │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  密码强度：弱 ●●○○                                │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  确认密码                                    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  [ ] 我已阅读并同意《用户协议》和《隐私政策》      │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │                  注 册                       │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │                                                   │  │
│  │  已有账户？ 立即登录                               │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 组件拆分建议

### 页面组件

#### 1. Login.vue
**位置**：`src/views/auth/Login.vue`

**职责**：
- 登录表单展示
- 表单验证
- 调用登录 API
- 登录成功跳转
- 跳转注册页链接

#### 2. Register.vue
**位置**：`src/views/auth/Register.vue`

**职责**：
- 注册表单展示
- 表单验证
- 获取验证码倒计时
- 调用注册 API
- 注册成功跳转登录
- 跳转登录页链接

### 公共组件

#### 3. AuthForm.vue（可选，如果想复用）
**位置**：`src/components/auth/AuthForm.vue`

**职责**：
- 登录/注册表单公共样式
- Logo 展示
- 底部链接

---

## 📝 功能需求清单

### 登录页 P0
- [ ] 路由配置 `/login`
- [ ] 用户名输入框（支持用户名/手机号/邮箱）
- [ ] 密码输入框（支持显示/隐藏密码）
- [ ] 记住我 复选框
- [ ] 忘记密码链接（点击提示"功能开发中"）
- [ ] 登录按钮
- [ ] 微信登录按钮（占位，点击提示"功能开发中"）
- [ ] 跳转注册页链接
- [ ] 表单验证（用户名和密码必填）
- [ ] 登录成功后跳转到首页或之前页面
- [ ] 登录失败提示错误信息

### 注册页 P0
- [ ] 路由配置 `/register`
- [ ] 用户名输入框
- [ ] 手机号输入框
- [ ] 验证码输入框 + 获取验证码按钮（60秒倒计时）
- [ ] 密码输入框（显示密码强度）
- [ ] 确认密码输入框
- [ ] 用户协议复选框（必须勾选才能注册）
- [ ] 注册按钮
- [ ] 跳转登录页链接
- [ ] 表单验证（所有字段必填、格式校验）
- [ ] 注册成功后跳转登录页
- [ ] 注册失败提示错误信息

### 用户状态管理 P0
- [ ] Pinia User Store（用户信息、token）
- [ ] 登录成功后存储 token 到 localStorage
- [ ] 页面刷新后自动恢复登录状态
- [ ] 退出登录功能

### 路由守卫 P0
- [ ] 未登录用户访问购物车页，跳转登录页
- [ ] 未登录用户访问下单页，跳转登录页
- [ ] 登录后自动跳转到之前想访问的页面

### Header 修改 P0
- [ ] 未登录：显示「登录」「注册」按钮
- [ ] 已登录：显示用户头像/昵称，下拉菜单（我的订单、个人中心、退出登录）

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/auth/Login.vue'),
  meta: {
    title: '登录',
    guest: true  // 仅游客可访问（已登录用户访问会跳转首页）
  }
},
{
  path: '/register',
  name: 'Register',
  component: () => import('@/views/auth/Register.vue'),
  meta: {
    title: '注册',
    guest: true
  }
}
```

### 2. 路由守卫
```typescript
// src/router/guards.ts 或 src/router/index.ts

import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isLoggedIn
  
  // 需要登录的页面
  if (to.meta.requireAuth && !isAuthenticated) {
    // 记录当前页面，登录后跳转回来
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  // 仅游客可访问的页面（登录/注册），已登录用户访问会跳转首页
  else if (to.meta.guest && isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})
```

### 3. Pinia User Store
```typescript
// src/stores/user.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  phone: string
  role: 'user' | 'admin'
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  
  // 初始化时从 localStorage 读取
  const init = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('userInfo')
    
    if (savedToken) {
      token.value = savedToken
    }
    
    if (savedUser) {
      userInfo.value = JSON.parse(savedUser)
    }
  }
  
  // Getters
  const isLoggedIn = computed(() => {
    return !!token.value
  })
  
  const isAdmin = computed(() => {
    return userInfo.value?.role === 'admin'
  })
  
  const displayName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.username || ''
  })
  
  // Actions
  const login = async (loginData: {
    username: string
    password: string
    remember: boolean
  }) => {
    // Mock API 调用
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        // Mock 登录验证
        if (loginData.username && loginData.password) {
          // 模拟登录成功
          const mockToken = 'mock_token_' + Date.now()
          const mockUser: UserInfo = {
            id: 1001,
            username: loginData.username,
            nickname: '宠物达人',
            avatar: '/images/default-avatar.png',
            phone: '138****8888',
            role: 'user'
          }
          
          // 存储 token 和用户信息
          token.value = mockToken
          userInfo.value = mockUser
          
          localStorage.setItem('token', mockToken)
          localStorage.setItem('userInfo', JSON.stringify(mockUser))
          
          if (loginData.remember) {
            localStorage.setItem('rememberedUser', loginData.username)
          } else {
            localStorage.removeItem('rememberedUser')
          }
          
          resolve({ success: true, message: '登录成功' })
        } else {
          resolve({ success: false, message: '用户名或密码错误' })
        }
      }, 500)
    })
  }
  
  const register = async (registerData: {
    username: string
    phone: string
    code: string
    password: string
  }) => {
    // Mock API 调用
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        // 模拟注册成功
        resolve({ success: true, message: '注册成功' })
      }, 500)
    })
  }
  
  const logout = () => {
    token.value = ''
    userInfo.value = null
    
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  
  const updateUserInfo = (newInfo: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...newInfo }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }
  
  return {
    token,
    userInfo,
    isLoggedIn,
    isAdmin,
    displayName,
    init,
    login,
    register,
    logout,
    updateUserInfo
  }
})
```

### 4. 登录页逻辑
```typescript
// src/views/auth/Login.vue

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const loading = ref(false)
const showPassword = ref(false)

// 页面加载时读取记住的用户名
onMounted(() => {
  const rememberedUser = localStorage.getItem('rememberedUser')
  if (rememberedUser) {
    loginForm.value.username = rememberedUser
    loginForm.value.remember = true
  }
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

// 登录提交
const handleLogin = async () => {
  loading.value = true
  
  try {
    const result = await userStore.login(loginForm.value)
    
    if (result.success) {
      ElMessage.success('登录成功')
      
      // 跳转到之前想访问的页面，或首页
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 跳转注册
const goToRegister = () => {
  router.push('/register')
}
```

### 5. 注册页逻辑
```typescript
// src/views/auth/Register.vue

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const registerForm = ref({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  agreePolicy: false
})

const loading = ref(false)
const showPassword = ref(false)
const countdown = ref(0)
const countdownTimer = ref<number | null>(null)

// 密码强度计算
const passwordStrength = ref(0)  // 0-4
const checkPasswordStrength = () => {
  const pwd = registerForm.value.password
  let strength = 0
  
  if (pwd.length >= 6) strength++
  if (pwd.length >= 10) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++
  
  passwordStrength.value = Math.min(strength, 4)
}

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名3-20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 获取验证码
const handleGetCode = async () => {
  // 验证手机号格式
  if (!registerForm.value.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    ElMessage.warning('手机号格式不正确')
    return
  }
  
  // 开始倒计时
  countdown.value = 60
  countdownTimer.value = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
    }
  }, 1000)
  
  ElMessage.success('验证码已发送（Mock：123456）')
}

// 注册提交
const handleRegister = async () => {
  // 验证是否同意协议
  if (!registerForm.value.agreePolicy) {
    ElMessage.warning('请阅读并同意用户协议和隐私政策')
    return
  }
  
  loading.value = true
  
  try {
    const result = await userStore.register(registerForm.value)
    
    if (result.success) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 跳转登录
const goToLogin = () => {
  router.push('/login')
}
```

### 6. Header 登录状态切换
```vue
<!-- src/components/layout/Header.vue -->

<template>
  <header class="header">
    <!-- Logo、搜索框等 -->
    
    <div class="header-right">
      <!-- 未登录 -->
      <template v-if="!userStore.isLoggedIn">
        <router-link to="/login" class="header-action">
          <el-icon :size="24"><User /></el-icon>
          <span class="header-action__text">登录</span>
        </router-link>
        
        <router-link to="/register" class="header-action">
          <el-icon :size="24"><UserFilled /></el-icon>
          <span class="header-action__text">注册</span>
        </router-link>
      </template>
      
      <!-- 已登录 -->
      <template v-else>
        <el-dropdown trigger="click">
          <div class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo?.avatar">
              {{ userStore.displayName.charAt(0) }}
            </el-avatar>
            <span class="user-name">{{ userStore.displayName }}</span>
          </div>
          
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/user/profile">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/user/orders">我的订单</router-link>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      
      <!-- 购物车（始终显示） -->
      <router-link to="/cart" class="header-action">
        <el-badge :value="cartStore.totalItems" :hidden="cartStore.totalItems === 0">
          <el-icon :size="24"><ShoppingCart /></el-icon>
        </el-badge>
        <span class="header-action__text">购物车</span>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  cartStore.clearCart()  // 可选：退出时清空购物车
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>
```

---

## 🎨 样式示例

### 登录/注册页面整体样式
```scss
.auth-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  
  &__card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    padding: 48px 40px;
    
    @media (max-width: 480px) {
      padding: 32px 24px;
    }
  }
  
  &__logo {
    text-align: center;
    margin-bottom: 32px;
    
    img {
      height: 48px;
    }
    
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: #1c49c2;
    }
  }
  
  &__title {
    text-align: center;
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 700;
    color: #121212;
  }
  
  &__subtitle {
    text-align: center;
    margin-bottom: 32px;
    font-size: 14px;
    color: #666;
  }
}
```

### 表单输入框样式
```scss
.auth-form {
  &__item {
    margin-bottom: 20px;
    
    .el-input {
      height: 48px;
      
      .el-input__wrapper {
        border-radius: 8px;
        padding: 0 16px;
        box-shadow: 0 0 0 1px #ddd;
        
        &:hover {
          box-shadow: 0 0 0 1px #bbb;
        }
        
        &.is-focus {
          box-shadow: 0 0 0 3px rgba(28, 73, 194, 0.1);
        }
      }
      
      .el-input__inner {
        font-size: 15px;
      }
    }
    
    // 密码输入框
    .password-input {
      position: relative;
      
      .toggle-password {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 4px;
        
        &:hover {
          color: #666;
        }
      }
    }
  }
  
  // 验证码输入框
  &__code {
    display: flex;
    gap: 12px;
    
    .el-input {
      flex: 1;
    }
    
    .btn-get-code {
      width: 120px;
      height: 48px;
      border: 1px solid #1c49c2;
      background: #fff;
      color: #1c49c2;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        background: #f0f6ff;
      }
      
      &:disabled {
        border-color: #ddd;
        color: #999;
        cursor: not-allowed;
      }
    }
  }
  
  // 复选框行
  &__options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 14px;
    
    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }
    
    .forgot-password {
      color: #1c49c2;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  // 用户协议
  &__agreement {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 24px;
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    
    .el-checkbox {
      margin-top: 2px;
    }
    
    a {
      color: #1c49c2;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  // 提交按钮
  &__submit {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  // 分隔线
  &__divider {
    display: flex;
    align-items: center;
    margin: 24px 0;
    color: #999;
    font-size: 13px;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #eee;
    }
    
    &::before {
      margin-right: 16px;
    }
    
    &::after {
      margin-left: 16px;
    }
  }
  
  // 第三方登录
  &__social {
    .btn-wechat {
      width: 100%;
      height: 48px;
      background: #07c160;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: #06ad56;
      }
    }
  }
  
  // 底部链接
  &__footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #666;
    
    a {
      color: #1c49c2;
      font-weight: 600;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

### 密码强度指示器样式
```scss
.password-strength {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  
  &__bar {
    flex: 1;
    height: 4px;
    background: #eee;
    border-radius: 2px;
    transition: background 0.2s;
    
    &.active {
      &.weak {
        background: #e74c3c;
      }
      
      &.medium {
        background: #f39c12;
      }
      
      &.strong {
        background: #27ae60;
      }
    }
  }
  
  &__text {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
    
    &.weak {
      color: #e74c3c;
    }
    
    &.medium {
      color: #f39c12;
    }
    
    &.strong {
      color: #27ae60;
    }
  }
}
```

---

## 📂 参考文件

开发前请阅读：
1. `txt/02-设计规范/DESIGN-SYSTEM.md` - 设计规范
2. `src/stores/cart.ts` - 购物车 Store（参考状态管理模式）
3. `src/components/layout/Header.vue` - Header（修改登录状态切换）
4. `src/router/index.ts` - 路由配置（添加路由守卫）

---

## ✅ 验收标准

### 登录页功能
- [ ] 路由 `/login` 可访问
- [ ] 用户名/密码输入框正常
- [ ] 密码显示/隐藏切换正常
- [ ] 记住我勾选后，下次访问自动填充用户名
- [ ] 表单验证（必填、密码长度）正常
- [ ] 登录成功提示并跳转
- [ ] 登录失败显示错误信息
- [ ] 跳转注册页链接正常
- [ ] 已登录用户访问登录页，自动跳转首页

### 注册页功能
- [ ] 路由 `/register` 可访问
- [ ] 用户名、手机号、验证码、密码、确认密码输入框正常
- [ ] 获取验证码按钮倒计时正常（60秒）
- [ ] 密码强度指示器正常
- [ ] 表单验证（必填、手机号格式、密码一致）正常
- [ ] 注册成功提示并跳转登录页
- [ ] 注册失败显示错误信息
- [ ] 跳转登录页链接正常
- [ ] 未勾选用户协议，提示必须勾选

### 用户状态管理
- [ ] 登录成功后 token 存储到 localStorage
- [ ] 刷新页面后登录状态保持
- [ ] Header 正确显示登录/注册或用户信息
- [ ] 退出登录清除 token 和用户信息
- [ ] 退出后 Header 恢复显示登录/注册

### 路由守卫
- [ ] 未登录访问 `/cart`，跳转 `/login?redirect=/cart`
- [ ] 未登录访问下单页，跳转登录页
- [ ] 登录成功后自动跳转到之前想访问的页面
- [ ] 已登录访问 `/login` 或 `/register`，跳转首页

### 设计验收
- [ ] 符合 Chewy 设计风格
- [ ] 卡片居中，阴影和圆角正确
- [ ] 输入框 focus 有蓝色外框
- [ ] 按钮颜色正确（登录蓝色、微信绿色）
- [ ] 无 emoji
- [ ] 响应式适配（移动端正常）

---

## 💬 启动指令示例

```
我们要开发 PetStore 的登录/注册页面。

当前状态：
- 商品浏览和购物车功能已完成
- 需要登录才能下单
- 需要实现完整的用户认证体系

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md 了解设计规范
2. 创建 Pinia User Store（src/stores/user.ts）
3. 配置路由 /login 和 /register
4. 实现路由守卫（未登录访问购物车跳转登录页）
5. 创建 Login.vue 登录页
6. 创建 Register.vue 注册页
7. 修改 Header 组件，登录状态切换显示

使用 Mock 数据实现，不需要真实后端。
```

---

## 🎯 预期效果

完成后，用户可以：
1. ✅ 点击 Header「登录」跳转到登录页
2. ✅ 输入用户名密码登录（Mock 验证）
3. ✅ 登录成功后 Header 显示用户昵称
4. ✅ 点击「注册」跳转注册页
5. ✅ 填写信息注册（获取验证码倒计时）
6. ✅ 注册成功跳转登录页
7. ✅ 未登录访问购物车，自动跳转登录页
8. ✅ 登录后自动跳回之前想访问的页面
9. ✅ 退出登录清除状态

---

**祝开发顺利！**
