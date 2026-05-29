import { useEffect, useState } from 'react'

import { obtenerParticipantes }
from '../../services/inscripcionService'

export default function TournamentParticipants({
    torneoId
}) {

    const [
        participantes,
        setParticipantes
    ] = useState([])

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

            setParticipantes(
                data || []
            )

        } catch (error) {

            console.error(error)

        } finally {

            setLoading(false)

        }

    }

    if (loading) {

        return (
            <div className="
                flex
                justify-center
                py-10
            ">
                <p className="text-gray-400">
                    Cargando participantes...
                </p>
            </div>
        )

    }

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="
                flex
                items-center
                justify-between
                flex-wrap
                gap-4
            ">

                <div>

                    <h2 className="
                        text-2xl
                        font-bold
                        text-white
                    ">
                        Participantes
                    </h2>

                    <p className="
                        text-gray-400
                        mt-1
                    ">
                        Jugadores inscriptos
                    </p>

                </div>

                <div className="
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-500/10
                    border
                    border-blue-500/20
                    text-blue-400
                    font-semibold
                ">

                    {participantes.length}
                    {' '}
                    participantes

                </div>

            </div>

            {/* CONTENEDOR */}

            <div className="
                bg-[#111827]
                border
                border-gray-800
                rounded-3xl
                p-6
            ">

                <div className="
                    flex
                    flex-wrap
                    gap-6
                ">

                    {
                        participantes.map(
                            (participante) => {

                                const profile =
                                    participante.profiles

                                return (

                                    <div
                                        key={
                                            participante.id
                                        }
                                        className="
                                            flex
                                            flex-col
                                            items-center
                                            gap-2
                                            w-[85px]
                                            group
                                        "
                                    >

                                        {/* FOTO */}

                                        <div className="
                                            relative
                                        ">

                                            <img
                                                src={
                                                    profile?.avatar_url ||
                                                    'https://placehold.co/80'
                                                }
                                                alt="avatar"
                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-full
                                                    object-cover
                                                    border-2
                                                    border-[#1F2937]
                                                    transition
                                                    group-hover:border-blue-500
                                                    group-hover:scale-105
                                                "
                                            />

                                            <div className="
                                                absolute
                                                bottom-0
                                                right-0
                                                w-3
                                                h-3
                                                rounded-full
                                                bg-green-400
                                                border-2
                                                border-[#111827]
                                            " />

                                        </div>

                                        {/* NOMBRE */}

                                        <p className="
                                            text-xs
                                            text-center
                                            text-gray-300
                                            truncate
                                            w-full
                                        ">

                                            {
                                                profile?.nombre ||
                                                'Usuario'
                                            }

                                        </p>

                                    </div>

                                )

                            }
                        )
                    }

                </div>

            </div>

        </div>
    )

}