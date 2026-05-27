import { useEffect, useState } from 'react'

import { obtenerPartidos } from '../../services/partidoService'

import BracketRound from './BracketRound'

export default function TournamentBracket({
    torneoId
}) {
    const [partidos, setPartidos] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {
        cargarPartidos()
    }, [torneoId])

    async function cargarPartidos() {
        try {
            const data =
                await obtenerPartidos(
                    torneoId
                )

            setPartidos(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    function agruparPorRonda() {
        const rondas = {}

        partidos.forEach((partido) => {
            if (!rondas[partido.ronda]) {
                rondas[partido.ronda] = []
            }

            rondas[partido.ronda].push(
                partido
            )
        })

        return rondas
    }

    if (loading) {
        return (
            <div className="mt-10">
                <p>Cargando bracket...</p>
            </div>
        )
    }

    const rondas = agruparPorRonda()

    return (
        <div className="mt-14 w-full overflow-x-auto pb-4">
            <h2 className="text-3xl font-bold mb-8">
                Bracket del torneo
            </h2>

            <div className="flex gap-16 items-start min-w-max">
                {
                    Object.entries(rondas).map(
                        (
                            [
                                ronda,
                                partidos
                            ]
                        ) => (
                            <BracketRound
                                key={ronda}
                                ronda={ronda}
                                partidos={partidos}
                            />
                        )
                    )
                }
            </div>
        </div>
    )
}