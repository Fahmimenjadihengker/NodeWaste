import { HttpError } from '../utils/http-error.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateRegisterPayload(body) {
  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()
  const password = normalizeString(body?.password)

  if (name.length < 2) {
    throw new HttpError(400, 'Nama minimal 2 karakter')
  }

  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Format email tidak valid')
  }

  if (password.length < 8) {
    throw new HttpError(400, 'Password minimal 8 karakter')
  }

  return { name, email, password }
}

export function validateLoginPayload(body) {
  const email = normalizeString(body?.email).toLowerCase()
  const password = normalizeString(body?.password)

  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Format email tidak valid')
  }

  if (!password) {
    throw new HttpError(400, 'Password wajib diisi')
  }

  return { email, password }
}
