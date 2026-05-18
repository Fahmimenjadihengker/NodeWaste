import { Router } from 'express'
import {
  getCurrentCollectorDashboard,
  getCurrentCollectorProfile,
  getCurrentCollectorRoute,
  listCurrentCollectorHouses,
  listCurrentCollectorProcessingSites,
  updateCurrentCollectorProfile,
} from '../controllers/collector.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('COLLECTOR'))
router.get('/dashboard', getCurrentCollectorDashboard)
router.get('/profile', getCurrentCollectorProfile)
router.put('/profile', updateCurrentCollectorProfile)
router.get('/houses', listCurrentCollectorHouses)
router.get('/processing-sites', listCurrentCollectorProcessingSites)
router.get('/routes', getCurrentCollectorRoute)

export default router
