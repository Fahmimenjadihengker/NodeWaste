import { apiRequest } from './apiClient.js'

let accountsCache = null
let schedulesCache = null

export function getAdminDashboard() {
  return apiRequest('/admin/dashboard')
}

export function getAdminUsers() {
  return apiRequest('/admin/accounts')
}

export function getCachedAdminUsers() {
  return accountsCache
}

export async function loadAdminUsers() {
  const response = await apiRequest('/admin/accounts')
  accountsCache = response.data.accounts || response.data.users || []
  return response
}

export function createAdminAccount(data) {
  accountsCache = null
  return apiRequest('/admin/accounts', { method: 'POST', body: JSON.stringify(data) })
}

export function updateAdminAccount(id, data) {
  accountsCache = null
  return apiRequest(`/admin/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteAdminAccount(id) {
  accountsCache = null
  return apiRequest(`/admin/accounts/${id}`, { method: 'DELETE' })
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

export function getCachedAdminSchedules() {
  return schedulesCache
}

export async function loadAdminSchedules() {
  const response = await apiRequest('/admin/schedules')
  schedulesCache = response.data.schedules || []
  return response
}

export function createAdminSchedule(data) {
  schedulesCache = null
  return apiRequest('/admin/schedules', { method: 'POST', body: JSON.stringify(data) })
}

export function updateAdminSchedule(id, data) {
  schedulesCache = null
  return apiRequest(`/admin/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteAdminSchedule(id) {
  schedulesCache = null
  return apiRequest(`/admin/schedules/${id}`, { method: 'DELETE' })
}
