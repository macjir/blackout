import { v4 as uuidv4 } from 'uuid'

export function getSessionId() {
  let id = sessionStorage.getItem('session_id')
  if (!id) {
    id = `citizen-${uuidv4()}`
    sessionStorage.setItem('session_id', id)
  }
  return id
}

export function getUserId() {
  let id = localStorage.getItem('user_id')
  if (!id) {
    id = `user-${uuidv4()}`
    localStorage.setItem('user_id', id)
  }
  return id
}

export function getRole() {
  const params = new URLSearchParams(window.location.search)
  return params.get('role') || 'citizen'
}
