import { Router } from 'express'
import multer from 'multer'
import {
  getCurrentDriverDashboard,
  getCurrentDriverMap,
  getCurrentDriverProfile,
  updateCurrentDriverProfile,
  updateCurrentDriverProfilePhoto,
} from '../controllers/driver.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
})

router.use(authMiddleware, requireRole('DRIVER'))
router.get('/dashboard', getCurrentDriverDashboard)
router.get('/profile', getCurrentDriverProfile)
router.put('/profile', updateCurrentDriverProfile)
router.put('/profile/photo', upload.single('photo'), updateCurrentDriverProfilePhoto)
router.get('/map', getCurrentDriverMap)

export default router
