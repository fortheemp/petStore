import api, { get, post, postForm, put, putForm, del } from './index'

/**
 * 获取视频列表（公开接口，前台使用）
 */
export function getVideoList() {
  return get('/videos')
}

/**
 * 获取单个视频详情
 */
export function getVideoById(id) {
  return get(`/videos/${id}`)
}

/**
 * 根据商品 ID 获取关联视频
 */
export function getVideosByProduct(productId) {
  return get(`/videos/product/${productId}`)
}

/**
 * 新增视频（管理员 — FormData 支持文件上传或外部 URL）
 * @param {FormData} formData - 包含 title, file 或 url, productId（可选）
 */
export function addVideo(formData) {
  return postForm('/admin/videos', formData)
}

/**
 * 更新视频（管理员 — FormData 或 JSON）
 * @param {number} id - 视频 ID
 * @param {FormData|Object} data - 包含 title, url, productId
 */
export function updateVideo(id, data) {
  if (data instanceof FormData) {
    return putForm(`/admin/videos/${id}`, data)
  }
  return put(`/admin/videos/${id}`, data)
}

/**
 * 删除视频（管理员）
 */
export function deleteVideo(id) {
  return del(`/admin/videos/${id}`)
}

/**
 * 视频播放量格式化（前台展示用）
 */
export function formatCount(count) {
  if (!count) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  }
  return String(count)
}