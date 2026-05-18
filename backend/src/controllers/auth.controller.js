import { getCurrentAuthUser, loginUser, registerCollector, registerUser } from '../services/auth.service.js'
import { validateCollectorRegisterPayload, validateLoginPayload, validateRegisterPayload } from '../validators/auth.validator.js'

export async function register(request, response, next) {
  try {
    const payload = validateRegisterPayload(request.body)
    const data = await registerUser(payload)

    response.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export async function login(request, response, next) {
  try {
    const payload = validateLoginPayload(request.body)
    const data = await loginUser(payload)

    response.json({
      success: true,
      message: 'Login berhasil',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export async function registerCollectorAccount(request, response, next) {
  try {
    const payload = validateCollectorRegisterPayload(request.body)
    const data = await registerCollector(payload)

    response.status(201).json({
      success: true,
      message: 'Registrasi collector berhasil',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export async function me(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'User aktif berhasil diambil',
      data: await getCurrentAuthUser(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}
