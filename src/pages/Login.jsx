import { useState, useEffect } from "react";
import { login, register, getUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const user = await getUser();

      if (user) {
        navigate("/");
      }
    }

    checkSession();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    let res;

    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(
        email,
        password,
        nombre,
        telefono
      );
    }

    if (res.error) {
      alert(res.error.message);
    } else {
      navigate("/");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-8">

      <div
        className="
          w-full
          max-w-md
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-6
          shadow-2xl
        "
      >

        {/* TITULO */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-white">
            {isLogin ? "Bienvenido" : "Crear cuenta"}
          </h1>

          <p className="text-zinc-400 text-sm mt-2">
            {isLogin
              ? "Ingresá para continuar"
              : "Completá tus datos para registrarte"}
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-zinc-950
                border
                border-zinc-800
                text-white
                placeholder:text-zinc-500
                outline-none
                focus:border-blue-500
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-zinc-950
                border
                border-zinc-800
                text-white
                placeholder:text-zinc-500
                outline-none
                focus:border-blue-500
                transition
              "
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Nombre
                </label>

                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-zinc-950
                    border
                    border-zinc-800
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:border-blue-500
                    transition
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Teléfono
                </label>

                <input
                  type="text"
                  placeholder="Tu teléfono"
                  value={telefono}
                  onChange={(e) =>
                    setTelefono(e.target.value)
                  }
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-zinc-950
                    border
                    border-zinc-800
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:border-blue-500
                    transition
                  "
                />
              </div>
            </>
          )}

          {/* BOTON PRINCIPAL */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-2xl
              bg-blue-600
              hover:bg-blue-500
              disabled:opacity-60
              text-white
              font-semibold
              transition
            "
          >
            {loading
              ? "Cargando..."
              : isLogin
                ? "Ingresar"
                : "Registrarse"}
          </button>

        </form>

        {/* CAMBIAR LOGIN/REGISTRO */}
        <div className="mt-6 text-center">

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="
              text-sm
              text-blue-400
              hover:text-blue-300
              transition
            "
          >
            {isLogin
              ? "¿No tenés cuenta? Crear cuenta"
              : "Ya tengo cuenta"}
          </button>

        </div>

      </div>

    </div>
  );
}