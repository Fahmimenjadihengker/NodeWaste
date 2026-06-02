import { Router } from 'express'
import { login, me, register, registerDriverAccount } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authLimiter } from '../middlewares/security.middleware.js'

const router = Router()

router.post('/register', authLimiter, register)
router.post('/register/driver', authLimiter, registerDriverAccount)
router.post('/login', authLimiter, login)
router.get('/me', authMiddleware, me)

export default router
