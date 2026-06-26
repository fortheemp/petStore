import { get } from './request'

export const getVideoList = () => {
  return get('/videos').then((list) => {
    return Array.isArray(list) ? list : []
  })
}

export const getVideoById = (id) => get(`/videos/${id}`)

export function formatCount(count) {
  if (!count) return '0'
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return count.toString()
}
