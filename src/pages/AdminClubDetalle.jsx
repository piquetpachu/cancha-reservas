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

        // CLUB

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

        // CANCHAS

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

    // LOADING

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

    // CLUB NO ENCONTRADO

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
                    marginBottom: "16px"
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
                            fontSize: "24px",
                            fontWeight: "700"
                        }}
                    >
                        Detalle del Club
                    </h1>

                    <p
                        style={{
                            marginTop: "4px",
                            color: "#9e9e9e",
                            fontSize: "13px"
                        }}
                    >
                        Panel administrativo del club
                    </p>

                </div>

            </div>

            {/* TARJETA CLUB */}

            <div
                style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "18px",
                    overflow: "hidden",
                    marginBottom: "18px"
                }}
            >

                {/* FOTO */}

                <div
                    style={{
                        width: "100%",
                        height: "210px",
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
                        padding: "16px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "10px",
                            marginBottom: "12px"
                        }}
                    >

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    lineHeight: "1.2"
                                }}
                            >
                                {club.nombre}
                            </h2>

                            <p
                                style={{
                                    marginTop: "6px",
                                    color: "#bdbdbd",
                                    fontSize: "13px",
                                    lineHeight: "1.5"
                                }}
                            >
                                {club.direccion || "Sin dirección"}
                            </p>

                        </div>

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
                                padding: "6px 12px",
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

                    {/* STATS */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "10px",
                            marginTop: "16px"
                        }}
                    >

                        <div
                            style={{
                                background: "#202020",
                                borderRadius: "12px",
                                padding: "12px"
                            }}
                        >

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "11px",
                                    color: "#9e9e9e",
                                    textTransform: "uppercase"
                                }}
                            >
                                Canchas
                            </p>

                            <h3
                                style={{
                                    margin: "6px 0 0 0",
                                    fontSize: "22px"
                                }}
                            >
                                {canchas.length}
                            </h3>

                        </div>

                        <div
                            style={{
                                background: "#202020",
                                borderRadius: "12px",
                                padding: "12px"
                            }}
                        >

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "11px",
                                    color: "#9e9e9e",
                                    textTransform: "uppercase"
                                }}
                            >
                                Estado
                            </p>

                            <h3
                                style={{
                                    margin: "6px 0 0 0",
                                    fontSize: "18px",
                                    color:
                                        club.habilitacion === "eliminado"
                                            ? "#ff8a80"
                                            : "#69f0ae"
                                }}
                            >
                                {club.habilitacion}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* HEADER CANCHAS */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    gap: "10px"
                }}
            >

                <div>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "20px"
                        }}
                    >
                        Canchas
                    </h2>

                    <p
                        style={{
                            marginTop: "4px",
                            color: "#9e9e9e",
                            fontSize: "12px"
                        }}
                    >
                        Administración de canchas del club
                    </p>

                </div>

            </div>

            {/* SIN CANCHAS */}

            {canchas.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "16px",
                        padding: "20px",
                        textAlign: "center",
                        color: "#9e9e9e",
                        fontSize: "13px"
                    }}
                >
                    Este club todavía no tiene canchas registradas
                </div>

            ) : (

                canchas.map((cancha) => (

                    <div
                        key={cancha.id}
                        onClick={() =>
                            navigate(`/admin/cancha/${cancha.id}`)
                        }
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "16px",
                            overflow: "hidden",
                            marginBottom: "14px",
                            cursor: "pointer"
                        }}
                    >

                        {/* FOTO */}

                        <div
                            style={{
                                width: "100%",
                                height: "170px",
                                background: "#222"
                            }}
                        >

                            {cancha.foto ? (

                                <img
                                    src={cancha.foto}
                                    alt={cancha.nombre}
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
                                    alignItems: "flex-start",
                                    gap: "10px"
                                }}
                            >

                                <div
                                    style={{
                                        flex: 1
                                    }}
                                >

                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "19px",
                                            lineHeight: "1.3"
                                        }}
                                    >
                                        {cancha.nombre}
                                    </h3>

                                    <p
                                        style={{
                                            marginTop: "6px",
                                            color: "#bdbdbd",
                                            fontSize: "13px"
                                        }}
                                    >
                                        {cancha.deporte || "Sin deporte"}
                                    </p>

                                </div>

                                <span
                                    style={{
                                        background:
                                            cancha.habilitacion === "eliminado"
                                                ? "#4a1f1f"
                                                : "#173524",
                                        color:
                                            cancha.habilitacion === "eliminado"
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
                                    {cancha.habilitacion || "disponible"}
                                </span>

                            </div>

                            {/* DESCRIPCION */}

                            <p
                                style={{
                                    marginTop: "12px",
                                    marginBottom: "14px",
                                    color: "#cfcfcf",
                                    fontSize: "13px",
                                    lineHeight: "1.6"
                                }}
                            >
                                {cancha.descripcion || "Sin descripción"}
                            </p>

                            {/* FOOTER */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <div
                                        style={{
                                            background: "#202020",
                                            borderRadius: "10px",
                                            padding: "8px 10px",
                                            fontSize: "12px"
                                        }}
                                    >
                                        💰 ${cancha.precio_por_hora}
                                    </div>

                                    <div
                                        style={{
                                            background: "#202020",
                                            borderRadius: "10px",
                                            padding: "8px 10px",
                                            fontSize: "12px"
                                        }}
                                    >
                                        🏟️ {cancha.deporte}
                                    </div>

                                </div>

                                <div
                                    style={{
                                        color: "#69f0ae",
                                        fontSize: "12px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Ver detalle →
                                </div>

                            </div>

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}