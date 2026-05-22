import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function DashboardDueno() {

    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    // =========================
    // EDITAR CLUB
    // =========================
    const [editandoClub, setEditandoClub] = useState(null);

    const [nombreEditado, setNombreEditado] = useState("");
    const [direccionEditada, setDireccionEditada] = useState("");
    const [descripcionEditada, setDescripcionEditada] = useState("");

    const [imagenNueva, setImagenNueva] = useState(null);

    const [guardando, setGuardando] = useState(false);

    useEffect(() => {

        async function cargarClubes() {

            // usuario logueado
            const { data: userData } =
                await supabase.auth.getUser();

            const user = userData.user;

            if (!user) return;

            // SOLO CLUBES DEL DUEÑO
            const { data, error } =
                await supabase
                    .from("clubs")
                    .select("*")
                    .eq("owner_id", user.id)
                    .eq("habilitacion", "disponible");

            console.log(data);
            console.log(error);

            if (!error) {
                setClubs(data || []);
            }
        }

        cargarClubes();

    }, []);

    // =========================
    // ELIMINAR CLUB
    // =========================

    async function eliminarClub(clubId) {

        const confirmar = window.confirm(
            "¿Seguro que querés eliminar este club?"
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("clubs")
            .update({
                habilitacion: "eliminado"
            })
            .eq("id", clubId);

        if (error) {

            alert(
                "Error eliminando club: "
                + error.message
            );

            return;
        }

        // actualizar frontend
        setClubs(prev =>
            prev.filter(c => c.id !== clubId)
        );

        alert("Club eliminado ✅");
    }

    // ABRIR EDICIÓN

    function abrirEdicion(club) {

        setEditandoClub(club.id);

        setNombreEditado(club.nombre || "");
        setDireccionEditada(club.direccion || "");
        setDescripcionEditada(club.descripcion || "");

        setImagenNueva(null);
    }

    // CANCELAR

    function cancelarEdicion() {

        setEditandoClub(null);

        setNombreEditado("");
        setDireccionEditada("");
        setDescripcionEditada("");

        setImagenNueva(null);
    }

    // GUARDAR CAMBIOS

    async function guardarCambios(club) {

        setGuardando(true);

        let urlImagen = club.foto;

        // SUBIR NUEVA FOTO

        if (imagenNueva) {

            const extension =
                imagenNueva.name.split(".").pop();

            const nombreArchivo =
                `${Date.now()}.${extension}`;

            const { error: errorUpload } =
                await supabase.storage
                    .from("clubs")
                    .upload(nombreArchivo, imagenNueva);

            if (errorUpload) {

                alert(
                    "Error subiendo imagen: "
                    + errorUpload.message
                );

                setGuardando(false);
                return;
            }

            const { data } =
                supabase.storage
                    .from("clubs")
                    .getPublicUrl(nombreArchivo);

            urlImagen = data.publicUrl;
        }

        // UPDATE

        const { error } =
            await supabase
                .from("clubs")
                .update({
                    nombre: nombreEditado,
                    direccion: direccionEditada,
                    descripcion: descripcionEditada,
                    foto: urlImagen
                })
                .eq("id", club.id);

        setGuardando(false);

        if (error) {

            alert(
                "Error actualizando club: "
                + error.message
            );

            return;
        }

        // ACTUALIZAR FRONT

        setClubs(prev =>
            prev.map(c =>
                c.id === club.id
                    ? {
                        ...c,
                        nombre: nombreEditado,
                        direccion: direccionEditada,
                        descripcion: descripcionEditada,
                        foto: urlImagen
                    }
                    : c
            )
        );

        alert("Club actualizado ✅");

        cancelarEdicion();
    }

    return (

        <div
            style={{
                padding: "15px",
                minHeight: "100vh",
                background: "#121212",
                color: "white"
            }}
        >

            <Navbar />

            <h1
                style={{
                    marginBottom: "20px",
                    fontSize: "28px"
                }}
            >
                🏟️ Mis Clubes
            </h1>

            {clubs.length === 0 ? (

                <div
                    style={{
                        background: "#1b1b1b",
                        padding: "30px",
                        borderRadius: "12px",
                        textAlign: "center",
                        marginTop: "30px"
                    }}
                >
                    <p
                        style={{
                            fontSize: "18px",
                            color: "#cfcfcf"
                        }}
                    >
                        No tenés clubes creados
                    </p>
                </div>

            ) : (

                clubs.map((club) => (

                    <div
                        key={club.id}
                        style={{
                            background: "#1b1b1b",
                            borderRadius: "14px",
                            marginBottom: "20px",
                            overflow: "hidden",
                            border: "1px solid #2d2d2d"
                        }}
                    >

                        {/* FOTO */}
                        {club.foto && (

                            <img
                                src={club.foto}
                                alt={club.nombre}
                                style={{
                                    width: "100%",
                                    height: "190px",
                                    objectFit: "cover"
                                }}
                            />
                        )}

                        {/* INFO */}
                        <div
                            style={{
                                padding: "15px"
                            }}
                        >

                            {editandoClub !== club.id ? (

                                <>

                                    <h2
                                        style={{
                                            marginBottom: "8px",
                                            fontSize: "22px"
                                        }}
                                    >
                                        {club.nombre}
                                    </h2>

                                    <p
                                        style={{
                                            color: "#cfcfcf",
                                            marginBottom: "10px",
                                            fontSize: "14px"
                                        }}
                                    >
                                        📍 {club.direccion}
                                    </p>

                                    <p
                                        style={{
                                            color: "#b5b5b5",
                                            marginBottom: "15px",
                                            fontSize: "14px",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {club.descripcion}
                                    </p>

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
                                                navigate(`/club-dueno/${club.id}`)
                                            }
                                            style={{
                                                flex: 1,
                                                minWidth: "120px",
                                                padding: "11px",
                                                border: "none",
                                                borderRadius: "10px",
                                                background: "#007bff",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Administrar
                                        </button>

                                        <button
                                            onClick={() =>
                                                abrirEdicion(club)
                                            }
                                            style={{
                                                flex: 1,
                                                minWidth: "120px",
                                                padding: "11px",
                                                border: "none",
                                                borderRadius: "10px",
                                                background: "#444",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Editar club
                                        </button>

                                        {/* ELIMINAR */}
                                        <button
                                            onClick={() =>
                                                eliminarClub(club.id)
                                            }
                                            style={{
                                                flex: 1,
                                                minWidth: "120px",
                                                padding: "11px",
                                                border: "none",
                                                borderRadius: "10px",
                                                background: "#dc3545",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Eliminar club
                                        </button>

                                    </div>

                                </>

                            ) : (

                                <>

                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombreEditado}
                                        onChange={(e) =>
                                            setNombreEditado(e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid #444",
                                            background: "#121212",
                                            color: "white",
                                            boxSizing: "border-box"
                                        }}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Dirección"
                                        value={direccionEditada}
                                        onChange={(e) =>
                                            setDireccionEditada(e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid #444",
                                            background: "#121212",
                                            color: "white",
                                            boxSizing: "border-box"
                                        }}
                                    />

                                    <textarea
                                        placeholder="Descripción"
                                        value={descripcionEditada}
                                        onChange={(e) =>
                                            setDescripcionEditada(e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            minHeight: "100px",
                                            padding: "12px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid #444",
                                            background: "#121212",
                                            color: "white",
                                            resize: "none",
                                            boxSizing: "border-box"
                                        }}
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setImagenNueva(
                                                e.target.files[0]
                                            )
                                        }
                                        style={{
                                            marginBottom: "15px",
                                            color: "white"
                                        }}
                                    />

                                    {/* BOTONES */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px"
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                guardarCambios(club)
                                            }
                                            disabled={guardando}
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                border: "none",
                                                borderRadius: "10px",
                                                background: "#1f8b24",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Guardar cambios
                                        </button>

                                        <button
                                            onClick={cancelarEdicion}
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                border: "none",
                                                borderRadius: "10px",
                                                background: "#555",
                                                color: "white",
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                    </div>

                                </>
                            )}

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}