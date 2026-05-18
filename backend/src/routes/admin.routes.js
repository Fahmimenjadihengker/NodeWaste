import { Router } from 'express'
import {
  createDriver,
  createSchedule,
  deleteSchedule,
  getCurrentAdminDashboard,
  listDrivers,
  listSchedules,
  listUsers,
  updateDriver,
  updateSchedule,
} from '../controllers/admin.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('ADMIN'))
router.get('/dashboard', getCurrentAdminDashboard)
router.get('/users', listUsers)
router.get('/drivers', listDrivers)
router.post('/drivers', createDriver)
router.put('/drivers/:id', updateDriver)
router.get('/schedules', listSchedules)
router.post('/schedules', createSchedule)
router.put('/schedules/:id', updateSchedule)
router.delete('/schedules/:id', deleteSchedule)

export default router
