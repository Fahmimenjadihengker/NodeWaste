import { cachedApiRequest } from './apiClient.js'

const regionCache = new Map()
const pendingRegionRequests = new Map()
const regionCacheTtl = 30 * 24 * 60 * 60 * 1000

async function fetchRegion(path) {
  if (regionCache.has(path)) return regionCache.get(path)
  if (pendingRegionRequests.has(path)) return pendingRegionRequests.get(path)

  const request = cachedApiRequest(path, { maxAge: regionCacheTtl })
    .then((payload) => {
      const regions = payload?.data?.regions || []
      regionCache.set(path, regions)
      pendingRegionRequests.delete(path)
      return regions
    })
    .catch((error) => {
      pendingRegionRequests.delete(path)
      throw error
    })

  pendingRegionRequests.set(path, request)
  return request
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
