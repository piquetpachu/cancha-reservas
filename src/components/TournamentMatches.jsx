import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export default function TournamentMatches({
  torneoId
}) {

  const [matches, setMatches] =
    useState([])

  useEffect(() => {

    loadMatches()

  }, [])

  async function loadMatches() {

    const { data, error } =
      await supabase
        .from('partidos_torneo')
        .select(`
          *,
          jugador1:jugador1_id (
            nombre,
            avatar_url
          ),
          jugador2:jugador2_id (
            nombre,
            avatar_url
          ),
          ganador:ganador_id (
            nombre
          )
        `)
        .eq('torneo_id', torneoId)
        .order('ronda')

    if (error) {

      console.error(error)

    } else {

      setMatches(data)

    }

  }

  return (

    <div className="mt-10">

      <h2 className="
        text-2xl
        font-bold
        mb-6
      ">
        Partidos
      </h2>

      <div className="
        space-y-4
      ">

        {
          matches.map(match => (

            <div
              key={match.id}
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-5
              "
            >

              <div className="
                flex
                items-center
                justify-between
                mb-4
              ">

                <span className="
                  text-sm
                  text-zinc-400
                ">
                  Ronda {match.ronda}
                </span>

                <span className="
                  text-xs
                  bg-zinc-800
                  px-3
                  py-1
                  rounded-full
                ">
                  {match.estado}
                </span>

              </div>

              <div className="
                space-y-3
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <img
                    src={
                      match.jugador1
                        ?.avatar_url ||

                      'https://placehold.co/50'
                    }
                    className="
                      w-10
                      h-10
                      rounded-full
                      object-cover
                    "
                  />

                  <span>
                    {
                      match.jugador1
                        ?.nombre
                    }
                  </span>

                </div>

                <div className="
                  text-center
                  text-zinc-500
                  text-sm
                ">
                  VS
                </div>

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <img
                    src={
                      match.jugador2
                        ?.avatar_url ||

                      'https://placehold.co/50'
                    }
                    className="
                      w-10
                      h-10
                      rounded-full
                      object-cover
                    "
                  />

                  <span>
                    {
                      match.jugador2
                        ?.nombre ||

                      'Libre'
                    }
                  </span>

                </div>

              </div>

              {
                match.ganador && (

                  <div className="
                    mt-5
                    text-green-400
                    font-semibold
                  ">
                    Ganador:
                    {' '}
                    {
                      match.ganador
                        ?.nombre
                    }
                  </div>

                )
              }

            </div>

          ))
        }

      </div>

    </div>

  )

}