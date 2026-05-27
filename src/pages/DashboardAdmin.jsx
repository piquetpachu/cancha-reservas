import { useNavigate } from "react-router-dom";
export default function DashboardAdmin() {

    const navigate = useNavigate();

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            <h1
                style={{
                    marginBottom: "30px"
                }}
            >
                Panel Administrador
            </h1>

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                    maxWidth: "700px"
                }}
            >

                {/* SOLICITUDES */}
                <div
                    style={{
                        background: "#1e1e1e",
                        padding: "20px",
                        borderRadius: "14px",
                        border: "1px solid #333"
                    }}
                >

                    <h2>
                        Solicitudes de Dueño
                    </h2>

                    <p>
                        Aprobar o rechazar solicitudes.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/solicitudes")
                        }
                        style={{
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Entrar
                    </button>

                </div>

                {/* CLUBES */}
                <div
                    style={{
                        background: "#1e1e1e",
                        padding: "20px",
                        borderRadius: "14px",
                        border: "1px solid #333"
                    }}
                >

                    <h2>
                        Gestión de Clubes
                    </h2>

                    <p>
                        Ver, bloquear o restaurar clubes.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/clubes")
                        }
                        style={{
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Entrar
                    </button>

                </div>

                {/* USUARIOS */}
                <div
                    style={{
                        background: "#1e1e1e",
                        padding: "20px",
                        borderRadius: "14px",
                        border: "1px solid #333"
                    }}
                >

                    <h2>
                        Usuarios
                    </h2>

                    <p>
                        Administrar clientes y dueños.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/usuarios")
                        }
                        style={{
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Entrar
                    </button>

                </div>

                {/* RESERVAS */}
                <div
                    style={{
                        background: "#1e1e1e",
                        padding: "20px",
                        borderRadius: "14px",
                        border: "1px solid #333"
                    }}
                >

                    <h2>
                        Reservas Globales
                    </h2>

                    <p>
                        Ver todas las reservas del sistema.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/reservas")
                        }
                        style={{
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Entrar
                    </button>
                    {/* ESTADISTICAS */}
                    <div
                        style={{
                            background: "#1e1e1e",
                            padding: "20px",
                            borderRadius: "14px",
                            border: "1px solid #333"
                        }}
                    >

                        <h2>
                            Estadísticas
                        </h2>

                        <p>
                            Métricas y análisis del sistema.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/estadisticas")
                            }
                            style={{
                                padding: "10px 16px",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Entrar
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}