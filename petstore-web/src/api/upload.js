import axios from 'axios'

export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}

export function uploadVideo(file) {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}