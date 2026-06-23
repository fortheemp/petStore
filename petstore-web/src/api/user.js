import request from './request'

export function login(username, password) {
  return request.post('/user/login', { username, password })
}

export function register(data) {
  return request.post('/user/register', data)
}

export function getProfile(id) {
  return request.get(`/user/profile/${id}`)
}

export function updateProfile(data) {
  return request.put('/user/profile', data)
}