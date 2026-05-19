import { Router } from 'express'
import { getCurrentDashboard } from '../controllers/dashboard.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('USER'))
router.get('/', getCurrentDashboard)

export default router
