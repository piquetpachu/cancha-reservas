import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css";

export default function Reserva() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [cancha, setCancha] = useState(null);
    const [club, setClub] = useState(null);

    const [fecha, setFecha] = useState(new Date());
    const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const [horarios, setHorarios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [bloqueos, setBloqueos] = useState([]);

    function formatearFecha(date) {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().split("T")[0];
    }

    function normalizarDia(date) {
        const raw = date.toLocaleDateString("es-ES", {
            weekday: "long"
        }).toLowerCase();

        const mapa = {
            miércoles: "miercoles",
            miercoles: "miercoles",
            sábado: "sabado",
            sabado: "sabado"
        };

        return mapa[raw] || raw;
    }

    function calcularFin(inicio, horas) {
        const [h] = inicio.split(":").map(Number);
        const fin = h + Number(horas);
        return `${String(fin).padStart(2, "0")}:00`;
    }

    function toggleHora(hora) {
        setHorasSeleccionadas(prev => {
            if (prev.includes(hora)) {
                return prev.filter(h => h !== hora);
            }
            return [...prev, hora].sort();
        });
    }

    useEffect(() => {

        async function fetchData() {

            const { data } = await supabase
                .from("canchas")
                .select("*, clubs(*)")
                .eq("id", id)
                .single();

            if (data) {
                setCancha(data);
                setClub(data.clubs);
            }

            const { data: horariosData } = await supabase
                .from("horarios_cancha")
                .select("*")
                .eq("cancha_id", id);

            setHorarios(horariosData || []);

            const { data: reservasData } = await supabase
                .from("reservas")
                .select("*")
                .eq("cancha_id", id);

            setReservas(reservasData || []);

            const { data: bloqueosData } = await supabase
                .from("bloqueos_horarios")
                .select("*")
                .eq("cancha_id", id);

            setBloqueos(bloqueosData || []);
        }

        if (id) fetchData();

    }, [id]);

    if (!cancha) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                Cargando...
            </div>
        );
    }

    const diaSeleccionado = normalizarDia(fecha);

    const horariosDelDia = horarios.filter(
        h => h.dia_semana === diaSeleccionado
    );

    function estaReservado(fechaStr, hora) {
        return reservas.some(r => {
            const fechaReserva = String(r.fecha).split("T")[0];
            if (fechaReserva !== fechaStr) return false;

            const inicio = r.hora_inicio.slice(0, 5);
            const fin = r.hora_fin.slice(0, 5);

            return hora >= inicio && hora < fin;
        });
    }

    function estaBloqueado(fechaStr, hora) {
        return bloqueos.some(b => {
            const fechaBloqueo = String(b.fecha).split("T")[0];
            if (fechaBloqueo !== fechaStr) return false;

            const inicio = b.hora_inicio.slice(0, 5);
            const fin = b.hora_fin.slice(0, 5);

            return hora >= inicio && hora < fin;
        });
    }

    async function reservar() {

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            setMensaje("Tenés que iniciar sesión");
            return;
        }

        if (horasSeleccionadas.length === 0) {
            setMensaje("Seleccioná al menos un horario");
            return;
        }

        const fechaStr = formatearFecha(fecha);

        for (const hora of horasSeleccionadas) {

            const horaFin = calcularFin(hora, 1);

            const ocupado = reservas.some(r => {

                if (formatearFecha(new Date(r.fecha)) !== fechaStr) return false;

                const inicioReserva = r.hora_inicio?.slice(0, 5);
                const finReserva = r.hora_fin?.slice(0, 5);

                return (
                    hora < finReserva &&
                    horaFin > inicioReserva
                );
            });

            if (ocupado) {
                setMensaje(`El horario ${hora} ya está reservado ❌`);
                return;
            }
        }

        const reservasInsertar = horasSeleccionadas.map(hora => {
            const horaFin = calcularFin(hora, 1);

            return {
                usuario_id: user.id,
                cancha_id: cancha.id,
                fecha: fechaStr,
                hora_inicio: hora,
                hora_fin: horaFin,
                estado: "confirmada"
            };
        });

        const { error } = await supabase
            .from("reservas")
            .insert(reservasInsertar);

        if (error) {
            setMensaje("Error: " + error.message);
            return;
        }

        setReservas(prev => [...prev, ...reservasInsertar]);
        setHorasSeleccionadas([]);
        setMensaje("Reserva confirmada ✅");
    }

    return (

        <div className="min-h-screen bg-zinc-950 text-white px-4 py-6">

            {/* VOLVER */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition"
            >
                ← Volver
            </button>

            {/* 🔥 IMAGEN + NOMBRE ENCIMA */}
            <div className="relative mb-4">

                <div className="h-52 rounded-2xl overflow-hidden border border-zinc-800">

                    {cancha.foto ? (
                        <img
                            src={cancha.foto}
                            alt={cancha.nombre}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            Sin imagen
                        </div>
                    )}

                </div>

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl" />

                {/* TEXTO SOBRE IMAGEN */}
                <div className="absolute bottom-4 left-4">
                    {/* <h2 className="text-sm text-zinc-300">{club?.nombre}</h2> */}
                    <h1 className="text-2xl font-bold">{cancha.nombre}</h1>
                </div>

            </div>

            {/* 🔥 DESCRIPCIÓN */}
            <p className="text-zinc-400 text-sm mb-6">
                {cancha.descripcion || "Sin descripción"}
            </p>

            {/* CALENDARIO */}
            <div className="flex justify-center mb-6">
                <Calendar
                    onChange={setFecha}
                    value={fecha}
                    className="calendario"
                />
            </div>

            {/* RESTO IGUAL ↓↓↓ */}

            <div className="flex justify-center gap-4 mb-4 text-xs flex-wrap">

                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-zinc-700 rounded"></div>
                    Disponible
                </div>

                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    Seleccionado
                </div>

                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    Reservado
                </div>

                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    Bloqueado
                </div>

            </div>

            <h3 className="text-center font-semibold mb-4">
                Elegí horarios
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-8">

                {horariosDelDia.map(h => {

                    const inicio = h.hora_inicio.slice(0, 5);
                    const fin = h.hora_fin.slice(0, 5);

                    let start = parseInt(inicio.split(":")[0]);
                    const end = parseInt(fin.split(":")[0]);

                    const fechaStr = formatearFecha(fecha);

                    const botones = [];

                    while (start < end) {

                        const hora = `${String(start).padStart(2, "0")}:00`;

                        const reservado = estaReservado(fechaStr, hora);
                        const bloqueado = estaBloqueado(fechaStr, hora);
                        const seleccionado = horasSeleccionadas.includes(hora);

                        let estilo = "";
                        let label = "";

                        if (bloqueado) {
                            estilo = "bg-red-700/80 text-red-200 cursor-not-allowed";
                            label = "Bloqueado";
                        }
                        else if (reservado) {
                            estilo = "bg-yellow-600/80 text-yellow-100 cursor-not-allowed";
                            label = "Reservado";
                        }
                        else if (seleccionado) {
                            estilo = "bg-green-600 text-white scale-105 shadow-lg";
                        }
                        else {
                            estilo = "bg-zinc-800 hover:bg-zinc-700";
                        }

                        botones.push(
                            <button
                                key={hora}
                                disabled={bloqueado || reservado}
                                onClick={() => toggleHora(hora)}
                                className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${estilo}`}
                            >
                                {hora}
                                {label && (
                                    <span className="block text-[10px] opacity-80">
                                        {label}
                                    </span>
                                )}
                            </button>
                        );

                        start++;
                    }

                    return botones;
                })}

            </div>

            <div className="text-center mb-6">
                <p className="text-zinc-400 text-sm">
                    Horarios seleccionados
                </p>
                <p className="font-semibold mt-2">
                    {horasSeleccionadas.length
                        ? horasSeleccionadas.join(", ")
                        : "Ninguno"}
                </p>
            </div>

            <button
                onClick={reservar}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold"
            >
                Confirmar Reserva
            </button>

            {mensaje && (
                <p className="mt-4 text-center text-sm text-zinc-300">
                    {mensaje}
                </p>
            )}

        </div>
    );
}