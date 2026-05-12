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


    // FECHA FORMATO

    function formatearFecha(date) {

        const offset = date.getTimezoneOffset();

        const localDate = new Date(
            date.getTime() - offset * 60000
        );

        return localDate
            .toISOString()
            .split("T")[0];
    }


    // DIA SEMANA
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


    // CALCULAR FIN

    function calcularFin(inicio, horas) {

        const [h] = inicio.split(":").map(Number);

        const fin = h + Number(horas);

        return `${String(fin).padStart(2, "0")}:00`;
    }


    // SELECCIONAR HORAS

    function toggleHora(hora) {

        setHorasSeleccionadas(prev => {

            if (prev.includes(hora)) {

                return prev.filter(h => h !== hora);
            }

            return [...prev, hora].sort();
        });
    }


    // CARGA DATOS

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

    if (!cancha) return <p>Cargando...</p>;

    const diaSeleccionado = normalizarDia(fecha);

    const horariosDelDia = horarios.filter(
        h => h.dia_semana === diaSeleccionado
    );


    // RESERVADO

    function estaReservado(fechaStr, hora) {

        return reservas.some(r => {

            const fechaReserva = String(r.fecha).split("T")[0];

            if (fechaReserva !== fechaStr) {
                return false;
            }

            const inicio = r.hora_inicio.slice(0, 5);
            const fin = r.hora_fin.slice(0, 5);

            return hora >= inicio && hora < fin;
        });
    }


    // BLOQUEADO

    function estaBloqueado(fechaStr, hora) {

        return bloqueos.some(b => {

            const fechaBloqueo = String(b.fecha).split("T")[0];

            if (fechaBloqueo !== fechaStr) {
                return false;
            }

            const inicio = b.hora_inicio.slice(0, 5);
            const fin = b.hora_fin.slice(0, 5);

            return hora >= inicio && hora < fin;
        });
    }


    // RESERVA

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


        // VALIDAR SI ALGUNA YA ESTÁ OCUPADA

        for (const hora of horasSeleccionadas) {

            const horaFin = calcularFin(hora, 1);

            const ocupado = reservas.some(r => {

                if (formatearFecha(new Date(r.fecha)) !== fechaStr) {
                    return false;
                }

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


        // ARMAR RESERVAS

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


        // INSERTAR

        const { error } = await supabase
            .from("reservas")
            .insert(reservasInsertar);

        if (error) {

            setMensaje("Error: " + error.message);

            return;
        }


        // ACTUALIZAR STATE

        setReservas(prev => [

            ...prev,

            ...reservasInsertar
        ]);


        // LIMPIAR

        setHorasSeleccionadas([]);

        setMensaje("Reserva confirmada ✅");
    }


    return (

        <div style={{ padding: "20px", textAlign: "center" }}>

            <button onClick={() => navigate(-1)}>
                ⬅ Volver
            </button>

            <h2>{club?.nombre}</h2>

            <h3>{cancha.nombre}</h3>

            <Calendar
                onChange={setFecha}
                value={fecha}
                className="calendario"
            />

            <h4>Elegí horarios</h4>

            {horariosDelDia.map(h => {

                const inicio = h.hora_inicio.slice(0, 5);

                const fin = h.hora_fin.slice(0, 5);

                const horas = [];

                let start = parseInt(inicio.split(":")[0]);

                const end = parseInt(fin.split(":")[0]);

                const fechaStr = formatearFecha(fecha);

                while (start < end) {

                    const hora = `${String(start).padStart(2, "0")}:00`;

                    const reservado = estaReservado(fechaStr, hora);

                    const bloqueado = estaBloqueado(fechaStr, hora);

                    const noDisponible = reservado || bloqueado;

                    horas.push(

                        <button
                            key={hora}
                            disabled={noDisponible}
                            onClick={() => toggleHora(hora)}
                            style={{
                                margin: "5px",
                                padding: "10px",
                                background: noDisponible
                                    ? "#777"
                                    : horasSeleccionadas.includes(hora)
                                        ? "green"
                                        : "#444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: noDisponible
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                        >
                            {hora}
                        </button>
                    );

                    start++;
                }

                return horas;
            })}


            <div style={{ marginTop: "20px" }}>

                <p>
                    Horarios seleccionados:
                </p>

                <p>
                    {horasSeleccionadas.length > 0
                        ? horasSeleccionadas.join(", ")
                        : "Ninguno"}
                </p>

            </div>


            <div style={{ marginTop: "20px" }}>

                <button onClick={reservar}>
                    Confirmar Reserva
                </button>

            </div>

            <p>{mensaje}</p>

        </div>
    );
}