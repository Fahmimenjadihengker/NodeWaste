import { apiRequest, cachedApiRequest, clearApiCache, getAuthToken } from './apiClient.js'

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
  return cachedApiRequest('/profile')
}

export function updateProfile(data) {
  clearApiCache('/profile')
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

export function updateProfilePhoto(file) {
  const formData = new FormData()
  formData.append('photo', file)

  clearApiCache('/profile')
  return apiRequest('/profile/photo', {
    method: 'PUT',
    body: formData,
  })
}

export function getDashboard() {
  return cachedApiRequest('/dashboard')
}

export function getPet() {
  return cachedApiRequest('/pet')
}

export function runPetAction(action) {
  clearApiCache('/pet')
  clearApiCache('/dashboard')
  return apiRequest(`/pet/${action}`, {
    method: 'POST',
  })
}

export function getActivities(filter = 'all') {
  return cachedApiRequest(`/activities?filter=${encodeURIComponent(filter)}`)
}

export function getSchedules() {
  return cachedApiRequest('/schedules')
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
  if (user?.role === 'DRIVER') return '/driver/map'
  if (user?.role === 'ADMIN') return '/admin/dashboard'

  return '/dashboard'
}

export function clearAuthSession() {
  localStorage.removeItem('nodewaste_token')
  localStorage.removeItem('nodewaste_user')
  clearApiCache()
}

export { getAuthToken }
