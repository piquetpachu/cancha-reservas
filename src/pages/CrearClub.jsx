import { useState } from "react";
import { supabase } from "../supabaseClient";

function CrearClub() {

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [imagen, setImagen] = useState(null);

    const [mensaje, setMensaje] = useState("");

    const crearClub = async (e) => {

        e.preventDefault();

        // usuario logueado
        const { data: userData } =
            await supabase.auth.getUser();

        const user = userData.user;

        if (!user) {
            setMensaje("Usuario no autenticado");
            return;
        }

        //  URL FINAL
        let urlImagen = null;

        //  SUBIR IMAGEN
        if (imagen) {

            // obtener extensión
            const extension =
                imagen.name.split(".").pop();

            // nombre limpio
            const nombreArchivo =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}.${extension}`;

            // subir imagen
            const { error: errorUpload } =
                await supabase.storage
                    .from("clubs")
                    .upload(nombreArchivo, imagen);

            if (errorUpload) {

                setMensaje(
                    "Error subiendo imagen: " +
                    errorUpload.message
                );

                return;
            }

            // obtener URL pública
            const { data } =
                supabase.storage
                    .from("clubs")
                    .getPublicUrl(nombreArchivo);

            urlImagen = data.publicUrl;
        }

        // guardar club
        const { error } = await supabase
            .from("clubs")
            .insert([
                {
                    nombre: nombre,
                    direccion: direccion,
                    foto: urlImagen,
                    owner_id: user.id
                },
            ]);

        if (error) {

            setMensaje(
                "Error: " + error.message
            );

        } else {

            setMensaje(
                "Club creado correctamente ✅"
            );

            // limpiar formulario
            setNombre("");
            setDireccion("");
            setImagen(null);
        }
    };

    return (
        <>

            <div style={{ padding: "20px" }}>

                <h1>Crear Club</h1>

                <form onSubmit={crearClub}>

                    {/* nombre */}
                    <input
                        type="text"
                        placeholder="Nombre del club"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        required
                    />

                    <br /><br />

                    {/* direccion */}
                    <input
                        type="text"
                        placeholder="Direccion"
                        value={direccion}
                        onChange={(e) =>
                            setDireccion(e.target.value)
                        }
                        required
                    />

                    <br /><br />

                    {/* imagen */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImagen(e.target.files[0])
                        }
                    />

                    <br /><br />

                    <button type="submit">
                        Crear club
                    </button>

                </form>

                <p>{mensaje}</p>

            </div>
        </>
    );
}

export default CrearClub;