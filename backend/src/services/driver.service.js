import prisma from '../config/prisma.js'
import { toPublicUser } from './auth.service.js'
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

function toDriverProfile(profile) {
  if (!profile) return null

  return {
    id: profile.id,
    vehiclePlate: profile.vehiclePlate,
    vehicleType: profile.vehicleType,
    district: toDistrict(profile.district),
  }
}

function toHouse(address) {
  return {
    id: address.id,
    address: address.address,
    latitude: address.latitude,
    longitude: address.longitude,
    frontPhotoUrl: address.frontPhotoUrl,
    district: toDistrict(address.district),
    user: {
      id: address.user.id,
      name: address.user.name,
      email: address.user.email,
    },
  }
}

function toProcessingSite(site) {
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    latitude: site.latitude,
    longitude: site.longitude,
    photoUrl: site.photoUrl,
    acceptedWasteCategories: site.acceptedWasteCategories,
    capacityStatus: site.capacityStatus,
    district: toDistrict(site.district),
  }
}

async function getDriverContext(userId) {
  const user = await prisma.user.findUnique({
    where: { userId },
    include: {
      driver: { include: { district: true } },
    },
  })

  if (!user || user.role !== 'DRIVER') {
    throw new HttpError(404, 'Driver tidak ditemukan')
  }

  return { user, driverProfile: user.driver }
}

export async function getDriverDashboard(userId) {
  const context = await getDriverContext(userId)
  const districtId = context.driverProfile?.districtId
  const [houseCount, processingSiteCount] = await Promise.all([
    districtId ? prisma.userAddress.count({ where: { districtId } }) : 0,
    prisma.processingSite.count({
      where: districtId ? {
        OR: [
          { districtId },
          { districtId: null },
        ],
      } : { districtId: null },
    }),
  ])

  return {
    user: toPublicUser(context.user),
    driverProfile: toDriverProfile(context.driverProfile),
    stats: {
      housesInDistrict: houseCount,
      processingSites: processingSiteCount,
    },
    quickLinks: [
      { label: 'Map Wilayah', path: '/driver/map' },
      { label: 'Profil Driver', path: '/driver/profile' },
    ],
  }
}

export async function getDriverMap(userId) {
  const context = await getDriverContext(userId)
  const districtId = context.driverProfile?.districtId
  const [houses, processingSites] = await Promise.all([
    districtId ? prisma.userAddress.findMany({
      where: { districtId },
      include: {
        district: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 150,
    }) : [],
    prisma.processingSite.findMany({
      where: districtId ? {
        OR: [
          { districtId },
          { districtId: null },
        ],
      } : { districtId: null },
      include: { district: true },
      orderBy: { name: 'asc' },
      take: 100,
    }),
  ])

  return {
    driverProfile: toDriverProfile(context.driverProfile),
    houses: houses.map(toHouse),
    processingSites: processingSites.map(toProcessingSite),
  }
}

export async function getDriverProfile(userId) {
  const context = await getDriverContext(userId)

  return {
    user: toPublicUser(context.user),
    driverProfile: toDriverProfile(context.driverProfile),
  }
}

export async function updateDriverProfile(userId, payload) {
  const context = await getDriverContext(userId)
  const driverProfile = context.driverProfile

  if (payload.email) {
    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } })

    if (existingUser && existingUser.id !== userId) {
      throw new HttpError(409, 'Email sudah digunakan')
    }
  }

  if (payload.districtId) {
    const district = await prisma.district.findUnique({ where: { id: payload.districtId } })

    if (!district) throw new HttpError(400, 'District tidak ditemukan')
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (payload.name || payload.email) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...(payload.name ? { name: payload.name } : {}),
            ...(payload.email ? { email: payload.email } : {}),
          },
        })
      }

      if (payload.vehiclePlate || Object.prototype.hasOwnProperty.call(payload, 'vehicleType') || payload.districtId) {
        if (!driverProfile) {
          if (!payload.vehiclePlate || !payload.districtId) return

          await tx.driverProfile.create({
            data: {
              userId,
              vehiclePlate: payload.vehiclePlate,
              vehicleType: payload.vehicleType || null,
              districtId: payload.districtId,
            },
          })
          return
        }

        await tx.driverProfile.update({
          where: { id: driverProfile.id },
          data: {
            ...(payload.vehiclePlate ? { vehiclePlate: payload.vehiclePlate } : {}),
            ...(Object.prototype.hasOwnProperty.call(payload, 'vehicleType') ? { vehicleType: payload.vehicleType } : {}),
            ...(payload.districtId ? { districtId: payload.districtId } : {}),
          },
        })
      }
    })
  } catch (error) {
    if (error.code === 'P2002') throw new HttpError(409, 'Plat kendaraan sudah digunakan')
    throw error
  }

  return getDriverProfile(userId)
}
