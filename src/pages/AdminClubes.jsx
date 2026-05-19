import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminClubes() {

    const navigate = useNavigate();

    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");

    useEffect(() => {

        cargarClubes();

    }, []);

    async function cargarClubes() {

        setLoading(true);

        const { data, error } = await supabase
            .from("clubs")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {

            console.log(error);
            setLoading(false);
            return;
        }

        setClubs(data || []);
        setLoading(false);
    }

    // =========================
    // ELIMINAR
    // =========================

    async function eliminarClub(id) {

        const confirmar = window.confirm(
            "¿Eliminar este club?"
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("clubs")
            .update({
                habilitacion: "eliminado"
            })
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarClubes();
    }

    // =========================
    // RESTAURAR
    // =========================

    async function restaurarClub(id) {

        const { error } = await supabase
            .from("clubs")
            .update({
                habilitacion: "disponible"
            })
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarClubes();
    }

    // =========================
    // FILTROS
    // =========================

    const clubsFiltrados = clubs.filter((club) => {

        const coincideBusqueda =
            club.nombre
                ?.toLowerCase()
                .includes(busqueda.toLowerCase());

        const coincideEstado =
            filtroEstado === "todos"
                ? true
                : club.habilitacion === filtroEstado;

        return coincideBusqueda && coincideEstado;
    });

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
                Cargando clubes...
            </div>
        );
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                padding: "12px",
                boxSizing: "border-box"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "14px"
                }}
            >

                <button
                    onClick={() =>
                        navigate("/admin")
                    }
                    style={{
                        width: "fit-content",
                        background: "#1f1f1f",
                        border: "1px solid #2e2e2e",
                        color: "white",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        fontSize: "13px",
                        cursor: "pointer"
                    }}
                >
                    ← Volver
                </button>

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            fontWeight: "700"
                        }}
                    >
                        Clubes
                    </h1>

                    <p
                        style={{
                            marginTop: "3px",
                            color: "#9e9e9e",
                            fontSize: "13px"
                        }}
                    >
                        Panel administrativo
                    </p>

                </div>

            </div>

            {/* FILTROS */}

            <div
                style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "14px",
                    padding: "10px",
                    marginBottom: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}
            >

                <input
                    type="text"
                    placeholder="Buscar club..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    style={{
                        width: "100%",
                        background: "#262626",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: "10px",
                        padding: "10px",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <select
                    value={filtroEstado}
                    onChange={(e) =>
                        setFiltroEstado(e.target.value)
                    }
                    style={{
                        width: "100%",
                        background: "#262626",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: "10px",
                        padding: "10px",
                        fontSize: "13px",
                        outline: "none"
                    }}
                >

                    <option value="todos">
                        Todos
                    </option>

                    <option value="disponible">
                        Disponibles
                    </option>

                    <option value="eliminado">
                        Eliminados
                    </option>

                </select>

            </div>

            {/* CONTADOR */}

            <p
                style={{
                    color: "#8e8e8e",
                    fontSize: "12px",
                    marginBottom: "10px"
                }}
            >
                {clubsFiltrados.length} clubes
            </p>

            {/* LISTA */}

            {clubsFiltrados.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "14px",
                        padding: "18px",
                        textAlign: "center",
                        color: "#9e9e9e",
                        fontSize: "13px"
                    }}
                >
                    No hay clubes
                </div>

            ) : (

                clubsFiltrados.map(club => (

                    <div
                        key={club.id}
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "12px"
                        }}
                    >

                        {/* FOTO */}

                        <div
                            style={{
                                width: "100%",
                                height: "120px",
                                background: "#222"
                            }}
                        >

                            {club.foto ? (

                                <img
                                    src={club.foto}
                                    alt={club.nombre}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#666",
                                        fontSize: "12px"
                                    }}
                                >
                                    Sin imagen
                                </div>

                            )}

                        </div>

                        {/* CONTENIDO */}

                        <div
                            style={{
                                padding: "12px"
                            }}
                        >

                            {/* NOMBRE + ESTADO */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "8px"
                                }}
                            >

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {club.nombre}
                                </h2>

                                <span
                                    style={{
                                        background:
                                            club.habilitacion === "eliminado"
                                                ? "#4a1f1f"
                                                : "#173524",
                                        color:
                                            club.habilitacion === "eliminado"
                                                ? "#ff8a80"
                                                : "#69f0ae",
                                        padding: "4px 8px",
                                        borderRadius: "999px",
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        textTransform: "uppercase",
                                        flexShrink: 0
                                    }}
                                >
                                    {club.habilitacion}
                                </span>

                            </div>

                            {/* DIRECCION */}

                            <p
                                style={{
                                    margin: 0,
                                    color: "#bdbdbd",
                                    fontSize: "12px",
                                    lineHeight: "1.4",
                                    marginBottom: "12px"
                                }}
                            >
                                {club.direccion || "Sin dirección"}
                            </p>

                            {/* BOTONES */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        navigate(`/admin/club/${club.id}`)
                                    }
                                    style={{
                                        flex: 1,
                                        background: "#1565c0",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Ver detalle
                                </button>

                                {club.habilitacion === "disponible" ? (

                                    <button
                                        onClick={() =>
                                            eliminarClub(club.id)
                                        }
                                        style={{
                                            flex: 1,
                                            background: "#b71c1c",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "10px",
                                            padding: "10px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Eliminar
                                    </button>

                                ) : (

                                    <button
                                        onClick={() =>
                                            restaurarClub(club.id)
                                        }
                                        style={{
                                            flex: 1,
                                            background: "#2e7d32",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "10px",
                                            padding: "10px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Restaurar
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>
                ))
            )}

        </div>
    );
}