import { Router } from 'express'
import { getCurrentProfile, updateCurrentPassword, updateCurrentProfile } from '../controllers/profile.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('USER'))
router.get('/', getCurrentProfile)
router.put('/', updateCurrentProfile)
router.put('/password', updateCurrentPassword)

export default router
