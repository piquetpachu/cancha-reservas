import { useState } from 'react'

import { supabase } from '../supabaseClient'

export default function GenerateBracketButton({
  torneoId
}) {

  const [loading, setLoading] =
    useState(false)

  async function generateBracket() {

    try {

      setLoading(true)

      // PARTICIPANTES
      const { data: participantes } =
        await supabase
          .from(
            'inscripciones_torneo'
          )
          .select(`
            usuario_id,
            profiles (
              nombre
            )
          `)
          .eq('torneo_id', torneoId)

      if (
        !participantes ||
        participantes.length < 2
      ) {

        alert(
          'Se necesitan al menos 2 participantes'
        )

        return

      }

      // MEZCLAR
      const mezclados =
        participantes.sort(
          () => Math.random() - 0.5
        )

      const partidos = []

      // CREAR PARTIDOS
      for (
        let i = 0;
        i < mezclados.length;
        i += 2
      ) {

        const jugador1 =
          mezclados[i]

        const jugador2 =
          mezclados[i + 1]

        partidos.push({

          torneo_id: torneoId,

          jugador1_id:
            jugador1?.usuario_id,

          jugador2_id:
            jugador2?.usuario_id ||

            null,

          ronda: 1,

          estado:
            jugador2
              ? 'pendiente'
              : 'finalizado',

          ganador_id:
            jugador2
              ? null
              : jugador1.usuario_id

        })

      }

      const { error } =
        await supabase
          .from('partidos_torneo')
          .insert(partidos)

      if (error) {

        console.error(error)

        alert(error.message)

        return

      }

      alert(
        'Bracket generado'
      )

      window.location.reload()

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  return (

    <button
      onClick={generateBracket}
      disabled={loading}
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

      {
        loading
          ? 'Generando...'
          : 'Generar bracket'
      }

    </button>

  )

}