import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { getUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import InvitacionesEquipo from '../components/InvitacionesEquipo'

export default function Profile() {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)

  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [dni, setDni] = useState('')
const [fechaNacimiento, setFechaNacimiento] = useState('')

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
      setNombre(finalProfile.nombre || '')
      setTelefono(finalProfile.telefono || '')
      setDni(finalProfile.dni || '')
      setFechaNacimiento(finalProfile.fecha_nacimiento || '')

        const { data: solicitudData } = await supabase
          .from('solicitudes_dueno')
          .select('*')
          .eq('user_id', u.id)

        if (solicitudData?.length > 0) {
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

  // 💾 GUARDAR PERFIL
  async function guardarPerfil() {

    setGuardando(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        nombre,
        telefono,dni,
        fecha_nacimiento: fechaNacimiento
      })
      .eq('id', user.id)

    setGuardando(false)

    if (error) {
      alert("Error al guardar")
      return
    }

    setProfile(prev => ({
      ...prev,
      nombre,
      telefono,
      dni,
      fecha_nacimiento: fechaNacimiento
    }))

    setEditando(false)
  }

  // 🏟️ SOLICITUD
  async function handleSolicitud() {

    const { data: existente } = await supabase
      .from('solicitudes_dueno')
      .select('*')
      .eq('user_id', user.id)

    const solicitud = existente?.[0]

    if (solicitud && solicitud.estado === 'pendiente') {
      alert('Ya tenés una solicitud pendiente')
      return
    }

    if (solicitud && solicitud.estado === 'rechazado') {

      await supabase
        .from('solicitudes_dueno')
        .update({ estado: 'pendiente' })
        .eq('id', solicitud.id)

      setSolicitud({ ...solicitud, estado: 'pendiente' })
      return
    }

    const { error } = await supabase
      .from('solicitudes_dueno')
      .insert({
        user_id: user.id,
        estado: 'pendiente'
      })

    if (!error) {
      setSolicitud({ estado: 'pendiente' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Cargando perfil...
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-zinc-950 text-white pb-24">

      <Navbar />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* CARD PERFIL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">

          {/* AVATAR */}
          <div className="flex flex-col items-center">

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                className="w-28 h-28 rounded-full object-cover border-4 border-zinc-700 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
                Sin foto
              </div>
            )}

            <label className="mt-3 text-sm text-blue-400 cursor-pointer hover:underline">
              Cambiar foto
              <input type="file" onChange={handleUpload} className="hidden" />
            </label>

          </div>

          {/* INFO */}
          <div className="mt-6 space-y-4">

            {/* EMAIL */}
            <div className="bg-zinc-800 p-3 rounded-xl">
              <p className="text-xs text-zinc-400">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            {/* NOMBRE */}
            <div className="bg-zinc-800 p-3 rounded-xl">
              <p className="text-xs text-zinc-400">Nombre</p>

              {editando ? (
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full mt-1 bg-zinc-700 rounded-lg p-2 outline-none"
                />
              ) : (
                <p className="font-semibold">
                  {profile?.nombre || 'Sin nombre'}
                </p>
              )}
            </div>

            {/* TELEFONO */}
            <div className="bg-zinc-800 p-3 rounded-xl">
              <p className="text-xs text-zinc-400">Teléfono</p>

              {editando ? (
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full mt-1 bg-zinc-700 rounded-lg p-2 outline-none"
                />
                
              ) : (
                <p className="font-semibold">
                  {profile?.telefono || 'Sin teléfono'}
                </p>
              )}
            </div>
            {/* DNI */}
<div className="bg-zinc-800 p-3 rounded-xl">
  <p className="text-xs text-zinc-400">DNI</p>

  {editando ? (
    <input
      value={dni}
      onChange={(e) =>
        setDni(e.target.value.replace(/\D/g, ''))
      }
      maxLength={8}
      className="w-full mt-1 bg-zinc-700 rounded-lg p-2 outline-none"
      placeholder="Ej: 40123456"
    />
  ) : (
    <p className="font-semibold">
      {profile?.dni || 'Sin DNI'}
    </p>
  )}
</div>
{/* FECHA DE NACIMIENTO */}
<div className="bg-zinc-800 p-3 rounded-xl">
  <p className="text-xs text-zinc-400">
    Fecha de nacimiento
  </p>

  {editando ? (
    <input
      type="date"
      value={fechaNacimiento}
      onChange={(e) =>
        setFechaNacimiento(e.target.value)
      }
      className="w-full mt-1 bg-zinc-700 rounded-lg p-2 outline-none"
    />
  ) : (
    <p className="font-semibold">
      {profile?.fecha_nacimiento || 'Sin fecha'}
    </p>
  )}
</div>

            {/* ROL */}
            <div className="bg-zinc-800 p-3 rounded-xl">
              <p className="text-xs text-zinc-400">Rol</p>
              <p className="font-semibold capitalize">
                {profile?.rol}
              </p>
            </div>

          </div>

          {/* BOTONES */}
          <div className="mt-6 flex gap-3">

            {!editando ? (
              <button
                onClick={() => setEditando(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold transition"
              >
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  onClick={guardarPerfil}
                  className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-xl font-semibold"
                >
                  {guardando ? "Guardando..." : "Guardar"}
                </button>

                <button
                  onClick={() => setEditando(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-3 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
              </>
            )}

          </div>

        </div>
<InvitacionesEquipo />
        {/* SOLICITUD */}
        {profile?.rol === 'cliente' && (

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">

            <h3 className="font-semibold mb-3">
              Convertirse en dueño
            </h3>

            {(!solicitud || solicitud.estado === 'rechazado') && (
              <button
                onClick={handleSolicitud}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold"
              >
                Solicitar ser dueño
              </button>
            )}

            {solicitud?.estado === 'pendiente' && (
              <p className="text-yellow-400">
                Solicitud pendiente ⏳
              </p>
            )}

            {solicitud?.estado === 'rechazado' && (
              <p className="text-red-400">
                Solicitud rechazada ❌
              </p>
            )}

          </div>

        )}

        {profile?.rol === 'dueno' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center">
            <p className="text-green-400 font-semibold">
              Ya sos dueño 🏟️
            </p>
          </div>
        )}

      </div>

    </div>
  )
}