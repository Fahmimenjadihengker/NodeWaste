import { Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession, getStoredUser } from '../../services/authApi.js'
import AppTopNavbar from '../AppTopNavbar.jsx'
import MobileBottomNavbar from '../MobileBottomNavbar.jsx'
import { driverNavItems, mobileDriverNavItems } from './driverNavItems.js'

function DriverShell() {
  const user = getStoredUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-[#f5f1df] pb-28 pt-0 text-moss md:pb-0 md:pt-24">
      <AppTopNavbar
        user={user}
        onLogout={handleLogout}
        navItems={driverNavItems}
        homePath="/driver/map"
        profilePath="/driver/profile"
        userFallback="Driver"
        brandSuffix="Driver"
      />
      <Outlet context={{ user, onLogout: handleLogout }} />
      <MobileBottomNavbar navItems={mobileDriverNavItems} />
    </main>
  )
}

export default DriverShell
