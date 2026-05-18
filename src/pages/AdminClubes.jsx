import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminClubes() {

    const navigate = useNavigate();

    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

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
    // ELIMINAR CLUB
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
    // RESTAURAR CLUB
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
    // LOADING
    // =========================

    if (loading) {

        return <p>Cargando...</p>;
    }

    return (

        <div
            style={{
                padding: "20px",
                minHeight: "100vh",
                background: "#121212",
                color: "white"
            }}
        >

            <button
                onClick={() =>
                    navigate("/admin")
                }
                style={{
                    marginBottom: "20px"
                }}
            >
                ← Volver
            </button>

            <h1>
                Administración de Clubes
            </h1>

            {clubs.length === 0 ? (

                <p>
                    No hay clubes
                </p>

            ) : (

                clubs.map(club => (

                    <div
                        key={club.id}
                        style={{
                            border: "1px solid #333",
                            borderRadius: "14px",
                            padding: "15px",
                            marginBottom: "15px",
                            background: "#1e1e1e"
                        }}
                    >

                        {club.foto && (

                            <img
                                src={club.foto}
                                alt={club.nombre}
                                style={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                            />
                        )}

                        <h2>
                            {club.nombre}
                        </h2>

                        <p>
                            {club.direccion}
                        </p>

                        <p>

                            Estado:

                            {" "}

                            <strong>

                                {club.habilitacion}

                            </strong>

                        </p>

                        {club.habilitacion === "disponible" ? (

                            <button
                                onClick={() =>
                                    eliminarClub(club.id)
                                }
                                style={{
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Eliminar club
                            </button>

                        ) : (

                            <button
                                onClick={() =>
                                    restaurarClub(club.id)
                                }
                                style={{
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Restaurar club
                            </button>

                        )}

                    </div>
                ))
            )}

        </div>
    );
}