import { validateDriverRegisterPayload } from './auth.validator.js'
import { HttpError } from '../utils/http-error.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const wasteCategories = ['ORGANIK', 'ANORGANIK', 'B3']
const roles = ['USER', 'DRIVER', 'ADMIN']

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeDistrict(body) {
  if (!body || typeof body !== 'object') return null

  const districtId = normalizeString(body.districtId)
  const districtName = normalizeString(body.districtName)
  const city = normalizeString(body.city)
  const province = normalizeString(body.province)
  const provinceCode = normalizeString(body.provinceCode)
  const cityCode = normalizeString(body.cityCode)
  const districtCode = normalizeString(body.districtCode)

  if (districtId) return { districtId }
  if (!districtName || !city || !districtCode) throw new HttpError(400, 'Data wilayah wajib lengkap')

  return { districtName, city, province: province || null, provinceCode: provinceCode || null, cityCode: cityCode || null, districtCode }
}

export function validateAdminDriverCreatePayload(body) {
  return validateDriverRegisterPayload(body)
}

export function validateAdminAccountCreatePayload(body) {
  const role = normalizeString(body?.role).toUpperCase() || 'USER'
  if (!roles.includes(role)) throw new HttpError(400, 'Role akun tidak valid')

  if (role === 'DRIVER') return { ...validateDriverRegisterPayload(body), role }

  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()
  const password = normalizeString(body?.password)

  if (name.length < 2) throw new HttpError(400, 'Nama minimal 2 karakter')
  if (!emailRegex.test(email)) throw new HttpError(400, 'Format email tidak valid')
  if (password.length < 8) throw new HttpError(400, 'Password minimal 8 karakter')

  return { name, email, password, role }
}

export function validateAdminAccountUpdatePayload(body) {
  const payload = {}
  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()
  const role = normalizeString(body?.role).toUpperCase()
  const vehiclePlate = normalizeString(body?.vehiclePlate).toUpperCase()
  const vehicleType = normalizeString(body?.vehicleType)

  if (name) payload.name = name
  if (email) {
    if (!emailRegex.test(email)) throw new HttpError(400, 'Format email tidak valid')
    payload.email = email
  }
  if (role) {
    if (!roles.includes(role)) throw new HttpError(400, 'Role akun tidak valid')
    payload.role = role
  }
  if (typeof body?.isActive === 'boolean') payload.isActive = body.isActive
  if (vehiclePlate) payload.vehiclePlate = vehiclePlate
  if (body && Object.prototype.hasOwnProperty.call(body, 'vehicleType')) payload.vehicleType = vehicleType || null
  if (body?.district) payload.district = normalizeDistrict(body.district)

  if (!Object.keys(payload).length) throw new HttpError(400, 'Tidak ada data akun yang diubah')
  return payload
}

export function validateAdminDriverUpdatePayload(body) {
  const payload = {}
  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()
  const vehiclePlate = normalizeString(body?.vehiclePlate).toUpperCase()
  const vehicleType = normalizeString(body?.vehicleType)

  if (name) payload.name = name
  if (email) {
    if (!emailRegex.test(email)) throw new HttpError(400, 'Format email tidak valid')
    payload.email = email
  }
  if (vehiclePlate) payload.vehiclePlate = vehiclePlate
  if (body && Object.prototype.hasOwnProperty.call(body, 'vehicleType')) payload.vehicleType = vehicleType || null
  if (body?.district) payload.district = normalizeDistrict(body.district)

  if (!Object.keys(payload).length) throw new HttpError(400, 'Tidak ada data driver yang diubah')
  return payload
}

export function validateSchedulePayload(body, partial = false) {
  const payload = {}
  const wasteCategory = normalizeString(body?.wasteCategory).toUpperCase()
  const pickupDay = normalizeString(body?.pickupDay)
  const pickupTime = normalizeString(body?.pickupTime)
  const instruction = normalizeString(body?.instruction)

  if (wasteCategory) {
    if (!wasteCategories.includes(wasteCategory)) throw new HttpError(400, 'Kategori sampah tidak valid')
    payload.wasteCategory = wasteCategory
  } else if (!partial) throw new HttpError(400, 'Kategori sampah wajib diisi')

  if (pickupDay) payload.pickupDay = pickupDay
  else if (!partial) throw new HttpError(400, 'Hari pickup wajib diisi')

  if (pickupTime) payload.pickupTime = pickupTime
  else if (!partial) throw new HttpError(400, 'Jam pickup wajib diisi')

  if (body && Object.prototype.hasOwnProperty.call(body, 'instruction')) payload.instruction = instruction || null
  if (body?.district) payload.district = normalizeDistrict(body.district)

  if (partial && !Object.keys(payload).length) throw new HttpError(400, 'Tidak ada data jadwal yang diubah')
  return payload
}

export function validatePointsPayload(body) {
  const amount = Number(body?.amount)

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new HttpError(400, 'Jumlah poin harus berupa angka positif')
  }

  return { amount }
}
