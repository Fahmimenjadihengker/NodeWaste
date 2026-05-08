import { Link } from 'react-router-dom'
import FeatureOverlaySection from '../components/landing/FeatureOverlaySection.jsx'
import HeroSection from '../components/landing/HeroSection.jsx'
import LandingCTA from '../components/landing/LandingCTA.jsx'
import WorkflowScrollSection from '../components/landing/WorkflowScrollSection.jsx'
import PublicNavbar from '../components/PublicNavbar.jsx'

const features = [
  {
    title: 'Kenali jenis sampah',
    description: 'Ambil gambar sampah untuk membantu mengenali kategori dengan panduan yang mudah dipahami.',
    detail: 'NodeWaste menjaga proses tetap singkat: kamera dibuka saat dibutuhkan, hasil dibaca langsung, lalu user mendapat konteks kategori tanpa harus berpindah halaman.',
  },
  {
    title: 'Bangun kebiasaan memilah',
    description: 'EcoPoints, XP, dan streak dipakai sebagai pengingat ringan agar kebiasaan kecil terasa konsisten.',
    detail: 'Reward dibuat sebagai dorongan, bukan tekanan. Progress membantu user melihat kebiasaan hariannya bertambah dari aksi kecil yang berulang.',
  },
  {
    title: 'Rawat Leafy',
    description: 'Virtual pet menjadi representasi sederhana dari kebiasaan baik yang kamu rawat setiap hari.',
    detail: 'Leafy merespons perawatan dari EcoPoints, sehingga proses memilah terasa lebih personal dan menyenangkan tanpa membuat aplikasi terasa ramai.',
  },
  {
    title: 'Lihat jejak kontribusi',
    description: 'Riwayat dan map membantu kamu melihat aktivitas memilah serta fasilitas pengelolaan sampah di sekitar.',
    detail: 'Aktivitas disimpan sebagai catatan progres, sementara map membantu memberi konteks lokasi saat user butuh fasilitas pengelolaan sampah.',
  },
]

const workflowSteps = [
  {
    title: 'Ambil foto sampah.',
    detail: 'Buka kamera dari halaman scan, arahkan ke sampah yang ingin dikenali, lalu gunakan hasilnya sebagai titik awal edukasi pengelolaan.',
  },
  {
    title: 'Baca kategori dan panduan pengelolaan.',
    detail: 'Hasil scan menampilkan kategori, akurasi, dan langkah sederhana agar user tahu apakah sampah perlu dipilah, dibersihkan, atau dibawa ke fasilitas khusus.',
  },
  {
    title: 'Kumpulkan EcoPoints dan rawat Leafy.',
    detail: 'Scan valid memberi progress. EcoPoints bisa dipakai untuk merawat Leafy, sementara XP dan streak menjaga motivasi tetap terlihat dari waktu ke waktu.',
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

      <footer className="bg-[#f5f1df] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-moss/15 pt-8 text-sm font-semibold text-moss/60 sm:flex-row">
          <p>NodeWaste. Edukasi sampah, EcoPoints, dan Leafy dalam satu web app.</p>
          <div className="flex gap-5">
            <Link className="hover:text-leaf-700" to="/login">Login</Link>
            <Link className="hover:text-leaf-700" to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage
