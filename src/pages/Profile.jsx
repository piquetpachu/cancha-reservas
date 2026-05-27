
import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

import { getUser } from '../services/authService'

import { useNavigate } from 'react-router-dom'

import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'


import ProfileTabs from '../components/profile/ProfileTabs'
import ProfileReservations from '../components/profile/ProfileReservations'
import ProfileTournaments from '../components/profile/ProfileTournaments'

export default function Profile() {

  const [user, setUser] = useState(null)

  const [profile, setProfile] =
    useState(null)

  const [solicitud, setSolicitud] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [activeTab, setActiveTab] =
    useState('profile')

  // EDIT
  const [editando, setEditando] =
    useState(false)

  const [nombreEdit, setNombreEdit] =
    useState('')

  const [
    telefonoEdit,
    setTelefonoEdit
  ] = useState('')

  const [dniEdit, setDniEdit] =
    useState('')

  const [
    fechaNacimientoEdit,
    setFechaNacimientoEdit
  ] = useState('')

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

        // PROFILE
        const { data: profileData } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', u.id)
            .single()

        let finalProfile = profileData

        if (!profileData) {

          const {
            data: newProfile
          } = await supabase
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

        // SOLICITUD
        const {
          data: solicitudData
        } = await supabase
          .from('solicitudes_dueno')
          .select('*')
          .eq('user_id', u.id)

        if (
          solicitudData &&
          solicitudData.length > 0
        ) {
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

  // SUBIR AVATAR
  async function handleUpload(e) {

    const file = e.target.files[0]

    if (!file) return

    const filePath =
      `${user.id}-${Date.now()}`

    const { error } =
      await supabase.storage
        .from('avatars')
        .upload(filePath, file)

    if (error) {
      alert(error.message)
      return
    }

    const { data } =
      supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    await supabase
      .from('profiles')
      .update({
        avatar_url:
          data.publicUrl
      })
      .eq('id', user.id)

    setProfile(prev => ({
      ...prev,
      avatar_url:
        data.publicUrl
    }))

  }

  // EDITAR
  function empezarEdicion() {

    setNombreEdit(
      profile?.nombre || ''
    )

    setTelefonoEdit(
      profile?.telefono || ''
    )

    setDniEdit(
      profile?.dni || ''
    )

    setFechaNacimientoEdit(
      profile?.fecha_nacimiento || ''
    )

    setEditando(true)

  }

  // GUARDAR
  async function guardarCambios() {

    if (
      telefonoEdit.length < 8
    ) {

      alert(
        'Ingresá un teléfono válido'
      )

      return

    }

    const { error } =
      await supabase
        .from('profiles')
        .update({
          nombre: nombreEdit,
          telefono: telefonoEdit,
          dni: dniEdit,
          fecha_nacimiento:
            fechaNacimientoEdit
        })
        .eq('id', user.id)

    if (error) {

      alert(
        'Error al guardar cambios'
      )

      return

    }

    setProfile(prev => ({
      ...prev,
      nombre: nombreEdit,
      telefono: telefonoEdit,
      dni: dniEdit,
      fecha_nacimiento:
        fechaNacimientoEdit
    }))

    setEditando(false)

    alert('Perfil actualizado')

  }

  // SOLICITUD
  async function handleSolicitud() {

    const {
      data: existente
    } = await supabase
      .from('solicitudes_dueno')
      .select('*')
      .eq('user_id', user.id)

    const solicitud =
      existente?.[0]

    if (
      solicitud &&
      solicitud.estado ===
        'pendiente'
    ) {

      alert(
        'Ya tenés una solicitud pendiente'
      )

      return

    }

    if (
      solicitud &&
      solicitud.estado ===
        'rechazado'
    ) {

      await supabase
        .from(
          'solicitudes_dueno'
        )
        .update({
          estado: 'pendiente'
        })
        .eq('id', solicitud.id)

      alert(
        'Solicitud reenviada'
      )

      setSolicitud({
        ...solicitud,
        estado: 'pendiente'
      })

      return

    }

    const { error } =
      await supabase
        .from(
          'solicitudes_dueno'
        )
        .insert({
          user_id: user.id,
          estado: 'pendiente'
        })

    if (error) {

      alert(
        'Error al enviar solicitud'
      )

    } else {

      alert(
        'Solicitud enviada'
      )

      setSolicitud({
        estado: 'pendiente'
      })

    }

  }

  const tabs = [
    {
      id: 'profile',
      label: '👤 Perfil'
    },
    {
      id: 'reservas',
      label: '📅 Reservas'
    },
    {
      id: 'torneos',
      label: '🏆 Torneos'
    }
  ]

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-[#0B1020]
        text-white
        p-6
      ">
        Cargando perfil...
      </div>
    )

  }

  return (
    <>


      <div className="
        min-h-screen
        bg-[#0B1020]
        text-white
        p-6
      ">

        <div className="
          max-w-5xl
          mx-auto
          space-y-8
        ">

          {/* HEADER */}
          <Card>

            <div className="
              flex
              flex-col
              md:flex-row
              gap-8
              items-center
            ">

              <div className="
                flex-shrink-0
              ">

                <img
                  src={
                    profile?.avatar_url ||
                    'https://placehold.co/200'
                  }
                  alt="avatar"
                  className="
                    w-40
                    h-40
                    rounded-full
                    object-cover
                    border-4
                    border-blue-500
                  "
                />

              </div>

              <div className="
                flex-1
                space-y-4
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                  flex-wrap
                ">

                  <h1 className="
                    text-4xl
                    font-bold
                  ">
                    {
                      profile?.nombre ||
                      'Sin nombre'
                    }
                  </h1>

                  <Badge variant="success">
                    {profile?.rol}
                  </Badge>

                </div>

                <p className="
                  text-gray-400
                ">
                  {user?.email}
                </p>

                <div className="
                  flex
                  flex-wrap
                  gap-3
                ">

                  <label>

                    <input
                      type="file"
                      hidden
                      onChange={
                        handleUpload
                      }
                    />

                    <Button
                      variant="secondary"
                    >
                      Cambiar avatar
                    </Button>

                  </label>

                  {
                    !editando && (
                      <Button
                        onClick={
                          empezarEdicion
                        }
                      >
                        Editar perfil
                      </Button>
                    )
                  }

                </div>

              </div>

            </div>

          </Card>

          {/* TABS */}
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* PERFIL */}
          {
            activeTab ===
              'profile' && (

              <>

                {/* DATOS */}
                <Card>

                  <h2 className="
                    text-2xl
                    font-bold
                    mb-6
                  ">
                    Información personal
                  </h2>

                  {
                    editando ? (

                      <div className="
                        grid
                        md:grid-cols-2
                        gap-5
                      ">

                        <div>

                          <label className="
                            text-sm
                            text-gray-400
                          ">
                            Nombre
                          </label>

                          <Input
                            type="text"
                            value={nombreEdit}
                            onChange={(e) =>
                              setNombreEdit(
                                e.target.value
                              )
                            }
                          />

                        </div>

                        <div>

                          <label className="
                            text-sm
                            text-gray-400
                          ">
                            Teléfono
                          </label>

                          <Input
                            type="tel"
                            value={
                              telefonoEdit
                            }
                            maxLength={15}
                            onChange={(e) => {

                              const soloNumeros =
                                e.target.value.replace(
                                  /\D/g,
                                  ''
                                )

                              setTelefonoEdit(
                                soloNumeros
                              )

                            }}
                          />

                        </div>

                        <div>

                          <label className="
                            text-sm
                            text-gray-400
                          ">
                            DNI
                          </label>

                          <Input
                            type="text"
                            value={dniEdit}
                            maxLength={10}
                            onChange={(e) => {

                              const soloNumeros =
                                e.target.value.replace(
                                  /\D/g,
                                  ''
                                )

                              setDniEdit(
                                soloNumeros
                              )

                            }}
                          />

                        </div>

                        <div>

                          <label className="
                            text-sm
                            text-gray-400
                          ">
                            Fecha nacimiento
                          </label>

                          <Input
                            type="date"
                            value={
                              fechaNacimientoEdit
                            }
                            onChange={(e) =>
                              setFechaNacimientoEdit(
                                e.target.value
                              )
                            }
                          />

                        </div>

                        <div className="
                          md:col-span-2
                          flex
                          gap-3
                          pt-4
                        ">

                          <Button
                            onClick={
                              guardarCambios
                            }
                          >
                            Guardar cambios
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() =>
                              setEditando(false)
                            }
                          >
                            Cancelar
                          </Button>

                        </div>

                      </div>

                    ) : (

                      <div className="
                        grid
                        md:grid-cols-2
                        gap-6
                      ">

                        <div>

                          <p className="
                            text-gray-400
                            text-sm
                          ">
                            Nombre
                          </p>

                          <h3 className="
                            text-xl
                            font-bold
                            mt-2
                          ">
                            {
                              profile?.nombre ||
                              'Sin nombre'
                            }
                          </h3>

                        </div>

                        <div>

                          <p className="
                            text-gray-400
                            text-sm
                          ">
                            Teléfono
                          </p>

                          <h3 className="
                            text-xl
                            font-bold
                            mt-2
                          ">
                            {
                              profile?.telefono ||
                              'Sin teléfono'
                            }
                          </h3>

                        </div>

                        <div>

                          <p className="
                            text-gray-400
                            text-sm
                          ">
                            DNI
                          </p>

                          <h3 className="
                            text-xl
                            font-bold
                            mt-2
                          ">
                            {
                              profile?.dni ||
                              'Sin DNI'
                            }
                          </h3>

                        </div>

                        <div>

                          <p className="
                            text-gray-400
                            text-sm
                          ">
                            Fecha nacimiento
                          </p>

                          <h3 className="
                            text-xl
                            font-bold
                            mt-2
                          ">
                            {
                              profile?.fecha_nacimiento ||
                              'Sin fecha'
                            }
                          </h3>

                        </div>

                      </div>

                    )
                  }

                </Card>

                {/* SOLICITUD */}
                {
                  profile?.rol ===
                    'cliente' && (

                    <Card>

                      <h2 className="
                        text-2xl
                        font-bold
                        mb-5
                      ">
                        Solicitud de dueño
                      </h2>

                      {
                        (
                          !solicitud ||
                          solicitud.estado ===
                            'rechazado'
                        ) && (

                          <Button
                            onClick={
                              handleSolicitud
                            }
                          >
                            {
                              solicitud?.estado ===
                              'rechazado'
                                ? 'Volver a solicitar'
                                : 'Solicitar ser dueño'
                            }
                          </Button>

                        )
                      }

                      {
                        solicitud?.estado ===
                          'pendiente' && (

                          <div className="
                            flex
                            items-center
                            gap-3
                          ">

                            <Button disabled>
                              Solicitud enviada
                            </Button>

                            <Badge variant="warning">
                              Pendiente
                            </Badge>

                          </div>

                        )
                      }

                    </Card>

                  )
                }

              </>

            )
          }

          {/* RESERVAS */}
          {
            activeTab ===
              'reservas' && (
              <ProfileReservations
                userId={user.id}
              />
            )
          }

          {/* TORNEOS */}
          {
  activeTab ===
    'torneos' && (
    <ProfileTournaments
      userId={user.id}
    />
  )
}

        </div>

      </div>

    </>
  )

}