import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminHorariosCancha() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [horarios, setHorarios] = useState([]);

    const [dia, setDia] = useState("Lunes");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        cargarHorarios();

    }, [id]);

    async function cargarHorarios() {

        setLoading(true);

        const {
            data,
            error
        } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id)
            .order("dia_semana", {
                ascending: true
            });

        if (error) {

            console.log(error);

        } else {

            setHorarios(data || []);
        }

        setLoading(false);
    }

    async function agregarHorario(e) {

        e.preventDefault();

        if (!horaInicio || !horaFin) {

            alert("Completa los horarios");
            return;
        }

        setGuardando(true);

        const {
            error
        } = await supabase
            .from("horarios_cancha")
            .insert([
                {
                    cancha_id: id,
                    dia_semana: dia,
                    hora_inicio: horaInicio,
                    hora_fin: horaFin
                }
            ]);

        setGuardando(false);

        if (error) {

            console.log(error);
            alert("Error al agregar horario");
            return;
        }

        setHoraInicio("");
        setHoraFin("");

        cargarHorarios();
    }

    async function eliminarHorario(horarioId) {

        const confirmar = window.confirm(
            "¿Eliminar horario?"
        );

        if (!confirmar) return;

        const {
            error
        } = await supabase
            .from("horarios_cancha")
            .delete()
            .eq("id", horarioId);

        if (error) {

            console.log(error);
            return;
        }

        cargarHorarios();
    }

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background: "#121212",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white"
                }}
            >
                Cargando horarios...
            </div>
        );
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                padding: "14px",
                boxSizing: "border-box",
                paddingBottom: "40px"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "18px"
                }}
            >

                <button
                    onClick={() =>
                        navigate(-1)
                    }
                    style={{
                        width: "fit-content",
                        background: "#1f1f1f",
                        border: "1px solid #2e2e2e",
                        color: "white",
                        borderRadius: "10px",
                        padding: "9px 14px",
                        cursor: "pointer"
                    }}
                >
                    ← Volver
                </button>

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "24px"
                        }}
                    >
                        Gestionar horarios
                    </h1>

                    <p
                        style={{
                            marginTop: "5px",
                            color: "#9e9e9e",
                            fontSize: "13px"
                        }}
                    >
                        Panel administrativo
                    </p>

                </div>

            </div>

            {/* FORM */}

            <form
                onSubmit={agregarHorario}
                style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "18px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    marginBottom: "22px"
                }}
            >

                <select
                    value={dia}
                    onChange={(e) =>
                        setDia(e.target.value)
                    }
                    style={{
                        width: "100%",
                        background: "#202020",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "13px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none"
                    }}
                >
                    <option>Lunes</option>
                    <option>Martes</option>
                    <option>Miércoles</option>
                    <option>Jueves</option>
                    <option>Viernes</option>
                    <option>Sábado</option>
                    <option>Domingo</option>
                </select>

                <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) =>
                        setHoraInicio(e.target.value)
                    }
                    style={{
                        width: "100%",
                        background: "#202020",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "13px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <input
                    type="time"
                    value={horaFin}
                    onChange={(e) =>
                        setHoraFin(e.target.value)
                    }
                    style={{
                        width: "100%",
                        background: "#202020",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "13px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <button
                    type="submit"
                    disabled={guardando}
                    style={{
                        background: "#1565c0",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    {guardando
                        ? "Guardando..."
                        : "Agregar horario"}
                </button>

            </form>

            {/* LISTA */}

            {horarios.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        borderRadius: "14px",
                        padding: "16px",
                        color: "#9e9e9e"
                    }}
                >
                    No hay horarios
                </div>

            ) : (

                horarios.map((h) => (

                    <div
                        key={h.id}
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "14px",
                            padding: "14px",
                            marginBottom: "10px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "15px"
                                    }}
                                >
                                    {h.dia_semana}
                                </h3>

                                <p
                                    style={{
                                        marginTop: "6px",
                                        color: "#bdbdbd",
                                        fontSize: "13px"
                                    }}
                                >
                                    {h.hora_inicio} - {h.hora_fin}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    eliminarHorario(h.id)
                                }
                                style={{
                                    background: "#b71c1c",
                                    border: "none",
                                    color: "white",
                                    borderRadius: "10px",
                                    padding: "9px 12px",
                                    fontWeight: "700",
                                    cursor: "pointer"
                                }}
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}