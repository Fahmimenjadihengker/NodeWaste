import { Router } from 'express'
import multer from 'multer'
import { getCurrentProfile, updateCurrentPassword, updateCurrentProfile, updateCurrentProfilePhoto } from '../controllers/profile.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
})

router.use(authMiddleware, requireRole('USER'))
router.get('/', getCurrentProfile)
router.put('/', updateCurrentProfile)
router.put('/photo', upload.single('photo'), updateCurrentProfilePhoto)
router.put('/password', updateCurrentPassword)

export default router
