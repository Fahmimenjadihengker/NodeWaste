const productionApiBaseUrl = 'https://nodewaste-backend.vercel.app/api'

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL
  if (window.location.hostname === 'nodewaste.vercel.app') return productionApiBaseUrl

  return 'http://localhost:5000/api'
}

const API_BASE_URL = getApiBaseUrl()

async function request(path, options) {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Terjadi kesalahan. Coba lagi nanti.')
  }

  return payload
}

export function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginUser(data) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getProfile() {
  return request('/profile')
}

export function updateProfile(data) {
  return request('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function updateProfilePassword(data) {
  return request('/profile/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function getDashboard() {
  return request('/dashboard')
}

export function getPet() {
  return request('/pet')
}

export function runPetAction(action) {
  return request(`/pet/${action}`, {
    method: 'POST',
  })
}

export function getActivities(filter = 'all') {
  return request(`/activities?filter=${encodeURIComponent(filter)}`)
}

export function getRecyclingFacilities() {
  return request('/recycling-facilities')
}

export function saveAuthSession(authData) {
  localStorage.setItem('nodewaste_token', authData.token)
  localStorage.setItem('nodewaste_user', JSON.stringify(authData.user))
}

export function saveStoredUser(user) {
  localStorage.setItem('nodewaste_user', JSON.stringify(user))
}

export function getAuthToken() {
  return localStorage.getItem('nodewaste_token')
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

export function clearAuthSession() {
  localStorage.removeItem('nodewaste_token')
  localStorage.removeItem('nodewaste_user')
}
