import PlaceholderFeaturePage from '../components/PlaceholderFeaturePage.jsx'

function ScanPage() {
  return (
    <PlaceholderFeaturePage
      eyebrow="Scan"
      title="Scan sampah berikutnya."
      description="Halaman scan akan menangani kamera, upload gambar, proses klasifikasi, dan hasil edukasi sampah. Placeholder ini memastikan navigasi aplikasi sudah siap tanpa route kosong."
      cards={[
        { label: 'Input', title: 'Kamera dan upload', description: 'User dapat memilih kamera atau upload gambar sebagai fallback ketika kamera tidak tersedia.' },
        { label: 'AI', title: 'Klasifikasi sampah', description: 'Gambar dianalisis oleh mock classifier atau model AI saat integrasi backend siap.' },
        { label: 'Reward', title: 'EcoPoints dan XP', description: 'Hasil valid akan menambah poin, XP, dan progres kebiasaan memilah.' },
      ]}
    />
  )
}

export default ScanPage
