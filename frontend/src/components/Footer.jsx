import { Link } from 'react-router-dom'

const appLinks = [
  { label: 'Dashboard Utama', to: '/dashboard' },
  { label: 'Scan Sampah', to: '/scan' },
  { label: 'Jadwal Truk', to: '/schedule' },
]

const publicLinks = [
  { label: 'Tentang', to: '/#tentang' },
  { label: 'Masuk', to: '/login' },
  { label: 'Daftar', to: '/register' },
]

function Footer({ variant = 'app', className = '', customLinks = null }) {
  const year = new Date().getFullYear()
  const isPublic = variant === 'public'
  const navLinks = customLinks !== null ? customLinks : (isPublic ? publicLinks : appLinks)

  return (
    <footer className={`mt-auto w-full bg-[#dce8cf] text-moss pt-12 pb-8 border-t border-leaf-900/10 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 flex flex-col gap-10">
         
         {/* Top section: Brand and Links */}
         <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
            {/* Brand */}
            <div className="max-w-md">
               <h2 className="text-3xl font-black tracking-[-0.04em] text-leaf-900">NodeWaste</h2>
               <p className="mt-3 text-sm font-semibold leading-relaxed text-moss/70">Edukasi sampah, EcoPoints, jadwal angkut, dan Leafy dalam satu pengalaman hijau.</p>
            </div>
            
            {/* Navigation */}
            {navLinks.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-moss/50 mb-1">Navigasi</h3>
                {navLinks.map((link, idx) => (
                  <Link key={idx} to={link.to} className="text-[13px] font-bold text-moss hover:text-leaf-700 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
         </div>

          {/* Bottom section: Divider and Copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-moss/10">
             <p className="text-[12px] font-bold text-moss/60">© {year} NodeWaste. Built for greener habits.</p>
          </div>

      </div>
    </footer>
  )
}

export default Footer
