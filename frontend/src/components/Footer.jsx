import { Link } from 'react-router-dom'

const Facebook = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Twitter = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

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
    <footer className={`mt-auto w-full bg-[#edf4e6] text-moss pt-12 pb-8 border-t border-leaf-900/10 ${className}`}>
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

         {/* Bottom section: Divider, Copyright and Socials */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-moss/10">
            <p className="text-[12px] font-bold text-moss/60">© {year} NodeWaste. Built for greener habits.</p>
            <div className="flex items-center gap-5">
               <a href="#" aria-label="Facebook" className="text-moss/40 hover:text-leaf-700 transition-colors"><Facebook className="w-[18px] h-[18px] stroke-[2.5]" /></a>
               <a href="#" aria-label="Instagram" className="text-moss/40 hover:text-leaf-700 transition-colors"><Instagram className="w-[18px] h-[18px] stroke-[2.5]" /></a>
               <a href="#" aria-label="Twitter" className="text-moss/40 hover:text-leaf-700 transition-colors"><Twitter className="w-[18px] h-[18px] stroke-[2.5]" /></a>
            </div>
         </div>

      </div>
    </footer>
  )
}

export default Footer
