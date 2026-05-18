import { apiRequest } from './apiClient.js'

export function getAdminDashboard() {
  return apiRequest('/admin/dashboard')
}

export function getAdminUsers() {
  return apiRequest('/admin/users')
}

export function getAdminDrivers() {
  return apiRequest('/admin/drivers')
}

export function createAdminDriver(data) {
  return apiRequest('/admin/drivers', { method: 'POST', body: JSON.stringify(data) })
}

export function getAdminSchedules() {
  return apiRequest('/admin/schedules')
}

export function createAdminSchedule(data) {
  return apiRequest('/admin/schedules', { method: 'POST', body: JSON.stringify(data) })
}
