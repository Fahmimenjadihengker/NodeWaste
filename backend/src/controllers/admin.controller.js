import {
  createAdminDriver,
  createAdminSchedule,
  deleteAdminSchedule,
  getAdminDashboard,
  listAdminDrivers,
  listAdminSchedules,
  listAdminUsers,
  updateAdminDriver,
  updateAdminSchedule,
} from '../services/admin.service.js'
import { validateAdminDriverCreatePayload, validateAdminDriverUpdatePayload, validateSchedulePayload } from '../validators/admin.validator.js'

export async function getCurrentAdminDashboard(_request, response, next) {
  try {
    response.json({ success: true, message: 'Dashboard admin berhasil diambil', data: await getAdminDashboard() })
  } catch (error) {
    next(error)
  }
}

export async function listUsers(_request, response, next) {
  try {
    response.json({ success: true, message: 'User berhasil diambil', data: await listAdminUsers() })
  } catch (error) {
    next(error)
  }
}

export async function listDrivers(_request, response, next) {
  try {
    response.json({ success: true, message: 'Driver berhasil diambil', data: await listAdminDrivers() })
  } catch (error) {
    next(error)
  }
}

export async function createDriver(request, response, next) {
  try {
    const payload = validateAdminDriverCreatePayload(request.body)
    response.status(201).json({ success: true, message: 'Driver berhasil dibuat', data: await createAdminDriver(payload) })
  } catch (error) {
    next(error)
  }
}

export async function updateDriver(request, response, next) {
  try {
    const payload = validateAdminDriverUpdatePayload(request.body)
    response.json({ success: true, message: 'Driver berhasil diperbarui', data: await updateAdminDriver(request.params.id, payload) })
  } catch (error) {
    next(error)
  }
}

export async function listSchedules(_request, response, next) {
  try {
    response.json({ success: true, message: 'Jadwal berhasil diambil', data: await listAdminSchedules() })
  } catch (error) {
    next(error)
  }
}

export async function createSchedule(request, response, next) {
  try {
    const payload = validateSchedulePayload(request.body)
    response.status(201).json({ success: true, message: 'Jadwal berhasil dibuat', data: await createAdminSchedule(payload) })
  } catch (error) {
    next(error)
  }
}

export async function updateSchedule(request, response, next) {
  try {
    const payload = validateSchedulePayload(request.body, true)
    response.json({ success: true, message: 'Jadwal berhasil diperbarui', data: await updateAdminSchedule(request.params.id, payload) })
  } catch (error) {
    next(error)
  }
}

export async function deleteSchedule(request, response, next) {
  try {
    response.json({ success: true, message: 'Jadwal berhasil dihapus', data: await deleteAdminSchedule(request.params.id) })
  } catch (error) {
    next(error)
  }
}
