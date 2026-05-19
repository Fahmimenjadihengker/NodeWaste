import {
  getDriverDashboard,
  getDriverMap,
  getDriverProfile,
  updateDriverProfile,
} from '../services/driver.service.js'
import { updateProfilePhoto } from '../services/profile.service.js'
import { validateDriverProfileUpdatePayload } from '../validators/driver.validator.js'

export async function getCurrentDriverDashboard(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Dashboard driver berhasil diambil',
      data: await getDriverDashboard(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function getCurrentDriverProfile(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Profile driver berhasil diambil',
      data: await getDriverProfile(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCurrentDriverProfile(request, response, next) {
  try {
    const payload = validateDriverProfileUpdatePayload(request.body)

    response.json({
      success: true,
      message: 'Profile driver berhasil diperbarui',
      data: await updateDriverProfile(request.user.id, payload),
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCurrentDriverProfilePhoto(request, response, next) {
  try {
    const user = await updateProfilePhoto(request.user, request.file)

    response.json({
      success: true,
      message: 'Foto profile driver berhasil diperbarui',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

export async function getCurrentDriverMap(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Map driver berhasil diambil',
      data: await getDriverMap(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}
