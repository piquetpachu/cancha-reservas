import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { supabase } from '../../supabaseClient'

import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function ProfileTournaments({
    userId
}) {

    const [torneos, setTorneos] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {

        cargarTorneos()

    }, [])

    async function cargarTorneos() {

        try {

            const { data, error } =
                await supabase
                    .from(
                        'inscripciones_torneo'
                    )
                    .select(`
                        *,
                        torneos (
                            *
                        )
                    `)
                    .eq(
                        'usuario_id',
                        userId
                    )

            if (error) {
                throw error
            }

            setTorneos(data || [])

        } catch (error) {

            console.error(error)

        } finally {

            setLoading(false)

        }

    }

    if (loading) {

        return (
            <Card>
                <p>
                    Cargando torneos...
                </p>
            </Card>
        )

    }

    if (torneos.length === 0) {

        return (
            <Card>

                <div className="
                    text-center
                    py-12
                ">

                    <h2 className="
                        text-3xl
                        font-bold
                    ">
                        No estás inscrito
                    </h2>

                    <p className="
                        text-gray-400
                        mt-3
                    ">
                        Cuando participes en
                        torneos aparecerán acá
                    </p>

                </div>

            </Card>
        )

    }

    return (
        <div className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
        ">

            {
                torneos.map(
                    (item) => {

                        const torneo =
                            item.torneos

                        return (

                            <Card
                                key={item.id}
                                className="
                                    overflow-hidden
                                    p-0
                                "
                            >

                                <img
                                    src={
                                        torneo.imagen_url ||
                                        'https://placehold.co/600x300'
                                    }
                                    alt={
                                        torneo.nombre
                                    }
                                    className="
                                        w-full
                                        h-48
                                        object-cover
                                    "
                                />

                                <div className="
                                    p-5
                                    space-y-4
                                ">

                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
                                    ">

                                        <h2 className="
                                            text-2xl
                                            font-bold
                                        ">
                                            {
                                                torneo.nombre
                                            }
                                        </h2>

                                        <Badge
                                            variant="success"
                                        >
                                            {
                                                item.estado
                                            }
                                        </Badge>

                                    </div>

                                    <p className="
                                        text-gray-400
                                        line-clamp-2
                                    ">
                                        {
                                            torneo.descripcion
                                        }
                                    </p>

                                    <div className="
                                        space-y-2
                                        text-sm
                                        text-gray-400
                                    ">

                                        <p>
                                            📅 Inicio:
                                            {' '}
                                            {
                                                torneo.fecha_inicio
                                            }
                                        </p>

                                        <p>
                                            👥 Cupo:
                                            {' '}
                                            {
                                                torneo.cupo_maximo
                                            }
                                        </p>

                                    </div>

                                    <Link
                                        to={`/torneos/${torneo.id}`}
                                    >

                                        <Button
                                            className="
                                                w-full
                                            "
                                        >
                                            Ver torneo
                                        </Button>

                                    </Link>

                                </div>

                            </Card>

                        )

                    }
                )
            }

        </div>
    )

}