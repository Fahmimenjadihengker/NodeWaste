import prisma from '../config/prisma.js'
import bcrypt from 'bcryptjs'
import { registerDriver, toPublicUser } from './auth.service.js'
import { HttpError } from '../utils/http-error.js'

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

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

function toAccount(user) {
  return {
    ...toPublicUser(user),
    address: user.address ? {
      id: user.address.id,
      address: user.address.address,
      latitude: user.address.latitude,
      longitude: user.address.longitude,
      district: toDistrict(user.address.district),
    } : null,
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
  const [users, drivers, admins, schedules, activeAccounts, disabledAccounts, usersWithAddress] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'DRIVER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.wasteSchedule.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.userAddress.count(),
  ])

  return { stats: { users, drivers, admins, schedules, activeAccounts, disabledAccounts, usersWithAddress } }
}

export async function listAdminAccounts(query = {}) {
  const role = ['USER', 'DRIVER', 'ADMIN'].includes(query.role) ? query.role : undefined
  const accounts = await prisma.user.findMany({
    where: role ? { role } : undefined,
    include: {
      address: { include: { district: true } },
      driver: { include: { district: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 150,
  })

  return { accounts: accounts.map(toAccount) }
}

export async function createAdminAccount(payload) {
  if (payload.role === 'DRIVER') {
    const driver = await registerDriver(payload)
    return { account: { ...driver.user, driverProfile: driver.driverProfile } }
  }

  const existing = await prisma.user.findUnique({ where: { email: payload.email } })
  if (existing) throw new HttpError(409, 'Email sudah digunakan')

  const passwordHash = await bcrypt.hash(payload.password, saltRounds)
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role,
      ...(payload.role === 'USER' ? { pet: { create: {} } } : {}),
    },
    include: { address: { include: { district: true } }, driver: { include: { district: true } } },
  })

  return { account: toAccount(user) }
}

export async function updateAdminAccount(id, payload, actorId) {
  const user = await prisma.user.findUnique({ where: { id }, include: { driver: true, pet: true } })
  if (!user) throw new HttpError(404, 'Akun tidak ditemukan')
  if (id === actorId && payload.isActive === false) throw new HttpError(400, 'Admin tidak bisa menonaktifkan akun sendiri')
  if (id === actorId && payload.role && payload.role !== 'ADMIN') throw new HttpError(400, 'Admin tidak bisa mengubah role akun sendiri')

  if (payload.email) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } })
    if (existing && existing.id !== id) throw new HttpError(409, 'Email sudah digunakan')
  }

  await prisma.$transaction(async (tx) => {
    const nextRole = payload.role || user.role
    const district = payload.district && nextRole === 'DRIVER' ? await resolveDistrict(tx, payload.district) : null

    if (nextRole === 'DRIVER' && !user.driver) {
      if (!payload.vehiclePlate) throw new HttpError(400, 'Plat kendaraan wajib diisi untuk akun driver')
      if (!district) throw new HttpError(400, 'Wilayah kerja wajib diisi untuk akun driver')
    }

    await tx.user.update({
      where: { id },
      data: {
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.email ? { email: payload.email } : {}),
        ...(payload.role ? { role: payload.role } : {}),
        ...(typeof payload.isActive === 'boolean' ? { isActive: payload.isActive } : {}),
      },
    })

    if (nextRole === 'DRIVER') {
      if (user.pet) {
        await tx.activity.deleteMany({ where: { userId: id, type: 'PET' } })
        await tx.petAction.deleteMany({ where: { userId: id } })
        await tx.pet.delete({ where: { id: user.pet.id } })
      }

      if (!user.driver) {
        await tx.driverProfile.create({
          data: {
            userId: id,
            vehiclePlate: payload.vehiclePlate,
            vehicleType: Object.prototype.hasOwnProperty.call(payload, 'vehicleType') ? payload.vehicleType : null,
            districtId: district.id,
          },
        })
        return
      }

      await tx.driverProfile.update({
        where: { id: user.driver.id },
        data: {
          ...(payload.vehiclePlate ? { vehiclePlate: payload.vehiclePlate } : {}),
          ...(Object.prototype.hasOwnProperty.call(payload, 'vehicleType') ? { vehicleType: payload.vehicleType } : {}),
          ...(district ? { districtId: district.id } : {}),
        },
      })
      return
    }

    if (user.driver) await tx.driverProfile.delete({ where: { id: user.driver.id } })
    if (nextRole === 'USER' && !user.pet) {
      await tx.pet.create({ data: { userId: id } }).catch(() => null)
    }

    if (nextRole !== 'USER' && user.pet) {
      await tx.activity.deleteMany({ where: { userId: id, type: 'PET' } })
      await tx.petAction.deleteMany({ where: { userId: id } })
      await tx.pet.delete({ where: { id: user.pet.id } })
    }
  })

  const updated = await prisma.user.findUnique({
    where: { id },
    include: { address: { include: { district: true } }, driver: { include: { district: true } } },
  })

  return { account: toAccount(updated) }
}

export async function deleteAdminAccount(id, actorId) {
  if (id === actorId) throw new HttpError(400, 'Admin tidak bisa menghapus akun sendiri')

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new HttpError(404, 'Akun tidak ditemukan')

  await prisma.$transaction(async (tx) => {
    await tx.activity.deleteMany({ where: { userId: id } })
    await tx.scan.deleteMany({ where: { userId: id } })
    await tx.petAction.deleteMany({ where: { userId: id } })
    await tx.pet.deleteMany({ where: { userId: id } })
    await tx.userAddress.deleteMany({ where: { userId: id } })
    await tx.driverProfile.deleteMany({ where: { userId: id } })
    await tx.user.delete({ where: { id } })
  })

  return { deleted: true }
}

export async function listAdminUsers() {
  const users = await prisma.user.findMany({
    include: { address: { include: { district: true } }, driver: { include: { district: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return { users: users.map(toAccount) }
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
    where: { districtId: null },
    include: { district: true },
    orderBy: [{ districtId: 'asc' }, { wasteCategory: 'asc' }],
    take: 200,
  })

  return { schedules: schedules.map(toSchedule) }
}

export async function createAdminSchedule(payload) {
  const schedule = await prisma.wasteSchedule.create({
      data: {
        districtId: null,
        wasteCategory: payload.wasteCategory,
        pickupDay: payload.pickupDay,
        pickupTime: payload.pickupTime,
        instruction: payload.instruction,
      },
      include: { district: true },
    })

  return { schedule: toSchedule(schedule) }
}

export async function updateAdminSchedule(id, payload) {
  const existing = await prisma.wasteSchedule.findUnique({ where: { id } })
  if (!existing) throw new HttpError(404, 'Jadwal tidak ditemukan')

  const schedule = await prisma.wasteSchedule.update({
      where: { id },
      data: {
        districtId: null,
        ...(payload.wasteCategory ? { wasteCategory: payload.wasteCategory } : {}),
        ...(payload.pickupDay ? { pickupDay: payload.pickupDay } : {}),
        ...(payload.pickupTime ? { pickupTime: payload.pickupTime } : {}),
        ...(Object.prototype.hasOwnProperty.call(payload, 'instruction') ? { instruction: payload.instruction } : {}),
      },
      include: { district: true },
    })

  return { schedule: toSchedule(schedule) }
}

export async function deleteAdminSchedule(id) {
  await prisma.wasteSchedule.delete({ where: { id } })
  return { deleted: true }
}
