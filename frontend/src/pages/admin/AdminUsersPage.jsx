import { useEffect, useMemo, useState } from 'react'
import AddressForm from '../../components/AddressForm.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminAccount, getCachedAdminUsers, loadAdminUsers, updateAdminAccount } from '../../services/adminApi.js'

const emptyForm = { id: '', name: '', email: '', password: 'password123', role: 'USER', vehiclePlate: '', vehicleType: 'pickup', isActive: true }
const emptyDistrict = { address: '-', districtName: '', city: '', province: '', provinceCode: '', cityCode: '', districtCode: '', latitude: '', longitude: '' }
const inputClass = 'rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-700 focus:ring-4 focus:ring-leaf-900/10'

function RoleBadge({ role }) {
  const classes = {
    USER: 'bg-[#edf5e4] text-leaf-900',
    DRIVER: 'bg-leaf-800 text-cream',
    ADMIN: 'bg-[#f5f1df] text-moss',
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${classes[role] || classes.USER}`}>{role}</span>
}

function StatusBadge({ active }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? 'bg-[#edf5e4] text-leaf-900' : 'bg-[#f5f1df] text-moss/65'}`}>{active ? 'Aktif' : 'Nonaktif'}</span>
}

function AdminUsersPage() {
  const [accounts, setAccounts] = useState(() => getCachedAdminUsers() || [])
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [district, setDistrict] = useState(emptyDistrict)
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(!getCachedAdminUsers())
  const filteredAccounts = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return accounts.filter((account) => {
      const roleMatch = filter === 'ALL' || account.role === filter
      const textMatch = !keyword || [account.name, account.email, account.role, account.driverProfile?.vehiclePlate, account.driverProfile?.district?.name, account.address?.district?.name].filter(Boolean).some((value) => value.toLowerCase().includes(keyword))
      return roleMatch && textMatch
    })
  }, [accounts, filter, query])

  const loadAccounts = () => {
    return loadAdminUsers()
      .then((response) => setAccounts(response.data.accounts || response.data.users || []))
      .catch((error) => setFeedback(error.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const editAccount = (account) => {
    setForm({ id: account.id, name: account.name, email: account.email, password: '', role: account.role, vehiclePlate: account.driverProfile?.vehiclePlate || '', vehicleType: account.driverProfile?.vehicleType || '', isActive: account.isActive })
    setDistrict({ address: '-', districtName: account.driverProfile?.district?.name || '', city: account.driverProfile?.district?.city || '', province: account.driverProfile?.district?.province || '', provinceCode: account.driverProfile?.district?.provinceCode || '', cityCode: account.driverProfile?.district?.cityCode || '', districtCode: account.driverProfile?.district?.districtCode || '', latitude: '', longitude: '' })
    setFeedback('Mode edit akun aktif.')
  }

  const resetForm = () => {
    setForm(emptyForm)
    setDistrict(emptyDistrict)
    setFeedback('')
  }

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
    try {
      if (form.id) {
        const driverPayload = form.role === 'DRIVER' ? getDriverPayload() : {}
        await updateAdminAccount(form.id, { name: form.name, email: form.email, isActive: form.isActive, ...driverPayload })
        setFeedback('Akun berhasil diperbarui.')
      } else {
        const driverPayload = form.role === 'DRIVER' ? getDriverPayload() : {}
        await createAdminAccount({ name: form.name, email: form.email, password: form.password, role: form.role, ...driverPayload })
        setFeedback('Akun berhasil dibuat.')
      }
      setForm(emptyForm)
      setDistrict(emptyDistrict)
      setIsLoading(true)
      loadAccounts()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const toggleActive = async (account) => {
    try {
      await updateAdminAccount(account.id, { isActive: !account.isActive })
      setIsLoading(true)
      loadAccounts()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Manajemen pengguna</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Kelola semua akun.</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-moss/62">Admin dapat membuat dan mengubah akun USER, DRIVER, dan ADMIN dari halaman ini. Driver tetap membutuhkan data kendaraan dan wilayah kerja.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] bg-[#f5f1df] p-2 text-center">
            {['USER', 'DRIVER', 'ADMIN'].map((role) => <button key={role} className={`rounded-2xl px-4 py-3 text-xs font-black ${filter === role ? 'bg-[#fffdf4] text-leaf-900 shadow-sm' : 'text-leaf-900'}`} type="button" onClick={() => setFilter(role)}>{role}</button>)}
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-leaf-900/10 bg-[#f5f1df] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-800/60">{form.id ? 'Edit akun' : 'Tambah akun'}</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-leaf-950">{form.id ? form.name || 'Akun dipilih' : 'Akun baru'}</h2>
            </div>
            {form.id ? <button className="rounded-full border border-leaf-900/10 bg-[#fffdf4] px-5 py-2 text-sm font-black text-moss" type="button" onClick={resetForm}>Batal edit</button> : null}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            <input className={inputClass} placeholder="Nama" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            {!form.id ? <input className={inputClass} placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /> : null}
            {!form.id ? (
              <select className={inputClass} value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
                {['USER', 'DRIVER', 'ADMIN'].map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            ) : (
              <label className="flex items-center gap-3 rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 text-sm font-black text-moss"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} /> Akun aktif</label>
            )}
          </div>
          {form.role === 'DRIVER' ? (
            <div className="mt-4 rounded-[1.4rem] border border-leaf-900/10 bg-[#edf5e4] p-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <input className={inputClass} placeholder="Plat kendaraan" value={form.vehiclePlate} onChange={(event) => setForm((current) => ({ ...current, vehiclePlate: event.target.value }))} />
                <input className={inputClass} placeholder="Tipe kendaraan" value={form.vehicleType} onChange={(event) => setForm((current) => ({ ...current, vehicleType: event.target.value }))} />
              </div>
              <div className="mt-4 rounded-[1.2rem] bg-[#fffdf4] p-4">
                <AddressForm value={district} onChange={setDistrict} title="Wilayah kerja" heading="Wilayah driver" description="Pilih wilayah kerja driver. Latitude dan longitude tidak digunakan untuk akun driver." />
              </div>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-[#edf5e4] px-6 py-3 text-sm font-black text-leaf-900 shadow-lg shadow-leaf-950/10 transition hover:bg-[#e2edd8]" type="button" onClick={submit}>{form.id ? 'Simpan perubahan' : 'Buat akun'}</button>
          </div>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#edf5e4] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
        </div>

        <div className="mt-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Daftar akun</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{filteredAccounts.length} akun</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input className="rounded-full border border-leaf-900/10 bg-[#f5f1df] px-4 py-2 text-sm font-bold text-moss outline-none focus:border-leaf-700" placeholder="Cari akun..." value={query} onChange={(event) => setQuery(event.target.value)} />
              <select className="rounded-full border border-leaf-900/10 bg-[#f5f1df] px-4 py-2 text-sm font-black text-moss" value={filter} onChange={(event) => setFilter(event.target.value)}>
                {['ALL', 'USER', 'DRIVER', 'ADMIN'].map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>
          <div>
            <AdminTable isLoading={isLoading} columns={[{ key: 'name', label: 'Nama', render: (row) => <div><p className="font-black text-leaf-950">{row.name}</p><p className="text-xs text-moss/50">{row.email}</p></div> }, { key: 'role', label: 'Role', render: (row) => <RoleBadge role={row.role} /> }, { key: 'status', label: 'Status', render: (row) => <StatusBadge active={row.isActive} /> }, { key: 'district', label: 'Wilayah', render: (row) => row.driverProfile?.district?.name || row.address?.district?.name || '-' }, { key: 'plate', label: 'Kendaraan', render: (row) => row.driverProfile?.vehiclePlate || '-' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex flex-wrap gap-2"><button className="rounded-full bg-[#edf5e4] px-3 py-2 text-xs font-black text-leaf-900" type="button" onClick={() => editAccount(row)}>Edit</button><button className="rounded-full bg-[#f5f1df] px-3 py-2 text-xs font-black text-moss" type="button" onClick={() => toggleActive(row)}>{row.isActive ? 'Disable' : 'Enable'}</button></div> }]} rows={filteredAccounts} emptyText="Belum ada akun." />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminUsersPage
