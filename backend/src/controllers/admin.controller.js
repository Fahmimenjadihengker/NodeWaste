import {
  createAdminDriver,
  createAdminAccount,
  createAdminSchedule,
  deleteAdminAccount,
  deleteAdminSchedule,
  adjustAdminUserPoints,
  getAdminDashboard,
  listAdminAccounts,
  listAdminDrivers,
  listAdminSchedules,
  listAdminUsers,
  updateAdminAccount,
  updateAdminDriver,
  updateAdminSchedule,
} from '../services/admin.service.js'
import { validateAdminAccountCreatePayload, validateAdminAccountUpdatePayload, validateAdminDriverCreatePayload, validateAdminDriverUpdatePayload, validatePointsPayload, validateSchedulePayload } from '../validators/admin.validator.js'

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

export async function listAccounts(request, response, next) {
  try {
    response.json({ success: true, message: 'Akun berhasil diambil', data: await listAdminAccounts(request.query) })
  } catch (error) {
    next(error)
  }
}

export async function createAccount(request, response, next) {
  try {
    const payload = validateAdminAccountCreatePayload(request.body)
    response.status(201).json({ success: true, message: 'Akun berhasil dibuat', data: await createAdminAccount(payload) })
  } catch (error) {
    next(error)
  }
}

export async function updateAccount(request, response, next) {
  try {
    const payload = validateAdminAccountUpdatePayload(request.body)
    response.json({ success: true, message: 'Akun berhasil diperbarui', data: await updateAdminAccount(request.params.id, payload, request.user.id) })
  } catch (error) {
    next(error)
  }
}

export async function deleteAccount(request, response, next) {
  try {
    response.json({ success: true, message: 'Akun berhasil dihapus permanen', data: await deleteAdminAccount(request.params.id, request.user.id) })
  } catch (error) {
    next(error)
  }
}

export async function addAccountPoints(request, response, next) {
  try {
    const payload = validatePointsPayload(request.body)
    response.json({ success: true, message: 'EcoPoints berhasil ditambahkan', data: await adjustAdminUserPoints(request.params.id, payload) })
  } catch (error) {
    next(error)
  }
}

export async function subtractAccountPoints(request, response, next) {
  try {
    const payload = validatePointsPayload(request.body)
    response.json({ success: true, message: 'EcoPoints berhasil dikurangi', data: await adjustAdminUserPoints(request.params.id, { amount: -payload.amount }) })
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
