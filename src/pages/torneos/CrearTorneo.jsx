import { useNavigate } from 'react-router-dom'

import TournamentForm from '../../components/torneos/TournamentForm'

import { crearTorneo } from '../../services/torneoService'

import {
    subirImagenTorneo
} from '../../services/storageService'

export default function CrearTorneo() {

    const navigate = useNavigate()

    async function handleCreate(form) {

        try {

            let imagen_url = ''

            if (form.imagen) {

                imagen_url =
                    await subirImagenTorneo(
                        form.imagen
                    )

            }

            const torneo =
                await crearTorneo({
                    nombre: form.nombre,
                    descripcion:
                        form.descripcion,
                    cupo_maximo:
                        form.cupo_maximo,
                    fecha_inicio:
                        form.fecha_inicio,
                    fecha_fin:
                        form.fecha_fin,
                    imagen_url
                })

            navigate(
                `/torneos/${torneo.id}`
            )

        } catch (error) {

            console.error(error)

            alert(error.message)

        }

    }

    return (
        <div className="
            min-h-screen
            bg-[#0B1020]
            text-white
            p-6
        ">

            <div className="
                max-w-3xl
                mx-auto
            ">

                <h1 className="
                    text-4xl
                    font-bold
                    mb-8
                ">
                    Crear torneo
                </h1>

                <TournamentForm
                    onSubmit={handleCreate}
                />

            </div>

        </div>
    )

}