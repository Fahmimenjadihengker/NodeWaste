import 'dotenv/config'
import bcrypt from 'bcryptjs'
import prisma from '../src/config/prisma.js'

const password = 'password123'
const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10))

try {
  const admin = await prisma.user.upsert({
    where: { email: 'admin.demo@nodewaste.test' },
    update: {
      name: 'Admin Demo',
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin Demo',
      email: 'admin.demo@nodewaste.test',
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log(`admin seed ok: ${admin.email} / ${password}`)
} finally {
  await prisma.$disconnect()
}
