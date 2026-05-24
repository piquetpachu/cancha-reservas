import { useEffect, useState } from 'react'

import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom'

import {
    eliminarTorneo,
    obtenerTorneoPorId
} from '../../services/torneoService'

export default function TorneoDetalle() {
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

    async function handleDelete() {
        const ok = confirm(
            '¿Eliminar torneo?'
        )

        if (!ok) return

        try {
            await eliminarTorneo(id)

            navigate('/torneos')
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

    if (!torneo) {
        return (
            <div className="p-6">
                <p>Torneo no encontrado</p>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <img
                src={
                    torneo.imagen_url ||
                    'https://placehold.co/1000x400'
                }
                alt={torneo.nombre}
                className="w-full h-96 object-cover rounded"
            />

            <h1 className="text-4xl font-bold mt-6">
                {torneo.nombre}
            </h1>

            <p className="mt-4">
                {torneo.descripcion}
            </p>

            <div className="mt-6 space-y-2">
                <p>
                    Cupo máximo:
                    {torneo.cupo_maximo}
                </p>

                <p>
                    Fecha inicio:
                    {torneo.fecha_inicio}
                </p>

                <p>
                    Fecha fin:
                    {torneo.fecha_fin}
                </p>
            </div>

            <div className="flex gap-4 mt-8">
                <Link
                    to={`/dashboard/torneos/${torneo.id}/editar`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                    Editar
                </Link>

                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}