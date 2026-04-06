import { useState } from 'react'
import { login, register } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
    
  async function handleSubmit(e) {
    e.preventDefault()

    let res

    if (isLogin) {
      res = await login(email, password)
    } else {
      res = await register(email, password)
    }

    if (res.error) {
      alert(res.error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div>
        aassas
      <h2>{isLogin ? 'Login' : 'Registro'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {isLogin ? 'Ingresar' : 'Registrarse'}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Crear cuenta' : 'Ya tengo cuenta'}
      </button>
    </div>
  )
}