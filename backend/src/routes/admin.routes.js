import { Router } from 'express'
import {
  createDriver,
  createAccount,
  createSchedule,
  deleteAccount,
  deleteSchedule,
  addAccountPoints,
  getCurrentAdminDashboard,
  listAccounts,
  listDrivers,
  listSchedules,
  listUsers,
  subtractAccountPoints,
  updateAccount,
  updateDriver,
  updateSchedule,
} from '../controllers/admin.controller.js'
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(authMiddleware, requireRole('ADMIN'))
router.get('/dashboard', getCurrentAdminDashboard)
router.get('/accounts', listAccounts)
router.post('/accounts', createAccount)
router.put('/accounts/:id', updateAccount)
router.delete('/accounts/:id', deleteAccount)
router.post('/accounts/:id/points/add', addAccountPoints)
router.post('/accounts/:id/points/subtract', subtractAccountPoints)
router.get('/users', listUsers)
router.get('/drivers', listDrivers)
router.post('/drivers', createDriver)
router.put('/drivers/:id', updateDriver)
router.get('/schedules', listSchedules)
router.post('/schedules', createSchedule)
router.put('/schedules/:id', updateSchedule)
router.delete('/schedules/:id', deleteSchedule)

export default router
