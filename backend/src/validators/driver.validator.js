import { HttpError } from '../utils/http-error.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeDistrict(body) {
  if (!body || typeof body !== 'object') return null

  const districtId = normalizeString(body.districtId)
  const districtName = normalizeString(body.districtName)
  const city = normalizeString(body.city)
  const districtCode = normalizeString(body.districtCode)

  if (districtId) return { districtId }
  if (!districtName || !city || !districtCode) throw new HttpError(400, 'Data wilayah wajib lengkap')

  return {
    districtName,
    city,
    province: normalizeString(body.province) || null,
    provinceCode: normalizeString(body.provinceCode) || null,
    cityCode: normalizeString(body.cityCode) || null,
    districtCode,
  }
}

export function validateDriverProfileUpdatePayload(body) {
  const payload = {}
  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()
  const vehiclePlate = normalizeString(body?.vehiclePlate).toUpperCase()
  const vehicleType = normalizeString(body?.vehicleType)
  const districtId = normalizeString(body?.districtId)
  const district = normalizeDistrict(body?.district)

  if (name) {
    if (name.length < 2) throw new HttpError(400, 'Nama minimal 2 karakter')
    payload.name = name
  }

  if (email) {
    if (!emailRegex.test(email)) throw new HttpError(400, 'Format email tidak valid')
    payload.email = email
  }

  if (vehiclePlate) {
    if (vehiclePlate.length < 4) throw new HttpError(400, 'Plat kendaraan minimal 4 karakter')
    payload.vehiclePlate = vehiclePlate
  }

  if (body && Object.prototype.hasOwnProperty.call(body, 'vehicleType')) {
    payload.vehicleType = vehicleType || null
  }

  if (districtId) payload.districtId = districtId
  if (district) payload.district = district

  if (!Object.keys(payload).length) {
    throw new HttpError(400, 'Tidak ada data profile yang diubah')
  }

  return payload
}
