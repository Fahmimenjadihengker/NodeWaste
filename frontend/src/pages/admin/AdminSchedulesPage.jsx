import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { deleteAdminSchedule, getCachedAdminSchedules, loadAdminSchedules } from '../../services/adminApi.js'
import { sweetConfirm } from '../../utils/sweetAlert.js'

function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState(() => getCachedAdminSchedules() || [])
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(!getCachedAdminSchedules())

  const loadSchedules = () => loadAdminSchedules()
    .then((response) => setSchedules(response.data.schedules))
    .catch((error) => setFeedback(error.message))
    .finally(() => setIsLoading(false))

  useEffect(() => {
    loadSchedules()
  }, [])

  const removeSchedule = async (schedule) => {
    const confirmed = await sweetConfirm({ title: 'Hapus jadwal?', text: `Hapus jadwal ${schedule.wasteCategory} hari ${schedule.pickupDay}?`, confirmText: 'Hapus', danger: true })
    if (!confirmed) return

    try {
      await deleteAdminSchedule(schedule.id)
      setFeedback('Jadwal berhasil dihapus.')
      setIsLoading(true)
      loadSchedules()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Manajemen jadwal</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Atur jadwal angkut.</h1>
          </div>
          <Link className="w-fit rounded-full bg-[#f5f1df] px-6 py-3 text-sm font-black text-leaf-900 shadow-lg shadow-leaf-950/10 transition hover:bg-[#fffdf4]" to="/admin/schedules/new">Tambah jadwal</Link>
        </div>

        <div className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Daftar jadwal</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{schedules.length} jadwal global</h2>
          </div>
          {feedback ? <p className="mb-4 rounded-2xl bg-[#f5f1df] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
          <AdminTable isLoading={isLoading} columns={[{ key: 'category', label: 'Kategori', render: (row) => row.wasteCategory.replaceAll('_', ' ') }, { key: 'day', label: 'Hari', render: (row) => row.pickupDay }, { key: 'time', label: 'Jam', render: (row) => row.pickupTime }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex flex-wrap gap-2"><button className="rounded-full bg-[#f5f1df] px-3 py-2 text-xs font-black text-moss" type="button" onClick={() => removeSchedule(row)}>Hapus</button></div> }]} rows={schedules} emptyText="Belum ada jadwal." />
        </div>
      </section>
    </div>
  )
}

export default AdminSchedulesPage
