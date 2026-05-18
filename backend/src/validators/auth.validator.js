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

export function validateDriverRegisterPayload(body) {
  const basePayload = validateRegisterPayload(body)
  const vehiclePlate = normalizeString(body?.vehiclePlate).toUpperCase()
  const vehicleType = normalizeString(body?.vehicleType)
  const districtId = normalizeString(body?.districtId)
  const districtName = normalizeString(body?.districtName)
  const city = normalizeString(body?.city)
  const province = normalizeString(body?.province)
  const provinceCode = normalizeString(body?.provinceCode)
  const cityCode = normalizeString(body?.cityCode)
  const districtCode = normalizeString(body?.districtCode)

  if (vehiclePlate.length < 4) {
    throw new HttpError(400, 'Plat kendaraan minimal 4 karakter')
  }

  if (!districtId && districtName.length < 2) {
    throw new HttpError(400, 'District atau nama wilayah wajib diisi')
  }

  return {
    ...basePayload,
    vehiclePlate,
    vehicleType: vehicleType || null,
    districtId: districtId || null,
    districtName: districtName || null,
    city: city || null,
    province: province || null,
    provinceCode: provinceCode || null,
    cityCode: cityCode || null,
    districtCode: districtCode || null,
  }
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
