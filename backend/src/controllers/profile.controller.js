import { getProfile, updatePassword, updateProfile } from '../services/profile.service.js'
import { validatePasswordUpdatePayload, validateProfileUpdatePayload } from '../validators/profile.validator.js'

export async function getCurrentProfile(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Profile berhasil diambil',
      data: await getProfile(request.user),
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCurrentProfile(request, response, next) {
  try {
    const payload = validateProfileUpdatePayload(request.body)
    const user = await updateProfile(request.user, payload)

    response.json({
      success: true,
      message: 'Profile berhasil diperbarui',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCurrentPassword(request, response, next) {
  try {
    const payload = validatePasswordUpdatePayload(request.body)
    await updatePassword(request.user, payload)

    response.json({
      success: true,
      message: 'Password berhasil diperbarui',
      data: { updated: true },
    })
  } catch (error) {
    next(error)
  }
}
