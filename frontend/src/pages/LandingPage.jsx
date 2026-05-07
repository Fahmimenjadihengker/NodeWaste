import { Link } from 'react-router-dom'
import LeafyPreview from '../components/LeafyPreview.jsx'
import PublicNavbar from '../components/PublicNavbar.jsx'

const features = [
  {
    title: 'Kenali jenis sampah',
    description: 'Upload atau ambil gambar untuk membantu mengenali kategori sampah dengan panduan yang mudah dipahami.',
  },
  {
    title: 'Bangun kebiasaan memilah',
    description: 'EcoPoints, XP, dan streak dipakai sebagai pengingat ringan agar kebiasaan kecil terasa konsisten.',
  },
  {
    title: 'Rawat Leafy',
    description: 'Virtual pet menjadi representasi sederhana dari kebiasaan baik yang kamu rawat setiap hari.',
  },
  {
    title: 'Lihat jejak kontribusi',
    description: 'Riwayat dan map membantu kamu melihat aktivitas memilah serta fasilitas pengelolaan sampah di sekitar.',
  },
]

const steps = [
  'Ambil foto atau upload gambar sampah.',
  'Baca kategori dan panduan pengelolaan yang disarankan.',
  'Kumpulkan EcoPoints dan rawat progres hijau bersama Leafy.',
]

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1df] text-moss">
      <PublicNavbar />

      <section id="tentang" className="relative min-h-screen border-b border-moss/10 pt-20 lg:pt-16">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#dce8cf] lg:block" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f5f1df] to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-5 pb-16 pt-8 sm:px-8 md:pb-24 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-14">
          <div className="animate-fade-up">
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.055em] text-leaf-900 sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.95]">
              Memilah sampah dimulai dari mengenali apa yang kita buang.
            </h1>

            <p className="mt-6 max-w-2xl animate-fade-up text-base leading-8 text-moss/70 [animation-delay:120ms] [animation-fill-mode:both] sm:text-lg lg:mt-7 lg:text-xl">
              NodeWaste membantu kamu mengenali kategori sampah dari gambar, membaca panduan pengelolaan yang singkat, dan menjaga kebiasaan ramah lingkungan lewat progres yang sederhana.
            </p>

            <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:220ms] [animation-fill-mode:both] sm:flex-row">
              <Link className="inline-flex items-center justify-center rounded-full bg-leaf-600 px-7 py-4 text-base font-black text-white transition hover:bg-leaf-900" to="/register">
                Mulai Sekarang
              </Link>
              <Link className="inline-flex items-center justify-center rounded-full border border-moss/20 px-7 py-4 text-base font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" to="/login">
                Masuk ke Akun
              </Link>
            </div>

          </div>

          <LeafyPreview />
        </div>
      </section>

      <section id="fitur" className="bg-[#f5f1df] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl animate-fade-up">
          <div className="grid gap-8 border-b border-moss/15 pb-10 lg:grid-cols-[0.72fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-600">Fitur inti</p>
              <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.045em] text-leaf-900 sm:text-5xl">Dibuat untuk kebiasaan yang realistis.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-moss/70">
              NodeWaste tidak mencoba membuat semuanya terasa ramai. Fokusnya adalah memberi pemahaman, dorongan ringan, dan catatan progres yang cukup untuk membantu kamu lebih konsisten memilah sampah.
            </p>
          </div>

          <div className="divide-y divide-moss/15">
            {features.map((feature, index) => (
              <article key={feature.title} className="grid gap-4 py-8 md:grid-cols-[9rem_0.7fr_1fr] md:items-start">
                <span className="text-sm font-black uppercase tracking-[0.22em] text-moss/40">0{index + 1}</span>
                <h3 className="text-2xl font-black tracking-[-0.03em] text-leaf-900">{feature.title}</h3>
                <p className="max-w-2xl leading-7 text-moss/70">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="border-y border-moss/10 bg-[#e7edda] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Cara kerja</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.045em] text-leaf-900 sm:text-5xl">Tiga langkah yang mudah diulang.</h2>
          </div>

          <ol className="divide-y divide-moss/15 border-y border-moss/15">
            {steps.map((step, index) => (
              <li key={step} className="grid gap-4 py-7 sm:grid-cols-[5rem_1fr] sm:items-center">
                <span className="text-3xl font-black text-leaf-700">{index + 1}</span>
                <p className="text-xl font-black leading-8 text-leaf-900">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#f5f1df] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 border-y border-moss/15 py-12 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-600">Mulai dari halaman publik</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900 sm:text-4xl">Siap membuat memilah sampah jadi kebiasaan harian?</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex justify-center rounded-full bg-leaf-600 px-7 py-4 font-black text-white transition hover:bg-leaf-900" to="/register">Daftar Gratis</Link>
            <Link className="inline-flex justify-center rounded-full border border-moss/20 px-7 py-4 font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" to="/login">Masuk</Link>
          </div>
        </div>
      </section>

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
