import prisma from '../config/prisma.js'
import { registerDriver, toPublicUser } from './auth.service.js'
import { HttpError } from '../utils/http-error.js'

function toDistrict(district) {
  if (!district) return null

  return {
    id: district.id,
    name: district.name,
    city: district.city,
    province: district.province,
    provinceCode: district.provinceCode,
    cityCode: district.cityCode,
    districtCode: district.districtCode,
  }
}

function toDriver(user) {
  return {
    user: toPublicUser(user),
    driverProfile: user.driver ? {
      id: user.driver.id,
      vehiclePlate: user.driver.vehiclePlate,
      vehicleType: user.driver.vehicleType,
      district: toDistrict(user.driver.district),
    } : null,
  }
}

function toSchedule(schedule) {
  return {
    id: schedule.id,
    wasteCategory: schedule.wasteCategory,
    pickupDay: schedule.pickupDay,
    pickupTime: schedule.pickupTime,
    instruction: schedule.instruction,
    district: toDistrict(schedule.district),
  }
}

async function resolveDistrict(tx, payload) {
  if (payload.districtId) {
    const district = await tx.district.findUnique({ where: { id: payload.districtId } })
    if (!district) throw new HttpError(400, 'District tidak ditemukan')
    return district
  }

  const existing = await tx.district.findFirst({
    where: payload.districtCode ? { districtCode: payload.districtCode } : {
      name: { equals: payload.districtName, mode: 'insensitive' },
      city: payload.city,
    },
  })

  if (existing) return existing

  return tx.district.create({
    data: {
      name: payload.districtName,
      city: payload.city,
      province: payload.province,
      provinceCode: payload.provinceCode,
      cityCode: payload.cityCode,
      districtCode: payload.districtCode,
    },
  })
}

export async function getAdminDashboard() {
  const [users, drivers, schedules] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'DRIVER' } }),
    prisma.wasteSchedule.count(),
  ])

  return { stats: { users, drivers, schedules } }
}

export async function listAdminUsers() {
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    include: { address: { include: { district: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return {
    users: users.map((user) => ({
      ...toPublicUser(user),
      address: user.address ? {
        id: user.address.id,
        address: user.address.address,
        latitude: user.address.latitude,
        longitude: user.address.longitude,
        district: toDistrict(user.address.district),
      } : null,
    })),
  }
}

export async function listAdminDrivers() {
  const drivers = await prisma.user.findMany({
    where: { role: 'DRIVER' },
    include: { driver: { include: { district: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return { drivers: drivers.map(toDriver) }
}

export async function createAdminDriver(payload) {
  const result = await registerDriver(payload)
  return { driver: result }
}

export async function updateAdminDriver(userId, payload) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { driver: true } })
  if (!user || user.role !== 'DRIVER' || !user.driver) throw new HttpError(404, 'Driver tidak ditemukan')

  await prisma.$transaction(async (tx) => {
    const district = payload.district ? await resolveDistrict(tx, payload.district) : null

    await tx.user.update({
      where: { id: userId },
      data: {
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.email ? { email: payload.email } : {}),
      },
    })

    await tx.driverProfile.update({
      where: { id: user.driver.id },
      data: {
        ...(payload.vehiclePlate ? { vehiclePlate: payload.vehiclePlate } : {}),
        ...(Object.prototype.hasOwnProperty.call(payload, 'vehicleType') ? { vehicleType: payload.vehicleType } : {}),
        ...(district ? { districtId: district.id } : {}),
      },
    })
  })

  const updated = await prisma.user.findUnique({ where: { id: userId }, include: { driver: { include: { district: true } } } })
  return { driver: toDriver(updated) }
}

export async function listAdminSchedules() {
  const schedules = await prisma.wasteSchedule.findMany({
    include: { district: true },
    orderBy: [{ districtId: 'asc' }, { wasteCategory: 'asc' }],
    take: 200,
  })

  return { schedules: schedules.map(toSchedule) }
}

export async function createAdminSchedule(payload) {
  const schedule = await prisma.$transaction(async (tx) => {
    const district = payload.district ? await resolveDistrict(tx, payload.district) : null

    return tx.wasteSchedule.create({
      data: {
        districtId: district?.id || null,
        wasteCategory: payload.wasteCategory,
        pickupDay: payload.pickupDay,
        pickupTime: payload.pickupTime,
        instruction: payload.instruction,
      },
      include: { district: true },
    })
  })

  return { schedule: toSchedule(schedule) }
}

export async function updateAdminSchedule(id, payload) {
  const existing = await prisma.wasteSchedule.findUnique({ where: { id } })
  if (!existing) throw new HttpError(404, 'Jadwal tidak ditemukan')

  const schedule = await prisma.$transaction(async (tx) => {
    const district = payload.district ? await resolveDistrict(tx, payload.district) : null

    return tx.wasteSchedule.update({
      where: { id },
      data: {
        ...(district ? { districtId: district.id } : {}),
        ...(payload.wasteCategory ? { wasteCategory: payload.wasteCategory } : {}),
        ...(payload.pickupDay ? { pickupDay: payload.pickupDay } : {}),
        ...(payload.pickupTime ? { pickupTime: payload.pickupTime } : {}),
        ...(Object.prototype.hasOwnProperty.call(payload, 'instruction') ? { instruction: payload.instruction } : {}),
      },
      include: { district: true },
    })
  })

  return { schedule: toSchedule(schedule) }
}

export async function deleteAdminSchedule(id) {
  await prisma.wasteSchedule.delete({ where: { id } })
  return { deleted: true }
}
