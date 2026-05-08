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
    const [hora, setHora] = useState("");

    const [mensaje, setMensaje] = useState("");

    const [horarios, setHorarios] = useState([]);
    const [reservas, setReservas] = useState([]);

    // -------------------------
    // FORMATEAR FECHA
    // -------------------------
    function formatearFecha(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // -------------------------
    // NORMALIZAR HORA
    // -------------------------
    function normalizarHora(hora) {
        return hora ? hora.slice(0, 5) : "";
    }

    // -------------------------
    // CARGAR DATOS
    // -------------------------
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

    // 🔥 DEBUG CORRECTO (NO en consola global)
    useEffect(() => {
        console.log("HORARIOS:", horarios);
    }, [horarios]);

    // -------------------------
    // RESERVAS DEL DÍA
    // -------------------------
    function reservasDelDia(fechaStr) {
        return reservas.filter(r =>
            formatearFecha(new Date(r.fecha)) === fechaStr
        );
    }

    function diaCompleto(fechaStr) {
        return horarios.length > 0 &&
            reservasDelDia(fechaStr).length >= horarios.length;
    }

    // -------------------------
    // RESERVAR
    // -------------------------
    async function reservar() {

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            setMensaje("Tenés que iniciar sesión");
            return;
        }

        if (!fecha || !hora) {
            setMensaje("Seleccioná fecha y horario");
            return;
        }

        const fechaStr = formatearFecha(fecha);

        const ocupado = reservas.some(r =>
            formatearFecha(new Date(r.fecha)) === fechaStr &&
            normalizarHora(r.hora_inicio) === normalizarHora(hora)
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
                hora_inicio: hora,
                hora_fin: hora,
                estado: "confirmada"
            });

        if (error) {
            setMensaje("Error: " + error.message);
            return;
        }

        setReservas(prev => [
            ...prev,
            {
                fecha: fechaStr,
                hora_inicio: hora
            }
        ]);

        setMensaje("Reserva confirmada ✅");
    }

    if (!cancha) return <p>Cargando...</p>;

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>

            <button onClick={() => navigate(-1)}>
                ⬅ Volver
            </button>

            <h2>{club?.nombre}</h2>

            {cancha.foto && (
                <img
                    src={cancha.foto}
                    alt={cancha.nombre}
                    width="300"
                    style={{ borderRadius: "10px" }}
                />
            )}

            <h3>{cancha.nombre}</h3>
            <p>{cancha.descripcion}</p>

            {/* CALENDARIO */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Calendar
                    onChange={setFecha}
                    value={fecha}
                    className="calendario"
                    tileClassName={({ date }) => {

                        const fechaStr = formatearFecha(date);

                        if (diaCompleto(fechaStr)) {
                            return "ocupado";
                        }

                        return null;
                    }}
                />
            </div>

            {/* HORARIOS */}
            <div style={{ marginTop: "20px" }}>
                <h4>Horarios</h4>

                {horarios.map((h) => {

                    const horaInicio = normalizarHora(h.hora_inicio);

                    const ocupado = reservas.some(r =>
                        formatearFecha(new Date(r.fecha)) === formatearFecha(fecha) &&
                        normalizarHora(r.hora_inicio) === horaInicio
                    );

                    return (
                        <button
                            key={h.id}
                            disabled={ocupado}
                            onClick={() => setHora(horaInicio)}
                            style={{
                                margin: "5px",
                                padding: "10px",
                                background: ocupado
                                    ? "#999"
                                    : hora === horaInicio
                                        ? "green"
                                        : "#444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: ocupado ? "not-allowed" : "pointer"
                            }}
                        >
                            {horaInicio}
                        </button>
                    );
                })}
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