import prisma from '../config/prisma.js'

const defaultSchedules = [
  {
    id: 'dummy-organik',
    wasteCategory: 'Organik',
    pickupDay: 'Senin, Rabu, Jumat',
    pickupTime: '07.00-09.00',
    instruction: 'Keluarkan sampah organik pada pagi hari sebelum pukul 07.00, bukan malam sebelumnya.',
  },
  {
    id: 'dummy-anorganik',
    wasteCategory: 'Anorganik',
    pickupDay: 'Selasa dan Kamis',
    pickupTime: '08.00-10.00',
    instruction: 'Pastikan sampah anorganik sudah bersih, kering, dan dipisahkan dari organik.',
  },
  {
    id: 'dummy-b3',
    wasteCategory: 'B3',
    pickupDay: 'Sabtu minggu pertama',
    pickupTime: '09.00-11.00',
    instruction: 'Simpan B3 seperti baterai atau lampu dalam wadah tertutup dan jangan dicampur dengan sampah lain.',
  },
  {
    id: 'dummy-daur-ulang-residu',
    wasteCategory: 'Daur Ulang/Residu',
    pickupDay: 'Sabtu minggu ketiga',
    pickupTime: '08.00-10.00',
    instruction: 'Pisahkan material daur ulang bernilai dan residu. Keluarkan pagi hari sebelum jadwal.',
  },
]

function toDistrict(district) {
  if (!district) return null

  return {
    id: district.id,
    name: district.name,
    city: district.city,
    province: district.province,
  }
}

function toScheduleItem(schedule) {
  return {
    id: schedule.id,
    wasteCategory: schedule.wasteCategory,
    pickupDay: schedule.pickupDay,
    pickupTime: schedule.pickupTime,
    instruction: schedule.instruction,
    district: toDistrict(schedule.district),
  }
}

export async function getUserSchedules(userId) {
  const address = await prisma.userAddress.findUnique({
    where: { userId },
    include: { district: true },
  })

  const schedules = await prisma.wasteSchedule.findMany({
    where: { districtId: null },
    include: { district: true },
    orderBy: [
      { districtId: 'desc' },
      { wasteCategory: 'asc' },
    ],
  })

  return {
    district: toDistrict(address?.district),
    isDummy: schedules.length === 0,
    schedules: schedules.length ? schedules.map(toScheduleItem) : defaultSchedules,
  }
}

export { defaultSchedules }
