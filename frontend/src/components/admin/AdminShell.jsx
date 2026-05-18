import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession, getStoredUser } from '../../services/authApi.js'
import AppNavIcon from '../AppNavIcon.jsx'
import MobileBottomNavbar from '../MobileBottomNavbar.jsx'
import { adminNavItems, mobileAdminNavItems } from './adminNavItems.js'

function AdminShell() {
  const user = getStoredUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-[#eef5e9] pb-28 text-moss md:pb-0">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-white/60 bg-gradient-to-b from-leaf-800 via-leaf-700 to-moss px-5 py-6 text-white shadow-[20px_0_50px_rgba(30,64,38,0.16)] md:flex md:flex-col">
        <NavLink className="flex items-center gap-3 rounded-[1.4rem] bg-white/12 p-4 ring-1 ring-white/15" to="/admin/dashboard">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-2xl shadow-lg">♻</span>
          <span>
            <span className="block text-lg font-black tracking-[-0.04em]">NodeWaste</span>
            <span className="text-xs font-bold text-white/65">Admin Dashboard</span>
          </span>
        </NavLink>

        <nav className="mt-8 grid gap-2" aria-label="Navigasi admin">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${isActive ? 'bg-white text-leaf-800 shadow-[0_16px_36px_rgba(0,0,0,0.18)]' : 'text-white/72 hover:bg-white/10 hover:text-white'}`}
              to={item.to}
            >
              <AppNavIcon name={item.icon} />
              <span>{item.label === 'Pengguna' ? 'Manajemen pengguna' : item.label === 'Jadwal' ? 'Manajemen jadwal' : item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/15">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Masuk sebagai</p>
          <p className="mt-2 truncate text-sm font-black">{user?.name || 'Admin'}</p>
          <p className="truncate text-xs font-semibold text-white/55">{user?.email}</p>
          <button className="mt-4 w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-950/20" type="button" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-xl md:ml-72 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-700">NodeWaste Admin</p>
            <p className="text-sm font-semibold text-moss/60">Kelola operasional pengguna dan jadwal angkut.</p>
          </div>
          <div className="hidden items-center gap-3 rounded-full border border-leaf-100 bg-leaf-50 px-4 py-2 md:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf-600 text-xs font-black text-white">{(user?.name || 'A').slice(0, 1).toUpperCase()}</span>
            <span className="max-w-48 truncate text-sm font-black text-leaf-900">{user?.name || 'Admin'}</span>
          </div>
        </div>
      </header>

      <section className="md:ml-72">
        <Outlet context={{ user, onLogout: handleLogout }} />
      </section>
      <MobileBottomNavbar navItems={mobileAdminNavItems} />
    </main>
  )
}

export default AdminShell
