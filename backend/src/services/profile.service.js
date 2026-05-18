import bcrypt from 'bcryptjs'
import prisma from '../config/prisma.js'
import { toPublicUser } from './auth.service.js'
import { findUserByEmail, findUserByIdWithPassword, updatePasswordById } from '../stores/user.store.js'
import { HttpError } from '../utils/http-error.js'

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

function emptyCategoryCounts() {
  return { organik: 0, anorganik: 0, b3: 0 }
}

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

function toUserAddress(address) {
  if (!address) return null

  return {
    id: address.id,
    address: address.address,
    latitude: address.latitude,
    longitude: address.longitude,
    frontPhotoUrl: address.frontPhotoUrl,
    district: toDistrict(address.district),
  }
}

async function resolveDistrict(tx, payload) {
  const existingDistrict = await tx.district.findFirst({
    where: {
      ...(payload.districtCode ? { districtCode: payload.districtCode } : {
        name: { equals: payload.districtName, mode: 'insensitive' },
        city: payload.city,
      }),
    },
  })

  if (existingDistrict) return existingDistrict

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

export async function getProfile(user) {
  const [scans, address] = await Promise.all([
    prisma.scan.findMany({
      where: { userId: user.id },
      select: { category: true, isValid: true },
    }),
    prisma.userAddress.findUnique({
      where: { userId: user.id },
      include: { district: true },
    }),
  ])
  const categoryCounts = emptyCategoryCounts()

  for (const scan of scans) {
    const key = scan.category.toLowerCase()
    categoryCounts[key] = (categoryCounts[key] || 0) + 1
  }

  return {
    user: toPublicUser(user),
    address: toUserAddress(address),
    stats: {
      ecoPoints: user.ecoPoints,
      xp: user.xp,
      nextLevelXp: 250,
      level: user.level,
      streak: user.streak,
      totalScans: scans.length,
      validScans: scans.filter((scan) => scan.isValid).length,
      categories: categoryCounts,
    },
  }
}

export async function updateProfile(user, payload) {
  const existingUser = await findUserByEmail(payload.email)

  if (existingUser && existingUser.id !== user.id) {
    throw new HttpError(409, 'Email sudah digunakan')
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const nextUser = await tx.user.update({
      where: { id: user.id },
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
      },
    })

    if (payload.address) {
      const district = await resolveDistrict(tx, payload.address)

      await tx.userAddress.upsert({
        where: { userId: user.id },
        update: {
          districtId: district.id,
          address: payload.address.address,
          latitude: payload.address.latitude,
          longitude: payload.address.longitude,
        },
        create: {
          userId: user.id,
          districtId: district.id,
          address: payload.address.address,
          latitude: payload.address.latitude,
          longitude: payload.address.longitude,
        },
      })
    }

    return nextUser
  })

  return toPublicUser(updatedUser)
}

export async function updatePassword(user, payload) {
  const userWithPassword = await findUserByIdWithPassword(user.id)

  if (!userWithPassword) {
    throw new HttpError(404, 'User tidak ditemukan')
  }

  const isPasswordValid = await bcrypt.compare(payload.currentPassword, userWithPassword.passwordHash)

  if (!isPasswordValid) {
    throw new HttpError(400, 'Password lama salah')
  }

  const passwordHash = await bcrypt.hash(payload.newPassword, saltRounds)
  await updatePasswordById(user.id, passwordHash)

  return { updated: true }
}
