import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

export default function AdminUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function cargarUsuarios() {

        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
        } else {
            setUsuarios(data || []);
        }

        setLoading(false);
    }

    async function cambiarRol(id, nuevoRol) {

        const confirmar = window.confirm(
            `¿Cambiar rol a ${nuevoRol}?`
        );

        if (!confirmar) return;

        const { error } = await supabase
            .from("profiles")
            .update({ rol: nuevoRol })
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Error al cambiar rol");
        } else {
            cargarUsuarios();
        }
    }

    // 🔍 FILTRO
    const usuariosFiltrados = useMemo(() => {

        return usuarios.filter((u) => {

            const nombre = u.nombre?.toLowerCase() || "";
            const email = u.email?.toLowerCase() || "";

            const texto = busqueda.toLowerCase();

            return (
                nombre.includes(texto) ||
                email.includes(texto)
            );
        });

    }, [usuarios, busqueda]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-zinc-400 text-lg">Cargando usuarios...</p>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-zinc-950 text-white">

            {/* NAVBAR */}
            <NavbarAdmin />

            <div className="px-4 pt-4 pb-28 max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4">

                    <div className="flex items-center justify-between flex-wrap gap-3">

                        <h1 className="text-3xl font-bold">
                            Usuarios
                        </h1>

                        <span className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm text-zinc-400">
                            Total: {usuariosFiltrados.length}
                        </span>

                    </div>

                    {/* 🔍 BUSCADOR */}
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />

                </div>

                {usuariosFiltrados.length === 0 ? (

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
                        No se encontraron usuarios
                    </div>

                ) : (

                    <div className="space-y-5">

                        {usuariosFiltrados.map((u) => (

                            <div
                                key={u.id}
                                onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                                className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:border-zinc-600 transition"
                            >

                                {/* INFO */}
                                <div className="mb-4">

                                    <p className="text-lg font-semibold group-hover:text-blue-400 transition">
                                        {u.nombre || "Sin nombre"}
                                    </p>

                                    <p className="text-zinc-400 text-sm mt-1 break-all">
                                        {u.email}
                                    </p>

                                </div>

                                {/* ROL + BOTONES */}
                                <div className="flex items-center justify-between flex-wrap gap-3">

                                    {/* ROL */}
                                    <span className={`
                                        px-3 py-1 rounded-full text-xs font-bold uppercase
                                        ${u.rol === "admin" && "bg-purple-500/20 text-purple-300"}
                                        ${u.rol === "dueno" && "bg-blue-500/20 text-blue-300"}
                                        ${u.rol === "cliente" && "bg-green-500/20 text-green-300"}
                                    `}>
                                        {u.rol}
                                    </span>

                                    {/* BOTONES */}
                                    <div className="flex gap-2 flex-wrap">

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                cambiarRol(u.id, "cliente")
                                            }}
                                            className="px-3 py-2 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-500 transition"
                                        >
                                            Cliente
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                cambiarRol(u.id, "dueno")
                                            }}
                                            className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 transition"
                                        >
                                            Dueño
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                cambiarRol(u.id, "admin")
                                            }}
                                            className="px-3 py-2 rounded-lg text-sm font-semibold bg-purple-600 hover:bg-purple-500 transition"
                                        >
                                            Admin
                                        </button>

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