import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createAdminSchedule, getCachedAdminSchedules, loadAdminSchedules, updateAdminSchedule } from '../../services/adminApi.js'
import { sweetConfirm, sweetLoading, sweetSuccess } from '../../utils/sweetAlert.js'

const inputClass = 'rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 font-semibold text-moss outline-none transition focus:border-leaf-700 focus:ring-4 focus:ring-leaf-900/10'
const emptyForm = { wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' }
const categoryLabel = { ORGANIK: 'Organik', ANORGANIK: 'Anorganik', B3: 'B3' }

function formFromSchedule(schedule) {
  if (!schedule) return emptyForm
  return { wasteCategory: schedule.wasteCategory, pickupDay: schedule.pickupDay, pickupTime: schedule.pickupTime, instruction: schedule.instruction || '' }
}

function AdminScheduleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const cachedSchedule = (getCachedAdminSchedules() || []).find((item) => item.id === id)
  const [schedules, setSchedules] = useState(() => getCachedAdminSchedules() || [])
  const [form, setForm] = useState(() => formFromSchedule(cachedSchedule))
  const [feedback, setFeedback] = useState('')
  const schedule = useMemo(() => schedules.find((item) => item.id === id), [schedules, id])

  useEffect(() => {
    if (!isEdit || schedule) return

    loadAdminSchedules().then((response) => {
      const nextSchedules = response.data.schedules || []
      const nextSchedule = nextSchedules.find((item) => item.id === id)
      setSchedules(nextSchedules)
      setForm(formFromSchedule(nextSchedule))
    }).catch((error) => setFeedback(error.message))
  }, [id, isEdit, schedule])

  const submit = async () => {
    const confirmed = await sweetConfirm({ title: isEdit ? 'Simpan perubahan jadwal?' : 'Buat jadwal?', text: isEdit ? 'Data jadwal akan diperbarui.' : 'Jadwal pickup baru akan ditambahkan.', confirmText: isEdit ? 'Simpan' : 'Buat' })
    if (!confirmed) return

    let closeLoading = null

    try {
      closeLoading = sweetLoading({ title: isEdit ? 'Mengupdate jadwal...' : 'Membuat jadwal...', text: 'Mohon tunggu sampai proses selesai.' })
      if (isEdit) await updateAdminSchedule(id, form)
      else await createAdminSchedule(form)
      closeLoading?.()
      await sweetSuccess({ text: isEdit ? 'Jadwal berhasil diupdate.' : 'Jadwal berhasil dibuat.' })
      navigate('/admin/schedules')
    } catch (error) {
      closeLoading?.()
      setFeedback(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <section className="rounded-[2rem] border border-leaf-900/10 bg-[#edf5e4] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">{isEdit ? 'Edit jadwal' : 'Tambah jadwal'}</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">{isEdit ? 'Perbarui jadwal.' : 'Jadwal baru.'}</h1>
        <div className="mt-8 rounded-[1.5rem] border border-leaf-900/10 bg-[#f5f1df] p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
            <div className="rounded-2xl border border-leaf-900/10 bg-[#fffdf4] px-4 py-3 font-black text-moss">{categoryLabel[form.wasteCategory] || form.wasteCategory}</div>
            <input className={inputClass} placeholder="Hari pickup" value={form.pickupDay} onChange={(event) => setForm((current) => ({ ...current, pickupDay: event.target.value }))} />
            <input className={inputClass} placeholder="Jam pickup, contoh 08:00" value={form.pickupTime} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} />
            <input className={inputClass} placeholder="Instruksi" value={form.instruction} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-[#edf5e4] px-6 py-3 text-sm font-black text-leaf-900 shadow-lg shadow-leaf-950/10 transition hover:bg-[#e2edd8]" type="button" onClick={submit}>{isEdit ? 'Simpan perubahan' : 'Buat jadwal'}</button>
            <Link className="rounded-full border border-leaf-900/10 bg-[#fffdf4] px-6 py-3 text-sm font-black text-moss" to="/admin/schedules">Batal</Link>
          </div>
          {feedback ? <p className="mt-4 rounded-2xl bg-[#edf5e4] px-4 py-3 text-sm font-bold text-moss/75">{feedback}</p> : null}
        </div>
      </section>
    </div>
  )
}

export default AdminScheduleFormPage
