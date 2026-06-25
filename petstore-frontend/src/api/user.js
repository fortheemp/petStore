import { post, get, put } from './request'

export const login = (data) => post('/user/login', data)

export const register = (data) => post('/user/register', data)

export const getProfile = (id) => get(`/user/profile/${id}`)

export const updateProfile = (data) => put('/user/profile', data)
