import { useOutletContext } from 'react-router-dom'
import AppCard from '../../components/AppCard.jsx'
import MapCN from '../../components/driver/MapCN.jsx'
import { SkeletonCard, SkeletonText } from '../../components/Skeleton.jsx'
import { useCachedResource } from '../../hooks/useCachedResource.js'
import { getCachedDriverMap, getDriverMap } from '../../services/driverApi.js'

const fallbackData = {
  driverProfile: null,
  houses: [],
  processingSites: [],
  recyclingFacilities: [],
}

function DriverMapPage() {
  const { user } = useOutletContext()
  const { data, error, isLoading } = useCachedResource({ getCached: getCachedDriverMap, load: getDriverMap, fallback: fallbackData })
  const district = data.driverProfile?.district
  const profile = data.driverProfile
  const districtLabel = [district?.name, district?.city].filter(Boolean).join(', ') || 'Wilayah belum diatur'

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      
      {/* HEADER SECTION */}
      <section className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
        <AppCard className="relative overflow-hidden p-8 sm:p-10">
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-moss/50">
              Peta Operasional
            </p>
            
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-leaf-950 sm:text-5xl">
              Halo, <span className="text-leaf-700">{user?.name || 'Driver'}!</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-moss/75">
              Anda ditugaskan di <strong className="text-leaf-900">{districtLabel}</strong>. Berikut adalah peta navigasi rute operasional Anda hari ini.
            </p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <p className="text-sm font-bold text-red-800">Map belum bisa dimuat. Coba ulang setelah backend aktif.</p>
              </div>
            ) : null}
            
            {isLoading ? (
              <div className="mt-6 max-w-xl space-y-3">
                <SkeletonText className="w-3/4 h-4" />
                <SkeletonText className="w-1/2 h-4" />
              </div>
            ) : null}
          </div>
        </AppCard>

        <AppCard className="group relative overflow-hidden p-7 sm:p-8 flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-800">Kendaraan</p>
          </div>
          <div className="relative z-10 mt-auto pt-6">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-leaf-950">{profile?.vehiclePlate || '-'}</h2>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.15em] text-moss/60">{profile?.vehicleType || 'Tipe Belum Diatur'}</p>
          </div>
        </AppCard>
      </section>

      {/* STATISTIC SECTION */}
      <section className="mt-6 grid grid-cols-3 gap-4 sm:gap-6">
        <AppCard tone="softCream" className="p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <p className="text-2xl sm:text-4xl font-black text-leaf-950">{data.houses?.length || 0}</p>
          <p className="mt-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-moss/60">Rumah</p>
        </AppCard>
        
        <AppCard tone="softCream" className="p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <p className="text-2xl sm:text-4xl font-black text-leaf-950">{data.processingSites?.length || 0}</p>
          <p className="mt-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-moss/60">TPS</p>
        </AppCard>

        <AppCard tone="softCream" className="p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <p className="text-2xl sm:text-4xl font-black text-leaf-950">{data.recyclingFacilities?.length || 0}</p>
          <p className="mt-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-moss/60">Daur Ulang</p>
        </AppCard>
      </section>

      {/* MAP SECTION */}
      <section className="mt-8">
        {isLoading ? (
          <SkeletonCard className="min-h-[32rem] rounded-[2rem]" />
        ) : (
          <MapCN houses={data.houses} processingSites={data.processingSites} recyclingFacilities={data.recyclingFacilities} />
        )}
      </section>

    </div>
  )
}

export default DriverMapPage
