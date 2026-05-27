import { useState } from 'react'

import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function TournamentForm({
    onSubmit,
    initialData = {}
}) {

    const [form, setForm] = useState({
        nombre:
            initialData.nombre || '',

        descripcion:
            initialData.descripcion || '',

        cupo_maximo:
            initialData.cupo_maximo || '',

        fecha_inicio:
            initialData.fecha_inicio || '',

        fecha_fin:
            initialData.fecha_fin || '',

        imagen: null
    })

    const [preview, setPreview] =
        useState(
            initialData.imagen_url || ''
        )

    async function handleSubmit(e) {

        e.preventDefault()

        await onSubmit(form)

    }

    function handleImageChange(e) {

        const file = e.target.files[0]

        if (!file) return

        setForm({
            ...form,
            imagen: file
        })

        setPreview(
            URL.createObjectURL(file)
        )

    }

    return (
        <Card>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* IMAGEN */}
                <div className="space-y-3">

                    <label className="
                        text-sm
                        text-gray-400
                    ">
                        Imagen del torneo
                    </label>

                    {
                        preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="
                                    w-full
                                    h-64
                                    object-cover
                                    rounded-2xl
                                "
                            />
                        )
                    }

                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageChange
                        }
                        className="
                            w-full
                            bg-[#0B1020]
                            border border-gray-700
                            rounded-xl
                            px-4 py-3
                        "
                    />

                </div>

                {/* NOMBRE */}
                <div className="space-y-2">

                    <label className="
                        text-sm
                        text-gray-400
                    ">
                        Nombre
                    </label>

                    <Input
                        type="text"
                        value={form.nombre}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                nombre:
                                    e.target.value
                            })
                        }
                        required
                    />

                </div>

                {/* DESCRIPCIÓN */}
                <div className="space-y-2">

                    <label className="
                        text-sm
                        text-gray-400
                    ">
                        Descripción
                    </label>

                    <textarea
                        value={form.descripcion}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                descripcion:
                                    e.target.value
                            })
                        }
                        rows={5}
                        className="
                            w-full
                            bg-[#0B1020]
                            border border-gray-700
                            rounded-xl
                            px-4 py-3
                            text-white
                            outline-none
                            focus:border-blue-500
                        "
                    />

                </div>

                {/* GRID */}
                <div className="
                    grid
                    md:grid-cols-3
                    gap-5
                ">

                    {/* CUPO */}
                    <div className="space-y-2">

                        <label className="
                            text-sm
                            text-gray-400
                        ">
                            Cupo máximo
                        </label>

                        <Input
                            type="number"
                            value={
                                form.cupo_maximo
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cupo_maximo:
                                        e.target.value
                                })
                            }
                            required
                        />

                    </div>

                    {/* FECHA INICIO */}
                    <div className="space-y-2">

                        <label className="
                            text-sm
                            text-gray-400
                        ">
                            Fecha inicio
                        </label>

                        <Input
                            type="date"
                            value={
                                form.fecha_inicio
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    fecha_inicio:
                                        e.target.value
                                })
                            }
                            required
                        />

                    </div>

                    {/* FECHA FIN */}
                    <div className="space-y-2">

                        <label className="
                            text-sm
                            text-gray-400
                        ">
                            Fecha fin
                        </label>

                        <Input
                            type="date"
                            value={
                                form.fecha_fin
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    fecha_fin:
                                        e.target.value
                                })
                            }
                            required
                        />

                    </div>

                </div>

                {/* BUTTON */}
                <div className="pt-4">

                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Guardar torneo
                    </Button>

                </div>

            </form>

        </Card>
    )

}