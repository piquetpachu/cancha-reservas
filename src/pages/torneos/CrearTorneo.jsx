import { useNavigate } from 'react-router-dom'

import TournamentForm from '../../components/torneos/TournamentForm'

import { crearTorneo } from '../../services/torneoService'

export default function CrearTorneo() {
    const navigate = useNavigate()

    async function handleCreate(form) {
        try {
            const torneo = await crearTorneo(form)

            navigate(`/torneos/${torneo.id}`)
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                Crear torneo
            </h1>

            <TournamentForm
                onSubmit={handleCreate}
            />
        </div>
    )
}