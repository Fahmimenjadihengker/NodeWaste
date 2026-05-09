import prisma from '../config/prisma.js'
import { getUserActivities } from './activity.service.js'

const nextLevelXp = 250
const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function emptyCategoryCounts() {
  return { organik: 0, anorganik: 0, b3: 0 }
}

function buildCategories(categoryCounts) {
  return [
    { label: 'Organik', value: categoryCounts.organik, color: 'bg-leaf-600' },
    { label: 'Anorganik', value: categoryCounts.anorganik, color: 'bg-[#7fa765]' },
    { label: 'B3', value: categoryCounts.b3, color: 'bg-honey' },
  ]
}

function buildScanActivity(scans) {
  const weekly = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))

    return {
      dateKey: date.toISOString().slice(0, 10),
      label: days[date.getDay()],
      valid: 0,
      categories: emptyCategoryCounts(),
    }
  })

  const monthly = Array.from({ length: 4 }, (_, index) => ({
    label: `M${index + 1}`,
    valid: 0,
    categories: emptyCategoryCounts(),
  }))

  for (const scan of scans) {
    if (!scan.isValid) continue

    const category = scan.category.toLowerCase()
    const dateKey = scan.createdAt.toISOString().slice(0, 10)
    const weeklyItem = weekly.find((item) => item.dateKey === dateKey)

    if (weeklyItem) {
      weeklyItem.valid += 1
      weeklyItem.categories[category] += 1
    }

    const day = scan.createdAt.getDate()
    const monthIndex = Math.min(Math.floor((day - 1) / 7), 3)
    monthly[monthIndex].valid += 1
    monthly[monthIndex].categories[category] += 1
  }

  return {
    weekly: weekly.map(({ dateKey, ...item }) => item),
    monthly,
  }
}

export async function getDashboard(userId) {
  const [user, pet, scans, recentActivities] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.pet.findUnique({ where: { userId } }),
    prisma.scan.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    getUserActivities(userId, { limit: 5 }),
  ])

  const categoryCounts = emptyCategoryCounts()
  for (const scan of scans) {
    categoryCounts[scan.category.toLowerCase()] += 1
  }

  return {
    stats: {
      ecoPoints: user.ecoPoints,
      xp: user.xp,
      nextLevelXp,
      level: user.level,
      streak: user.streak,
      totalScans: scans.length,
      validScans: scans.filter((scan) => scan.isValid).length,
    },
    pet,
    categories: buildCategories(categoryCounts),
    activities: recentActivities,
    scanActivity: buildScanActivity(scans),
  }
}
