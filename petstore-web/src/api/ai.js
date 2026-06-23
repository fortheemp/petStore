import request from './request'

export function chat(question) {
  return request.post('/ai/chat', { question })
}