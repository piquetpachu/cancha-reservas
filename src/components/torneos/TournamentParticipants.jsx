import { useEffect, useState } from 'react'

import { obtenerParticipantes } from '../../services/inscripcionService'

export default function TournamentParticipants({
    torneoId
}) {
    const [participantes, setParticipantes] =
        useState([])

    useEffect(() => {
        cargarParticipantes()
    }, [])

    async function cargarParticipantes() {
        try {
            const data =
                await obtenerParticipantes(
                    torneoId
                )

            setParticipantes(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                    Participantes
                </h2>

                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {participantes.length} jugadores
                </span>
            </div>

            <div className="flex flex-wrap gap-3">

                {
                    participantes.map(
                        (participante) => (
                            <div
                                key={participante.id}
                                className="
                                    flex items-center gap-3
                                    bg-gray-50
                                    border
                                    rounded-full
                                    px-4 py-2
                                    hover:shadow
                                    transition
                                "
                            >

                                <img
                                    src={
                                        participante
                                            .profiles
                                            ?.avatar_url ||
                                        'https://placehold.co/40'
                                    }
                                    alt="avatar"
                                    className="
                                        w-8 h-8
                                        rounded-full
                                        object-cover
                                    "
                                />

                                <div>
                                    <p className="font-medium text-sm">
                                        {
                                            participante
                                                .profiles
                                                ?.nombre
                                        }
                                    </p>
                                </div>

                                <span
                                    className={`
                                        text-xs px-2 py-1 rounded-full
                                        ${
                                            participante.estado ===
                                            'aprobada'
                                                ? 'bg-green-100 text-green-700'
                                                : participante.estado ===
                                                  'rechazada'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }
                                    `}
                                >
                                    {
                                        participante.estado
                                    }
                                </span>

                            </div>
                        )
                    )
                }

            </div>

        </div>
    )
}