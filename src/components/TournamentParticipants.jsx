import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export default function TournamentParticipants({
  torneoId
}) {

  const [participantes, setParticipantes] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    loadParticipantes()

  }, [])

  async function loadParticipantes() {

    const { data, error } =
      await supabase
        .from('inscripciones_torneo')
        .select(`
          *,
          profiles (
            nombre,
            avatar_url
          )
        `)
        .eq('torneo_id', torneoId)
        .order('created_at', {
          ascending: true
        })

    if (error) {

      console.error(error)

    } else {

      setParticipantes(data)

    }

    setLoading(false)

  }

  if (loading) {

    return (
      <div className="
        mt-10
        text-zinc-400
      ">
        Cargando participantes...
      </div>
    )

  }

  return (

    <div className="mt-10">

      <div className="
        flex
        items-center
        justify-between
        mb-6
      ">

        <h2 className="
          text-2xl
          font-bold
        ">
          Participantes
        </h2>

        <div className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-xl
          font-semibold
          text-sm
        ">
          {participantes.length}
        </div>

      </div>

      {
        participantes.length === 0 && (

          <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
            text-zinc-400
          ">
            Aún no hay participantes
          </div>

        )
      }

      <div className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
      ">

        {
          participantes.map(
            (participante) => (

              <div
                key={participante.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  p-4
                  flex
                  flex-col
                  items-center
                  text-center
                  transition
                  hover:border-blue-500
                "
              >

                <img
                  src={
                    participante
                      .profiles
                      ?.avatar_url ||
                    'https://placehold.co/100'
                  }
                  alt="avatar"
                  className="
                    w-16
                    h-16
                    rounded-full
                    object-cover
                    border-2
                    border-zinc-700
                  "
                />

                <h3 className="
                  mt-3
                  font-semibold
                ">
                  {
                    participante
                      .profiles
                      ?.nombre ||
                    'Sin nombre'
                  }
                </h3>

                <p className="
                  text-xs
                  text-zinc-400
                  mt-1
                ">
                  {
                    participante.estado
                  }
                </p>

              </div>

            )
          )
        }

      </div>

    </div>

  )

}