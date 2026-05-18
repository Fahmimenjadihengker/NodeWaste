import { apiRequest } from './apiClient.js'

export function getDriverDashboard() {
  return apiRequest('/driver/dashboard')
}

export function getDriverMap() {
  return apiRequest('/driver/map')
}

export function getDriverProfile() {
  return apiRequest('/driver/profile')
}

export function updateDriverProfile(data) {
  return apiRequest('/driver/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
