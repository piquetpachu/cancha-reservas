import { useNavigate } from 'react-router-dom'

export default function TournamentsHome() {

  const navigate = useNavigate()

  return (

    <div
      className="
        min-h-screen
        bg-zinc-950
        text-white
        p-4
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Torneos
      </h1>

      <div className="space-y-4">

        <div
          onClick={() =>
            navigate('/torneos/futbol')
          }
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            p-6
            cursor-pointer
            hover:border-green-500
            transition
          "
        >
          <h2 className="text-2xl font-bold">
            ⚽ Fútbol
          </h2>

          <p className="text-zinc-400 mt-2">
            Equipos, ligas y copas
          </p>
        </div>

        <div
          onClick={() =>
            navigate('/torneos/padel')
          }
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            p-6
            cursor-pointer
            hover:border-blue-500
            transition
          "
        >
          <h2 className="text-2xl font-bold">
            🏓 Pádel
          </h2>

          <p className="text-zinc-400 mt-2">
            Parejas, ranking y torneos
          </p>
        </div>

      </div>

    </div>

  )

}