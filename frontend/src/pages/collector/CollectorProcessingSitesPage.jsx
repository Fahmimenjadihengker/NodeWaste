import CollectorPlaceholderPage from '../../components/collector/CollectorPlaceholderPage.jsx'

function CollectorProcessingSitesPage() {
  return (
    <CollectorPlaceholderPage
      eyebrow="Tempat pengolahan"
      title="TPS dan dropbox tujuan."
      description="Halaman ini akan menampilkan daftar tempat pengolahan yang bisa menerima kategori sampah tertentu."
      points={['Endpoint tersedia di GET /api/collector/processing-sites.', 'Status kapasitas backend sudah tersedia untuk tahap peta/detail berikutnya.']}
    />
  )
}

export default CollectorProcessingSitesPage
