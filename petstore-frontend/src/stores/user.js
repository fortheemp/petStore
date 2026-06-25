import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { post, get } from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)

  const init = () => {
    const savedToken = localStorage.getItem('petstore_token')
    const savedUser = localStorage.getItem('petstore_user')
    if (savedToken) token.value = savedToken
    if (savedUser) {
      try { userInfo.value = JSON.parse(savedUser) } catch { userInfo.value = null }
    }
  }

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const displayName = computed(() => userInfo.value?.nickname || userInfo.value?.username || '')

  /** 登录 — 调用真实后端 API */
  const login = async (loginData) => {
    const res = await post('/user/login', {
      username: loginData.username,
      password: loginData.password,
    })
    if (res.data.code === 200 && res.data.data) {
      const user = res.data.data
      userInfo.value = user
      token.value = 'session_' + user.id
      localStorage.setItem('petstore_token', token.value)
      localStorage.setItem('petstore_user', JSON.stringify(user))
      if (loginData.remember) {
        localStorage.setItem('petstore_rememberedUser', loginData.username)
      } else {
        localStorage.removeItem('petstore_rememberedUser')
      }
      return { success: true, message: '登录成功' }
    }
    return { success: false, message: res.data.message || '用户名或密码错误' }
  }

  /** 注册 — 调用真实后端 API */
  const register = async (registerData) => {
    const res = await post('/user/register', {
      username: registerData.username,
      password: registerData.password,
      nickname: registerData.nickname || registerData.username,
    })
    if (res.data.code === 200) {
      return { success: true, message: '注册成功，请登录' }
    }
    return { success: false, message: res.data.message || '注册失败' }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('petstore_token')
    localStorage.removeItem('petstore_user')
  }

  /** 刷新用户信息（从后端获取最新数据） */
  const refreshUserInfo = async () => {
    if (!userInfo.value?.id) return
    try {
      const res = await get(`/user/profile/${userInfo.value.id}`)
      if (res.data.code === 200) {
        userInfo.value = res.data.data
        localStorage.setItem('petstore_user', JSON.stringify(userInfo.value))
      }
    } catch { /* 忽略刷新失败 */ }
  }

  const updateUserInfo = (data) => {
    userInfo.value = { ...userInfo.value, ...data }
    localStorage.setItem('petstore_user', JSON.stringify(userInfo.value))
  }

  init()

  return {
    token, userInfo, isLoggedIn, isAdmin, displayName,
    login, register, logout, refreshUserInfo, updateUserInfo,
  }
})