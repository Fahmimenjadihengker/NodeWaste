import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AddressForm from '../../components/AddressForm.jsx'
import { createAdminAccount, getCachedAdminUsers, loadAdminUsers, updateAdminAccount } from '../../services/adminApi.js'
import { sweetConfirm, sweetLoading, sweetSuccess } from '../../utils/sweetAlert.js'

const emptyForm = { name: '', email: '', password: 'password123', role: 'USER', vehiclePlate: '', vehicleType: 'pickup', isActive: true }
const emptyDistrict = { address: '-', districtName: '', city: '', province: '', provinceCode: '', cityCode: '', districtCode: '', latitude: '', longitude: '' }
const inputClass = 'rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-700 focus:ring-4 focus:ring-leaf-900/10'

function formFromAccount(account) {
  if (!account) return emptyForm
  return { name: account.name, email: account.email, password: '', role: account.role, vehiclePlate: account.driverProfile?.vehiclePlate || '', vehicleType: account.driverProfile?.vehicleType || '', isActive: account.isActive }
}

function districtFromAccount(account) {
  if (!account) return emptyDistrict
  return { address: '-', districtName: account.driverProfile?.district?.name || '', city: account.driverProfile?.district?.city || '', province: account.driverProfile?.district?.province || '', provinceCode: account.driverProfile?.district?.provinceCode || '', cityCode: account.driverProfile?.district?.cityCode || '', districtCode: account.driverProfile?.district?.districtCode || '', latitude: '', longitude: '' }
}

function AdminUserFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const cachedAccount = (getCachedAdminUsers() || []).find((item) => item.id === id)
  const [accounts, setAccounts] = useState(() => getCachedAdminUsers() || [])
  const [form, setForm] = useState(() => formFromAccount(cachedAccount))
  const [district, setDistrict] = useState(() => districtFromAccount(cachedAccount))
  const [feedback, setFeedback] = useState('')
  const account = useMemo(() => accounts.find((item) => item.id === id), [accounts, id])

  useEffect(() => {
    if (!account) {
      loadAdminUsers().then((response) => {
        const nextAccounts = response.data.accounts || response.data.users || []
        const nextAccount = nextAccounts.find((item) => item.id === id)
        setAccounts(nextAccounts)
        setForm(formFromAccount(nextAccount))
        setDistrict(districtFromAccount(nextAccount))
      }).catch((error) => setFeedback(error.message))
    }
  }, [account, id])

  const getDriverPayload = () => ({
    vehiclePlate: form.vehiclePlate,
    vehicleType: form.vehicleType,
    district: { districtName: district.districtName, city: district.city, province: district.province, provinceCode: district.provinceCode, cityCode: district.cityCode, districtCode: district.districtCode },
    districtName: district.districtName,
    city: district.city,
    province: district.province,
    provinceCode: district.provinceCode,
    cityCode: district.cityCode,
    districtCode: district.districtCode,
  })

  const submit = async () => {
    const confirmed = await sweetConfirm({ title: isEdit ? 'Simpan perubahan akun?' : 'Buat akun baru?', text: isEdit ? 'Data akun akan diperbarui.' : 'Akun baru akan dibuat.', confirmText: isEdit ? 'Simpan' : 'Buat' })
    if (!confirmed) return

    let closeLoading = null

    try {
      closeLoading = sweetLoading({ title: isEdit ? 'Mengupdate akun...' : 'Membuat akun...', text: 'Mohon tunggu sampai proses selesai.' })
      const driverPayload = form.role === 'DRIVER' ? getDriverPayload() : {}
      if (isEdit) await updateAdminAccount(id, { name: form.name, email: form.email, role: form.role, isActive: form.isActive, ...driverPayload })
      else await createAdminAccount({ name: form.name, email: form.email, password: form.password, role: form.role, ...driverPayload })
      closeLoading?.()
      await sweetSuccess({ text: isEdit ? 'Data berhasil diupdate.' : 'Akun berhasil dibuat.' })
      navigate('/admin/users')
    } catch (error) {
      closeLoading?.()
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">{isEdit ? 'Edit pengguna' : 'Tambah pengguna'}</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{isEdit ? 'Edit akun.' : 'Akun baru.'}</h1>
        <div className="mt-8 rounded-[1.5rem] border border-leaf-900/10 bg-[#f5f1df] p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <input className={inputClass} placeholder="Nama" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            {!isEdit ? <input className={inputClass} placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /> : null}
            <select className={inputClass} value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>{['USER', 'DRIVER', 'ADMIN'].map((role) => <option key={role} value={role}>{role}</option>)}</select>
            {isEdit ? <label className="flex items-center gap-3 rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 text-sm font-black text-moss"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} /> Akun aktif</label> : null}
          </div>
          {form.role === 'DRIVER' ? <div className="mt-4 rounded-[1.4rem] border border-leaf-900/10 bg-[#edf5e4] p-4"><div className="grid gap-4 lg:grid-cols-2"><input className={inputClass} placeholder="Plat kendaraan" value={form.vehiclePlate} onChange={(event) => setForm((current) => ({ ...current, vehiclePlate: event.target.value }))} /><input className={inputClass} placeholder="Tipe kendaraan" value={form.vehicleType} onChange={(event) => setForm((current) => ({ ...current, vehicleType: event.target.value }))} /></div><div className="mt-4 rounded-[1.2rem] bg-[#fffdf4] p-4"><AddressForm value={district} onChange={setDistrict} title="Wilayah kerja" heading="Wilayah driver" description="Pilih wilayah kerja driver." /></div></div> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-[#edf5e4] px-6 py-3 text-sm font-black text-leaf-900 shadow-lg shadow-leaf-950/10 transition hover:bg-[#e2edd8]" type="button" onClick={submit}>{isEdit ? 'Simpan perubahan' : 'Buat akun'}</button>
            <Link className="rounded-full border border-leaf-900/10 bg-[#fffdf4] px-6 py-3 text-sm font-black text-moss" to="/admin/users">Batal</Link>
          </div>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#edf5e4] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
        </div>
      </section>
    </div>
  )
}

export default AdminUserFormPage
