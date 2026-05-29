import { supabase } from '../supabaseClient'

// LISTAR
export async function obtenerTorneos() {

  const { data, error } = await supabase
    .from('torneos')
    .select(`
      *,
      clubs (
        nombre
      )
    `)
    .order('created_at', {
      ascending: false
    })

  if (error) throw error

  return data
}

// DETALLE
export async function obtenerTorneoPorId(id) {

  const { data, error } = await supabase
    .from('torneos')
    .select(`
      *,
      clubs (
        nombre
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

// CREAR
export async function crearTorneo(form) {

  const { data, error } = await supabase
    .from('torneos')
    .insert(form)
    .select()
    .single()

  if (error) throw error

  return data
}

// EDITAR
export async function editarTorneo(id, form) {

  const { data, error } = await supabase
    .from('torneos')
    .update(form)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

// ELIMINAR
export async function eliminarTorneo(id) {

  const { error } = await supabase
    .from('torneos')
    .delete()
    .eq('id', id)

  if (error) throw error
}
// OBTENER CLUBES DEL DUEÑO
export async function obtenerClubesDueno(
  userId
) {

  const { data, error } =
    await supabase
      .from('clubs')
      .select('*')
      .eq('owner_id', userId)

  if (error) throw error

  return data

}