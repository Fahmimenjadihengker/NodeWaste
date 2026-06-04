import Footer from '../components/Footer.jsx'
import FeatureOverlaySection from '../components/landing/FeatureOverlaySection.jsx'
import HeroSection from '../components/landing/HeroSection.jsx'
import LandingCTA from '../components/landing/LandingCTA.jsx'
import WorkflowScrollSection from '../components/landing/WorkflowScrollSection.jsx'
import PublicNavbar from '../components/PublicNavbar.jsx'

const features = [
  {
    title: 'Kenali jenis sampah',
    description: 'Ambil gambar sampah, lalu lihat kategori, klasifikasi, confidence, dan rekomendasi penanganannya.',
    detail: 'NodeWaste meneruskan gambar ke classifier eksternal dan menampilkan hasil yang mudah dibaca: kategori sampah, klasifikasi pengelolaan, akurasi, serta panduan singkat.',
  },
  {
    title: 'Bangun kebiasaan memilah',
    description: 'EcoPoints dan XP dipakai sebagai pengingat ringan agar kebiasaan kecil terasa konsisten.',
    detail: 'Scan valid memberi EcoPoints dan XP. Dashboard menampilkan progres level, ringkasan klasifikasi, dan riwayat scan harian, mingguan, serta bulanan.',
  },
  {
    title: 'Rawat Leafy the Waste Cat',
    description: 'EcoPoints bisa dipakai untuk memberi makan dan mengajak Leafy bermain.',
    detail: 'Leafy punya indikator happiness, kenyang, XP, dan level. Statusnya berubah seiring waktu sehingga user punya alasan ringan untuk kembali merawat kebiasaan hijau.',
  },
  {
    title: 'Ikuti jadwal dan riwayat',
    description: 'Jadwal pengambilan sampah dan riwayat aktivitas membantu kebiasaan tetap rapi.',
    detail: 'Jadwal diurutkan Senin sampai Minggu, riwayat profile dipaginasi, dan data alamat berbasis wilayah.id membantu driver melihat titik rumah sesuai wilayah kerja.',
  },
]

const workflowSteps = [
  {
    title: 'Ambil foto sampah.',
    detail: 'Buka halaman scan, aktifkan kamera, lalu ambil gambar sampah yang ingin dikenali.',
  },
  {
    title: 'Baca kategori, klasifikasi, dan rekomendasi.',
    detail: 'Hasil scan menampilkan nama sampah, kategori, klasifikasi pengelolaan, confidence, serta langkah penanganan yang bisa langsung diikuti.',
  },
  {
    title: 'Kumpulkan EcoPoints dan rawat Leafy.',
    detail: 'Scan valid memberi 50 EcoPoints dan 30 XP. EcoPoints bisa dipakai untuk merawat Leafy, sementara XP menaikkan level user.',
  },
]

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1df] text-moss">
      <PublicNavbar />
      <HeroSection />
      <FeatureOverlaySection features={features} />
      <WorkflowScrollSection steps={workflowSteps} />
      <LandingCTA />
      <Footer variant="public" />
    </main>
  )
}

export default LandingPage
