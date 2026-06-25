import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// 响应拦截：统一解包
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 请求失败:', error)
    return Promise.reject(error)
  },
)

export default api

// 封装常用方法（支持 FormData 自动切换 Content-Type）
export const get = (url, params) => api.get(url, { params })
export const post = (url, data) => api.post(url, data)
export const put = (url, data, config) => api.put(url, data, config)
export const del = (url) => api.delete(url)
export const postForm = (url, formData) =>
  api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const putForm = (url, formData) =>
  api.put(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })