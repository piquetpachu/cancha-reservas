import { useEffect, useState } from 'react'

import { supabase } from '../../supabaseClient'

import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function ProfileReservations({
    userId
}) {

    const [reservas, setReservas] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {

        cargarReservas()

    }, [])

    async function cargarReservas() {

        try {

            const { data, error } =
                await supabase
                    .from('reservas')
                    .select(`
                        *,
                        canchas (
                            nombre,
                            precio_por_hora
                        )
                    `)
                    .eq(
                        'usuario_id',
                        userId
                    )
                    .order(
                        'fecha',
                        {
                            ascending: false
                        }
                    )

            if (error) {
                throw error
            }

            setReservas(data || [])

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
                    Cargando reservas...
                </p>
            </Card>
        )

    }

    if (reservas.length === 0) {

        return (
            <Card>

                <div className="
                    text-center
                    py-10
                ">

                    <h3 className="
                        text-2xl
                        font-bold
                    ">
                        No tenés reservas
                    </h3>

                    <p className="
                        text-gray-400
                        mt-2
                    ">
                        Cuando reserves una
                        cancha aparecerá acá
                    </p>

                </div>

            </Card>
        )

    }

    return (
        <div className="
            grid
            gap-5
        ">

            {
                reservas.map(
                    (reserva) => (

                        <Card
                            key={reserva.id}
                        >

                            <div className="
                                flex
                                flex-col
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                                gap-5
                            ">

                                <div className="
                                    space-y-3
                                ">

                                    <h3 className="
                                        text-2xl
                                        font-bold
                                    ">
                                        {
                                            reserva
                                                .canchas
                                                ?.nombre
                                        }
                                    </h3>

                                    <div className="
                                        flex
                                        flex-wrap
                                        gap-4
                                        text-gray-400
                                    ">

                                        <p>
                                            📅 {
                                                reserva.fecha
                                            }
                                        </p>

                                        <p>
                                            ⏰ {
                                                reserva.hora_inicio
                                            }
                                        </p>

                                        <p>
                                            💲 {
                                                reserva
                                                    .canchas
                                                    ?.precio_por_hora
                                            }
                                        </p>

                                    </div>

                                </div>

                                <div>

                                    {
                                        reserva.estado ===
                                        'confirmada' && (
                                            <Badge
                                                variant="success"
                                            >
                                                Confirmada
                                            </Badge>
                                        )
                                    }

                                    {
                                        reserva.estado ===
                                        'pendiente' && (
                                            <Badge
                                                variant="warning"
                                            >
                                                Pendiente
                                            </Badge>
                                        )
                                    }

                                    {
                                        reserva.estado ===
                                        'cancelada' && (
                                            <Badge
                                                variant="danger"
                                            >
                                                Cancelada
                                            </Badge>
                                        )
                                    }

                                </div>

                            </div>

                        </Card>

                    )
                )
            }

        </div>
    )

}