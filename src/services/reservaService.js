import { supabase }
from '../supabaseClient'

export async function obtenerReservasUsuario(
    usuarioId
) {

    const { data, error } =
        await supabase
            .from('reservas')
            .select(`
                *,
                canchas (
                    nombre,
                    foto,
                    clubs (
                        nombre
                    )
                )
            `)
            .eq(
                'usuario_id',
                usuarioId
            )
            .order(
                'fecha',
                { ascending: false }
            )

    if (error) throw error

    return data

}

export async function cancelarReserva(
    reservaId
) {

    const { data, error } =
        await supabase
            .from('reservas')
            .update({
                estado: 'cancelada'
            })
            .eq('id', reservaId)
            .select()
            

    if (error) throw error

    return data

}