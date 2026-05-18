import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '../../services/adminApi.js'

const statCards = [
  { key: 'users', label: 'User', tone: 'bg-leaf-600 text-white', detail: 'Akun pengguna aplikasi' },
  { key: 'drivers', label: 'Driver', tone: 'bg-moss text-white', detail: 'Petugas pengangkutan' },
  { key: 'admins', label: 'Admin', tone: 'bg-[#e1b84c] text-moss', detail: 'Pengelola sistem' },
  { key: 'schedules', label: 'Jadwal', tone: 'bg-white text-leaf-900', detail: 'Jadwal angkut global' },
]

function StatCard({ label, value, tone, detail }) {
  return (
    <article className={`rounded-[1.5rem] p-5 shadow-[0_18px_45px_rgba(37,70,43,0.08)] ring-1 ring-black/5 ${tone}`}>
      <p className="text-sm font-black uppercase tracking-[0.18em] opacity-65">{label}</p>
      <p className="mt-5 text-4xl font-black tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm font-semibold opacity-70">{detail}</p>
    </article>
  )
}

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, drivers: 0, admins: 0, schedules: 0, activeAccounts: 0, disabledAccounts: 0, usersWithAddress: 0 })

  useEffect(() => {
    getAdminDashboard().then((response) => setStats(response.data.stats)).catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf-800 via-leaf-700 to-moss p-6 text-white shadow-[0_24px_70px_rgba(37,70,43,0.22)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cream/70">Dashboard admin</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.055em] sm:text-5xl">Pusat kendali operasional NodeWaste.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">Pantau statistik ringkas, kelola akun pengguna, dan atur jadwal pengangkutan sampah global dari satu area admin.</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/12 p-5 ring-1 ring-white/15">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/55">Kesehatan akun</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4 text-leaf-900">
                <p className="text-3xl font-black">{stats.activeAccounts}</p>
                <p className="text-xs font-bold text-moss/55">aktif</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 text-red-800">
                <p className="text-3xl font-black">{stats.disabledAccounts}</p>
                <p className="text-xs font-bold text-red-800/60">nonaktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => <StatCard key={card.key} {...card} value={stats[card.key]} />)}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-leaf-100 bg-white p-6 shadow-[0_18px_45px_rgba(37,70,43,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Aksi cepat</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-leaf-900">Mulai dari manajemen utama</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link className="rounded-[1.25rem] bg-leaf-50 p-5 font-black text-leaf-900 transition hover:bg-leaf-100" to="/admin/users">Manajemen pengguna<span className="mt-2 block text-sm font-semibold text-moss/60">Tambah, edit, disable user, driver, dan admin.</span></Link>
            <Link className="rounded-[1.25rem] bg-[#fff7d8] p-5 font-black text-moss transition hover:bg-[#ffefad]" to="/admin/schedules">Manajemen jadwal<span className="mt-2 block text-sm font-semibold text-moss/60">Atur jadwal angkut global.</span></Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-leaf-100 bg-white p-6 shadow-[0_18px_45px_rgba(37,70,43,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Alamat pickup</p>
          <p className="mt-4 text-5xl font-black tracking-[-0.05em] text-leaf-900">{stats.usersWithAddress}</p>
          <p className="mt-3 text-sm font-semibold leading-7 text-moss/62">User yang sudah mengisi alamat rumah akan muncul sebagai data pickup untuk driver sesuai wilayah kerja.</p>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
