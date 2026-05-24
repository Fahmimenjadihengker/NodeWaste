import 'dotenv/config'
import prisma from '../src/config/prisma.js'

async function main() {
  const facilities = [
    {
      name: 'Bank Sampah Ceria',
      type: 'BANK_SAMPAH',
      address: 'Jl. Pemilah No. 10, Kota Hijau',
      latitude: -6.9150,
      longitude: 107.6185,
      description: 'Menerima sampah anorganik bernilai ekonomis.',
    },
    {
      name: 'Komposter Publik RW 05',
      type: 'KOMPOSTER',
      address: 'Taman RW 05, Kota Hijau',
      latitude: -6.9195,
      longitude: 107.6230,
      description: 'Fasilitas pembuatan kompos komunal untuk sampah organik.',
    },
    {
      name: 'Dropbox Limbah Elektronik',
      type: 'DROPBOX_B3',
      address: 'Mall Kota Hijau Lantai Dasar',
      latitude: -6.9125,
      longitude: 107.6200,
      description: 'Tempat khusus pembuangan baterai dan barang elektronik rusak.',
    }
  ]

  console.log('Seeding recycling facilities...')
  
  for (const facility of facilities) {
    const existing = await prisma.recyclingFacility.findFirst({
      where: { name: facility.name },
    })

    if (existing) {
      await prisma.recyclingFacility.update({
        where: { id: existing.id },
        data: facility,
      })
    } else {
      await prisma.recyclingFacility.create({
        data: facility,
      })
    }
  }

  console.log('Successfully seeded recycling facilities!')
}

try {
  await main()
} finally {
  await prisma.$disconnect()
}
