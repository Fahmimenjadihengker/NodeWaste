import { useEffect, useState } from 'react'
import { getAdminDashboard } from '../../services/adminApi.js'

const statCards = [
  { key: 'users', label: 'User', detail: 'Akun pengguna aplikasi' },
  { key: 'drivers', label: 'Driver', detail: 'Petugas pengangkutan' },
  { key: 'admins', label: 'Admin', detail: 'Pengelola sistem' },
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
          </div>
          <div className="rounded-[1.5rem] border border-leaf-900/10 bg-[#fbf7e8] p-5 shadow-[0_18px_45px_rgba(32,58,37,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-moss/45">Status akun</p>
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

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => <StatCard key={card.key} {...card} value={stats[card.key]} />)}
      </section>
    </div>
  )
}

export default AdminDashboardPage
