import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminEditarCancha() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [nombre, setNombre] = useState("");
    const [deporte, setDeporte] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [foto, setFoto] = useState("");
    const [habilitacion, setHabilitacion] = useState("disponible");

    useEffect(() => {
        cargarCancha();
    }, [id]);

    async function cargarCancha() {
        setLoading(true);

        const { data, error } = await supabase
            .from("canchas")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.log(error);
            setLoading(false);
            return;
        }

        setNombre(data.nombre || "");
        setDeporte(data.deporte || "");
        setPrecio(data.precio_por_hora || "");
        setDescripcion(data.descripcion || "");
        setFoto(data.foto || "");
        setHabilitacion(data.habilitacion || "disponible");

        setLoading(false);
    }

    async function guardarCambios(e) {
        e.preventDefault();

        setGuardando(true);

        if (!nombre.trim()) {
            alert("El nombre es obligatorio");
            setGuardando(false);
            return;
        }

        if (precio && Number(precio) < 0) {
            alert("El precio no puede ser negativo");
            setGuardando(false);
            return;
        }

        const { error } = await supabase
            .from("canchas")
            .update({
                nombre,
                deporte,
                precio_por_hora:
                    precio === ""
                        ? null
                        : Number(precio),
                descripcion,
                foto,
                habilitacion
            })
            .eq("id", id);

        setGuardando(false);

        if (error) {
            console.log(error);
            alert("Error al guardar");
            return;
        }

        alert("Cancha actualizada");

        navigate(`/admin/cancha/${id}`);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-zinc-400">
                    Cargando cancha...
                </p>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-black text-white">

            <NavbarAdmin />

            <div className="px-4 pt-4 pb-28">

                {/* HEADER */}
                <div className="flex flex-col gap-3 mb-5">

                    <button
                        onClick={() => navigate(-1)}
                        className="w-fit bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-800 transition font-semibold text-sm"
                    >
                        ← Volver
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold">
                            Editar cancha
                        </h1>

                        <p className="text-zinc-400 text-sm mt-1">
                            Panel administrativo
                        </p>
                    </div>

                </div>

                {/* FOTO */}
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-5">

                    {foto ? (

                        <img
                            src={foto}
                            alt="cancha"
                            className="w-full h-full object-cover"
                        />

                    ) : (

                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                            Sin imagen
                        </div>

                    )}

                </div>

                {/* FORMULARIO */}
                <form
                    onSubmit={guardarCambios}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5"
                >

                    {/* NOMBRE */}
                    <div>

                        <label className="block text-xs font-semibold text-zinc-400 mb-2">
                            NOMBRE
                        </label>

                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* DEPORTE */}
                    <div>

                        <label className="block text-xs font-semibold text-zinc-400 mb-2">
                            DEPORTE
                        </label>

                        <input
                            type="text"
                            value={deporte}
                            onChange={(e) =>
                                setDeporte(e.target.value)
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* PRECIO */}
                    <div>

                        <label className="block text-xs font-semibold text-zinc-400 mb-2">
                            PRECIO POR HORA
                        </label>

                        <input
                            type="number"
                            value={precio}
                            onChange={(e) =>
                                setPrecio(e.target.value)
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* FOTO */}
                    <div>

                        <label className="block text-xs font-semibold text-zinc-400 mb-2">
                            URL FOTO
                        </label>

                        <input
                            type="text"
                            value={foto}
                            onChange={(e) =>
                                setFoto(e.target.value)
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* HABILITACIÓN */}
                    <div>

                        <label className="block text-xs font-semibold text-zinc-400 mb-2">
                            HABILITACIÓN
                        </label>

                        <select
                            value={habilitacion}
                            onChange={(e) =>
                                setHabilitacion(e.target.value)
                            }
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="disponible">
                                Disponible
                            </option>

                            <option value="mantenimiento">
                                Mantenimiento
                            </option>

                            <option value="eliminado">
                                Eliminado
                            </option>
                        </select>

                    </div>

                    {/* DESCRIPCIÓN */}
                    <div>

                        <label className="block text-xs font-semibold text-zinc-400 mb-2">
                            DESCRIPCIÓN
                        </label>

                        <textarea
                            value={descripcion}
                            onChange={(e) =>
                                setDescripcion(e.target.value)
                            }
                            rows={5}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-white resize-none outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col gap-3 pt-2">

                        <button
                            type="submit"
                            disabled={guardando}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition
                            ${guardando
                                    ? "bg-zinc-700 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500"
                                }`}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/admin/cancha/${id}`)
                            }
                            className="w-full py-3 rounded-xl font-bold text-sm bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition"
                        >
                            Cancelar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}