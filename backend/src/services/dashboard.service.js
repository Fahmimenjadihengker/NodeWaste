import prisma from '../config/prisma.js'
import { getUserActivities } from './activity.service.js'
import { getCurrentPet } from './pet.service.js'

const nextLevelXp = 100
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
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 6)
  weekStart.setHours(0, 0, 0, 0)

  const [user, pet, totalScans, validScans, categoryGroups, chartScans, recentActivities] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getCurrentPet(prisma, userId),
    prisma.scan.count({ where: { userId } }),
    prisma.scan.count({ where: { userId, isValid: true } }),
    prisma.scan.groupBy({ by: ['category'], where: { userId }, _count: { _all: true } }),
    prisma.scan.findMany({ where: { userId, isValid: true, createdAt: { gte: monthStart } }, select: { category: true, isValid: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
    getUserActivities(userId, { limit: 5 }),
  ])

  const categoryCounts = emptyCategoryCounts()
  for (const group of categoryGroups) {
    categoryCounts[group.category.toLowerCase()] = group._count._all
  }

  return {
    stats: {
      ecoPoints: user.ecoPoints,
      xp: user.xp,
      nextLevelXp,
      level: user.level,
      streak: user.streak,
      totalScans,
      validScans,
    },
    pet,
    categories: buildCategories(categoryCounts),
    activities: recentActivities,
    scanActivity: buildScanActivity(chartScans.filter((scan) => scan.createdAt >= weekStart || scan.createdAt >= monthStart)),
  }
}
