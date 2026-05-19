import prisma from '../config/prisma.js'
import { getUserActivities } from './activity.service.js'
import { HttpError } from '../utils/http-error.js'

const actionConfig = {
  feed: {
    type: 'FEED',
    label: 'makan',
    cost: 20,
    xpReward: 0,
    effect: { hunger: -28 },
  },
  play: {
    type: 'PLAY',
    label: 'main',
    cost: 15,
    xpReward: 15,
    effect: { happiness: 18, hunger: 8 },
  },
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 100)
}

function applyDailyDecay(pet) {
  const lastUpdate = new Date(pet.updatedAt)
  const now = new Date()
  const elapsedDays = Math.floor((now.setHours(0, 0, 0, 0) - lastUpdate.setHours(0, 0, 0, 0)) / 86400000)
  if (elapsedDays <= 0) return pet

  return {
    ...pet,
    hunger: clamp(pet.hunger + elapsedDays * 5),
    happiness: clamp(pet.happiness - elapsedDays * 3),
  }
}

export async function getCurrentPet(tx, userId) {
  const pet = await tx.pet.upsert({ where: { userId }, update: {}, create: { userId, happiness: 100, hunger: 0 } })
  const decayedPet = applyDailyDecay(pet)

  if (decayedPet.hunger === pet.hunger && decayedPet.happiness === pet.happiness) return pet

  return tx.pet.update({
    where: { id: pet.id },
    data: { hunger: decayedPet.hunger, happiness: decayedPet.happiness },
  })
}

function applyPetEffect(pet, action) {
  const nextXp = pet.xp + action.xpReward
  const levelGain = Math.floor(nextXp / 100)

  return {
    level: pet.level + levelGain,
    xp: nextXp % 100,
    happiness: clamp(pet.happiness + (action.effect.happiness || 0)),
    hunger: clamp(pet.hunger + (action.effect.hunger || 0)),
    mood: action.type === 'PLAY' ? 'excited' : 'happy',
  }
}

export async function getPetOverview(userId) {
  const [user, pet, activities] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getCurrentPet(prisma, userId),
    getUserActivities(userId, { filter: 'pet', limit: 5 }),
  ])

  return { ecoPoints: user.ecoPoints, pet, activities }
}

export async function performPetAction(userId, actionId) {
  const action = actionConfig[actionId]

  if (!action) {
    throw new HttpError(404, 'Aksi pet tidak ditemukan')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const pet = await getCurrentPet(prisma, userId)

  if (!pet) throw new HttpError(404, 'Pet tidak ditemukan')
  if (user.ecoPoints < action.cost) throw new HttpError(400, 'EcoPoints belum cukup')

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { ecoPoints: { decrement: action.cost } },
  })

  const updatedPet = await prisma.pet.update({
    where: { id: pet.id },
    data: applyPetEffect(pet, action),
  })

  const petAction = await prisma.petAction.create({
    data: {
      userId,
      petId: pet.id,
      actionType: action.type,
      ecoCost: action.cost,
      xpReward: action.xpReward,
    },
  })

  await prisma.activity.create({
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
}
