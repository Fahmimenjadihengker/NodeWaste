const productionApiBaseUrl = 'https://nodewaste-backend.vercel.app/api'
const cachePrefix = 'nodewaste_api_cache:'
const defaultCacheTtl = 24 * 60 * 60 * 1000
const memoryCache = new Map()
const pendingRequests = new Map()

export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL
  if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) return productionApiBaseUrl

  return 'http://localhost:5000/api'
}

export function getAuthToken() {
  return localStorage.getItem('nodewaste_token')
}

function getCacheKey(path) {
  const token = getAuthToken()
  const tokenKey = token ? token.slice(-16) : 'public'
  return `${cachePrefix}${tokenKey}:${path}`
}

function isFresh(cache, maxAge) {
  return !maxAge || Date.now() - cache.savedAt <= maxAge
}

export function getCachedApiPayload(path, maxAge = defaultCacheTtl) {
  const memory = memoryCache.get(path)
  if (memory && isFresh(memory, maxAge)) return memory.payload

  const rawCache = localStorage.getItem(getCacheKey(path))
  if (!rawCache) return null

  try {
    const cache = JSON.parse(rawCache)
    if (!isFresh(cache, maxAge)) return null
    memoryCache.set(path, cache)
    return cache.payload
  } catch {
    return null
  }
}

export function setCachedApiPayload(path, payload) {
  const cache = { savedAt: Date.now(), payload }
  memoryCache.set(path, cache)

  try {
    localStorage.setItem(getCacheKey(path), JSON.stringify(cache))
  } catch {
    // Storage can fail in private mode or when quota is full. Network data still works.
  }
}

export function clearApiCache(pathPrefix = '') {
  Array.from(memoryCache.keys()).forEach((key) => {
    if (!pathPrefix || key.startsWith(pathPrefix)) memoryCache.delete(key)
  })

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith(cachePrefix)) return
    if (!pathPrefix || key.includes(`:${pathPrefix}`)) localStorage.removeItem(key)
  })
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken()
  const apiBaseUrl = getApiBaseUrl()
  let response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    })
  } catch {
    throw new Error(`Backend tidak bisa dihubungi (${apiBaseUrl}). Pastikan server API aktif atau VITE_API_BASE_URL sudah benar.`)
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Terjadi kesalahan. Coba lagi nanti.')
  }

  return payload
}

export async function cachedApiRequest(path, options = {}) {
  const maxAge = options.maxAge ?? defaultCacheTtl
  const cachedPayload = getCachedApiPayload(path, maxAge)
  if (cachedPayload) {
    if (options.revalidate !== false && !pendingRequests.has(path)) {
      const request = apiRequest(path)
        .then((payload) => {
          setCachedApiPayload(path, payload)
          return payload
        })
        .finally(() => pendingRequests.delete(path))
      pendingRequests.set(path, request)
    }
    return cachedPayload
  }

  if (pendingRequests.has(path)) return pendingRequests.get(path)

  const request = apiRequest(path)
    .then((payload) => {
      setCachedApiPayload(path, payload)
      return payload
    })
    .finally(() => pendingRequests.delete(path))
  pendingRequests.set(path, request)
  const payload = await request
  setCachedApiPayload(path, payload)
  return payload
}
