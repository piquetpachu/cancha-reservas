import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function ClubDetalleDueno() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [canchas, setCanchas] = useState([]);
    const [deporteSeleccionado, setDeporteSeleccionado] =
        useState("futbol");

    useEffect(() => {

        async function cargarCanchas() {

            const { data, error } =
                await supabase
                    .from("canchas")
                    .select("*")
                    .eq("club_id", id);

            if (!error) {
                setCanchas(data || []);
            }
        }

        if (id) {
            cargarCanchas();
        }

    }, [id]);

    const canchasFiltradas =
        canchas.filter(
            (c) =>
                c.deporte === deporteSeleccionado
        );

    return (

        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                margin: "0 auto"
            }}
        >

            {/* volver */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "15px",
                    padding: "6px 12px",
                    border: "none",
                    background: "#ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                ← Volver
            </button>

            <h2 style={{ marginBottom: "15px" }}>
                Mis Canchas
            </h2>

            {/* filtros */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >

                <button
                    onClick={() =>
                        setDeporteSeleccionado(
                            "futbol"
                        )
                    }
                    style={{
                        padding: "8px 15px",
                        background:
                            deporteSeleccionado === "futbol"
                                ? "#007bff"
                                : "#e0e0e0",

                        color:
                            deporteSeleccionado === "futbol"
                                ? "white"
                                : "black",

                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Fútbol
                </button>

                <button
                    onClick={() =>
                        setDeporteSeleccionado(
                            "padel"
                        )
                    }
                    style={{
                        padding: "8px 15px",
                        background:
                            deporteSeleccionado === "padel"
                                ? "#007bff"
                                : "#e0e0e0",

                        color:
                            deporteSeleccionado === "padel"
                                ? "white"
                                : "black",

                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Pádel
                </button>

            </div>

            {/* canchas */}
            {canchasFiltradas.length === 0 ? (

                <p>No hay canchas</p>

            ) : (

                canchasFiltradas.map((cancha) => (

                    <div
                        key={cancha.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            overflow: "hidden",
                        }}
                    >

                        {/* FOTO */}
                        <img
                            src={cancha.foto}
                            alt={cancha.nombre}
                            style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                            }}
                        />

                        <div style={{ padding: "10px" }}>

                            <h3
                                style={{
                                    margin:
                                        "0 0 5px 0"
                                }}
                            >
                                {cancha.nombre}
                            </h3>

                            <p
                                style={{
                                    margin:
                                        "0 0 10px 0",
                                    fontSize: "14px"
                                }}
                            >
                                {cancha.descripcion}
                            </p>

                            {/* botones dueño */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        navigate(`/horarios/${cancha.id}`)
                                    }
                                    style={{
                                        padding: "5px 10px",
                                        border: "none",
                                        background: "#007bff",
                                        color: "white",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Horarios
                                </button>

                                <button
                                    style={{
                                        padding: "5px 10px",
                                        border: "none",
                                        background: "#dc3545",
                                        color: "white",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Bloqueos
                                </button>

                                <button
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "10px",
                                        marginBottom: "20px",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        maxWidth: "400px"
                                    }}
                                >
                                    Reservas
                                </button>

                            </div>

                        </div>

                    </div>
                ))
            )}

        </div>
    );
}