import { supabase } from '../supabaseClient'

export async function subirImagenTorneo(
    file
) {
    if (!file) return null

    const fileExt =
        file.name.split('.').pop()

    const fileName =
        `${Date.now()}.${fileExt}`

    const filePath =
        `torneos/${fileName}`

    const { error } =
        await supabase.storage
            .from('torneos')
            .upload(filePath, file)

    if (error) {
        throw error
    }

    const { data } =
        supabase.storage
            .from('torneos')
            .getPublicUrl(filePath)

    return data.publicUrl
}