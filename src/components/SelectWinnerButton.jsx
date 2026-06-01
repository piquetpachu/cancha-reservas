import { supabase } from '../supabaseClient'

export default function SelectWinnerButton({

  match,
  onUpdated

}) {

  async function selectWinner(
    winnerId
  ) {

    try {

      // EVITAR DOBLE FINALIZACIÓN
      if (
        match.estado ===
        'finalizado'
      ) {

        alert(
          'Este partido ya fue finalizado'
        )

        return

      }

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

      // AVANZAR GANADOR
      await avanzarGanador(
        winnerId
      )

      // ACTUALIZAR STATS
      await actualizarStats(
        winnerId
      )

      // VERIFICAR CAMPEÓN
      await verificarCampeon(
        winnerId
      )

      onUpdated()

    } catch (err) {

      console.error(err)

    }

  }

  // =========================
  // AVANZAR GANADOR
  // =========================
  async function avanzarGanador(
    winnerId
  ) {

    const nextRound =
      match.ronda + 1

    // BUSCAR MATCH
    // CON SLOT LIBRE
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

  // =========================
  // ACTUALIZAR ESTADÍSTICAS
  // =========================
  async function actualizarStats(
    winnerId
  ) {

    // GANADOR
    const {
      data: winnerProfile
    } = await supabase
      .from('profiles')
      .select(`
        victorias_torneo,
        partidos_torneo_jugados
      `)
      .eq('id', winnerId)
      .single()

    if (winnerProfile) {

      await supabase
        .from('profiles')
        .update({

          victorias_torneo:
            (
              winnerProfile
                .victorias_torneo || 0
            ) + 1,

          partidos_torneo_jugados:
            (
              winnerProfile
                .partidos_torneo_jugados || 0
            ) + 1

        })
        .eq('id', winnerId)

    }

    // PERDEDOR
    const loserId =
      match.jugador1_id ===
      winnerId
        ? match.jugador2_id
        : match.jugador1_id

    if (!loserId) return

    const {
      data: loserProfile
    } = await supabase
      .from('profiles')
      .select(`
        derrotas_torneo,
        partidos_torneo_jugados
      `)
      .eq('id', loserId)
      .single()

    if (loserProfile) {

      await supabase
        .from('profiles')
        .update({

          derrotas_torneo:
            (
              loserProfile
                .derrotas_torneo || 0
            ) + 1,

          partidos_torneo_jugados:
            (
              loserProfile
                .partidos_torneo_jugados || 0
            ) + 1

        })
        .eq('id', loserId)

    }

  }

  // =========================
  // VERIFICAR CAMPEÓN
  // =========================
  async function verificarCampeon(
    winnerId
  ) {

    // BUSCAR PARTIDOS
    // PENDIENTES
    const {
      data: pendientes
    } = await supabase
      .from('partidos_torneo')
      .select('id')
      .eq(
        'torneo_id',
        match.torneo_id
      )
      .neq(
        'estado',
        'finalizado'
      )

    // SI NO HAY MÁS:
    // tenemos campeón
    if (
      pendientes &&
      pendientes.length === 0
    ) {

      // ACTUALIZAR TORNEO
      await supabase
        .from('torneos')
        .update({

          estado:
            'finalizado',

          campeon_id:
            winnerId

        })
        .eq(
          'id',
          match.torneo_id
        )

      // SUMAR TÍTULO
      const {
        data: champion
      } = await supabase
        .from('profiles')
        .select('titulos_torneo')
        .eq('id', winnerId)
        .single()

      await supabase
        .from('profiles')
        .update({

          titulos_torneo:
            (
              champion
                ?.titulos_torneo || 0
            ) + 1

        })
        .eq('id', winnerId)

      alert(
        '🏆 Tenemos campeón del torneo'
      )

    }

  }

  return (

    <div className="
      flex
      gap-2
      mt-4
    ">

      {
        match.jugador1 &&
        match.estado !==
          'finalizado' && (

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
              transition
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
        match.jugador2 &&
        match.estado !==
          'finalizado' && (

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
              transition
            "
          >
            {
              match.jugador2
                ?.nombre
            }
          </button>

        )
      }

      {
        match.estado ===
          'finalizado' && (

          <div className="
            w-full
            text-center
            py-2
            rounded-lg
            bg-green-500/10
            border
            border-green-500/20
            text-green-400
            text-sm
            font-medium
          ">
            Partido finalizado
          </div>

        )
      }

    </div>

  )

}