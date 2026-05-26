import { useEffect, useState } from 'react'

import TournamentMatchCard from './TournamentMatchCard'

import {
    actualizarGanador,
    obtenerPartidos
} from '../../services/partidoService'

export default function TournamentMatches({
    torneoId
}) {
    const [partidos, setPartidos] =
        useState([])

    useEffect(() => {
        cargarPartidos()
    }, [])

    async function cargarPartidos() {
        try {
            const data =
                await obtenerPartidos(
                    torneoId
                )

            setPartidos(data)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleWinner(
        partidoId,
        ganadorId
    ) {
        try {
            await actualizarGanador(
                partidoId,
                ganadorId
            )

            setPartidos((prev) =>
                prev.map((p) =>
                    p.id === partidoId
                        ? {
                              ...p,
                              ganador_id:
                                  ganadorId,
                              estado:
                                  'finalizado'
                          }
                        : p
                )
            )
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
                Partidos
            </h2>

            <div className="space-y-4">
                {
                    partidos.map((partido) => (
                        <TournamentMatchCard
                            key={partido.id}
                            partido={partido}
                            onSelectWinner={
                                handleWinner
                            }
                        />
                    ))
                }
            </div>
        </div>
    )
}