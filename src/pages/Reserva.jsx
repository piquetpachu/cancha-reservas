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
    // FORMATEAR FECHA (YYYY-MM-DD)
    // -------------------------
    function formatearFecha(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // -------------------------
    // OBTENER DIA SEMANA
    // -------------------------
    function obtenerDiaSemana(date) {
        return date.toLocaleDateString("es-ES", {
            weekday: "long"
        }).toLowerCase();
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

    // -------------------------
    // FILTRAR HORARIOS POR DIA
    // -------------------------
    const diaSeleccionado = obtenerDiaSemana(fecha);

    const horariosDelDia = horarios.filter(
        h => h.dia_semana === diaSeleccionado
    );

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
            r.hora_inicio?.slice(0, 5) === hora
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
            { fecha: fechaStr, hora_inicio: hora }
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
            <Calendar
                onChange={setFecha}
                value={fecha}
                className="calendario"
            />

            {/* HORARIOS DEL DÍA */}
            <div style={{ marginTop: "20px" }}>
                <h4>Horarios disponibles ({diaSeleccionado})</h4>

                {horariosDelDia.length === 0 ? (
                    <p>No hay horarios este día</p>
                ) : (
                    horariosDelDia.map((h) => {

                        const horaInicio = h.hora_inicio.slice(0, 5);

                        const ocupado = reservas.some(r =>
                            formatearFecha(new Date(r.fecha)) === formatearFecha(fecha) &&
                            r.hora_inicio?.slice(0, 5) === horaInicio
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
                    })
                )}
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