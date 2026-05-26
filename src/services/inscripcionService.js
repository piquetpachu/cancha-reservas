import { supabase } from '../supabaseClient'

export async function inscribirseATorneo(
    torneoId
) {
    const {
        data: { user }
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('inscripciones_torneo')
        .insert([
            {
                torneo_id: torneoId,
                usuario_id: user.id,
                estado: 'pendiente'
            }
        ])
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function cancelarInscripcion(
    torneoId
) {
    const {
        data: { user }
    } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('inscripciones_torneo')
        .delete()
        .eq('torneo_id', torneoId)
        .eq('usuario_id', user.id)

    if (error) {
        throw error
    }
}

export async function obtenerParticipantes(
    torneoId
) {
    const { data, error } = await supabase
        .from('inscripciones_torneo')
        .select(`
            *,
            profiles (
                nombre,
                avatar_url
            )
        `)
        .eq('torneo_id', torneoId)

    if (error) {
        throw error
    }

    return data
}

export async function verificarInscripcion(
    torneoId
) {
    const {
        data: { user }
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('inscripciones_torneo')
        .select('*')
        .eq('torneo_id', torneoId)
        .eq('usuario_id', user.id)
        .maybeSingle()

    if (error) {
        throw error
    }

    return data
    
}
export async function actualizarEstadoInscripcion(
    inscripcionId,
    estado
) {
    const { data, error } = await supabase
        .from('inscripciones_torneo')
        .update({
            estado
        })
        .eq('id', inscripcionId)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}