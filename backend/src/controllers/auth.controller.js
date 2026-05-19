import { getCurrentAuthUser, loginUser, registerDriver, registerUser } from '../services/auth.service.js'
import { validateDriverRegisterPayload, validateLoginPayload, validateRegisterPayload } from '../validators/auth.validator.js'

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

export async function registerDriverAccount(request, response, next) {
  try {
    const payload = validateDriverRegisterPayload(request.body)
    const data = await registerDriver(payload)

    response.status(201).json({
      success: true,
      message: 'Registrasi driver berhasil',
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
