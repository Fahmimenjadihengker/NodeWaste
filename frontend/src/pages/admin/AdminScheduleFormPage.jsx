import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAdminSchedule } from '../../services/adminApi.js'
import { sweetConfirm } from '../../utils/sweetAlert.js'

const inputClass = 'rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-700 focus:ring-4 focus:ring-leaf-900/10'

function AdminScheduleFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' })
  const [feedback, setFeedback] = useState('')

  const submit = async () => {
    const confirmed = await sweetConfirm({ title: 'Buat jadwal?', text: 'Jadwal pickup baru akan ditambahkan.', confirmText: 'Buat' })
    if (!confirmed) return

    try {
      await createAdminSchedule(form)
      navigate('/admin/schedules')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Tambah jadwal</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Jadwal baru.</h1>
        <div className="mt-8 rounded-[1.5rem] border border-leaf-900/10 bg-[#f5f1df] p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
            <select className={inputClass} value={form.wasteCategory} onChange={(event) => setForm((current) => ({ ...current, wasteCategory: event.target.value }))}>{['ORGANIK', 'ANORGANIK', 'B3', 'DAUR_ULANG_RESIDU'].map((category) => <option key={category} value={category}>{category}</option>)}</select>
            <input className={inputClass} placeholder="Hari pickup" value={form.pickupDay} onChange={(event) => setForm((current) => ({ ...current, pickupDay: event.target.value }))} />
            <input className={inputClass} placeholder="Jam pickup, contoh 08:00" value={form.pickupTime} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} />
            <input className={inputClass} placeholder="Instruksi" value={form.instruction} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-[#edf5e4] px-6 py-3 text-sm font-black text-leaf-900 shadow-lg shadow-leaf-950/10 transition hover:bg-[#e2edd8]" type="button" onClick={submit}>Buat jadwal</button>
            <Link className="rounded-full border border-leaf-900/10 bg-[#fffdf4] px-6 py-3 text-sm font-black text-moss" to="/admin/schedules">Batal</Link>
          </div>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#edf5e4] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
        </div>
      </section>
    </div>
  )
}

export default AdminScheduleFormPage
