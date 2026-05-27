import { useEffect, useState } from 'react'

import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom'

import Tabs from '../../components/ui/Tabs'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

import {
    eliminarTorneo,
    obtenerTorneoPorId
} from '../../services/torneoService'

import TournamentJoinButton from '../../components/torneos/TournamentJoinButton'
import TournamentParticipants from '../../components/torneos/TournamentParticipants'
import TournamentParticipantsAdmin from '../../components/torneos/TournamentParticipantsAdmin'
import TournamentMatches from '../../components/torneos/TournamentMatches'
import TournamentBracket from '../../components/torneos/TournamentBracket'
import CreateMatchForm from '../../components/torneos/CreateMatchForm'

export default function TorneoDetalle() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [torneo, setTorneo] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [activeTab, setActiveTab] =
        useState('info')

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
            <div className="
                min-h-screen
                bg-[#0B1020]
                text-white
                p-6
            ">
                <p>Cargando torneo...</p>
            </div>
        )
    }

    if (!torneo) {
        return (
            <div className="
                min-h-screen
                bg-[#0B1020]
                text-white
                p-6
            ">
                <p>Torneo no encontrado</p>
            </div>
        )
    }

    const tabs = [
        {
            id: 'info',
            label: 'Información'
        },
        {
            id: 'participants',
            label: 'Participantes'
        },
        {
            id: 'matches',
            label: 'Partidos'
        },
        {
            id: 'bracket',
            label: 'Bracket'
        },
        {
            id: 'admin',
            label: 'Administración'
        }
    ]

    return (
        <div className="
            min-h-screen
            bg-[#0B1020]
            text-white
        ">
            <div className="
                max-w-7xl
                mx-auto
                px-4
                md:px-8
                py-8
                space-y-8
            ">

                {/* HERO */}
                <Card className="overflow-hidden p-0">

                    <img
                        src={
                            torneo.imagen_url ||
                            'https://placehold.co/1200x400'
                        }
                        alt={torneo.nombre}
                        className="
                            w-full
                            h-[220px]
                            md:h-[320px]
                            object-cover
                        "
                    />

                    <div className="p-8">

                        <div className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-6
                        ">

                            <div className="space-y-4">

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                    flex-wrap
                                ">
                                    <h1 className="
                                        text-4xl
                                        font-bold
                                    ">
                                        {torneo.nombre}
                                    </h1>

                                    <Badge variant="success">
                                        Activo
                                    </Badge>
                                </div>

                                <p className="
                                    text-gray-400
                                    text-lg
                                    max-w-3xl
                                ">
                                    {torneo.descripcion}
                                </p>

                            </div>

                            <div className="
                                flex
                                flex-wrap
                                gap-3
                            ">

                                <TournamentJoinButton
                                    torneoId={torneo.id}
                                />

                                <Link
                                    to={`/dashboard/torneos/${torneo.id}/editar`}
                                >
                                    <Button variant="warning">
                                        Editar
                                    </Button>
                                </Link>

                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                >
                                    Eliminar
                                </Button>

                            </div>

                        </div>

                    </div>

                </Card>

                {/* TABS */}
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* INFO */}
                {
                    activeTab === 'info' && (
                        <Card>

                            <div className="
                                grid
                                grid-cols-2
                                lg:grid-cols-4
                                gap-6
                            ">

                                <div>
                                    <p className="
                                        text-gray-400
                                        text-sm
                                    ">
                                        Cupo máximo
                                    </p>

                                    <h3 className="
                                        text-3xl
                                        font-bold
                                        mt-2
                                    ">
                                        {torneo.cupo_maximo}
                                    </h3>
                                </div>

                                <div>
                                    <p className="
                                        text-gray-400
                                        text-sm
                                    ">
                                        Fecha inicio
                                    </p>

                                    <h3 className="
                                        text-xl
                                        font-bold
                                        mt-2
                                    ">
                                        {torneo.fecha_inicio}
                                    </h3>
                                </div>

                                <div>
                                    <p className="
                                        text-gray-400
                                        text-sm
                                    ">
                                        Fecha fin
                                    </p>

                                    <h3 className="
                                        text-xl
                                        font-bold
                                        mt-2
                                    ">
                                        {torneo.fecha_fin}
                                    </h3>
                                </div>

                                <div>
                                    <p className="
                                        text-gray-400
                                        text-sm
                                    ">
                                        Estado
                                    </p>

                                    <div className="mt-3">
                                        <Badge variant="success">
                                            Activo
                                        </Badge>
                                    </div>
                                </div>

                            </div>

                        </Card>
                    )
                }

                {/* PARTICIPANTES */}
                {
                    activeTab === 'participants' && (
                        <Card>
                            <TournamentParticipants
                                torneoId={torneo.id}
                            />
                        </Card>
                    )
                }

                {/* MATCHES */}
                {
                    activeTab === 'matches' && (
                        <div className="space-y-6">

                            <Card>
                                <CreateMatchForm
                                    torneoId={torneo.id}
                                />
                            </Card>

                            <Card>
                                <TournamentMatches
                                    torneoId={torneo.id}
                                />
                            </Card>

                        </div>
                    )
                }

                {/* BRACKET */}
                {
                    activeTab === 'bracket' && (
                        <Card className="overflow-x-auto">
                            <TournamentBracket
                                torneoId={torneo.id}
                            />
                        </Card>
                    )
                }

                {/* ADMIN */}
                {
                    activeTab === 'admin' && (
                        <Card>
                            <TournamentParticipantsAdmin
                                torneoId={torneo.id}
                            />
                        </Card>
                    )
                }

            </div>
        </div>
    )
}