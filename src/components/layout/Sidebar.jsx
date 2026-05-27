import {
    LayoutDashboard,
    Trophy,
    Calendar,
    User,
    Building2,
    PlusCircle,
    Shield,
    LogOut,
    Home
} from 'lucide-react'

import {
    Link,
    useLocation,
    useNavigate
} from 'react-router-dom'

import { useEffect, useState } from 'react'

import { supabase } from '../../supabaseClient'

import { logout } from '../../services/authService'

export default function Sidebar() {

    const location = useLocation()

    const navigate = useNavigate()

    const [rol, setRol] =
        useState(null)

    useEffect(() => {

        getRol()

    }, [])

    async function getRol() {

        const {
            data: userData
        } = await supabase.auth.getUser()

        const user = userData.user

        if (!user) return

        const {
            data,
            error
        } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', user.id)
            .single()

        if (error) {
            console.error(error)
            return
        }

        if (data?.rol) {

            setRol(
                data.rol.toLowerCase()
            )

        }

    }

    async function handleLogout() {

        await logout()

        navigate('/login')

    }

    const links = [

        {
            label: 'Inicio',
            href: '/',
            icon: Home,
            visible: true
        },

        {
            label: 'Perfil',
            href: '/profile',
            icon: User,
            visible: true
        },

        {
            label: 'Torneos',
            href: '/torneos',
            icon: Trophy,
            visible: true
        },

        {
            label: 'Dashboard dueño',
            href: '/dashboard-dueno',
            icon: LayoutDashboard,
            visible:
                rol === 'dueno' ||
                rol === 'dueño' ||
                rol === 'admin'
        },

        {
            label: 'Crear Club',
            href: '/crear-club',
            icon: Building2,
            visible:
                rol === 'dueno' ||
                rol === 'dueño' ||
                rol === 'admin'
        },

        {
            label: 'Crear Cancha',
            href: '/crear-cancha',
            icon: PlusCircle,
            visible:
                rol === 'dueno' ||
                rol === 'dueño' ||
                rol === 'admin'
        },

        {
            label: 'Panel Admin',
            href: '/admin',
            icon: Shield,
            visible: rol === 'admin'
        }

    ]

    return (
        <aside
            className="
                hidden
                lg:flex
                flex-col
                w-72
                bg-[#111827]
                border-r
                border-gray-800
                min-h-screen
                p-6
            "
        >

            {/* LOGO */}
            <div className="mb-10">

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-white
                    "
                >
                    CanchasApp
                </h1>

                <p className="text-gray-400 mt-2">
                    Sistema de reservas
                </p>

            </div>

            {/* NAV */}
            <nav className="space-y-2">

                {
                    links
                        .filter(
                            link => link.visible
                        )
                        .map((link) => {

                            const Icon =
                                link.icon

                            const active =
                                location.pathname.startsWith(
                                    link.href
                                )

                            return (

                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        rounded-xl
                                        transition

                                        ${
                                            active
                                                ? `
                                                    bg-blue-600
                                                    text-white
                                                  `
                                                : `
                                                    text-gray-400
                                                    hover:bg-[#1F2937]
                                                    hover:text-white
                                                  `
                                        }
                                    `}
                                >

                                    <Icon size={20} />

                                    {link.label}

                                </Link>

                            )

                        })
                }

            </nav>

            {/* FOOTER */}
            <div className="mt-auto">

                <button
                    onClick={handleLogout}
                    className="
                        flex
                        items-center
                        gap-3
                        text-red-400
                        hover:text-red-300
                        transition
                    "
                >

                    <LogOut size={20} />

                    Cerrar sesión

                </button>

            </div>

        </aside>
    )

}