import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminUsuarioDetalle() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busquedaReserva, setBusquedaReserva] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todas");

    useEffect(() => {
        cargarDatos();
    }, [id]);

    async function cargarDatos() {

        setLoading(true);

        const { data: userData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single();

        setUsuario(userData);

        const { data: clubsData } = await supabase
            .from("clubs")
            .select("*")
            .eq("owner_id", id);

        setClubs(clubsData || []);

        const { data: reservasData } = await supabase
            .from("reservas")
            .select(`
                *,
                canchas (nombre)
            `)
            .eq("usuario_id", userData.id)
            .order("created_at", { ascending: false });

        setReservas(reservasData || []);

        setLoading(false);
    }

    const reservasFiltradas = useMemo(() => {
        return reservas.filter((r) => {

            const nombreCancha =
                r.canchas?.nombre?.toLowerCase() || "";

            const coincideBusqueda =
                nombreCancha.includes(
                    busquedaReserva.toLowerCase()
                );

            const coincideEstado =
                filtroEstado === "todas"
                    ? true
                    : r.estado === filtroEstado;

            return coincideBusqueda && coincideEstado;
        });
    }, [reservas, busquedaReserva, filtroEstado]);

    if (loading || !usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Cargando...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-zinc-950 text-white">

            {/* NAVBAR ADMIN (HAMBURGUESA) */}
            <NavbarAdmin />

            <div className="px-4 pt-4 pb-28 max-w-6xl mx-auto">

                {/* VOLVER */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition text-sm"
                >
                    ← Volver
                </button>

                {/* HEADER */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        {usuario.nombre || "Usuario"}
                    </h1>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">

                        <p className="text-zinc-400 text-sm">
                            {usuario.email}
                        </p>

                        <span className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase
                            ${usuario.rol === "admin" && "bg-purple-500/20 text-purple-300"}
                            ${usuario.rol === "dueno" && "bg-blue-500/20 text-blue-300"}
                            ${usuario.rol === "usuario" && "bg-green-500/20 text-green-300"}
                        `}>
                            {usuario.rol}
                        </span>

                    </div>

                </div>

                {/* INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

                    <Card label="Nombre" value={usuario.nombre || "Sin nombre"} />
                    <Card label="Email" value={usuario.email || "Sin email"} />
                    <Card label="Teléfono" value={usuario.telefono || "Sin teléfono"} />
                    <Card label="ID" value={usuario.id} small />

                </div>

                {/* CLUBES */}
                <Section title="Clubes" count={clubs.length} />

                {clubs.length === 0 ? (
                    <Empty text="Este usuario no tiene clubes" />
                ) : (
                    <div className="grid gap-4 mb-10">
                        {clubs.map((club) => (
                            <div
                                key={club.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition"
                            >
                                <div className="flex justify-between items-center flex-wrap gap-3">

                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {club.nombre}
                                        </h3>
                                        <p className="text-zinc-400 text-sm">
                                            {club.direccion}
                                        </p>
                                    </div>

                                    <span className={`
                                        px-3 py-1 rounded-full text-xs font-bold uppercase
                                        ${club.habilitacion === "eliminado"
                                            ? "bg-red-500/20 text-red-300"
                                            : "bg-green-500/20 text-green-300"}
                                    `}>
                                        {club.habilitacion}
                                    </span>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* RESERVAS */}
                <Section title="Reservas" count={reservasFiltradas.length} />

                {/* FILTROS */}
                <div className="flex flex-wrap gap-3 mb-6">

                    <input
                        type="text"
                        placeholder="Buscar cancha..."
                        value={busquedaReserva}
                        onChange={(e) => setBusquedaReserva(e.target.value)}
                        className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none"
                    >
                        <option value="todas">Todas</option>
                        <option value="confirmada">Confirmadas</option>
                        <option value="cancelada">Canceladas</option>
                        <option value="pendiente">Pendientes</option>
                    </select>

                </div>

                {/* LISTA */}
                {reservasFiltradas.length === 0 ? (
                    <Empty text="No se encontraron reservas" />
                ) : (
                    <div className="space-y-4">
                        {reservasFiltradas.map((r) => (
                            <div
                                key={r.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition"
                            >
                                <div className="flex justify-between items-start flex-wrap gap-3">

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {r.canchas?.nombre || r.cancha_id}
                                        </h3>

                                        <p className="text-zinc-400 text-sm">
                                            📅 {r.fecha}
                                        </p>

                                        <p className="text-zinc-400 text-sm">
                                            🕒 {r.hora_inicio} - {r.hora_fin}
                                        </p>
                                    </div>

                                    <span className={`
                                        px-3 py-1 rounded-full text-xs font-bold uppercase
                                        ${r.estado === "confirmada" && "bg-green-500/20 text-green-300"}
                                        ${r.estado === "cancelada" && "bg-red-500/20 text-red-300"}
                                        ${r.estado === "pendiente" && "bg-yellow-500/20 text-yellow-300"}
                                    `}>
                                        {r.estado}
                                    </span>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
}

/* COMPONENTES */

function Card({ label, value, small }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-600 transition">
            <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">
                {label}
            </p>
            <p className={`${small ? "text-xs break-all" : "text-base font-semibold"}`}>
                {value}
            </p>
        </div>
    );
}

function Section({ title, count }) {
    return (
        <div className="flex justify-between items-center mb-4 mt-6 flex-wrap gap-2">
            <h2 className="text-xl font-bold">{title}</h2>
            <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                {count}
            </span>
        </div>
    );
}

function Empty({ text }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-zinc-400">
            {text}
        </div>
    );
}