import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function ClubDetalleDueno() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [canchas, setCanchas] = useState([]);
    const [deporteSeleccionado, setDeporteSeleccionado] = useState("futbol");

    const [precioEditando, setPrecioEditando] = useState({});
    const [guardandoPrecio, setGuardandoPrecio] = useState(false);

    const [editandoCancha, setEditandoCancha] = useState(null);
    const [nombreEditado, setNombreEditado] = useState("");
    const [descripcionEditada, setDescripcionEditada] = useState("");
    const [imagenNueva, setImagenNueva] = useState(null);
    const [guardandoCancha, setGuardandoCancha] = useState(false);

    useEffect(() => {
        async function cargarCanchas() {
            const { data } = await supabase
                .from("canchas")
                .select("*")
                .eq("club_id", id)
                .eq("habilitacion", "disponible");

            setCanchas(data || []);
        }

        if (id) cargarCanchas();
    }, [id]);

    async function guardarPrecio(canchaId) {
        const precio = precioEditando[canchaId];

        if (!precio || Number(precio) <= 0) {
            alert("Ingresá un precio válido");
            return;
        }

        setGuardandoPrecio(true);

        await supabase
            .from("canchas")
            .update({ precio_por_hora: Number(precio) })
            .eq("id", canchaId);

        setGuardandoPrecio(false);

        setCanchas(prev =>
            prev.map(c =>
                c.id === canchaId
                    ? { ...c, precio_por_hora: Number(precio) }
                    : c
            )
        );

        alert("Precio actualizado ✅");
    }

    function abrirEditor(cancha) {
        setEditandoCancha(cancha);
        setNombreEditado(cancha.nombre || "");
        setDescripcionEditada(cancha.descripcion || "");
        setImagenNueva(null);
    }

    function cerrarEditor() {
        setEditandoCancha(null);
    }

    async function guardarCambiosCancha() {
        if (!editandoCancha) return;

        setGuardandoCancha(true);

        let urlImagen = editandoCancha.foto;

        if (imagenNueva) {
            const ext = imagenNueva.name.split(".").pop();
            const nombreArchivo = `${Date.now()}.${ext}`;

            const { error } = await supabase.storage
                .from("canchas")
                .upload(nombreArchivo, imagenNueva);

            if (!error) {
                const { data } = supabase.storage
                    .from("canchas")
                    .getPublicUrl(nombreArchivo);

                urlImagen = data.publicUrl;
            }
        }

        await supabase
            .from("canchas")
            .update({
                nombre: nombreEditado,
                descripcion: descripcionEditada,
                foto: urlImagen
            })
            .eq("id", editandoCancha.id);

        setCanchas(prev =>
            prev.map(c =>
                c.id === editandoCancha.id
                    ? {
                        ...c,
                        nombre: nombreEditado,
                        descripcion: descripcionEditada,
                        foto: urlImagen
                    }
                    : c
            )
        );

        setGuardandoCancha(false);
        cerrarEditor();
        alert("Cancha actualizada ✅");
    }

    async function eliminarCancha(canchaId) {
        if (!window.confirm("¿Eliminar cancha?")) return;

        await supabase
            .from("canchas")
            .update({ habilitacion: "eliminado" })
            .eq("id", canchaId);

        setCanchas(prev => prev.filter(c => c.id !== canchaId));
    }

    const canchasFiltradas = canchas.filter(
        (c) => c.deporte === deporteSeleccionado
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-4 py-6">

            <div className="max-w-3xl mx-auto">

                {/* VOLVER */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                    ← Volver
                </button>

                <h2 className="text-2xl font-bold mb-5">
                    Mis Canchas
                </h2>

                {/* FILTROS */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setDeporteSeleccionado("futbol")}
                        className={`px-4 py-2 rounded-xl ${deporteSeleccionado === "futbol" ? "bg-green-500" : "bg-white/10"}`}
                    >
                        ⚽ Fútbol
                    </button>

                    <button
                        onClick={() => setDeporteSeleccionado("padel")}
                        className={`px-4 py-2 rounded-xl ${deporteSeleccionado === "padel" ? "bg-green-500" : "bg-white/10"}`}
                    >
                        🎾 Pádel
                    </button>
                </div>

                {/* LISTA */}
                <div className="flex flex-col gap-6">

                    {canchasFiltradas.map((cancha) => (

                        <div
                            key={cancha.id}
                            className="relative h-64 rounded-3xl overflow-hidden border border-zinc-800 group"
                        >

                            <img
                                src={cancha.foto}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                            <div className="absolute bottom-0 w-full p-5">

                                <h3 className="text-xl font-bold">
                                    {cancha.nombre}
                                </h3>

                                <p className="text-sm text-zinc-300">
                                    {cancha.descripcion}
                                </p>

                                <p className="text-green-400 font-bold text-xl mt-2">
                                    ${cancha.precio_por_hora || "0"} / hora
                                </p>

                                <div className="flex flex-wrap gap-2 mt-3">

                                    <button
                                        onClick={() => abrirEditor(cancha)}
                                        className="bg-white/10 px-3 py-2 rounded-xl text-sm"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => navigate(`/horarios/${cancha.id}`)}
                                        className="bg-blue-600 px-3 py-2 rounded-xl text-sm"
                                    >
                                        Horarios
                                    </button>

                                    <button
                                        onClick={() => navigate(`/bloqueos/${cancha.id}`)}
                                        className="bg-red-600 px-3 py-2 rounded-xl text-sm"
                                    >
                                        Bloqueos
                                    </button>

                                    <button
                                        onClick={() => navigate(`/reservas-dueno/${cancha.id}`)}
                                        className="bg-zinc-700 px-3 py-2 rounded-xl text-sm"
                                    >
                                        Reservas
                                    </button>

                                    <button
                                        onClick={() => eliminarCancha(cancha.id)}
                                        className="bg-red-700 px-3 py-2 rounded-xl text-sm"
                                    >
                                        Eliminar
                                    </button>

                                </div>
                            </div>

                            {/* PRECIO */}
                            <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex gap-2">
                                <input
                                    type="number"
                                    value={precioEditando[cancha.id] ?? cancha.precio_por_hora ?? ""}
                                    onChange={(e) =>
                                        setPrecioEditando(prev => ({
                                            ...prev,
                                            [cancha.id]: e.target.value
                                        }))
                                    }
                                    className="flex-1 p-2 rounded bg-zinc-800"
                                />

                                <button
                                    onClick={() => guardarPrecio(cancha.id)}
                                    className="bg-green-600 px-4 rounded"
                                >
                                    Guardar
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            </div>

            {/* 🔥 MODAL EDITAR */}
            {editandoCancha && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md space-y-4">

                        <h3 className="text-xl font-bold">
                            Editar cancha
                        </h3>

                        <input
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                            className="w-full p-3 rounded bg-zinc-800"
                        />

                        <textarea
                            value={descripcionEditada}
                            onChange={(e) => setDescripcionEditada(e.target.value)}
                            className="w-full p-3 rounded bg-zinc-800"
                        />

                        <input
                            type="file"
                            onChange={(e) => setImagenNueva(e.target.files[0])}
                        />

                        <div className="flex gap-3">

                            <button
                                onClick={guardarCambiosCancha}
                                className="bg-green-600 px-4 py-2 rounded-xl flex-1"
                            >
                                Guardar
                            </button>

                            <button
                                onClick={cerrarEditor}
                                className="bg-zinc-700 px-4 py-2 rounded-xl flex-1"
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}