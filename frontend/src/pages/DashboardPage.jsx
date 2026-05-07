import { Link, useNavigate } from 'react-router-dom'
import LeafyAvatar from '../components/LeafyAvatar.jsx'
import { dashboardData } from '../services/dashboardData.js'
import { clearAuthSession, getStoredUser } from '../services/authApi.js'

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

function DashboardPage() {
  const user = getStoredUser()
  const navigate = useNavigate()
  const { stats, pet, categories, activities } = dashboardData
  const xpProgress = Math.min(Math.round((stats.xp / stats.nextLevelXp) * 100), 100)

  const handleLogout = () => {
    clearAuthSession()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-[#f5f1df] text-moss">
      <header className="border-b border-moss/10 px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link className="text-xl font-black tracking-tight text-leaf-900" to="/dashboard">NodeWaste</Link>
          <button className="rounded-full border border-moss/20 px-5 py-2.5 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10 lg:py-12">
        <section className="animate-fade-up">
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
            <div className="rounded-[2rem] border border-moss/10 bg-white p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)]">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Progress level</h2>
              <p className="mt-2 text-sm leading-6 text-moss/65">Level {stats.level}, {stats.xp} XP dari {stats.nextLevelXp} XP.</p>
              <div className="mt-6">
                <ProgressLine label="XP menuju level berikutnya" value={xpProgress} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-moss/10 bg-white p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)]">
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

        <aside className="space-y-8 animate-fade-up [animation-delay:120ms] [animation-fill-mode:both]">
          <section className="rounded-[2rem] border border-moss/10 bg-[#dce8cf] p-6 shadow-[0_20px_60px_rgba(32,58,37,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Virtual pet</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-leaf-900">{pet.name}</h2>
                <p className="mt-2 text-sm font-semibold text-moss/65">Mood {pet.mood}, level {pet.level}</p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-leaf-900">Lv. {pet.level}</span>
            </div>
            <LeafyAvatar compact />
            <div className="mt-5 space-y-4">
              <ProgressLine label="Health" value={pet.health} />
              <ProgressLine label="Happiness" value={pet.happiness} />
              <ProgressLine label="Cleanliness" value={pet.cleanliness} />
            </div>
          </section>

          <section className="rounded-[2rem] border border-moss/10 bg-white p-6 shadow-[0_18px_50px_rgba(32,58,37,0.10)]">
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
    </main>
  )
}

export default DashboardPage
