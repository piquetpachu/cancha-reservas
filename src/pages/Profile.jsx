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

      // 👤 PROFILE
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
            rol: 'cliente'
          })
          .select()
          .single()

        finalProfile = newProfile
      }

      setProfile(finalProfile)

      // 🏟️ SOLICITUD
      let solicitudData = null

      const { data } = await supabase
        .from('solicitudes_dueno')
        .select('*')
        .eq('user_id', u.id)

      if (data && data.length > 0) {
        solicitudData = data[0]
      }

      setSolicitud(solicitudData)

      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  loadProfile()
}, [])

  // 📸 Subir imagen
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

  // 🏟️ Solicitar ser dueño
  async function handleSolicitud() {
    const { error } = await supabase
      .from('solicitudes_dueno')
      .insert({
        user_id: user.id
      })

    if (error) {
      alert('Error al enviar solicitud')
    } else {
      alert('Solicitud enviada')
      setSolicitud({ estado: 'pendiente' })
    }
  }

  // ⏳ Loading
  if (loading) return <p>Cargando perfil...</p>

  return (
    <>
      <Navbar />

      <div style={{ padding: '20px' }}>
        <h1>Perfil</h1>

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Nombre:</strong> {profile.nombre || 'Sin nombre'}</p>
        <p><strong>Teléfono:</strong> {profile.telefono || 'Sin teléfono'}</p>
        <p><strong>Rol:</strong> {profile.rol}</p>

        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="avatar"
            width="150"
          />
        )}

        <br /><br />

        <input type="file" onChange={handleUpload} />

        <br /><br />

        {/* 🏟️ Lógica de solicitud */}

        {/* 👉 Cliente sin solicitud */}
        {profile.rol === 'cliente' && !solicitud && (
          <button onClick={handleSolicitud}>
            Solicitar ser dueño
          </button>
        )}

        {/* 👉 Pendiente */}
        {solicitud && solicitud.estado === 'pendiente' && (
          <p>Solicitud pendiente ⏳</p>
        )}

        {/* 👉 Rechazado */}
        {solicitud && solicitud.estado === 'rechazado' && (
          <p>Solicitud rechazada ❌</p>
        )}

        {/* 👉 Ya es dueño */}
        {profile.rol === 'dueno' && (
          <p>Ya sos dueño 🏟️</p>
        )}
      </div>
    </>
  )
}