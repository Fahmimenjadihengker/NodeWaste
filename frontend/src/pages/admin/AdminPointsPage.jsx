import { useEffect, useMemo, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { addAdminUserPoints, getCachedAdminUsers, loadAdminUsers, subtractAdminUserPoints } from '../../services/adminApi.js'
import { sweetConfirm, sweetLoading, sweetSuccess } from '../../utils/sweetAlert.js'

function AdminPointsPage() {
  const [accounts, setAccounts] = useState(() => (getCachedAdminUsers() || []).filter((account) => account.role === 'USER'))
  const [amounts, setAmounts] = useState({})
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(!getCachedAdminUsers())

  const filteredAccounts = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return accounts.filter((account) => !keyword || [account.name, account.email].filter(Boolean).some((value) => value.toLowerCase().includes(keyword)))
  }, [accounts, query])

  const loadAccounts = () => loadAdminUsers()
    .then((response) => setAccounts((response.data.accounts || response.data.users || []).filter((account) => account.role === 'USER')))
    .catch((error) => setFeedback(error.message))
    .finally(() => setIsLoading(false))

  useEffect(() => {
    loadAccounts()
  }, [])

  const getAmount = (accountId) => Number(amounts[accountId] || 0)

  const adjustPoints = async (account, direction) => {
    const amount = getAmount(account.id)
    if (!Number.isInteger(amount) || amount <= 0) {
      setFeedback('Jumlah poin harus berupa angka positif.')
      return
    }

    const actionLabel = direction === 'add' ? 'menambahkan' : 'mengurangi'
    const confirmed = await sweetConfirm({ title: `${direction === 'add' ? 'Tambah' : 'Kurangi'} poin?`, text: `Yakin ingin ${actionLabel} ${amount} EcoPoints untuk ${account.name}?`, confirmText: direction === 'add' ? 'Tambah' : 'Kurangi', danger: direction === 'subtract' })
    if (!confirmed) return

    let closeLoading = null

    try {
      closeLoading = sweetLoading({ title: 'Mengupdate poin...', text: 'EcoPoints user sedang diproses.' })
      if (direction === 'add') await addAdminUserPoints(account.id, amount)
      else await subtractAdminUserPoints(account.id, amount)
      setAmounts((current) => ({ ...current, [account.id]: '' }))
      setFeedback(`EcoPoints ${account.name} berhasil diupdate.`)
      closeLoading?.()
      await sweetSuccess({ text: 'EcoPoints user berhasil diupdate.' })
      setIsLoading(true)
      loadAccounts()
    } catch (error) {
      closeLoading?.()
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Manajemen poin</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Atur EcoPoints user.</h1>
          </div>
          <input className="w-full rounded-full border border-leaf-900/10 bg-[#f5f1df] px-4 py-2 text-sm font-bold text-moss outline-none focus:border-leaf-700 sm:w-72" placeholder="Cari user..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>

        <div className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Daftar user</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{filteredAccounts.length} user</h2>
          </div>
          {feedback ? <p className="mb-4 rounded-2xl bg-[#f5f1df] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
          <AdminTable
            isLoading={isLoading}
            columns={[
              { key: 'name', label: 'User', render: (row) => <div><p className="font-black text-leaf-950">{row.name}</p><p className="text-xs text-moss/50">{row.email}</p></div> },
              { key: 'points', label: 'EcoPoints', render: (row) => row.ecoPoints },
              { key: 'amount', label: 'Jumlah', render: (row) => <input className="w-28 rounded-full border border-leaf-900/10 bg-[#fffdf4] px-4 py-2 text-sm font-black text-moss outline-none focus:border-leaf-700" min="1" placeholder="0" type="number" value={amounts[row.id] || ''} onChange={(event) => setAmounts((current) => ({ ...current, [row.id]: event.target.value }))} /> },
              { key: 'actions', label: 'Aksi', render: (row) => <div className="flex flex-wrap gap-2"><button className="rounded-full bg-[#edf5e4] px-3 py-2 text-xs font-black text-leaf-900" type="button" onClick={() => adjustPoints(row, 'add')}>Tambah</button><button className="rounded-full bg-[#f5f1df] px-3 py-2 text-xs font-black text-moss" type="button" onClick={() => adjustPoints(row, 'subtract')}>Kurangi</button></div> },
            ]}
            rows={filteredAccounts}
            emptyText="Belum ada user."
          />
        </div>
      </section>
    </div>
  )
}

export default AdminPointsPage
