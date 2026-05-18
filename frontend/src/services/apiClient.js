const productionApiBaseUrl = 'https://nodewaste-backend.vercel.app/api'

export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL
  if (window.location.hostname === 'nodewaste.vercel.app') return productionApiBaseUrl

  return 'http://localhost:5000/api'
}

export function getAuthToken() {
  return localStorage.getItem('nodewaste_token')
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
