export default function TournamentStats({

  participantes,
  maxJugadores,
  partidos

}) {

  return (

    <div
      className="
        grid
        md:grid-cols-3
        gap-4
        mb-8
      "
    >

      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-5
        "
      >

        <p className="text-zinc-400">
          Participantes
        </p>

        <h3 className="text-3xl font-bold">
          {participantes}
          /
          {maxJugadores}
        </h3>

      </div>

      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-5
        "
      >

        <p className="text-zinc-400">
          Partidos
        </p>

        <h3 className="text-3xl font-bold">
          {partidos}
        </h3>

      </div>

      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-5
        "
      >

        <p className="text-zinc-400">
          Estado
        </p>

        <h3 className="text-xl font-bold">
          Activo
        </h3>

      </div>

    </div>

  )

}