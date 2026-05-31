import prisma from '../config/prisma.js'
import { toRelativeTime } from '../utils/date-label.js'

function normalizeFilter(filter) {
  return ['scan', 'pet', 'berbahaya', 'daur-ulang', 'dibakar', 'tidak-dibakar'].includes(filter) ? filter : 'all'
}

function normalizeClassificationKey(classification) {
  const key = String(classification || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (key.includes('berbahaya') || key === 'b3') return 'berbahaya'
  if (key.includes('daurulang') || key.includes('recycle')) return 'daur-ulang'
  if (key.includes('tidakdibakar') || key.includes('janganbakar')) return 'tidak-dibakar'
  if (key.includes('dibakar') || key.includes('bakar')) return 'dibakar'
  return key || null
}

function filterToClassification(filter) {
  return {
    berbahaya: 'Berbahaya',
    'daur-ulang': 'Daur Ulang',
    dibakar: 'Dibakar',
    'tidak-dibakar': 'Tidak dibakar',
  }[filter]
}

function toActivityItem(activity) {
  const classification = normalizeClassificationKey(activity.scan?.classification) || (activity.type === 'PET' ? 'pet' : activity.type.toLowerCase())

  return {
    id: activity.id,
    type: activity.type.toLowerCase(),
    category: activity.scan?.category || null,
    classification,
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
  const classificationFilter = filterToClassification(filter)
  if (classificationFilter) {
    where.type = 'SCAN'
    where.scan = { is: { classification: { equals: classificationFilter, mode: 'insensitive' } } }
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
      scan: { select: { category: true, classification: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return activities.map(toActivityItem)
}
