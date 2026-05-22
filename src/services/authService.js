import { supabase } from '../supabaseClient'

// 🧑‍💻 REGISTRO
export async function register(email, password, nombre, telefono) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return { error }

  const user = data.user

  if (!user) {
    return { error: { message: 'No se pudo crear el usuario' } }
  }

  // 🔥 Crear perfil en profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      nombre,
      telefono,
      rol: 'cliente' // 🔐 siempre cliente al registrarse
    })

  if (profileError) {
    console.error('Error creando perfil:', profileError.message)
    return { error: profileError }
  }

  return { data }
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
export async function getProfile() {
  const user = await getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error obteniendo perfil:", error.message)
    return null
  }

  return data
}