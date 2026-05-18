import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { deleteAdminAccount, getCachedAdminUsers, loadAdminUsers, updateAdminAccount } from '../../services/adminApi.js'

function AdminUsersPage() {
  const [accounts, setAccounts] = useState(() => getCachedAdminUsers() || [])
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(!getCachedAdminUsers())

  const filteredAccounts = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return accounts.filter((account) => {
      const roleMatch = filter === 'ALL' || account.role === filter
      const textMatch = !keyword || [account.name, account.email, account.role].filter(Boolean).some((value) => value.toLowerCase().includes(keyword))
      return roleMatch && textMatch
    })
  }, [accounts, filter, query])

  const loadAccounts = () => loadAdminUsers()
    .then((response) => setAccounts(response.data.accounts || response.data.users || []))
    .catch((error) => setFeedback(error.message))
    .finally(() => setIsLoading(false))

  useEffect(() => {
    loadAccounts()
  }, [])

  const toggleActive = async (account) => {
    const action = account.isActive ? 'menonaktifkan' : 'mengaktifkan'
    if (!window.confirm(`Yakin ingin ${action} akun ${account.name}?`)) return

    try {
      await updateAdminAccount(account.id, { isActive: !account.isActive })
      setFeedback(`Akun berhasil ${account.isActive ? 'dinonaktifkan' : 'diaktifkan'}.`)
      setIsLoading(true)
      loadAccounts()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const removeAccount = async (account) => {
    if (!window.confirm(`Hapus permanen akun ${account.name}? Aksi ini tidak bisa dibatalkan.`)) return

    try {
      await deleteAdminAccount(account.id)
      setFeedback('Akun berhasil dihapus permanen.')
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
          </div>
          <Link className="w-fit rounded-full bg-[#f5f1df] px-6 py-3 text-sm font-black text-leaf-900 shadow-lg shadow-leaf-950/10 transition hover:bg-[#fffdf4]" to="/admin/users/new">Tambah akun</Link>
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
          {feedback ? <p className="mb-4 rounded-2xl bg-[#f5f1df] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
          <AdminTable isLoading={isLoading} columns={[{ key: 'name', label: 'Nama', render: (row) => <div><p className="font-black text-leaf-950">{row.name}</p><p className="text-xs text-moss/50">{row.email}</p></div> }, { key: 'role', label: 'Role', render: (row) => row.role }, { key: 'status', label: 'Status', render: (row) => row.isActive ? 'Aktif' : 'Nonaktif' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex flex-wrap gap-2"><Link className="rounded-full bg-[#edf5e4] px-3 py-2 text-xs font-black text-leaf-900" to={`/admin/users/${row.id}/edit`}>Edit</Link><button className="rounded-full bg-[#f5f1df] px-3 py-2 text-xs font-black text-moss" type="button" onClick={() => toggleActive(row)}>{row.isActive ? 'Disable' : 'Enable'}</button><button className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700" type="button" onClick={() => removeAccount(row)}>Delete</button></div> }]} rows={filteredAccounts} emptyText="Belum ada akun." />
        </div>
      </section>
    </div>
  )
}

export default AdminUsersPage
