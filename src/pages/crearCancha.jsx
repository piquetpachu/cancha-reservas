import {useState} from "react";
import {supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

function CrearCancha() {


    const [nombre, setNombre] = useState("");
    const[clubId, setClubId] = useState("");
    const[deportee, setDeporte] = useState("");
    const[precio, setPrecio] = useState("");
    const[descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("null");
    const[mensaje, setMensaje] = useState("");

    const crearCancha = async (e) => {
        e.preventDefault()


        let urlImagen = null;

        //subir imagenes

        if (imagen) {
            const nombreArchivo = `${Date.now()}-${imagen.name}`;

            const { error: errorUpload } = await supabase.storage
                .from("canchas")
                .upload(nombreArchivo, imagen);

                


                    }













    }

    

}