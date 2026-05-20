import { Router } from 'express'
import { getCurrentPet, runPetAction } from '../controllers/pet.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware)
router.get('/', getCurrentPet)
router.post('/:action', runPetAction)

export default router
