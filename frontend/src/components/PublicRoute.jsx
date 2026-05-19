import { Navigate } from 'react-router-dom'
import { getAuthToken } from '../services/apiClient.js'
import { getRoleHomePath, getStoredUser } from '../services/authApi.js'

function PublicRoute({ children }) {
  const user = getStoredUser()

  if (getAuthToken()) {
    return <Navigate to={getRoleHomePath(user)} replace />
  }

  return children
}

export default PublicRoute
