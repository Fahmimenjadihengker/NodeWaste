import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminShell from './components/admin/AdminShell.jsx'
import AppShell from './components/AppShell.jsx'
import DriverShell from './components/driver/DriverShell.jsx'
import PwaInstallPrompt from './components/PwaInstallPrompt.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminScheduleFormPage from './pages/admin/AdminScheduleFormPage.jsx'
import AdminSchedulesPage from './pages/admin/AdminSchedulesPage.jsx'
import AdminUserFormPage from './pages/admin/AdminUserFormPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import DriverDashboardPage from './pages/driver/DriverDashboardPage.jsx'
import DriverMapPage from './pages/driver/DriverMapPage.jsx'
import DriverProfilePage from './pages/driver/DriverProfilePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PetPage from './pages/PetPage.jsx'
import ProfileEditPage from './pages/ProfileEditPage.jsx'
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
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShell /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/new" element={<AdminUserFormPage />} />
          <Route path="/admin/users/:id/edit" element={<AdminUserFormPage />} />
          <Route path="/admin/schedules" element={<AdminSchedulesPage />} />
          <Route path="/admin/schedules/new" element={<AdminScheduleFormPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverShell /></ProtectedRoute>}>
          <Route path="/driver/dashboard" element={<DriverDashboardPage />} />
          <Route path="/driver/map" element={<DriverMapPage />} />
          <Route path="/driver/profile" element={<DriverProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['USER']}><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/pet" element={<PetPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
        </Route>
      </Routes>
      <PwaInstallPrompt />
    </BrowserRouter>
  )
}

export default App
