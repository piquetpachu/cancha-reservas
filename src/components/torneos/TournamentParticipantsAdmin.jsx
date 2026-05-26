import { useEffect, useState } from 'react'

import {
    actualizarEstadoInscripcion,
    obtenerParticipantes
} from '../../services/inscripcionService'

export default function TournamentParticipantsAdmin({
    torneoId
}) {
    const [participantes, setParticipantes] =
        useState([])

    const [loading, setLoading] =
        useState(true)

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
        } finally {
            setLoading(false)
        }
    }

    async function handleEstado(
        inscripcionId,
        estado
    ) {
        try {
            await actualizarEstadoInscripcion(
                inscripcionId,
                estado
            )

            setParticipantes((prev) =>
                prev.map((p) =>
                    p.id === inscripcionId
                        ? {
                              ...p,
                              estado
                          }
                        : p
                )
            )
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    if (loading) {
        return (
            <div className="mt-10">
                <p>Cargando participantes...</p>
            </div>
        )
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
                Administrar participantes
            </h2>

            <div className="space-y-4">
                {
                    participantes.map(
                        (participante) => (
                            <div
                                key={participante.id}
                                className="border rounded p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold">
                                        {
                                            participante
                                                .profiles
                                                ?.nombre
                                        }
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Estado:
                                        {' '}
                                        {
                                            participante.estado
                                        }
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleEstado(
                                                participante.id,
                                                'aprobada'
                                            )
                                        }
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Aprobar
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleEstado(
                                                participante.id,
                                                'rechazada'
                                            )
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}