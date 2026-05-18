import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '../../services/adminApi.js'

const statCards = [
  { key: 'users', label: 'User', detail: 'Akun pengguna aplikasi' },
  { key: 'drivers', label: 'Driver', detail: 'Petugas pengangkutan' },
  { key: 'admins', label: 'Admin', detail: 'Pengelola sistem' },
  { key: 'schedules', label: 'Jadwal', detail: 'Jadwal angkut global' },
]

function StatCard({ label, value, detail }) {
  return (
    <article className="rounded-[1.5rem] border border-leaf-900/10 bg-[#fffdf4] p-5 shadow-[0_18px_45px_rgba(32,58,37,0.08)]">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-moss/45">{label}</p>
      <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-leaf-950">{value}</p>
      <p className="mt-2 text-sm font-semibold text-moss/60">{detail}</p>
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
      <section className="overflow-hidden rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_24px_70px_rgba(32,58,37,0.10)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-800/60">Dashboard admin</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.055em] text-leaf-950 sm:text-5xl">Pusat kendali operasional NodeWaste.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-moss/65">Pantau statistik ringkas, kelola akun pengguna, dan atur jadwal pengangkutan sampah global dari satu area admin.</p>
          </div>
          <div className="rounded-[1.5rem] border border-leaf-900/10 bg-[#fbf7e8] p-5 shadow-[0_18px_45px_rgba(32,58,37,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-moss/45">Kesehatan akun</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#fffdf4] p-4 text-leaf-950">
                <p className="text-3xl font-black">{stats.activeAccounts}</p>
                <p className="text-xs font-bold text-moss/55">aktif</p>
              </div>
              <div className="rounded-2xl bg-[#f5f1df] p-4 text-leaf-950">
                <p className="text-3xl font-black">{stats.disabledAccounts}</p>
                <p className="text-xs font-bold text-moss/55">nonaktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => <StatCard key={card.key} {...card} value={stats[card.key]} />)}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-leaf-900/10 bg-[#fffdf4] p-6 shadow-[0_18px_45px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Aksi cepat</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-leaf-900">Mulai dari manajemen utama</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link className="rounded-[1.25rem] bg-[#edf5e4] p-5 font-black text-leaf-950 transition hover:bg-[#e2edd8]" to="/admin/users">Manajemen pengguna<span className="mt-2 block text-sm font-semibold text-moss/60">Tambah, edit, disable user, driver, dan admin.</span></Link>
            <Link className="rounded-[1.25rem] bg-[#f5f1df] p-5 font-black text-leaf-950 transition hover:bg-[#eee7cf]" to="/admin/schedules">Manajemen jadwal<span className="mt-2 block text-sm font-semibold text-moss/60">Atur jadwal angkut global.</span></Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-leaf-900/10 bg-[#fffdf4] p-6 shadow-[0_18px_45px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Alamat pickup</p>
          <p className="mt-4 text-5xl font-black tracking-[-0.05em] text-leaf-900">{stats.usersWithAddress}</p>
          <p className="mt-3 text-sm font-semibold leading-7 text-moss/62">User yang sudah mengisi alamat rumah akan muncul sebagai data pickup untuk driver sesuai wilayah kerja.</p>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
