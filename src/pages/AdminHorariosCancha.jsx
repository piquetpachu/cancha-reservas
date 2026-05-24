import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminHorariosCancha() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(true);

    const dias = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"
    ];

    // 🔥 CARGAR
    async function cargarHorarios() {

        setLoading(true);

        const { data, error } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id)
            .order("dia_semana", { ascending: true })
            .order("hora_inicio", { ascending: true });

        if (!error) {
            setHorarios(data || []);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (id) cargarHorarios();
    }, [id]);

    // 🔥 TOGGLE DIA
    function toggleDia(dia) {
        setDiasSeleccionados(prev =>
            prev.includes(dia)
                ? prev.filter(d => d !== dia)
                : [...prev, dia]
        );
    }

    // 🔥 SELECCIONES RÁPIDAS
    function seleccionarTodos() {
        setDiasSeleccionados(dias);
    }

    function seleccionarSemana() {
        setDiasSeleccionados(dias.slice(0, 5));
    }

    function seleccionarFinde() {
        setDiasSeleccionados(["sabado", "domingo"]);
    }

    // 🔥 NORMALIZAR
    function normalizarHora(hora) {
        return hora.slice(0, 2) + ":00";
    }

    // 🔥 GUARDAR
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

        const duplicado = horarios.some(h =>
            diasSeleccionados.includes(h.dia_semana) &&
            h.hora_inicio.slice(0, 5) === inicio &&
            h.hora_fin.slice(0, 5) === fin
        );

        if (duplicado) {
            setMensaje("Ese horario ya existe");
            return;
        }

        const solapado = horarios.some(h => {
            if (!diasSeleccionados.includes(h.dia_semana)) return false;

            return (
                inicio < h.hora_fin &&
                fin > h.hora_inicio
            );
        });

        if (solapado) {
            setMensaje("Hay superposición de horarios");
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

        cargarHorarios();
    }

    // 🔥 ELIMINAR
    async function eliminarHorario(idHorario) {

        if (!window.confirm("¿Eliminar horario?")) return;

        await supabase
            .from("horarios_cancha")
            .delete()
            .eq("id", idHorario);

        cargarHorarios();
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Cargando horarios...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-zinc-950 text-white">

            <NavbarAdmin />

            <div className="max-w-xl mx-auto px-4 pt-4 pb-20">

                {/* VOLVER */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition text-sm"
                >
                    ← Volver
                </button>

                <h1 className="text-2xl font-bold mb-4">
                    Horarios de la cancha
                </h1>

                {/* 🔥 ACCIONES RÁPIDAS */}
                <div className="flex gap-2 flex-wrap mb-4">

                    <button
                        onClick={seleccionarTodos}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
                    >
                        Todos
                    </button>

                    <button
                        onClick={seleccionarSemana}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
                    >
                        Lun-Vie
                    </button>

                    <button
                        onClick={seleccionarFinde}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
                    >
                        Finde
                    </button>

                </div>

                {/* 🔥 DÍAS */}
                <div className="flex flex-wrap gap-2 mb-4">

                    {dias.map(dia => (

                        <button
                            key={dia}
                            onClick={() => toggleDia(dia)}
                            className={`px-3 py-2 rounded-xl text-sm capitalize transition
                                ${diasSeleccionados.includes(dia)
                                    ? "bg-blue-600"
                                    : "bg-zinc-800 hover:bg-zinc-700"
                                }`}
                        >
                            {dia}
                        </button>

                    ))}

                </div>

                {/* 🔥 HORAS */}
                <div className="flex gap-3 mb-4">

                    <select
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
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
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2"
                    >
                        <option value="">Fin</option>
                        {Array.from({ length: 24 }).map((_, i) => {
                            const h = String(i).padStart(2, "0") + ":00";
                            return <option key={h}>{h}</option>;
                        })}
                    </select>

                </div>

                {/* 🔥 BOTÓN */}
                <button
                    onClick={guardarHorario}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold mb-3"
                >
                    Guardar horarios
                </button>

                {mensaje && (
                    <p className="text-sm text-zinc-300 mb-4">
                        {mensaje}
                    </p>
                )}

                {/* 🔥 LISTA */}
                {horarios.length === 0 ? (

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-400">
                        No hay horarios
                    </div>

                ) : (

                    <div className="space-y-3">

                        {horarios.map(h => (

                            <div
                                key={h.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center"
                            >

                                <div>
                                    <p className="font-semibold capitalize">
                                        {h.dia_semana}
                                    </p>

                                    <p className="text-sm text-zinc-400">
                                        {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => eliminarHorario(h.id)}
                                    className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-sm"
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