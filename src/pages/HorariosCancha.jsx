import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function HorariosCancha() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const dias = [
        "lunes", "martes", "miercoles",
        "jueves", "viernes", "sabado", "domingo"
    ];

    async function cargarHorarios() {
        const { data, error } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id)
            .order("dia_semana", { ascending: true })
            .order("hora_inicio", { ascending: true });

        if (!error) setHorarios(data || []);
    }

    useEffect(() => {
        if (id) cargarHorarios();
    }, [id]);

    function toggleDia(dia) {
        setDiasSeleccionados(prev =>
            prev.includes(dia)
                ? prev.filter(d => d !== dia)
                : [...prev, dia]
        );
    }

    function seleccionarTodos() {
        setDiasSeleccionados(dias);
    }

    function seleccionarSemana() {
        setDiasSeleccionados(dias.slice(0, 5));
    }

    function seleccionarFinde() {
        setDiasSeleccionados(dias.slice(5));
    }

    function normalizarHora(hora) {
        return hora.slice(0, 2) + ":00";
    }

    async function guardarHorario() {

        setMensaje("");

        if (!diasSeleccionados.length || !horaInicio || !horaFin) {
            setMensaje("Completá todos los campos");
            return;
        }

        const inicio = normalizarHora(horaInicio);
        const fin = normalizarHora(horaFin);

        if (inicio >= fin) {
            setMensaje("La hora final debe ser mayor");
            return;
        }

        const existeDuplicado = horarios.some(h =>
            diasSeleccionados.includes(h.dia_semana) &&
            h.hora_inicio.slice(0, 5) === inicio &&
            h.hora_fin.slice(0, 5) === fin
        );

        if (existeDuplicado) {
            setMensaje("Ese horario ya existe");
            return;
        }

        const existeSolapamiento = horarios.some(h => {
            if (!diasSeleccionados.includes(h.dia_semana)) return false;
            return inicio < h.hora_fin && fin > h.hora_inicio;
        });

        if (existeSolapamiento) {
            setMensaje("Ya existe un horario que se superpone");
            return;
        }

        const datos = diasSeleccionados.map(dia => ({
            cancha_id: id,
            dia_semana: dia,
            hora_inicio: inicio,
            hora_fin: fin
        }));

        const { error } = await supabase
            .from("horarios_cancha")
            .insert(datos);

        if (error) {
            setMensaje("Error: " + error.message);
            return;
        }

        setDiasSeleccionados([]);
        setHoraInicio("");
        setHoraFin("");
        setMensaje("Horarios agregados ✅");

        await cargarHorarios();
    }

    async function eliminarHorario(horarioId) {
        await supabase
            .from("horarios_cancha")
            .delete()
            .match({ id: horarioId });

        await cargarHorarios();
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-24">

            {/* HEADER */}
            <div className="px-6 pt-8 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-zinc-400 hover:text-white mb-4"
                >
                    ← Volver
                </button>

                <h2 className="text-3xl font-bold">
                    Horarios de la cancha
                </h2>

                <p className="text-zinc-400 text-sm mt-1">
                    Definí los horarios disponibles
                </p>
            </div>

            <div className="px-6 flex flex-col gap-6">

                {/* BOTONES RÁPIDOS */}
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={seleccionarTodos}
                        className="px-4 py-2 bg-zinc-800 rounded-xl hover:bg-blue-600 transition"
                    >
                        Todos
                    </button>

                    <button
                        onClick={seleccionarSemana}
                        className="px-4 py-2 bg-zinc-800 rounded-xl hover:bg-blue-600 transition"
                    >
                        Lun - Vie
                    </button>

                    <button
                        onClick={seleccionarFinde}
                        className="px-4 py-2 bg-zinc-800 rounded-xl hover:bg-blue-600 transition"
                    >
                        Finde
                    </button>
                </div>

                {/* DÍAS */}
                <div className="flex flex-wrap gap-3">
                    {dias.map(dia => (
                        <button
                            key={dia}
                            onClick={() => toggleDia(dia)}
                            className={`px-4 py-2 rounded-xl text-sm transition
                                ${diasSeleccionados.includes(dia)
                                    ? "bg-blue-600"
                                    : "bg-zinc-800 hover:bg-zinc-700"
                                }`}
                        >
                            {dia}
                        </button>
                    ))}
                </div>

                {/* HORAS */}
                <div className="flex gap-4">

                    <select
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                    >
                        <option value="">Hora inicio</option>
                        {Array.from({ length: 24 }).map((_, i) => {
                            const hora = String(i).padStart(2, "0") + ":00";
                            return <option key={hora} value={hora}>{hora}</option>;
                        })}
                    </select>

                    <select
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                    >
                        <option value="">Hora fin</option>
                        {Array.from({ length: 24 }).map((_, i) => {
                            const hora = String(i).padStart(2, "0") + ":00";
                            return <option key={hora} value={hora}>{hora}</option>;
                        })}
                    </select>

                </div>

                {/* BOTÓN */}
                <button
                    onClick={guardarHorario}
                    className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold text-lg transition shadow-lg shadow-blue-900/30"
                >
                    Guardar horarios
                </button>

                {/* MENSAJE */}
                {mensaje && (
                    <p className="text-sm text-zinc-300">
                        {mensaje}
                    </p>
                )}

                {/* LISTA */}
                <div className="mt-6 flex flex-col gap-3">

                    <h3 className="text-xl font-semibold">
                        Horarios cargados
                    </h3>

                    {horarios.length === 0 ? (
                        <p className="text-zinc-400">
                            No hay horarios
                        </p>
                    ) : (
                        horarios.map(h => (
                            <div
                                key={h.id}
                                className="flex justify-between items-center bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-xl"
                            >
                                <span className="text-sm">
                                    {h.dia_semana} {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                                </span>

                                <button
                                    onClick={() => eliminarHorario(h.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}