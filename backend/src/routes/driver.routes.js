import { Router } from 'express'
import {
  getCurrentDriverDashboard,
  getCurrentDriverMap,
  getCurrentDriverProfile,
  updateCurrentDriverProfile,
} from '../controllers/driver.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('DRIVER'))
router.get('/dashboard', getCurrentDriverDashboard)
router.get('/profile', getCurrentDriverProfile)
router.put('/profile', updateCurrentDriverProfile)
router.get('/map', getCurrentDriverMap)

export default router
