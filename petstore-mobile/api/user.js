import { mockUser } from './mock'

const delay = (fn) => new Promise((resolve) => setTimeout(() => resolve(fn()), 200))

const STORAGE_KEY = 'petstore_user_info'
const TOKEN_KEY = 'petstore_token'

export const login = (data) => delay(() => {
  const { username, password } = data
  if (!username || !password) {
    return { code: 400, message: '用户名和密码不能为空' }
  }
  // Mock: accept any credentials, return mock user
  const token = 'mock_token_' + Date.now()
  const user = { ...mockUser, username }
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(STORAGE_KEY, user)
  return { code: 200, data: { token, userInfo: user }, message: '登录成功' }
})

export const register = (data) => delay(() => {
  const { username, password, phone } = data
  if (!username || !password) {
    return { code: 400, message: '用户名和密码不能为空' }
  }
  const user = { ...mockUser, username, phone: phone || mockUser.phone }
  const token = 'mock_token_' + Date.now()
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(STORAGE_KEY, user)
  return { code: 200, data: { token, userInfo: user }, message: '注册成功' }
})

export const getUserInfo = () => delay(() => {
  const token = uni.getStorageSync(TOKEN_KEY)
  if (!token) {
    return { code: 401, message: '未登录' }
  }
  const user = uni.getStorageSync(STORAGE_KEY) || mockUser
  return { code: 200, data: user }
})

export const updateUserInfo = (data) => delay(() => {
  const user = uni.getStorageSync(STORAGE_KEY) || mockUser
  const updated = { ...user, ...data }
  uni.setStorageSync(STORAGE_KEY, updated)
  return { code: 200, data: updated, message: '更新成功' }
})
