import { getDistricts, getProvinces, getRegencies } from '../services/region.service.js'

export async function listProvinces(_request, response, next) {
  try {
    response.json({ success: true, message: 'Provinsi berhasil diambil', data: { regions: await getProvinces() } })
  } catch (error) {
    next(error)
  }
}

export async function listRegencies(request, response, next) {
  try {
    response.json({ success: true, message: 'Kabupaten/kota berhasil diambil', data: { regions: await getRegencies(request.params.provinceCode) } })
  } catch (error) {
    next(error)
  }
}

export async function listDistricts(request, response, next) {
  try {
    response.json({ success: true, message: 'Kecamatan berhasil diambil', data: { regions: await getDistricts(request.params.regencyCode) } })
  } catch (error) {
    next(error)
  }
}
