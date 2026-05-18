import { Router } from 'express'
import { login, me, register, registerDriverAccount } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/register/driver', registerDriverAccount)
router.post('/login', login)
router.get('/me', authMiddleware, me)

export default router
