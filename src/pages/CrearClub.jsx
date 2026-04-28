import { useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

function CrearClub() {

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [mensaje, setMensaje] = useState("");

    const crearClub = async (e) => {
        e.preventDefault();

        // 🔹 obtener usuario logueado
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
            setMensaje("Usuario no autenticado");
            return;
        }

        // 🔹 insertar correctamente
        const { error } = await supabase
            .from("clubs")
            .insert([
                {
                    nombre: nombre,
                    direccion: direccion,
                    owner_id: user.id
                },
            ]);

        if (error) {
            setMensaje("Error: " + error.message);
        } else {
            setMensaje("Club creado correctamente");
            setNombre("");
            setDireccion("");
        }
    };

    return (
        <>
            <Navbar />

            <div>
                <h1>Crear Club</h1>

                <form onSubmit={crearClub}>

                    <input
                        type="text"
                        placeholder="Nombre del club"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <br />

                    <input
                        type="text"
                        placeholder="Direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />

                    <button type="submit">Crear club</button>
                </form>

                <p>{mensaje}</p>
            </div>
        </>
    );
}

export default CrearClub;