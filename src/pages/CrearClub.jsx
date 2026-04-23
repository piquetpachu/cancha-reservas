import { useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

function CrearClub() {

    //formulario

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [mensaje, setMensaje] = useState("");

    const crearClub = async (e) => {
        e.preventDefault();

   

    //insertar en la tabla

    const { error } = await supabase
        .from("clubs")
        .insert([
            {
                nombre: nombre,
                direccion: direccion,
                // owner_id: user.id, 

            },
        ]);

    //mensaje

    if (error) {
        setMensaje("Error: " + error.message);
    } else {

        setMensaje("clib creado correctamente");
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
                    {/* NOMBRE */}
                    <input
                        type="text"
                        placeholder="Nombre del club"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <br />

                    {/* DIRECCION */}
                    <input
                        type="text"
                        placeholder="Direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        pattern="[A-Za-z0-9\s]+"
                        title="Solo letras y números"
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