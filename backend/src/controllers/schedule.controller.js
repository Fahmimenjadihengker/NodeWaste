import { getUserSchedules } from '../services/schedule.service.js'

export async function getCurrentUserSchedules(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Jadwal berhasil diambil',
      data: await getUserSchedules(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}
