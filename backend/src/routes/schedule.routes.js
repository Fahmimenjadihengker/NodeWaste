import { Router } from 'express'
import { getCurrentUserSchedules } from '../controllers/schedule.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('USER'))
router.get('/', getCurrentUserSchedules)

export default router
