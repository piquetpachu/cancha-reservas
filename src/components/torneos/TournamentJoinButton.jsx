import { useEffect, useState } from 'react'

import {
    cancelarInscripcion,
    inscribirseATorneo,
    verificarInscripcion
} from '../../services/inscripcionService'

export default function TournamentJoinButton({
    torneoId
}) {
    const [inscripto, setInscripto] =
        useState(false)

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {
        verificar()
    }, [])

    async function verificar() {
        try {
            const data =
                await verificarInscripcion(
                    torneoId
                )

            setInscripto(!!data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleJoin() {
        try {
            await inscribirseATorneo(
                torneoId
            )

            setInscripto(true)
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    async function handleCancel() {
        try {
            await cancelarInscripcion(
                torneoId
            )

            setInscripto(false)
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    if (loading) {
        return (
            <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
            >
                Cargando...
            </button>
        )
    }

    if (inscripto) {
        return (
            <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Cancelar inscripción
            </button>
        )
    }

    return (
        <button
            onClick={handleJoin}
            className="bg-green-500 text-white px-4 py-2 rounded"
        >
            Inscribirse
        </button>
    )
}