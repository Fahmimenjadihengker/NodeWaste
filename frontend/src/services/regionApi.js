import { apiRequest } from './apiClient.js'

async function fetchRegion(path) {
  const payload = await apiRequest(path)
  return payload?.data?.regions || []
}

export function getProvinces() {
  return fetchRegion('/regions/provinces')
}

export function getRegencies(provinceCode) {
  if (!provinceCode) return Promise.resolve([])
  return fetchRegion(`/regions/regencies/${encodeURIComponent(provinceCode)}`)
}

export function getDistricts(regencyCode) {
  if (!regencyCode) return Promise.resolve([])
  return fetchRegion(`/regions/districts/${encodeURIComponent(regencyCode)}`)
}
