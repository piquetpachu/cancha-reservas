import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminClubDetalle() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [club, setClub] = useState(null);
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargar();
    }, [id]);

    async function cargar() {

        setLoading(true);

        const { data: clubData } = await supabase
            .from("clubs")
            .select("*")
            .eq("id", id)
            .single();

        setClub(clubData);

        const { data: canchasData } = await supabase
            .from("canchas")
            .select("*")
            .eq("club_id", id)
            .order("created_at", { ascending: false });

        setCanchas(canchasData || []);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
                Cargando...
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
                Club no encontrado
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24">

            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl border-b border-zinc-900 px-4 py-4">

                <button
                    onClick={() => navigate("/admin/clubes")}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800 active:scale-95"
                >
                    ← Volver
                </button>

                <h1 className="text-2xl font-bold mt-3">
                    {club.nombre}
                </h1>

                <p className="text-sm text-zinc-400 mt-1">
                    {club.direccion || "Sin dirección registrada"}
                </p>

            </div>

            {/* IMAGEN */}
            <div className="px-4 mt-4">

                <div className="h-52 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">

                    {club.foto ? (
                        <img
                            src={club.foto}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                            Sin imagen
                        </div>
                    )}

                </div>

            </div>

            {/* INFO VISUAL PRO */}
            <div className="px-4 mt-4 space-y-4">

                {/* CLUB INFO */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-4">

                    <div className="flex justify-between items-start">

                        <div>

                            <h2 className="text-xl font-bold">
                                {club.nombre}
                            </h2>

                            <p className="text-sm text-zinc-400 mt-1">
                                {club.direccion || "Sin dirección registrada"}
                            </p>

                        </div>

                        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border
                            ${club.habilitacion === "eliminado"
                                ? "text-red-400 border-red-500/30 bg-red-500/10"
                                : "text-green-400 border-green-500/30 bg-green-500/10"
                            }
                        `}>
                            {club.habilitacion}
                        </span>

                    </div>

                </div>

                {/* STATS VISUALES */}
                <div className="grid grid-cols-2 gap-3">

                    <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-4">

                        <p className="text-xs text-blue-300 uppercase tracking-wider">
                            Canchas
                        </p>

                        <p className="text-3xl font-extrabold mt-1">
                            {canchas.length}
                        </p>

                    </div>

                    <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/10 border border-green-500/20 rounded-2xl p-4">

                        <p className="text-xs text-green-300 uppercase tracking-wider">
                            Estado
                        </p>

                        <p className="text-lg font-bold text-green-400 mt-2">
                            Activo
                        </p>

                    </div>

                </div>

                {/* DESCRIPCIÓN */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                        Información del club
                    </p>

                    <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                        {club.descripcion || "Club deportivo con instalaciones disponibles para reservas y actividades deportivas."}
                    </p>

                </div>

            </div>

            {/* TITULO CANCHAS */}
            <div className="px-4 mt-6 mb-3">
                <h2 className="text-lg font-semibold">
                    Canchas
                </h2>
            </div>

            {/* LISTA CANCHAS */}
            {/* LISTA CANCHAS */}
            <div className="px-4 space-y-4">

                {canchas.length === 0 ? (

                    <div className="text-center py-10 text-zinc-500 text-sm border border-zinc-900 rounded-2xl">
                        No hay canchas registradas
                    </div>

                ) : (

                    canchas.map((c) => (

                        <div
                            key={c.id}
                            onClick={() => navigate(`/admin/cancha/${c.id}`)}
                            className="
                    relative
                    w-full
                    rounded-3xl
                    overflow-hidden
                    cursor-pointer
                    shadow-lg
                    border border-zinc-800
                    active:scale-[0.98]
                    transition
                "
                        >

                            {/* IMAGEN */}
                            <img
                                src={c.foto}
                                alt={c.nombre}
                                className="w-full h-44 object-cover brightness-75"
                            />

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            {/* ESTADO */}
                            <div
                                className={`
                        absolute top-3 right-3 text-xs px-3 py-1 rounded-full border
                        ${c.habilitacion === "eliminado"
                                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                                        : "bg-green-500/20 text-green-300 border-green-500/30"
                                    }
                    `}
                            >
                                {c.habilitacion || "activo"}
                            </div>

                            {/* INFO */}
                            <div className="absolute bottom-0 w-full p-4">

                                <div className="flex justify-between items-end gap-3">

                                    <h3 className="text-white text-lg font-bold leading-tight">
                                        {c.nombre}
                                    </h3>

                                    <span className="text-green-300 font-bold text-sm">
                                        ${c.precio_por_hora}
                                    </span>

                                </div>

                                <p className="text-zinc-300 text-sm mt-1">
                                    {c.deporte || "Sin deporte"}
                                </p>

                                <p className="text-zinc-400 text-xs mt-1 line-clamp-1">
                                    {c.descripcion || "Sin descripción"}
                                </p>

                                <div className="mt-3">
                                    <span className="text-xs text-white/70">
                                        Ver detalle →
                                    </span>
                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}