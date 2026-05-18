import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function cargarUsuarios() {

        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
        } else {
            setUsuarios(data || []);
        }

        setLoading(false);
    }

    async function cambiarRol(id, nuevoRol) {

        const confirmar = window.confirm(
            `¿Cambiar rol a ${nuevoRol}?`
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("profiles")
            .update({ rol: nuevoRol })
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Error al cambiar rol");
        } else {
            cargarUsuarios();
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px"
            }}>
                Cargando usuarios...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#121212",
            color: "white",
            padding: "20px",
            boxSizing: "border-box"
        }}>

            <h1 style={{ marginBottom: "25px", fontSize: "30px" }}>
                Usuarios
            </h1>

            {usuarios.length === 0 ? (
                <div style={{
                    background: "#1e1e1e",
                    padding: "20px",
                    borderRadius: "14px"
                }}>
                    No hay usuarios
                </div>
            ) : (

                usuarios.map((u) => (

                    <div
                        key={u.id}
                        onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                        style={{
                            background: "#1e1e1e",
                            border: "1px solid #333",
                            borderRadius: "16px",
                            padding: "18px",
                            marginBottom: "18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                            cursor: "pointer"
                        }}
                    >

                        {/* INFO PRINCIPAL */}
                        <div>
                            <p style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "bold"
                            }}>
                                {u.nombre || "Sin nombre"}
                            </p>

                            <p style={{
                                margin: "8px 0 0 0",
                                color: "#bdbdbd",
                                wordBreak: "break-word"
                            }}>
                                {u.email}
                            </p>
                        </div>

                        {/* ROL + BOTONES */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "12px"
                        }}>

                            <span style={{
                                background:
                                    u.rol === "admin"
                                        ? "#8e24aa"
                                        : u.rol === "dueno"
                                            ? "#1565c0"
                                            : "#2e7d32",
                                padding: "8px 14px",
                                borderRadius: "999px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                textTransform: "uppercase"
                            }}>
                                {u.rol}
                            </span>

                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        cambiarRol(u.id, "cliente")
                                    }}
                                    style={{
                                        padding: "10px 14px",
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        background: "#2e7d32",
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Cliente
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        cambiarRol(u.id, "dueno")
                                    }}
                                    style={{
                                        padding: "10px 14px",
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        background: "#1565c0",
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Dueño
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        cambiarRol(u.id, "admin")
                                    }}
                                    style={{
                                        padding: "10px 14px",
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        background: "#8e24aa",
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Admin
                                </button>

                            </div>

                        </div>

                    </div>
                ))
            )}

        </div>
    );
}