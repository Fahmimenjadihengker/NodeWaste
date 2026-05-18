import { Router } from 'express'
import { listDistricts, listProvinces, listRegencies } from '../controllers/region.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware)
router.get('/provinces', listProvinces)
router.get('/regencies/:provinceCode', listRegencies)
router.get('/districts/:regencyCode', listDistricts)

export default router
