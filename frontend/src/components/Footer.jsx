import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Scan', to: '/scan' },
  { label: 'Jadwal', to: '/schedule' },
]

function Footer({ variant = 'app', className = '' }) {
  const year = new Date().getFullYear()
  const isPublic = variant === 'public'
  const links = isPublic
    ? [
      { label: 'Tentang', to: '/#tentang' },
      { label: 'Masuk', to: '/login' },
      { label: 'Daftar', to: '/register' },
    ]
    : footerLinks

  return (
    <footer className={`px-5 pb-10 pt-8 sm:px-8 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-leaf-900/10 bg-[#edf4e6] p-6 shadow-[0_18px_55px_rgba(32,58,37,0.08)] sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-leaf-700">NodeWaste</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-leaf-900">Pilah sampah, rawat kebiasaan.</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-moss/65">Edukasi sampah, EcoPoints, jadwal angkut, dan Leafy dalam satu pengalaman hijau.</p>
          </div>

          <nav className="flex flex-wrap gap-3" aria-label="Navigasi footer">
            {links.map((link) => (
              <Link key={link.to} className="rounded-full bg-[#fff8e8] px-5 py-3 text-sm font-black text-moss shadow-sm transition hover:bg-leaf-600 hover:text-white" to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-leaf-900/10 pt-5 text-xs font-bold uppercase tracking-[0.16em] text-moss/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} NodeWaste</p>
          <p>Built for greener habits</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
