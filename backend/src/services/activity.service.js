import prisma from '../config/prisma.js'
import { toRelativeTime } from '../utils/date-label.js'

function normalizeFilter(filter) {
  return ['scan', 'pet', 'organik', 'anorganik', 'b3'].includes(filter) ? filter : 'all'
}

function normalizeCategoryKey(category) {
  const key = String(category || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (key === 'organik') return 'organik'
  if (key === 'anorganik') return 'anorganik'
  if (key === 'b3') return 'b3'
  return key
}

function toActivityItem(activity) {
  const category = normalizeCategoryKey(activity.scan?.category) || (activity.type === 'PET' ? 'pet' : activity.type.toLowerCase())

  return {
    id: activity.id,
    type: activity.type.toLowerCase(),
    category,
    title: activity.title,
    meta: activity.meta,
    detail: activity.detail || '',
    time: toRelativeTime(activity.createdAt),
  }
}

export async function getUserActivities(userId, options = {}) {
  const filter = normalizeFilter(options.filter)
  const limit = Math.min(Number(options.limit || 20), 50)
  const where = { userId }

  if (filter === 'scan') where.type = 'SCAN'
  if (filter === 'pet') where.type = 'PET'
  if (['organik', 'anorganik', 'b3'].includes(filter)) {
    where.type = 'SCAN'
    where.scan = { is: { category: { equals: filter === 'b3' ? 'B3' : filter, mode: 'insensitive' } } }
  }

  const activities = await prisma.activity.findMany({
    where,
    select: {
      id: true,
      type: true,
      title: true,
      meta: true,
      detail: true,
      createdAt: true,
      scan: { select: { category: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return activities.map(toActivityItem)
}
