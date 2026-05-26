import { supabase } from '../supabaseClient'

export async function obtenerPartidos(
    torneoId
) {
    const { data, error } = await supabase
        .from('partidos_torneo')
        .select(`
            *,
            jugador1:jugador1_id (
                nombre
            ),
            jugador2:jugador2_id (
                nombre
            ),
            ganador:ganador_id (
                nombre
            )
        `)
        .eq('torneo_id', torneoId)
        .order('ronda', {
            ascending: true
        })

    if (error) {
        throw error
    }

    return data
}

export async function crearPartido(
    partido
) {
    const { data, error } = await supabase
        .from('partidos_torneo')
        .insert([partido])
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function actualizarGanador(
    partidoId,
    ganadorId
) {
    const { data, error } = await supabase
        .from('partidos_torneo')
        .update({
            ganador_id: ganadorId,
            estado: 'finalizado'
        })
        .eq('id', partidoId)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}