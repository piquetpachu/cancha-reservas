import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminReservas() {

    const navigate = useNavigate();

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroCancha, setFiltroCancha] = useState("");
    const [filtroClub, setFiltroClub] = useState("");

    useEffect(() => {
        cargarReservas();
    }, []);

    async function cargarReservas() {

        setLoading(true);

        const { data, error } = await supabase
            .from("reservas")
            .select(`
                *,
                canchas (
                    id,
                    nombre,
                    deporte,
                    club_id,
                    clubs (nombre)
                )
            `)
            .order("fecha", { ascending: false });

        if (!error) setReservas(data || []);

        setLoading(false);
    }

    async function cancelarReserva(id) {

        if (!window.confirm("¿Cancelar reserva?")) return;

        await supabase
            .from("reservas")
            .update({ estado: "cancelada" })
            .eq("id", id);

        cargarReservas();
    }

    async function restaurarReserva(id) {

        if (!window.confirm("¿Restaurar reserva?")) return;

        await supabase
            .from("reservas")
            .update({ estado: "activa" })
            .eq("id", id);

        cargarReservas();
    }

    // CLUBES
    const clubsUnicos = [
        ...new Map(
            reservas
                .filter(r => r.canchas?.clubs)
                .map(r => [
                    r.canchas.club_id,
                    r.canchas.clubs.nombre
                ])
        ).entries()
    ].map(([id, nombre]) => ({ id, nombre }));

    // CANCHAS FILTRADAS POR CLUB
    const canchasFiltradas = [
        ...new Set(
            reservas
                .filter(r =>
                    filtroClub === ""
                        ? true
                        : r.canchas?.club_id === filtroClub
                )
                .map(r => r.canchas?.nombre)
                .filter(Boolean)
        )
    ];

    const reservasFiltradas = useMemo(() => {

        return reservas.filter((r) => {

            const texto = busqueda.toLowerCase();

            return (
                (r.canchas?.nombre?.toLowerCase().includes(texto) ||
                    r.fecha?.includes(texto)) &&

                (filtroEstado === "todos" ||
                    r.estado === filtroEstado) &&

                (!filtroFecha || r.fecha === filtroFecha) &&

                (!filtroCancha ||
                    r.canchas?.nombre === filtroCancha) &&

                (!filtroClub ||
                    r.canchas?.club_id === filtroClub)
            );
        });

    }, [
        reservas,
        busqueda,
        filtroEstado,
        filtroFecha,
        filtroCancha,
        filtroClub
    ]);

    const total = reservas.length;
    const activas = reservas.filter(r => r.estado !== "cancelada").length;
    const canceladas = reservas.filter(r => r.estado === "cancelada").length;

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
                Cargando reservas...
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

                <h1 className="text-2xl font-bold mb-4">
                    Reservas
                </h1>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <Stat title="Total" value={total} />
                    <Stat title="Activas" value={activas} color="text-green-400" />
                    <Stat title="Canceladas" value={canceladas} color="text-red-400" />
                </div>

                {/* FILTROS */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5 space-y-3">

                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm"
                    />

                    <div className="grid grid-cols-2 gap-3">

                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm"
                        >
                            <option value="todos">Estados</option>
                            <option value="activa">Activas</option>
                            <option value="cancelada">Canceladas</option>
                        </select>

                        {/* 📅 CALENDARIO FIX */}
                        <div className="relative">
                            <input
                                type="date"
                                value={filtroFecha}
                                onChange={(e) => setFiltroFecha(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white appearance-none"
                            />
                            {!filtroFecha && (
                                <span className="absolute left-4 top-3 text-zinc-400 text-sm pointer-events-none">
                                    📅 Calendario
                                </span>
                            )}
                        </div>

                    </div>

                    <select
                        value={filtroClub}
                        onChange={(e) => {
                            setFiltroClub(e.target.value);
                            setFiltroCancha("");
                        }}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm"
                    >
                        <option value="">Todos los clubes</option>
                        {clubsUnicos.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filtroCancha}
                        onChange={(e) => setFiltroCancha(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm"
                    >
                        <option value="">Todas las canchas</option>
                        {canchasFiltradas.map(c => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>

                </div>

                {/* LISTA */}
                {reservasFiltradas.length === 0 ? (
                    <Empty text="No hay reservas" />
                ) : (
                    <div className="space-y-4">
                        {reservasFiltradas.map((r) => (
                            <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

                                <div className="flex justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold">
                                            {r.canchas?.nombre}
                                        </h3>
                                        <p className="text-zinc-400 text-xs">
                                            {r.canchas?.clubs?.nombre}
                                        </p>
                                    </div>

                                    <Estado estado={r.estado} />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300 mb-3">
                                    <p>📅 {r.fecha}</p>
                                    <p>🕒 {r.hora_inicio} - {r.hora_fin}</p>
                                </div>

                                {r.estado !== "cancelada" ? (
                                    <button
                                        onClick={() => cancelarReserva(r.id)}
                                        className="w-full bg-red-700 hover:bg-red-600 py-2 rounded-xl text-sm font-bold"
                                    >
                                        Cancelar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => restaurarReserva(r.id)}
                                        className="w-full bg-green-700 hover:bg-green-600 py-2 rounded-xl text-sm font-bold"
                                    >
                                        Restaurar
                                    </button>
                                )}

                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
}

/* COMPONENTES */

function Stat({ title, value, color }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${color || ""}`}>
                {value}
            </p>
            <p className="text-xs text-zinc-400">{title}</p>
        </div>
    );
}

function Estado({ estado }) {
    return (
        <span className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase
            ${estado === "cancelada" && "bg-red-500/20 text-red-300"}
            ${estado === "activa" && "bg-green-500/20 text-green-300"}
        `}>
            {estado}
        </span>
    );
}

function Empty({ text }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center text-zinc-400">
            {text}
        </div>
    );
}