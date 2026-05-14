import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function ClubDetalleDueno() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [canchas, setCanchas] = useState([]);
    const [deporteSeleccionado, setDeporteSeleccionado] =
        useState("futbol");

    const [precioEditando, setPrecioEditando] = useState({});
    const [guardandoPrecio, setGuardandoPrecio] = useState(false);

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

    // =========================
    // GUARDAR PRECIO
    // =========================
    async function guardarPrecio(canchaId) {

        const precio = precioEditando[canchaId];

        if (!precio || Number(precio) <= 0) {
            alert("Ingresá un precio válido");
            return;
        }

        setGuardandoPrecio(true);

        const { error } = await supabase
            .from("canchas")
            .update({
                precio_por_hora: Number(precio)
            })
            .eq("id", canchaId);

        setGuardandoPrecio(false);

        if (error) {
            alert("Error: " + error.message);
            return;
        }

        setCanchas(prev =>
            prev.map(c =>
                c.id === canchaId
                    ? {
                        ...c,
                        precio_por_hora: Number(precio)
                    }
                    : c
            )
        );

        alert("Precio actualizado ✅");
    }

    const canchasFiltradas =
        canchas.filter(
            (c) =>
                c.deporte === deporteSeleccionado
        );

    return (

        <div
            style={{
                padding: "18px",
                width: "100%",
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                boxSizing: "border-box"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    margin: "0 auto"
                }}
            >

                {/* volver */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: "18px",
                        padding: "10px 14px",
                        border: "none",
                        background: "#1e1e1e",
                        color: "white",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "13px"
                    }}
                >
                    ← Volver
                </button>

                <h2
                    style={{
                        marginBottom: "20px",
                        fontSize: "26px",
                        fontWeight: "bold"
                    }}
                >
                    Mis Canchas
                </h2>

                {/* filtros */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "24px"
                    }}
                >

                    <button
                        onClick={() =>
                            setDeporteSeleccionado(
                                "futbol"
                            )
                        }
                        style={{
                            flex: 1,
                            padding: "12px",
                            background:
                                deporteSeleccionado === "futbol"
                                    ? "#007bff"
                                    : "#1f1f1f",

                            color: "white",

                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}
                    >
                        ⚽ Fútbol
                    </button>

                    <button
                        onClick={() =>
                            setDeporteSeleccionado(
                                "padel"
                            )
                        }
                        style={{
                            flex: 1,
                            padding: "12px",
                            background:
                                deporteSeleccionado === "padel"
                                    ? "#007bff"
                                    : "#1f1f1f",

                            color: "white",

                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}
                    >
                        🎾 Pádel
                    </button>

                </div>

                {/* sin canchas */}
                {canchasFiltradas.length === 0 ? (

                    <div
                        style={{
                            width: "100%",
                            minHeight: "60vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#1b1b1b",
                            borderRadius: "16px",
                            border: "1px solid #2b2b2b",
                            textAlign: "center",
                            padding: "30px",
                            boxSizing: "border-box"
                        }}
                    >

                        <div>

                            <h3
                                style={{
                                    marginBottom: "10px",
                                    fontSize: "22px"
                                }}
                            >
                                No hay canchas
                            </h3>

                            <p
                                style={{
                                    color: "#bdbdbd",
                                    fontSize: "15px",
                                    lineHeight: "1.5"
                                }}
                            >
                                Todavía no agregaste canchas de
                                {
                                    deporteSeleccionado === "futbol"
                                        ? " fútbol"
                                        : " pádel"
                                }
                            </p>

                        </div>

                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gap: "18px"
                        }}
                    >

                        {canchasFiltradas.map((cancha) => (

                            <div
                                key={cancha.id}
                                style={{
                                    width: "100%",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    background: "#1b1b1b",
                                    border: "1px solid #2c2c2c"
                                }}
                            >

                                {/* FOTO */}
                                <img
                                    src={cancha.foto}
                                    alt={cancha.nombre}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                    }}
                                />

                                <div style={{ padding: "16px" }}>

                                    {/* NOMBRE */}
                                    <h3
                                        style={{
                                            margin: "0 0 8px 0",
                                            fontSize: "22px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {cancha.nombre}
                                    </h3>

                                    {/* DESCRIPCIÓN */}
                                    <p
                                        style={{
                                            marginBottom: "16px",
                                            fontSize: "14px",
                                            color: "#c9c9c9",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {cancha.descripcion}
                                    </p>

                                    {/* PRECIO */}
                                    <div
                                        style={{
                                            background: "#242424",
                                            borderRadius: "12px",
                                            padding: "14px",
                                            marginBottom: "16px"
                                        }}
                                    >

                                        <p
                                            style={{
                                                marginBottom: "12px",
                                                fontWeight: "bold",
                                                color: "#35c759",
                                                fontSize: "16px"
                                            }}
                                        >
                                            💲 Precio por hora:
                                            {" "}
                                            {cancha.precio_por_hora
                                                ? `$${cancha.precio_por_hora}`
                                                : "Sin definir"}
                                        </p>

                                        {/* INPUT PRECIO */}
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                flexWrap: "wrap"
                                            }}
                                        >

                                            <input
                                                type="number"
                                                placeholder="Precio"
                                                value={
                                                    precioEditando[cancha.id]
                                                    ?? cancha.precio_por_hora
                                                    ?? ""
                                                }
                                                onChange={(e) =>
                                                    setPrecioEditando(prev => ({
                                                        ...prev,
                                                        [cancha.id]: e.target.value
                                                    }))
                                                }
                                                style={{
                                                    flex: 1,
                                                    minWidth: "120px",
                                                    padding: "10px",
                                                    borderRadius: "10px",
                                                    border: "1px solid #444",
                                                    background: "#121212",
                                                    color: "white",
                                                    fontSize: "14px",
                                                    outline: "none"
                                                }}
                                            />

                                            <button
                                                onClick={() => guardarPrecio(cancha.id)}
                                                disabled={guardandoPrecio}
                                                style={{
                                                    padding: "10px 14px",
                                                    border: "none",
                                                    background: "#1f8b24",
                                                    color: "white",
                                                    borderRadius: "10px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                Guardar
                                            </button>

                                        </div>

                                    </div>

                                    {/* BOTONES */}
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
                                                flex: 1,
                                                minWidth: "110px",
                                                padding: "11px",
                                                border: "none",
                                                background: "#007bff",
                                                color: "white",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Horarios
                                        </button>

                                        <button
                                            onClick={() => navigate(`/bloqueos/${cancha.id}`)}
                                            style={{
                                                flex: 1,
                                                minWidth: "110px",
                                                padding: "11px",
                                                border: "none",
                                                background: "#dc3545",
                                                color: "white",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Bloqueos
                                        </button>

                                        <button
                                            style={{
                                                flex: 1,
                                                minWidth: "110px",
                                                padding: "11px",
                                                border: "none",
                                                background: "#444",
                                                color: "white",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Reservas
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}