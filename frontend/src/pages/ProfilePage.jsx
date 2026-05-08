import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { dashboardData } from '../services/dashboardData.js'

const historyFilters = [
  { label: 'Semua', value: 'all' },
  { label: 'Scan', value: 'scan' },
  { label: 'Pet', value: 'pet' },
  { label: 'Organik', value: 'organik' },
  { label: 'Anorganik', value: 'anorganik' },
  { label: 'B3', value: 'b3' },
]

const mockHistory = [
  { id: 1, type: 'scan', category: 'anorganik', title: 'Scan Botol Plastik', meta: '+15 EcoPoints, +10 XP', time: 'Hari ini', detail: 'Anorganik, confidence 92%' },
  { id: 2, type: 'pet', category: 'pet', title: 'Leafy diberi makan', meta: '-20 EcoPoints', time: 'Kemarin', detail: 'Health Leafy naik dan hunger turun.' },
  { id: 3, type: 'scan', category: 'organik', title: 'Scan Sisa Makanan', meta: '+10 EcoPoints, +10 XP', time: '2 hari lalu', detail: 'Organik, confidence 88%' },
  { id: 4, type: 'pet', category: 'pet', title: 'Leafy diajak main', meta: '-15 EcoPoints, +15 Pet XP', time: '3 hari lalu', detail: 'Happiness Leafy meningkat.' },
  { id: 5, type: 'scan', category: 'b3', title: 'Scan Baterai Bekas', meta: '+20 EcoPoints, +10 XP', time: '4 hari lalu', detail: 'B3, confidence 84%' },
  { id: 6, type: 'scan', category: 'anorganik', title: 'Scan Kaleng Minuman', meta: '+15 EcoPoints, +10 XP', time: '5 hari lalu', detail: 'Anorganik, confidence 90%' },
]

function getInitial(name) {
  return (name?.trim()?.charAt(0) || 'E').toUpperCase()
}

function StatCard({ label, value, helper }) {
  return (
    <div className="min-h-44 rounded-[1.25rem] border border-moss/10 bg-[#fff8e8]/75 p-6 shadow-[0_18px_42px_rgba(32,58,37,0.08)]">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-moss/45">{label}</p>
      <p className="mt-4 text-4xl font-black tracking-[-0.04em] text-leaf-900">{value}</p>
      {helper ? <p className="mt-3 text-base font-semibold text-moss/60">{helper}</p> : null}
    </div>
  )
}

function ProfileHero({ user, xpProgress }) {
  return (
    <section className="rounded-[1.5rem] border border-moss/10 bg-[#dce8cf] p-6 shadow-[0_22px_70px_rgba(32,58,37,0.12)] sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="mx-auto grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[#f5f1df] text-5xl font-black text-leaf-900 shadow-inner shadow-moss/10 sm:mx-0">
          {getInitial(user?.name)}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{user?.name || 'Eco Hero'}</h1>
          <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] bg-[#f8f4e6]/70 p-3 sm:flex-row sm:items-center">
            <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-moss/10 bg-[#fff8e8] px-4 py-2 text-sm font-black text-leaf-900">Level {dashboardData.stats.level}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e8e7fb]">
              <div className="h-full rounded-full bg-leaf-600" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="shrink-0 text-sm font-bold text-moss/65">{dashboardData.stats.xp} / {dashboardData.stats.nextLevelXp} XP</span>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full rounded-full border border-moss/15 px-5 py-3 text-sm font-black text-moss/50 sm:w-auto" type="button" disabled>
        Ubah foto segera hadir
      </button>
    </section>
  )
}

function SettingsCard({ form, password, settingsFeedback, passwordFeedback, onFormChange, onSave, onPasswordChange, onPasswordSubmit }) {
  return (
    <section className="rounded-[1.25rem] border border-moss/10 bg-[#fff8e8] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Pengaturan akun</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Data dan preferensi</h2>
        <p className="mt-2 text-sm leading-6 text-moss/65">Nama dan email masih divalidasi lokal sampai endpoint update profile tersedia.</p>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-sm font-black text-moss/70">Nama</span>
          <input className="mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600" value={form.name} onChange={(event) => onFormChange('name', event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-black text-moss/70">Email</span>
          <input className="mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600" type="email" value={form.email} onChange={(event) => onFormChange('email', event.target.value)} />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" type="button" onClick={onSave}>
          Simpan perubahan
        </button>
        {settingsFeedback ? <p className="text-sm font-bold text-leaf-900">{settingsFeedback}</p> : null}
      </div>

      <div className="mt-8 border-t border-moss/10 pt-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Keamanan akun</p>
        <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Ubah password</h3>
        <p className="mt-2 text-sm leading-6 text-moss/65">Validasi masih lokal untuk persiapan integrasi endpoint keamanan.</p>

        <div className="mt-6 grid gap-4">
          {[
            ['current', 'Password lama'],
            ['next', 'Password baru'],
            ['confirm', 'Konfirmasi password'],
          ].map(([key, label]) => (
            <label key={key} className="block min-w-0">
              <span className="whitespace-nowrap text-sm font-black text-moss/70">{label}</span>
              <input className="mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600" type="password" value={password[key]} onChange={(event) => onPasswordChange(key, event.target.value)} />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={onPasswordSubmit}>
            Validasi password
          </button>
          {passwordFeedback ? <p className="text-sm font-bold text-leaf-900">{passwordFeedback}</p> : null}
        </div>
      </div>
    </section>
  )
}

function AccountActionCard({ onLogout }) {
  return (
    <section className="rounded-[1.25rem] border border-moss/10 bg-[#fff3cf] p-6 shadow-[0_18px_42px_rgba(32,58,37,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Aksi akun</p>
      <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Keluar dari sesi</h2>
      <p className="mt-2 text-sm leading-6 text-moss/65">Logout tersedia di Profile agar mudah diakses dari mobile PWA.</p>
      <button className="mt-5 w-full rounded-full border border-moss/20 px-5 py-3 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={onLogout}>
        Logout
      </button>
    </section>
  )
}

function HistorySection({ activeFilter, items, onFilterChange }) {
  return (
    <section className="rounded-[1.25rem] border border-moss/10 bg-[#edf4e6] p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Riwayat lengkap</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Aktivitas pengguna</h2>
          <p className="mt-2 text-sm leading-6 text-moss/65">Riwayat scan dan perawatan pet ditampilkan di Profile sampai halaman History dibuat.</p>
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f8f4e6] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-moss/50">{item.type === 'scan' ? 'Scan' : 'Pet'}</span>
                  <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-leaf-900">{item.category}</span>
                </div>
                <h3 className="mt-3 text-xl font-black tracking-[-0.03em] text-leaf-900">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-moss/60">{item.meta}</p>
                <p className="mt-2 text-sm leading-6 text-moss/55">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-moss/40">{item.time}</span>
            </div>
          </article>
        )) : (
          <p className="rounded-[1.25rem] bg-[#f8f4e6] p-5 text-sm font-semibold text-moss/65">Belum ada aktivitas untuk filter ini.</p>
        )}
      </div>
    </section>
  )
}

function ProfilePage() {
  const { user, onLogout } = useOutletContext()
  const xpProgress = Math.min(Math.round((dashboardData.stats.xp / dashboardData.stats.nextLevelXp) * 100), 100)
  const [form, setForm] = useState({ name: user?.name || 'Eco Hero', email: user?.email || '' })
  const [settingsFeedback, setSettingsFeedback] = useState('')
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const filteredHistory = useMemo(() => {
    if (activeFilter === 'all') return mockHistory
    if (activeFilter === 'scan' || activeFilter === 'pet') return mockHistory.filter((item) => item.type === activeFilter)

    return mockHistory.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  const handleFormChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSaveSettings = () => {
    if (!form.name.trim()) {
      setSettingsFeedback('Nama tidak boleh kosong.')
      return
    }

    if (!form.email.includes('@')) {
      setSettingsFeedback('Email harus valid.')
      return
    }

    setSettingsFeedback('Perubahan tervalidasi secara lokal.')
  }

  const handlePasswordChange = (key, value) => {
    setPassword((current) => ({ ...current, [key]: value }))
  }

  const handlePasswordSubmit = () => {
    if (!password.current || !password.next || !password.confirm) {
      setPasswordFeedback('Semua field password wajib diisi.')
      return
    }

    if (password.next.length < 8) {
      setPasswordFeedback('Password baru minimal 8 karakter.')
      return
    }

    if (password.next !== password.confirm) {
      setPasswordFeedback('Konfirmasi password belum sama.')
      return
    }

    setPasswordFeedback('Password lolos validasi lokal. Integrasi backend menyusul.')
    setPassword({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section>
        <ProfileHero user={{ ...user, ...form }} xpProgress={xpProgress} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SettingsCard form={form} password={password} settingsFeedback={settingsFeedback} passwordFeedback={passwordFeedback} onFormChange={handleFormChange} onSave={handleSaveSettings} onPasswordChange={handlePasswordChange} onPasswordSubmit={handlePasswordSubmit} />
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard label="EcoPoints" value={dashboardData.stats.ecoPoints} helper="Siap dipakai merawat Leafy" />
            <StatCard label="Level" value={dashboardData.stats.level} helper={`${dashboardData.stats.xp}/${dashboardData.stats.nextLevelXp} XP`} />
            <StatCard label="Total scan" value={dashboardData.stats.totalScans} helper={`${dashboardData.stats.validScans} scan valid`} />
            <StatCard label="Streak" value={`${dashboardData.stats.streak} hari`} helper="Pertahankan hari ini" />
          </div>
          <AccountActionCard onLogout={onLogout} />
        </div>
      </section>

      <div className="mt-8">
        <HistorySection activeFilter={activeFilter} items={filteredHistory} onFilterChange={setActiveFilter} />
      </div>
    </div>
  )
}

export default ProfilePage
