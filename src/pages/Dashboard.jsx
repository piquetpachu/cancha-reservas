import Navbar from "../components/Navbar";
import NavbarAdmin from "../components/NavbarAdmin";
import ClubList from "../pages/ClubList";
import { useEffect, useState } from "react";
import { getUser, logout } from "../services/authService";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    async function checkUser() {

      const u = await getUser();

      if (!u) {

        navigate("/login");

      } else {

        setUser(u);

        const { data, error } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", u.id)
          .single();

        console.log(data);
        console.log(error);

        setRol(data?.rol || null);

        if (data?.rol === "dueno") {

          navigate("/dashboard-dueno");
        }
      }
    }

    checkUser();

  }, []);

  async function handleLogout() {

    await logout();

    navigate("/login");
  }

  return (

    <div className="min-h-screen bg-black text-white">

      {rol === "admin"
        ? <NavbarAdmin />
        : <Navbar />
      }

      {/* HEADER */}

      <div
        className="
                    sticky
                    top-0
                    z-20
                    bg-black/90
                    backdrop-blur-xl
                    border-b
                    border-zinc-800
                "
      >

        <div className="px-5 py-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-500 text-xs uppercase tracking-widest">
                Plataforma deportiva
              </p>

              <h1 className="text-3xl font-black text-white mt-1">
                Canchas Ya
              </h1>

            </div>

            {user && (

              <button
                onClick={handleLogout}
                className="
                                    bg-red-500/15
                                    border
                                    border-red-500/20
                                    text-red-400
                                    px-4
                                    py-2
                                    rounded-2xl
                                    text-sm
                                    font-semibold
                                "
              >
                Salir
              </button>

            )}

          </div>

        </div>

      </div>

      {/* CONTENIDO */}

      <div className="px-4 py-5 pb-28 max-w-md mx-auto">
        {user ? (

          <>

            {/* TARJETA PRINCIPAL */}

            <div
              className="
                                relative
                                overflow-hidden
                                rounded-3xl
                                p-6
                                mb-5
                                bg-gradient-to-br
                                from-blue-600
                                via-indigo-600
                                to-purple-700
                                shadow-xl
                            "
            >

              <div className="relative z-10">

                <p
                  className="
                                        text-white/70
                                        text-xs
                                        uppercase
                                        tracking-widest
                                    "
                >
                  Bienvenido
                </p>

                <h2
                  className="
                                        text-white
                                        text-lg
                                        font-bold
                                        mt-2
                                        break-all
                                    "
                >
                  {user.email}
                </h2>

                <p
                  className="
                                        text-white/80
                                        text-sm
                                        mt-3
                                    "
                >
                  Encontrá clubes, reservá canchas y gestioná tus actividades deportivas.
                </p>

              </div>

              <div
                className="
                                    absolute
                                    -right-8
                                    -top-8
                                    h-32
                                    w-32
                                    rounded-full
                                    bg-white/10
                                "
              />

              <div
                className="
                                    absolute
                                    -left-6
                                    -bottom-6
                                    h-24
                                    w-24
                                    rounded-full
                                    bg-white/5
                                "
              />

            </div>

            {/* TARJETAS RAPIDAS

            <div className="grid grid-cols-2 gap-4 mb-6">

              <div
                className="
                                    bg-zinc-900
                                    border
                                    border-zinc-800
                                    rounded-3xl
                                    p-4
                                "
              >

                <p className="text-zinc-500 text-xs">
                  Estado
                </p>

                <h3
                  className="
                                        text-green-400
                                        text-xl
                                        font-bold
                                        mt-2
                                    "
                >
                  Activo
                </h3>

              </div>

              <div
                className="
                                    bg-zinc-900
                                    border
                                    border-zinc-800
                                    rounded-3xl
                                    p-4
                                "
              >

                <p className="text-zinc-500 text-xs">
                  Cuenta
                </p>

                <h3
                  className="
                                        text-blue-400
                                        text-xl
                                        font-bold
                                        mt-2
                                    "
                >
                  Cliente
                </h3>

              </div> */}

            {/* </div> */}

            {/* SECCION CLUBES */}

            {/* SECCION CLUBES */}

            <div className="mt-2">

              <div className="mb-5">

                <p
                  className="
                text-blue-400
                text-xs
                uppercase
                tracking-[0.25em]
                font-semibold
                mb-2
            "
                >
                  Explorar
                </p>

                <h2
                  className="
                text-white
                text-2xl
                font-black
                leading-tight
            "
                >
                  Clubes disponibles
                </h2>

                <p
                  className="
                text-zinc-400
                text-sm
                mt-2
            "
                >
                  Encontrá canchas, horarios y reservas cerca tuyo.
                </p>

              </div>

              <ClubList />

            </div>

          </>

        ) : (

          <div
            className="
                            flex
                            items-center
                            justify-center
                            h-[60vh]
                        "
          >

            <div
              className="
                                bg-zinc-900
                                border
                                border-zinc-800
                                rounded-3xl
                                px-8
                                py-6
                            "
            >

              <p className="text-zinc-300">
                Cargando...
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}