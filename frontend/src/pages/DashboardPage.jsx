import { useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import AppCard from '../components/AppCard.jsx'
import LeafyAvatar from '../components/LeafyAvatar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { SkeletonCard, SkeletonText } from '../components/Skeleton.jsx'
import { useCachedResource } from '../hooks/useCachedResource.js'
import { getCachedDashboard, getDashboard } from '../services/authApi.js'
const emptyDashboardData = {
  stats: { ecoPoints: 0, xp: 0, nextLevelXp: 100, level: 1, streak: 0, totalScans: 0, validScans: 0 },
  pet: { name: 'Leafy', level: 1, mood: 'happy', happiness: 100, hunger: 0 },
  categories: [
    { label: 'Organik', value: 0, color: 'bg-leaf-600' },
    { label: 'Anorganik', value: 0, color: 'bg-[#7fa765]' },
    { label: 'B3', value: 0, color: 'bg-honey' },
  ],
  activities: [],
  scanActivity: { weekly: [], monthly: [] },
}

const scanCategorySegments = [
  { key: 'organik', label: 'Organik', colorClass: 'bg-leaf-600' },
  { key: 'anorganik', label: 'Anorganik', colorClass: 'bg-[#7fa765]' },
  { key: 'b3', label: 'B3', colorClass: 'bg-honey' },
  { key: 'total', label: 'Total scan', colorClass: 'bg-moss' },
]

function StatBlock({ label, value, helper }) {
  return (
    <div className="border-l border-moss/15 pl-4">
      <p className="text-3xl font-black text-leaf-900">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-moss/45">{label}</p>
      {helper ? <p className="mt-2 text-sm font-semibold text-moss/60">{helper}</p> : null}
    </div>
  )
}

function ProgressLine({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black text-moss/70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <ProgressBar value={value} />
    </div>
  )
}

function ScanActivityChart({ data, categories }) {
  const [range, setRange] = useState('weekly')
  const chartData = data[range]
  const maxScan = Math.max(...chartData.map((item) => Object.values(item.categories).reduce((sum, value) => sum + value, 0)), 1)
  const totalValid = chartData.reduce((sum, item) => sum + item.valid, 0)
  const categorySummary = categories.map((category) => ({
    label: category.label,
    value: category.value,
  }))

  return (
    <AppCard className="animate-fade-up shadow-[0_18px_56px_rgba(32,58,37,0.08)] [animation-delay:180ms] [animation-fill-mode:both] sm:p-7 lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Aktivitas scan</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-leaf-900">Pola scan sampah</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-moss/65">
            Pantau scan valid yang berhasil diproses untuk melihat ritme kebiasaan memilahmu.
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-full bg-[#f5f1df] p-1 text-sm font-black text-moss shadow-inner shadow-moss/5">
          {['weekly', 'monthly'].map((option) => (
            <button
              key={option}
              className={`rounded-full px-4 py-2 transition ${range === option ? 'bg-leaf-600 text-white shadow-[0_8px_18px_rgba(52,122,55,0.24)]' : 'text-moss/60 hover:text-leaf-900'}`}
              type="button"
              onClick={() => setRange(option)}
            >
              {option === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.25rem] bg-[#f8f4e6]/75 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Scan valid</p>
          <p className="mt-2 text-3xl font-black text-leaf-900">{totalValid}</p>
        </div>
        {categorySummary.map((category) => (
          <div key={category.label} className="rounded-[1.25rem] bg-[#f8f4e6]/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">{category.label}</p>
            <p className="mt-2 text-3xl font-black text-leaf-900">{category.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto pb-2">
        <div className="relative min-w-[34rem] pb-5 pl-10 pr-2 pt-8 sm:min-w-0">
          <div className="absolute left-0 top-8 flex h-44 w-8 flex-col justify-between text-right text-xs font-bold text-moss/45">
            {[maxScan, Math.round(maxScan * 0.67), Math.round(maxScan * 0.33), 0].map((value, index) => (
              <span key={`${value}-${index}`}>{value}</span>
            ))}
          </div>

          <div className="absolute left-10 right-2 top-8 h-44 border-b border-moss/20">
            {[0, 1, 2, 3].map((line) => (
              <div key={line} className="absolute left-0 right-0 border-t border-moss/10" style={{ top: `${line * 33.33}%` }} />
            ))}
          </div>

          <div className="relative grid h-44 items-end gap-5" style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}>
            {chartData.map((item) => {
              const categoryTotal = Object.values(item.categories).reduce((sum, value) => sum + value, 0)

              return (
                <div key={item.label} className="flex h-full items-end justify-center">
                  <div className="flex h-full w-full max-w-24 items-end justify-center gap-1.5">
                    {scanCategorySegments.map((segment) => {
                      const value = segment.key === 'total' ? categoryTotal : item.categories[segment.key]
                      const height = value ? Math.max((value / maxScan) * 11, 1) : 0

                      return (
                        <div
                          key={segment.key}
                          className={`${segment.colorClass} w-3 rounded-[0.2rem] sm:w-4`}
                          style={{ height: `${height}rem` }}
                          title={`${segment.label}: ${value} scan`}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 grid gap-5" style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}>
            {chartData.map((item) => {
              const categoryTotal = Object.values(item.categories).reduce((sum, value) => sum + value, 0)

              return (
                <div key={item.label} className="text-center">
                  <p className="text-sm font-black text-leaf-900">{item.label}</p>
                  <p className="mt-1 text-xs font-bold text-moss/50">{categoryTotal} scan</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-moss/65">
        {scanCategorySegments.map((segment) => (
          <span key={segment.key} className="inline-flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${segment.colorClass}`} />{segment.label}</span>
        ))}
      </div>
    </AppCard>
  )
}

function DashboardPage() {
  const { user } = useOutletContext()
  const { data, error: feedback, isLoading } = useCachedResource({ getCached: getCachedDashboard, load: getDashboard, fallback: emptyDashboardData })
  const { stats, pet, categories, activities, scanActivity } = data
  const [leafyMood, setLeafyMood] = useState('idle')
  const clickTimesRef = useRef([])
  const moodTimerRef = useRef(null)
  const xpProgress = Math.min(Math.round((stats.xp / stats.nextLevelXp) * 100), 100)

  const handleLeafyClick = () => {
    const now = Date.now()
    clickTimesRef.current = [...clickTimesRef.current.filter((time) => now - time < 2000), now]
    const nextMood = clickTimesRef.current.length >= 5 ? 'angry' : 'happy'

    setLeafyMood(nextMood)
    window.clearTimeout(moodTimerRef.current)
    moodTimerRef.current = window.setTimeout(() => {
      clickTimesRef.current = []
      setLeafyMood('idle')
    }, nextMood === 'angry' ? 3000 : 1800)
  }

  return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <section id="ringkasan" className="order-2 scroll-mt-28 animate-fade-up lg:order-1">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Dashboard</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl lg:text-6xl">
            Halo, {user?.name || 'Eco Hero'}.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-moss/70 sm:text-lg">
            Ini ringkasan kebiasaan memilahmu. Mulai scan berikutnya untuk menambah EcoPoints, XP, dan menjaga Leafy tetap bahagia.
          </p>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#fff3cf] p-4 text-sm font-bold text-moss">{feedback}</p> : null}

          <Link className="mt-8 inline-flex w-full justify-center rounded-full bg-leaf-600 px-7 py-4 font-black text-white transition hover:bg-leaf-900 sm:w-auto" to="/scan">
            Scan Sampah
          </Link>

          <div className="mt-10 grid gap-5 border-y border-moss/15 py-7 sm:grid-cols-3">
            {isLoading ? <><SkeletonCard className="min-h-28" /><SkeletonCard className="min-h-28" /><SkeletonCard className="min-h-28" /></> : <><StatBlock label="EcoPoints" value={stats.ecoPoints} helper="Siap dipakai merawat Leafy" /><StatBlock label="Streak" value={`${stats.streak} hari`} helper="Pertahankan hari ini" /><StatBlock label="Total scan" value={stats.totalScans} helper={`${stats.validScans} scan valid`} /></>}
          </div>

        </section>

          <section id="leafy" className="order-1 scroll-mt-28 rounded-[1.25rem] border border-moss/10 bg-[#dce8cf] p-6 shadow-[0_20px_60px_rgba(32,58,37,0.12)] lg:order-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Virtual pet</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-leaf-900">{pet.name}</h2>
                <p className="mt-2 text-sm font-semibold text-moss/65">Mood {pet.mood}, level {pet.level}</p>
              </div>
              <span className="rounded-full bg-[#fff8e8] px-4 py-2 text-sm font-black text-leaf-900">Lv. {pet.level}</span>
            </div>
            <LeafyAvatar mood={leafyMood} onClick={handleLeafyClick} />
            {isLoading ? <div className="mt-5 space-y-4"><SkeletonText className="h-8 w-full" /><SkeletonText className="h-8 w-full" /></div> : <div className="mt-5 space-y-4"><ProgressLine label="Happiness" value={pet.happiness} /><ProgressLine label="Kenyang" value={100 - pet.hunger} /></div>}
          </section>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <AppCard>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Progress level</h2>
            {isLoading ? <div className="mt-4 space-y-4"><SkeletonText className="w-2/3" /><SkeletonText className="h-8 w-full" /></div> : <><p className="mt-2 text-sm leading-6 text-moss/65">Level {stats.level}, {stats.xp} XP dari {stats.nextLevelXp} XP.</p><div className="mt-8"><ProgressLine label="XP menuju level berikutnya" value={xpProgress} /></div></>}
          </AppCard>

          <AppCard>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Kategori sampah</h2>
            <p className="mt-2 text-sm leading-6 text-moss/65">Ringkasan sampah yang sudah kamu scan atau olah.</p>
            <div className="mt-5 space-y-4">
              {categories.map((category) => (
                <div key={category.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <div>
                    <p className="font-black text-moss">{category.label}</p>
                    <ProgressBar value={category.value * 12} className="mt-2 h-2" barClassName={category.color} />
                  </div>
                  <span className="font-black text-leaf-900">{category.value}</span>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard id="aktivitas" className="scroll-mt-28">
            <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Aktivitas terbaru</h2>
            <div className="mt-5 divide-y divide-moss/10">
              {activities.length ? activities.map((activity) => (
                <article key={`${activity.title}-${activity.time}`} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-leaf-900">{activity.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-moss/60">{activity.meta}</p>
                    </div>
                    <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-moss/40">{activity.time}</span>
                  </div>
                </article>
              )) : (
                <p className="rounded-2xl bg-[#f5f1df] p-4 text-sm font-semibold text-moss/65">Belum ada aktivitas. Yuk mulai scan sampah pertamamu.</p>
              )}
            </div>
          </AppCard>
        </section>

        <div id="grafik-scan" className="mt-8 scroll-mt-28">
          <ScanActivityChart data={scanActivity} categories={categories} />
        </div>
      </div>
  )
}

export default DashboardPage
