import { get } from './request'

export const getVideoList = (category) => {
  return get('/videos').then((list) => {
    const arr = Array.isArray(list) ? list : []
    if (category && category !== 'all') {
      return arr.filter((v) => v.category === category)
    }
    return arr
  })
}

export const getVideoById = (id) => get(`/videos/${id}`)

export function formatCount(count) {
  if (!count) return '0'
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return count.toString()
}
