import { SkeletonCard } from '../components/Skeleton.jsx'
import { useCachedResource } from '../hooks/useCachedResource.js'
import { getCachedSchedules, getSchedules } from '../services/authApi.js'

const categoryLabels = {
  ORGANIK: 'Organik',
  ANORGANIK: 'Anorganik',
  B3: 'B3',
  DAUR_ULANG_RESIDU: 'Daur Ulang/Residu',
}

function getCategoryLabel(category) {
  return categoryLabels[category] || category
}

function ScheduleDesktopTable({ schedules }) {
  return (
    <div className="hidden overflow-hidden rounded-[1.25rem] border border-leaf-900/10 bg-[#fbf7e8] shadow-[0_18px_55px_rgba(32,58,37,0.08)] md:block">
      <table className="w-full border-collapse text-left">
        <thead className="bg-[#f5f1df] text-xs font-black uppercase tracking-[0.18em] text-leaf-900">
          <tr>
            <th className="px-5 py-4">Kategori</th>
            <th className="px-5 py-4">Hari</th>
            <th className="px-5 py-4">Jam</th>
            <th className="px-5 py-4">Instruksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-leaf-900/10 text-sm text-moss/75">
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
        <article key={schedule.id} className="rounded-[1.25rem] border border-leaf-900/10 bg-[#fbf7e8] p-5 shadow-[0_16px_45px_rgba(32,58,37,0.08)]">
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
  const { data: scheduleState, error } = useCachedResource({
    getCached: getCachedSchedules,
    load: getSchedules,
    fallback: {
    schedules: [],
    district: null,
    isDummy: false,
    isFallback: false,
    isLoading: true,
    error: '',
    },
  })
  const isLoading = scheduleState.isLoading && !scheduleState.schedules.length

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Jadwal sampah</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl lg:text-6xl">
            Keluarkan sampah di waktu yang tepat.
          </h1>
        </div>
      </section>

      <section className="mt-8">
        {error ? (
          <p className="mb-4 rounded-2xl bg-[#fff3cf] p-4 text-sm font-semibold text-moss">
            Jadwal dari server belum bisa dimuat. Coba refresh beberapa saat lagi.
          </p>
        ) : null}
        {isLoading ? (
          <SkeletonCard className="min-h-72" />
        ) : (
          <ScheduleTable schedules={scheduleState.schedules} />
        )}
      </section>
    </div>
  )
}

export default SchedulePage
