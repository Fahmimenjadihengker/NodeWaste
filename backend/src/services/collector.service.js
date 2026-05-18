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
  }
}

function toCollectorProfile(profile) {
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

async function getCollectorContext(userId) {
  const collectorProfile = await prisma.collectorProfile.findUnique({
    where: { userId },
    include: {
      district: true,
      user: true,
    },
  })

  if (!collectorProfile) {
    throw new HttpError(404, 'Profile collector tidak ditemukan')
  }

  return collectorProfile
}

export async function getCollectorDashboard(userId) {
  const collectorProfile = await getCollectorContext(userId)
  const districtId = collectorProfile.districtId
  const [houseCount, processingSiteCount] = await Promise.all([
    prisma.userAddress.count({ where: { districtId } }),
    prisma.processingSite.count({
      where: {
        OR: [
          { districtId },
          { districtId: null },
        ],
      },
    }),
  ])

  return {
    user: toPublicUser(collectorProfile.user),
    collectorProfile: toCollectorProfile(collectorProfile),
    stats: {
      housesInDistrict: houseCount,
      processingSites: processingSiteCount,
    },
    quickLinks: [
      { label: 'Maps Rumah', path: '/collector/maps/houses' },
      { label: 'Tempat Pengolahan', path: '/collector/maps/processing-sites' },
      { label: 'Rute', path: '/collector/route' },
    ],
  }
}

export async function getCollectorProfile(userId) {
  const collectorProfile = await getCollectorContext(userId)

  return {
    user: toPublicUser(collectorProfile.user),
    collectorProfile: toCollectorProfile(collectorProfile),
  }
}

export async function updateCollectorProfile(userId, payload) {
  const collectorProfile = await getCollectorContext(userId)

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
        await tx.collectorProfile.update({
          where: { id: collectorProfile.id },
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

  return getCollectorProfile(userId)
}

export async function getCollectorHouses(userId) {
  const collectorProfile = await getCollectorContext(userId)
  const houses = await prisma.userAddress.findMany({
    where: { districtId: collectorProfile.districtId },
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
    take: 100,
  })

  return { houses: houses.map(toHouse) }
}

export async function getCollectorProcessingSites(userId) {
  const collectorProfile = await getCollectorContext(userId)
  const sites = await prisma.processingSite.findMany({
    where: {
      OR: [
        { districtId: collectorProfile.districtId },
        { districtId: null },
      ],
    },
    include: { district: true },
    orderBy: { name: 'asc' },
    take: 100,
  })

  return { processingSites: sites.map(toProcessingSite) }
}

export async function getCollectorRoute(userId, query = {}) {
  const collectorProfile = await getCollectorContext(userId)
  const startLat = Number(query.startLat)
  const startLng = Number(query.startLng)
  const endLat = Number(query.endLat)
  const endLng = Number(query.endLng)
  let start = Number.isFinite(startLat) && Number.isFinite(startLng) ? { latitude: startLat, longitude: startLng } : null
  let destination = Number.isFinite(endLat) && Number.isFinite(endLng) ? { latitude: endLat, longitude: endLng } : null

  if (!start) {
    start = await prisma.userAddress.findFirst({
      where: { districtId: collectorProfile.districtId },
      orderBy: { createdAt: 'desc' },
      select: { latitude: true, longitude: true, address: true },
    })
  }

  if (!destination) {
    destination = await prisma.processingSite.findFirst({
      where: {
        OR: [
          { districtId: collectorProfile.districtId },
          { districtId: null },
        ],
      },
      orderBy: { name: 'asc' },
      select: { latitude: true, longitude: true, address: true, name: true },
    })
  }

  const navigationUrl = start && destination
    ? `https://www.google.com/maps/dir/?api=1&origin=${start.latitude},${start.longitude}&destination=${destination.latitude},${destination.longitude}`
    : null

  return {
    start,
    destination,
    navigationUrl,
    provider: 'google_maps_external_link',
  }
}
