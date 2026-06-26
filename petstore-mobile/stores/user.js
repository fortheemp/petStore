import { reactive } from 'vue'

const STORAGE_KEY = 'petstore_user'
const TOKEN_KEY = 'petstore_token'

function loadUser() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function loadToken() {
  try { return uni.getStorageSync(TOKEN_KEY) || '' } catch { return '' }
}

const state = reactive({
  token: loadToken(),
  user: loadUser(),
})

export const useUserStore = () => ({
  get isLoggedIn() { return !!state.token },
  get user() { return state.user || {} },
  get displayName() { return state.user?.nickname || state.user?.username || '用户' },
  get isAdmin() { return state.user?.role === 'admin' },

  login(token, user) {
    state.token = token
    state.user = user
    uni.setStorageSync(TOKEN_KEY, token)
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(user))
  },

  logout() {
    state.token = ''
    state.user = null
    uni.removeStorageSync(TOKEN_KEY)
    uni.removeStorageSync(STORAGE_KEY)
  },

  updateUserInfo(info) {
    Object.assign(state.user, info)
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(state.user))
  },
})
