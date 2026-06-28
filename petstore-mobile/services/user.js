import { post, get, put } from './request'

const TOKEN_KEY = 'petstore_token'
const USER_KEY = 'petstore_user'

export const login = async (data) => {
  const user = await post('/user/login', data)
  // 后端不返回 Token，客户端生成 mock token（与 PC 端一致）
  const token = `token_${user.id}_${Date.now()}`
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_KEY, JSON.stringify(user))
  return { token, user }
}

export const register = async (data) => {
  const user = await post('/user/register', data)
  const token = `token_${user.id}_${Date.now()}`
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_KEY, JSON.stringify(user))
  return { token, user }
}

export const getProfile = (id) => get(`/user/profile/${id}`)

export const updateProfile = (data) => put('/user/profile', data)
