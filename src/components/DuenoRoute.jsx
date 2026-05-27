import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function DuenoRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [permitido, setPermitido] = useState(false);

    useEffect(() => {

        async function verificar() {

            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (!user) {
                setPermitido(false);
                setLoading(false);
                return;
            }

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

            // 👇 SOLO DUEÑO
            if (data.rol === "dueno") {
                setPermitido(true);
            } else {
                setPermitido(false);
            }

            setLoading(false);
        }

        verificar();

    }, []);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!permitido) {
        return <Navigate to="/" replace />;
    }

    return children;
}