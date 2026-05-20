import prisma from '../config/prisma.js'

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } })
}

export async function findUserByIdWithPassword(id) {
  return prisma.user.findUnique({ where: { id } })
}

export async function createUser(user) {
  return prisma.user.create({
    data: {
      ...user,
      pet: {
        create: {},
      },
    },
  })
}

export async function updateUserById(id, updates) {
  return prisma.user.update({ where: { id }, data: updates })
}

export async function updatePasswordById(id, passwordHash) {
  return prisma.user.update({ where: { id }, data: { passwordHash } })
}
