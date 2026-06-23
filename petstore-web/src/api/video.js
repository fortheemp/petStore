import request from './request'

export function getVideos() {
  return request.get('/videos')
}

export function getVideoDetail(id) {
  return request.get(`/videos/${id}`)
}