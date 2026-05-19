import { apiRequest, cachedApiRequest, clearApiCache, getCachedApiPayload } from './apiClient.js'

export function getDriverDashboard() {
  return cachedApiRequest('/driver/dashboard')
}

export function getDriverMap() {
  return cachedApiRequest('/driver/map')
}

export function getCachedDriverMap() {
  return getCachedApiPayload('/driver/map')
}

export function getDriverProfile() {
  return cachedApiRequest('/driver/profile')
}

export function getCachedDriverProfile() {
  return getCachedApiPayload('/driver/profile')
}

export function updateDriverProfile(data) {
  clearApiCache('/driver/profile')
  clearApiCache('/driver/dashboard')
  return apiRequest('/driver/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function updateDriverProfilePhoto(file) {
  const formData = new FormData()
  formData.append('photo', file)

  clearApiCache('/driver/profile')
  clearApiCache('/driver/dashboard')
  return apiRequest('/driver/profile/photo', {
    method: 'PUT',
    body: formData,
  })
}
