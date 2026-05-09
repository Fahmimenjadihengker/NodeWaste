import { getDashboard } from '../services/dashboard.service.js'

export async function getCurrentDashboard(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Dashboard berhasil diambil',
      data: await getDashboard(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}
