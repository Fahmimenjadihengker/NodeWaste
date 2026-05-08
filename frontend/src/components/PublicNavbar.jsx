import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { floatingNavbarClass, navbarFrameClass, transparentNavbarClass } from './navbarStyles.js'

const navItems = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Leafy', href: '#leafy' },
]

function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6">
      <div
        className={`${navbarFrameClass} ${isScrolled ? floatingNavbarClass : transparentNavbarClass}`}
      >
        <Link to="/" className="flex items-center gap-3" aria-label="NodeWaste home">
          <span className="text-lg font-black tracking-tight text-leaf-900">NodeWaste</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] font-black text-moss md:flex" aria-label="Navigasi publik">
          {navItems.map((item) => (
            <a key={item.href} className="transition hover:text-leaf-600" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            className="hidden rounded-full px-5 py-2.5 text-sm font-black text-moss transition hover:text-leaf-600 sm:inline-flex"
            to="/login"
          >
            Masuk
          </Link>
          <Link
            className="rounded-full bg-moss px-5 py-2.5 text-sm font-black text-white transition hover:bg-leaf-900"
            to="/register"
          >
            Daftar Gratis
          </Link>
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
