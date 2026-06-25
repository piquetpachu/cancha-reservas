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
// TORNEOS POR DEPORTE
export async function obtenerTorneosPorDeporte(
  deporte
) {

  const { data, error } =
    await supabase
      .from('torneos')
      .select('*')
      .eq('deporte', deporte)
      .order('created_at', {
        ascending: false
      })

  if (error) throw error

  return data

}
export async function obtenerMisEquipos(
  userId
) {

  const {
    data: integrantes,
    error
  } = await supabase
    .from('equipo_integrantes')
    .select(`
      *,
      equipos_torneo (*)
    `)
    .eq(
      'usuario_id',
      userId
    )

  if (error)
    throw error

  return integrantes

}
export async function obtenerEquipoDetalle(
  equipoId
) {

  const {
    data,
    error
  } = await supabase
    .from('equipos_torneo')
    .select(`
      *,
      equipo_integrantes (
        *,
        profiles (
          id,
          nombre,
          avatar_url
        )
      ),
      invitaciones_equipo (
        *,
        profiles (
          id,
          nombre
        )
      )
    `)
    .eq('id', equipoId)
    .single()

  if (error)
    throw error

  return data

}