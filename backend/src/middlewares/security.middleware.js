import rateLimit from 'express-rate-limit'
import { HttpError } from '../utils/http-error.js'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak request. Coba lagi sebentar.' },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Terlalu banyak percobaan auth. Coba lagi nanti.' },
})

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak upload. Coba lagi sebentar.' },
})

function detectImageMime(buffer) {
  if (!buffer || buffer.length < 4) return null

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg'
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) return 'image/png'

  return null
}

export function validateUploadedImage(request, _response, next) {
  const file = request.file
  if (!file) {
    next()
    return
  }

  const detectedMime = detectImageMime(file.buffer)
  if (!detectedMime) {
    next(new HttpError(415, 'Isi file gambar tidak valid'))
    return
  }

  if (detectedMime === 'image/jpeg' && !['image/jpeg', 'image/jpg'].includes(file.mimetype)) {
    next(new HttpError(415, 'Format gambar tidak sesuai isi file'))
    return
  }

  if (detectedMime === 'image/png' && file.mimetype !== 'image/png') {
    next(new HttpError(415, 'Format gambar tidak sesuai isi file'))
    return
  }

  file.detectedMime = detectedMime
  next()
}
