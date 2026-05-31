import prisma from '../config/prisma.js'

const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']

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

function toScheduleItem(schedule) {
  return {
    id: schedule.id,
    wasteCategory: schedule.wasteCategory,
    pickupDay: schedule.pickupDay,
    pickupTime: schedule.pickupTime,
    instruction: schedule.instruction,
  }
}

function getScheduleDayIndex(schedule) {
  const pickupDay = String(schedule.pickupDay || '').toLowerCase()
  const indexes = dayOrder.map((day, index) => pickupDay.includes(day) ? index : null).filter((index) => index !== null)

  return indexes.length ? Math.min(...indexes) : dayOrder.length
}

function sortSchedules(schedules) {
  return [...schedules].sort((a, b) => {
    const dayDiff = getScheduleDayIndex(a) - getScheduleDayIndex(b)
    if (dayDiff) return dayDiff

    return String(a.pickupTime || '').localeCompare(String(b.pickupTime || ''))
  })
}

export async function getUserSchedules() {
  const schedules = await prisma.wasteSchedule.findMany({
    orderBy: [
      { pickupDay: 'asc' },
      { pickupTime: 'asc' },
    ],
  })

  return {
    district: null,
    isDummy: schedules.length === 0,
    schedules: sortSchedules(schedules.length ? schedules.map(toScheduleItem) : defaultSchedules),
  }
}

export { defaultSchedules }
