import { HttpError } from '../utils/http-error.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateProfileUpdatePayload(body) {
  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()

  if (name.length < 2) {
    throw new HttpError(400, 'Nama minimal 2 karakter')
  }

  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Format email tidak valid')
  }

  return { name, email }
}

export function validatePasswordUpdatePayload(body) {
  const currentPassword = normalizeString(body?.currentPassword)
  const newPassword = normalizeString(body?.newPassword)

  if (!currentPassword) {
    throw new HttpError(400, 'Password lama wajib diisi')
  }

  if (newPassword.length < 8) {
    throw new HttpError(400, 'Password baru minimal 8 karakter')
  }

  return { currentPassword, newPassword }
}
