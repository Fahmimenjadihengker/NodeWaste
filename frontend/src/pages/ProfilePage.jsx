import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import AppCard from '../components/AppCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { getActivities, getProfile, saveStoredUser } from '../services/authApi.js'

const historyFilters = [
  { label: 'Semua', value: 'all' },
  { label: 'Scan', value: 'scan' },
  { label: 'Pet', value: 'pet' },
  { label: 'Organik', value: 'organik' },
  { label: 'Anorganik', value: 'anorganik' },
  { label: 'B3', value: 'b3' },
]

const emptyStats = { ecoPoints: 0, xp: 0, level: 1, streak: 0, totalScans: 0, validScans: 0, nextLevelXp: 250 }

function getInitial(name) {
  return (name?.trim()?.charAt(0) || 'E').toUpperCase()
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-[1.25rem] bg-[#f5f1df] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-moss/45">{label}</p>
      <p className="mt-2 font-black text-leaf-900">{value || '-'}</p>
    </div>
  )
}

function HistorySection({ activeFilter, items, onFilterChange }) {
  return (
    <AppCard>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Riwayat lengkap</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Aktivitas pengguna</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {historyFilters.map((filter) => (
            <button key={filter.value} className={`rounded-full px-4 py-2 text-sm font-black transition ${activeFilter === filter.value ? 'bg-leaf-600 text-white' : 'bg-[#f8f4e6] text-moss/60 hover:text-leaf-900'}`} type="button" onClick={() => onFilterChange(filter.value)}>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 divide-y divide-moss/10">
        {items.length ? items.map((item) => (
          <article key={item.id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-black tracking-[-0.03em] text-leaf-900">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-moss/60">{item.meta}</p>
                <p className="mt-2 text-sm leading-6 text-moss/55">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-moss/40">{item.time}</span>
            </div>
          </article>
        )) : <p className="rounded-[1.25rem] bg-[#f8f4e6] p-5 text-sm font-semibold text-moss/65">Belum ada aktivitas untuk filter ini.</p>}
      </div>
    </AppCard>
  )
}

function ProfilePage() {
  const { user, onLogout } = useOutletContext()
  const [profile, setProfile] = useState({ user, address: null, stats: emptyStats })
  const [activeFilter, setActiveFilter] = useState('all')
  const [history, setHistory] = useState([])
  const stats = { ...emptyStats, ...profile.stats }
  const currentUser = profile.user || user
  const xpProgress = Math.min(Math.round((stats.xp / stats.nextLevelXp) * 100), 100)
  const address = profile.address
  const district = address?.district
  const filteredHistory = useMemo(() => {
    if (activeFilter === 'all') return history
    if (activeFilter === 'scan' || activeFilter === 'pet') return history.filter((item) => item.type === activeFilter)
    return history.filter((item) => item.category === activeFilter)
  }, [activeFilter, history])

  useEffect(() => {
    let isMounted = true
    getProfile().then((response) => {
      if (!isMounted) return
      setProfile(response.data)
      saveStoredUser(response.data.user)
    }).catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    getActivities(activeFilter).then((response) => {
      if (isMounted) setHistory(response.data.activities)
    }).catch(() => {})
    return () => {
      isMounted = false
    }
  }, [activeFilter])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppCard className="rounded-[1.75rem] shadow-[0_22px_70px_rgba(32,58,37,0.1)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="mx-auto grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f5f1df] text-5xl font-black text-leaf-900 shadow-inner shadow-moss/10 sm:mx-0">
              {currentUser?.profilePhotoUrl ? <img className="h-full w-full object-cover" src={currentUser.profilePhotoUrl} alt="Foto profile" /> : getInitial(currentUser?.name)}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Profile akun</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{currentUser?.name || 'Eco Hero'}</h1>
              <p className="mt-3 text-base font-semibold text-moss/60">{currentUser?.email || '-'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" to="/profile/edit">Edit akun</Link>
            <button className="rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss transition hover:border-red-700 hover:bg-red-700 hover:text-white" type="button" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem label="EcoPoints" value={stats.ecoPoints} />
          <InfoItem label="Level" value={`${stats.level} (${stats.xp}/${stats.nextLevelXp} XP)`} />
          <InfoItem label="Total scan" value={`${stats.totalScans} scan, ${stats.validScans} valid`} />
          <InfoItem label="Streak" value={`${stats.streak} hari`} />
        </div>

        <div className="mt-6 rounded-[1.25rem] bg-[#f5f1df] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="text-sm font-black text-leaf-900">Progress level</span>
            <ProgressBar value={xpProgress} className="h-3 flex-1" trackClassName="bg-[#e8e7fb]" />
            <span className="text-sm font-bold text-moss/65">{xpProgress}%</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InfoItem label="Alamat rumah" value={address?.address || 'Belum diisi'} />
          <InfoItem label="Wilayah" value={[district?.name, district?.city, district?.province].filter(Boolean).join(', ') || 'Belum diisi'} />
        </div>
      </AppCard>

      <div className="mt-8">
        <HistorySection activeFilter={activeFilter} items={filteredHistory} onFilterChange={setActiveFilter} />
      </div>
    </div>
  )
}

export default ProfilePage
