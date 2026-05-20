import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminReservas() {

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // FILTROS
    // =========================

    const [busqueda, setBusqueda] = useState("");

    const [filtroEstado, setFiltroEstado] = useState("todos");

    const [filtroFecha, setFiltroFecha] = useState("");

    const [filtroCancha, setFiltroCancha] = useState("");

    // =========================
    // CARGAR
    // =========================

    useEffect(() => {

        cargarReservas();

    }, []);

    async function cargarReservas() {

        setLoading(true);

        const {
            data,
            error
        } = await supabase
            .from("reservas")
            .select(`
                *,
                canchas (
                    id,
                    nombre,
                    deporte
                )
            `)
            .order("fecha", {
                ascending: false
            });

        if (error) {

            console.log(error);

        } else {

            setReservas(data || []);
        }

        setLoading(false);
    }

    // =========================
    // CANCELAR
    // =========================

    async function cancelarReserva(id) {

        const confirmar = window.confirm(
            "¿Cancelar esta reserva?"
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("reservas")
            .update({
                estado: "cancelada"
            })
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarReservas();
    }

    // =========================
    // RESTAURAR
    // =========================

    async function restaurarReserva(id) {

        const confirmar = window.confirm(
            "¿Restaurar esta reserva?"
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("reservas")
            .update({
                estado: "activa"
            })
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarReservas();
    }

    // =========================
    // FILTRADAS
    // =========================

    const reservasFiltradas = useMemo(() => {

        return reservas.filter((r) => {

            const texto = busqueda.toLowerCase();

            const coincideBusqueda =
                r.canchas?.nombre
                    ?.toLowerCase()
                    .includes(texto) ||
                r.fecha
                    ?.toLowerCase()
                    .includes(texto);

            const coincideEstado =
                filtroEstado === "todos"
                    ? true
                    : r.estado === filtroEstado;

            const coincideFecha =
                filtroFecha === ""
                    ? true
                    : r.fecha === filtroFecha;

            const coincideCancha =
                filtroCancha === ""
                    ? true
                    : r.canchas?.nombre === filtroCancha;

            return (
                coincideBusqueda &&
                coincideEstado &&
                coincideFecha &&
                coincideCancha
            );
        });

    }, [
        reservas,
        busqueda,
        filtroEstado,
        filtroFecha,
        filtroCancha
    ]);

    // =========================
    // LISTA CANCHAS
    // =========================

    const canchasUnicas = [
        ...new Set(
            reservas
                .map((r) => r.canchas?.nombre)
                .filter(Boolean)
        )
    ];

    // =========================
    // STATS
    // =========================

    const totalReservas = reservas.length;

    const activas = reservas.filter(
        (r) => r.estado !== "cancelada"
    ).length;

    const canceladas = reservas.filter(
        (r) => r.estado === "cancelada"
    ).length;

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
                    color: "white",
                    fontSize: "15px"
                }}
            >
                Cargando reservas...
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

            {/* HEADER */}

            <div
                style={{
                    marginBottom: "20px"
                }}
            >

                <h1
                    style={{
                        marginTop: 0,
                        marginBottom: "5px",
                        fontSize: "28px"
                    }}
                >
                    Reservas
                </h1>

                <p
                    style={{
                        color: "#9e9e9e",
                        margin: 0,
                        fontSize: "14px"
                    }}
                >
                    Panel administrativo global
                </p>

            </div>

            {/* STATS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                    marginBottom: "18px"
                }}
            >

                <div
                    style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "16px",
                        padding: "14px",
                        textAlign: "center"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "22px"
                        }}
                    >
                        {totalReservas}
                    </h2>

                    <p
                        style={{
                            marginTop: "6px",
                            marginBottom: 0,
                            color: "#9e9e9e",
                            fontSize: "11px"
                        }}
                    >
                        TOTAL
                    </p>

                </div>

                <div
                    style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "16px",
                        padding: "14px",
                        textAlign: "center"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            color: "#69f0ae"
                        }}
                    >
                        {activas}
                    </h2>

                    <p
                        style={{
                            marginTop: "6px",
                            marginBottom: 0,
                            color: "#9e9e9e",
                            fontSize: "11px"
                        }}
                    >
                        ACTIVAS
                    </p>

                </div>

                <div
                    style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "16px",
                        padding: "14px",
                        textAlign: "center"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            color: "#ff8a80"
                        }}
                    >
                        {canceladas}
                    </h2>

                    <p
                        style={{
                            marginTop: "6px",
                            marginBottom: 0,
                            color: "#9e9e9e",
                            fontSize: "11px"
                        }}
                    >
                        CANCELADAS
                    </p>

                </div>

            </div>

            {/* FILTROS */}

            <div
                style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "18px",
                    padding: "14px",
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}
            >

                {/* BUSCADOR */}

                <input
                    type="text"
                    placeholder="Buscar por cancha o fecha..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    style={{
                        width: "100%",
                        background: "#202020",
                        border: "1px solid #303030",
                        borderRadius: "12px",
                        padding: "12px",
                        color: "white",
                        outline: "none",
                        fontSize: "14px",
                        boxSizing: "border-box"
                    }}
                />

                {/* FILTROS */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px"
                    }}
                >

                    <select
                        value={filtroEstado}
                        onChange={(e) =>
                            setFiltroEstado(e.target.value)
                        }
                        style={{
                            background: "#202020",
                            border: "1px solid #303030",
                            borderRadius: "12px",
                            padding: "12px",
                            color: "white",
                            fontSize: "13px"
                        }}
                    >

                        <option value="todos">
                            Todos los estados
                        </option>

                        <option value="activa">
                            Activas
                        </option>

                        <option value="cancelada">
                            Canceladas
                        </option>

                    </select>

                    <input
                        type="date"
                        value={filtroFecha}
                        onChange={(e) =>
                            setFiltroFecha(e.target.value)
                        }
                        style={{
                            background: "#202020",
                            border: "1px solid #303030",
                            borderRadius: "12px",
                            padding: "12px",
                            color: "white",
                            fontSize: "13px"
                        }}
                    />

                </div>

                <select
                    value={filtroCancha}
                    onChange={(e) =>
                        setFiltroCancha(e.target.value)
                    }
                    style={{
                        background: "#202020",
                        border: "1px solid #303030",
                        borderRadius: "12px",
                        padding: "12px",
                        color: "white",
                        fontSize: "13px"
                    }}
                >

                    <option value="">
                        Todas las canchas
                    </option>

                    {canchasUnicas.map((nombre) => (

                        <option
                            key={nombre}
                            value={nombre}
                        >
                            {nombre}
                        </option>

                    ))}

                </select>

            </div>

            {/* RESULTADOS */}

            <div
                style={{
                    marginBottom: "14px"
                }}
            >

                <p
                    style={{
                        margin: 0,
                        color: "#9e9e9e",
                        fontSize: "13px"
                    }}
                >
                    {reservasFiltradas.length} reservas encontradas
                </p>

            </div>

            {/* LISTA */}

            {reservasFiltradas.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        borderRadius: "16px",
                        padding: "20px",
                        color: "#9e9e9e",
                        textAlign: "center"
                    }}
                >
                    No se encontraron reservas
                </div>

            ) : (

                reservasFiltradas.map((r) => (

                    <div
                        key={r.id}
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "18px",
                            padding: "16px",
                            marginBottom: "14px"
                        }}
                    >

                        {/* HEADER */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "12px",
                                marginBottom: "14px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "17px"
                                    }}
                                >
                                    {r.canchas?.nombre || "Cancha"}
                                </h3>

                                <p
                                    style={{
                                        marginTop: "6px",
                                        marginBottom: 0,
                                        color: "#9e9e9e",
                                        fontSize: "12px"
                                    }}
                                >
                                    {r.canchas?.deporte || "Sin deporte"}
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
                                    padding: "7px 12px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    flexShrink: 0
                                }}
                            >
                                {r.estado}
                            </span>

                        </div>

                        {/* INFO */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "10px",
                                marginBottom: "16px"
                            }}
                        >

                            <div
                                style={{
                                    background: "#202020",
                                    borderRadius: "12px",
                                    padding: "12px"
                                }}
                            >

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#9e9e9e",
                                        fontSize: "11px"
                                    }}
                                >
                                    FECHA
                                </p>

                                <h4
                                    style={{
                                        marginTop: "6px",
                                        marginBottom: 0,
                                        fontSize: "14px"
                                    }}
                                >
                                    {r.fecha}
                                </h4>

                            </div>

                            <div
                                style={{
                                    background: "#202020",
                                    borderRadius: "12px",
                                    padding: "12px"
                                }}
                            >

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#9e9e9e",
                                        fontSize: "11px"
                                    }}
                                >
                                    HORARIO
                                </p>

                                <h4
                                    style={{
                                        marginTop: "6px",
                                        marginBottom: 0,
                                        fontSize: "14px"
                                    }}
                                >
                                    {r.hora_inicio} - {r.hora_fin}
                                </h4>

                            </div>

                        </div>

                        {/* ID */}

                        <div
                            style={{
                                marginBottom: "16px"
                            }}
                        >

                            <p
                                style={{
                                    margin: 0,
                                    color: "#8e8e8e",
                                    fontSize: "11px"
                                }}
                            >
                                ID RESERVA
                            </p>

                            <p
                                style={{
                                    marginTop: "5px",
                                    marginBottom: 0,
                                    color: "#d0d0d0",
                                    fontSize: "12px",
                                    wordBreak: "break-word"
                                }}
                            >
                                {r.id}
                            </p>

                        </div>

                        {/* ACCIONES */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            {r.estado !== "cancelada" ? (

                                <button
                                    onClick={() =>
                                        cancelarReserva(r.id)
                                    }
                                    style={{
                                        flex: 1,
                                        background: "#b71c1c",
                                        border: "none",
                                        color: "white",
                                        borderRadius: "12px",
                                        padding: "12px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        fontSize: "13px"
                                    }}
                                >
                                    Cancelar reserva
                                </button>

                            ) : (

                                <button
                                    onClick={() =>
                                        restaurarReserva(r.id)
                                    }
                                    style={{
                                        flex: 1,
                                        background: "#2e7d32",
                                        border: "none",
                                        color: "white",
                                        borderRadius: "12px",
                                        padding: "12px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        fontSize: "13px"
                                    }}
                                >
                                    Restaurar reserva
                                </button>

                            )}

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}