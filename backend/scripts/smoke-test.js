import 'dotenv/config'
import prisma from '../src/config/prisma.js'
import { getCurrentAuthUser, loginUser, registerCollector, registerUser } from '../src/services/auth.service.js'
import { getDashboard } from '../src/services/dashboard.service.js'
import { getUserActivities } from '../src/services/activity.service.js'
import { getPetOverview, performPetAction } from '../src/services/pet.service.js'
import { getUserSchedules } from '../src/services/schedule.service.js'
import { getCollectorDashboard, getCollectorHouses, getCollectorProcessingSites, getCollectorProfile, getCollectorRoute } from '../src/services/collector.service.js'

const email = `smoke-${Date.now()}@nodewaste.test`
const password = 'password123'
let userId
let collectorUserId

try {
  await prisma.user.deleteMany({
    where: { email: { endsWith: '@nodewaste.test' } },
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

  const collector = await registerCollector({
    name: 'Smoke Collector',
    email: `collector-${email}`,
    password,
    vehiclePlate: `SMK ${Date.now()}`,
    vehicleType: 'pickup',
    districtName: 'Kecamatan Smoke Test',
    city: 'NodeWaste',
    province: 'Test',
  })
  collectorUserId = collector.user.id
  await loginUser({ email: `collector-${email}`, password })
  await getCurrentAuthUser(collectorUserId)
  await getCollectorDashboard(collectorUserId)
  await getCollectorProfile(collectorUserId)
  await getCollectorHouses(collectorUserId)
  await getCollectorProcessingSites(collectorUserId)
  await getCollectorRoute(collectorUserId)

  console.log('smoke test ok')
} finally {
  if (collectorUserId) {
    await prisma.user.delete({ where: { id: collectorUserId } }).catch(() => {})
  }

  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  }

  await prisma.$disconnect()
}
