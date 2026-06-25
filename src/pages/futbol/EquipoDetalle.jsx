import {
useEffect,
useState
} from 'react'

import {
useParams
} from 'react-router-dom'

import {
supabase
} from '../../supabaseClient'

import {
obtenerEquipoDetalle
} from '../../services/torneoService'

export default function EquipoDetalle() {

const { id } = useParams()

const [equipo, setEquipo] =
useState(null)

const [loading, setLoading] =
useState(true)

const [
nombreInvitado,
setNombreInvitado
] = useState('')

useEffect(() => {


loadEquipo()


}, [])

async function loadEquipo() {


try {

  const data =
    await obtenerEquipoDetalle(id)

  setEquipo(data)

} catch (error) {

  console.error(error)

} finally {

  setLoading(false)

}


}

async function invitarJugador() {


try {

  const {
    data: usuario,
    error: usuarioError
  } = await supabase
    .from('profiles')
    .select('*')
    .eq(
      'nombre',
      nombreInvitado
    )
    .single()

  if (usuarioError) {

    alert(
      'Usuario no encontrado'
    )

    return

  }

  const { error } =
    await supabase
      .from(
        'invitaciones_equipo'
      )
      .insert({

        equipo_id:
          equipo.id,

        usuario_id:
          usuario.id,

        estado:
          'pendiente'

      })

  if (error)
    throw error

  alert(
    'Invitación enviada'
  )

  setNombreInvitado('')

  await loadEquipo()

} catch (error) {

  console.error(error)

  alert(error.message)

}


}

if (loading) {


return (

  <div className="
    min-h-screen
    bg-zinc-950
    text-white
    p-6
  ">
    Cargando...
  </div>

)


}

return (


<div className="
  min-h-screen
  bg-zinc-950
  text-white
  p-4
">

  <div className="
    bg-zinc-900
    border
    border-zinc-800
    rounded-3xl
    p-6
  ">

    <h1 className="
      text-3xl
      font-bold
    ">
      {equipo.nombre}
    </h1>

    <p className="
      text-zinc-400
      mt-2
    ">
      Jugadores: {
        equipo
          .equipo_integrantes
          ?.length || 0
      }
    </p>

    <div className="
      mt-6
      bg-zinc-800
      rounded-2xl
      p-4
    ">

      <h3 className="
        font-semibold
        mb-3
      ">
        Invitar jugador
      </h3>

      <input
        type="text"
        value={nombreInvitado}
        onChange={(e) =>
          setNombreInvitado(
            e.target.value
          )
        }
        placeholder="Nombre exacto"
        className="
          w-full
          bg-zinc-700
          rounded-xl
          p-3
        "
      />

      <button
        onClick={invitarJugador}
        className="
          mt-3
          w-full
          bg-blue-600
          hover:bg-blue-500
          py-3
          rounded-xl
        "
      >
        Enviar invitación
      </button>

    </div>

  </div>

  <div className="mt-6">

    <h2 className="
      text-xl
      font-bold
      mb-4
    ">
      Integrantes
    </h2>

    <div className="
      space-y-3
    ">

      {
        equipo
          .equipo_integrantes
          ?.map(
            jugador => (

              <div
                key={jugador.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-xl
                  p-4
                "
              >

                <div className="
                  flex
                  justify-between
                ">

                  <span>
                    {
                      jugador
                        .profiles
                        ?.nombre
                    }
                  </span>

                  <span className="
                    text-zinc-400
                  ">
                    {
                      jugador.rol
                    }
                  </span>

                </div>

              </div>

            )
          )
      }

    </div>

  </div>

  <div className="
    mt-8
  ">

    <h2 className="
      text-xl
      font-bold
      mb-4
    ">
      Invitaciones pendientes
    </h2>

    <div className="
      space-y-3
    ">

      {
        equipo
          .invitaciones_equipo
          ?.filter(
            inv =>
              inv.estado ===
              'pendiente'
          )
          .map(
            invitacion => (

              <div
                key={invitacion.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-xl
                  p-4
                  flex
                  justify-between
                "
              >

                <span>
                  {
                    invitacion
                      .profiles
                      ?.nombre
                  }
                </span>

                <span className="
                  text-yellow-500
                ">
                  Pendiente
                </span>

              </div>

            )
          )
      }

    </div>

  </div>

</div>


)

}
