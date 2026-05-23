import NavbarAdmin from "../components/NavbarAdmin";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSolicitudes() {

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {

    async function load() {

      try {

        const { data: solicitudesData, error } = await supabase
          .from("solicitudes_dueno")
          .select("*");

        if (error) {
          console.error(error);
          return;
        }

        const userIds = solicitudesData.map(s => s.user_id);

        const { data: perfiles } = await supabase
          .from("profiles")
          .select("id, nombre, telefono")
          .in("id", userIds);

        const dataFinal = solicitudesData.map(s => ({
          ...s,
          perfil: perfiles?.find(p => p.id === s.user_id)
        }));

        setSolicitudes(dataFinal);

      } finally {
        setLoading(false);
      }
    }

    load();

  }, []);

  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtro === "todas") return true;
    return s.estado === filtro;
  });

  async function aprobar(s) {

    await supabase
      .from("profiles")
      .update({ rol: "dueno" })
      .eq("id", s.user_id);

    await supabase
      .from("solicitudes_dueno")
      .update({ estado: "aprobado" })
      .eq("id", s.id);

    setSolicitudes(prev =>
      prev.map(x =>
        x.id === s.id ? { ...x, estado: "aprobado" } : x
      )
    );
  }

  async function rechazar(s) {

    await supabase
      .from("solicitudes_dueno")
      .update({ estado: "rechazado" })
      .eq("id", s.id);

    setSolicitudes(prev =>
      prev.map(x =>
        x.id === s.id ? { ...x, estado: "rechazado" } : x
      )
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Cargando...</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-white">

      <NavbarAdmin />

      {/* HEADER */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold">Solicitudes de Dueño</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Gestiona aprobaciones del sistema
        </p>
      </div>

      {/* FILTROS */}
      <div className="px-4 flex gap-2 flex-wrap mb-4">

        {["todas", "pendiente", "aprobado", "rechazado"].map(f => (

          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`
              px-3 py-1 rounded-full text-sm border transition
              ${filtro === f
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400"
              }
            `}
          >
            {f.toUpperCase()}
          </button>

        ))}

      </div>

      {/* CONTADOR */}
      <div className="px-4 mb-3 text-sm text-zinc-400">
        Total: {solicitudesFiltradas.length}
      </div>

      {/* LISTA */}
      <div className="px-4 pb-28 space-y-3">

        {solicitudesFiltradas.length === 0 && (
          <p className="text-zinc-500">No hay solicitudes</p>
        )}

        {solicitudesFiltradas.map(s => (

          <div
            key={s.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
          >

            <div className="mb-3">

              <p className="text-white font-semibold">
                {s.perfil?.nombre || "Sin nombre"}
              </p>

              <p className="text-zinc-400 text-sm">
                {s.perfil?.telefono || "Sin teléfono"}
              </p>

              <span className={`
                inline-block mt-2 text-xs px-2 py-1 rounded-full
                ${s.estado === "pendiente" && "bg-yellow-500/20 text-yellow-400"}
                ${s.estado === "aprobado" && "bg-green-500/20 text-green-400"}
                ${s.estado === "rechazado" && "bg-red-500/20 text-red-400"}
              `}>
                {s.estado}
              </span>

            </div>

            {s.estado === "pendiente" && (

              <div className="flex gap-2">

                <button
                  onClick={() => aprobar(s)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm"
                >
                  Aprobar
                </button>

                <button
                  onClick={() => rechazar(s)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm"
                >
                  Rechazar
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}