import 'dotenv/config'
import bcrypt from 'bcryptjs'
import prisma from '../src/config/prisma.js'

const password = 'password123'
const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10))

async function main() {
  const district = await prisma.district.upsert({
    where: {
      name_city: {
        name: 'Kecamatan NodeWaste',
        city: 'Kota Hijau',
      },
    },
    update: {
      province: 'Jawa Barat',
    },
    create: {
      name: 'Kecamatan NodeWaste',
      city: 'Kota Hijau',
      province: 'Jawa Barat',
    },
  })

  const driver = await prisma.user.upsert({
    where: { email: 'driver.demo@nodewaste.test' },
    update: {
      name: 'Driver Demo',
      passwordHash,
      role: 'DRIVER',
      driver: {
        upsert: {
          update: {
            vehiclePlate: 'NW 1001 CL',
            vehicleType: 'pickup',
            districtId: district.id,
          },
          create: {
            vehiclePlate: 'NW 1001 CL',
            vehicleType: 'pickup',
            districtId: district.id,
          },
        },
      },
    },
    create: {
      name: 'Driver Demo',
      email: 'driver.demo@nodewaste.test',
      passwordHash,
      role: 'DRIVER',
      driver: {
        create: {
          vehiclePlate: 'NW 1001 CL',
          vehicleType: 'pickup',
          districtId: district.id,
        },
      },
    },
  })

  const demoUsers = [
    {
      email: 'rumah.sari@nodewaste.test',
      name: 'Rumah Sari',
      address: 'Jl. Daun No. 12, Kota Hijau',
      latitude: -6.9175,
      longitude: 107.6191,
    },
    {
      email: 'rumah.bima@nodewaste.test',
      name: 'Rumah Bima',
      address: 'Jl. Kompos No. 8, Kota Hijau',
      latitude: -6.9187,
      longitude: 107.6213,
    },
    {
      email: 'rumah.naya@nodewaste.test',
      name: 'Rumah Naya',
      address: 'Jl. Daur Ulang No. 3, Kota Hijau',
      latitude: -6.9162,
      longitude: 107.6224,
    },
  ]

  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        name: demoUser.name,
        role: 'USER',
        address: {
          upsert: {
            update: {
              districtId: district.id,
              address: demoUser.address,
              latitude: demoUser.latitude,
              longitude: demoUser.longitude,
            },
            create: {
              districtId: district.id,
              address: demoUser.address,
              latitude: demoUser.latitude,
              longitude: demoUser.longitude,
            },
          },
        },
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        role: 'USER',
        pet: { create: {} },
        address: {
          create: {
            districtId: district.id,
            address: demoUser.address,
            latitude: demoUser.latitude,
            longitude: demoUser.longitude,
          },
        },
      },
    })

    await prisma.pet.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    })
  }

  const schedules = [
    ['ORGANIK', 'Senin, Rabu, Jumat', '07.00-09.00', 'Keluarkan sampah organik pada pagi hari sebelum pukul 07.00.'],
    ['ANORGANIK', 'Selasa dan Kamis', '08.00-10.00', 'Pastikan sampah anorganik bersih, kering, dan terpisah dari organik.'],
    ['B3', 'Sabtu minggu pertama', '09.00-11.00', 'Simpan B3 dalam wadah tertutup dan jangan dicampur dengan sampah lain.'],
    ['DAUR_ULANG_RESIDU', 'Sabtu minggu ketiga', '08.00-10.00', 'Pisahkan material daur ulang bernilai dan residu sebelum pagi hari.'],
  ]

  for (const [wasteCategory, pickupDay, pickupTime, instruction] of schedules) {
    const existing = await prisma.wasteSchedule.findFirst({
      where: { districtId: district.id, wasteCategory },
    })

    if (existing) {
      await prisma.wasteSchedule.update({
        where: { id: existing.id },
        data: { pickupDay, pickupTime, instruction },
      })
    } else {
      await prisma.wasteSchedule.create({
        data: { districtId: district.id, wasteCategory, pickupDay, pickupTime, instruction },
      })
    }
  }

  const sites = [
    {
      name: 'TPS3R NodeWaste Hijau',
      address: 'Jl. Pengolahan No. 21, Kota Hijau',
      latitude: -6.9142,
      longitude: 107.6251,
      acceptedWasteCategories: ['ORGANIK', 'ANORGANIK', 'DAUR_ULANG_RESIDU'],
      capacityStatus: 'AVAILABLE',
    },
    {
      name: 'Dropbox B3 Kota Hijau',
      address: 'Jl. Aman B3 No. 5, Kota Hijau',
      latitude: -6.9201,
      longitude: 107.6178,
      acceptedWasteCategories: ['B3'],
      capacityStatus: 'NEAR_FULL',
    },
  ]

  for (const site of sites) {
    const existing = await prisma.processingSite.findFirst({
      where: { name: site.name },
    })

    if (existing) {
      await prisma.processingSite.update({ where: { id: existing.id }, data: { ...site, districtId: district.id } })
    } else {
      await prisma.processingSite.create({ data: { ...site, districtId: district.id } })
    }
  }

  console.log(`driver seed ok: ${driver.email} / ${password}`)
}

try {
  await main()
} finally {
  await prisma.$disconnect()
}
