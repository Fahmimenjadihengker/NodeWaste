import { apiRequest } from './apiClient.js'

export function getCollectorDashboard() {
  return apiRequest('/collector/dashboard')
}
