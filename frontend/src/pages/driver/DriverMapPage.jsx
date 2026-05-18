import { useEffect, useState } from 'react'
import AppCard from '../../components/AppCard.jsx'
import MapCN from '../../components/driver/MapCN.jsx'
import { getDriverMap } from '../../services/driverApi.js'

const fallbackData = {
  driverProfile: null,
  houses: [],
  processingSites: [],
}

function DriverMapPage() {
  const [data, setData] = useState(fallbackData)
  const [status, setStatus] = useState('loading')
  const district = data.driverProfile?.district
  const districtLabel = [district?.name, district?.city].filter(Boolean).join(', ') || 'wilayah driver'

  useEffect(() => {
    let isMounted = true

    getDriverMap()
      .then((response) => {
        if (!isMounted) return
        setData(response.data || fallbackData)
        setStatus('success')
      })
      .catch(() => {
        if (isMounted) setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_0.22fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Map driver</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] text-leaf-900 sm:text-5xl lg:text-6xl">
            Titik rumah dan TPS.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-moss/70 sm:text-lg">
            Satu map operasional untuk melihat rumah user biasa yang sudah mengisi alamat dan tempat TPS/pengolahan di {districtLabel}.
          </p>
          {status === 'loading' ? <p className="mt-4 text-sm font-bold text-moss/55">Memuat map driver...</p> : null}
          {status === 'error' ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800">Map belum bisa dimuat. Coba ulang setelah backend aktif.</p> : null}
        </div>

        <AppCard tone="softCream" className="grid content-center p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Ringkasan titik</p>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div>
              <p className="text-4xl font-black text-leaf-900">{data.houses.length}</p>
              <p className="text-sm font-bold text-moss/60">Rumah user</p>
            </div>
            <div>
              <p className="text-4xl font-black text-leaf-900">{data.processingSites.length}</p>
              <p className="text-sm font-bold text-moss/60">TPS</p>
            </div>
          </div>
        </AppCard>
      </section>

      <section className="mt-8">
        <MapCN houses={data.houses} processingSites={data.processingSites} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <AppCard tone="green" className="p-5">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">Rumah user</h2>
          <div className="mt-4 divide-y divide-moss/10">
            {data.houses.length ? data.houses.slice(0, 6).map((house) => (
              <article key={house.id} className="py-4 first:pt-0 last:pb-0">
                <p className="font-black text-moss">{house.user?.name || 'User'}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-moss/60">{house.address}</p>
              </article>
            )) : <p className="text-sm font-semibold text-moss/60">Belum ada user yang mengisi alamat di wilayah ini.</p>}
          </div>
        </AppCard>

        <AppCard tone="yellow" className="p-5">
          <h2 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">TPS/tempat pengolahan</h2>
          <div className="mt-4 divide-y divide-moss/10">
            {data.processingSites.length ? data.processingSites.slice(0, 6).map((site) => (
              <article key={site.id} className="py-4 first:pt-0 last:pb-0">
                <p className="font-black text-moss">{site.name}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-moss/60">{site.address}</p>
              </article>
            )) : <p className="text-sm font-semibold text-moss/60">Belum ada TPS untuk wilayah ini.</p>}
          </div>
        </AppCard>
      </section>
    </div>
  )
}

export default DriverMapPage
