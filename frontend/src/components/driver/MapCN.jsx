import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { renderToString } from 'react-dom/server';
import { Home, Trash2, Package, Navigation, Route, Crosshair, X } from 'lucide-react';

// Helper: Haversine distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Custom DivIcons
const houseIcon = new L.DivIcon({
  html: `<div class="grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-white shadow-md bg-leaf-600">${renderToString(<Home size={18} strokeWidth={2.5} />)}</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const siteIcon = new L.DivIcon({
  html: `<div class="grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-white shadow-md bg-honey">${renderToString(<Trash2 size={18} strokeWidth={2.5} />)}</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const facilityIcon = new L.DivIcon({
  html: `<div class="grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-white shadow-md bg-blue-600">${renderToString(<Package size={18} strokeWidth={2.5} />)}</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const driverIcon = new L.DivIcon({
  html: `<div class="grid h-10 w-10 place-items-center rounded-full border-[3px] border-white text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] bg-blue-500 animate-pulse">${renderToString(<Navigation size={20} strokeWidth={2.5} fill="currentColor" />)}</div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function DynamicMapZoomer({ driverPos, targetPos }) {
  const map = useMap();
  const [hasInitialZoomed, setHasInitialZoomed] = useState(false);

  useEffect(() => {
    if (targetPos) return; // Biarkan RoutingMachine yang mengontrol zoom saat ada rute

    if (driverPos && !hasInitialZoomed) {
      map.setView([driverPos.lat, driverPos.lng], 15, { animate: true });
      setHasInitialZoomed(true);
    }
  }, [driverPos, targetPos, map, hasInitialZoomed]);

  return null;
}

function MapBottomControls({ driverPos, distanceInfo, setTargetPos, setDistanceInfo }) {
  const map = useMap();

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[85%] max-w-3xl z-[1000] flex flex-col items-end gap-3 sm:gap-4 pointer-events-none">
      
      {/* Recenter Button */}
      {driverPos && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            map.setView([driverPos.lat, driverPos.lng], 15, { animate: true });
          }}
          className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-gray-50 text-blue-600 transition-transform hover:scale-105 active:scale-95 border border-moss/10"
          title="Fokus ke Lokasi Saya"
        >
          <Crosshair size={20} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Dynamic Island Content */}
      <div className="w-full pointer-events-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-[1.25rem] sm:rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl p-3 sm:p-4 sm:px-6 border border-white/60">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-3 text-[10px] sm:text-sm font-bold text-moss/70">
          <span className="inline-flex items-center gap-1 sm:gap-1.5"><span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Anda</span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5"><span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-leaf-600" /> User</span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5"><span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-honey" /> TPS</span>
          <span className="inline-flex items-center gap-1 sm:gap-1.5"><span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-600" /> Daur Ulang</span>
        </div>
        
        <div 
          className={`grid transition-[grid-template-rows,opacity,margin-top] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            distanceInfo ? 'grid-rows-[1fr] opacity-100 mt-3 sm:mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="shrink-0 flex items-stretch justify-center w-full sm:w-auto gap-2">
              <div className="flex-1 sm:flex-none flex flex-col justify-center bg-blue-600 rounded-[1rem] sm:rounded-2xl px-3 sm:px-5 py-2 shadow-lg border border-blue-500">
                <p className="text-[9px] sm:text-xs font-black uppercase text-blue-100 tracking-wider">Estimasi Rute</p>
                <p className="text-xs sm:text-base font-semibold text-white leading-none mt-1">
                  <span className="font-black">{distanceInfo?.time || '-'}</span> <span className="text-blue-200/90 text-[9px] sm:text-xs font-bold">({distanceInfo?.distance || '-'} km)</span>
                </p>
              </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargetPos(null);
                    setDistanceInfo(null);
                  }}
                  className="flex shrink-0 items-center justify-center bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-[1rem] sm:rounded-2xl px-4 sm:px-5 py-2 font-bold shadow-sm transition-colors"
                  title="Batalkan Rute"
                >
                  <X size={18} strokeWidth={2.5} className="sm:hidden" />
                  <span className="hidden sm:inline tracking-wide">SELESAI</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverTracker({ setDriverPos }) {
  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator) {
      // Get initial position first to avoid delay
      navigator.geolocation.getCurrentPosition((position) => {
        setDriverPos({ lat: position.coords.latitude, lng: position.coords.longitude });
      });

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setDriverPos({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.error("Error watching position", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [setDriverPos]);
  return null;
}

function RoutingMachine({ driverPos, targetPos, setDistanceInfo }) {
  const map = useMap();
  useEffect(() => {
    if (!driverPos || !targetPos) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(driverPos.lat, driverPos.lng),
        L.latLng(targetPos.lat, targetPos.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false, // Hide turn-by-turn panel
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8, className: 'animate-pulse' }]
      },
      createMarker: () => null, // We already use our custom markers
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      
      const distance = (summary.totalDistance / 1000).toFixed(1);
      const totalMinutes = Math.round(summary.totalTime / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeString = hours > 0 ? `${hours} jam ${minutes} mnt` : `${minutes} mnt`;
      
      setDistanceInfo({ distance, time: timeString });
    });

    return () => map.removeControl(routingControl);
  }, [map, driverPos, targetPos, setDistanceInfo]);

  return null;
}

function MapCN({ houses = [], processingSites = [], recyclingFacilities = [] }) {
  const [driverPos, setDriverPos] = useState(null);
  const [targetPos, setTargetPos] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);

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
    ...recyclingFacilities.map((facility) => ({
      id: `facility-${facility.id}`,
      type: 'facility',
      title: facility.name,
      description: facility.address,
      latitude: facility.latitude,
      longitude: facility.longitude,
    })),
  ].filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude));

  const hasPoints = points.length > 0 || driverPos !== null;
  const DEFAULT_CENTER = [-6.200000, 106.816666]; // Default to Jakarta if no points

  const handleRouteToNearest = (targetType) => {
    if (!driverPos) return;
    
    const targetPoints = points.filter(p => p.type === targetType);
    if (targetPoints.length === 0) {
      alert(`Belum ada titik tujuan di peta.`);
      return;
    }

    let nearestPoint = null;
    let minDistance = Infinity;

    targetPoints.forEach(point => {
      const dist = getDistanceFromLatLonInKm(
        driverPos.lat, driverPos.lng,
        point.latitude, point.longitude
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = point;
      }
    });

    if (nearestPoint) {
      setTargetPos({ lat: nearestPoint.latitude, lng: nearestPoint.longitude });
      setDistanceInfo(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-moss/10 shadow-[0_22px_70px_rgba(32,58,37,0.10)] relative z-0 flex flex-col">
      <div className="relative h-[34rem] w-full bg-moss/5">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBottomControls 
            driverPos={driverPos} 
            distanceInfo={distanceInfo} 
            setTargetPos={setTargetPos} 
            setDistanceInfo={setDistanceInfo} 
          />
          <DriverTracker setDriverPos={setDriverPos} />
          <RoutingMachine driverPos={driverPos} targetPos={targetPos} setDistanceInfo={setDistanceInfo} />

          {driverPos && (
            <Marker position={[driverPos.lat, driverPos.lng]} icon={driverIcon}>
              <Popup>
                <div className="p-1 text-center">
                  <p className="text-sm font-black text-blue-900 m-0">Mobil Anda</p>
                  <p className="text-xs font-semibold text-moss/60 mt-1 m-0">Memancarkan lokasi real-time</p>
                </div>
              </Popup>
            </Marker>
          )}

          {points.map((point) => (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={point.type === 'house' ? houseIcon : point.type === 'site' ? siteIcon : facilityIcon}
            >
              <Popup>
                <div className="p-1">
                  <p className="text-sm font-black text-leaf-900 m-0 leading-tight">{point.title}</p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-moss/60 m-0">{point.description}</p>
                  {driverPos && (
                    <button 
                      onClick={() => {
                        setTargetPos({ lat: point.latitude, lng: point.longitude });
                        setDistanceInfo(null); // Reset while loading
                      }}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                      <Route size={14} />
                      Arahkan Kesini
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          <DynamicMapZoomer driverPos={driverPos} targetPos={targetPos} />
        </MapContainer>

        {!hasPoints && (
          <div className="absolute inset-0 z-[1000] grid place-items-center bg-white/40 backdrop-blur-[2px]">
            <div className="max-w-md rounded-[1.25rem] bg-white p-6 shadow-xl text-center">
              <p className="text-xl font-black text-leaf-900">Belum ada titik map</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-moss/65">Rumah user akan muncul setelah user mengisi alamat, kecamatan, latitude, dan longitude di profile.</p>
            </div>
          </div>
        )}

        {/* Floating Buttons for Nearest */}
        {driverPos && (
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 sm:gap-2.5">
            <button 
              onClick={() => handleRouteToNearest('house')}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-sm font-bold text-leaf-700 shadow-lg sm:shadow-xl border-2 border-leaf-600 hover:bg-leaf-50 hover:scale-105 transition-all active:scale-95"
            >
              <Home size={14} className="text-leaf-600 sm:w-4 sm:h-4" />
              Warga Terdekat
            </button>
            <button 
              onClick={() => handleRouteToNearest('site')}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-sm font-bold text-yellow-600 shadow-lg sm:shadow-xl border-2 border-honey hover:bg-yellow-50 hover:scale-105 transition-all active:scale-95"
            >
              <Trash2 size={14} className="text-yellow-600 sm:w-4 sm:h-4" />
              TPS Terdekat
            </button>
            <button 
              onClick={() => handleRouteToNearest('facility')}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-sm font-bold text-blue-600 shadow-lg sm:shadow-xl border-2 border-blue-500 hover:bg-blue-50 hover:scale-105 transition-all active:scale-95"
            >
              <Package size={14} className="text-blue-600 sm:w-4 sm:h-4" />
              Fasilitas Terdekat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapCN;
