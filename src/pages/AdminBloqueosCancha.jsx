import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminBloqueos() {

    const navigate = useNavigate();

    const [bloqueos, setBloqueos] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [clubs, setClubs] = useState([]);

    const [loading, setLoading] = useState(true);

    // filtros
    const [busqueda, setBusqueda] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    // crear
    const [clubId, setClubId] = useState("");
    const [canchaId, setCanchaId] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [motivo, setMotivo] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {

        setLoading(true);

        const { data: bloqueosData } = await supabase
            .from("bloqueos_horarios")
            .select(`
                *,
                canchas (
                    id,
                    nombre,
                    club_id,
                    clubs (nombre)
                )
            `)
            .order("fecha", { ascending: false });

        setBloqueos(bloqueosData || []);

        const { data: clubsData } = await supabase
            .from("clubs")
            .select("*")
            .neq("habilitacion", "eliminado")
            .order("nombre");

        setClubs(clubsData || []);

        const { data: canchasData } = await supabase
            .from("canchas")
            .select("*")
            .neq("habilitacion", "eliminado")
            .order("nombre");

        setCanchas(canchasData || []);

        setLoading(false);
    }

    // 🔥 NORMALIZAR
    function normalizarHora(hora) {
        return hora.slice(0, 2) + ":00";
    }

    // 🔥 CREAR BLOQUEO (LOGICA DUEÑO)
    async function crearBloqueo(e) {

        e.preventDefault();

        if (!canchaId || !horaInicio || !horaFin) {
            alert("Completá los campos obligatorios");
            return;
        }

        const inicio = normalizarHora(horaInicio);
        const fin = normalizarHora(horaFin);

        if (inicio >= fin) {
            alert("La hora final debe ser mayor");
            return;
        }

        // 🚨 VALIDAR SUPERPOSICIÓN
        const solapado = bloqueos.some(b => {

            if (b.cancha_id !== canchaId) return false;

            if (fecha && b.fecha !== fecha) return false;

            return (
                inicio < b.hora_fin &&
                fin > b.hora_inicio
            );
        });

        if (solapado) {
            alert("Hay superposición de bloqueos");
            return;
        }

        const { error } = await supabase
            .from("bloqueos_horarios")
            .insert([{
                cancha_id: canchaId,
                fecha: fecha || null,
                hora_inicio: inicio,
                hora_fin: fin,
                motivo
            }]);

        if (error) {
            console.log(error);
            alert("Error al crear bloqueo");
            return;
        }

        setClubId("");
        setCanchaId("");
        setFecha("");
        setHoraInicio("");
        setHoraFin("");
        setMotivo("");

        cargarDatos();
    }

    async function eliminarBloqueo(id) {

        if (!window.confirm("¿Eliminar bloqueo?")) return;

        await supabase
            .from("bloqueos_horarios")
            .delete()
            .eq("id", id);

        cargarDatos();
    }

    // 🔥 FILTROS
    const canchasFiltradas = clubId
        ? canchas.filter(c => c.club_id === clubId)
        : canchas;

    const bloqueosFiltrados = bloqueos.filter(b => {

        const coincideBusqueda =
            b.canchas?.nombre?.toLowerCase()
                .includes(busqueda.toLowerCase());

        const coincideFecha =
            !fechaFiltro || b.fecha === fechaFiltro;

        return coincideBusqueda && coincideFecha;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
                Cargando bloqueos...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24">

            {/* 🔥 NAVBAR REAL */}
            <NavbarAdmin />

            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl border-b border-zinc-900 px-4 py-4">

                <button
                    onClick={() => navigate(-1)}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800 active:scale-95"
                >
                    ← Volver
                </button>

                <h1 className="text-2xl font-bold mt-3">
                    Bloqueos
                </h1>

                <p className="text-sm text-zinc-400 mt-1">
                    Gestión de bloqueos de canchas
                </p>

            </div>

            <div className="px-4 mt-4 space-y-6">

                {/* CREAR */}
                <form
                    onSubmit={crearBloqueo}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4"
                >

                    <select
                        value={clubId}
                        onChange={(e) => {
                            setClubId(e.target.value);
                            setCanchaId("");
                        }}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                    >
                        <option value="">Seleccionar club</option>
                        {clubs.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>

                    <select
                        value={canchaId}
                        onChange={(e) => setCanchaId(e.target.value)}
                        disabled={!clubId}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                    >
                        <option value="">Seleccionar cancha</option>
                        {canchasFiltradas.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>

                    {/* FECHA */}
                    <div className="relative">

                        {!fecha && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                                Calendario
                            </span>
                        )}

                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
                        />

                    </div>

                    {/* HORAS */}
                    <div className="grid grid-cols-2 gap-3">

                        <select
                            value={horaInicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                        >
                            <option value="">Inicio</option>
                            {Array.from({ length: 24 }).map((_, i) => {
                                const h = String(i).padStart(2, "0") + ":00";
                                return <option key={h}>{h}</option>;
                            })}
                        </select>

                        <select
                            value={horaFin}
                            onChange={(e) => setHoraFin(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                        >
                            <option value="">Fin</option>
                            {Array.from({ length: 24 }).map((_, i) => {
                                const h = String(i).padStart(2, "0") + ":00";
                                return <option key={h}>{h}</option>;
                            })}
                        </select>

                    </div>

                    <textarea
                        placeholder="Motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                    />

                    <button className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl p-3 font-bold">
                        Crear bloqueo
                    </button>

                </form>

                {/* FILTROS */}
                <div className="space-y-3">

                    <input
                        type="text"
                        placeholder="Buscar cancha..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                    />

                    <input
                        type="date"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                    />

                </div>

                {/* LISTA */}
                {bloqueosFiltrados.length === 0 ? (

                    <div className="text-center py-6 text-zinc-500 text-sm border border-zinc-800 rounded-xl">
                        No hay bloqueos
                    </div>

                ) : (

                    <div className="space-y-3">

                        {bloqueosFiltrados.map(b => (

                            <div
                                key={b.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                            >

                                <h3 className="font-semibold">
                                    {b.canchas?.nombre}
                                </h3>

                                <p className="text-zinc-400 text-sm">
                                    {b.canchas?.clubs?.nombre}
                                </p>

                                <p className="text-sm mt-2">
                                    📅 {b.fecha || "Sin fecha"}
                                </p>

                                <p className="text-sm">
                                    🕒 {b.hora_inicio.slice(0, 5)} - {b.hora_fin.slice(0, 5)}
                                </p>

                                <p className="text-zinc-300 text-sm mt-2">
                                    {b.motivo || "Sin motivo"}
                                </p>

                                <button
                                    onClick={() => eliminarBloqueo(b.id)}
                                    className="mt-3 bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-sm"
                                >
                                    Eliminar
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}