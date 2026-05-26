export default function BracketMatch({
    partido
}) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow min-w-[220px]">
            <div className="space-y-2">
                <div
                    className={`
                        p-2 rounded border
                        ${
                            partido.ganador_id ===
                            partido.jugador1_id
                                ? 'bg-green-100 border-green-500'
                                : ''
                        }
                    `}
                >
                    <p className="font-semibold">
                        {
                            partido.jugador1
                                ?.nombre ||
                            'Pendiente'
                        }
                    </p>
                </div>

                <div
                    className={`
                        p-2 rounded border
                        ${
                            partido.ganador_id ===
                            partido.jugador2_id
                                ? 'bg-green-100 border-green-500'
                                : ''
                        }
                    `}
                >
                    <p className="font-semibold">
                        {
                            partido.jugador2
                                ?.nombre ||
                            'Pendiente'
                        }
                    </p>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Estado:
                {' '}
                {partido.estado}
            </div>
        </div>
    )
}