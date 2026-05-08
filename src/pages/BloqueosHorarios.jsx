import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function BloqueosHorarios() {

    const { id } = useParams();

    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [bloqueos, setBloqueos] = useState([]);

    // =========================
    // CARGAR BLOQUEOS
    // =========================
    useEffect(() => {

        if (!id) return;

        async function cargar() {

            const { data } = await supabase
                .from("bloqueos_horarios")
                .select("*")
                .eq("cancha_id", id)
                .order("hora_inicio");

            setBloqueos(data || []);
        }

        cargar();

    }, [id]);

    // =========================
    // CREAR BLOQUEO
    // =========================
    async function crearBloqueo() {

        if (!horaInicio || !horaFin) return;

        const { error } = await supabase
            .from("bloqueos_horarios")
            .insert({
                cancha_id: id,
                fecha: fecha || null,
                hora_inicio: horaInicio,
                hora_fin: horaFin
            });

        if (!error) {

            const { data } = await supabase
                .from("bloqueos_horarios")
                .select("*")
                .eq("cancha_id", id);

            setBloqueos(data || []);
        }
    }

    // =========================
    // ELIMINAR BLOQUEO
    // =========================
    async function eliminarBloqueo(bloqueoId) {

        const { error } = await supabase
            .from("bloqueos_horarios")
            .delete()
            .eq("id", bloqueoId);

        if (!error) {

            setBloqueos(prev =>
                prev.filter(b => b.id !== bloqueoId)
            );
        }
    }

    // =========================
    // UI
    // =========================
    return (
        <div style={{ padding: "20px", maxWidth: "500px" }}>

            <h2>Bloqueos de Horarios</h2>

            <p>Fecha (opcional)</p>
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />

            <p>Hora inicio</p>
            <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
            />

            <p>Hora fin</p>
            <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
            />

            <button
                onClick={crearBloqueo}
                style={{ marginTop: "10px" }}
            >
                Bloquear horario
            </button>

            <hr />

            <h3>Bloqueos activos</h3>

            {bloqueos.length === 0 ? (
                <p>No hay bloqueos</p>
            ) : (
                bloqueos.map(b => (
                    <div
                        key={b.id}
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            marginBottom: "8px",
                            borderRadius: "8px"
                        }}
                    >
                        <p>
                            📅 {b.fecha || "Todos los días"}
                        </p>

                        <p>
                            🕐 {b.hora_inicio} - {b.hora_fin}
                        </p>

                        <button
                            onClick={() => eliminarBloqueo(b.id)}
                            style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "5px"
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                ))
            )}

        </div>
    );
}