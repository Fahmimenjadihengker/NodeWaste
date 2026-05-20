import { Router } from 'express'
import { getCurrentProfile, updateCurrentPassword, updateCurrentProfile } from '../controllers/profile.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware)
router.get('/', getCurrentProfile)
router.put('/', updateCurrentProfile)
router.put('/password', updateCurrentPassword)

export default router
