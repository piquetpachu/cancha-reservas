import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import TournamentCard from '../../components/torneos/TournamentCard'

import { supabase } from '../../supabaseClient'

export default function DashboardTorneos() {
    const [torneos, setTorneos] = useState([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarTorneos()
    }, [])

    async function cargarTorneos() {
        try {
            const {
                data: { user }
            } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('torneos')
                .select('*')
                .eq('owner_id', user.id)

            if (error) {
                throw error
            }

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
                <p>Cargando...</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Mis Torneos
                </h1>

                <Link
                    to="/dashboard/torneos/nuevo"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Crear torneo
                </Link>
            </div>

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