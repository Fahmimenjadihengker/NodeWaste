import { Navigate } from 'react-router-dom'
import { getAuthToken } from '../services/apiClient.js'

function ProtectedRoute({ children }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
