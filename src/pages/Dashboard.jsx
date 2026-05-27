import ClubList from "../pages/ClubList";
import { useEffect, useState } from 'react'
import { getUser, logout } from '../services/authService'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'


export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {

    async function checkUser() {

      const u = await getUser();

      if (!u) {

        navigate('/login');

      } else {

        setUser(u);

        // buscar rol
        const { data, error } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", u.id)
          .single();

        console.log(data);
        console.log(error);

        // si es dueño
        if (data?.rol === "dueno") {

          navigate("/dashboard-dueno");
        }
      }
    }

    checkUser();

  }, []);

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '20px' }}>
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