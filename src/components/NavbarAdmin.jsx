import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

import {
    Menu,
    X,
    LayoutDashboard,
    ClipboardCheck,
    Building2,
    Users,
    CalendarDays,
    BarChart3,
    LogOut
} from "lucide-react";

export default function NavbarAdmin() {

    const navigate = useNavigate();
    const location = useLocation();

    const [menuAbierto, setMenuAbierto] = useState(false);

    async function handleLogout() {

        await logout();

        navigate("/login");
    }

    const opciones = [
        {
            nombre: "Panel Admin",
            ruta: "/admin",
            icono: LayoutDashboard
        },
        {
            nombre: "Solicitudes",
            ruta: "/admin/solicitudes",
            icono: ClipboardCheck
        },
        {
            nombre: "Clubes",
            ruta: "/admin/clubes",
            icono: Building2
        },
        {
            nombre: "Usuarios",
            ruta: "/admin/usuarios",
            icono: Users
        },
        {
            nombre: "Reservas",
            ruta: "/admin/reservas",
            icono: CalendarDays
        },
        {
            nombre: "Estadísticas",
            ruta: "/admin/estadisticas",
            icono: BarChart3
        }
    ];

    return (

        <>
            {/* HEADER */}

            <header
                className="
                    sticky
                    top-0
                    z-50
                    bg-zinc-950
                    border-b
                    border-zinc-800
                    h-16
                    flex
                    items-center
                    justify-between
                    px-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        onClick={() =>
                            setMenuAbierto(true)
                        }
                        className="
                            text-white
                        "
                    >

                        <Menu size={26} />

                    </button>

                    <h1
                        className="
                            text-white
                            text-lg
                            font-semibold
                            m-0
                        "
                    >
                        Administración
                    </h1>

                </div>

            </header>

            {/* FONDO OSCURO */}

            {menuAbierto && (

                <div
                    onClick={() =>
                        setMenuAbierto(false)
                    }
                    className="
                        fixed
                        inset-0
                        bg-black/60
                        z-50
                    "
                />

            )}

            {/* MENU LATERAL */}

            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    h-full
                    w-72
                    bg-zinc-950
                    border-r
                    border-zinc-800
                    z-[60]
                    transition-transform
                    duration-300
                    ${menuAbierto
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* CABECERA */}

                <div
                    className="
                        h-16
                        px-4
                        border-b
                        border-zinc-800
                        flex
                        items-center
                        justify-between
                    "
                >

                    <h2
                        className="
                            text-white
                            font-semibold
                            text-lg
                            m-0
                        "
                    >
                        Panel Admin
                    </h2>

                    <button
                        onClick={() =>
                            setMenuAbierto(false)
                        }
                        className="text-white"
                    >

                        <X size={24} />

                    </button>

                </div>

                {/* OPCIONES */}

                <div
                    className="
                        p-3
                        flex
                        flex-col
                        gap-2
                    "
                >

                    {opciones.map((item) => {

                        const Icono = item.icono;

                        const activo =
                            location.pathname === item.ruta;

                        return (

                            <button
                                key={item.ruta}
                                onClick={() => {

                                    navigate(item.ruta);

                                    setMenuAbierto(false);
                                }}
                                className={`
                                    w-full
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-2xl
                                    transition-all
                                    text-left

                                    ${activo
                                        ? "bg-blue-600 text-white"
                                        : "text-zinc-300 hover:bg-zinc-900"
                                    }
                                `}
                            >

                                <Icono size={20} />

                                <span>
                                    {item.nombre}
                                </span>

                            </button>

                        );

                    })}

                </div>

                {/* FOOTER */}

                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-4
                        border-t
                        border-zinc-800
                    "
                >

                    <button
                        onClick={handleLogout}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            py-3
                            rounded-2xl
                            font-medium
                        "
                    >

                        <LogOut size={18} />

                        Cerrar sesión

                    </button>

                </div>

            </aside>

        </>
    );
}