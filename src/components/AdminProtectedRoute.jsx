import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
