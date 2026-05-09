import { Router } from 'express'
import { getCurrentDashboard } from '../controllers/dashboard.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware)
router.get('/', getCurrentDashboard)

export default router
