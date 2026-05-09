import { getPetOverview, performPetAction } from '../services/pet.service.js'

export async function getCurrentPet(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Pet berhasil diambil',
      data: await getPetOverview(request.user.id),
    })
  } catch (error) {
    next(error)
  }
}

export async function runPetAction(request, response, next) {
  try {
    response.json({
      success: true,
      message: 'Aksi pet berhasil',
      data: await performPetAction(request.user.id, request.params.action),
    })
  } catch (error) {
    next(error)
  }
}
