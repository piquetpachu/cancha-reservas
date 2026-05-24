import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminClubes() {

    const navigate = useNavigate();

    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");

    useEffect(() => {
        cargarClubes();
    }, []);

    async function cargarClubes() {
        setLoading(true);

        const { data, error } = await supabase
            .from("clubs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
            setLoading(false);
            return;
        }

        setClubs(data || []);
        setLoading(false);
    }

    async function eliminarClub(id) {
        if (!window.confirm("¿Eliminar este club?")) return;

        await supabase
            .from("clubs")
            .update({ habilitacion: "eliminado" })
            .eq("id", id);

        cargarClubes();
    }

    async function restaurarClub(id) {
        await supabase
            .from("clubs")
            .update({ habilitacion: "disponible" })
            .eq("id", id);

        cargarClubes();
    }

    const clubsFiltrados = clubs.filter((club) => {
        const coincideBusqueda =
            club.nombre?.toLowerCase().includes(busqueda.toLowerCase());

        const coincideEstado =
            filtroEstado === "todos"
                ? true
                : club.habilitacion === filtroEstado;

        return coincideBusqueda && coincideEstado;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-sm">
                Cargando clubes...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            <NavbarAdmin />

            <div className="px-3 py-4">

                {/* HEADER */}
                <div className="flex flex-col gap-3 mb-4">

                    <button
                        onClick={() => navigate("/admin")}
                        className="w-fit bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-xl text-sm hover:bg-zinc-800 transition"
                    >
                        ← Volver
                    </button>

                    <div>
                        <h1 className="text-xl font-bold">Clubes</h1>
                        <p className="text-zinc-400 text-xs">
                            Panel administrativo
                        </p>
                    </div>

                </div>

                {/* FILTROS */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mb-4 flex flex-col gap-2">

                    <input
                        type="text"
                        placeholder="Buscar club..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500"
                    />

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm outline-none"
                    >
                        <option value="todos">Todos</option>
                        <option value="disponible">Disponibles</option>
                        <option value="eliminado">Eliminados</option>
                    </select>

                </div>

                {/* CONTADOR */}
                <p className="text-zinc-500 text-xs mb-3">
                    {clubsFiltrados.length} clubes
                </p>

                {/* LISTA */}
                {clubsFiltrados.length === 0 ? (

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-400 text-sm">
                        No hay clubes
                    </div>

                ) : (

                    <div className="flex flex-col gap-4 pb-28">

                        {clubsFiltrados.map((club) => (

                            <div
                                key={club.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                            >

                                {/* IMAGEN */}
                                <div className="w-full h-32 bg-zinc-800">
                                    {club.foto ? (
                                        <img
                                            src={club.foto}
                                            alt={club.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                {/* CONTENIDO */}
                                <div className="p-3">

                                    {/* NOMBRE + ESTADO */}
                                    <div className="flex justify-between items-center gap-2 mb-2">

                                        <h2 className="text-sm font-bold truncate">
                                            {club.nombre}
                                        </h2>

                                        <span
                                            className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase
                                            ${club.habilitacion === "eliminado"
                                                    ? "bg-red-500/20 text-red-300"
                                                    : "bg-green-500/20 text-green-300"
                                                }`}
                                        >
                                            {club.habilitacion}
                                        </span>

                                    </div>

                                    {/* DIRECCION */}
                                    <p className="text-zinc-400 text-xs mb-3">
                                        {club.direccion || "Sin dirección"}
                                    </p>

                                    {/* BOTONES */}
                                    <div className="flex gap-2">

                                        <button
                                            onClick={() =>
                                                navigate(`/admin/club/${club.id}`)
                                            }
                                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2 text-xs font-semibold transition"
                                        >
                                            Ver detalle
                                        </button>

                                        {club.habilitacion === "disponible" ? (

                                            <button
                                                onClick={() => eliminarClub(club.id)}
                                                className="flex-1 bg-red-700 hover:bg-red-600 text-white rounded-xl py-2 text-xs font-semibold transition"
                                            >
                                                Eliminar
                                            </button>

                                        ) : (

                                            <button
                                                onClick={() => restaurarClub(club.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-xl py-2 text-xs font-semibold transition"
                                            >
                                                Restaurar
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}