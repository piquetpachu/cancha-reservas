import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminCanchaDetalle() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [cancha, setCancha] = useState(null);
    const [club, setClub] = useState(null);

    const [horarios, setHorarios] = useState([]);
    const [bloqueos, setBloqueos] = useState([]);
    const [reservas, setReservas] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    async function cargarDatos() {
        setLoading(true);

        const { data: canchaData } = await supabase
            .from("canchas")
            .select("*")
            .eq("id", id)
            .single();

        setCancha(canchaData);

        if (canchaData?.club_id) {
            const { data: clubData } = await supabase
                .from("clubs")
                .select("*")
                .eq("id", canchaData.club_id)
                .single();

            setClub(clubData);
        }

        const { data: horariosData } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id);

        setHorarios(horariosData || []);

        const { data: bloqueosData } = await supabase
            .from("bloqueos_horarios")
            .select("*")
            .eq("cancha_id", id);

        setBloqueos(bloqueosData || []);

        const { data: reservasData } = await supabase
            .from("reservas")
            .select("*")
            .eq("cancha_id", id);

        setReservas(reservasData || []);

        setLoading(false);
    }

    async function eliminarCancha() {
        if (!window.confirm("¿Eliminar esta cancha?")) return;

        await supabase
            .from("canchas")
            .update({ habilitacion: "eliminado" })
            .eq("id", id);

        cargarDatos();
    }

    async function restaurarCancha() {
        await supabase
            .from("canchas")
            .update({ habilitacion: "disponible" })
            .eq("id", id);

        cargarDatos();
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Cargando cancha...
            </div>
        );
    }

    if (!cancha) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Cancha no encontrada
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            <NavbarAdmin />

            <div className="px-4 pb-28">

                {/* HEADER */}
                <div className="flex flex-col gap-3 mt-4 mb-5">

                    <button
                        onClick={() => navigate(-1)}
                        className="w-fit bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-800 transition font-semibold text-sm"
                    >
                        ← Volver
                    </button>

                </div>

                {/* CARD */}
                <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-zinc-800 shadow-lg">

                    <img
                        src={cancha.foto}
                        alt={cancha.nombre}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                    <div
                        className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-semibold
                        ${cancha.habilitacion === "eliminado"
                                ? "bg-red-500/80"
                                : "bg-green-500/80"
                            }`}
                    >
                        {cancha.habilitacion}
                    </div>

                    <div className="absolute bottom-0 w-full p-5">

                        <h2 className="text-2xl font-bold">
                            {cancha.nombre}
                        </h2>

                        <p className="text-sm text-zinc-300">
                            {club?.nombre || "Sin club"}
                        </p>

                        <p className="text-xs text-zinc-400">
                            {cancha.direccion}
                        </p>

                        <div className="flex items-center justify-between mt-3">

                            <p className="text-2xl font-bold text-green-400">
                                ${cancha.precio || "8000"}
                                <span className="text-sm text-zinc-300">
                                    {" "}
                                    / hora
                                </span>
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/admin/cancha/${id}/editar`)
                                }
                                className="border border-green-500 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500 hover:text-white transition"
                            >
                                Editar →
                            </button>

                        </div>

                    </div>

                </div>

                {/* PANEL ACCIONES */}
                <div className="mt-6 grid grid-cols-2 gap-3">

                    <button
                        onClick={() =>
                            navigate(`/admin/cancha/${id}/editar`)
                        }
                        className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 p-4 rounded-2xl text-sm font-semibold transition"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/admin/cancha/${id}/horarios`)
                        }
                        className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl text-sm font-semibold transition"
                    >
                        ⏱ Horarios
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/admin/bloqueos`)
                        }
                        className="bg-orange-500 hover:bg-orange-400 p-4 rounded-2xl text-sm font-semibold transition"
                    >
                        🚫 Bloqueos
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/admin/reservas?cancha=${id}`)
                        }
                        className="bg-violet-600 hover:bg-violet-500 p-4 rounded-2xl text-sm font-semibold transition"
                    >
                        📅 Reservas
                    </button>

                    {cancha.habilitacion === "eliminado" ? (
                        <button
                            onClick={restaurarCancha}
                            className="col-span-2 bg-green-600 hover:bg-green-500 p-4 rounded-2xl font-bold transition"
                        >
                            Restaurar cancha
                        </button>
                    ) : (
                        <button
                            onClick={eliminarCancha}
                            className="col-span-2 bg-red-700 hover:bg-red-600 p-4 rounded-2xl font-bold transition"
                        >
                            Eliminar cancha
                        </button>
                    )}

                </div>

                {/* HORARIOS */}
                <h2 className="text-lg font-bold mt-8 mb-3">
                    Horarios
                </h2>

                <div className="flex flex-col gap-3">
                    {horarios.length === 0 ? (
                        <p className="text-zinc-400">
                            Sin horarios
                        </p>
                    ) : (
                        horarios.map((h) => (
                            <div
                                key={h.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
                            >
                                <p className="font-bold">
                                    {h.dia_semana}
                                </p>

                                <p className="text-zinc-400 text-sm">
                                    {h.hora_inicio} - {h.hora_fin}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* BLOQUEOS */}
                <h2 className="text-lg font-bold mt-8 mb-3">
                    Bloqueos
                </h2>

                <div className="flex flex-col gap-3">
                    {bloqueos.length === 0 ? (
                        <p className="text-zinc-400">
                            Sin bloqueos
                        </p>
                    ) : (
                        bloqueos.map((b) => (
                            <div
                                key={b.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
                            >
                                <p className="font-bold">
                                    {b.fecha}
                                </p>

                                <p className="text-zinc-400 text-sm">
                                    {b.hora_inicio} - {b.hora_fin}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* RESERVAS */}
                <h2 className="text-lg font-bold mt-8 mb-3">
                    Reservas
                </h2>

                <div className="flex flex-col gap-3">
                    {reservas.length === 0 ? (
                        <p className="text-zinc-400">
                            Sin reservas
                        </p>
                    ) : (
                        reservas.map((r) => (
                            <div
                                key={r.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold">
                                        {r.fecha}
                                    </p>

                                    <p className="text-zinc-400 text-sm">
                                        {r.hora_inicio} - {r.hora_fin}
                                    </p>
                                </div>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full uppercase font-bold
                                    ${r.estado === "cancelada"
                                            ? "bg-red-500/20 text-red-300"
                                            : "bg-green-500/20 text-green-300"
                                        }`}
                                >
                                    {r.estado}
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </div>

        </div>
    );
}