import Navbar from '../components/Navbar'
import ClubList from "../pages/ClubList";
import { useEffect, useState } from 'react'
import { getUser, logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'


export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkUser() {
      const u = await getUser()

      if (!u) {
        navigate('/login')
      } else {
        setUser(u)
      }
    }

    checkUser()
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h1>🏟️ Dashboard</h1>

      {user ? (
        <>
          <p>Bienvenido: <strong>{user.email}</strong></p>

          <ClubList />   

        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  )
}