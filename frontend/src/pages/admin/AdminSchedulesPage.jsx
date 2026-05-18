import { useEffect, useState } from 'react'
import AppCard from '../../components/AppCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminSchedule, deleteAdminSchedule, getAdminSchedules, updateAdminSchedule } from '../../services/adminApi.js'

const emptyForm = { id: '', wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' }

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
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AppCard tone="yellow">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Admin jadwal</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900">{form.id ? 'Edit jadwal.' : 'Buat jadwal.'}</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-moss/65">Jadwal dibuat global untuk semua wilayah/user untuk saat ini.</p>
          <div className="mt-6 grid gap-4">
            <select className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" value={form.wasteCategory} onChange={(event) => setForm((current) => ({ ...current, wasteCategory: event.target.value }))}>
              {['ORGANIK', 'ANORGANIK', 'B3', 'DAUR_ULANG_RESIDU'].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Hari pickup" value={form.pickupDay} onChange={(event) => setForm((current) => ({ ...current, pickupDay: event.target.value }))} />
            <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Jam pickup" value={form.pickupTime} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} />
            <textarea className="min-h-24 rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Instruksi" value={form.instruction} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} />
          </div>
          <button className="mt-6 rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white" type="button" onClick={submit}>{form.id ? 'Simpan jadwal' : 'Buat jadwal'}</button>
          {form.id ? <button className="ml-3 mt-6 rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss" type="button" onClick={() => setForm(emptyForm)}>Batal</button> : null}
          {feedback ? <p className="mt-4 text-sm font-bold text-moss/70">{feedback}</p> : null}
        </AppCard>
        <AppCard>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-leaf-900">Daftar jadwal</h2>
          <div className="mt-6">
            <AdminTable columns={[{ key: 'category', label: 'Kategori', render: (row) => row.wasteCategory }, { key: 'day', label: 'Hari', render: (row) => row.pickupDay }, { key: 'time', label: 'Jam', render: (row) => row.pickupTime }, { key: 'district', label: 'Wilayah', render: () => 'Semua wilayah' }, { key: 'actions', label: 'Aksi', render: (row) => <div className="flex gap-2"><button className="font-black text-leaf-700" type="button" onClick={() => editSchedule(row)}>Edit</button><button className="font-black text-red-700" type="button" onClick={() => removeSchedule(row)}>Hapus</button></div> }]} rows={schedules} emptyText="Belum ada jadwal." />
          </div>
        </AppCard>
      </section>
    </div>
  )
}

export default AdminSchedulesPage
