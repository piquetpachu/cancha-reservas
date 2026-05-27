import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function CrearCancha() {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState(null);

    const [clubs, setClubs] = useState([]);
    const [clubSeleccionado, setClubSeleccionado] = useState("");

    const [mensaje, setMensaje] = useState("");

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

                if (data && data.length > 0) {
                    setClubSeleccionado(data[0].id);
                }
            }
        }

        cargarClubs();
    }, []);

    const crearCancha = async (e) => {

        e.preventDefault();

        const { data: userData } =
            await supabase.auth.getUser();

        const user = userData.user;

        if (!user) {
            setMensaje("❌ Usuario no autenticado");
            return;
        }

        if (!clubSeleccionado) {
            setMensaje("❌ Seleccioná un club");
            return;
        }

        let urlImagen = null;

        if (imagen) {

            const extension =
                imagen.name.split(".").pop();

            const nombreArchivo =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}.${extension}`;

            const { error: errorUpload } =
                await supabase.storage
                    .from("canchas")
                    .upload(nombreArchivo, imagen);

            if (errorUpload) {
                setMensaje("❌ Error subiendo imagen");
                return;
            }

            const { data } =
                supabase.storage
                    .from("canchas")
                    .getPublicUrl(nombreArchivo);

            urlImagen = data.publicUrl;
        }

        const { error } = await supabase
            .from("canchas")
            .insert([
                {
                    nombre,
                    deporte: tipo,
                    descripcion,
                    foto: urlImagen,
                    club_id: clubSeleccionado
                },
            ]);

        if (error) {
            setMensaje("❌ " + error.message);
        } else {
            setMensaje("✅ Cancha creada correctamente");

            setNombre("");
            setTipo("");
            setDescripcion("");
            setImagen(null);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-24">

                {/* 🔙 BOTÓN VOLVER */}
                <div className="px-6 pt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-zinc-400 hover:text-white transition"
                    >
                        ← Volver
                    </button>
                </div>

                {/* HEADER */}
                <div className="px-6 pt-4 pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Crear Cancha
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Agregá una nueva cancha a tu club
                    </p>
                </div>

                {/* FORM */}
                <div className="px-6">

                    <form
                        onSubmit={crearCancha}
                        className="flex flex-col gap-5"
                    >

                        {/* CLUB */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-1 block">
                                Club
                            </label>

                            <select
                                value={clubSeleccionado}
                                onChange={(e) =>
                                    setClubSeleccionado(e.target.value)
                                }
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
                        </div>

                        {/* NOMBRE */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-1 block">
                                Nombre de la cancha
                            </label>

                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
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

                        {/* DEPORTE */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-1 block">
                                Deporte
                            </label>

                            <select
                                value={tipo}
                                onChange={(e) =>
                                    setTipo(e.target.value)
                                }
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
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                            <label className="text-sm text-zinc-400 mb-1 block">
                                Descripción
                            </label>

                            <textarea
                                value={descripcion}
                                onChange={(e) =>
                                    setDescripcion(e.target.value)
                                }
                                rows="3"
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
                                Imagen de la cancha
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
                                    onChange={(e) =>
                                        setImagen(e.target.files[0])
                                    }
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* BOTÓN */}
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
                            Crear Cancha
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

export default CrearCancha;