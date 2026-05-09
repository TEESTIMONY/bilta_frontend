import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function TeamRouteGuard({ children, ownerOnly = false }) {
  const location = useLocation()
  const { isAuthenticated, isOwner, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F4F8FC] px-4 text-sm text-slate-600">
        Loading CMS...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/team/login" replace state={{ from: location.pathname }} />
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/team" replace />
  }

  return children
}

export default TeamRouteGuard
