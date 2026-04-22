import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getUser, getProfile } from '../services/authService'
import CrearClub from "./pages/CrearClub";

export default function ProtectedRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      const user = await getUser()

      if (!user) {
        setAllowed(false)
        setLoading(false)
        return
      }

      const profile = await getProfile()

      if (!requiredRole) {
        setAllowed(true)
      } else {
        setAllowed(profile?.rol === requiredRole)
      }

      setLoading(false)
    }

    checkAccess()
  }, [])

  if (loading) return <p>Cargando...</p>

  if (!allowed) return <Navigate to="/login" />

  return children
}