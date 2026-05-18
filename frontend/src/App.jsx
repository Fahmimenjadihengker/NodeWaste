import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import CollectorShell from './components/collector/CollectorShell.jsx'
import PwaInstallPrompt from './components/PwaInstallPrompt.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import CollectorDashboardPage from './pages/collector/CollectorDashboardPage.jsx'
import CollectorHouseMapPage from './pages/collector/CollectorHouseMapPage.jsx'
import CollectorProcessingSitesPage from './pages/collector/CollectorProcessingSitesPage.jsx'
import CollectorProfilePage from './pages/collector/CollectorProfilePage.jsx'
import CollectorRoutePage from './pages/collector/CollectorRoutePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PetPage from './pages/PetPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import ScanPage from './pages/ScanPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute allowedRoles={['COLLECTOR']}><CollectorShell /></ProtectedRoute>}>
          <Route path="/collector/dashboard" element={<CollectorDashboardPage />} />
          <Route path="/collector/profile" element={<CollectorProfilePage />} />
          <Route path="/collector/maps/houses" element={<CollectorHouseMapPage />} />
          <Route path="/collector/maps/processing-sites" element={<CollectorProcessingSitesPage />} />
          <Route path="/collector/route" element={<CollectorRoutePage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['USER']}><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/pet" element={<PetPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <PwaInstallPrompt />
    </BrowserRouter>
  )
}

export default App
