import PlaceholderFeaturePage from '../components/PlaceholderFeaturePage.jsx'

function MapPage() {
  return (
    <PlaceholderFeaturePage
      eyebrow="Peta"
      title="Lihat jejak scan dan fasilitas terdekat."
      description="Halaman peta akan menampilkan lokasi aktivitas scan dan fasilitas pengelolaan sampah dengan fallback saat izin lokasi ditolak."
      cards={[
        { label: 'Lokasi', title: 'Permission-aware', description: 'Lokasi hanya dipakai jika user memberi izin dan harus punya fallback yang jelas.' },
        { label: 'Marker', title: 'Scan dan fasilitas', description: 'Marker membedakan aktivitas user, drop-off, bank sampah, dan fasilitas daur ulang.' },
        { label: 'Filter', title: 'Kategori lokasi', description: 'Filter membantu user menemukan fasilitas sesuai kebutuhan pengelolaan sampah.' },
      ]}
    />
  )
}

export default MapPage
