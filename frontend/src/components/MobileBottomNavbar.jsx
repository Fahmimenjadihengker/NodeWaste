import { NavLink } from 'react-router-dom'
import AppNavIcon from './AppNavIcon.jsx'
import { mobileAppNavItems } from './appNavItems.js'

function MobileBottomNavbar({ navItems = mobileAppNavItems }) {
  const gridClass = navItems.length === 2 ? 'grid-cols-2' : navItems.length === 3 ? 'grid-cols-3' : navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-5'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden" aria-label="Navigasi aplikasi mobile">
      <div className={`mx-auto grid max-w-md ${gridClass} items-end gap-1 rounded-[2rem] border border-moss/10 bg-white/92 px-3 pb-3 pt-2 shadow-[0_-10px_34px_rgba(32,58,37,0.14)] backdrop-blur-xl`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => {
              const baseClass = 'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-black transition'
              const activeClass = item.featured ? 'bg-leaf-600 text-white shadow-[0_14px_26px_rgba(52,122,55,0.34)]' : 'text-leaf-700'
              const inactiveClass = item.featured ? 'bg-leaf-600 text-white shadow-[0_14px_26px_rgba(52,122,55,0.34)]' : 'text-moss/45 hover:text-leaf-900'

              return `${baseClass} ${isActive ? activeClass : inactiveClass} ${item.featured ? '-mt-8 mx-auto h-16 w-16 rounded-full border-[6px] border-white' : ''}`
            }}
            to={item.to}
          >
            <AppNavIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileBottomNavbar
