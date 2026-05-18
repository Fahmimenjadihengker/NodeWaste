import { useEffect, useState } from 'react'
import AddressForm from '../../components/AddressForm.jsx'
import AppCard from '../../components/AppCard.jsx'
import AdminTable from '../../components/admin/AdminTable.jsx'
import { createAdminSchedule, getAdminSchedules } from '../../services/adminApi.js'

const emptyDistrict = { address: '-', districtName: '', city: '', province: '', provinceCode: '', cityCode: '', districtCode: '', latitude: '', longitude: '' }

function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [district, setDistrict] = useState(emptyDistrict)
  const [form, setForm] = useState({ wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' })
  const [feedback, setFeedback] = useState('')

  const loadSchedules = () => getAdminSchedules().then((response) => setSchedules(response.data.schedules)).catch(() => {})

  useEffect(() => {
    loadSchedules()
  }, [])

  const submit = async () => {
    try {
      await createAdminSchedule({ ...form, district: { districtName: district.districtName, city: district.city, province: district.province, provinceCode: district.provinceCode, cityCode: district.cityCode, districtCode: district.districtCode } })
      setFeedback('Jadwal berhasil dibuat.')
      setForm({ wasteCategory: 'ORGANIK', pickupDay: '', pickupTime: '', instruction: '' })
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
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900">Buat jadwal.</h1>
          <div className="mt-6 grid gap-4">
            <select className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" value={form.wasteCategory} onChange={(event) => setForm((current) => ({ ...current, wasteCategory: event.target.value }))}>
              {['ORGANIK', 'ANORGANIK', 'B3', 'DAUR_ULANG_RESIDU'].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Hari pickup" value={form.pickupDay} onChange={(event) => setForm((current) => ({ ...current, pickupDay: event.target.value }))} />
            <input className="rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Jam pickup" value={form.pickupTime} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} />
            <textarea className="min-h-24 rounded-2xl border border-moss/10 bg-[#f8f4e6] px-4 py-3 font-semibold text-moss outline-none focus:border-leaf-600" placeholder="Instruksi" value={form.instruction} onChange={(event) => setForm((current) => ({ ...current, instruction: event.target.value }))} />
          </div>
          <div className="mt-6 rounded-[1.25rem] bg-white/55 p-4"><AddressForm value={district} onChange={setDistrict} title="Wilayah jadwal" heading="Wilayah pengambilan" description="Pilih wilayah jadwal dari wilayah.id." /></div>
          <button className="mt-6 rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white" type="button" onClick={submit}>Buat jadwal</button>
          {feedback ? <p className="mt-4 text-sm font-bold text-moss/70">{feedback}</p> : null}
        </AppCard>
        <AppCard>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-leaf-900">Daftar jadwal</h2>
          <div className="mt-6">
            <AdminTable columns={[{ key: 'category', label: 'Kategori', render: (row) => row.wasteCategory }, { key: 'day', label: 'Hari', render: (row) => row.pickupDay }, { key: 'time', label: 'Jam', render: (row) => row.pickupTime }, { key: 'district', label: 'Wilayah', render: (row) => row.district?.name || 'Umum' }]} rows={schedules} emptyText="Belum ada jadwal." />
          </div>
        </AppCard>
      </section>
    </div>
  )
}

export default AdminSchedulesPage
