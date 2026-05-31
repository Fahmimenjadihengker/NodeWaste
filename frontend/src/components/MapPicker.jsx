import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Default to Jakarta
const DEFAULT_CENTER = [-6.200000, 106.816666];

function toPosition(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
}

function isSamePosition(a, b) {
  if (!a || !b) return a === b;

  return Math.abs(a.lat - b.lat) < 0.0000001 && Math.abs(a.lng - b.lng) < 0.0000001;
}

function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  const markerRef = useRef(null);
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        onPositionChange(marker.getLatLng());
      }
    },
  };

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ latitude, longitude, onChange }) {
  const [position, setPosition] = useState(() => toPosition(latitude, longitude));

  const updatePosition = (nextPosition) => {
    const normalizedPosition = toPosition(nextPosition.lat, nextPosition.lng);
    if (!normalizedPosition) return;

    setPosition((current) => isSamePosition(current, normalizedPosition) ? current : normalizedPosition);
    onChange(normalizedPosition.lat, normalizedPosition.lng);
  };

  // Update internal state if props change externally
  useEffect(() => {
    const propPosition = toPosition(latitude, longitude);
    if (!propPosition) return;

    queueMicrotask(() => {
      setPosition((current) => isSamePosition(current, propPosition) ? current : propPosition);
    });
  }, [latitude, longitude]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updatePosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          alert('Gagal mendeteksi lokasi: ' + err.message);
        }
      );
    } else {
      alert('Browser Anda tidak mendukung deteksi lokasi (Geolocation).');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-black text-moss/70">Pilih Lokasi di Peta</span>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="text-xs font-bold bg-leaf-600 text-white px-3 py-1.5 rounded-full hover:bg-leaf-700 transition"
        >
          Deteksi Lokasi Saya
        </button>
      </div>
      
      <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-moss/10 shadow-sm relative z-0">
        <MapContainer
          center={position || DEFAULT_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onPositionChange={updatePosition} />
          {position && <MapUpdater center={position} />}
        </MapContainer>
      </div>
      <p className="text-xs text-moss/60 mt-2 font-semibold">
        * Anda dapat menggeser pin (marker) atau klik area peta untuk menentukan letak koordinat dengan akurat.
      </p>
    </div>
  );
}
