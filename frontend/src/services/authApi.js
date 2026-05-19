import { apiRequest, cachedApiRequest, clearApiCache, getAuthToken, getCachedApiPayload, setCachedApiPayload } from './apiClient.js'

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

export function getCachedProfile() {
  return getCachedApiPayload('/profile')
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

export function getCachedDashboard() {
  return getCachedApiPayload('/dashboard')
}

export function getPet() {
  return cachedApiRequest('/pet')
}

export function getCachedPet() {
  return getCachedApiPayload('/pet')
}

export function runPetAction(action) {
  return apiRequest(`/pet/${action}`, {
    method: 'POST',
  }).then((response) => {
    const cachedPet = getCachedApiPayload('/pet')
    if (cachedPet?.data) {
      setCachedApiPayload('/pet', { ...cachedPet, data: { ...cachedPet.data, ecoPoints: response.data.ecoPoints, pet: response.data.pet } })
    }

    const cachedDashboard = getCachedApiPayload('/dashboard')
    if (cachedDashboard?.data) {
      setCachedApiPayload('/dashboard', { ...cachedDashboard, data: { ...cachedDashboard.data, stats: { ...cachedDashboard.data.stats, ecoPoints: response.data.ecoPoints }, pet: response.data.pet } })
    }

    return response
  })
}

export function getActivities(filter = 'all') {
  return cachedApiRequest(`/activities?filter=${encodeURIComponent(filter)}`)
}

export function getCachedActivities(filter = 'all') {
  return getCachedApiPayload(`/activities?filter=${encodeURIComponent(filter)}`)
}

export function getSchedules() {
  return cachedApiRequest('/schedules')
}

export function getCachedSchedules() {
  return getCachedApiPayload('/schedules')
}

export function getRecyclingFacilities() {
  return cachedApiRequest('/recycling-facilities')
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

export function prefetchRoleData(user) {
  if (user?.role === 'DRIVER') {
    cachedApiRequest('/driver/map').catch(() => {})
    cachedApiRequest('/driver/profile').catch(() => {})
    return
  }

  if (user?.role === 'ADMIN') {
    cachedApiRequest('/admin/dashboard').catch(() => {})
    cachedApiRequest('/admin/accounts').catch(() => {})
    cachedApiRequest('/admin/schedules').catch(() => {})
    return
  }

  cachedApiRequest('/dashboard').catch(() => {})
  cachedApiRequest('/pet').catch(() => {})
  cachedApiRequest('/profile').catch(() => {})
  cachedApiRequest('/schedules').catch(() => {})
}

export function clearAuthSession() {
  localStorage.removeItem('nodewaste_token')
  localStorage.removeItem('nodewaste_user')
  clearApiCache()
}

export { getAuthToken }
