import { useNavigate } from 'react-router-dom'

export default function PadelHome() {

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
        mb-6
      ">
        🏓 Pádel
      </h1>

      <div className="
        grid
        gap-4
      ">

        <button
          onClick={() =>
            navigate('/torneos/padel/ranking')
          }
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-5
            text-left
          "
        >
          🏆 Ranking
        </button>

        <button
          onClick={() =>
            navigate('/torneos/padel/torneos')
          }
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-5
            text-left
          "
        >
          🏓 Torneos
        </button>

      </div>

    </div>

  )

}