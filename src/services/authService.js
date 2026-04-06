import { supabase } from '../supabaseClient'

// REGISTRO
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  return { data, error }
}

// LOGIN
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { data, error }
}

// LOGOUT
export async function logout() {
  await supabase.auth.signOut()
}

// USUARIO ACTUAL
export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}