import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function ReservasDueno() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtroEstado, setFiltroEstado] =
        useState("todas");

    // =========================
    // CARGAR RESERVAS
    // =========================
    useEffect(() => {

        async function cargarReservas() {

            setLoading(true);

            // cancha
            const { data: canchaData } =
                await supabase
                    .from("canchas")
                    .select("precio_por_hora")
                    .eq("id", id)
                    .single();

            const precioCancha =
                canchaData?.precio_por_hora || 0;

            // reservas
            const { data, error } =
                await supabase
                    .from("reservas")
                    .select("*")
                    .eq("cancha_id", id)
                    .order("fecha", { ascending: true });

            if (error) {
                console.log(error);
                setLoading(false);
                return;
            }

            // traer usuarios
            const reservasConUsuarios =
                await Promise.all(

                    (data || []).map(async (reserva) => {

                        let nombreUsuario =
                            "Usuario";

                        // buscar perfil
                        const { data: perfil } =
                            await supabase
                                .from("profiles")
                                .select("nombre")
                                .eq(
                                    "id",
                                    reserva.usuario_id
                                )
                                .single();

                        if (perfil?.nombre) {
                            nombreUsuario =
                                perfil.nombre;
                        }

                        // =========================
                        // CALCULAR HORAS
                        // =========================

                        const inicio =
                            reserva.hora_inicio?.slice(0, 5);

                        const fin =
                            reserva.hora_fin?.slice(0, 5);

                        let cantidadHoras = 1;

                        if (inicio && fin) {

                            const [h1] =
                                inicio.split(":").map(Number);

                            const [h2] =
                                fin.split(":").map(Number);

                            cantidadHoras =
                                Math.max(h2 - h1, 1);
                        }

                        // =========================
                        // TOTAL ESTIMADO
                        // =========================
                        const totalEstimado =
                            cantidadHoras *
                            Number(precioCancha);

                        return {
                            ...reserva,
                            nombreUsuario,
                            cantidadHoras,
                            totalEstimado
                        };
                    })
                );

            setReservas(
                reservasConUsuarios || []
            );

            setLoading(false);
        }

        if (id) {
            cargarReservas();
        }

    }, [id]);

    // =========================
    // CANCELAR RESERVA
    // =========================
    async function cancelarReserva(reservaId) {

        const confirmar = window.confirm("¿Cancelar esta reserva?");
        if (!confirmar) return;

        const { error } = await supabase
            .from("reservas")
            .update({ estado: "cancelada" })
            .eq("id", reservaId);

        if (error) {
            alert("Error: " + error.message);
            return;
        }

        // 🔥 SOLO ACTUALIZAMOS ESTADO LOCAL (NO RECARGAMOS TODO)
        setReservas(prev =>
            prev.map(r =>
                r.id === reservaId
                    ? {
                        ...r,
                        estado: "cancelada"
                    }
                    : r
            )
        );

        alert("Reserva cancelada");
    }

    // =========================
    // FILTROS
    // =========================
    const reservasFiltradas =
        reservas.filter((r) => {

            if (filtroEstado === "todas") {
                return true;
            }

            if (filtroEstado === "activas") {
                return r.estado !== "cancelada";
            }

            if (filtroEstado === "canceladas") {
                return r.estado === "cancelada";
            }

            return true;
        });

    // =========================
    // ESTADÍSTICAS
    // =========================
    const reservasActivas =
        reservas.filter(
            r => r.estado !== "cancelada"
        ).length;

    const reservasCanceladas =
        reservas.filter(
            r => r.estado === "cancelada"
        ).length;

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                padding: "18px",
                boxSizing: "border-box"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    margin: "0 auto"
                }}
            >

                {/* VOLVER */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: "20px",
                        padding: "10px 14px",
                        border: "none",
                        background: "#1f1f1f",
                        color: "white",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    ← Volver
                </button>

                {/* TITULO */}
                <h1
                    style={{
                        marginBottom: "20px",
                        fontSize: "28px"
                    }}
                >
                    Reservas
                </h1>

                {/* ESTADÍSTICAS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "12px",
                        marginBottom: "20px"
                    }}
                >

                    <div
                        style={{
                            background: "#1b1b1b",
                            borderRadius: "14px",
                            padding: "16px",
                            border: "1px solid #2c2c2c"
                        }}
                    >

                        <p
                            style={{
                                color: "#bdbdbd",
                                marginBottom: "8px"
                            }}
                        >
                            Total
                        </p>

                        <h2>
                            {reservas.length}
                        </h2>

                    </div>

                    <div
                        style={{
                            background: "#1b1b1b",
                            borderRadius: "14px",
                            padding: "16px",
                            border: "1px solid #2c2c2c"
                        }}
                    >

                        <p
                            style={{
                                color: "#bdbdbd",
                                marginBottom: "8px"
                            }}
                        >
                            Activas
                        </p>

                        <h2
                            style={{
                                color: "#35c759"
                            }}
                        >
                            {reservasActivas}
                        </h2>

                    </div>

                    <div
                        style={{
                            background: "#1b1b1b",
                            borderRadius: "14px",
                            padding: "16px",
                            border: "1px solid #2c2c2c"
                        }}
                    >

                        <p
                            style={{
                                color: "#bdbdbd",
                                marginBottom: "8px"
                            }}
                        >
                            Canceladas
                        </p>

                        <h2
                            style={{
                                color: "#ff5c5c"
                            }}
                        >
                            {reservasCanceladas}
                        </h2>

                    </div>

                </div>

                {/* FILTROS */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "24px",
                        flexWrap: "wrap"
                    }}
                >

                    <button
                        onClick={() =>
                            setFiltroEstado("todas")
                        }
                        style={{
                            padding: "10px 14px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background:
                                filtroEstado === "todas"
                                    ? "#007bff"
                                    : "#1f1f1f",
                            color: "white",
                            fontWeight: "bold"
                        }}
                    >
                        Todas
                    </button>

                    <button
                        onClick={() =>
                            setFiltroEstado("activas")
                        }
                        style={{
                            padding: "10px 14px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background:
                                filtroEstado === "activas"
                                    ? "#35c759"
                                    : "#1f1f1f",
                            color: "white",
                            fontWeight: "bold"
                        }}
                    >
                        Activas
                    </button>

                    <button
                        onClick={() =>
                            setFiltroEstado("canceladas")
                        }
                        style={{
                            padding: "10px 14px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background:
                                filtroEstado === "canceladas"
                                    ? "#dc3545"
                                    : "#1f1f1f",
                            color: "white",
                            fontWeight: "bold"
                        }}
                    >
                        Canceladas
                    </button>

                </div>

                {/* LOADING */}
                {loading ? (

                    <p>
                        Cargando reservas...
                    </p>

                ) : reservasFiltradas.length === 0 ? (

                    <div
                        style={{
                            background: "#1b1b1b",
                            borderRadius: "14px",
                            padding: "40px",
                            textAlign: "center",
                            border: "1px solid #2c2c2c"
                        }}
                    >

                        <h3
                            style={{
                                marginBottom: "10px"
                            }}
                        >
                            No hay reservas
                        </h3>

                        <p
                            style={{
                                color: "#bdbdbd"
                            }}
                        >
                            No existen reservas para este filtro
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gap: "16px"
                        }}
                    >

                        {reservasFiltradas.map((reserva) => (

                            <div
                                key={reserva.id}
                                style={{
                                    background: "#1b1b1b",
                                    borderRadius: "14px",
                                    padding: "16px",
                                    border: "1px solid #2c2c2c"
                                }}
                            >

                                {/* FECHA */}
                                <p
                                    style={{
                                        marginBottom: "10px",
                                        fontSize: "16px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    📅 {reserva.fecha}
                                </p>

                                {/* HORARIO */}
                                <p
                                    style={{
                                        marginBottom: "10px",
                                        color: "#d1d1d1"
                                    }}
                                >
                                    🕒
                                    {" "}
                                    {reserva.hora_inicio}
                                    {" - "}
                                    {reserva.hora_fin}
                                </p>

                                {/* HORAS */}
                                <p
                                    style={{
                                        marginBottom: "10px",
                                        color: "#ffd166",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ⏱️
                                    {" "}
                                    {reserva.cantidadHoras}
                                    {" "}
                                    hora(s)
                                </p>

                                {/* TOTAL */}
                                <p
                                    style={{
                                        marginBottom: "10px",
                                        color: "#35c759",
                                        fontWeight: "bold"
                                    }}
                                >
                                    💰 Total estimado:
                                    {" "}
                                    ${reserva.totalEstimado}
                                </p>

                                {/* CLIENTE */}
                                <p
                                    style={{
                                        marginBottom: "10px",
                                        color: "#9ecfff"
                                    }}
                                >
                                    👤
                                    {" "}
                                    {reserva.nombreUsuario}
                                </p>

                                {/* ESTADO */}
                                <p
                                    style={{
                                        marginBottom: "16px",
                                        color:
                                            reserva.estado === "cancelada"
                                                ? "#ff5c5c"
                                                : "#35c759",

                                        fontWeight: "bold"
                                    }}
                                >
                                    Estado:
                                    {" "}
                                    {
                                        reserva.estado
                                        || "activa"
                                    }
                                </p>

                                {/* CANCELAR */}
                                {reserva.estado !== "cancelada" && (

                                    <button
                                        onClick={() =>
                                            cancelarReserva(
                                                reserva.id
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "none",
                                            background: "#dc3545",
                                            color: "white",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Cancelar reserva
                                    </button>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}