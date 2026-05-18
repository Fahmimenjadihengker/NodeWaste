import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession, getStoredUser } from '../../services/authApi.js'
import AppNavIcon from '../AppNavIcon.jsx'
import { collectorNavItems, mobileCollectorNavItems } from './collectorNavItems.js'

function getInitial(name) {
  return (name?.trim()?.charAt(0) || 'C').toUpperCase()
}

function CollectorShell() {
  const user = getStoredUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-[#eef2e6] pb-28 text-moss md:pb-0">
      <header className="sticky top-0 z-50 border-b border-moss/10 bg-[#eef2e6]/92 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link to="/collector/dashboard" className="flex items-center gap-3" aria-label="NodeWaste collector dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf-700 text-sm font-black text-white shadow-[0_12px_28px_rgba(52,122,55,0.25)]">NW</span>
            <div>
              <p className="text-lg font-black tracking-tight text-leaf-900">NodeWaste</p>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-moss/45">Collector</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-moss/10 bg-white/70 p-1 shadow-[0_16px_44px_rgba(32,58,37,0.08)] md:flex" aria-label="Navigasi collector">
            {collectorNavItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-black transition ${isActive ? 'bg-leaf-700 text-white shadow-[0_10px_20px_rgba(52,122,55,0.22)]' : 'text-moss/60 hover:bg-leaf-100 hover:text-leaf-900'}`}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-black text-moss transition hover:bg-white/80 hover:text-leaf-900" to="/collector/profile">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-moss text-xs text-white">{getInitial(user?.name)}</span>
              <span className="max-w-28 truncate">{user?.name || 'Collector'}</span>
            </Link>
            <button className="rounded-full px-4 py-2 text-sm font-black text-moss transition hover:bg-red-700 hover:text-white" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <button className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-moss shadow-sm md:hidden" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <Outlet context={{ user, onLogout: handleLogout }} />

      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden" aria-label="Navigasi collector mobile">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1 rounded-[2rem] border border-moss/10 bg-white/94 px-3 py-3 shadow-[0_-10px_34px_rgba(32,58,37,0.14)] backdrop-blur-xl">
          {mobileCollectorNavItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-black transition ${isActive ? 'bg-leaf-700 text-white shadow-[0_12px_22px_rgba(52,122,55,0.26)]' : 'text-moss/45 hover:text-leaf-900'}`}
              to={item.to}
            >
              <AppNavIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </main>
  )
}

export default CollectorShell
