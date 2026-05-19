import { useEffect, useState } from 'react'
import AddressForm from '../../components/AddressForm.jsx'
import AppCard from '../../components/AppCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminDriver, getAdminDrivers, updateAdminAccount } from '../../services/adminApi.js'
import { sweetSuccess } from '../../utils/sweetAlert.js'

const emptyAddress = { address: '-', districtName: '', city: '', province: '', provinceCode: '', cityCode: '', districtCode: '', latitude: '', longitude: '' }

function AdminDriversPage() {
  const [drivers, setDrivers] = useState([])
  const [form, setForm] = useState({ id: '', name: '', email: '', password: 'password123', vehiclePlate: '', vehicleType: 'pickup', isActive: true })
  const [district, setDistrict] = useState(emptyAddress)
  const [feedback, setFeedback] = useState('')

  const loadDrivers = () => getAdminDrivers().then((response) => setDrivers(response.data.drivers)).catch(() => {})

  useEffect(() => {
    loadDrivers()
  }, [])

  const submit = async () => {
    try {
      const payload = { name: form.name, email: form.email, vehiclePlate: form.vehiclePlate, vehicleType: form.vehicleType, district: { districtName: district.districtName, city: district.city, province: district.province, provinceCode: district.provinceCode, cityCode: district.cityCode, districtCode: district.districtCode } }
      if (form.id) {
        await updateAdminAccount(form.id, { ...payload, isActive: form.isActive })
        setFeedback('Driver berhasil diperbarui.')
        await sweetSuccess({ text: 'Driver berhasil diupdate.' })
      } else {
        await createAdminDriver({ ...payload, password: form.password, districtName: district.districtName, city: district.city, province: district.province, provinceCode: district.provinceCode, cityCode: district.cityCode, districtCode: district.districtCode })
        setFeedback('Driver berhasil dibuat.')
        await sweetSuccess({ text: 'Driver berhasil dibuat.' })
      }
      setForm({ id: '', name: '', email: '', password: 'password123', vehiclePlate: '', vehicleType: 'pickup', isActive: true })
      setDistrict(emptyAddress)
      loadDrivers()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const editDriver = (row) => {
    setForm({ id: row.user.id, name: row.user.name, email: row.user.email, password: '', vehiclePlate: row.driverProfile?.vehiclePlate || '', vehicleType: row.driverProfile?.vehicleType || '', isActive: row.user.isActive })
    setDistrict({ address: '-', districtName: row.driverProfile?.district?.name || '', city: row.driverProfile?.district?.city || '', province: row.driverProfile?.district?.province || '', provinceCode: row.driverProfile?.district?.provinceCode || '', cityCode: row.driverProfile?.district?.cityCode || '', districtCode: row.driverProfile?.district?.districtCode || '', latitude: '', longitude: '' })
    setFeedback('Mode edit driver aktif.')
  }

  const toggleActive = async (row) => {
    try {
      await updateAdminAccount(row.user.id, { isActive: !row.user.isActive })
      await sweetSuccess({ text: `Driver berhasil ${row.user.isActive ? 'dinonaktifkan' : 'diaktifkan'}.` })
      loadDrivers()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AppCard tone="green">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Admin drivers</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900">{form.id ? 'Edit driver.' : 'Buat driver.'}</h1>
          <div className="mt-6 grid gap-4">
            {['name', 'email', ...(form.id ? [] : ['password']), 'vehiclePlate', 'vehicleType'].map((key) => (
              <input key={key} className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder={key} type={key === 'password' ? 'password' : 'text'} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
            ))}
            {form.id ? <label className="flex items-center gap-3 rounded-2xl bg-[#f8f4e6] px-4 py-3 text-sm font-black text-moss"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} /> Driver aktif</label> : null}
          </div>
          <div className="mt-6 rounded-[1.25rem] bg-white/55 p-4">
            <AddressForm value={district} onChange={setDistrict} title="Wilayah kerja" heading="Wilayah kerja driver" description="Pilih wilayah kerja driver dari wilayah.id." />
          </div>
          <button className="mt-6 rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white" type="button" onClick={submit}>{form.id ? 'Simpan driver' : 'Buat driver'}</button>
          {feedback ? <p className="mt-4 text-sm font-bold text-moss/70">{feedback}</p> : null}
        </AppCard>
        <AppCard>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-leaf-900">Daftar driver</h2>
          <div className="mt-6">
            <AdminTable columns={[{ key: 'name', label: 'Nama', render: (row) => row.user.name }, { key: 'email', label: 'Email', render: (row) => row.user.email }, { key: 'status', label: 'Status', render: (row) => row.user.isActive ? 'Aktif' : 'Nonaktif' }, { key: 'plate', label: 'Plat', render: (row) => row.driverProfile?.vehiclePlate || '-' }, { key: 'district', label: 'Wilayah', render: (row) => row.driverProfile?.district?.name || '-' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex gap-2"><button className="font-black text-leaf-700" type="button" onClick={() => editDriver(row)}>Edit</button><button className="font-black text-red-700" type="button" onClick={() => toggleActive(row)}>{row.user.isActive ? 'Disable' : 'Enable'}</button></div> }]} rows={drivers} emptyText="Belum ada driver." />
          </div>
        </AppCard>
      </section>
    </div>
  )
}

export default AdminDriversPage
