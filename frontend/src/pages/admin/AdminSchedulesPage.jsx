import { useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminSchedule, deleteAdminSchedule, getAdminSchedules, updateAdminSchedule } from '../../services/adminApi.js'

const emptyForm = { id: '', wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' }
const inputClass = 'rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-700 focus:ring-4 focus:ring-leaf-900/10'

function CategoryBadge({ category }) {
  const label = category.replaceAll('_', ' ')
  const classes = {
    ORGANIK: 'bg-[#edf5e4] text-leaf-900',
    ANORGANIK: 'bg-[#f5f1df] text-moss',
    B3: 'bg-leaf-800 text-cream',
    DAUR_ULANG_RESIDU: 'bg-[#fffdf4] text-leaf-950 ring-1 ring-leaf-900/10',
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${classes[category] || classes.ORGANIK}`}>{label}</span>
}

function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [feedback, setFeedback] = useState('')

  const loadSchedules = () => getAdminSchedules().then((response) => setSchedules(response.data.schedules)).catch(() => {})

  useEffect(() => {
    loadSchedules()
  }, [])

  const submit = async () => {
    try {
      if (form.id) {
        await updateAdminSchedule(form.id, { wasteCategory: form.wasteCategory, pickupDay: form.pickupDay, pickupTime: form.pickupTime, instruction: form.instruction })
        setFeedback('Jadwal berhasil diperbarui.')
      } else {
        await createAdminSchedule({ wasteCategory: form.wasteCategory, pickupDay: form.pickupDay, pickupTime: form.pickupTime, instruction: form.instruction })
        setFeedback('Jadwal berhasil dibuat.')
      }
      setForm(emptyForm)
      loadSchedules()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const editSchedule = (schedule) => {
    setForm({ id: schedule.id, wasteCategory: schedule.wasteCategory, pickupDay: schedule.pickupDay, pickupTime: schedule.pickupTime, instruction: schedule.instruction || '' })
    setFeedback('Mode edit jadwal aktif.')
  }

  const removeSchedule = async (schedule) => {
    try {
      await deleteAdminSchedule(schedule.id)
      setFeedback('Jadwal berhasil dihapus.')
      loadSchedules()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#fffdf4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Manajemen jadwal</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Atur jadwal angkut.</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-moss/62">Jadwal saat ini berlaku global untuk semua user dan wilayah.</p>
          </div>
          <span className="w-fit rounded-full bg-[#edf5e4] px-4 py-2 text-xs font-black text-leaf-900">{schedules.length} jadwal global</span>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-leaf-900/10 bg-[#f5f1df] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-800/60">{form.id ? 'Edit jadwal' : 'Jadwal baru'}</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-leaf-950">{form.id ? 'Perbarui jadwal' : 'Tambah jadwal'}</h2>
            </div>
            {form.id ? <button className="rounded-full border border-leaf-900/10 bg-[#fffdf4] px-5 py-2 text-sm font-black text-moss" type="button" onClick={() => setForm(emptyForm)}>Batal edit</button> : null}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
            <select className={inputClass} value={form.wasteCategory} onChange={(event) => setForm((current) => ({ ...current, wasteCategory: event.target.value }))}>
              {['ORGANIK', 'ANORGANIK', 'B3', 'DAUR_ULANG_RESIDU'].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input className={inputClass} placeholder="Hari pickup" value={form.pickupDay} onChange={(event) => setForm((current) => ({ ...current, pickupDay: event.target.value }))} />
            <input className={inputClass} placeholder="Jam pickup, contoh 08:00" value={form.pickupTime} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} />
            <input className={inputClass} placeholder="Instruksi" value={form.instruction} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-leaf-800 px-6 py-3 text-sm font-black text-cream shadow-lg shadow-leaf-950/15 transition hover:bg-moss" type="button" onClick={submit}>{form.id ? 'Simpan jadwal' : 'Buat jadwal'}</button>
          </div>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#edf5e4] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
        </div>

        <div className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Daftar jadwal</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{schedules.length} jadwal global</h2>
            </div>
            <span className="rounded-full bg-[#edf5e4] px-4 py-2 text-xs font-black text-leaf-900">Semua wilayah</span>
          </div>
          <div>
            <AdminTable columns={[{ key: 'category', label: 'Kategori', render: (row) => <CategoryBadge category={row.wasteCategory} /> }, { key: 'day', label: 'Hari', render: (row) => <span className="font-black text-leaf-950">{row.pickupDay}</span> }, { key: 'time', label: 'Jam', render: (row) => row.pickupTime }, { key: 'district', label: 'Wilayah', render: () => 'Semua wilayah' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex flex-wrap gap-2"><button className="rounded-full bg-[#edf5e4] px-3 py-2 text-xs font-black text-leaf-900" type="button" onClick={() => editSchedule(row)}>Edit</button><button className="rounded-full bg-[#f5f1df] px-3 py-2 text-xs font-black text-moss" type="button" onClick={() => removeSchedule(row)}>Hapus</button></div> }]} rows={schedules} emptyText="Belum ada jadwal." />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminSchedulesPage
