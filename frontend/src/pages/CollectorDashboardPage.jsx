import { useOutletContext } from 'react-router-dom'

function CollectorDashboardPage() {
  const { user, onLogout } = useOutletContext()

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="rounded-[1.5rem] border border-moss/10 bg-[#fff8e8] p-6 shadow-[0_22px_70px_rgba(32,58,37,0.10)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">Collector</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-leaf-900 sm:text-5xl">Dashboard pengangkut.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-moss/70">
          Halo, {user?.name || 'Collector'}. Halaman operasional collector sedang disiapkan. Backend collector sudah tersedia untuk dashboard, profile, rumah user, tempat pengolahan, dan rute.
        </p>
        <button className="mt-8 rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900" type="button" onClick={onLogout}>
          Logout
        </button>
      </section>
    </div>
  )
}

export default CollectorDashboardPage
