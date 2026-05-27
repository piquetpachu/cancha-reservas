import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// 👇 IMPORTS NUEVOS (CLAVE)
import NavbarAdmin from "./NavbarAdmin";
import NavbarDueno from "./NavbarDueno";

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

  // 🔥🔥🔥 CLAVE: CAMBIO DE NAVBAR SEGÚN ROL
  if (rol === "admin") {
    return <NavbarAdmin />;
  }

  if (rol === "dueno" || rol === "dueño") {
    return <NavbarDueno />;
  }

  // 👇 NAVBAR CLIENTE (EL TUYO, NO SE TOCA)
  return (

    <nav className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 text-white z-50">

      <div className="flex justify-around items-center py-2">

        {/* INICIO */}
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 12l8.954-8.955a.75.75 0 011.061 0L21.75 12M4.5 10.5v9.75A.75.75 0 005.25 21h4.5v-6h4.5v6h4.5a.75.75 0 00.75-.75V10.5" />
          </svg>
          Inicio
        </button>

        {/* RESERVAS */}
        <button
          onClick={() => navigate("/reservas")}
          className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
          </svg>
          Reservas
        </button>

        {/* TORNEOS */}
        <button
          onClick={() => navigate("/torneos")}
          className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 18.75h-9A2.25 2.25 0 015.25 16.5V6.75A2.25 2.25 0 017.5 4.5h9a2.25 2.25 0 012.25 2.25v9.75A2.25 2.25 0 0116.5 18.75z" />
          </svg>
          Torneos
        </button>

        {/* PERFIL */}
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
          </svg>
          Perfil
        </button>

        {/* DUEÑO / ADMIN BOTONES EXTRA */}
        {(rol === "dueno" || rol === "dueño" || rol === "admin") && (
          <button
            onClick={() => navigate("/crear-club")}
            className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 21h18M4.5 21V7.5L12 3l7.5 4.5V21M9 9h6v6H9z" />
            </svg>
            Club
          </button>
        )}

        {(rol === "dueno" || rol === "dueño" || rol === "admin") && (
          <button
            onClick={() => navigate("/crear-cancha")}
            className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h18v18H3V3zm9 0v18M3 12h18" />
            </svg>
            Cancha
          </button>
        )}

        {/* ADMIN */}
        {rol === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex flex-col items-center text-[11px] text-zinc-400 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M10.5 6h9m-9 6h9m-9 6h9M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            Admin
          </button>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-[11px] text-red-400 hover:text-red-300 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15M18 12l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Salir
        </button>

      </div>

    </nav>
  );
}
