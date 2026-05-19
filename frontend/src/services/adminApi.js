import { apiRequest, cachedApiRequest, clearApiCache, getCachedApiPayload } from './apiClient.js'

let accountsCache = null
let schedulesCache = null

export function getAdminDashboard() {
  return cachedApiRequest('/admin/dashboard')
}

export function getCachedAdminDashboard() {
  return getCachedApiPayload('/admin/dashboard')
}

export function getAdminUsers() {
  return apiRequest('/admin/accounts')
}

export function getCachedAdminUsers() {
  return accountsCache || getCachedApiPayload('/admin/accounts')?.data?.accounts || null
}

export async function loadAdminUsers() {
  const response = await cachedApiRequest('/admin/accounts')
  accountsCache = response.data.accounts || response.data.users || []
  return response
}

export function createAdminAccount(data) {
  accountsCache = null
  clearApiCache('/admin/accounts')
  clearApiCache('/admin/dashboard')
  return apiRequest('/admin/accounts', { method: 'POST', body: JSON.stringify(data) })
}

export function updateAdminAccount(id, data) {
  accountsCache = null
  clearApiCache('/admin/accounts')
  clearApiCache('/admin/dashboard')
  return apiRequest(`/admin/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteAdminAccount(id) {
  accountsCache = null
  clearApiCache('/admin/accounts')
  clearApiCache('/admin/dashboard')
  return apiRequest(`/admin/accounts/${id}`, { method: 'DELETE' })
}

export function addAdminUserPoints(id, amount) {
  accountsCache = null
  clearApiCache('/admin/accounts')
  clearApiCache('/admin/dashboard')
  return apiRequest(`/admin/accounts/${id}/points/add`, { method: 'POST', body: JSON.stringify({ amount }) })
}

export function subtractAdminUserPoints(id, amount) {
  accountsCache = null
  clearApiCache('/admin/accounts')
  clearApiCache('/admin/dashboard')
  return apiRequest(`/admin/accounts/${id}/points/subtract`, { method: 'POST', body: JSON.stringify({ amount }) })
}

export function getAdminDrivers() {
  return cachedApiRequest('/admin/drivers')
}

export function getCachedAdminDrivers() {
  return getCachedApiPayload('/admin/drivers')?.data?.drivers || null
}

export function createAdminDriver(data) {
  clearApiCache('/admin/drivers')
  return apiRequest('/admin/drivers', { method: 'POST', body: JSON.stringify(data) })
}

export function getAdminSchedules() {
  return apiRequest('/admin/schedules')
}

export function getCachedAdminSchedules() {
  return schedulesCache || getCachedApiPayload('/admin/schedules')?.data?.schedules || null
}

export async function loadAdminSchedules() {
  const response = await cachedApiRequest('/admin/schedules')
  schedulesCache = response.data.schedules || []
  return response
}

export function createAdminSchedule(data) {
  schedulesCache = null
  clearApiCache('/admin/schedules')
  clearApiCache('/admin/dashboard')
  return apiRequest('/admin/schedules', { method: 'POST', body: JSON.stringify(data) })
}

export function updateAdminSchedule(id, data) {
  schedulesCache = null
  clearApiCache('/admin/schedules')
  clearApiCache('/admin/dashboard')
  return apiRequest(`/admin/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteAdminSchedule(id) {
  schedulesCache = null
  clearApiCache('/admin/schedules')
  clearApiCache('/admin/dashboard')
  return apiRequest(`/admin/schedules/${id}`, { method: 'DELETE' })
}
