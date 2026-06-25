import {
  useEffect,
  useState
} from 'react'

import { supabase }
from '../../supabaseClient'

import {
  getUser
} from '../../services/authService'

export default function MisInvitaciones() {

  const [
    invitaciones,
    setInvitaciones
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  useEffect(() => {

    loadInvitaciones()

  }, [])

  async function loadInvitaciones() {

    try {

      const user =
        await getUser()

      const {
        data,
        error
      } = await supabase
        .from(
          'invitaciones_equipo'
        )
        .select(`
          *,
          equipos_torneo (
            id,
            nombre
          )
        `)
        .eq(
          'usuario_id',
          user.id
        )
        .eq(
          'estado',
          'pendiente'
        )

      if (error)
        throw error

      setInvitaciones(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

  async function aceptarInvitacion(
    invitacion
  ) {

    try {

      const user =
        await getUser()

      const {
        error: integranteError
      } = await supabase
        .from(
          'equipo_integrantes'
        )
        .insert({

          equipo_id:
            invitacion.equipo_id,

          usuario_id:
            user.id,

          rol:
            'jugador'

        })

      if (integranteError)
        throw integranteError

      const {
        error: invitacionError
      } = await supabase
        .from(
          'invitaciones_equipo'
        )
        .update({

          estado:
            'aceptada'

        })
        .eq(
          'id',
          invitacion.id
        )

      if (invitacionError)
        throw invitacionError

      alert(
        'Invitación aceptada'
      )

      loadInvitaciones()

    } catch (error) {

      console.error(error)

      alert(error.message)

    }

  }

  async function rechazarInvitacion(
    invitacionId
  ) {

    try {

      const {
        error
      } = await supabase
        .from(
          'invitaciones_equipo'
        )
        .update({

          estado:
            'rechazada'

        })
        .eq(
          'id',
          invitacionId
        )

      if (error)
        throw error

      loadInvitaciones()

    } catch (error) {

      console.error(error)

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

      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        Mis invitaciones
      </h1>

      <div className="
        space-y-4
      ">

        {
          invitaciones.map(
            invitacion => (

              <div
                key={invitacion.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  p-4
                "
              >

                <h3 className="
                  font-bold
                  text-lg
                ">
                  {
                    invitacion
                      .equipos_torneo
                      ?.nombre
                  }
                </h3>

                <div className="
                  flex
                  gap-3
                  mt-4
                ">

                  <button
                    onClick={() =>
                      aceptarInvitacion(
                        invitacion
                      )
                    }
                    className="
                      flex-1
                      bg-green-600
                      py-3
                      rounded-xl
                    "
                  >
                    Aceptar
                  </button>

                  <button
                    onClick={() =>
                      rechazarInvitacion(
                        invitacion.id
                      )
                    }
                    className="
                      flex-1
                      bg-red-600
                      py-3
                      rounded-xl
                    "
                  >
                    Rechazar
                  </button>

                </div>

              </div>

            )
          )
        }

      </div>

    </div>

  )

}