import { useEffect, useMemo, useState } from 'react'
import AppCard from '../../components/AppCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminAccount, getAdminUsers, updateAdminAccount } from '../../services/adminApi.js'

const emptyForm = { id: '', name: '', email: '', password: 'password123', role: 'USER', isActive: true }

function AdminUsersPage() {
  const [accounts, setAccounts] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [form, setForm] = useState(emptyForm)
  const [feedback, setFeedback] = useState('')
  const filteredAccounts = useMemo(() => filter === 'ALL' ? accounts : accounts.filter((account) => account.role === filter), [accounts, filter])

  const loadAccounts = () => getAdminUsers().then((response) => setAccounts(response.data.accounts || response.data.users || [])).catch((error) => setFeedback(error.message))

  useEffect(() => {
    loadAccounts()
  }, [])

  const editAccount = (account) => {
    setForm({ id: account.id, name: account.name, email: account.email, password: '', role: account.role, isActive: account.isActive })
    setFeedback('Mode edit akun aktif.')
  }

  const resetForm = () => {
    setForm(emptyForm)
    setFeedback('')
  }

  const submit = async () => {
    try {
      if (form.id) {
        await updateAdminAccount(form.id, { name: form.name, email: form.email, isActive: form.isActive })
        setFeedback('Akun berhasil diperbarui.')
      } else {
        await createAdminAccount({ name: form.name, email: form.email, password: form.password, role: form.role })
        setFeedback('Akun berhasil dibuat.')
      }
      resetForm()
      loadAccounts()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const toggleActive = async (account) => {
    try {
      await updateAdminAccount(account.id, { isActive: !account.isActive })
      loadAccounts()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <AppCard tone="green">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Admin akun</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900">{form.id ? 'Edit akun.' : 'Buat akun.'}</h1>
          <div className="mt-6 grid gap-4">
            <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Nama" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            {!form.id ? <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /> : null}
            {!form.id ? (
              <select className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
                {['USER', 'ADMIN'].map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            ) : (
              <label className="flex items-center gap-3 rounded-2xl bg-[#f8f4e6] px-4 py-3 text-sm font-black text-moss"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} /> Akun aktif</label>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white" type="button" onClick={submit}>{form.id ? 'Simpan akun' : 'Buat akun'}</button>
            {form.id ? <button className="rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss" type="button" onClick={resetForm}>Batal</button> : null}
          </div>
          {feedback ? <p className="mt-4 text-sm font-bold text-moss/70">{feedback}</p> : null}
          <p className="mt-4 text-xs font-semibold leading-5 text-moss/55">Akun driver dibuat di halaman Drivers karena membutuhkan data kendaraan dan wilayah.</p>
        </AppCard>

        <AppCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Daftar akun</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">User, driver, admin</h2>
            </div>
            <select className="rounded-full border border-moss/10 bg-[#f8f4e6] px-4 py-2 text-sm font-black text-moss" value={filter} onChange={(event) => setFilter(event.target.value)}>
              {['ALL', 'USER', 'DRIVER', 'ADMIN'].map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div className="mt-6">
            <AdminTable columns={[{ key: 'name', label: 'Nama' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status', render: (row) => row.isActive ? 'Aktif' : 'Nonaktif' }, { key: 'district', label: 'Wilayah', render: (row) => row.driverProfile?.district?.name || row.address?.district?.name || '-' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex gap-2"><button className="font-black text-leaf-700" type="button" onClick={() => editAccount(row)}>Edit</button><button className="font-black text-red-700" type="button" onClick={() => toggleActive(row)}>{row.isActive ? 'Disable' : 'Enable'}</button></div> }]} rows={filteredAccounts} emptyText="Belum ada akun." />
          </div>
        </AppCard>
      </section>
    </div>
  )
}

export default AdminUsersPage
