import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export default function AdminParticipantesTorneo({
  torneoId
}) {

  const [participants, setParticipants] =
    useState([])

  useEffect(() => {

    loadParticipants()

  }, [])

  async function loadParticipants() {

    const { data, error } =
      await supabase
        .from('inscripciones_torneo')
        .select(`
          *,
          profile:usuario_id (
            nombre,
            avatar_url
          )
        `)
        .eq('torneo_id', torneoId)

    if (error) {

      console.error(error)

    } else {

      setParticipants(data)

    }

  }

  async function updateStatus(
    id,
    estado
  ) {

    const { error } =
      await supabase
        .from('inscripciones_torneo')
        .update({
          estado
        })
        .eq('id', id)

    if (error) {

      alert(error.message)

    } else {

      loadParticipants()

    }

  }

  return (

    <div className="
      mt-10
    ">

      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">
        Solicitudes
      </h2>

      <div className="
        space-y-4
      ">

        {
          participants.map(item => (

            <div
              key={item.id}
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-4
                flex
                items-center
                justify-between
                gap-4
              "
            >

              {/* USER */}
              <div className="
                flex
                items-center
                gap-3
              ">

                <img
                  src={
                    item.profile
                      ?.avatar_url ||

                    'https://placehold.co/50'
                  }
                  alt=""
                  className="
                    w-12
                    h-12
                    rounded-full
                    object-cover
                  "
                />

                <div>

                  <p className="
                    font-semibold
                  ">
                    {
                      item.profile
                        ?.nombre
                    }
                  </p>

                  <p className="
                    text-sm
                    text-zinc-400
                    capitalize
                  ">
                    {
                      item.estado
                    }
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="
                flex
                gap-2
              ">

                <button
                  onClick={() =>
                    updateStatus(
                      item.id,
                      'aprobado'
                    )
                  }
                  className="
                    bg-green-600
                    hover:bg-green-500
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                  "
                >
                  Aprobar
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      item.id,
                      'rechazado'
                    )
                  }
                  className="
                    bg-red-600
                    hover:bg-red-500
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                  "
                >
                  Rechazar
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}