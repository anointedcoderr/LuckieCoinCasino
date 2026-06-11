import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RequireAuth({ role, children }) {
  const { session } = useAuth()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location.pathname, needAdmin: true }} />
  }
  if (role === 'player' && session.role !== 'player') {
    return <Navigate to="/admin" replace />
  }
  return children
}
