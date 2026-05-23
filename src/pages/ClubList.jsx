import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ClubList() {

    const [clubs, setClubs] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        async function cargarClubes() {

            const { data, error } = await supabase
                .from("clubs")
                .select("*");

            console.log("DATA:", data);
            console.log("ERROR:", error);

            if (error) {

                console.log("Error:", error);
                return;
            }

            setClubs(data || []);
        }

        cargarClubes();

    }, []);

    const clubesFiltrados = clubs.filter((club) =>
        club.nombre
            ?.toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (

        <div className="w-full">

            {/* BUSCADOR */}

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Buscar club..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    className="
                        w-full
                        bg-zinc-950
                        border
                        border-zinc-800
                        rounded-2xl
                        px-4
                        py-3
                        text-white
                        placeholder:text-zinc-500
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/20
                        transition-all
                    "
                />

            </div>

            {/* SIN RESULTADOS */}

            {clubesFiltrados.length === 0 ? (

                <div
                    className="
                        border
                        border-zinc-800
                        rounded-3xl
                        p-8
                        text-center
                        bg-zinc-950
                    "
                >

                    <p className="text-zinc-400">
                        No se encontraron clubes
                    </p>

                </div>

            ) : (

                <div className="space-y-5">

                    {clubesFiltrados.map((club) => (

                        <div
                            key={club.id}
                            onClick={() =>
                                navigate(`/club/${club.id}`)
                            }
                            className="
                                bg-zinc-950
                                border
                                border-zinc-800
                                rounded-[28px]
                                overflow-hidden
                                cursor-pointer
                                transition-all
                                duration-200
                                active:scale-[0.98]
                                hover:border-blue-500/40
                            "
                        >

                            {/* FOTO */}

                            {club.foto ? (

                                <img
                                    src={club.foto}
                                    alt={club.nombre}
                                    className="
                                        w-full
                                        h-56
                                        object-cover
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        h-56
                                        flex
                                        items-center
                                        justify-center
                                        bg-zinc-900
                                    "
                                >

                                    <span className="text-zinc-500">
                                        Sin imagen
                                    </span>

                                </div>

                            )}

                            {/* INFO */}

                            <div className="p-5">

                                <h3
                                    className="
                                        text-white
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {club.nombre}
                                </h3>

                                <p
                                    className="
                                        text-zinc-400
                                        text-sm
                                        mt-2
                                    "
                                >
                                    {club.direccion}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}