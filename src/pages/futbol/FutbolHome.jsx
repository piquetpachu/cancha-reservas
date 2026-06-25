import { useNavigate } from 'react-router-dom'

export default function FutbolHome() {

  const navigate = useNavigate()

  return (

    <div className="
      min-h-screen
      bg-zinc-950
      text-white
      p-4
    ">

      <h1 className="
        text-3xl
        font-bold
        mb-8
      ">
        ⚽ Fútbol
      </h1>

      <div className="
        grid
        md:grid-cols-2
        gap-4
      ">

        <div
          onClick={() =>
            navigate('/torneos/futbol/torneos')
          }
          className="
            bg-zinc-900
            rounded-3xl
            p-6
            cursor-pointer
            hover:border-green-500
            border
            border-zinc-800
          "
        >
          🏆 Torneos
        </div>

        <div
          onClick={() =>
            navigate('/torneos/futbol/ranking')
          }
          className="
            bg-zinc-900
            rounded-3xl
            p-6
            cursor-pointer
            hover:border-green-500
            border
            border-zinc-800
          "
        >
          📈 Ranking
        </div>

        <div
          onClick={() =>
            navigate('/torneos/futbol/equipos')
          }
          className="
            bg-zinc-900
            rounded-3xl
            p-6
            cursor-pointer
            hover:border-green-500
            border
            border-zinc-800
          "
        >
          👥 Equipos
        </div>

        <div
          onClick={() =>
            navigate('/torneos/futbol/mis-equipos')
          }
          className="
            bg-zinc-900
            rounded-3xl
            p-6
            cursor-pointer
            hover:border-green-500
            border
            border-zinc-800
          "
        >
          ⭐ Mis Equipos
        </div>

      </div>
<div
  onClick={() =>
    navigate(
      '/torneos/futbol/invitaciones'
    )
  }
  className="
    bg-zinc-900
    border
    border-zinc-800
    rounded-2xl
    p-5
    cursor-pointer
  "
>
  <h3 className="font-bold">
    Invitaciones
  </h3>

  <p className="text-zinc-400">
    Gestionar invitaciones
  </p>
</div>
      <button
        onClick={() =>
          navigate('/torneos/futbol/nuevo')
        }
        className="
          mt-8
          w-full
          bg-green-600
          hover:bg-green-500
          py-4
          rounded-2xl
          font-bold
        "
      >
        Crear Torneo
      </button>

    </div>

  )

}