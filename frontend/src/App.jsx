import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminShell from './components/admin/AdminShell.jsx'
import AppShell from './components/AppShell.jsx'
import DriverShell from './components/driver/DriverShell.jsx'
import PwaInstallPrompt from './components/PwaInstallPrompt.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import { PageSkeleton } from './components/Skeleton.jsx'

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'))
const AdminScheduleFormPage = lazy(() => import('./pages/admin/AdminScheduleFormPage.jsx'))
const AdminSchedulesPage = lazy(() => import('./pages/admin/AdminSchedulesPage.jsx'))
const AdminUserFormPage = lazy(() => import('./pages/admin/AdminUserFormPage.jsx'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage.jsx'))
const DriverMapPage = lazy(() => import('./pages/driver/DriverMapPage.jsx'))
const DriverProfileEditPage = lazy(() => import('./pages/driver/DriverProfileEditPage.jsx'))
const DriverProfilePage = lazy(() => import('./pages/driver/DriverProfilePage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const PetPage = lazy(() => import('./pages/PetPage.jsx'))
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const SchedulePage = lazy(() => import('./pages/SchedulePage.jsx'))
const ScanPage = lazy(() => import('./pages/ScanPage.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
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
            <Route path="/admin/schedules/:id/edit" element={<AdminScheduleFormPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverShell /></ProtectedRoute>}>
            <Route path="/driver/dashboard" element={<Navigate replace to="/driver/map" />} />
            <Route path="/driver/map" element={<DriverMapPage />} />
            <Route path="/driver/profile" element={<DriverProfilePage />} />
            <Route path="/driver/profile/edit" element={<DriverProfileEditPage />} />
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
      </Suspense>
      <PwaInstallPrompt />
    </BrowserRouter>
  )
}

export default App
