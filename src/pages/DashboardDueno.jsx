import NavbarDueno from "../components/NavbarDueno";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function DashboardDueno() {

    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    const [editandoClub, setEditandoClub] = useState(null);

    const [nombreEditado, setNombreEditado] = useState("");
    const [direccionEditada, setDireccionEditada] = useState("");
    const [descripcionEditada, setDescripcionEditada] = useState("");

    const [imagenNueva, setImagenNueva] = useState(null);

    const [guardando, setGuardando] = useState(false);

    useEffect(() => {

        async function cargarClubes() {

            const { data: userData } =
                await supabase.auth.getUser();

            const user = userData.user;

            if (!user) return;

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

        setClubs(prev =>
            prev.filter(c => c.id !== clubId)
        );

        alert("Club eliminado ✅");
    }

    function abrirEdicion(club) {

        setEditandoClub(club.id);

        setNombreEditado(club.nombre || "");
        setDireccionEditada(club.direccion || "");
        setDescripcionEditada(club.descripcion || "");

        setImagenNueva(null);
    }

    function cancelarEdicion() {

        setEditandoClub(null);

        setNombreEditado("");
        setDireccionEditada("");
        setDescripcionEditada("");

        setImagenNueva(null);
    }

    async function guardarCambios(club) {

        setGuardando(true);

        let urlImagen = club.foto;

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

        <>
            {/* 🔥 NAVBAR FUERA */}
            <NavbarDueno />

            <div
                style={{
                    padding: "15px",
                    paddingBottom: "100px", // 🔥 espacio para que no tape el navbar
                    minHeight: "100vh",
                    background: "#121212",
                    color: "white"
                }}
            >

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
                                        {/* TODO TU EDITOR IGUAL (no tocado) */}
                                    </>
                                )}

                            </div>

                        </div>

                    ))
                )}

            </div>
        </>
    );
}