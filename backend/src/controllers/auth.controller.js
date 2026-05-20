import { loginUser, registerUser } from '../services/auth.service.js'
import { validateLoginPayload, validateRegisterPayload } from '../validators/auth.validator.js'

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
