export default function TournamentMatchCard({
    partido,
    onSelectWinner
}) {
    return (
        <div className="border rounded p-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold">
                        {
                            partido.jugador1
                                ?.nombre
                        }
                    </p>

                    <p className="text-gray-500">
                        vs
                    </p>

                    <p className="font-bold">
                        {
                            partido.jugador2
                                ?.nombre
                        }
                    </p>
                </div>

                <div>
                    <p>
                        Ronda:
                        {partido.ronda}
                    </p>

                    <p>
                        Estado:
                        {partido.estado}
                    </p>
                </div>
            </div>

            {
                !partido.ganador_id && (
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() =>
                                onSelectWinner(
                                    partido.id,
                                    partido.jugador1_id
                                )
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Gana jugador 1
                        </button>

                        <button
                            onClick={() =>
                                onSelectWinner(
                                    partido.id,
                                    partido.jugador2_id
                                )
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                            Gana jugador 2
                        </button>
                    </div>
                )
            }

            {
                partido.ganador && (
                    <div className="mt-4">
                        <p className="font-bold text-green-600">
                            Ganador:
                            {
                                partido.ganador
                                    ?.nombre
                            }
                        </p>
                    </div>
                )
            }
        </div>
    )
}