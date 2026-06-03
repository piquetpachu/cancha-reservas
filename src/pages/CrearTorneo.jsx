import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { useNavigate } from 'react-router-dom'

import { supabase } from '../supabaseClient'

import { getUser } from '../services/authService'

import {
  crearTorneo,
  obtenerClubesDueno
} from '../services/torneoService'

export default function CrearTorneo() {

  const navigate = useNavigate()

  const [user, setUser] =
    useState(null)

  const [clubs, setClubs] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  // FORM
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

  const [clubId, setClubId] =
    useState('')

  const [imagen, setImagen] =
    useState(null)

  const [
  tipoParticipacion,
  setTipoParticipacion
] = useState('individual')

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

      // SUBIR IMAGEN
      if (imagen) {

        const fileName =
          `${Date.now()}-${imagen.name}`

        const { error: uploadError } =
          await supabase.storage
            .from('torneos')
            .upload(fileName, imagen)

        if (uploadError) {
          throw uploadError
        }

        const { data } =
          supabase.storage
            .from('torneos')
            .getPublicUrl(fileName)

        imagen_url =
          data.publicUrl

      }

      // CREAR TORNEO
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

          tipo_participacion:
            tipoParticipacion,

          club_id: clubId,

          creador_id:
            user.id,

          imagen_url


        })

      navigate(
        `/torneos/${torneo.id}`
      )

    } catch (error) {

      console.error(error)
console.log(
  'Tipo seleccionado:',
  tipoParticipacion
)
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

        <Navbar />

        <div className="p-6">
          Cargando...
        </div>

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
          shadow-xl
        ">

          <h1 className="
            text-3xl
            font-bold
            mb-8
          ">
            Crear torneo
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NOMBRE */}
            <div>

              <label className="
                text-sm
                text-zinc-400
              ">
                Nombre
              </label>

              <input
                type="text"
                required
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                  outline-none
                "
              />

            </div>

            {/* DESCRIPCIÓN */}
            <div>

              <label className="
                text-sm
                text-zinc-400
              ">
                Descripción
              </label>

              <textarea
                required
                rows={4}
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                  outline-none
                "
              />

            </div>
            {/* MODALIDAD */}
<div>

  <label className="
    text-sm
    text-zinc-400
  ">
    Modalidad
  </label>

<select
  value={tipoParticipacion}
  onChange={(e) =>
    setTipoParticipacion(
      e.target.value
    )
  }
>
  <option value="individual">
    Individual
  </option>

  <option value="equipo">
    Equipo
  </option>
</select>

</div>

            {/* CLUB */}
            <div>

              <label className="
                text-sm
                text-zinc-400
              ">
                Club
              </label>

              <select
                required
                value={clubId}
                onChange={(e) =>
                  setClubId(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                  outline-none
                "
              >

                <option value="">
                  Seleccionar club
                </option>

                {
                  clubs.map((club) => (

                    <option
                      key={club.id}
                      value={club.id}
                    >
                      {club.nombre}
                    </option>

                  ))
                }

              </select>

            </div>

            {/* FECHAS */}
            <div className="
              grid
              md:grid-cols-2
              gap-4
            ">

              <div>

                <label className="
                  text-sm
                  text-zinc-400
                ">
                  Fecha inicio
                </label>

                <input
                  type="date"
                  required
                  value={fechaInicio}
                  onChange={(e) =>
                    setFechaInicio(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-xl
                    p-3
                    outline-none
                  "
                />

              </div>

              <div>

                <label className="
                  text-sm
                  text-zinc-400
                ">
                  Fecha fin
                </label>

                <input
                  type="date"
                  required
                  value={fechaFin}
                  onChange={(e) =>
                    setFechaFin(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-xl
                    p-3
                    outline-none
                  "
                />

              </div>

            </div>

            {/* CUPO */}
            <div>

              <label className="
                text-sm
                text-zinc-400
              ">
                Cupo máximo
              </label>

              <input
                type="number"
                required
                min="2"
                value={cupoMaximo}
                onChange={(e) =>
                  setCupoMaximo(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                  outline-none
                "
              />

            </div>

            {/* IMAGEN */}
            <div>

              <label className="
                text-sm
                text-zinc-400
              ">
                Imagen torneo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImagen(
                    e.target.files[0]
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-3
                "
              />

            </div>

            {/* BUTTON */}
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
                transition
              "
            >

              {
                saving
                  ? 'Creando torneo...'
                  : 'Crear torneo'
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  )

}