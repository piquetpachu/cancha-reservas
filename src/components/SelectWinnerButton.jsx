import { supabase } from '../supabaseClient'

export default function SelectWinnerButton({

  match,
  onUpdated

}) {

  async function selectWinner(
    winnerId
  ) {

    try {

      // ACTUALIZAR MATCH
      const { error } =
        await supabase
          .from('partidos_torneo')
          .update({

            ganador_id:
              winnerId,

            estado:
              'finalizado'

          })
          .eq('id', match.id)

      if (error) {

        console.error(error)

        alert(error.message)

        return

      }

      // CREAR SIGUIENTE RONDA
      await avanzarGanador(
        winnerId
      )

      onUpdated()

    } catch (err) {

      console.error(err)

    }

  }

  async function avanzarGanador(
    winnerId
  ) {

    const nextRound =
      match.ronda + 1

    // BUSCAR MATCH INCOMPLETO
    const {
      data: existingMatch
    } = await supabase
      .from('partidos_torneo')
      .select('*')
      .eq(
        'torneo_id',
        match.torneo_id
      )
      .eq(
        'ronda',
        nextRound
      )
      .is('jugador2_id', null)
      .limit(1)
      .maybeSingle()

    // SI EXISTE:
    // agregar jugador2
    if (existingMatch) {

      await supabase
        .from('partidos_torneo')
        .update({

          jugador2_id:
            winnerId

        })
        .eq(
          'id',
          existingMatch.id
        )

      return

    }

    // SI NO EXISTE:
    // crear nuevo partido
    await supabase
      .from('partidos_torneo')
      .insert({

        torneo_id:
          match.torneo_id,

        jugador1_id:
          winnerId,

        ronda:
          nextRound,

        estado:
          'pendiente'

      })

  }

  return (

    <div className="
      flex
      gap-2
      mt-4
    ">

      {
        match.jugador1 && (

          <button
            onClick={() =>
              selectWinner(
                match.jugador1_id
              )
            }
            className="
              flex-1
              bg-blue-600
              hover:bg-blue-500
              py-2
              rounded-lg
              text-sm
              font-medium
            "
          >
            {
              match.jugador1
                ?.nombre
            }
          </button>

        )
      }

      {
        match.jugador2 && (

          <button
            onClick={() =>
              selectWinner(
                match.jugador2_id
              )
            }
            className="
              flex-1
              bg-purple-600
              hover:bg-purple-500
              py-2
              rounded-lg
              text-sm
              font-medium
            "
          >
            {
              match.jugador2
                ?.nombre
            }
          </button>

        )
      }

    </div>

  )

}