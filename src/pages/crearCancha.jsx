import { useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

function CrearCancha() {

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const crearCancha = async (e) => {
        e.preventDefault();

        // 🔹 1. USUARIO LOGUEADO
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        console.log("USER ID:", user?.id);

        if (!user) {
            setMensaje("Usuario no autenticado");
            return;
        }

        // 🔹 2. BUSCAR SU CLUB (CORRECTO)
        const { data: clubs, error: errorClub } = await supabase
            .from("clubs")
            .select("*")
            .eq("owner_id", user.id);

        console.log("CLUBS FILTRADOS:", clubs);

        if (errorClub) {
            setMensaje("Error buscando club: " + errorClub.message);
            return;
        }

        if (!clubs || clubs.length === 0) {
            setMensaje("No tenés ningún club creado");
            return;
        }

        const club_id = clubs[0].id;

        // 🔹 3. SUBIR IMAGEN
        let urlImagen = null;

        if (imagen) {
            const nombreArchivo = `${Date.now()}-${imagen.name}`;

            const { error: errorUpload } = await supabase.storage
                .from("canchas")
                .upload(nombreArchivo, imagen);

            if (errorUpload) {
                setMensaje("Error subiendo imagen: " + errorUpload.message);
                return;
            }

            const { data } = supabase.storage
                .from("canchas")
                .getPublicUrl(nombreArchivo);

            urlImagen = data.publicUrl;
        }

        // 🔹 4. GUARDAR CANCHA
        const { error } = await supabase
            .from("canchas")
            .insert([
                {
                    nombre: nombre,
                    deporte: tipo,
                    descripcion: descripcion,
                    foto: urlImagen,
                    club_id: club_id
                },
            ]);

        if (error) {
            setMensaje("Error: " + error.message);
        } else {
            setMensaje("Cancha creada correctamente");
            setNombre("");
            setTipo("");
            setDescripcion("");
            setImagen(null);
        }
    };

    return (
        <>
            <Navbar />

            <div>
                <h1>Crear Cancha</h1>

                <form onSubmit={crearCancha}>

                    <input
                        type="text"
                        placeholder="Nombre de la cancha"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <br />

                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar deporte</option>
                        <option value="futbol">Fútbol</option>
                        <option value="padel">Pádel</option>
                    </select>
                    <br />

                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <br />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                    <br />

                    <button type="submit">Crear cancha</button>
                </form>

                <p>{mensaje}</p>
            </div>
        </>
    );
}

export default CrearCancha;