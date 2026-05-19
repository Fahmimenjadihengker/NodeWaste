function getBounds(points) {
  const latitudes = points.map((point) => point.latitude)
  const longitudes = points.map((point) => point.longitude)

  return {
    minLat: Math.min(...latitudes),
    maxLat: Math.max(...latitudes),
    minLng: Math.min(...longitudes),
    maxLng: Math.max(...longitudes),
  }
}

function getPosition(point, bounds) {
  const latRange = bounds.maxLat - bounds.minLat || 0.01
  const lngRange = bounds.maxLng - bounds.minLng || 0.01
  const x = ((point.longitude - bounds.minLng) / lngRange) * 82 + 9
  const y = (1 - (point.latitude - bounds.minLat) / latRange) * 74 + 13

  return { left: `${x}%`, top: `${y}%` }
}

function MapMarker({ point, bounds }) {
  const isHouse = point.type === 'house'

  return (
    <div className="group absolute -translate-x-1/2 -translate-y-1/2" style={getPosition(point, bounds)}>
      <div className={`grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-xs font-black text-white shadow-[0_12px_24px_rgba(32,58,37,0.22)] ${isHouse ? 'bg-leaf-600' : 'bg-honey'}`}>
        {isHouse ? 'R' : 'T'}
      </div>
      <div className="pointer-events-none absolute bottom-11 left-1/2 z-10 hidden w-56 -translate-x-1/2 rounded-2xl border border-moss/10 bg-white p-3 text-left shadow-[0_18px_40px_rgba(32,58,37,0.16)] group-hover:block">
        <p className="text-sm font-black text-leaf-900">{point.title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-moss/60">{point.description}</p>
      </div>
    </div>
  )
}

function MapCN({ houses = [], processingSites = [] }) {
  const points = [
    ...houses.map((house) => ({
      id: `house-${house.id}`,
      type: 'house',
      title: house.user?.name || 'Rumah user',
      description: house.address,
      latitude: house.latitude,
      longitude: house.longitude,
    })),
    ...processingSites.map((site) => ({
      id: `site-${site.id}`,
      type: 'site',
      title: site.name,
      description: site.address,
      latitude: site.latitude,
      longitude: site.longitude,
    })),
  ].filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
  const bounds = points.length ? getBounds(points) : null

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-moss/10 bg-[#dce8cf] shadow-[0_22px_70px_rgba(32,58,37,0.10)]">
      <div className="relative min-h-[28rem] bg-[radial-gradient(circle_at_22%_20%,rgba(255,248,232,0.95),transparent_20%),radial-gradient(circle_at_76%_72%,rgba(234,201,107,0.28),transparent_22%),linear-gradient(135deg,#dce8cf,#f8f4e6)]">
        <div className="absolute inset-x-8 top-1/2 h-3 -translate-y-1/2 rotate-[-9deg] rounded-full bg-white/65" />
        <div className="absolute bottom-16 left-1/3 h-3 w-2/3 rotate-[18deg] rounded-full bg-white/55" />
        <div className="absolute left-1/2 top-10 h-[80%] w-3 rotate-[8deg] rounded-full bg-white/45" />
        <div className="absolute inset-5 rounded-[1.4rem] border border-white/70" />

        {bounds ? points.map((point) => <MapMarker key={point.id} point={point} bounds={bounds} />) : (
          <div className="absolute inset-0 grid place-items-center px-8 text-center">
            <div className="max-w-md rounded-[1.25rem] bg-white/76 p-6 shadow-[0_18px_40px_rgba(32,58,37,0.10)]">
              <p className="text-xl font-black text-leaf-900">Belum ada titik map</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-moss/65">Rumah user akan muncul setelah user mengisi alamat, kecamatan, latitude, dan longitude di profile.</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 border-t border-moss/10 bg-white/65 p-4 text-sm font-bold text-moss/65">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-leaf-600" /> Rumah user</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-honey" /> TPS/tempat pengolahan</span>
      </div>
    </div>
  )
}

export default MapCN
