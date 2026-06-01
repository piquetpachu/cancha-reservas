import { useEffect, useState } from 'react'

import Navbar from '../../components/Navbar'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import { supabase } from '../../supabaseClient'

import {
  obtenerTorneoPorId,
  editarTorneo
} from '../../services/torneoService'

export default function EditarTorneo() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [torneo, setTorneo] =
    useState(null)

  const [nombre, setNombre] =
    useState('')

  const [
    descripcion,
    setDescripcion
  ] = useState('')

  const [
    fechaInicio,
    setFechaInicio
  ] = useState('')

  const [fechaFin, setFechaFin] =
    useState('')

  const [
    cupoMaximo,
    setCupoMaximo
  ] = useState(8)

  useEffect(() => {

    loadTorneo()

  }, [])

  async function loadTorneo() {

    try {

      const data =
        await obtenerTorneoPorId(id)

      setTorneo(data)

      setNombre(data.nombre)

      setDescripcion(
        data.descripcion
      )

      setFechaInicio(
        data.fecha_inicio
      )

      setFechaFin(
        data.fecha_fin
      )

      setCupoMaximo(
        data.cupo_maximo
      )

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      setSaving(true)

      await editarTorneo(id, {

        nombre,

        descripcion,

        fecha_inicio:
          fechaInicio,

        fecha_fin:
          fechaFin,

        cupo_maximo:
          cupoMaximo

      })

      navigate(`/torneos/${id}`)

    } catch (error) {

      console.error(error)

      alert(error.message)

    } finally {

      setSaving(false)

    }

  }

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-zinc-950
        text-white
      ">
        Cargando...
      </div>
    )

  }

  return (

    <div className="
      min-h-screen
      bg-zinc-950
      text-white
      pb-24
    ">

      <Navbar />

      <div className="
        max-w-2xl
        mx-auto
        px-4
        py-6
      ">

        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-6
        ">

          <h1 className="
            text-3xl
            font-bold
            mb-8
          ">
            Editar torneo
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(
                  e.target.value
                )
              }
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                p-3
              "
            />

            <textarea
              rows={4}
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                p-3
              "
            />

            <div className="
              grid
              md:grid-cols-2
              gap-4
            ">

              <input
                type="date"
                value={fechaInicio}
                onChange={(e) =>
                  setFechaInicio(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                "
              />

              <input
                type="date"
                value={fechaFin}
                onChange={(e) =>
                  setFechaFin(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                "
              />

            </div>

            <input
              type="number"
              value={cupoMaximo}
              onChange={(e) =>
                setCupoMaximo(
                  e.target.value
                )
              }
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                p-3
              "
            />

            <button
              type="submit"
              disabled={saving}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-500
                py-4
                rounded-xl
                font-semibold
              "
            >

              {
                saving
                  ? 'Guardando...'
                  : 'Guardar cambios'
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  )

}