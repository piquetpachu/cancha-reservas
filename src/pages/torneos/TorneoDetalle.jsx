import { useEffect, useState } from 'react'

import {
  useParams,
  Link,
  useNavigate
} from 'react-router-dom'

import { supabase } from '../../supabaseClient'

import TournamentJoinButton from '../../components/TournamentJoinButton'
import TournamentParticipants from '../../components/TournamentParticipants'
import GenerateBracketButton from '../../components/GenerateBracketButton'
import TournamentTeamRegistration from '../../components/TournamentTeamRegistration'
import TournamentTabs
from '../../components/TournamentTabs'

import TournamentStats
from '../../components/TournamentStats'
import TournamentMatches from '../../components/TournamentMatches'
import TournamentBracket from '../../components/TournamentBracket'
import TournamentRanking from '../../components/TournamentRanking'
import AdminParticipantesTorneo
from '../../components/AdminParticipantesTorneo'

import {
  eliminarTorneo
} from '../../services/torneoService'
export default function TorneoDetalle() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [torneo, setTorneo] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

    const [user, setUser] =
  useState(null)

  const [activeTab, setActiveTab] =
  useState('participants')

const [matchesCount, setMatchesCount] =
  useState(0)

const [participantsCount,
  setParticipantsCount
] = useState(0)

  useEffect(() => {

    loadTorneo()

  }, [])

  async function loadTorneo() {
      const { data: authData } =
    await supabase.auth.getUser()

  setUser(authData.user)

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
      const {
  count: participantes
} = await supabase
  .from(
    'inscripciones_torneo'
  )
  .select('*', {
    count: 'exact',
    head: true
  })
  .eq('torneo_id', id)

setParticipantsCount(
  participantes || 0
)

const {
  count: partidos
} = await supabase
  .from('partidos_torneo')
  .select('*', {
    count: 'exact',
    head: true
  })
  .eq('torneo_id', id)

setMatchesCount(
  partidos || 0
)
    }

    setLoading(false)

  }

  async function handleDelete() {

  const ok = confirm(
    '¿Eliminar torneo?'
  )

  if (!ok) return

  try {

    await eliminarTorneo(id)

    navigate('/torneos')

  } catch (error) {

    console.error(error)

    alert(error.message)

  }

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
const canManage =

  user &&
  (
    user.id === torneo.creador_id
  )
  console.log(torneo)
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

              <div className="
  flex
  gap-3
  flex-wrap
">

{
  torneo.tipo_participacion ===
  'equipo'
    ? (
        <TournamentTeamRegistration
          torneo={torneo}
        />
      )
    : (
        <TournamentJoinButton
          torneo={torneo}
        />
      )
}

  {
    canManage && (
      <>

        <Link
          to={`/torneos/${torneo.id}/editar`}
          className="
            bg-yellow-500
            hover:bg-yellow-400
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Editar
        </Link>

        <button
          onClick={handleDelete}
          className="
            bg-red-600
            hover:bg-red-500
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Eliminar
        </button>

      </>
    )
  }

</div>

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
    Modalidad
  </p>

  <h3 className="
    text-lg
    font-bold
    mt-2
  ">
    {
      torneo.tipo_participacion
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
    Integrantes
  </p>

  <h3 className="
    text-lg
    font-bold
    mt-2
  ">
    {
      torneo.cantidad_integrantes
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
        <div className="
  max-w-5xl
  mx-auto
  px-4
  mt-8
">

  <TournamentStats
    participantes={
      participantsCount
    }
    maxJugadores={
      torneo.cupo_maximo
    }
    partidos={
      matchesCount
    }
  />

  <TournamentTabs
    activeTab={activeTab}
    setActiveTab={
      setActiveTab
    }
  />

</div>

      </div>
<div className="
  max-w-5xl
  mx-auto
  px-4
  mt-8
">

  {
    activeTab ===
    'participants' && (

      <>

        <TournamentParticipants
          torneoId={
            torneo.id
          }
        />

        {
          canManage && (

            <AdminParticipantesTorneo
              torneoId={
                torneo.id
              }
            />

          )
        }

      </>

    )
  }

  {
    activeTab ===
    'bracket' && (

      <>

        {
          canManage && (

            <div
              className="
                mb-6
              "
            >

              <GenerateBracketButton
                torneoId={
                  torneo.id
                }
              />

            </div>

          )
        }

        <TournamentBracket
          torneoId={
            torneo.id
          }
        />

      </>

    )
  }

  {
    activeTab ===
    'matches' && (

      <>

        <TournamentMatches
          torneoId={
            torneo.id
          }
        />

        <div
          className="
            mt-8
          "
        >

          <TournamentRanking
            torneoId={
              torneo.id
            }
          />

        </div>

      </>

    )
  }

</div>
    </div>
    

  )

}
