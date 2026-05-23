import { useNavigate, useLocation } from "react-router-dom";

import {
    ClipboardCheck,
    Building2,
    Users,
    CalendarDays,
    BarChart3,
    ChevronRight,
    Shield,
    Home,
    LayoutDashboard
} from "lucide-react";

export default function DashboardAdmin() {

    const navigate = useNavigate();
    const location = useLocation();

    const opciones = [
        {
            titulo: "Solicitudes de Dueño",
            descripcion: "Aprobar o rechazar solicitudes pendientes",
            ruta: "/admin/solicitudes",
            icono: ClipboardCheck,
            color: "bg-orange-500/20 text-orange-400"
        },
        {
            titulo: "Gestión de Clubes",
            descripcion: "Administrar clubes registrados",
            ruta: "/admin/clubes",
            icono: Building2,
            color: "bg-cyan-500/20 text-cyan-400"
        },
        {
            titulo: "Usuarios",
            descripcion: "Gestionar clientes y dueños",
            ruta: "/admin/usuarios",
            icono: Users,
            color: "bg-violet-500/20 text-violet-400"
        },
        {
            titulo: "Reservas Globales",
            descripcion: "Ver todas las reservas del sistema",
            ruta: "/admin/reservas",
            icono: CalendarDays,
            color: "bg-green-500/20 text-green-400"
        },
        {
            titulo: "Estadísticas",
            descripcion: "Métricas generales de la plataforma",
            ruta: "/admin/estadisticas",
            icono: BarChart3,
            color: "bg-pink-500/20 text-pink-400"
        }
    ];

    return (

        <div className="min-h-screen bg-black text-white">

            {/* HEADER */}

            <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-zinc-800">

                <div className="px-5 pt-6 pb-5">

                    <div className="flex items-center gap-3">

                        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">

                            <Shield size={24} />

                        </div>

                        <div>

                            <h1 className="text-white text-2xl font-bold m-0">
                                Administración
                            </h1>

                            <p className="text-zinc-400 text-sm">
                                Panel principal del sistema
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* RESUMEN */}

            <div className="px-4 pt-4">

                <div className="grid grid-cols-2 gap-3">

                    {/* <div className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800">

                        <p className="text-zinc-400 text-xs">
                            MODO
                        </p>

                        <h2 className="text-white text-lg font-bold mt-2">
                            ADMIN
                        </h2>

                    </div> */}

                    {/* <div className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800">

                        <p className="text-zinc-400 text-xs">
                            ESTADO
                        </p>

                        <h2 className="text-green-400 text-lg font-bold mt-2">
                            ACTIVO
                        </h2>

                    </div> */}

                </div>

            </div>

            {/* ACCIONES */}

            <div className="px-4 py-5 pb-28">

                <div className="space-y-4">

                    {opciones.map((item) => {

                        const Icono = item.icono;

                        return (

                            <button
                                key={item.titulo}
                                onClick={() => navigate(item.ruta)}
                                className="
                                    w-full
                                    bg-zinc-900
                                    border
                                    border-zinc-800
                                    rounded-3xl
                                    p-4
                                    text-left
                                    active:scale-[0.98]
                                    transition-all
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-4">

                                        <div
                                            className={`
                                                h-14
                                                w-14
                                                rounded-2xl
                                                flex
                                                items-center
                                                justify-center
                                                ${item.color}
                                            `}
                                        >

                                            <Icono size={26} />

                                        </div>

                                        <div>

                                            <h3 className="text-white font-semibold text-base">
                                                {item.titulo}
                                            </h3>

                                            <p className="text-zinc-400 text-sm mt-1">
                                                {item.descripcion}
                                            </p>

                                        </div>

                                    </div>

                                    <ChevronRight
                                        size={22}
                                        className="text-zinc-500"
                                    />

                                </div>

                            </button>

                        );

                    })}

                </div>

            </div>

            {/* NAVBAR INFERIOR */}

            <div
                className="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    bg-zinc-950
                    border-t
                    border-zinc-800
                    h-20
                    flex
                    items-center
                    justify-around
                    z-50
                "
            >

                <button
                    onClick={() => navigate("/")}
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-1
                        text-zinc-400
                    "
                >
                    <Home size={22} />
                    <span className="text-[11px]">
                        Inicio
                    </span>
                </button>

                <button
                    onClick={() => navigate("/admin")}
                    className={`
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-1
                        ${location.pathname === "/admin"
                            ? "text-blue-400"
                            : "text-zinc-400"
                        }
                    `}
                >
                    <LayoutDashboard size={22} />
                    <span className="text-[11px]">
                        Panel
                    </span>
                </button>

                <button
                    onClick={() => navigate("/profile")}
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-1
                        text-zinc-400
                    "
                >
                    <Users size={22} />
                    <span className="text-[11px]">
                        Perfil
                    </span>
                </button>

            </div>

        </div>

    );
}