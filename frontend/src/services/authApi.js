import { apiRequest, getAuthToken } from './apiClient.js'

export function registerUser(data) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginUser(data) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getProfile() {
  return apiRequest('/profile')
}

export function updateProfile(data) {
  return apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function updateProfilePassword(data) {
  return apiRequest('/profile/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getDashboard() {
  return apiRequest('/dashboard')
}

export function getPet() {
  return apiRequest('/pet')
}

export function runPetAction(action) {
  return apiRequest(`/pet/${action}`, {
    method: 'POST',
  })
}

export function getActivities(filter = 'all') {
  return apiRequest(`/activities?filter=${encodeURIComponent(filter)}`)
}

export function getRecyclingFacilities() {
  return apiRequest('/recycling-facilities')
}

export function saveAuthSession(authData) {
  localStorage.setItem('nodewaste_token', authData.token)
  localStorage.setItem('nodewaste_user', JSON.stringify(authData.user))
}

export function saveStoredUser(user) {
  localStorage.setItem('nodewaste_user', JSON.stringify(user))
}

export function getStoredUser() {
  const rawUser = localStorage.getItem('nodewaste_user')

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export function getRoleHomePath(user) {
  return user?.role === 'COLLECTOR' ? '/collector/dashboard' : '/dashboard'
}

export function clearAuthSession() {
  localStorage.removeItem('nodewaste_token')
  localStorage.removeItem('nodewaste_user')
}

export { getAuthToken }
