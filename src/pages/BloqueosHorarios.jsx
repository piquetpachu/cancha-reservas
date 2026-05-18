import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function BloqueosHorarios() {

    const { id } = useParams();

    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [motivo, setMotivo] = useState("");
    const [bloqueos, setBloqueos] = useState([]);

    // CARGAR BLOQUEOS

    useEffect(() => {

        if (!id) return;

        cargarBloqueos();

    }, [id]);

    async function cargarBloqueos() {

        const { data, error } = await supabase
            .from("bloqueos_horarios")
            .select("*")
            .eq("cancha_id", id)
            .order("hora_inicio");

        if (error) {
            console.log("ERROR:", error);
            return;
        }

        setBloqueos(data || []);
    }

    // CREAR BLOQUEO

    async function crearBloqueo() {

        console.log("BOTÓN BLOQUEO PRESIONADO");

        if (!horaInicio || !horaFin) {
            console.log("FALTAN HORARIOS");
            return;
        }

        const { error } = await supabase
            .from("bloqueos_horarios")
            .insert({
                cancha_id: id,
                fecha: fecha || null,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                motivo: motivo || ""
            });

        if (error) {
            console.log("ERROR SUPABASE:", error);
            return;
        }

        setFecha("");
        setHoraInicio("");
        setHoraFin("");
        setMotivo("");

        cargarBloqueos();
    }

    // ELIMINAR BLOQUEO

    async function eliminar(idBloqueo) {

        await supabase
            .from("bloqueos_horarios")
            .delete()
            .eq("id", idBloqueo);

        cargarBloqueos();
    }

    // UI

    return (
        <div style={{ padding: "20px", maxWidth: "500px" }}>

            <h2>Bloqueos (Dueño)</h2>

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

            <p>Motivo (opcional)</p>
            <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
            />

            <button
                onClick={crearBloqueo}
                style={{ marginTop: "10px" }}
            >
                Crear bloqueo
            </button>

            <hr />

            <h3>Bloqueos actuales</h3>

            {bloqueos.length === 0 ? (
                <p>No hay bloqueos</p>
            ) : (
                bloqueos.map(b => (
                    <div
                        key={b.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "8px"
                        }}
                    >

                        <p>
                            📅 {b.fecha || "Sin fecha"}
                        </p>

                        <p>
                            🕐 {b.hora_inicio} - {b.hora_fin}
                        </p>

                        <p>
                            📝 {b.motivo}
                        </p>

                        <button
                            onClick={() => eliminar(b.id)}
                            style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: "5px 10px"
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