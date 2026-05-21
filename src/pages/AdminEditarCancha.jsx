import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEditarCancha() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [nombre, setNombre] = useState("");
    const [deporte, setDeporte] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [foto, setFoto] = useState("");
    const [habilitacion, setHabilitacion] = useState("disponible");

    useEffect(() => {

        cargarCancha();

    }, [id]);

    async function cargarCancha() {

        setLoading(true);

        const {
            data,
            error
        } = await supabase
            .from("canchas")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {

            console.log(error);
            setLoading(false);
            return;
        }

        setNombre(data.nombre || "");
        setDeporte(data.deporte || "");
        setPrecio(data.precio_por_hora || "");
        setDescripcion(data.descripcion || "");
        setFoto(data.foto || "");
        setHabilitacion(data.habilitacion || "disponible");

        setLoading(false);
    }

    async function guardarCambios(e) {

        e.preventDefault();

        setGuardando(true);

        // VALIDACIONES

        if (!nombre.trim()) {

            alert("El nombre es obligatorio");
            setGuardando(false);
            return;
        }

        if (precio && Number(precio) < 0) {

            alert("El precio no puede ser negativo");
            setGuardando(false);
            return;
        }

        const {
            error
        } = await supabase
            .from("canchas")
            .update({
                nombre,
                deporte,
                precio_por_hora:
                    precio === ""
                        ? null
                        : Number(precio),
                descripcion,
                foto,
                habilitacion
            })
            .eq("id", id);

        setGuardando(false);

        if (error) {

            console.log(error);
            alert("Error al guardar");
            return;
        }

        alert("Cancha actualizada");

        navigate(`/admin/cancha/${id}`);
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
                    color: "white"
                }}
            >
                Cargando cancha...
            </div>
        );
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                padding: "14px",
                paddingBottom: "40px",
                boxSizing: "border-box"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "18px"
                }}
            >

                <button
                    onClick={() =>
                        navigate(-1)
                    }
                    style={{
                        width: "fit-content",
                        background: "#1f1f1f",
                        border: "1px solid #2e2e2e",
                        color: "white",
                        borderRadius: "10px",
                        padding: "9px 14px",
                        cursor: "pointer",
                        fontWeight: "600"
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
                        Editar cancha
                    </h1>

                    <p
                        style={{
                            marginTop: "5px",
                            color: "#9e9e9e",
                            fontSize: "13px"
                        }}
                    >
                        Panel administrativo
                    </p>

                </div>

            </div>

            {/* FORMULARIO */}

            <form
                onSubmit={guardarCambios}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                }}
            >

                {/* FOTO */}

                <div
                    style={{
                        width: "100%",
                        height: "220px",
                        borderRadius: "18px",
                        overflow: "hidden",
                        background: "#1d1d1d",
                        border: "1px solid #2a2a2a",
                        position: "relative"
                    }}
                >

                    {foto ? (

                        <>
                            <img
                                src={foto}
                                alt="cancha"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    background:
                                        "linear-gradient(transparent, rgba(0,0,0,0.85))",
                                    padding: "18px 14px",
                                    boxSizing: "border-box"
                                }}
                            >

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    {nombre || "Nombre de cancha"}
                                </h2>

                            </div>
                        </>

                    ) : (

                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#666"
                            }}
                        >
                            Sin imagen
                        </div>

                    )}

                </div>

                {/* CARD */}

                <div
                    style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "18px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    }}
                >

                    {/* NOMBRE */}

                    <div>

                        <p
                            style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                color: "#9e9e9e",
                                fontWeight: "600"
                            }}
                        >
                            NOMBRE
                        </p>

                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                            required
                            style={{
                                width: "100%",
                                background: "#202020",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                padding: "13px",
                                minHeight: "48px",
                                color: "white",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* DEPORTE */}

                    <div>

                        <p
                            style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                color: "#9e9e9e",
                                fontWeight: "600"
                            }}
                        >
                            DEPORTE
                        </p>

                        <input
                            type="text"
                            value={deporte}
                            onChange={(e) =>
                                setDeporte(e.target.value)
                            }
                            style={{
                                width: "100%",
                                background: "#202020",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                padding: "13px",
                                minHeight: "48px",
                                color: "white",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* PRECIO */}

                    <div>

                        <p
                            style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                color: "#9e9e9e",
                                fontWeight: "600"
                            }}
                        >
                            PRECIO POR HORA
                        </p>

                        <input
                            type="number"
                            value={precio}
                            onChange={(e) =>
                                setPrecio(e.target.value)
                            }
                            style={{
                                width: "100%",
                                background: "#202020",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                padding: "13px",
                                minHeight: "48px",
                                color: "white",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* FOTO URL */}

                    <div>

                        <p
                            style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                color: "#9e9e9e",
                                fontWeight: "600"
                            }}
                        >
                            URL FOTO
                        </p>

                        <input
                            type="text"
                            value={foto}
                            onChange={(e) =>
                                setFoto(e.target.value)
                            }
                            style={{
                                width: "100%",
                                background: "#202020",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                padding: "13px",
                                minHeight: "48px",
                                color: "white",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* ESTADO */}

                    <div>

                        <p
                            style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                color: "#9e9e9e",
                                fontWeight: "600"
                            }}
                        >
                            HABILITACIÓN
                        </p>

                        <select
                            value={habilitacion}
                            onChange={(e) =>
                                setHabilitacion(e.target.value)
                            }
                            style={{
                                width: "100%",
                                background: "#202020",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                padding: "13px",
                                minHeight: "48px",
                                color: "white",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        >
                            <option value="disponible">
                                Disponible
                            </option>

                            <option value="mantenimiento">
                                Mantenimiento
                            </option>

                            <option value="eliminado">
                                Eliminado
                            </option>

                        </select>

                    </div>

                    {/* DESCRIPCION */}

                    <div>

                        <p
                            style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                color: "#9e9e9e",
                                fontWeight: "600"
                            }}
                        >
                            DESCRIPCIÓN
                        </p>

                        <textarea
                            value={descripcion}
                            onChange={(e) =>
                                setDescripcion(e.target.value)
                            }
                            rows={5}
                            style={{
                                width: "100%",
                                background: "#202020",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                padding: "13px",
                                color: "white",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                resize: "none",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* BOTONES */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}
                    >

                        <button
                            type="submit"
                            disabled={guardando}
                            style={{
                                width: "100%",
                                background: guardando
                                    ? "#444"
                                    : "#1565c0",
                                border: "none",
                                color: "white",
                                borderRadius: "12px",
                                padding: "14px",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/admin/cancha/${id}`)
                            }
                            style={{
                                width: "100%",
                                background: "#2a2a2a",
                                border: "1px solid #3a3a3a",
                                color: "white",
                                borderRadius: "12px",
                                padding: "14px",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            Cancelar
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
}