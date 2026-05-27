import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function CrearCancha() {

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [imagen, setImagen] = useState(null);

    // CLUBS DEL DUEÑO
    const [clubs, setClubs] = useState([]);
    const [clubSeleccionado, setClubSeleccionado] = useState("");

    const [mensaje, setMensaje] = useState("");

    // CARGAR CLUBS DEL DUEÑO

    useEffect(() => {

        async function cargarClubs() {

            const { data: userData } =
                await supabase.auth.getUser();

            const user = userData.user;

            if (!user) return;

            const { data, error } = await supabase
                .from("clubs")
                .select("*")
                .eq("owner_id", user.id);

            if (!error) {

                setClubs(data || []);

                // seleccionar automáticamente el primero

                if (data && data.length > 0) {
                    setClubSeleccionado(data[0].id);
                }
            }
        }

        cargarClubs();

    }, []);

    // CREAR CANCHA

    const crearCancha = async (e) => {

        e.preventDefault();

        // USUARIO
        const { data: userData } =
            await supabase.auth.getUser();

        const user = userData.user;

        console.log("USER ID:", user?.id);

        if (!user) {
            setMensaje("Usuario no autenticado");
            return;
        }

        // VALIDAR CLUB
        if (!clubSeleccionado) {
            setMensaje("Seleccioná un club");
            return;
        }

        // SUBIR IMAGEN
        let urlImagen = null;

        if (imagen) {

            const extension =
                imagen.name.split(".").pop();

            const nombreArchivo =
                `${Date.now()}.${extension}`;

            const { error: errorUpload } =
                await supabase.storage
                    .from("canchas")
                    .upload(nombreArchivo, imagen);

            if (errorUpload) {

                setMensaje(
                    "Error subiendo imagen: " +
                    errorUpload.message
                );

                return;
            }

            const { data } =
                supabase.storage
                    .from("canchas")
                    .getPublicUrl(nombreArchivo);

            urlImagen = data.publicUrl;
        }

        // GUARDAR
        const { error } = await supabase
            .from("canchas")
            .insert([
                {
                    nombre: nombre,
                    deporte: tipo,
                    descripcion: descripcion,
                    foto: urlImagen,
                    club_id: clubSeleccionado
                },
            ]);

        if (error) {

            setMensaje(
                "Error: " + error.message
            );

        } else {

            setMensaje(
                "Cancha creada correctamente ✅"
            );

            setNombre("");
            setTipo("");
            setDescripcion("");
            setImagen(null);
        }
    };

    return (
        <>

            <div
                style={{
                    maxWidth: "450px",
                    margin: "20px auto",
                    background: "#1e1e1e",
                    padding: "20px",
                    borderRadius: "10px",
                    color: "white"
                }}
            >

                <h1
                    style={{
                        marginBottom: "20px",
                        textAlign: "center"
                    }}
                >
                    Crear Cancha
                </h1>

                <form
                    onSubmit={crearCancha}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}
                >

                    {/* CLUB */}
                    <select
                        value={clubSeleccionado}
                        onChange={(e) =>
                            setClubSeleccionado(
                                e.target.value
                            )
                        }
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                            background: "#2c2c2c",
                            color: "white"
                        }}
                    >

                        {clubs.length === 0 ? (

                            <option value="">
                                No tenés clubes
                            </option>

                        ) : (

                            clubs.map((club) => (

                                <option
                                    key={club.id}
                                    value={club.id}
                                >
                                    {club.nombre}
                                </option>

                            ))
                        )}

                    </select>

                    {/* NOMBRE */}
                    <input
                        type="text"
                        placeholder="Nombre de la cancha"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                            background: "#2c2c2c",
                            color: "white"
                        }}
                    />

                    {/* DEPORTE */}
                    <select
                        value={tipo}
                        onChange={(e) =>
                            setTipo(e.target.value)
                        }
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                            background: "#2c2c2c",
                            color: "white"
                        }}
                    >
                        <option value="">
                            Seleccionar deporte
                        </option>

                        <option value="futbol">
                            Fútbol
                        </option>

                        <option value="padel">
                            Pádel
                        </option>
                    </select>

                    {/* DESCRIPCIÓN */}
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(
                                e.target.value
                            )
                        }
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                            background: "#2c2c2c",
                            color: "white"
                        }}
                    />

                    {/* IMAGEN */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImagen(
                                e.target.files[0]
                            )
                        }
                        style={{
                            color: "white"
                        }}
                    />

                    {/* BOTÓN */}
                    <button
                        type="submit"
                        style={{
                            padding: "12px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Crear cancha
                    </button>

                </form>

                <p
                    style={{
                        marginTop: "15px",
                        textAlign: "center"
                    }}
                >
                    {mensaje}
                </p>

            </div>
        </>
    );
}

export default CrearCancha;