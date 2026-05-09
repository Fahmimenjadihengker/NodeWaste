import { getFacilities } from '../services/facility.service.js'

export async function listFacilities(_request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Fasilitas berhasil diambil',
      data: {
        facilities: await getFacilities(),
      },
    })
  } catch (error) {
    next(error)
  }
}
