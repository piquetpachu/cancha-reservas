import { useEffect, useState } from 'react'

import TournamentCard from '../../components/torneos/TournamentCard'

import { obtenerTorneos } from '../../services/torneoService'

export default function Torneos() {
    const [torneos, setTorneos] = useState([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarTorneos()
    }, [])

    async function cargarTorneos() {
        try {
            const data = await obtenerTorneos()

            setTorneos(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p>Cargando torneos...</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Torneos
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {
                    torneos.map((torneo) => (
                        <TournamentCard
                            key={torneo.id}
                            torneo={torneo}
                        />
                    ))
                }
            </div>
        </div>
    )
}