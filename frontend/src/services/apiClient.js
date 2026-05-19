const productionApiBaseUrl = 'https://nodewaste-backend.vercel.app/api'
const cachePrefix = 'nodewaste_api_cache:'
const defaultCacheTtl = 24 * 60 * 60 * 1000

export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL
  if (window.location.hostname === 'nodewaste.vercel.app') return productionApiBaseUrl

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

export function getCachedApiPayload(path, maxAge = defaultCacheTtl) {
  const rawCache = localStorage.getItem(getCacheKey(path))
  if (!rawCache) return null

  try {
    const cache = JSON.parse(rawCache)
    if (maxAge && Date.now() - cache.savedAt > maxAge) return null
    return cache.payload
  } catch {
    return null
  }
}

export function setCachedApiPayload(path, payload) {
  try {
    localStorage.setItem(getCacheKey(path), JSON.stringify({ savedAt: Date.now(), payload }))
  } catch {
    // Storage can fail in private mode or when quota is full. Network data still works.
  }
}

export function clearApiCache(pathPrefix = '') {
  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith(cachePrefix)) return
    if (!pathPrefix || key.includes(`:${pathPrefix}`)) localStorage.removeItem(key)
  })
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken()
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Terjadi kesalahan. Coba lagi nanti.')
  }

  return payload
}

export async function cachedApiRequest(path, options = {}) {
  const cachedPayload = getCachedApiPayload(path, options.maxAge)
  if (cachedPayload) {
    apiRequest(path).then((payload) => setCachedApiPayload(path, payload)).catch(() => {})
    return cachedPayload
  }

  const payload = await apiRequest(path)
  setCachedApiPayload(path, payload)
  return payload
}
