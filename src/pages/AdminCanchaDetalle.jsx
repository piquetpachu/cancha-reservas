import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminCanchaDetalle() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [cancha, setCancha] = useState(null);
    const [club, setClub] = useState(null);

    const [horarios, setHorarios] = useState([]);
    const [bloqueos, setBloqueos] = useState([]);
    const [reservas, setReservas] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        cargarDatos();

    }, [id]);

    async function cargarDatos() {

        setLoading(true);

        // =========================
        // CANCHA
        // =========================

        const {
            data: canchaData,
            error: canchaError
        } = await supabase
            .from("canchas")
            .select("*")
            .eq("id", id)
            .single();

        if (canchaError) {

            console.log(canchaError);
            setLoading(false);
            return;
        }

        setCancha(canchaData);

        // =========================
        // CLUB
        // =========================

        if (canchaData.club_id) {

            const {
                data: clubData,
                error: clubError
            } = await supabase
                .from("clubs")
                .select("*")
                .eq("id", canchaData.club_id)
                .single();

            if (clubError) {

                console.log(clubError);

            } else {

                setClub(clubData);
            }
        }

        // =========================
        // HORARIOS
        // =========================

        const {
            data: horariosData,
            error: horariosError
        } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id)
            .order("dia_semana", {
                ascending: true
            });

        if (horariosError) {

            console.log(horariosError);

        } else {

            setHorarios(horariosData || []);
        }

        // =========================
        // BLOQUEOS
        // =========================

        const {
            data: bloqueosData,
            error: bloqueosError
        } = await supabase
            .from("bloqueos_horarios")
            .select("*")
            .eq("cancha_id", id)
            .order("fecha", {
                ascending: false
            });

        if (bloqueosError) {

            console.log(bloqueosError);

        } else {

            setBloqueos(bloqueosData || []);
        }

        // =========================
        // RESERVAS
        // =========================

        const {
            data: reservasData,
            error: reservasError
        } = await supabase
            .from("reservas")
            .select("*")
            .eq("cancha_id", id)
            .order("fecha", {
                ascending: false
            });

        if (reservasError) {

            console.log(reservasError);

        } else {

            setReservas(reservasData || []);
        }

        setLoading(false);
    }

    // =========================
    // ELIMINAR
    // =========================

    async function eliminarCancha() {

        const confirmar = window.confirm(
            "¿Eliminar esta cancha?"
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("canchas")
            .update({
                habilitacion: "eliminado"
            })
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarDatos();
    }

    // =========================
    // RESTAURAR
    // =========================

    async function restaurarCancha() {

        const { error } = await supabase
            .from("canchas")
            .update({
                habilitacion: "disponible"
            })
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarDatos();
    }

    // =========================
    // LOADING
    // =========================

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
                Cargando cancha...
            </div>
        );
    }

    // =========================
    // NO ENCONTRADA
    // =========================

    if (!cancha) {

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
                Cancha no encontrada
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
                boxSizing: "border-box"
            }}
        >

            {/* BOTON */}

            {/* ACCIONES ADMIN */}

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
                        navigate(`/admin/cancha/${id}/editar`)
                    }
                    style={{
                        width: "100%",
                        background: "#1565c0",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Editar cancha
                </button>

                <button
                    onClick={() =>
                        navigate(`/admin/cancha/${id}/horarios`)
                    }
                    style={{
                        width: "100%",
                        background: "#5e35b1",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Gestionar horarios
                </button>

                <button
                    onClick={() =>
                        navigate(`/admin/cancha/${id}/bloqueos`)
                    }
                    style={{
                        width: "100%",
                        background: "#ef6c00",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Gestionar bloqueos
                </button>

                <button
                    onClick={() =>
                        navigate(`/admin/reservas?cancha=${id}`)
                    }
                    style={{
                        width: "100%",
                        background: "#00897b",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Ver reservas completas
                </button>

                {cancha.habilitacion === "eliminado" ? (

                    <button
                        onClick={restaurarCancha}
                        style={{
                            width: "100%",
                            background: "#2e7d32",
                            border: "none",
                            color: "white",
                            borderRadius: "12px",
                            padding: "13px",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        Restaurar cancha
                    </button>

                ) : (

                    <button
                        onClick={eliminarCancha}
                        style={{
                            width: "100%",
                            background: "#b71c1c",
                            border: "none",
                            color: "white",
                            borderRadius: "12px",
                            padding: "13px",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        Eliminar cancha
                    </button>

                )}

            </div>
            {/* HORARIOS */}

            <h2 style={{ fontSize: "18px" }}>
                Horarios
            </h2>

            {horarios.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        borderRadius: "14px",
                        padding: "14px",
                        color: "#9e9e9e",
                        marginBottom: "18px"
                    }}
                >
                    Sin horarios
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

                        <strong>
                            {h.dia_semana}
                        </strong>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#bdbdbd"
                            }}
                        >
                            {h.hora_inicio} - {h.hora_fin}
                        </p>

                    </div>

                ))
            )}

            {/* BLOQUEOS */}

            <h2
                style={{
                    fontSize: "18px",
                    marginTop: "24px"
                }}
            >
                Bloqueos
            </h2>

            {bloqueos.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        borderRadius: "14px",
                        padding: "14px",
                        color: "#9e9e9e",
                        marginBottom: "18px"
                    }}
                >
                    Sin bloqueos
                </div>

            ) : (

                bloqueos.map((b) => (

                    <div
                        key={b.id}
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "14px",
                            padding: "14px",
                            marginBottom: "10px"
                        }}
                    >

                        <strong>
                            {b.fecha}
                        </strong>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#bdbdbd"
                            }}
                        >
                            {b.hora_inicio} - {b.hora_fin}
                        </p>

                    </div>

                ))
            )}

            {/* RESERVAS */}

            <h2
                style={{
                    fontSize: "18px",
                    marginTop: "24px"
                }}
            >
                Reservas
            </h2>

            {reservas.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        borderRadius: "14px",
                        padding: "14px",
                        color: "#9e9e9e"
                    }}
                >
                    Sin reservas
                </div>

            ) : (

                reservas.map((r) => (

                    <div
                        key={r.id}
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

                                <p
                                    style={{
                                        margin: 0,
                                        fontWeight: "700",
                                        fontSize: "14px"
                                    }}
                                >
                                    {r.fecha}
                                </p>

                                <p
                                    style={{
                                        marginTop: "5px",
                                        color: "#bdbdbd",
                                        fontSize: "13px"
                                    }}
                                >
                                    {r.hora_inicio} - {r.hora_fin}
                                </p>

                            </div>

                            <span
                                style={{
                                    background:
                                        r.estado === "cancelada"
                                            ? "#4a1f1f"
                                            : "#173524",
                                    color:
                                        r.estado === "cancelada"
                                            ? "#ff8a80"
                                            : "#69f0ae",
                                    padding: "6px 10px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    textTransform: "uppercase"
                                }}
                            >
                                {r.estado}
                            </span>

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}