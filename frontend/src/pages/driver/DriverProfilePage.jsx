import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import AppCard from '../../components/AppCard.jsx'
import { SkeletonText } from '../../components/Skeleton.jsx'
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

function DriverProfilePage() {
  const { user: storedUser } = useOutletContext()
  const [data, setData] = useState(fallbackProfile)
  const [status, setStatus] = useState('loading')
  const user = data.user || storedUser
  const driverProfile = data.driverProfile || fallbackProfile.driverProfile

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
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section>
        <AppCard className="rounded-[1.5rem] shadow-[0_22px_70px_rgba(32,58,37,0.1)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="mx-auto grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f5f1df] text-5xl font-black text-leaf-900 shadow-inner shadow-moss/10 sm:mx-0">
              {user?.profilePhotoUrl ? <img className="h-full w-full object-cover" src={user.profilePhotoUrl} alt="Foto profile driver" /> : getInitial(user?.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Profile driver</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{user?.name || 'Driver'}</h1>
              <p className="mt-3 text-base font-semibold text-moss/60">{user?.email || '-'}</p>
            </div>
          </div>
          {status === 'loading' ? <div className="mt-8 grid gap-4 sm:grid-cols-3"><SkeletonText className="h-24 w-full" /><SkeletonText className="h-24 w-full" /><SkeletonText className="h-24 w-full" /></div> : null}
          {status === 'error' ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">Profile driver belum bisa dimuat.</p> : null}
          {status === 'success' ? <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[['Plat kendaraan', driverProfile.vehiclePlate || '-'], ['Tipe kendaraan', driverProfile.vehicleType || '-'], ['Wilayah kerja', driverProfile.district ? `${driverProfile.district.name}, ${driverProfile.district.city}` : '-']].map(([label, value]) => <div key={label} className="rounded-[1.2rem] bg-[#f5f1df] p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-moss/45">{label}</p><p className="mt-2 text-lg font-black text-leaf-900">{value}</p></div>)}
          </div> : null}
          <Link className="mt-8 inline-flex rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" to="/driver/profile/edit">Edit profile</Link>
        </AppCard>
      </section>
    </div>
  )
}

export default DriverProfilePage
