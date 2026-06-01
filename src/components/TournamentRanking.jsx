import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export default function TournamentRanking({
  torneoId
}) {

  const [ranking, setRanking] =
    useState([])

  useEffect(() => {

    loadRanking()

  }, [])

  async function loadRanking() {

    const { data, error } =
      await supabase
        .from(
          'estadisticas_torneo'
        )
        .select(`
          *,
          profile:usuario_id (
            nombre,
            avatar_url
          )
        `)
        .eq(
          'torneo_id',
          torneoId
        )
        .order(
          'victorias',
          { ascending: false }
        )

    if (error) {

      console.error(error)

    } else {

      setRanking(data)

    }

  }

  return (

    <div className="mt-12">

      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">
        Ranking
      </h2>

      <div className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        overflow-hidden
      ">

        {
          ranking.map(
            (player, index) => {

              const winrate =
                player.partidos_jugados
                  ? Math.round(
                      (
                        player.victorias /
                        player.partidos_jugados
                      ) * 100
                    )
                  : 0

              return (

                <div
                  key={player.id}
                  className="
                    flex
                    items-center
                    justify-between
                    p-4
                    border-b
                    border-zinc-800
                  "
                >

                  <div className="
                    flex
                    items-center
                    gap-4
                  ">

                    <div className="
                      w-10
                      text-center
                      font-bold
                      text-zinc-400
                    ">

                      #{index + 1}

                    </div>

                    <img
                      src={
                        player.profile
                          ?.avatar_url ||

                        'https://placehold.co/50'
                      }
                      className="
                        w-12
                        h-12
                        rounded-full
                        object-cover
                      "
                    />

                    <div>

                      <h3 className="
                        font-semibold
                      ">
                        {
                          player.profile
                            ?.nombre
                        }
                      </h3>

                      <p className="
                        text-sm
                        text-zinc-500
                      ">
                        {
                          player.partidos_jugados
                        }
                        {' '}
                        partidos
                      </p>

                    </div>

                  </div>

                  <div className="
                    flex
                    items-center
                    gap-6
                    text-sm
                  ">

                    <div className="
                      text-green-400
                    ">
                      {player.victorias}W
                    </div>

                    <div className="
                      text-red-400
                    ">
                      {player.derrotas}L
                    </div>

                    <div className="
                      text-blue-400
                      font-semibold
                    ">
                      {winrate}%
                    </div>

                  </div>

                </div>

              )

            }
          )
        }

      </div>

    </div>

  )

}