import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminClubDetalle() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [club, setClub] = useState(null);
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        cargarClub();

    }, [id]);

    async function cargarClub() {

        setLoading(true);

        // =========================
        // CLUB
        // =========================

        const {
            data: clubData,
            error: clubError
        } = await supabase
            .from("clubs")
            .select("*")
            .eq("id", id)
            .single();

        if (clubError) {

            console.log(clubError);
            setLoading(false);
            return;
        }

        setClub(clubData);

        // =========================
        // CANCHAS
        // =========================

        const {
            data: canchasData,
            error: canchasError
        } = await supabase
            .from("canchas")
            .select("*")
            .eq("club_id", id)
            .order("created_at", {
                ascending: false
            });

        if (canchasError) {

            console.log(canchasError);

        } else {

            setCanchas(canchasData || []);
        }

        setLoading(false);
    }

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
                Cargando club...
            </div>
        );
    }

    // =========================
    // CLUB NO ENCONTRADO
    // =========================

    if (!club) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background: "#121212",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                Club no encontrado
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
                        navigate("/admin/clubes")
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
                        Detalle del Club
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

            {/* TARJETA CLUB */}

            <div
                style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginBottom: "18px"
                }}
            >

                {/* FOTO */}

                <div
                    style={{
                        width: "100%",
                        height: "180px",
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
                                fontSize: "13px"
                            }}
                        >
                            Sin imagen
                        </div>

                    )}

                </div>

                {/* INFO */}

                <div
                    style={{
                        padding: "14px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px"
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "700"
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
                                padding: "5px 10px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                flexShrink: 0
                            }}
                        >
                            {club.habilitacion}
                        </span>

                    </div>

                    <p
                        style={{
                            margin: 0,
                            color: "#bdbdbd",
                            fontSize: "13px",
                            marginBottom: "10px",
                            lineHeight: "1.5"
                        }}
                    >
                        {club.direccion || "Sin dirección"}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                        }}
                    >

                        <div>

                            <span
                                style={{
                                    color: "#8e8e8e",
                                    fontSize: "11px"
                                }}
                            >
                                ID DEL CLUB
                            </span>

                            <p
                                style={{
                                    margin: "2px 0 0 0",
                                    fontSize: "12px",
                                    wordBreak: "break-word"
                                }}
                            >
                                {club.id}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* CANCHAS */}

            <div
                style={{
                    marginBottom: "12px"
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        fontSize: "18px"
                    }}
                >
                    Canchas
                </h2>

                <p
                    style={{
                        marginTop: "3px",
                        color: "#9e9e9e",
                        fontSize: "12px"
                    }}
                >
                    {canchas.length} canchas registradas
                </p>

            </div>

            {canchas.length === 0 ? (

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
                    Este club no tiene canchas
                </div>

            ) : (

                canchas.map((cancha) => (

                    <div
                        key={cancha.id}
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "14px",
                            padding: "14px",
                            marginBottom: "10px"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "16px"
                                    }}
                                >
                                    {cancha.nombre}
                                </h3>

                                <p
                                    style={{
                                        marginTop: "4px",
                                        color: "#bdbdbd",
                                        fontSize: "12px"
                                    }}
                                >
                                    {cancha.tipo || "Sin tipo"}
                                </p>

                            </div>

                            <div
                                style={{
                                    background: "#202020",
                                    padding: "6px 10px",
                                    borderRadius: "10px",
                                    fontSize: "12px",
                                    fontWeight: "700"
                                }}
                            >
                                ${cancha.precio}
                            </div>

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}