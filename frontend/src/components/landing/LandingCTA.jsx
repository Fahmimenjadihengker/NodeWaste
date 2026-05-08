import { Link } from 'react-router-dom'

function LandingCTA() {
  return (
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
  )
}

export default LandingCTA
