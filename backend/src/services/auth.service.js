import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { createUser, findUserByEmail } from '../stores/user.store.js'
import { HttpError } from '../utils/http-error.js'

const jwtSecret = process.env.JWT_SECRET || 'dev_nodewaste_secret_change_me'
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ecoPoints: user.ecoPoints,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    isActive: user.isActive,
  }
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  )
}

function toPublicDriverProfile(profile) {
  if (!profile) return null

  return {
    id: profile.id,
    vehiclePlate: profile.vehiclePlate,
    vehicleType: profile.vehicleType,
    district: profile.district ? {
      id: profile.district.id,
      name: profile.district.name,
      city: profile.district.city,
      province: profile.district.province,
    } : null,
  }
}

async function resolveDriverDistrict(tx, payload) {
  if (payload.districtId) {
    const district = await tx.district.findUnique({ where: { id: payload.districtId } })

    if (!district) throw new HttpError(400, 'District tidak ditemukan')

    return district
  }

  const district = await tx.district.findFirst({
    where: {
      ...(payload.districtCode ? { districtCode: payload.districtCode } : {
        name: { equals: payload.districtName, mode: 'insensitive' },
        city: payload.city,
      }),
    },
  })

  if (district) return district

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

export async function registerUser(payload) {
  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    throw new HttpError(409, 'Email sudah digunakan')
  }

  const passwordHash = await bcrypt.hash(payload.password, saltRounds)
  let user

  try {
    user = await createUser({
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
      role: 'USER',
    })
  } catch (error) {
    if (error.code === 'P2002') {
      throw new HttpError(409, 'Email sudah digunakan')
    }

    throw error
  }

  return {
    user: toPublicUser(user),
    token: issueToken(user),
  }
}

export async function registerDriver(payload) {
  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    throw new HttpError(409, 'Email sudah digunakan')
  }

  const passwordHash = await bcrypt.hash(payload.password, saltRounds)

  try {
    const result = await prisma.$transaction(async (tx) => {
      const district = await resolveDriverDistrict(tx, payload)
      const user = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email.toLowerCase(),
          passwordHash,
          role: 'DRIVER',
          driver: {
            create: {
              vehiclePlate: payload.vehiclePlate,
              vehicleType: payload.vehicleType,
              districtId: district.id,
            },
          },
        },
        include: {
          driver: {
            include: { district: true },
          },
        },
      })

      return {
        user,
        driverProfile: user.driver,
      }
    })

    return {
      user: toPublicUser(result.user),
      driverProfile: toPublicDriverProfile(result.driverProfile),
      token: issueToken(result.user),
    }
  } catch (error) {
    if (error instanceof HttpError) throw error
    if (error.code === 'P2002') {
      const targets = error.meta?.target || []
      const message = targets.includes('vehicle_plate') ? 'Plat kendaraan sudah digunakan' : 'Email sudah digunakan'
      throw new HttpError(409, message)
    }

    throw error
  }
}

export async function loginUser(payload) {
  const user = await findUserByEmail(payload.email)

  if (!user) {
    throw new HttpError(401, 'Email atau password salah')
  }

  if (!user.isActive) {
    throw new HttpError(403, 'Akun dinonaktifkan')
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash)

  if (!isPasswordValid) {
    throw new HttpError(401, 'Email atau password salah')
  }

  return {
    user: toPublicUser(user),
    token: issueToken(user),
  }
}

export async function getCurrentAuthUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      driver: {
        include: { district: true },
      },
    },
  })

  if (!user) {
    throw new HttpError(404, 'User tidak ditemukan')
  }

  if (!user.isActive) {
    throw new HttpError(403, 'Akun dinonaktifkan')
  }

  return {
    user: toPublicUser(user),
    driverProfile: toPublicDriverProfile(user.driver),
  }
}

export { toPublicUser }
