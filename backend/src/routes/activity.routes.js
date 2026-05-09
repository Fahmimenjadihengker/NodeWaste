import { Router } from 'express'
import { getCurrentActivities } from '../controllers/activity.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware)
router.get('/', getCurrentActivities)

export default router
