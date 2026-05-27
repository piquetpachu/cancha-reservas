import { supabase } from '../supabaseClient'

export async function validarDisponibilidad({
    cancha_id,
    fecha,
    hora_inicio,
    hora_fin
}) {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('cancha_id', cancha_id)
        .eq('fecha', fecha)

    if (error) {
        throw error
    }

    const conflicto = data.find(
        (reserva) => {
            return (
                hora_inicio <
                    reserva.hora_fin &&
                hora_fin >
                    reserva.hora_inicio
            )
        }
    )

    return !conflicto
}

export async function crearReservaPartido({
    cancha_id,
    fecha,
    hora_inicio,
    hora_fin,
    torneo_id
}) {
    const disponible =
        await validarDisponibilidad({
            cancha_id,
            fecha,
            hora_inicio,
            hora_fin
        })

    if (!disponible) {
        throw new Error(
            'La cancha ya está reservada en ese horario'
        )
    }

    const { data, error } = await supabase
        .from('reservas')
        .insert([
            {
                cancha_id,
                fecha,
                hora_inicio,
                hora_fin,
                estado: 'torneo'
            }
        ])
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}