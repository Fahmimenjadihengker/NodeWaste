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
    <main className="min-h-screen bg-[#f5f1df] pb-28 text-moss md:pb-0">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-leaf-900/10 bg-[#edf5e4] px-5 py-6 shadow-[18px_0_50px_rgba(32,58,37,0.10)] md:flex md:flex-col">
        <NavLink className="flex items-center gap-3 rounded-[1.4rem] border border-leaf-900/10 bg-[#fbf7e8] p-4 shadow-[0_18px_40px_rgba(32,58,37,0.08)]" to="/admin/dashboard">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-700 text-2xl text-cream shadow-lg">♻</span>
          <span>
            <span className="block text-lg font-black tracking-[-0.04em] text-leaf-950">NodeWaste</span>
            <span className="text-xs font-bold text-moss/55">Admin Dashboard</span>
          </span>
        </NavLink>

        <nav className="mt-8 grid gap-2" aria-label="Navigasi admin">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${isActive ? 'bg-leaf-800 text-cream shadow-[0_16px_36px_rgba(32,58,37,0.18)]' : 'text-moss/70 hover:bg-leaf-100 hover:text-leaf-950'}`}
              to={item.to}
            >
              <AppNavIcon name={item.icon} />
              <span>{item.label === 'Pengguna' ? 'Manajemen pengguna' : item.label === 'Jadwal' ? 'Manajemen jadwal' : item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-leaf-900/10 bg-[#fbf7e8] p-4 shadow-[0_18px_40px_rgba(32,58,37,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss/45">Masuk sebagai</p>
          <p className="mt-2 truncate text-sm font-black text-leaf-950">{user?.name || 'Admin'}</p>
          <p className="truncate text-xs font-semibold text-moss/55">{user?.email}</p>
          <button className="mt-4 w-full rounded-2xl bg-leaf-800 px-4 py-3 text-sm font-black text-cream shadow-lg shadow-leaf-950/15 transition hover:bg-moss" type="button" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-leaf-900/10 bg-[#fbf7e8]/90 px-5 py-4 shadow-sm backdrop-blur-xl md:ml-72 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-950">NodeWaste Admin</p>
            <p className="text-sm font-semibold text-moss/60">Kelola operasional pengguna dan jadwal angkut.</p>
          </div>
          <div className="hidden items-center gap-3 rounded-full border border-leaf-900/10 bg-[#edf5e4] px-4 py-2 md:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf-800 text-xs font-black text-cream">{(user?.name || 'A').slice(0, 1).toUpperCase()}</span>
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
