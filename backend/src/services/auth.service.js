import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
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

export async function registerUser(payload) {
  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    throw new HttpError(409, 'Email sudah digunakan')
  }

  const passwordHash = await bcrypt.hash(payload.password, saltRounds)
  const user = await createUser({
    id: randomUUID(),
    name: payload.name,
    email: payload.email.toLowerCase(),
    password_hash: passwordHash,
    role: 'USER',
    created_at: new Date().toISOString(),
  })

  return {
    user: toPublicUser(user),
    token: issueToken(user),
  }
}

export async function loginUser(payload) {
  const user = await findUserByEmail(payload.email)

  if (!user) {
    throw new HttpError(401, 'Email atau password salah')
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password_hash)

  if (!isPasswordValid) {
    throw new HttpError(401, 'Email atau password salah')
  }

  return {
    user: toPublicUser(user),
    token: issueToken(user),
  }
}
