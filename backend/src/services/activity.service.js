import prisma from '../config/prisma.js'
import { toRelativeTime } from '../utils/date-label.js'

function normalizeFilter(filter) {
  return ['scan', 'pet', 'organik', 'anorganik', 'b3'].includes(filter) ? filter : 'all'
}

function toActivityItem(activity) {
  const category = activity.scan?.category?.toLowerCase() || (activity.type === 'PET' ? 'pet' : activity.type.toLowerCase())

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
    where.scan = { is: { category: filter.toUpperCase() } }
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
