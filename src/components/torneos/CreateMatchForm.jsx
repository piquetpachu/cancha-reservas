import { useEffect, useState } from 'react'

import {
    crearPartido
} from '../../services/partidoService'

import {
    obtenerParticipantes
} from '../../services/inscripcionService'

import { supabase } from '../../supabaseClient'

import {
    crearReservaPartido
} from '../../services/matchReservationService'

export default function CreateMatchForm({
    torneoId,
    onCreated
}) {
    const [participantes, setParticipantes] =
        useState([])

    const [canchas, setCanchas] =
        useState([])

    const [form, setForm] = useState({
        jugador1_id: '',
        jugador2_id: '',
        ronda: 1,
        cancha_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: ''
    })

    useEffect(() => {
        cargarParticipantes()

        cargarCanchas()
    }, [])

    async function cargarParticipantes() {
        try {
            const data =
                await obtenerParticipantes(
                    torneoId
                )

            const aprobados =
                data.filter(
                    (p) =>
                        p.estado ===
                        'aprobada'
                )

            setParticipantes(aprobados)
        } catch (error) {
            console.error(error)
        }
    }

    async function cargarCanchas() {
        try {
            const { data, error } =
                await supabase
                    .from('canchas')
                    .select('*')

            if (error) {
                throw error
            }

            setCanchas(data)
        } catch (error) {
            console.error(error)
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const reserva =
                await crearReservaPartido({
                    cancha_id:
                        form.cancha_id,
                    fecha: form.fecha,
                    hora_inicio:
                        form.hora_inicio,
                    hora_fin:
                        form.hora_fin,
                    torneo_id: torneoId
                })

            await crearPartido({
                torneo_id: torneoId,

                jugador1_id:
                    form.jugador1_id,

                jugador2_id:
                    form.jugador2_id,

                ronda: form.ronda,

                cancha_id:
                    form.cancha_id,

                reserva_id:
                    reserva.id
            })

            setForm({
                jugador1_id: '',
                jugador2_id: '',
                ronda: 1,
                cancha_id: '',
                fecha: '',
                hora_inicio: '',
                hora_fin: ''
            })

            if (onCreated) {
                onCreated()
            }

            alert(
                'Partido creado correctamente'
            )
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded p-4 mt-10"
        >
            <h2 className="text-2xl font-bold">
                Crear partido
            </h2>

            <select
                name="jugador1_id"
                value={form.jugador1_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >
                <option value="">
                    Jugador 1
                </option>

                {
                    participantes.map(
                        (
                            participante
                        ) => (
                            <option
                                key={
                                    participante.id
                                }
                                value={
                                    participante.usuario_id
                                }
                            >
                                {
                                    participante
                                        .profiles
                                        ?.nombre
                                }
                            </option>
                        )
                    )
                }
            </select>

            <select
                name="jugador2_id"
                value={form.jugador2_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >
                <option value="">
                    Jugador 2
                </option>

                {
                    participantes.map(
                        (
                            participante
                        ) => (
                            <option
                                key={
                                    participante.id
                                }
                                value={
                                    participante.usuario_id
                                }
                            >
                                {
                                    participante
                                        .profiles
                                        ?.nombre
                                }
                            </option>
                        )
                    )
                }
            </select>

            <select
                name="cancha_id"
                value={form.cancha_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >
                <option value="">
                    Seleccionar cancha
                </option>

                {
                    canchas.map((cancha) => (
                        <option
                            key={cancha.id}
                            value={cancha.id}
                        >
                            {cancha.nombre}
                        </option>
                    ))
                }
            </select>

            <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                type="number"
                name="ronda"
                value={form.ronda}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded"
            >
                Crear partido
            </button>
        </form>
    )
}