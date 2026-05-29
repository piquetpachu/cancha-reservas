import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

import SelectWinnerButton from './SelectWinnerButton'

export default function TournamentBracket({
  torneoId
}) {

  const [matches, setMatches] =
    useState([])

  const [reload, setReload] =
    useState(false)

  useEffect(() => {

    loadBracket()

  }, [reload])

  async function loadBracket() {

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

  // AGRUPAR POR RONDA
  const rounds = {}

  matches.forEach(match => {

    if (!rounds[match.ronda]) {

      rounds[match.ronda] = []

    }

    rounds[match.ronda].push(match)

  })

  return (

    <div className="
      mt-12
      overflow-x-auto
      pb-6
    ">

      <h2 className="
        text-3xl
        font-bold
        mb-8
      ">
        Bracket
      </h2>

      <div className="
        flex
        gap-10
        min-w-max
      ">

        {
          Object.entries(rounds).map(
            ([round, roundMatches]) => (

              <div
                key={round}
                className="
                  min-w-[320px]
                "
              >

                {/* TITULO */}
                <div className="
                  mb-6
                  text-center
                ">

                  <h3 className="
                    text-xl
                    font-bold
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-xl
                    py-3
                  ">
                    Ronda {round}
                  </h3>

                </div>

                {/* MATCHES */}
                <div className="
                  space-y-8
                ">

                  {
                    roundMatches.map(match => (

                      <div
                        key={match.id}
                        className="
                          bg-zinc-900
                          border
                          border-zinc-800
                          rounded-2xl
                          overflow-hidden
                          shadow-xl
                        "
                      >

                        {/* PLAYER 1 */}
                        <div className={`
                          flex
                          items-center
                          gap-3
                          p-4
                          border-b
                          border-zinc-800

                          ${
                            match.ganador_id ===
                            match.jugador1_id
                              ? 'bg-green-500/10'
                              : ''
                          }
                        `}>

                          <img
                            src={
                              match.jugador1
                                ?.avatar_url ||

                              'https://placehold.co/50'
                            }
                            alt=""
                            className="
                              w-10
                              h-10
                              rounded-full
                              object-cover
                            "
                          />

                          <span className="
                            font-medium
                          ">
                            {
                              match.jugador1
                                ?.nombre ||
                              'TBD'
                            }
                          </span>

                        </div>

                        {/* PLAYER 2 */}
                        <div className={`
                          flex
                          items-center
                          gap-3
                          p-4

                          ${
                            match.ganador_id ===
                            match.jugador2_id
                              ? 'bg-green-500/10'
                              : ''
                          }
                        `}>

                          <img
                            src={
                              match.jugador2
                                ?.avatar_url ||

                              'https://placehold.co/50'
                            }
                            alt=""
                            className="
                              w-10
                              h-10
                              rounded-full
                              object-cover
                            "
                          />

                          <span className="
                            font-medium
                          ">
                            {
                              match.jugador2
                                ?.nombre ||
                              'Libre'
                            }
                          </span>

                        </div>

                        {/* FOOTER */}
                        <div className="
                          bg-zinc-950
                          border-t
                          border-zinc-800
                          px-4
                          py-2
                          text-sm
                          text-zinc-400
                          flex
                          justify-between
                          items-center
                        ">

                          <span>
                            {
                              match.estado
                            }
                          </span>

                          {
                            match.ganador && (

                              <span className="
                                text-green-400
                                font-semibold
                              ">
                                🏆
                                {' '}
                                {
                                  match.ganador
                                    ?.nombre
                                }
                              </span>

                            )
                          }

                        </div>

                        {/* BOTONES GANADOR */}
                        {
                          match.estado !==
                            'finalizado' && (

                            <div className="
                              p-4
                              border-t
                              border-zinc-800
                              bg-zinc-950
                            ">

                              <p className="
                                text-sm
                                text-zinc-400
                                mb-3
                              ">
                                Seleccionar ganador
                              </p>

                              <SelectWinnerButton
                                match={match}
                                onUpdated={() =>
                                  setReload(
                                    prev => !prev
                                  )
                                }
                              />

                            </div>

                          )
                        }

                      </div>

                    ))
                  }

                </div>

              </div>

            )
          )
        }

      </div>

    </div>

  )

}