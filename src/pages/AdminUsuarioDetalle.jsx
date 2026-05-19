import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminUsuarioDetalle() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔎 filtros reservas
    const [busquedaReserva, setBusquedaReserva] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todas");

    useEffect(() => {
        cargarDatos();
    }, [id]);

    async function cargarDatos() {

        setLoading(true);

        // 👤 USUARIO
        const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single();

        if (userError) {

            console.log("ERROR USUARIO:", userError);

            setLoading(false);
            return;
        }

        setUsuario(userData);

        // 🏟️ CLUBES DEL USUARIO
        const { data: clubsData, error: clubsError } = await supabase
            .from("clubs")
            .select("*")
            .eq("owner_id", id);

        if (clubsError) {
            console.log("ERROR CLUBS:", clubsError);
        }

        setClubs(clubsData || []);

        // 📅 RESERVAS DEL USUARIO
        const {
            data: reservasData,
            error: reservasError
        } = await supabase
            .from("reservas")
            .select(`
                *,
                canchas (
                    nombre
                )
            `)
            .eq("usuario_id", userData.id)
            .order("created_at", { ascending: false });

        console.log("ID USUARIO:", userData.id);
        console.log("RESERVAS:", reservasData);

        if (reservasError) {
            console.log("ERROR RESERVAS:", reservasError);
        }

        setReservas(reservasData || []);

        setLoading(false);
    }

    // 🔎 FILTRADO RESERVAS
    const reservasFiltradas = useMemo(() => {

        return reservas.filter((r) => {

            const nombreCancha =
                r.canchas?.nombre?.toLowerCase() || "";

            const coincideBusqueda =
                nombreCancha.includes(
                    busquedaReserva.toLowerCase()
                );

            const coincideEstado =
                filtroEstado === "todas"
                    ? true
                    : r.estado === filtroEstado;

            return coincideBusqueda && coincideEstado;
        });

    }, [reservas, busquedaReserva, filtroEstado]);

    if (loading || !usuario) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#121212",
                    color: "white",
                    fontSize: "20px"
                }}
            >
                Cargando...
            </div>
        );
    }

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

            {/* 🔙 BOTON */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "20px",
                    fontWeight: "bold"
                }}
            >
                ← Volver
            </button>

            {/* 🧑 HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "18px",
                    flexWrap: "wrap"
                }}
            >

                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "28px"
                        }}
                    >
                        Detalle de Usuario
                    </h1>

                    <p
                        style={{
                            marginTop: "6px",
                            color: "#9e9e9e",
                            fontSize: "14px"
                        }}
                    >
                        Información completa del usuario
                    </p>
                </div>

                <div
                    style={{
                        background:
                            usuario.rol === "admin"
                                ? "#8e24aa"
                                : usuario.rol === "dueno"
                                    ? "#1565c0"
                                    : "#2e7d32",
                        padding: "10px 18px",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        fontSize: "13px",
                        whiteSpace: "nowrap"
                    }}
                >
                    {usuario.rol}
                </div>

            </div>

            {/* 👤 TARJETA COMPACTA */}
            <div
                style={{
                    background: "#1e1e1e",
                    border: "1px solid #333",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "28px"
                }}
            >

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "16px"
                    }}
                >

                    {/* NOMBRE */}
                    <div
                        style={{
                            background: "#252525",
                            borderRadius: "12px",
                            padding: "14px"
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#9e9e9e",
                                fontSize: "12px",
                                marginBottom: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            Nombre
                        </p>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "bold"
                            }}
                        >
                            {usuario.nombre || "Sin nombre"}
                        </p>
                    </div>

                    {/* EMAIL */}
                    <div
                        style={{
                            background: "#252525",
                            borderRadius: "12px",
                            padding: "14px"
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#9e9e9e",
                                fontSize: "12px",
                                marginBottom: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            Email
                        </p>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "15px",
                                wordBreak: "break-word"
                            }}
                        >
                            {usuario.email || "Sin email"}
                        </p>
                    </div>

                    {/* TELEFONO */}
                    <div
                        style={{
                            background: "#252525",
                            borderRadius: "12px",
                            padding: "14px"
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#9e9e9e",
                                fontSize: "12px",
                                marginBottom: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            Teléfono
                        </p>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "16px"
                            }}
                        >
                            {usuario.telefono || "Sin teléfono"}
                        </p>
                    </div>

                    {/* ID */}
                    <div
                        style={{
                            background: "#252525",
                            borderRadius: "12px",
                            padding: "14px"
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#9e9e9e",
                                fontSize: "12px",
                                marginBottom: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            ID
                        </p>

                        <p
                            style={{
                                margin: 0,
                                fontSize: "12px",
                                wordBreak: "break-word",
                                color: "#d6d6d6"
                            }}
                        >
                            {usuario.id}
                        </p>
                    </div>

                </div>

            </div>

            {/* 🏟️ CLUBES */}
            <div
                style={{
                    marginBottom: "35px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >
                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Clubes creados
                    </h2>

                    <div
                        style={{
                            background: "#252525",
                            padding: "8px 14px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            color: "#cfcfcf"
                        }}
                    >
                        Total: {clubs.length}
                    </div>
                </div>

                {clubs.length === 0 ? (

                    <div
                        style={{
                            background: "#1e1e1e",
                            padding: "18px",
                            borderRadius: "14px",
                            border: "1px solid #333"
                        }}
                    >
                        Este usuario no tiene clubes
                    </div>

                ) : (

                    clubs.map((club) => (

                        <div
                            key={club.id}
                            style={{
                                background: "#1e1e1e",
                                padding: "18px",
                                borderRadius: "14px",
                                marginBottom: "12px",
                                border: "1px solid #333"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div>
                                    <h3
                                        style={{
                                            marginTop: 0,
                                            marginBottom: "8px"
                                        }}
                                    >
                                        {club.nombre}
                                    </h3>

                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#bdbdbd"
                                        }}
                                    >
                                        {club.direccion}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        background:
                                            club.habilitacion === "eliminado"
                                                ? "rgba(244,67,54,0.15)"
                                                : "rgba(76,175,80,0.15)",
                                        color:
                                            club.habilitacion === "eliminado"
                                                ? "#ff5252"
                                                : "#69f0ae",
                                        padding: "8px 14px",
                                        borderRadius: "999px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        fontSize: "12px"
                                    }}
                                >
                                    {club.habilitacion}
                                </div>

                            </div>

                        </div>
                    ))
                )}

            </div>

            {/* 📅 RESERVAS */}
            <div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginBottom: "18px"
                    }}
                >

                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Reservas realizadas
                    </h2>

                    <div
                        style={{
                            background: "#252525",
                            padding: "8px 14px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            color: "#cfcfcf"
                        }}
                    >
                        Total: {reservasFiltradas.length}
                    </div>

                </div>

                {/* 🔎 FILTROS */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "18px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Buscar cancha..."
                        value={busquedaReserva}
                        onChange={(e) =>
                            setBusquedaReserva(e.target.value)
                        }
                        style={{
                            flex: 1,
                            minWidth: "220px",
                            background: "#1e1e1e",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            padding: "12px",
                            color: "white",
                            outline: "none"
                        }}
                    />

                    <select
                        value={filtroEstado}
                        onChange={(e) =>
                            setFiltroEstado(e.target.value)
                        }
                        style={{
                            background: "#1e1e1e",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            padding: "12px",
                            color: "white",
                            minWidth: "170px",
                            outline: "none"
                        }}
                    >
                        <option value="todas">
                            Todas
                        </option>

                        <option value="confirmada">
                            Confirmadas
                        </option>

                        <option value="cancelada">
                            Canceladas
                        </option>

                        <option value="pendiente">
                            Pendientes
                        </option>
                    </select>

                </div>

                {reservasFiltradas.length === 0 ? (

                    <div
                        style={{
                            background: "#1e1e1e",
                            padding: "18px",
                            borderRadius: "14px",
                            border: "1px solid #333"
                        }}
                    >
                        No se encontraron reservas
                    </div>

                ) : (

                    reservasFiltradas.map((r) => (

                        <div
                            key={r.id}
                            style={{
                                background: "#1e1e1e",
                                padding: "18px",
                                borderRadius: "14px",
                                marginBottom: "12px",
                                border: "1px solid #333"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "15px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div>

                                    <h3
                                        style={{
                                            marginTop: 0,
                                            marginBottom: "10px",
                                            fontSize: "18px"
                                        }}
                                    >
                                        {r.canchas?.nombre || r.cancha_id}
                                    </h3>

                                    <p
                                        style={{
                                            margin: "0 0 8px 0",
                                            color: "#cfcfcf"
                                        }}
                                    >
                                        📅 {r.fecha}
                                    </p>

                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#cfcfcf"
                                        }}
                                    >
                                        🕒 {r.hora_inicio} - {r.hora_fin}
                                    </p>

                                </div>

                                <div
                                    style={{
                                        background:
                                            r.estado === "confirmada"
                                                ? "rgba(76,175,80,0.15)"
                                                : r.estado === "cancelada"
                                                    ? "rgba(244,67,54,0.15)"
                                                    : "rgba(255,193,7,0.15)",
                                        color:
                                            r.estado === "confirmada"
                                                ? "#69f0ae"
                                                : r.estado === "cancelada"
                                                    ? "#ff5252"
                                                    : "#ffd54f",
                                        padding: "8px 14px",
                                        borderRadius: "999px",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {r.estado}
                                </div>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}