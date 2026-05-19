import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import AddressForm from '../components/AddressForm.jsx'
import AppCard from '../components/AppCard.jsx'
import { getProfile, saveStoredUser, updateProfile, updateProfilePassword, updateProfilePhoto } from '../services/authApi.js'

const inputClass = 'mt-2 w-full rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600'

function ProfileEditPage() {
  const { user } = useOutletContext()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [addressForm, setAddressForm] = useState({ address: '', districtName: '', city: '', province: '', provinceCode: '', cityCode: '', districtCode: '', latitude: '', longitude: '' })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhotoUrl || '')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let isMounted = true
    getProfile().then((response) => {
      if (!isMounted) return
      const nextUser = response.data.user
      setForm({ name: nextUser.name, email: nextUser.email })
      setPhotoPreview(nextUser.profilePhotoUrl || '')
      if (response.data.address) {
        setAddressForm({
          address: response.data.address.address || '',
          districtName: response.data.address.district?.name || '',
          city: response.data.address.district?.city || '',
          province: response.data.address.district?.province || '',
          provinceCode: response.data.address.district?.provinceCode || '',
          cityCode: response.data.address.district?.cityCode || '',
          districtCode: response.data.address.district?.districtCode || '',
          latitude: String(response.data.address.latitude ?? ''),
          longitude: String(response.data.address.longitude ?? ''),
        })
      }
    }).catch((error) => setFeedback(error.message))
    return () => {
      isMounted = false
    }
  }, [])

  const saveProfile = async () => {
    try {
      let userResponse = null
      const hasAddress = Object.values(addressForm).some((value) => String(value).trim())
      const response = await updateProfile({ ...form, ...(hasAddress ? { address: addressForm } : {}) })
      userResponse = response.data.user

      if (photo) {
        const photoResponse = await updateProfilePhoto(photo)
        userResponse = photoResponse.data.user
      }

      saveStoredUser(userResponse)
      navigate('/profile')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const savePassword = async () => {
    if (!password.current || !password.next || !password.confirm) {
      setFeedback('Semua field password wajib diisi.')
      return
    }
    if (password.next !== password.confirm) {
      setFeedback('Konfirmasi password belum sama.')
      return
    }

    try {
      await updateProfilePassword({ currentPassword: password.current, newPassword: password.next })
      setPassword({ current: '', next: '', confirm: '' })
      setFeedback('Password berhasil diperbarui.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const handlePhotoChange = (file) => {
    setPhoto(file)
    if (file) setPhotoPreview(URL.createObjectURL(file))
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <AppCard className="rounded-[1.75rem] shadow-[0_22px_70px_rgba(32,58,37,0.1)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Edit akun</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Perbarui profile.</h1>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f5f1df] text-4xl font-black text-leaf-900 shadow-inner shadow-moss/10">
            {photoPreview ? <img className="h-full w-full object-cover" src={photoPreview} alt="Preview foto profile" /> : (form.name.trim().charAt(0) || 'E').toUpperCase()}
          </div>
          <label className="block flex-1"><span className="text-sm font-black text-moss/70">Foto profile</span><input className={inputClass} accept="image/*" type="file" onChange={(event) => handlePhotoChange(event.target.files?.[0] || null)} /></label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="text-sm font-black text-moss/70">Nama</span><input className={inputClass} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
          <label className="block"><span className="text-sm font-black text-moss/70">Email</span><input className={inputClass} type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
        </div>

        <div className="mt-8 rounded-[1.25rem] bg-[#edf5e4] p-5">
          <AddressForm value={addressForm} onChange={setAddressForm} description="Isi alamat dan koordinat agar rumahmu tampil di map driver wilayahmu. Alamat tidak wajib." />
        </div>

        <div className="mt-8 border-t border-moss/10 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Keamanan akun</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input className={inputClass} placeholder="Password lama" type="password" value={password.current} onChange={(event) => setPassword((current) => ({ ...current, current: event.target.value }))} />
            <input className={inputClass} placeholder="Password baru" type="password" value={password.next} onChange={(event) => setPassword((current) => ({ ...current, next: event.target.value }))} />
            <input className={inputClass} placeholder="Konfirmasi password" type="password" value={password.confirm} onChange={(event) => setPassword((current) => ({ ...current, confirm: event.target.value }))} />
          </div>
          <button className="mt-4 rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={savePassword}>Ubah password</button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" type="button" onClick={saveProfile}>Simpan profile</button>
          <Link className="rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss" to="/profile">Batal</Link>
        </div>
        {feedback ? <p className="mt-4 rounded-2xl bg-[#fff3cf] p-4 text-sm font-bold text-moss">{feedback}</p> : null}
      </AppCard>
    </div>
  )
}

export default ProfileEditPage
