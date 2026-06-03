import {
  useState,
  useEffect
} from 'react'

import { supabase } from '../supabaseClient'

import { getUser } from '../services/authService'

export default function TournamentTeamRegistration({
  torneo
}) {

  const [showForm, setShowForm] =
    useState(false)
  const [nombreEquipo, setNombreEquipo] =
    useState('')
  
  const [loading, setLoading] =
    useState(false)
    const [equipos, setEquipos] =
  useState([])

const [miEquipo, setMiEquipo] =
  useState(null)

  const [nombreInvitado, setNombreInvitado] =
  useState('')



  useEffect(() => {

  loadEquipos()

}, [])

async function loadEquipos() {

  const user =
    await getUser()

  const {
    data,
    error
  } = await supabase
    .from('equipos_torneo')
    .select('*')
    .eq(
      'torneo_id',
      torneo.id
    )

  if (error) {

    console.error(error)

    return
    
  }
console.log(
  'equiposConIntegrantes',
  data
)
  setEquipos(data)

  if (user) {

    const mio =
      data.find(
        equipo =>
          equipo.creador_id ===
          user.id
      )

    setMiEquipo(mio)

  }

}
async function invitarJugador() {

  try {

    const {
      data: usuario,
      error: userError
    } = await supabase
      .from('profiles')
      .select('*')
      .eq(
        'nombre',
        nombreInvitado
      )
      .single()

    if (userError) {

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
            miEquipo.id,

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

  } catch (error) {

    console.error(error)

    alert(error.message)

  }

}
  async function crearEquipo() {

  try {

    setLoading(true)

    const user =
      await getUser()

    if (!user) {

      alert(
        'Debes iniciar sesión'
      )

      return
    }

    // CREAR EQUIPO

    const {
  data: equipo,
  error
} = await supabase
  .from('equipos_torneo')
  .insert({
    torneo_id: torneo.id,
    nombre: nombreEquipo,
    creador_id: user.id,
    estado: 'activo'
  })
  .select()
  .single()

if (error)
  throw error

// AGREGAR CAPITÁN
const {
  error: integranteError
} = await supabase
  .from('equipo_integrantes')
  .insert({
    equipo_id: equipo.id,
    usuario_id: user.id
  })

if (integranteError)
  throw integranteError

// INSCRIBIR EQUIPO
const {
  error: inscripcionError
} = await supabase
  .from('inscripciones_torneo')
  .insert({
    torneo_id: torneo.id,
    usuario_id: user.id,
    equipo_id: equipo.id,
    estado: 'activo'
  })

if (inscripcionError)
  throw inscripcionError
    alert(
      'Equipo creado'
    )

    setShowForm(false)

    setNombreEquipo('')
    await loadEquipos()
  } catch (error) {

    console.error(error)

    alert(error.message)

  } finally {

    setLoading(false)

  }

}
    return (

    <div>

      <button
        onClick={() =>
          setShowForm(!showForm)
        }
        className="
          bg-purple-600
          hover:bg-purple-500
          transition
          px-5
          py-3
          rounded-xl
          font-semibold
        "
      >
        Crear equipo
      </button>

      {
        showForm && (

          <div className="
            mt-4
            bg-zinc-900
            border
            border-zinc-800
            rounded-xl
            p-4
          ">

            <h3 className="
              text-lg
              font-bold
              mb-4
            ">
              Crear equipo
            </h3>

            <input
  type="text"
  placeholder="Nombre del equipo"
  value={nombreEquipo}
  onChange={(e) =>
    setNombreEquipo(
      e.target.value
    )
  }
  className="
    w-full
    bg-zinc-800
    border
    border-zinc-700
    rounded-xl
    p-3
  "
/>
<button
  onClick={crearEquipo}
  disabled={loading}
  className="
    mt-4
    w-full
    bg-green-600
    hover:bg-green-500
    py-3
    rounded-xl
    font-semibold
  "
>

  {
    loading
      ? 'Creando...'
      : 'Crear equipo'
  }

</button>
          </div>

        )
      }
{
  miEquipo && (

    <div className="
      mt-6
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-4
    ">

      <h3 className="
        text-lg
        font-bold
      ">
        Mi equipo
      </h3>
{
  miEquipo && (

    <div className="
      mt-4
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-4
    ">

      <h4 className="
        font-semibold
        mb-3
      ">
        Invitar jugador
      </h4>

      <input
        type="email"
        placeholder="Nombre exacto del jugador"
        value={nombreInvitado}
        onChange={(e) =>
          setNombreInvitado(
            e.target.value
          )
        }
        className="
          w-full
          bg-zinc-800
          border
          border-zinc-700
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

  )
}
      <p className="
        text-zinc-300
        mt-2
      ">
        {miEquipo.nombre}
      </p>

    </div>

  )
}

{
  equipos.length > 0 && (

    <div className="
      mt-6
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-4
    ">

      <h3 className="
        text-lg
        font-bold
        mb-4
      ">
        Equipos inscritos
      </h3>

      <div className="
        space-y-3
      ">

        {
          equipos.map(
            equipo => (

              <div
                key={equipo.id}
                className="
                  bg-zinc-800
                  rounded-lg
                  p-3
                "
              >

                {equipo.nombre}

              </div>

            )
          )
        }

      </div>

    </div>

  )
}
    </div>

  )

}