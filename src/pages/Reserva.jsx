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

    const [fechasReservadas, setFechasReservadas] = useState([]);

    const horarios = [
        "10:00",
        "11:00",
        "12:00",
        "18:00",
        "19:00"
    ];

    // 📅 FORMATEAR FECHA
    function formatearFecha(fecha) {

        const year = fecha.getFullYear();

        const month = String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            fecha.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    useEffect(() => {

        async function fetchData() {

            // cancha + club
            const { data, error } = await supabase
                .from("canchas")
                .select("*, clubs(*)")
                .eq("id", id)
                .single();

            if (!error) {
                setCancha(data);
                setClub(data.clubs);
            }

            // reservas
            const { data: reservas } = await supabase
                .from("reservas")
                .select("fecha")
                .eq("cancha_id", id);

            if (reservas) {

                const fechas = reservas.map((r) =>
                    formatearFecha(new Date(r.fecha))
                );

                console.log("RESERVAS RAW:", reservas);
                console.log("FECHAS RESERVADAS:", fechas);

                setFechasReservadas(fechas);
            }
        }

        fetchData();

    }, [id]);

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

        // evitar duplicadas
        if (fechasReservadas.includes(fechaStr)) {
            setMensaje("Ese día ya está reservado ❌");
            return;
        }

        const { error } = await supabase
            .from("reservas")
            .insert({
                usuario_id: user.id,
                cancha_id: cancha.id,
                fecha: fechaStr,
                hora_inicio: hora + ":00",
                hora_fin: hora + ":00",
                estado: "confirmada"
            });

        if (error) {

            setMensaje("Error: " + error.message);

        } else {

            // agregar fecha ocupada al estado
            setFechasReservadas(prev => [
                ...prev,
                fechaStr
            ]);

            setMensaje("Reserva confirmada ✅");
        }
    }

    if (!cancha) return <p>Cargando...</p>;

    return (
        <div
            style={{
                padding: "20px",
                textAlign: "center"
            }}
        >

            {/* volver */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "15px",
                    padding: "8px 12px",
                    cursor: "pointer"
                }}
            >
                ⬅ Volver
            </button>

            {/* club */}
            <h2>{club?.nombre}</h2>

            {/* imagen */}
            {cancha.foto && (
                <img
                    src={cancha.foto}
                    alt={cancha.nombre}
                    width="300"
                    style={{
                        borderRadius: "10px",
                        marginBottom: "15px"
                    }}
                />
            )}

            {/* info */}
            <h3>{cancha.nombre}</h3>

            <p>{cancha.descripcion}</p>

            {/* calendario */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px"
                }}
            >
                <Calendar
                    onChange={setFecha}
                    value={fecha}
                    className="calendario"

                    tileClassName={({ date }) => {

                        const fechaStr = formatearFecha(date);

                        if (fechasReservadas.includes(fechaStr)) {
                            return "ocupado";
                        }

                        return null;
                    }}
                />
            </div>

            {/* horarios */}
            <div style={{ marginTop: "20px" }}>

                <h4>Horarios</h4>

                {horarios.map((h) => (

                    <button
                        key={h}
                        onClick={() => setHora(h)}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            background:
                                hora === h
                                    ? "green"
                                    : "#555",

                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        {h}
                    </button>

                ))}
            </div>

            {/* botón */}
            <div style={{ marginTop: "20px" }}>

                <button
                    onClick={reservar}
                    style={{
                        padding: "10px 20px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Confirmar Reserva
                </button>

            </div>

            {/* mensaje */}
            <p style={{ marginTop: "15px" }}>
                {mensaje}
            </p>

        </div>
    );
}