import { Link } from 'react-router-dom'
import LeafyPreview from '../LeafyPreview.jsx'

function HeroSection() {
  return (
    <section id="tentang" className="sticky top-0 z-0 min-h-screen border-b border-moss/10 bg-[#f5f1df] pt-20 lg:pt-16">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#dce8cf] lg:block" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f5f1df] to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-5 pb-16 pt-8 sm:px-8 md:pb-24 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-14">
        <div className="animate-fade-up">
          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.055em] text-leaf-900 sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.95]">
            Memilah sampah dimulai dari mengenali apa yang kita buang.
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-up text-base leading-8 text-moss/70 [animation-delay:120ms] [animation-fill-mode:both] sm:text-lg lg:mt-7 lg:text-xl">
            NodeWaste membantu kamu mengenali kategori sampah dari kamera, membaca panduan pengelolaan yang singkat, dan menjaga kebiasaan ramah lingkungan lewat progres yang sederhana.
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
  )
}

export default HeroSection
