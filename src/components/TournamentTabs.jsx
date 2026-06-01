export default function TournamentTabs({

  activeTab,
  setActiveTab

}) {

  return (

    <div
      className="
        flex
        gap-2
        bg-zinc-900
        p-2
        rounded-2xl
        border
        border-zinc-800
        mb-6
      "
    >

      <button
        onClick={() =>
          setActiveTab(
            'participants'
          )
        }
        className={`
          flex-1
          py-3
          rounded-xl
          transition

          ${
            activeTab ===
            'participants'
              ? 'bg-blue-600'
              : 'bg-zinc-800'
          }
        `}
      >
        👥 Inscriptos
      </button>

      <button
        onClick={() =>
          setActiveTab(
            'bracket'
          )
        }
        className={`
          flex-1
          py-3
          rounded-xl
          transition

          ${
            activeTab ===
            'bracket'
              ? 'bg-blue-600'
              : 'bg-zinc-800'
          }
        `}
      >
        🏆 Bracket
      </button>

      <button
        onClick={() =>
          setActiveTab(
            'matches'
          )
        }
        className={`
          flex-1
          py-3
          rounded-xl
          transition

          ${
            activeTab ===
            'matches'
              ? 'bg-blue-600'
              : 'bg-zinc-800'
          }
        `}
      >
        ⚽ Partidos
      </button>

    </div>

  )

}