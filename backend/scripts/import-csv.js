import fs from 'fs'
import csv from 'csv-parser'
import prisma from '../src/config/prisma.js'

async function resolveDistrict(districtName, cityName) {
  if (!districtName || !cityName) return null

  const existing = await prisma.district.findFirst({
    where: {
      name: { equals: districtName, mode: 'insensitive' },
      city: cityName,
    },
  })

  if (existing) return existing.id

  const newDistrict = await prisma.district.create({
    data: {
      name: districtName,
      city: cityName,
      province: 'DI Yogyakarta',
    },
  })

  return newDistrict.id
}

async function processRow(row) {
  const name = row['Nama']
  if (!name) return

  const districtName = row['Kecamatan']
  const cityName = row['Kabupaten/Kota']
  const address = row['Alamat Lengkap'] || ''
  const wasteTypes = row['Jenis Limbah'] || ''
  const lat = parseFloat(row['Latitude'])
  const lng = parseFloat(row['Longitude'])

  if (isNaN(lat) || isNaN(lng)) {
    console.warn(`Skipping ${name} due to invalid coordinates`)
    return
  }

  const nameUpper = name.toUpperCase()
  let isTPS = false
  let isFacility = false
  let facilityType = 'LAINNYA'

  if (nameUpper.includes('BANK SAMPAH')) {
    isFacility = true
    facilityType = 'BANK_SAMPAH'
  } else if (nameUpper.includes('TPS3R') || nameUpper.includes('TPS 3R') || nameUpper.includes('TPST 3R')) {
    isFacility = true
    facilityType = 'TPS3R'
    isTPS = true // TPS3R acts as both
  } else if (nameUpper.includes('TPS') || nameUpper.includes('TPST') || nameUpper.includes('TPA') || nameUpper.includes('DEPO')) {
    isTPS = true
  } else {
    isFacility = true
    facilityType = 'LAINNYA'
  }

  const districtId = await resolveDistrict(districtName, cityName)

  if (isTPS) {
    const existing = await prisma.processingSite.findFirst({ where: { name } })
    const data = {
      name,
      address,
      districtId,
      latitude: lat,
      longitude: lng,
      acceptedWasteCategories: [wasteTypes],
      capacityStatus: 'AVAILABLE'
    }
    if (existing) {
      await prisma.processingSite.update({ where: { id: existing.id }, data })
    } else {
      await prisma.processingSite.create({ data })
    }
  }

  if (isFacility) {
    const existing = await prisma.recyclingFacility.findFirst({ where: { name } })
    const data = {
      name,
      address,
      type: facilityType,
      latitude: lat,
      longitude: lng,
      description: wasteTypes,
    }
    if (existing) {
      await prisma.recyclingFacility.update({ where: { id: existing.id }, data })
    } else {
      await prisma.recyclingFacility.create({ data })
    }
  }
}

async function main() {
  const results = []
  const csvFilePath = 'data/tps_bank_sampah_DIY_gabungan - tps_bank_sampah_DIY_gabungan.csv'

  console.log(`Reading CSV from ${csvFilePath}...`)

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Found ${results.length} records. Starting import...`)
      
      let successCount = 0
      for (const row of results) {
        try {
          await processRow(row)
          successCount++
        } catch (error) {
          console.error(`Error processing row: ${row['Nama']}`, error.message)
        }
      }

      console.log(`Import completed! Successfully imported ${successCount} out of ${results.length} records.`)
      await prisma.$disconnect()
    })
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
