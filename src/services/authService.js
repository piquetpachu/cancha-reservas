import { supabase } from '../supabaseClient'

// 🧑‍💻 REGISTRO
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  // ❌ Error al registrarse
  if (error) return { data, error }

  // ✅ Crear perfil en tabla profiles
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          nombre: '',
          telefono: '',
          rol: 'cliente'
        }
      ])

    // ⚠️ Si falla crear el perfil
    if (profileError) {
      console.error('Error creando perfil:', profileError.message)
    }
  }

  return { data, error: null }
}

// 🔐 LOGIN
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { data, error }
}

// 🚪 LOGOUT
export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error al cerrar sesión:', error.message)
  }
}

// 👤 USUARIO ACTUAL
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error obteniendo usuario:', error.message)
    return null
  }

  return data.user
}