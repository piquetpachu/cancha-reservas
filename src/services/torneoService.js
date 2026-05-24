import { supabase } from '../supabaseClient'

export async function crearTorneo(torneo) {
    const {
        data: { user }
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('torneos')
        .insert([
            {
                ...torneo,
                owner_id: user.id
            }
        ])
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function obtenerTorneos() {
    const { data, error } = await supabase
        .from('torneos')
        .select(`
            *,
            canchas (
                nombre,
                deporte
            )
        `)
        .order('created_at', {
            ascending: false
        })

    if (error) {
        throw error
    }

    return data
}
export async function obtenerTorneoPorId(id) {
    const { data, error } = await supabase
        .from('torneos')
        .select(`
            *,
            canchas (
                nombre,
                deporte
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function actualizarTorneo(id, torneo) {
    const { data, error } = await supabase
        .from('torneos')
        .update(torneo)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function eliminarTorneo(id) {
    const { error } = await supabase
        .from('torneos')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }
}