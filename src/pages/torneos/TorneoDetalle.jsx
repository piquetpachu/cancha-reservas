import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { supabase } from '../../supabaseClient'

import TournamentJoinButton from '../../components/TournamentJoinButton'
import TournamentParticipants from '../../components/TournamentParticipants'
import GenerateBracketButton from '../../components/GenerateBracketButton'

import TournamentMatches from '../../components/TournamentMatches'
import TournamentBracket from '../../components/TournamentBracket'
export default function TorneoDetalle() {

  const { id } = useParams()

  const [torneo, setTorneo] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    loadTorneo()

  }, [])

  async function loadTorneo() {

    const { data, error } =
      await supabase
        .from('torneos')
        .select(`
          *,
          clubs (
            nombre
          )
        `)
        .eq('id', id)
        .single()

    if (error) {
      console.error(error)
    } else {
      setTorneo(data)
    }

    setLoading(false)

  }

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-zinc-950
        text-white
        p-6
      ">
        Cargando torneo...
      </div>
    )

  }

  if (!torneo) {

    return (
      <div className="
        min-h-screen
        bg-zinc-950
        text-white
        p-6
      ">
        Torneo no encontrado
      </div>
    )

  }

  return (

    <div className="
      min-h-screen
      bg-zinc-950
      text-white
      pb-24
    ">

      {/* HERO */}
      <div className="relative">

        <img
          src={
            torneo.imagen_url ||
            'https://placehold.co/1200x500'
          }
          alt={torneo.nombre}
          className="
            w-full
            h-[300px]
            object-cover
          "
        />

        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-zinc-950
          to-transparent
        " />

      </div>

      {/* CONTENIDO */}
      <div className="
        max-w-5xl
        mx-auto
        px-4
        -mt-20
        relative
        z-10
      ">

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          overflow-hidden
          shadow-2xl
        ">

          <div className="p-6 md:p-8">

            {/* TITULO */}
            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            ">

              <div>

                <p className="
                  text-sm
                  text-blue-400
                  mb-2
                ">
                  {
                    torneo.clubs?.nombre
                  }
                </p>

                <h1 className="
                  text-4xl
                  font-bold
                ">
                  {torneo.nombre}
                </h1>

              </div>

              <TournamentJoinButton
                torneo={torneo}
              />

            </div>

            {/* DESCRIPCION */}
            <div className="mt-8">

              <p className="
                text-zinc-300
                leading-relaxed
              ">
                {torneo.descripcion}
              </p>

            </div>

            {/* INFO */}
            <div className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mt-10
            ">

              <div className="
                bg-zinc-800
                rounded-2xl
                p-4
              ">

                <p className="
                  text-zinc-400
                  text-sm
                ">
                  Cupo
                </p>

                <h3 className="
                  text-2xl
                  font-bold
                  mt-2
                ">
                  {
                    torneo.cupo_maximo
                  }
                </h3>

              </div>

              <div className="
                bg-zinc-800
                rounded-2xl
                p-4
              ">

                <p className="
                  text-zinc-400
                  text-sm
                ">
                  Inicio
                </p>

                <h3 className="
                  text-lg
                  font-bold
                  mt-2
                ">
                  {
                    torneo.fecha_inicio
                  }
                </h3>

              </div>

              <div className="
                bg-zinc-800
                rounded-2xl
                p-4
              ">

                <p className="
                  text-zinc-400
                  text-sm
                ">
                  Finaliza
                </p>

                <h3 className="
                  text-lg
                  font-bold
                  mt-2
                ">
                  {
                    torneo.fecha_fin
                  }
                </h3>

              </div>

              <div className="
                bg-zinc-800
                rounded-2xl
                p-4
              ">

                <p className="
                  text-zinc-400
                  text-sm
                ">
                  Estado
                </p>

                <h3 className="
                  text-green-400
                  text-lg
                  font-bold
                  mt-2
                ">
                  {
                    torneo.estado ||
                    'Abierto'
                  }
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>
<TournamentParticipants
  torneoId={torneo.id}
/><div className="mt-10">

  <GenerateBracketButton
    torneoId={torneo.id}
  />

</div>

<TournamentMatches
  torneoId={torneo.id}
/>
<TournamentBracket
  torneoId={torneo.id}
/>
    </div>

  )

}
