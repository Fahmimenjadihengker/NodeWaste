import { HttpError } from '../utils/http-error.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? number : null
}

export function validateProfileUpdatePayload(body) {
  const name = normalizeString(body?.name)
  const email = normalizeString(body?.email).toLowerCase()
  const addressPayload = body?.address && typeof body.address === 'object' ? body.address : null

  if (name.length < 2) {
    throw new HttpError(400, 'Nama minimal 2 karakter')
  }

  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Format email tidak valid')
  }

  if (!addressPayload) return { name, email }

  const address = normalizeString(addressPayload.address)
  const districtName = normalizeString(addressPayload.districtName)
  const city = normalizeString(addressPayload.city)
  const province = normalizeString(addressPayload.province)
  const provinceCode = normalizeString(addressPayload.provinceCode)
  const cityCode = normalizeString(addressPayload.cityCode)
  const districtCode = normalizeString(addressPayload.districtCode)
  const latitude = normalizeNumber(addressPayload.latitude)
  const longitude = normalizeNumber(addressPayload.longitude)

  if (address.length < 6) {
    throw new HttpError(400, 'Alamat rumah minimal 6 karakter')
  }

  if (districtName.length < 2) {
    throw new HttpError(400, 'Kecamatan/wilayah minimal 2 karakter')
  }

  if (!provinceCode || !cityCode || !districtCode) {
    throw new HttpError(400, 'Kode wilayah dari wilayah.id wajib diisi')
  }

  if (city.length < 2) {
    throw new HttpError(400, 'Kota minimal 2 karakter')
  }

  if (latitude === null || latitude < -90 || latitude > 90) {
    throw new HttpError(400, 'Latitude alamat tidak valid')
  }

  if (longitude === null || longitude < -180 || longitude > 180) {
    throw new HttpError(400, 'Longitude alamat tidak valid')
  }

  return {
    name,
    email,
    address: {
      address,
      districtName,
      city,
      province: province || null,
      provinceCode,
      cityCode,
      districtCode,
      latitude,
      longitude,
    },
  }
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
