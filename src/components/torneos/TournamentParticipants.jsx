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
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
                Participantes
            </h2>

            <div className="space-y-3">
                {
                    participantes.map(
                        (participante) => (
                            <div
                                key={participante.id}
                                className="border rounded p-3 flex items-center gap-3"
                            >
                                <img
                                    src={
                                        participante
                                            .profiles
                                            ?.avatar_url ||
                                        'https://placehold.co/50'
                                    }
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full"
                                />

                                <div>
                                    <p className="font-bold">
                                        {
                                            participante
                                                .profiles
                                                ?.nombre
                                        }
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {
                                            participante.estado
                                        }
                                    </p>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}