import { Router } from 'express'
import { listFacilities } from '../controllers/facility.controller.js'

const router = Router()

router.get('/', listFacilities)

export default router
