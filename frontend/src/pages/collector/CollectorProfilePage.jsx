import CollectorPlaceholderPage from '../../components/collector/CollectorPlaceholderPage.jsx'

function CollectorProfilePage() {
  return (
    <CollectorPlaceholderPage
      eyebrow="Profil collector"
      title="Data kendaraan dan wilayah."
      description="Halaman ini akan dipakai untuk mengelola identitas collector, plat kendaraan, tipe kendaraan, dan wilayah operasional."
      points={['Backend sudah menyediakan GET/PUT /api/collector/profile.', 'Dashboard saat ini membaca ringkasan profile dari /api/collector/dashboard.']}
    />
  )
}

export default CollectorProfilePage
