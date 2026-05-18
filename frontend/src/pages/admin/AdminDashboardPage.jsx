import { useEffect, useState } from 'react'
import AppCard from '../../components/AppCard.jsx'
import { getAdminDashboard } from '../../services/adminApi.js'

function StatCard({ label, value }) {
  return <AppCard tone="softCream"><p className="text-4xl font-black text-leaf-900">{value}</p><p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-moss/45">{label}</p></AppCard>
}

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, drivers: 0, admins: 0, schedules: 0, activeAccounts: 0, disabledAccounts: 0, usersWithAddress: 0 })

  useEffect(() => {
    getAdminDashboard().then((response) => setStats(response.data.stats)).catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Admin</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Dashboard admin.</h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-moss/70">Kelola user, driver, dan jadwal pengambilan sampah NodeWaste.</p>
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="User" value={stats.users} />
        <StatCard label="Driver" value={stats.drivers} />
        <StatCard label="Admin" value={stats.admins} />
        <StatCard label="Jadwal" value={stats.schedules} />
        <StatCard label="Akun aktif" value={stats.activeAccounts} />
        <StatCard label="Akun nonaktif" value={stats.disabledAccounts} />
        <StatCard label="User beralamat" value={stats.usersWithAddress} />
      </section>
    </div>
  )
}

export default AdminDashboardPage
