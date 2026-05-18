import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminUsuarioDetalle() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarUsuario();
    }, [id]);

    async function cargarUsuario() {

        setLoading(true);

        // ✔ SOLO profiles (NO auth.admin)
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.log(error);
            setLoading(false);
            return;
        }

        setUsuario(data);
        setLoading(false);
    }

    if (loading || !usuario) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#121212",
                color: "white"
            }}>
                Cargando...
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

            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "20px"
                }}
            >
                ← Volver
            </button>

            <h1 style={{ marginBottom: "20px" }}>
                Detalle de Usuario
            </h1>

            <div style={{
                background: "#1e1e1e",
                border: "1px solid #333",
                borderRadius: "16px",
                padding: "20px",
                maxWidth: "500px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>

                <div style={{ marginBottom: "15px" }}>
                    <p style={{ margin: 0, color: "#aaa" }}>Email</p>
                    <p style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "700",
                        wordBreak: "break-word"
                    }}>
                        {usuario.email || "Sin email"}
                    </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <p style={{ margin: 0, color: "#aaa" }}>Nombre</p>
                    <p style={{ margin: 0, fontWeight: "600" }}>
                        {usuario.nombre || "Sin nombre"}
                    </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <p style={{ margin: 0, color: "#aaa" }}>Teléfono</p>
                    <p style={{ margin: 0 }}>
                        {usuario.telefono || "Sin teléfono"}
                    </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <p style={{ margin: 0, color: "#aaa" }}>Rol</p>
                    <p style={{
                        margin: 0,
                        fontWeight: "bold",
                        textTransform: "uppercase"
                    }}>
                        {usuario.rol}
                    </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <p style={{ margin: 0, color: "#aaa" }}>ID</p>
                    <p style={{
                        margin: 0,
                        fontSize: "12px",
                        wordBreak: "break-word"
                    }}>
                        {usuario.id}
                    </p>
                </div>

                <div>
                    <p style={{ margin: 0, color: "#aaa" }}>Creado</p>
                    <p style={{ margin: 0 }}>
                        {usuario.created_at
                            ? new Date(usuario.created_at).toLocaleString()
                            : "Sin fecha"}
                    </p>
                </div>

            </div>
        </div>
    );
}