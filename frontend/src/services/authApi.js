const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'Terjadi kesalahan. Coba lagi nanti.')
  }

  return payload
}

export function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginUser(data) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function saveAuthSession(authData) {
  localStorage.setItem('nodewaste_token', authData.token)
  localStorage.setItem('nodewaste_user', JSON.stringify(authData.user))
}

export function getAuthToken() {
  return localStorage.getItem('nodewaste_token')
}

export function getStoredUser() {
  const rawUser = localStorage.getItem('nodewaste_user')

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem('nodewaste_token')
  localStorage.removeItem('nodewaste_user')
}
