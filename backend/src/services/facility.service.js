import prisma from '../config/prisma.js'

export function getFacilities() {
  return prisma.recyclingFacility.findMany({ orderBy: { name: 'asc' } })
}
