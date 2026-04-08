
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { getUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    async function loadProfile() {
      const u = await getUser()

      // 🔐 Si no está logueado → lo mando al login
      if (!u) {
        navigate('/login')
        return
      }

      setUser(u)

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single()

      // 🔥 SI NO EXISTE PERFIL → LO CREA
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: u.id,
            nombre: '',
            telefono: '',
            rol: 'cliente'
          })
          .select()
          .single()

        if (insertError) {
          console.error(insertError)
        }

        data = newProfile
      }

      setProfile(data)
      setLoading(false)
    }

    loadProfile()
  }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]

    if (!file) return

    const filePath = `${user.id}-${Date.now()}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (error) {
      alert('Error subiendo imagen')
      return
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', user.id)

    // 🔄 refrescar perfil
    setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }))
  }

  // ⏳ Estado de carga
  if (loading) return <p>Cargando perfil...</p>

  return (
    <div style={{ padding: '20px' }}>
      <Navbar/>
      <h1>Perfil</h1>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Nombre:</strong> {profile.nombre || 'Sin nombre'}</p>
      <p><strong>Teléfono:</strong> {profile.telefono || 'Sin teléfono'}</p>

      {profile.avatar_url && (
        <img
          src={profile.avatar_url}
          alt="avatar"
          width="150"
        />
      )}

      <br /><br />

      <input type="file" onChange={handleUpload} />
    </div>
  )
}