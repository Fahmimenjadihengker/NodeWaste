import bcrypt from 'bcryptjs'
import prisma from '../config/prisma.js'
import { toPublicUser } from './auth.service.js'
import { findUserByEmail, findUserByIdWithPassword, updatePasswordById } from '../stores/user.store.js'
import { HttpError } from '../utils/http-error.js'

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

function emptyClassificationCounts() {
  return { berbahaya: 0, daurUlang: 0, dibakar: 0, tidakDibakar: 0 }
}

function normalizeClassificationKey(classification) {
  const key = String(classification || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (key.includes('berbahaya') || key === 'b3') return 'berbahaya'
  if (key.includes('daurulang') || key.includes('recycle')) return 'daurUlang'
  if (key.includes('tidakdibakar') || key.includes('janganbakar')) return 'tidakDibakar'
  if (key.includes('dibakar') || key.includes('bakar')) return 'dibakar'
  return null
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
  const [totalScans, validScans, classificationGroups, address] = await Promise.all([
    prisma.scan.count({ where: { userId: user.id } }),
    prisma.scan.count({ where: { userId: user.id, isValid: true } }),
    prisma.scan.groupBy({ by: ['classification'], where: { userId: user.id }, _count: { _all: true } }),
    prisma.userAddress.findUnique({
      where: { userId: user.id },
      include: { district: true },
    }),
  ])
  const classificationCounts = emptyClassificationCounts()

  for (const group of classificationGroups) {
    const key = normalizeClassificationKey(group.classification)
    if (key) classificationCounts[key] = group._count._all
  }

  return {
    user: toPublicUser(user),
    address: toUserAddress(address),
    stats: {
      ecoPoints: user.ecoPoints,
      xp: user.xp,
      nextLevelXp: 100,
      level: user.level,
      streak: user.streak,
      totalScans,
      validScans,
      classifications: classificationCounts,
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

export async function updateProfilePhoto(user, file) {
  if (!file) throw new HttpError(400, 'Foto profile wajib diunggah')
  if (!file.mimetype.startsWith('image/')) throw new HttpError(400, 'File harus berupa gambar')

  const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { profilePhotoUrl: dataUrl },
  })

  return toPublicUser(updatedUser)
}
