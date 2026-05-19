import { apiRequest } from './apiClient.js'

const regionCache = new Map()

async function fetchRegion(path) {
  if (regionCache.has(path)) return regionCache.get(path)

  const payload = await apiRequest(path)
  const regions = payload?.data?.regions || []
  regionCache.set(path, regions)
  return regions
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
