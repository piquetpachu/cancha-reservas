import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export default function Navbar() {
  const navigate = useNavigate()

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

      <button onClick={() => navigate('/crear-club')}>
        Crear Club
      </button>

      <button onClick={() => navigate('/crear-cancha')}>
        Crear Cancha
      </button>

      <button onClick={() => navigate('/admin/solicitudes')}>
        panel Admin
      </button>

      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </nav>
  )
}