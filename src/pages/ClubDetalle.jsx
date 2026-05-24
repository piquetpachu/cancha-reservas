import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function ClubDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [canchas, setCanchas] = useState([]);
    const [deporteSeleccionado, setDeporteSeleccionado] = useState("futbol");

    useEffect(() => {
        async function cargarCanchas() {
            const { data, error } = await supabase
                .from("canchas")
                .select(`*, clubs!inner (id)`)
                .eq("clubs.id", id);

            if (!error) {
                setCanchas(data || []);
            }
        }

        if (id) cargarCanchas();
    }, [id]);

    const canchasFiltradas = canchas.filter(
        (c) => c.deporte === deporteSeleccionado
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-4 py-6 max-w-2xl mx-auto">

            {/* 🔙 VOLVER */}
            <button
                onClick={() => navigate(-1)}
                className="mb-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
                ← Volver
            </button>

            {/* 🏟️ TITULO */}
            <h2 className="text-2xl font-bold mb-4">
                Canchas del club
            </h2>

            {/* 🎯 FILTROS */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setDeporteSeleccionado("futbol")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition
                        ${deporteSeleccionado === "futbol"
                            ? "bg-green-500 text-white"
                            : "bg-white/10 text-zinc-300 hover:bg-white/20"
                        }`}
                >
                    Fútbol
                </button>

                <button
                    onClick={() => setDeporteSeleccionado("padel")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition
                        ${deporteSeleccionado === "padel"
                            ? "bg-green-500 text-white"
                            : "bg-white/10 text-zinc-300 hover:bg-white/20"
                        }`}
                >
                    Pádel
                </button>
            </div>

            {/* 📭 SIN CANCHAS */}
            {canchasFiltradas.length === 0 ? (
                <p className="text-zinc-400">No hay canchas</p>
            ) : (

                <div className="flex flex-col gap-5">

                    {canchasFiltradas.map((cancha) => (

                        <div
                            key={cancha.id}
                            className="relative h-56 rounded-3xl overflow-hidden border border-zinc-800 shadow-lg group cursor-pointer"
                        >

                            {/* 🖼️ IMAGEN */}
                            <img
                                src={cancha.foto}
                                alt={cancha.nombre}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />

                            {/* 🌑 OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                            {/* 🟢 BADGE */}
                            <div className="absolute top-4 left-4 bg-green-500/80 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                Disponible
                            </div>

                            {/* 📄 INFO */}
                            <div className="absolute bottom-0 w-full p-4">

                                <h3 className="text-xl font-bold">
                                    {cancha.nombre}
                                </h3>

                                <p className="text-sm text-zinc-300 mt-1">
                                    {cancha.descripcion}
                                </p>

                                <div className="flex items-center justify-between mt-3">

                                    {/* 💰 PRECIO */}
                                    <p className="text-xl font-bold text-green-400">
                                        ${cancha.precio || "8000"}
                                        <span className="text-sm text-zinc-300"> / hora</span>
                                    </p>

                                    {/* 🎯 BOTÓN */}
                                    <button
                                        onClick={() => navigate(`/reserva/${cancha.id}`)}
                                        className="border border-green-500 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500 hover:text-white transition"
                                    >
                                        Reservar →
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}