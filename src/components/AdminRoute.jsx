import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [permitido, setPermitido] = useState(false);

    useEffect(() => {

        async function verificar() {

            // usuario actual
            const {
                data: { user }
            } = await supabase.auth.getUser();

            // sin login
            if (!user) {

                setPermitido(false);
                setLoading(false);
                return;
            }

            // buscar perfil
            const { data, error } = await supabase
                .from("profiles")
                .select("rol")
                .eq("id", user.id)
                .single();

            if (error || !data) {

                console.log(error);

                setPermitido(false);
                setLoading(false);
                return;
            }

            console.log("ROL USUARIO:", data.rol);

            // SOLO admin entra
            if (data.rol === "admin") {

                setPermitido(true);

            } else {

                setPermitido(false);
            }

            setLoading(false);
        }

        verificar();

    }, []);

    // esperando validación
    if (loading) {

        return <p>Cargando...</p>;
    }

    // bloquear
    if (!permitido) {

        return <Navigate to="/" replace />;
    }

    // permitir
    return children;
}