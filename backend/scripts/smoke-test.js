import 'dotenv/config'
import prisma from '../src/config/prisma.js'
import { getCurrentAuthUser, loginUser, registerDriver, registerUser } from '../src/services/auth.service.js'
import { getDashboard } from '../src/services/dashboard.service.js'
import { getUserActivities } from '../src/services/activity.service.js'
import { getPetOverview, performPetAction } from '../src/services/pet.service.js'
import { getUserSchedules } from '../src/services/schedule.service.js'
import { getDriverDashboard, getDriverMap, getDriverProfile } from '../src/services/driver.service.js'
import { getAdminDashboard, listAdminSchedules, listAdminUsers } from '../src/services/admin.service.js'

const email = `smoke-${Date.now()}@nodewaste.test`
const password = 'password123'
let userId
let driverUserId
let adminUserId

try {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { startsWith: 'smoke-' } },
        { email: { startsWith: 'driver-smoke-' } },
        { email: { startsWith: 'admin-smoke-' } },
      ],
    },
  })

  const registered = await registerUser({ name: 'Smoke Test', email, password })
  userId = registered.user.id
  await loginUser({ email, password })
  await getCurrentAuthUser(userId)
  await getDashboard(userId)
  await getPetOverview(userId)
  await getUserActivities(userId, { limit: 5 })
  await getUserSchedules(userId)

  await prisma.user.update({
    where: { id: userId },
    data: { ecoPoints: 30 },
  })

  await performPetAction(userId, 'feed')

  const driver = await registerDriver({
    name: 'Smoke Driver',
    email: `driver-${email}`,
    password,
    vehiclePlate: `SMK ${Date.now()}`,
    vehicleType: 'pickup',
    districtName: 'Kecamatan Smoke Test',
    city: 'NodeWaste',
    province: 'Test',
  })
  driverUserId = driver.user.id
  await loginUser({ email: `driver-${email}`, password })
  await getCurrentAuthUser(driverUserId)
  await getDriverDashboard(driverUserId)
  await getDriverProfile(driverUserId)
  await getDriverMap(driverUserId)

  const admin = await prisma.user.create({
    data: {
      name: 'Smoke Admin',
      email: `admin-${email}`,
      passwordHash: '$2a$10$8Yb4dD7k3Tx32KbBpZ0as.KRLzExB.xqIbYQ/a6fUODkiXLK4Gh4C',
      role: 'ADMIN',
    },
  })
  adminUserId = admin.id
  await getAdminDashboard()
  await listAdminUsers()
  await listAdminSchedules()

  console.log('smoke test ok')
} finally {
  if (adminUserId) {
    await prisma.user.delete({ where: { id: adminUserId } }).catch(() => {})
  }

  if (driverUserId) {
    await prisma.user.delete({ where: { id: driverUserId } }).catch(() => {})
  }

  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  }

  await prisma.$disconnect()
}
