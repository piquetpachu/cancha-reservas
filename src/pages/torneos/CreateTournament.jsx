import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../../components/Navbar'

import { supabase } from '../../supabaseClient'

import { getUser } from '../../services/authService'

import {
  crearTorneo,
  obtenerClubesDueno
} from '../../services/torneoService'

export default function CreateTournament({
  deporte
}) {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [clubs, setClubs] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  const [clubId, setClubId] = useState('')
  const [imagen, setImagen] = useState(null)

  const [cupoMaximo, setCupoMaximo] = useState(8)

  const [
    tipoParticipacion,
    setTipoParticipacion
  ] = useState(
    deporte === 'futbol'
      ? 'equipo'
      : 'individual'
  )

  const [
    cantidadIntegrantes,
    setCantidadIntegrantes
  ] = useState(
    deporte === 'futbol'
      ? 11
      : 2
  )

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    try {

      const u = await getUser()

      if (!u) {

        navigate('/login')

        return

      }

      setUser(u)

      const data =
        await obtenerClubesDueno(
          u.id
        )

      setClubs(data)

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

      let imagen_url = null

      if (imagen) {

        const fileName =
          `${Date.now()}-${imagen.name}`

        const {
          error: uploadError
        } = await supabase
          .storage
          .from('torneos')
          .upload(
            fileName,
            imagen
          )

        if (uploadError)
          throw uploadError

        const { data } =
          supabase.storage
            .from('torneos')
            .getPublicUrl(
              fileName
            )

        imagen_url =
          data.publicUrl

      }

      const torneo =
        await crearTorneo({

          nombre,

          descripcion,

          fecha_inicio:
            fechaInicio,

          fecha_fin:
            fechaFin,

          cupo_maximo:
            cupoMaximo,

          club_id:
            clubId,

          creador_id:
            user.id,

          imagen_url,

          deporte,

          tipo_participacion:
            tipoParticipacion,

          cantidad_integrantes:
            cantidadIntegrantes,

          estado:
            'activo'

        })

      navigate(
        `/torneos/${torneo.id}`
      )

    } catch (error) {

      console.error(error)

      alert(error.message)

    } finally {

      setSaving(false)

    }

  }

  if (loading) {

    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
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
        p-4
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
            mb-6
          ">

            Crear torneo de {

              deporte === 'futbol'
                ? 'Fútbol'
                : 'Pádel'

            }

          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) =>
                setNombre(
                  e.target.value
                )
              }
              className="
                w-full
                bg-zinc-800
                p-3
                rounded-xl
              "
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              className="
                w-full
                bg-zinc-800
                p-3
                rounded-xl
              "
            />

            <select
              value={clubId}
              onChange={(e) =>
                setClubId(
                  e.target.value
                )
              }
              className="
                w-full
                bg-zinc-800
                p-3
                rounded-xl
              "
            >

              <option value="">
                Seleccionar club
              </option>

              {
                clubs.map(club => (

                  <option
                    key={club.id}
                    value={club.id}
                  >
                    {club.nombre}
                  </option>

                ))
              }

            </select>

            <div className="
              grid
              grid-cols-2
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
                  bg-zinc-800
                  p-3
                  rounded-xl
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
                  bg-zinc-800
                  p-3
                  rounded-xl
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
                p-3
                rounded-xl
              "
            />

            {
              deporte === 'futbol' && (

                <input
                  type="number"
                  value={
                    cantidadIntegrantes
                  }
                  onChange={(e) =>
                    setCantidadIntegrantes(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-zinc-800
                    p-3
                    rounded-xl
                  "
                  placeholder="
                    Jugadores por equipo
                  "
                />

              )
            }

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImagen(
                  e.target.files[0]
                )
              }
            />

            <button
              type="submit"
              disabled={saving}
              className="
                w-full
                bg-blue-600
                py-4
                rounded-xl
                font-semibold
              "
            >

              {
                saving
                  ? 'Creando...'
                  : 'Crear torneo'
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  )

}