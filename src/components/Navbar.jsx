import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Navbar() {
  const navigate = useNavigate()
  const [rol, setRol] = useState(null)

  useEffect(() => {
    
    async function getRol() {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) return

      const { data, error } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user.id)

      console.log("DATA:", data)
      console.log("ERROR:", error)

      if (data && data.length > 0) {
        const rolDB = data[0].rol?.toLowerCase()
        console.log("ROL FINAL:", rolDB)

        setRol(rolDB)
      }
    }

    getRol()
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 20px',
      background: '#222',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/')}>
          Inicio
        </button>

        <button onClick={() => navigate('/profile')}>
          Perfil
        </button>
      </div>

      {/* SOLO DUEÑO O ADMIN */}
      {(rol === "dueno" || rol === "dueño" || rol === "admin") && (
        <>
          <button onClick={() => navigate('/crear-club')}>
            Crear Club
          </button>

          <button onClick={() => navigate('/crear-cancha')}>
            Crear Cancha
          </button>
        </>
      )}

      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </nav>
  )
}