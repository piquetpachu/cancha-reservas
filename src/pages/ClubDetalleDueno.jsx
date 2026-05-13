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
                padding: "15px",
                maxWidth: "600px",
                margin: "0 auto",
                paddingBottom: "60px",
                background: "#121212",
                minHeight: "100vh",
                color: "white"
            }}
        >

            {/* volver */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "15px",
                    padding: "8px 12px",
                    border: "none",
                    background: "#1e1e1e",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px"
                }}
            >
                ← Volver
            </button>

            <h2
                style={{
                    marginBottom: "18px",
                    fontSize: "24px",
                    fontWeight: "bold"
                }}
            >
                Mis Canchas
            </h2>

            {/* filtros */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "18px"
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
                        padding: "10px",
                        background:
                            deporteSeleccionado === "futbol"
                                ? "#007bff"
                                : "#1f1f1f",

                        color: "white",

                        border: "none",
                        borderRadius: "8px",
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
                        padding: "10px",
                        background:
                            deporteSeleccionado === "padel"
                                ? "#007bff"
                                : "#1f1f1f",

                        color: "white",

                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px"
                    }}
                >
                    🎾 Pádel
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
                            borderRadius: "14px",
                            marginBottom: "18px",
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
                                height: "150px",
                                objectFit: "cover",
                            }}
                        />

                        <div style={{ padding: "14px" }}>

                            {/* NOMBRE */}
                            <h3
                                style={{
                                    margin: "0 0 6px 0",
                                    fontSize: "20px",
                                    fontWeight: "bold"
                                }}
                            >
                                {cancha.nombre}
                            </h3>

                            {/* DESCRIPCIÓN */}
                            <p
                                style={{
                                    marginBottom: "14px",
                                    fontSize: "13px",
                                    color: "#c9c9c9",
                                    lineHeight: "1.4"
                                }}
                            >
                                {cancha.descripcion}
                            </p>

                            {/* PRECIO */}
                            <div
                                style={{
                                    background: "#242424",
                                    borderRadius: "10px",
                                    padding: "12px",
                                    marginBottom: "14px"
                                }}
                            >

                                <p
                                    style={{
                                        marginBottom: "10px",
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
                                        gap: "8px"
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
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid #444",
                                            background: "#121212",
                                            color: "white",
                                            fontSize: "14px"
                                        }}
                                    />

                                    <button
                                        onClick={() => guardarPrecio(cancha.id)}
                                        disabled={guardandoPrecio}
                                        style={{
                                            padding: "10px 12px",
                                            border: "none",
                                            background: "#1f8b24",
                                            color: "white",
                                            borderRadius: "8px",
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
                                    gap: "8px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <button
                                    onClick={() =>
                                        navigate(`/horarios/${cancha.id}`)
                                    }
                                    style={{
                                        flex: 1,
                                        minWidth: "100px",
                                        padding: "10px",
                                        border: "none",
                                        background: "#007bff",
                                        color: "white",
                                        borderRadius: "8px",
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
                                        minWidth: "100px",
                                        padding: "10px",
                                        border: "none",
                                        background: "#dc3545",
                                        color: "white",
                                        borderRadius: "8px",
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
                                        minWidth: "100px",
                                        padding: "10px",
                                        border: "none",
                                        background: "#444",
                                        color: "white",
                                        borderRadius: "8px",
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
                ))
            )}

        </div>
    );
}