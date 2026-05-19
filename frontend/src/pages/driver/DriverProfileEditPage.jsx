import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import AppCard from '../../components/AppCard.jsx'
import { SkeletonText } from '../../components/Skeleton.jsx'
import { saveStoredUser } from '../../services/authApi.js'
import { getDriverProfile, updateDriverProfile, updateDriverProfilePhoto } from '../../services/driverApi.js'
import { sweetConfirm, sweetSuccess } from '../../utils/sweetAlert.js'

const inputClass = 'mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600'

function DriverProfileEditPage() {
  const { user: storedUser } = useOutletContext()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: storedUser?.name || '', email: storedUser?.email || '', vehiclePlate: '', vehicleType: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(storedUser?.profilePhotoUrl || '')
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let isMounted = true
    getDriverProfile().then((response) => {
      if (!isMounted) return
      const data = response.data || {}
      setForm({
        name: data.user?.name || '',
        email: data.user?.email || '',
        vehiclePlate: data.driverProfile?.vehiclePlate || '',
        vehicleType: data.driverProfile?.vehicleType || '',
      })
      setPhotoPreview(data.user?.profilePhotoUrl || '')
      setIsLoading(false)
    }).catch((error) => {
      setFeedback(error.message)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handlePhotoChange = (file) => {
    setPhoto(file)
    if (file) setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    const confirmed = await sweetConfirm({ title: 'Simpan profile driver?', text: 'Perubahan akun, foto, dan kendaraan driver akan disimpan.', confirmText: 'Simpan' })
    if (!confirmed) return

    try {
      const response = await updateDriverProfile(form)
      let nextUser = response.data?.user

      if (photo) {
        const photoResponse = await updateDriverProfilePhoto(photo)
        nextUser = photoResponse.data?.user
      }

      if (nextUser) saveStoredUser(nextUser)
      await sweetSuccess({ text: 'Profile driver berhasil diupdate.' })
      navigate('/driver/profile')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppCard className="rounded-[1.75rem] shadow-[0_22px_70px_rgba(32,58,37,0.1)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Edit driver</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Perbarui profile.</h1>

        {isLoading ? <div className="mt-8 space-y-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><SkeletonText className="h-28 w-28 rounded-full" /><div className="flex-1 space-y-3"><SkeletonText className="h-4 w-32" /><SkeletonText className="h-12 w-full" /></div></div><div className="grid gap-4 sm:grid-cols-2"><SkeletonText className="h-16 w-full" /><SkeletonText className="h-16 w-full" /><SkeletonText className="h-16 w-full" /><SkeletonText className="h-16 w-full" /></div></div> : <>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f5f1df] text-4xl font-black text-leaf-900 shadow-inner shadow-moss/10">
              {photoPreview ? <img className="h-full w-full object-cover" src={photoPreview} alt="Preview foto profile driver" /> : (form.name.trim().charAt(0) || 'D').toUpperCase()}
            </div>
            <label className="block flex-1"><span className="text-sm font-black text-moss/70">Foto profile</span><input className={inputClass} accept="image/*" type="file" onChange={(event) => handlePhotoChange(event.target.files?.[0] || null)} /></label>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[['name', 'Nama'], ['email', 'Email'], ['vehiclePlate', 'Plat kendaraan'], ['vehicleType', 'Tipe kendaraan']].map(([key, label]) => <label key={key} className="block"><span className="text-sm font-black text-moss/70">{label}</span><input className={inputClass} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
          </div>
        </>}

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={handleSave} disabled={isLoading}>Simpan profile</button>
          <Link className="rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss" to="/driver/profile">Batal</Link>
        </div>
        {feedback ? <p className="mt-4 rounded-2xl bg-[#fff3cf] p-4 text-sm font-bold text-moss">{feedback}</p> : null}
      </AppCard>
    </div>
  )
}

export default DriverProfileEditPage
