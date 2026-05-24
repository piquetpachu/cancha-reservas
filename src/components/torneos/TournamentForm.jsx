import { useEffect, useState } from 'react'

export default function TournamentForm({
    onSubmit,
    initialData = {},
    submitText = 'Guardar torneo'
}) {
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        cupo_maximo: 8
    })

    useEffect(() => {
        if (initialData) {
            setForm({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                fecha_inicio: initialData.fecha_inicio || '',
                fecha_fin: initialData.fecha_fin || '',
                cupo_maximo:
                    initialData.cupo_maximo || 8
            })
        }
    }, [initialData])

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        await onSubmit(form)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <input
                type="text"
                name="nombre"
                placeholder="Nombre torneo"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <input
                type="number"
                name="cupo_maximo"
                value={form.cupo_maximo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                {submitText}
            </button>
        </form>
    )
}