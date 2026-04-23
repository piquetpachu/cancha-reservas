import Navbar from '../components/Navbar'
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  async function fetchSolicitudes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("solicitudes_dueno")
      .select(`
        id,
        estado,
        created_at,
        user_id,
        profiles (
          nombre,
          telefono,
          rol
        )
      `)
      .order("created_at", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error("Error cargando solicitudes:", error.message);
    } else {
      setSolicitudes(data || []);
    }

    setLoading(false);
  }

  async function aprobar(solicitud) {
    try {
      // actualizar solicitud
      await supabase
        .from("solicitudes_dueno")
        .update({ estado: "aprobado" })
        .eq("id", solicitud.id);

      // cambiar rol
      await supabase
        .from("profiles")
        .update({ rol: "dueno" })
        .eq("id", solicitud.user_id);

      fetchSolicitudes();
    } catch (err) {
      console.error("Error al aprobar:", err);
    }
  }

  async function rechazar(id) {
    try {
      await supabase
        .from("solicitudes_dueno")
        .update({ estado: "rechazado" })
        .eq("id", id);

      fetchSolicitudes();
    } catch (err) {
      console.error("Error al rechazar:", err);
    }
  }

  return (
    <div>
      <Navbar />

      <h1>Panel Admin</h1>

      {loading && <p>Cargando solicitudes...</p>}

      {!loading && solicitudes.length === 0 && (
        <p>No hay solicitudes</p>
      )}

      {solicitudes.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "8px"
          }}
        >
          <p>
            <strong>Usuario:</strong>{" "}
            {s.profiles?.nombre || "Sin nombre"}
          </p>

          <p>
            <strong>Teléfono:</strong>{" "}
            {s.profiles?.telefono || "No disponible"}
          </p>

          <p>
            <strong>Estado:</strong> {s.estado}
          </p>

          {s.estado === "pendiente" && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => aprobar(s)}>
                ✅ Aprobar
              </button>

              <button
                onClick={() => rechazar(s.id)}
                style={{ marginLeft: "10px" }}
              >
                ❌ Rechazar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}   