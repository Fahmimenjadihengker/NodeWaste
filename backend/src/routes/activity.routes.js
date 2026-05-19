import { Router } from 'express'
import { getCurrentActivities } from '../controllers/activity.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('USER'))
router.get('/', getCurrentActivities)

export default router
