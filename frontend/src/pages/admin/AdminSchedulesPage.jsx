import { useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminSchedule, deleteAdminSchedule, getAdminSchedules, updateAdminSchedule } from '../../services/adminApi.js'

const emptyForm = { id: '', wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' }
const inputClass = 'rounded-2xl border border-leaf-100 bg-white px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-600 focus:ring-4 focus:ring-leaf-100'

function CategoryBadge({ category }) {
  const label = category.replaceAll('_', ' ')
  const classes = {
    ORGANIK: 'bg-leaf-50 text-leaf-800',
    ANORGANIK: 'bg-blue-50 text-blue-800',
    B3: 'bg-red-50 text-red-700',
    DAUR_ULANG_RESIDU: 'bg-[#fff1bd] text-moss',
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
      <section className="rounded-[2rem] bg-gradient-to-r from-[#fff7d8] via-white to-leaf-50 p-6 shadow-[0_18px_55px_rgba(37,70,43,0.08)] ring-1 ring-leaf-100 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Manajemen jadwal</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Atur jadwal angkut.</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-moss/62">Jadwal saat ini berlaku global untuk semua user dan wilayah. Jika nanti butuh wilayah spesifik, struktur backend sudah siap dikembangkan.</p>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-[1.75rem] border border-leaf-100 bg-white p-6 shadow-[0_18px_45px_rgba(37,70,43,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">{form.id ? 'Edit jadwal' : 'Jadwal baru'}</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{form.id ? 'Perbarui jadwal' : 'Tambah jadwal'}</h2>
          <div className="mt-6 grid gap-4">
            <select className={inputClass} value={form.wasteCategory} onChange={(event) => setForm((current) => ({ ...current, wasteCategory: event.target.value }))}>
              {['ORGANIK', 'ANORGANIK', 'B3', 'DAUR_ULANG_RESIDU'].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input className={inputClass} placeholder="Hari pickup" value={form.pickupDay} onChange={(event) => setForm((current) => ({ ...current, pickupDay: event.target.value }))} />
            <input className={inputClass} placeholder="Jam pickup, contoh 08:00" value={form.pickupTime} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} />
            <textarea className={`${inputClass} min-h-28`} placeholder="Instruksi" value={form.instruction} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-leaf-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-leaf-900/15" type="button" onClick={submit}>{form.id ? 'Simpan jadwal' : 'Buat jadwal'}</button>
            {form.id ? <button className="rounded-full border border-leaf-200 bg-white px-6 py-3 text-sm font-black text-moss" type="button" onClick={() => setForm(emptyForm)}>Batal</button> : null}
          </div>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#fff7d8] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
        </div>
        <div className="rounded-[1.75rem] border border-leaf-100 bg-white p-6 shadow-[0_18px_45px_rgba(37,70,43,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-700">Daftar jadwal</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">{schedules.length} jadwal global</h2>
            </div>
            <span className="rounded-full bg-leaf-50 px-4 py-2 text-xs font-black text-leaf-800">Semua wilayah</span>
          </div>
          <div className="mt-6">
            <AdminTable columns={[{ key: 'category', label: 'Kategori', render: (row) => <CategoryBadge category={row.wasteCategory} /> }, { key: 'day', label: 'Hari', render: (row) => <span className="font-black text-leaf-950">{row.pickupDay}</span> }, { key: 'time', label: 'Jam', render: (row) => row.pickupTime }, { key: 'district', label: 'Wilayah', render: () => 'Semua wilayah' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex flex-wrap gap-2"><button className="rounded-full bg-leaf-50 px-3 py-2 text-xs font-black text-leaf-800" type="button" onClick={() => editSchedule(row)}>Edit</button><button className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700" type="button" onClick={() => removeSchedule(row)}>Hapus</button></div> }]} rows={schedules} emptyText="Belum ada jadwal." />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminSchedulesPage
