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
  return prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({ data: user })

    await tx.pet.create({
      data: {
        userId: createdUser.id,
      },
    })

    return createdUser
  })
}

export async function updateUserById(id, updates) {
  return prisma.user.update({ where: { id }, data: updates })
}

export async function updatePasswordById(id, passwordHash) {
  return prisma.user.update({ where: { id }, data: { passwordHash } })
}
