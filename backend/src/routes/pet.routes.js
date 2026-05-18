import { Router } from 'express'
import { getCurrentPet, runPetAction } from '../controllers/pet.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('USER'))
router.get('/', getCurrentPet)
router.post('/:action', runPetAction)

export default router
