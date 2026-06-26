import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister } from '@/api/user'

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

  const login = async (loginData) => {
    try {
      const res = await apiLogin({ username: loginData.username, password: loginData.password })
      if (!res || !res.id) {
        return { success: false, message: '用户名或密码错误' }
      }
      const user = res
      // 保留之前已保存的头像等本地字段
      if (userInfo.value && userInfo.value.id === user.id && userInfo.value.avatar) {
        user.avatar = user.avatar || userInfo.value.avatar
      }
      const mockToken = 'token_' + user.id + '_' + Date.now()
      token.value = mockToken
      userInfo.value = user
      localStorage.setItem('petstore_token', mockToken)
      localStorage.setItem('petstore_user', JSON.stringify(user))
      if (loginData.remember) {
        localStorage.setItem('petstore_rememberedUser', loginData.username)
      } else {
        localStorage.removeItem('petstore_rememberedUser')
      }
      return { success: true, message: '登录成功' }
    } catch (e) {
      return { success: false, message: e.message || '用户名或密码错误' }
    }
  }

  const register = async (registerData) => {
    try {
      await apiRegister(registerData)
      return { success: true, message: '注册成功' }
    } catch (e) {
      return { success: false, message: e.message || '注册失败' }
    }
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
