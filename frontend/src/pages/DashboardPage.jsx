import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import LeafyAvatar from '../components/LeafyAvatar.jsx'
import { dashboardData } from '../services/dashboardData.js'

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
      <div className="h-2 overflow-hidden rounded-full bg-moss/10">
        <div className="h-full rounded-full bg-leaf-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ScanActivityChart({ data }) {
  const [range, setRange] = useState('weekly')
  const chartData = data[range]
  const maxScan = Math.max(...chartData.map((item) => item.valid + item.invalid), 1)
  const totalValid = chartData.reduce((sum, item) => sum + item.valid, 0)
  const totalInvalid = chartData.reduce((sum, item) => sum + item.invalid, 0)

  return (
    <section className="animate-fade-up rounded-[2rem] border border-moss/10 bg-[#e6edd8] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)] [animation-delay:180ms] [animation-fill-mode:both] sm:p-7 lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Aktivitas scan</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-leaf-900">Pola scan sampah</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-moss/65">
            Pantau scan valid dan invalid agar kebiasaan memilahmu makin konsisten.
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

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[#f5f1df]/70 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Scan valid</p>
          <p className="mt-2 text-3xl font-black text-leaf-900">{totalValid}</p>
        </div>
        <div className="rounded-3xl bg-[#fff8e8]/70 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Scan invalid</p>
          <p className="mt-2 text-3xl font-black text-moss">{totalInvalid}</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto pb-2">
        <div className="flex min-w-[34rem] items-end gap-4 rounded-[1.75rem] bg-[#f5f1df]/60 px-5 pb-5 pt-8 sm:min-w-0">
          {chartData.map((item) => {
            const validHeight = Math.max((item.valid / maxScan) * 13, 1.5)
            const invalidHeight = Math.max((item.invalid / maxScan) * 13, item.invalid ? 1.5 : 0)

            return (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-56 w-full max-w-14 items-end justify-center rounded-full bg-white/45 p-1.5 shadow-inner shadow-moss/5">
                  <div className="flex w-full flex-col justify-end overflow-hidden rounded-full bg-leaf-100">
                    <div className="bg-honey" style={{ height: `${invalidHeight}rem` }} title={`${item.invalid} scan invalid`} />
                    <div className="bg-leaf-600" style={{ height: `${validHeight}rem` }} title={`${item.valid} scan valid`} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-leaf-900">{item.label}</p>
                  <p className="mt-1 text-xs font-bold text-moss/50">{item.valid + item.invalid} scan</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-moss/65">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-leaf-600" />Valid</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-honey" />Invalid</span>
      </div>
    </section>
  )
}

function DashboardPage() {
  const { user } = useOutletContext()
  const { stats, pet, categories, activities, scanActivity } = dashboardData
  const [leafyMood, setLeafyMood] = useState('idle')
  const clickTimesRef = useRef([])
  const moodTimerRef = useRef(null)
  const xpProgress = Math.min(Math.round((stats.xp / stats.nextLevelXp) * 100), 100)

  useEffect(() => () => window.clearTimeout(moodTimerRef.current), [])

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
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
        <section id="ringkasan" className="order-2 scroll-mt-28 animate-fade-up lg:order-none">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Dashboard</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl lg:text-6xl">
            Halo, {user?.name || 'Eco Hero'}.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-moss/70 sm:text-lg">
            Ini ringkasan kebiasaan memilahmu. Mulai scan berikutnya untuk menambah EcoPoints, XP, dan menjaga Leafy tetap bahagia.
          </p>

          <Link className="mt-8 inline-flex w-full justify-center rounded-full bg-leaf-600 px-7 py-4 font-black text-white transition hover:bg-leaf-900 sm:w-auto" to="/scan">
            Scan Sampah
          </Link>

          <div className="mt-10 grid gap-5 border-y border-moss/15 py-7 sm:grid-cols-3">
            <StatBlock label="EcoPoints" value={stats.ecoPoints} helper="Siap dipakai merawat Leafy" />
            <StatBlock label="Streak" value={`${stats.streak} hari`} helper="Pertahankan hari ini" />
            <StatBlock label="Total scan" value={stats.totalScans} helper={`${stats.validScans} scan valid`} />
          </div>

          <section className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-moss/10 bg-[#eaf1dc] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)]">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Progress level</h2>
              <p className="mt-2 text-sm leading-6 text-moss/65">Level {stats.level}, {stats.xp} XP dari {stats.nextLevelXp} XP.</p>
              <div className="mt-6">
                <ProgressLine label="XP menuju level berikutnya" value={xpProgress} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-moss/10 bg-[#fff2cf] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)]">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Kategori sampah</h2>
              <div className="mt-5 space-y-4">
                {categories.map((category) => (
                  <div key={category.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                      <p className="font-black text-moss">{category.label}</p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-moss/10">
                        <div className={`h-full rounded-full ${category.color}`} style={{ width: `${category.value * 12}%` }} />
                      </div>
                    </div>
                    <span className="font-black text-leaf-900">{category.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        <aside className="contents animate-fade-up [animation-delay:120ms] [animation-fill-mode:both] lg:block lg:space-y-8">
          <section id="leafy" className="order-1 scroll-mt-28 rounded-[2rem] border border-moss/10 bg-[#dce8cf] p-6 shadow-[0_20px_60px_rgba(32,58,37,0.14)] lg:order-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Virtual pet</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-leaf-900">{pet.name}</h2>
                <p className="mt-2 text-sm font-semibold text-moss/65">Mood {pet.mood}, level {pet.level}</p>
              </div>
              <span className="rounded-full bg-[#fff8e8] px-4 py-2 text-sm font-black text-leaf-900">Lv. {pet.level}</span>
            </div>
            <LeafyAvatar compact mood={leafyMood} onClick={handleLeafyClick} />
            <div className="mt-5 space-y-4">
              <ProgressLine label="Health" value={pet.health} />
              <ProgressLine label="Happiness" value={pet.happiness} />
              <ProgressLine label="Cleanliness" value={pet.cleanliness} />
            </div>
          </section>

          <section id="aktivitas" className="order-3 scroll-mt-28 rounded-[2rem] border border-moss/10 bg-[#eef3df] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)] lg:order-none">
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
          </section>
        </aside>
        </div>

        <div id="grafik-scan" className="mt-8 scroll-mt-28">
          <ScanActivityChart data={scanActivity} />
        </div>
      </div>
  )
}

export default DashboardPage
