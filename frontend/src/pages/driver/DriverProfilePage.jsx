import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AppCard from '../../components/AppCard.jsx'
import { getDriverProfile } from '../../services/driverApi.js'

const fallbackProfile = {
  user: null,
  driverProfile: {
    vehiclePlate: '-',
    vehicleType: 'Belum diatur',
    district: null,
  },
}

function getInitial(name) {
  return (name?.trim()?.charAt(0) || 'C').toUpperCase()
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-[1.25rem] bg-[#fff8e8]/80 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">{label}</p>
      <p className="mt-2 text-lg font-black text-moss">{value || '-'}</p>
    </div>
  )
}

function DriverProfilePage() {
  const { user: storedUser, onLogout } = useOutletContext()
  const [data, setData] = useState(fallbackProfile)
  const [status, setStatus] = useState('loading')
  const user = data.user || storedUser
  const profile = data.driverProfile || fallbackProfile.driverProfile
  const district = profile.district
  const districtLabel = [district?.name, district?.city, district?.province].filter(Boolean).join(', ')

  useEffect(() => {
    let isMounted = true

    getDriverProfile()
      .then((response) => {
        if (!isMounted) return
        setData(response.data || fallbackProfile)
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
      <section className="grid gap-6 lg:grid-cols-[0.9fr_0.45fr]">
        <AppCard className="rounded-[1.5rem] shadow-[0_22px_70px_rgba(32,58,37,0.1)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="mx-auto grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[#f5f1df] text-5xl font-black text-leaf-900 shadow-inner shadow-moss/10 sm:mx-0">
              {getInitial(user?.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Profile driver</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{user?.name || 'Driver'}</h1>
              <p className="mt-3 text-base font-semibold text-moss/60">{user?.email || '-'}</p>
            </div>
          </div>
          {status === 'loading' ? <p className="mt-6 text-sm font-bold text-moss/55">Memuat profile driver...</p> : null}
          {status === 'error' ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">Profile driver belum bisa dimuat.</p> : null}
        </AppCard>

        <AppCard tone="yellow" className="shadow-[0_18px_42px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Aksi akun</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Keluar dari sesi</h2>
          <p className="mt-2 text-sm leading-6 text-moss/65">Logout tersedia di Profile seperti user biasa agar mudah diakses dari mobile PWA.</p>
          <button className="mt-5 w-full rounded-full border border-moss/20 px-5 py-3 text-sm font-black text-moss transition hover:border-red-700 hover:bg-red-700 hover:text-white" type="button" onClick={onLogout}>
            Logout
          </button>
        </AppCard>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <AppCard tone="softCream" className="lg:col-span-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Data operasional</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Kendaraan dan wilayah</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock label="Plat kendaraan" value={profile.vehiclePlate} />
            <InfoBlock label="Tipe kendaraan" value={profile.vehicleType} />
            <InfoBlock label="Wilayah kerja" value={districtLabel} />
            <InfoBlock label="Role" value="DRIVER" />
          </div>
        </AppCard>

        <AppCard tone="green">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Catatan</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Sumber data map</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-moss/65">
            Titik rumah di map hanya muncul jika user biasa mengisi alamat rumah, kecamatan, latitude, dan longitude di Profile mereka.
          </p>
        </AppCard>
      </section>
    </div>
  )
}

export default DriverProfilePage
