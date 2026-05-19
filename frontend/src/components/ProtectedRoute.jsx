import { Navigate } from 'react-router-dom'
import { getAuthToken } from '../services/apiClient.js'
import { getRoleHomePath, getStoredUser } from '../services/authApi.js'

function ProtectedRoute({ allowedRoles, children }) {
  const user = getStoredUser()

  if (!getAuthToken()) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHomePath(user)} replace />
  }

  return children
}

export default ProtectedRoute
