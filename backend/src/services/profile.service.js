import bcrypt from 'bcryptjs'
import prisma from '../config/prisma.js'
import { toPublicUser } from './auth.service.js'
import { findUserByEmail, findUserByIdWithPassword, updatePasswordById, updateUserById } from '../stores/user.store.js'
import { HttpError } from '../utils/http-error.js'

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

function emptyCategoryCounts() {
  return { organik: 0, anorganik: 0, b3: 0 }
}

export async function getProfile(user) {
  const scans = await prisma.scan.findMany({
    where: { userId: user.id },
    select: { category: true, isValid: true },
  })
  const categoryCounts = emptyCategoryCounts()

  for (const scan of scans) {
    const key = scan.category.toLowerCase()
    categoryCounts[key] = (categoryCounts[key] || 0) + 1
  }

  return {
    user: toPublicUser(user),
    stats: {
      ecoPoints: user.ecoPoints,
      xp: user.xp,
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

  const updatedUser = await updateUserById(user.id, {
    name: payload.name,
    email: payload.email.toLowerCase(),
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
