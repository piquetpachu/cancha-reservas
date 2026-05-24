import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Navbar() {

  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {

    async function getRol() {

      const { data: userData } =
        await supabase.auth.getUser();

      const user = userData.user;

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user.id)
        .single();

      if (data?.rol) {
        setRol(data.rol.toLowerCase());
      }
    }

    getRol();

  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (

    <nav className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 text-white z-50">

      <div className="flex justify-around items-center py-2">

        {/* INICIO */}
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center text-xs text-zinc-300 hover:text-white"
        >
          <span className="text-lg">🏠</span>
          Inicio
        </button>

        {/* PERFIL */}
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center text-xs text-zinc-300 hover:text-white"
        >
          <span className="text-lg">👤</span>
          Perfil
        </button>

        {/* DUEÑO / ADMIN */}
        {(rol === "dueno" ||
          rol === "dueño" ||
          rol === "admin") && (

            <button
              onClick={() => navigate("/crear-club")}
              className="flex flex-col items-center text-xs text-zinc-300 hover:text-white"
            >
              <span className="text-lg">🏢</span>
              Club
            </button>
          )}

        {(rol === "dueno" ||
          rol === "dueño" ||
          rol === "admin") && (

            <button
              onClick={() => navigate("/crear-cancha")}
              className="flex flex-col items-center text-xs text-zinc-300 hover:text-white"
            >
              <span className="text-lg">⚽</span>
              Cancha
            </button>
          )}

        {/* ADMIN */}
        {rol === "admin" && (

          <button
            onClick={() => navigate("/admin")}
            className="flex flex-col items-center text-xs text-zinc-300 hover:text-white"
          >
            <span className="text-lg">🛠️</span>
            Admin
          </button>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-xs text-red-400 hover:text-red-300"
        >
          <span className="text-lg">🚪</span>
          Salir
        </button>

      </div>

    </nav>
  );
}