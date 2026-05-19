import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import AppCard from '../../components/AppCard.jsx'
import { SkeletonCard, SkeletonText } from '../../components/Skeleton.jsx'
import { getDriverDashboard } from '../../services/driverApi.js'

const fallbackData = {
  driverProfile: {
    vehiclePlate: '-',
    vehicleType: 'Belum diatur',
    district: { name: 'Wilayah belum diatur', city: null, province: null },
  },
  stats: {
    housesInDistrict: 0,
    processingSites: 0,
  },
  quickLinks: [
    { label: 'Map Wilayah', path: '/driver/map' },
    { label: 'Profil Driver', path: '/driver/profile' },
  ],
}

function StatCard({ label, value, helper }) {
  return (
    <AppCard tone="softCream" className="p-5 sm:p-6">
      <p className="text-4xl font-black tracking-[-0.04em] text-leaf-900">{value}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-moss/45">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-moss/65">{helper}</p>
    </AppCard>
  )
}

function DriverDashboardPage() {
  const { user } = useOutletContext()
  const [data, setData] = useState(fallbackData)
  const [status, setStatus] = useState('loading')
  const profile = data.driverProfile
  const district = profile?.district
  const districtLabel = [district?.name, district?.city].filter(Boolean).join(', ') || 'Wilayah belum diatur'

  useEffect(() => {
    let isMounted = true

    getDriverDashboard()
      .then((response) => {
        if (!isMounted) return
        setData(response.data || fallbackData)
        setStatus('success')
      })
      .catch(() => {
        if (isMounted) setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
        <div className="rounded-[1.75rem] border border-moss/10 bg-[#fff8e8] p-6 shadow-[0_22px_70px_rgba(32,58,37,0.10)] sm:p-8 lg:p-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Dashboard driver</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl lg:text-6xl">
            Halo, {user?.name || 'Driver'}.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-moss/70 sm:text-lg">
            Pantau wilayah angkut, rumah user yang sudah mengisi alamat, dan tujuan TPS tanpa fitur user seperti Leafy, scan, atau EcoPoints.
          </p>
          {status === 'error' ? (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
              Data dashboard belum bisa dimuat. Pastikan akun driver memiliki profile wilayah.
            </p>
          ) : null}
          {status === 'loading' ? <div className="mt-6 max-w-xl space-y-3"><SkeletonText className="w-3/4" /><SkeletonText className="w-1/2" /></div> : null}
        </div>

        <AppCard tone="leaf" className="p-6 sm:p-7">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-800">Kendaraan</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{profile?.vehiclePlate || '-'}</h2>
          <div className="mt-6 space-y-4 text-sm font-bold text-moss/70">
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Tipe</p>
              <p className="mt-1 text-lg font-black capitalize text-moss">{profile?.vehicleType || 'Belum diatur'}</p>
            </div>
            <div className="rounded-2xl bg-white/55 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Wilayah</p>
              <p className="mt-1 text-lg font-black text-moss">{districtLabel}</p>
            </div>
          </div>
        </AppCard>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2">
        {status === 'loading' ? <><SkeletonCard /><SkeletonCard /></> : <><StatCard label="Rumah dalam wilayah" value={data.stats?.housesInDistrict ?? 0} helper="Total alamat user yang masuk district driver aktif." /><StatCard label="Tempat pengolahan" value={data.stats?.processingSites ?? 0} helper="Tujuan operasional yang tersedia untuk wilayah ini atau umum." /></>}
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-moss/10 bg-white/70 p-6 shadow-[0_18px_50px_rgba(32,58,37,0.08)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-700">Akses cepat</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-leaf-900">Operasional driver</h2>
          </div>
          <Link className="text-sm font-black text-leaf-800 hover:text-leaf-950" to="/driver/profile">Lihat profil</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(data.quickLinks || fallbackData.quickLinks).map((link) => (
            <Link key={link.path} className="rounded-[1.25rem] border border-moss/10 bg-[#f8f4e6] p-5 transition hover:-translate-y-0.5 hover:border-leaf-600/30 hover:shadow-[0_18px_38px_rgba(32,58,37,0.10)]" to={link.path}>
              <p className="text-lg font-black text-leaf-900">{link.label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-moss/60">Buka fitur utama driver untuk operasional wilayah.</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DriverDashboardPage
