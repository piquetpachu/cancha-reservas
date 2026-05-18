import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { getUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    async function loadProfile() {
      try {
        const u = await getUser()

        if (!u) {
          navigate('/login')
          return
        }

        setUser(u)

        // 👤 PERFIL
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .single()

        let finalProfile = profileData

        if (!profileData) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              id: u.id,
              nombre: '',
              telefono: '',
              email: u.email, 
              rol: 'cliente'
            })
            .select()
            .single()

          finalProfile = newProfile
        }

        setProfile(finalProfile)

        // 🏟️ SOLICITUD
        const { data: solicitudData } = await supabase
          .from('solicitudes_dueno')
          .select('*')
          .eq('user_id', u.id)

        if (solicitudData && solicitudData.length > 0) {
          setSolicitud(solicitudData[0])
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // 📸 SUBIR AVATAR
  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const filePath = `${user.id}-${Date.now()}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (error) {
      alert(error.message)
      return
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', user.id)

    setProfile(prev => ({
      ...prev,
      avatar_url: data.publicUrl
    }))
  }

  // 🏟️ SOLICITAR SER DUEÑO
  async function handleSolicitud() {
    const { data: existente } = await supabase
      .from('solicitudes_dueno')
      .select('*')
      .eq('user_id', user.id)

    const solicitud = existente?.[0]

    // 🚫 bloquear si ya hay pendiente
    if (solicitud && solicitud.estado === 'pendiente') {
      alert('Ya tenés una solicitud pendiente')
      return
    }

    // 🔁 reenviar si fue rechazada
    if (solicitud && solicitud.estado === 'rechazado') {
      await supabase
        .from('solicitudes_dueno')
        .update({ estado: 'pendiente' })
        .eq('id', solicitud.id)

      alert('Solicitud reenviada')
      setSolicitud({ ...solicitud, estado: 'pendiente' })
      return
    }

    // 🆕 crear nueva
    const { error } = await supabase
      .from('solicitudes_dueno')
      .insert({
        user_id: user.id,
        estado: 'pendiente'
      })

    if (error) {
      alert('Error al enviar solicitud')
    } else {
      alert('Solicitud enviada')
      setSolicitud({ estado: 'pendiente' })
    }
  }

  if (loading) return <p>Cargando perfil...</p>

  return (
    <>
      <Navbar />

      <div style={{ padding: '20px' }}>
        <h1>Perfil</h1>

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Nombre:</strong> {profile?.nombre || 'Sin nombre'}</p>
        <p><strong>Teléfono:</strong> {profile?.telefono || 'Sin teléfono'}</p>
        <p><strong>Rol:</strong> {profile?.rol}</p>

        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="avatar"
            width="150"
          />
        )}

        <br /><br />

        <input type="file" onChange={handleUpload} />

        <br /><br />

        {/* 🏟️ SOLICITUD */}

        {profile?.rol === 'cliente' && (
          <>
            {/* BOTÓN DINÁMICO */}
            {(!solicitud || solicitud.estado === 'rechazado') && (
              <button onClick={handleSolicitud}>
                {solicitud?.estado === 'rechazado'
                  ? 'Volver a solicitar'
                  : 'Solicitar ser dueño'}
              </button>
            )}

            {solicitud?.estado === 'pendiente' && (
              <>
                <button disabled>
                  Solicitud enviada
                </button>
                <p>Solicitud pendiente ⏳</p>
              </>
            )}

            {solicitud?.estado === 'rechazado' && (
              <p>Solicitud rechazada ❌</p>
            )}
          </>
        )}

        {profile?.rol === 'dueno' && (
          <p>Ya sos dueño 🏟️</p>
        )}
      </div>
    </>
  )
}