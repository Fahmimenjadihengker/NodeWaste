import { useEffect, useState } from 'react'
import AppCard from '../components/AppCard.jsx'
import { SkeletonCard } from '../components/Skeleton.jsx'
import { getSchedules } from '../services/authApi.js'

const fallbackSchedules = [
  {
    id: 'fallback-organik',
    wasteCategory: 'ORGANIK',
    pickupDay: 'Senin, Rabu, Jumat',
    pickupTime: '07.00-09.00',
    instruction: 'Keluarkan sampah organik pada pagi hari sebelum pukul 07.00, bukan malam sebelumnya.',
  },
  {
    id: 'fallback-anorganik',
    wasteCategory: 'ANORGANIK',
    pickupDay: 'Selasa dan Kamis',
    pickupTime: '08.00-10.00',
    instruction: 'Pastikan sampah anorganik sudah bersih, kering, dan dipisahkan dari organik.',
  },
  {
    id: 'fallback-b3',
    wasteCategory: 'B3',
    pickupDay: 'Sabtu minggu pertama',
    pickupTime: '09.00-11.00',
    instruction: 'Simpan B3 seperti baterai atau lampu dalam wadah tertutup dan jangan dicampur dengan sampah lain.',
  },
  {
    id: 'fallback-daur-ulang-residu',
    wasteCategory: 'DAUR_ULANG_RESIDU',
    pickupDay: 'Sabtu minggu ketiga',
    pickupTime: '08.00-10.00',
    instruction: 'Pisahkan material daur ulang bernilai dan residu. Keluarkan pagi hari sebelum jadwal.',
  },
]

const categoryLabels = {
  ORGANIK: 'Organik',
  ANORGANIK: 'Anorganik',
  B3: 'B3',
  DAUR_ULANG_RESIDU: 'Daur Ulang/Residu',
}

function getCategoryLabel(category) {
  return categoryLabels[category] || category
}

function TemporaryDataBadge({ show }) {
  if (!show) return null

  return (
    <span className="inline-flex rounded-full bg-[#fff3cf] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-moss">
      Data sementara
    </span>
  )
}

function ScheduleDesktopTable({ schedules }) {
  return (
    <div className="hidden overflow-hidden rounded-[1.25rem] border border-moss/10 bg-white/70 md:block">
      <table className="w-full border-collapse text-left">
        <thead className="bg-[#dce8cf] text-xs font-black uppercase tracking-[0.18em] text-leaf-900">
          <tr>
            <th className="px-5 py-4">Kategori</th>
            <th className="px-5 py-4">Hari</th>
            <th className="px-5 py-4">Jam</th>
            <th className="px-5 py-4">Instruksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moss/10 text-sm text-moss/75">
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="px-5 py-5 font-black text-leaf-900">{getCategoryLabel(schedule.wasteCategory)}</td>
              <td className="px-5 py-5 font-semibold">{schedule.pickupDay}</td>
              <td className="px-5 py-5 font-semibold">{schedule.pickupTime}</td>
              <td className="px-5 py-5 leading-6">{schedule.instruction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScheduleMobileRows({ schedules }) {
  return (
    <div className="space-y-4 md:hidden">
      {schedules.map((schedule) => (
        <article key={schedule.id} className="rounded-[1.25rem] border border-moss/10 bg-white/75 p-5 shadow-[0_16px_45px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Kategori</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-leaf-900">{getCategoryLabel(schedule.wasteCategory)}</h2>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-moss/70">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-moss/45">Hari</p>
              <p className="mt-1 text-moss">{schedule.pickupDay}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-moss/45">Jam</p>
              <p className="mt-1 text-moss">{schedule.pickupTime}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-moss/45">Instruksi</p>
              <p className="mt-1 leading-6">{schedule.instruction}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function ScheduleTable({ schedules }) {
  return (
    <>
      <ScheduleDesktopTable schedules={schedules} />
      <ScheduleMobileRows schedules={schedules} />
    </>
  )
}

function SchedulePage() {
  const [scheduleState, setScheduleState] = useState({
    schedules: fallbackSchedules,
    district: null,
    isDummy: true,
    isFallback: false,
    isLoading: true,
    error: '',
  })

  useEffect(() => {
    let isMounted = true

    getSchedules()
      .then((response) => {
        if (!isMounted) return

        setScheduleState({
          schedules: response.data.schedules?.length ? response.data.schedules : fallbackSchedules,
          district: response.data.district || null,
          isDummy: Boolean(response.data.isDummy),
          isFallback: false,
          isLoading: false,
          error: '',
        })
      })
      .catch((error) => {
        if (!isMounted) return

        setScheduleState({
          schedules: fallbackSchedules,
          district: null,
          isDummy: true,
          isFallback: true,
          isLoading: false,
          error: error.message,
        })
      })

    return () => {
      isMounted = false
    }
  }, [])

  const showTemporaryBadge = scheduleState.isDummy || scheduleState.isFallback
  const districtLabel = scheduleState.district
    ? `${scheduleState.district.name}${scheduleState.district.city ? `, ${scheduleState.district.city}` : ''}`
    : 'Semua wilayah'

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_0.45fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Jadwal sampah</p>
            <TemporaryDataBadge show={showTemporaryBadge} />
          </div>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl lg:text-6xl">
            Keluarkan sampah di waktu yang tepat.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-moss/70 sm:text-lg">
            Jadwal ini membantu kamu memilah kapan sampah organik, anorganik, B3, dan daur ulang/residu sebaiknya dikeluarkan dari rumah.
          </p>
        </div>

        <AppCard>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Aturan utama</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Pagi hari, bukan malam.</h2>
          <p className="mt-3 text-sm leading-6 text-moss/65">
            Siapkan sampah sesuai kategori, lalu keluarkan pada pagi hari sebelum jadwal pengangkutan agar tidak tercecer, berbau, atau mengundang hewan.
          </p>
          <div className="mt-5 rounded-2xl bg-[#f5f1df] px-4 py-3 text-sm font-black text-leaf-900">
            Wilayah: {districtLabel}
          </div>
        </AppCard>
      </section>

      <section className="mt-8">
        {scheduleState.error ? (
          <p className="mb-4 rounded-2xl bg-[#fff3cf] p-4 text-sm font-semibold text-moss">
            Jadwal dari server belum bisa dimuat. Menampilkan data sementara.
          </p>
        ) : null}
        {scheduleState.isLoading ? (
          <SkeletonCard className="min-h-72" />
        ) : (
          <ScheduleTable schedules={scheduleState.schedules} />
        )}
      </section>
    </div>
  )
}

export default SchedulePage
