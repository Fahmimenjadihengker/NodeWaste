import { Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession, getStoredUser } from '../services/authApi.js'
import AppTopNavbar from './AppTopNavbar.jsx'
import MobileBottomNavbar from './MobileBottomNavbar.jsx'

function AppShell() {
  const user = getStoredUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-[#f5f1df] pb-28 pt-0 text-moss md:pb-0 md:pt-24">
      <AppTopNavbar user={user} onLogout={handleLogout} />
      <Outlet context={{ user, onLogout: handleLogout }} />
      <MobileBottomNavbar />
    </main>
  )
}

export default AppShell
