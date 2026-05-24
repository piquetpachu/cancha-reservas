import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminEstadisticas() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [usuarios, setUsuarios] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [bloqueos, setBloqueos] = useState([]);

    const [filtroPeriodo, setFiltroPeriodo] = useState("mes");

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {

        setLoading(true);

        const { data: usuariosData } = await supabase.from("profiles").select("*");
        const { data: clubsData } = await supabase.from("clubs").select("*");
        const { data: canchasData } = await supabase.from("canchas").select("*");

        const { data: reservasData } = await supabase
            .from("reservas")
            .select(`*, canchas(nombre, deporte)`);

        const { data: bloqueosData } = await supabase
            .from("bloqueos_horarios")
            .select("*");

        setUsuarios(usuariosData || []);
        setClubs(clubsData || []);
        setCanchas(canchasData || []);
        setReservas(reservasData || []);
        setBloqueos(bloqueosData || []);

        setLoading(false);
    }

    // FILTRO FECHA
    const hoy = new Date();

    function dentroDelPeriodo(fecha) {

        const f = new Date(fecha);
        const dias = (hoy - f) / (1000 * 60 * 60 * 24);

        if (filtroPeriodo === "hoy") return f.toDateString() === hoy.toDateString();
        if (filtroPeriodo === "semana") return dias <= 7;
        if (filtroPeriodo === "mes") return dias <= 30;

        return true;
    }

    const reservasFiltradas = useMemo(() =>
        reservas.filter(r => dentroDelPeriodo(r.fecha)),
        [reservas, filtroPeriodo]
    );

    // TOTALES
    const totalUsuarios = usuarios.length;
    const totalClientes = usuarios.filter(u => u.rol === "cliente").length;
    const totalDuenos = usuarios.filter(u => u.rol === "dueno").length;
    const totalAdmins = usuarios.filter(u => u.rol === "admin").length;

    const totalClubs = clubs.length;
    const clubsActivos = clubs.filter(c => c.habilitacion !== "eliminado").length;

    const totalCanchas = canchas.length;
    const canchasActivas = canchas.filter(c => c.habilitacion !== "eliminado").length;

    const reservasActivas = reservasFiltradas.filter(r => r.estado !== "cancelada").length;
    const reservasCanceladas = reservasFiltradas.filter(r => r.estado === "cancelada").length;

    const totalBloqueos = bloqueos.length;

    // RANKINGS
    const getRanking = (arr, keyFn) => {
        const map = {};
        arr.forEach(item => {
            const key = keyFn(item);
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    };

    const deportes = getRanking(reservasFiltradas, r => r.canchas?.deporte || "Sin deporte");
    const horas = getRanking(reservasFiltradas, r => r.hora_inicio || "00:00");
    const canchasTop = getRanking(reservasFiltradas, r => r.canchas?.nombre || "Cancha");

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
                Cargando estadísticas...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-zinc-950 text-white">

            <NavbarAdmin />

            <div className="p-4 pb-24">

                {/* VOLVER */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-800 text-sm"
                >
                    ← Volver
                </button>

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Estadísticas
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Panel global del sistema
                    </p>
                </div>

                {/* FILTROS */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {["hoy", "semana", "mes", "todo"].map(p => (
                        <button
                            key={p}
                            onClick={() => setFiltroPeriodo(p)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition whitespace-nowrap
                                ${filtroPeriodo === p
                                    ? "bg-blue-600 border-blue-500"
                                    : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                                }`}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">

                    <Card title="Usuarios" value={totalUsuarios} />
                    <Card title="Clientes" value={totalClientes} />
                    <Card title="Dueños" value={totalDuenos} />
                    <Card title="Admins" value={totalAdmins} />

                    <Card title="Clubs" value={totalClubs} />
                    <Card title="Clubs activos" value={clubsActivos} />

                    <Card title="Canchas" value={totalCanchas} />
                    <Card title="Canchas activas" value={canchasActivas} />

                    <Card title="Reservas" value={reservasActivas} color="text-green-400" />
                    <Card title="Canceladas" value={reservasCanceladas} color="text-red-400" />

                    <Card title="Bloqueos" value={totalBloqueos} />

                </div>

                {/* RANKINGS */}
                <Section title="Deportes más usados" data={deportes} />
                <Section title="Horarios pico" data={horas} />
                <Section title="Canchas más usadas" data={canchasTop} />

            </div>

        </div>
    );
}

/* COMPONENTES */

function Card({ title, value, color }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition">
            <p className="text-xs text-zinc-400">{title}</p>
            <h2 className={`text-2xl font-bold mt-2 ${color || ""}`}>
                {value}
            </h2>
        </div>
    );
}

function Section({ title, data }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5">

            <h2 className="font-bold text-lg mb-4">
                {title}
            </h2>

            {data.length === 0 ? (
                <p className="text-zinc-400 text-sm">
                    Sin datos
                </p>
            ) : (
                <div className="space-y-3">
                    {data.map(([nombre, valor]) => (
                        <div
                            key={nombre}
                            className="flex justify-between items-center bg-zinc-800/50 rounded-xl px-4 py-2"
                        >
                            <span className="text-sm">
                                {nombre}
                            </span>
                            <span className="font-bold">
                                {valor}
                            </span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}