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

    const [horaInicio, setHoraInicio] = useState("");
    const [duracion, setDuracion] = useState(1);

    const [mensaje, setMensaje] = useState("");

    const [horarios, setHorarios] = useState([]);
    const [reservas, setReservas] = useState([]);

    // =========================
    // FECHA FORMATO
    // =========================
    function formatearFecha(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // =========================
    // DÍA SEMANA
    // =========================
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

    // =========================
    // GENERAR HORARIO FIN
    // =========================
    function calcularFin(inicio, horas) {

        const [h] = inicio.split(":").map(Number);

        const fin = h + Number(horas);

        return `${String(fin).padStart(2, "0")}:00`;
    }

    // =========================
    // CARGA DATOS
    // =========================
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
                .select("fecha, hora_inicio")
                .eq("cancha_id", id);

            setReservas(reservasData || []);
        }

        if (id) fetchData();

    }, [id]);

    if (!cancha) return <p>Cargando...</p>;

    const diaSeleccionado = normalizarDia(fecha);

    const horariosDelDia = horarios.filter(
        h => h.dia_semana === diaSeleccionado
    );

    // =========================
    // RESERVAR
    // =========================
    async function reservar() {

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            setMensaje("Tenés que iniciar sesión");
            return;
        }

        if (!horaInicio) {
            setMensaje("Seleccioná un horario");
            return;
        }

        const fechaStr = formatearFecha(fecha);
        const horaFin = calcularFin(horaInicio, duracion);

        // validar conflicto
        const ocupado = reservas.some(r =>
            formatearFecha(new Date(r.fecha)) === fechaStr &&
            r.hora_inicio?.slice(0, 5) >= horaInicio &&
            r.hora_inicio?.slice(0, 5) < horaFin
        );

        if (ocupado) {
            setMensaje("Ese horario ya está reservado ❌");
            return;
        }

        const { error } = await supabase
            .from("reservas")
            .insert({
                usuario_id: user.id,
                cancha_id: cancha.id,
                fecha: fechaStr,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                estado: "confirmada"
            });

        if (error) {
            setMensaje("Error: " + error.message);
            return;
        }

        setReservas(prev => [
            ...prev,
            { fecha: fechaStr, hora_inicio: horaInicio }
        ]);

        setMensaje("Reserva confirmada ✅");
    }

    // =========================
    // UI
    // =========================
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>

            <button onClick={() => navigate(-1)}>
                ⬅ Volver
            </button>

            <h2>{club?.nombre}</h2>

            <h3>{cancha.nombre}</h3>

            {/* CALENDARIO */}
            <Calendar
                onChange={setFecha}
                value={fecha}
                className="calendario"
            />

            {/* HORARIOS */}
            <h4>Elegí hora de inicio</h4>

            {horariosDelDia.length === 0 ? (
                <p>No hay horarios</p>
            ) : (
                horariosDelDia.map(h => {

                    const inicio = h.hora_inicio.slice(0, 5);
                    const fin = h.hora_fin.slice(0, 5);

                    const horas = [];

                    let start = parseInt(inicio.split(":")[0]);
                    const end = parseInt(fin.split(":")[0]);

                    while (start < end) {

                        const hora = `${String(start).padStart(2, "0")}:00`;

                        horas.push(hora);

                        start++;
                    }

                    return horas.map(hora => {

                        const ocupado = reservas.some(r =>
                            formatearFecha(new Date(r.fecha)) === formatearFecha(fecha) &&
                            r.hora_inicio?.slice(0, 5) === hora
                        );

                        return (
                            <button
                                key={hora}
                                disabled={ocupado}
                                onClick={() => setHoraInicio(hora)}
                                style={{
                                    margin: "5px",
                                    padding: "10px",
                                    background: ocupado
                                        ? "#999"
                                        : horaInicio === hora
                                            ? "green"
                                            : "#444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: ocupado ? "not-allowed" : "pointer"
                                }}
                            >
                                {hora}
                            </button>
                        );
                    });
                })
            )}

            {/* DURACIÓN */}
            <div style={{ marginTop: "20px" }}>
                <h4>Duración (horas)</h4>

                <select
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                >
                    <option value={1}>1 hora</option>
                    <option value={2}>2 horas</option>
                    <option value={3}>3 horas</option>
                </select>
            </div>

            {/* RESERVAR */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={reservar}>
                    Confirmar Reserva
                </button>
            </div>

            <p>{mensaje}</p>

        </div>
    );
}