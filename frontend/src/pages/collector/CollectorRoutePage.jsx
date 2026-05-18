import CollectorPlaceholderPage from '../../components/collector/CollectorPlaceholderPage.jsx'

function CollectorRoutePage() {
  return (
    <CollectorPlaceholderPage
      eyebrow="Rute pengangkutan"
      title="Arahkan perjalanan collector."
      description="Halaman rute akan menghubungkan titik awal, rumah user, dan tempat pengolahan untuk operasional harian."
      points={['Endpoint tersedia di GET /api/collector/routes.', 'Backend saat ini mengembalikan Google Maps external link sebagai integrasi minimal.']}
    />
  )
}

export default CollectorRoutePage
