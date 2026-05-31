import prisma from '../config/prisma.js'
import { getUserActivities } from './activity.service.js'
import { getCurrentPet } from './pet.service.js'

const nextLevelXp = 100
const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function emptyClassificationCounts() {
  return { berbahaya: 0, daurUlang: 0, dibakar: 0, tidakDibakar: 0 }
}

function buildClassifications(classificationCounts) {
  return [
    { key: 'berbahaya', label: 'Berbahaya', value: classificationCounts.berbahaya, color: 'bg-red-700' },
    { key: 'daurUlang', label: 'Daur Ulang', value: classificationCounts.daurUlang, color: 'bg-leaf-600' },
    { key: 'dibakar', label: 'Dibakar', value: classificationCounts.dibakar, color: 'bg-honey' },
    { key: 'tidakDibakar', label: 'Tidak dibakar', value: classificationCounts.tidakDibakar, color: 'bg-[#7fa765]' },
  ]
}

function normalizeClassificationKey(classification) {
  const key = String(classification || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (key.includes('berbahaya') || key === 'b3') return 'berbahaya'
  if (key.includes('daurulang') || key.includes('recycle')) return 'daurUlang'
  if (key.includes('tidakdibakar') || key.includes('janganbakar')) return 'tidakDibakar'
  if (key.includes('dibakar') || key.includes('bakar')) return 'dibakar'
  return null
}

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildScanActivity(scans) {
  const now = new Date()
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (6 - index))

    return {
      dateKey: getDateKey(date),
      label: days[date.getDay()],
      valid: 0,
      classifications: emptyClassificationCounts(),
    }
  })

  const weekly = Array.from({ length: 4 }, (_, index) => ({
    label: `M${index + 1}`,
    valid: 0,
    classifications: emptyClassificationCounts(),
  }))

  const monthly = months.map((label) => ({
    label,
    valid: 0,
    classifications: emptyClassificationCounts(),
  }))

  for (const scan of scans) {
    if (!scan.isValid) continue

    const classification = normalizeClassificationKey(scan.classification)
    if (!classification) continue
    const dateKey = getDateKey(scan.createdAt)
    const dailyItem = daily.find((item) => item.dateKey === dateKey)

    if (dailyItem) {
      dailyItem.valid += 1
      dailyItem.classifications[classification] += 1
    }

    const day = scan.createdAt.getDate()
    if (scan.createdAt.getFullYear() === now.getFullYear() && scan.createdAt.getMonth() === now.getMonth()) {
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3)
      weekly[weekIndex].valid += 1
      weekly[weekIndex].classifications[classification] += 1
    }

    const monthIndex = scan.createdAt.getMonth()
    monthly[monthIndex].valid += 1
    monthly[monthIndex].classifications[classification] += 1
  }

  return {
    daily: daily.map(({ dateKey, ...item }) => item),
    weekly,
    monthly,
  }
}

export async function getDashboard(userId) {
  const yearStart = new Date(new Date().getFullYear(), 0, 1)

  const [user, pet, totalScans, validScans, classificationGroups, chartScans, recentActivities] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getCurrentPet(prisma, userId),
    prisma.scan.count({ where: { userId } }),
    prisma.scan.count({ where: { userId, isValid: true } }),
    prisma.scan.groupBy({ by: ['classification'], where: { userId }, _count: { _all: true } }),
    prisma.scan.findMany({ where: { userId, isValid: true, createdAt: { gte: yearStart } }, select: { classification: true, isValid: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
    getUserActivities(userId, { limit: 5 }),
  ])

  const classificationCounts = emptyClassificationCounts()
  for (const group of classificationGroups) {
    const classification = normalizeClassificationKey(group.classification)
    if (classification) classificationCounts[classification] = group._count._all
  }

  return {
    stats: {
      ecoPoints: user.ecoPoints,
      xp: user.xp,
      nextLevelXp,
      level: user.level,
      totalScans,
      validScans,
    },
    pet,
    classifications: buildClassifications(classificationCounts),
    activities: recentActivities,
    scanActivity: buildScanActivity(chartScans),
  }
}
