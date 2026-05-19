import { apiRequest, cachedApiRequest, clearApiCache } from './apiClient.js'

export function getDriverDashboard() {
  return cachedApiRequest('/driver/dashboard')
}

export function getDriverMap() {
  return cachedApiRequest('/driver/map')
}

export function getDriverProfile() {
  return cachedApiRequest('/driver/profile')
}

export function updateDriverProfile(data) {
  clearApiCache('/driver/profile')
  clearApiCache('/driver/dashboard')
  return apiRequest('/driver/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
