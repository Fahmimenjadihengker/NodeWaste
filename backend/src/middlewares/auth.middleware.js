import jwt from 'jsonwebtoken'
import { findUserById } from '../stores/user.store.js'
import { HttpError } from '../utils/http-error.js'

const jwtSecret = process.env.JWT_SECRET || 'dev_nodewaste_secret_change_me'

export async function authMiddleware(request, _response, next) {
  try {
    const authHeader = request.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      throw new HttpError(401, 'Token tidak ditemukan')
    }

    const payload = jwt.verify(token, jwtSecret)
    const user = await findUserById(payload.sub)

    if (!user) {
      throw new HttpError(401, 'User tidak ditemukan')
    }

    request.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new HttpError(401, 'Token tidak valid atau sudah kadaluarsa'))
      return
    }

    next(error)
  }
}

export function requireRole(...allowedRoles) {
  return function roleMiddleware(request, _response, next) {
    if (!request.user) {
      next(new HttpError(401, 'Token tidak ditemukan'))
      return
    }

    if (!allowedRoles.includes(request.user.role)) {
      next(new HttpError(403, 'Akses role tidak diizinkan'))
      return
    }

    next()
  }
}
