import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function connectDatabase() {
  await prisma.$connect()
  console.log('PostgreSQL connected via Prisma')
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}

export default prisma
