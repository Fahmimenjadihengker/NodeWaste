import prisma from '../config/prisma.js'
import { getUserActivities } from './activity.service.js'
import { HttpError } from '../utils/http-error.js'

const actionConfig = {
  feed: {
    type: 'FEED',
    label: 'makan',
    cost: 20,
    xpReward: 0,
    effect: { hunger: -28, health: 8 },
  },
  play: {
    type: 'PLAY',
    label: 'main',
    cost: 15,
    xpReward: 15,
    effect: { happiness: 18, hunger: 8, cleanliness: -4 },
  },
  bath: {
    type: 'BATH',
    label: 'mandi',
    cost: 10,
    xpReward: 0,
    effect: { cleanliness: 24, health: 6, happiness: 4 },
  },
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 100)
}

function applyPetEffect(pet, action) {
  const nextXp = pet.xp + action.xpReward
  const didLevelUp = nextXp >= pet.nextLevelXp

  return {
    level: didLevelUp ? pet.level + 1 : pet.level,
    xp: didLevelUp ? nextXp - pet.nextLevelXp : nextXp,
    health: clamp(pet.health + (action.effect.health || 0)),
    happiness: clamp(pet.happiness + (action.effect.happiness || 0)),
    hunger: clamp(pet.hunger + (action.effect.hunger || 0)),
    cleanliness: clamp(pet.cleanliness + (action.effect.cleanliness || 0)),
    mood: action.type === 'PLAY' ? 'excited' : 'happy',
  }
}

export async function getPetOverview(userId) {
  const [user, pet, activities] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.pet.upsert({ where: { userId }, update: {}, create: { userId } }),
    getUserActivities(userId, { filter: 'pet', limit: 5 }),
  ])

  return { ecoPoints: user.ecoPoints, pet, activities }
}

export async function performPetAction(userId, actionId) {
  const action = actionConfig[actionId]

  if (!action) {
    throw new HttpError(404, 'Aksi pet tidak ditemukan')
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    const pet = await tx.pet.findUnique({ where: { userId } })

    if (!pet) throw new HttpError(404, 'Pet tidak ditemukan')
    if (user.ecoPoints < action.cost) throw new HttpError(400, 'EcoPoints belum cukup')

    const updatedPet = await tx.pet.update({
      where: { id: pet.id },
      data: applyPetEffect(pet, action),
    })

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { ecoPoints: { decrement: action.cost } },
    })

    const petAction = await tx.petAction.create({
      data: {
        userId,
        petId: pet.id,
        actionType: action.type,
        ecoCost: action.cost,
        xpReward: action.xpReward,
      },
    })

    await tx.activity.create({
      data: {
        userId,
        petActionId: petAction.id,
        type: 'PET',
        title: `Leafy ${action.label}`,
        meta: `-${action.cost} EcoPoints${action.xpReward ? `, +${action.xpReward} Pet XP` : ''}`,
        detail: `Aksi ${action.label} berhasil dilakukan.`,
      },
    })

    return {
      ecoPoints: updatedUser.ecoPoints,
      pet: updatedPet,
    }
  })
}
