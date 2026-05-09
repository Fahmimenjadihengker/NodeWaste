import { getUserActivities } from '../services/activity.service.js'

export async function getCurrentActivities(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Aktivitas berhasil diambil',
      data: {
        activities: await getUserActivities(request.user.id, request.query),
      },
    })
  } catch (error) {
    next(error)
  }
}
