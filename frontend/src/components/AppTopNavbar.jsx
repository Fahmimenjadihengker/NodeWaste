import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { appNavItems } from './appNavItems.js'
import { floatingNavbarClass, navbarFrameClass, transparentNavbarClass } from './navbarStyles.js'

function getInitial(name) {
  return (name?.trim()?.charAt(0) || 'E').toUpperCase()
}

function AppTopNavbar({ user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 hidden px-4 py-4 sm:px-6 md:block">
      <div className={`${navbarFrameClass} ${isScrolled ? floatingNavbarClass : transparentNavbarClass}`}>
        <Link to="/dashboard" className="flex items-center gap-3" aria-label="NodeWaste dashboard">
          <span className="text-lg font-black tracking-tight text-leaf-900">NodeWaste</span>
        </Link>

        <nav className="flex items-center gap-7 text-[15px] font-black text-moss" aria-label="Navigasi aplikasi">
          {appNavItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `transition hover:text-leaf-600 ${isActive ? 'text-leaf-700' : 'text-moss/70'}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-black text-moss transition hover:bg-leaf-100 hover:text-leaf-900" to="/profile">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf-600 text-xs text-white shadow-[0_8px_18px_rgba(52,122,55,0.24)]">
              {getInitial(user?.name)}
            </span>
            <span className="max-w-28 truncate">{user?.name || 'Eco Hero'}</span>
          </Link>
          <button className="rounded-full border border-moss/20 px-5 py-2.5 text-sm font-black text-moss transition hover:border-leaf-600 hover:text-leaf-700" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppTopNavbar
