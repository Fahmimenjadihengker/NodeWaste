import {
  getCollectorDashboard,
  getCollectorHouses,
  getCollectorProcessingSites,
  getCollectorProfile,
  getCollectorRoute,
  updateCollectorProfile,
} from '../services/collector.service.js'
import { validateCollectorProfileUpdatePayload } from '../validators/collector.validator.js'

export async function getCurrentCollectorDashboard(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Dashboard collector berhasil diambil',
      data: await getCollectorDashboard(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function getCurrentCollectorProfile(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Profile collector berhasil diambil',
      data: await getCollectorProfile(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCurrentCollectorProfile(request, response, next) {
  try {
    const payload = validateCollectorProfileUpdatePayload(request.body)

    response.json({
      success: true,
      message: 'Profile collector berhasil diperbarui',
      data: await updateCollectorProfile(request.user.id, payload),
    })
  } catch (error) {
    next(error)
  }
}

export async function listCurrentCollectorHouses(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Data rumah wilayah collector berhasil diambil',
      data: await getCollectorHouses(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function listCurrentCollectorProcessingSites(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Tempat pengolahan berhasil diambil',
      data: await getCollectorProcessingSites(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function getCurrentCollectorRoute(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Rute collector berhasil diambil',
      data: await getCollectorRoute(request.user.id, request.query),
    })
  } catch (error) {
    next(error)
  }
}
