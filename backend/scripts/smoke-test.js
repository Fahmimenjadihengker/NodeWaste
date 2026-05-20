import 'dotenv/config'
import prisma from '../src/config/prisma.js'
import { loginUser, registerUser } from '../src/services/auth.service.js'
import { getDashboard } from '../src/services/dashboard.service.js'
import { getUserActivities } from '../src/services/activity.service.js'
import { getPetOverview, performPetAction } from '../src/services/pet.service.js'

const email = `smoke-${Date.now()}@nodewaste.test`
const password = 'password123'
let userId

try {
  await prisma.user.deleteMany({
    where: { email: { endsWith: '@nodewaste.test' } },
  })

  const registered = await registerUser({ name: 'Smoke Test', email, password })
  userId = registered.user.id
  await loginUser({ email, password })
  await getDashboard(userId)
  await getPetOverview(userId)
  await getUserActivities(userId, { limit: 5 })

  await prisma.user.update({
    where: { id: userId },
    data: { ecoPoints: 30 },
  })

  await performPetAction(userId, 'feed')

  console.log('smoke test ok')
} finally {
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  }

  await prisma.$disconnect()
}
