import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  const login = (loginData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (loginData.username && loginData.password) {
          const mockToken = 'mock_token_' + Date.now()
          const mockUser = {
            id: loginData.username === 'admin' ? 1 : 1001,
            username: loginData.username,
            nickname: loginData.username === 'admin' ? '管理员' : '宠物达人',
            phone: '138****8888',
            role: loginData.username === 'admin' ? 'admin' : 'user',
          }
          token.value = mockToken
          userInfo.value = mockUser
          localStorage.setItem('petstore_token', mockToken)
          localStorage.setItem('petstore_user', JSON.stringify(mockUser))
          if (loginData.remember) {
            localStorage.setItem('petstore_rememberedUser', loginData.username)
          } else {
            localStorage.removeItem('petstore_rememberedUser')
          }
          resolve({ success: true, message: '登录成功' })
        } else {
          resolve({ success: false, message: '用户名或密码错误' })
        }
      }, 500)
    })
  }

  const register = (registerData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: '注册成功' })
      }, 500)
    })
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('petstore_token')
    localStorage.removeItem('petstore_user')
  }

  const updateUserInfo = (data) => {
    userInfo.value = { ...userInfo.value, ...data }
    localStorage.setItem('petstore_user', JSON.stringify(userInfo.value))
  }

  init()

  return {
    token, userInfo, isLoggedIn, isAdmin, displayName,
    login, register, logout, updateUserInfo,
  }
})
