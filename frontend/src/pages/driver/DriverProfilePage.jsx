import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AppCard from '../../components/AppCard.jsx'
import { SkeletonText } from '../../components/Skeleton.jsx'
import { getDriverProfile, updateDriverProfile } from '../../services/driverApi.js'
import { sweetConfirm } from '../../utils/sweetAlert.js'

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
  const { user: storedUser, onLogout } = useOutletContext()
  const [data, setData] = useState(fallbackProfile)
  const [form, setForm] = useState({ name: '', email: '', vehiclePlate: '', vehicleType: '' })
  const [status, setStatus] = useState('loading')
  const [feedback, setFeedback] = useState('')
  const user = data.user || storedUser

  useEffect(() => {
    let isMounted = true

    getDriverProfile()
      .then((response) => {
        if (!isMounted) return
        setData(response.data || fallbackProfile)
        setForm({
          name: response.data?.user?.name || '',
          email: response.data?.user?.email || '',
          vehiclePlate: response.data?.driverProfile?.vehiclePlate || '',
          vehicleType: response.data?.driverProfile?.vehicleType || '',
        })
        setStatus('success')
      })
      .catch(() => {
        if (isMounted) setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSave = async () => {
    const confirmed = await sweetConfirm({ title: 'Simpan profile?', text: 'Perubahan akun dan kendaraan driver akan disimpan.', confirmText: 'Simpan' })
    if (!confirmed) return

    try {
      const response = await updateDriverProfile(form)
      setData(response.data || fallbackProfile)
      setFeedback('Profile driver berhasil diperbarui.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const confirmLogout = async () => {
    const confirmed = await sweetConfirm({ title: 'Keluar akun?', text: 'Sesi driver akan diakhiri dari perangkat ini.', confirmText: 'Logout', danger: true })
    if (confirmed) onLogout()
  }

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
          {status === 'loading' ? <div className="mt-6 max-w-xl space-y-3"><SkeletonText className="w-2/3" /><SkeletonText className="w-1/2" /></div> : null}
          {status === 'error' ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">Profile driver belum bisa dimuat.</p> : null}
        </AppCard>

        <AppCard tone="yellow" className="shadow-[0_18px_42px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Aksi akun</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-leaf-900">Keluar dari sesi</h2>
          <p className="mt-2 text-sm leading-6 text-moss/65">Logout tersedia di Profile seperti user biasa agar mudah diakses dari mobile PWA.</p>
          <button className="mt-5 w-full rounded-full border border-moss/20 px-5 py-3 text-sm font-black text-moss transition hover:border-red-700 hover:bg-red-700 hover:text-white" type="button" onClick={confirmLogout}>
            Logout
          </button>
        </AppCard>
      </section>

      <section className="mt-8">
        <AppCard>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Edit profile</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Akun dan kendaraan</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['name', 'Nama'],
              ['email', 'Email'],
              ['vehiclePlate', 'Plat kendaraan'],
              ['vehicleType', 'Tipe kendaraan'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-sm font-black text-moss/70">{label}</span>
                <input className="mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600" value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
          </div>
          <button className="mt-6 rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white" type="button" onClick={handleSave}>Simpan perubahan</button>
          {feedback ? <p className="mt-4 text-sm font-bold text-moss/70">{feedback}</p> : null}
        </AppCard>
      </section>
    </div>
  )
}

export default DriverProfilePage
