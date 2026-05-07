import { useState, useEffect } from 'react'
import { login, register, getUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // 🔐 Evitar entrar al login si ya está logueado
  useEffect(() => {
    async function checkSession() {
      const user = await getUser()
      if (user) {
        navigate('/')
      }
    }

    checkSession()
  }, [])

  // 🧠 Manejo del submit
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    let res

    if (isLogin) {
      res = await login(email, password)
    } else {
      res = await register(email, password, nombre, telefono)
    }

    if (res.error) {
      alert(res.error.message)
    } else {
      navigate('/')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Registro'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        {/* 👇 SOLO EN REGISTRO */}
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <br /><br />

<input
  type="tel"
  value={telefono}
  maxLength={15}
  placeholder="Ej: 3794123456"
  onChange={(e) => {

    // 🔥 solo números
    const soloNumeros = e.target.value.replace(/\D/g, '')

    setTelefono(soloNumeros)
  }}
/>

            <br /><br />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? 'Cargando...'
            : isLogin
              ? 'Ingresar'
              : 'Registrarse'}
        </button>
      </form>

      <br />

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Crear cuenta' : 'Ya tengo cuenta'}
      </button>
    </div>
  )
}