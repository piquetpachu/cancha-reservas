import {
  useEffect,
  useState
} from 'react'

import { supabase }
from '../supabaseClient'

import { getUser }
from '../services/authService'

export default function
InvitacionesEquipo() {

  const [invitaciones, setInvitaciones] =
    useState([])

  useEffect(() => {

    loadInvitaciones()

  }, [])

  async function loadInvitaciones() {

    const user =
      await getUser()

    if (!user) return

    const { data } =
      await supabase
        .from(
          'invitaciones_equipo'
        )
        .select(`
          *,
          equipos_torneo (
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

    setInvitaciones(
      data || []
    )

  }

  async function responder(
    invitacion,
    aceptar
  ) {

    if (aceptar) {

      await supabase
        .from(
          'equipo_integrantes'
        )
        .insert({

          equipo_id:
            invitacion.equipo_id,

          usuario_id:
            invitacion.usuario_id

        })

    }

    await supabase
      .from(
        'invitaciones_equipo'
      )
      .update({

        estado:
          aceptar
            ? 'aceptada'
            : 'rechazada'

      })
      .eq(
        'id',
        invitacion.id
      )

    loadInvitaciones()

  }

  return (

    <div className="
      space-y-4
    ">

      {
        invitaciones.map(
          invitacion => (

            <div
              key={
                invitacion.id
              }
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-xl
                p-4
              "
            >

              <h3 className="
                font-bold
              ">
                {
                  invitacion
                    .equipos_torneo
                    ?.nombre
                }
              </h3>

              <div className="
                flex
                gap-2
                mt-3
              ">

                <button
                  onClick={() =>
                    responder(
                      invitacion,
                      true
                    )
                  }
                  className="
                    flex-1
                    bg-green-600
                    py-2
                    rounded-lg
                  "
                >
                  Aceptar
                </button>

                <button
                  onClick={() =>
                    responder(
                      invitacion,
                      false
                    )
                  }
                  className="
                    flex-1
                    bg-red-600
                    py-2
                    rounded-lg
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

  )

}