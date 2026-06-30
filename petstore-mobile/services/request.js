// H5 且通过 dev server 访问时走 proxy，否则直连后端
const _isHttp = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:')
const BASE_URL = _isHttp ? '/api' : 'https://frp-hat.com:53577/api'

const TOKEN_KEY = 'petstore_token'

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync(TOKEN_KEY)
    // Build URL with query params
    let url = BASE_URL + options.url
    if (options.params) {
      const qs = Object.entries(options.params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
      if (qs) url += (url.includes('?') ? '&' : '?') + qs
    }
    uni.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const body = res.data
        // 后端返回 { code, data, message } 信封格式，解包 data
        if (body && body.code !== undefined && body.data !== undefined) {
          if (body.code === 200 || body.code === 0) {
            resolve(body.data)
          } else {
            const msg = body.message || '请求失败'
            if (!options.silent) uni.showToast({ title: msg, icon: 'none' })
            reject(new Error(msg))
          }
        } else if (res.statusCode === 200) {
          resolve(body)
        } else if (res.statusCode === 401) {
          uni.removeStorageSync(TOKEN_KEY)
          uni.removeStorageSync('petstore_user')
          uni.navigateTo({ url: '/pages/auth/login' })
          reject(new Error('未登录'))
        } else {
          const msg = body?.message || '请求失败'
          if (!options.silent) uni.showToast({ title: msg, icon: 'none' })
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const fixImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (_isHttp) return url
  return BASE_URL.replace(/\/api\/?$/, '') + url
}

export const get = (url, data, config) => request({ url, method: 'GET', data, ...config })
export const post = (url, data, config) => request({ url, method: 'POST', data, ...config })
export const put = (url, data, config) => request({ url, method: 'PUT', data, ...config })
export const del = (url, config) => request({ url, method: 'DELETE', ...config })

export default { get, post, put, del }
