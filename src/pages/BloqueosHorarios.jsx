import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminBloqueos() {

    const navigate = useNavigate();

    const [bloqueos, setBloqueos] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [clubs, setClubs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    // filtros
    const [busqueda, setBusqueda] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    // crear bloqueo (MISMA LOGICA QUE DUEÑO)
    const [clubId, setClubId] = useState("");
    const [canchaId, setCanchaId] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [motivo, setMotivo] = useState("");

    useEffect(() => {
        cargarInicial();
    }, []);

    // 🔹 CARGA INICIAL (clubs + canchas)
    async function cargarInicial() {

        setLoading(true);

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

    // 🔥 MISMA LOGICA QUE DUEÑO
    async function cargarBloqueosPorCancha(id) {

        if (!id) {
            setBloqueos([]);
            return;
        }

        const { data, error } = await supabase
            .from("bloqueos_horarios")
            .select(`
                *,
                canchas (
                    nombre,
                    clubs (nombre)
                )
            `)
            .eq("cancha_id", id)
            .order("hora_inicio");

        if (error) {
            console.log(error);
            return;
        }

        setBloqueos(data || []);
    }

    // 🔁 CUANDO CAMBIA CANCHA → carga bloqueos
    useEffect(() => {
        if (canchaId) {
            cargarBloqueosPorCancha(canchaId);
        }
    }, [canchaId]);

    // 🔥 CREAR BLOQUEO (CLON DUEÑO)
    async function crearBloqueo(e) {

        e.preventDefault();

        if (!canchaId || !horaInicio || !horaFin) {
            alert("Faltan horarios o cancha");
            return;
        }

        const { error } = await supabase
            .from("bloqueos_horarios")
            .insert({
                cancha_id: canchaId,
                fecha: fecha || null,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                motivo: motivo || ""
            });

        if (error) {
            console.log(error);
            return;
        }

        // limpiar
        setFecha("");
        setHoraInicio("");
        setHoraFin("");
        setMotivo("");

        // recargar SOLO esa cancha (como dueño)
        cargarBloqueosPorCancha(canchaId);
    }

    async function eliminarBloqueo(id) {

        if (!window.confirm("¿Eliminar bloqueo?")) return;

        await supabase
            .from("bloqueos_horarios")
            .delete()
            .eq("id", id);

        cargarBloqueosPorCancha(canchaId);
    }

    // filtro canchas por club
    const canchasFiltradas = clubId
        ? canchas.filter(c => c.club_id === clubId)
        : canchas;

    // filtros visuales
    const bloqueosFiltrados = bloqueos.filter(b => {

        const coincideBusqueda =
            b.canchas?.nombre?.toLowerCase()
                .includes(busqueda.toLowerCase());

        const coincideFecha =
            fechaFiltro === "" || b.fecha === fechaFiltro;

        return coincideBusqueda && coincideFecha;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Cargando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white p-4">

            {/* NAV */}
            <div className="flex justify-between items-center mb-6">

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-2xl"
                >
                    ☰
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm hover:bg-white/10"
                >
                    ← Volver
                </button>

            </div>

            {menuOpen && (
                <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <button onClick={() => navigate("/admin")}>Dashboard</button>
                    <button onClick={() => navigate("/admin/reservas")}>Reservas</button>
                    <button onClick={() => navigate("/admin/usuarios")}>Usuarios</button>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-6">Bloqueos</h1>

            {/* FORM */}
            <form
                onSubmit={crearBloqueo}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 mb-8"
            >

                <select
                    value={clubId}
                    onChange={(e) => {
                        setClubId(e.target.value);
                        setCanchaId("");
                        setBloqueos([]);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                >
                    <option value="">Seleccionar cancha</option>
                    {canchasFiltradas.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                />

                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3"
                    />
                    <input
                        type="time"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3"
                    />
                </div>

                <textarea
                    placeholder="Motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                />

                <button className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl p-3 font-bold">
                    Crear bloqueo
                </button>

            </form>

            {/* FILTROS */}
            <div className="space-y-3 mb-6">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                />

                <input
                    type="date"
                    value={fechaFiltro}
                    onChange={(e) => setFechaFiltro(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                />
            </div>

            {/* LISTA */}
            {bloqueosFiltrados.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-zinc-400">
                    No hay bloqueos
                </div>
            ) : (
                bloqueosFiltrados.map(b => (
                    <div
                        key={b.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4"
                    >
                        <h3 className="font-semibold text-lg">
                            {b.canchas?.nombre}
                        </h3>

                        <p className="text-zinc-400 text-sm">
                            {b.canchas?.clubs?.nombre}
                        </p>

                        <p className="text-sm mt-2">
                            📅 {b.fecha || "Sin fecha"}
                        </p>

                        <p className="text-sm">
                            🕒 {b.hora_inicio} - {b.hora_fin}
                        </p>

                        <p className="text-zinc-300 text-sm mt-2">
                            {b.motivo || "Sin motivo"}
                        </p>

                        <button
                            onClick={() => eliminarBloqueo(b.id)}
                            className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-bold"
                        >
                            Eliminar
                        </button>

                    </div>
                ))
            )}

        </div>
    );
}