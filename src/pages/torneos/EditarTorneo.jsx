import { useEffect, useState } from 'react'

import {
    useNavigate,
    useParams
} from 'react-router-dom'

import TournamentForm from '../../components/torneos/TournamentForm'

import {
    actualizarTorneo,
    obtenerTorneoPorId
} from '../../services/torneoService'

export default function EditarTorneo() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [torneo, setTorneo] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarTorneo()
    }, [id])

    async function cargarTorneo() {
        try {
            const data =
                await obtenerTorneoPorId(id)

            setTorneo(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdate(form) {
        try {
            await actualizarTorneo(id, form)

            navigate(`/torneos/${id}`)
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p>Cargando torneo...</p>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                Editar torneo
            </h1>

            <TournamentForm
                initialData={torneo}
                onSubmit={handleUpdate}
                submitText="Actualizar torneo"
            />
        </div>
    )
}