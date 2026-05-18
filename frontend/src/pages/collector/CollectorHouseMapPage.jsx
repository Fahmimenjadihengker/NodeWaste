import CollectorPlaceholderPage from '../../components/collector/CollectorPlaceholderPage.jsx'

function CollectorHouseMapPage() {
  return (
    <CollectorPlaceholderPage
      eyebrow="Peta rumah"
      title="Rumah user dalam wilayah."
      description="Halaman peta rumah akan menampilkan titik rumah user yang masuk dalam district collector."
      points={['Endpoint tersedia di GET /api/collector/houses.', 'Data seed demo menyiapkan beberapa rumah agar count dashboard tidak kosong.']}
    />
  )
}

export default CollectorHouseMapPage
