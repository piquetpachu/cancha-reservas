import { useEffect, useState } from 'react'

import {
    crearPartido
} from '../../services/partidoService'

import {
    obtenerParticipantes
} from '../../services/inscripcionService'

export default function CreateMatchForm({
    torneoId,
    onCreated
}) {
    const [participantes, setParticipantes] =
        useState([])

    const [form, setForm] = useState({
        jugador1_id: '',
        jugador2_id: '',
        ronda: 1
    })

    useEffect(() => {
        cargarParticipantes()
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

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await crearPartido({
                torneo_id: torneoId,
                ...form
            })

            setForm({
                jugador1_id: '',
                jugador2_id: '',
                ronda: 1
            })

            if (onCreated) {
                onCreated()
            }
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