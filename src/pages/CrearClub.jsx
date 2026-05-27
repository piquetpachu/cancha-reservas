import { useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function CrearClub() {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [imagen, setImagen] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const crearClub = async (e) => {

        e.preventDefault();

        const { data: userData } =
            await supabase.auth.getUser();

        const user = userData.user;

        if (!user) {
            setMensaje("❌ Usuario no autenticado");
            return;
        }

        let urlImagen = null;

        if (imagen) {
            const extension = imagen.name.split(".").pop();

            const nombreArchivo =
                `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;

            const { error: errorUpload } =
                await supabase.storage
                    .from("clubs")
                    .upload(nombreArchivo, imagen);

            if (errorUpload) {
                setMensaje("❌ Error subiendo imagen");
                return;
            }

            const { data } =
                supabase.storage
                    .from("clubs")
                    .getPublicUrl(nombreArchivo);

            urlImagen = data.publicUrl;
        }

        const { error } = await supabase
            .from("clubs")
            .insert([
                {
                    nombre,
                    direccion,
                    foto: urlImagen,
                    owner_id: user.id
                },
            ]);

        if (error) {
            setMensaje("❌ " + error.message);
        } else {
            setMensaje("✅ Club creado correctamente");
            setNombre("");
            setDireccion("");
            setImagen(null);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-24">

                {/* HEADER */}
                <div className="px-6 pt-8 pb-4">

                    {/* 🔥 BOTÓN VOLVER */}
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-zinc-400 hover:text-white mb-4"
                    >
                        ← Volver
                    </button>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Crear Club
                    </h1>

                    <p className="text-zinc-400 text-sm mt-1">
                        Registrá tu espacio y empezá a recibir reservas
                    </p>
                </div>

                {/* FORM */}
                <div className="px-6">

                    <form
                        onSubmit={crearClub}
                        className="flex flex-col gap-5"
                    >

                        {/* BLOQUE NOMBRE */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-1 block">
                                Nombre del club
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                className="
                                    w-full
                                    bg-zinc-800
                                    border border-zinc-700
                                    px-4 py-3
                                    rounded-xl
                                    focus:outline-none
                                    focus:border-blue-500
                                    transition
                                "
                            />
                        </div>

                        {/* BLOQUE DIRECCION */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-1 block">
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                                className="
                                    w-full
                                    bg-zinc-800
                                    border border-zinc-700
                                    px-4 py-3
                                    rounded-xl
                                    focus:outline-none
                                    focus:border-blue-500
                                    transition
                                "
                            />
                        </div>

                        {/* IMAGEN */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-2 block">
                                Imagen del club
                            </label>

                            <label className="
                                flex
                                items-center
                                justify-center
                                h-32
                                border-2
                                border-dashed
                                border-zinc-700
                                rounded-xl
                                cursor-pointer
                                hover:border-blue-500
                                transition
                            ">
                                <span className="text-zinc-400 text-sm">
                                    {imagen ? imagen.name : "Seleccionar imagen"}
                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImagen(e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* BOTON */}
                        <button
                            type="submit"
                            className="
                                mt-4
                                bg-blue-600
                                hover:bg-blue-700
                                py-3
                                rounded-xl
                                font-semibold
                                text-lg
                                transition
                                shadow-lg
                                shadow-blue-900/30
                            "
                        >
                            Crear Club
                        </button>

                        {/* MENSAJE */}
                        {mensaje && (
                            <p className="text-center text-sm text-zinc-300 mt-2">
                                {mensaje}
                            </p>
                        )}

                    </form>

                </div>

            </div>
        </>
    );
}

export default CrearClub;