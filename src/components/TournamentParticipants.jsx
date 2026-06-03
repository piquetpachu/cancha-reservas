import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export default function TournamentParticipants({
  torneoId
}) {

  const [participantes, setParticipantes] =
    useState([])

  const [loading, setLoading] =
    useState(true)
const [torneo, setTorneo] =
  useState(null)

const [equipos, setEquipos] =
  useState([])
  useEffect(() => {

    loadData()

  }, [])
  async function loadData() {

  const {
    data: torneoData
  } = await supabase
    .from('torneos')
    .select('*')
    .eq('id', torneoId)
    .single()

  setTorneo(torneoData)
console.log(
  'TORNEO:',
  torneoData
)
  if (
    torneoData?.tipo_participacion ===
    'equipo'
  ) {

    loadEquipos()

  } else {

    loadParticipantes()

  }

}
async function loadEquipos() {

  const {
    data: equiposData,
    error
  } = await supabase
    .from('equipos_torneo')
    .select('*')
    .eq('torneo_id', torneoId)

  if (error) {

    console.error(error)

    setLoading(false)

    return
  }

  const equiposConIntegrantes =
    await Promise.all(

      equiposData.map(
        async (equipo) => {

          const {
  data: integrantes,
  error: integrantesError
} = await supabase
  .from('equipo_integrantes')
  .select('*')
  .eq('equipo_id', equipo.id)

console.log(
  'EQUIPO:',
  equipo.nombre
)

console.log(
  'INTEGRANTES:',
  integrantes
)

console.log(
  'ERROR:',
  integrantesError
)
const integrantesConPerfil =
  await Promise.all(

    (integrantes || []).map(
      async (integrante) => {

        const {
          data: perfil
        } = await supabase
          .from('profiles')
          .select(`
            nombre,
            avatar_url
          `)
          .eq(
            'id',
            integrante.usuario_id
          )
          .single()

        return {
          ...integrante,
          profile: perfil
        }

      }
    )

  )
          return {

  ...equipo,

  integrantes:
    integrantesConPerfil

}

        }
      )

    )

  setEquipos(
    equiposConIntegrantes
  )

  setLoading(false)

}

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
if (
  torneo?.tipo_participacion ===
  'equipo'
) {

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
          Equipos
        </h2>

        <div className="
          bg-purple-600
          px-4
          py-2
          rounded-xl
          font-semibold
        ">
          {equipos.length}
        </div>

      </div>

      <div className="
        space-y-4
      ">

        {
          equipos.map(
            equipo => (

              <div
                key={equipo.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  p-5
                "
              >

                <h3 className="
                  text-xl
                  font-bold
                  mb-4
                ">
                  🏆 {equipo.nombre}
                </h3>

                <div className="
                  grid
                  md:grid-cols-2
                  gap-3
                ">

                  {
                    equipo.integrantes
                      .map(
                        integrante => (

                          <div
                            key={
                              integrante.usuario_id
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              bg-zinc-800
                              rounded-xl
                              p-3
                            "
                          >

                            <img
                              src={
                                integrante
                                  .profile
                                  ?.avatar_url ||

                                'https://placehold.co/50'
                              }
                              alt=""
                              className="
                                w-10
                                h-10
                                rounded-full
                              "
                            />

                            <span>
                              {
                                integrante
                                  .profile
                                  ?.nombre
                              }
                            </span>

                          </div>

                        )
                      )
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