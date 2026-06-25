import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  obtenerTorneosPorDeporte
} from '../../services/torneoService'

export default function FutbolTorneos() {

  const navigate =
    useNavigate()

  const [torneos, setTorneos] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    loadTorneos()

  }, [])

  async function loadTorneos() {

    try {

      const data =
        await obtenerTorneosPorDeporte(
          'futbol'
        )

      setTorneos(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-zinc-950
        text-white
        p-6
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
      p-4
    ">

      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        Torneos de Fútbol
      </h1>

      <div className="
        space-y-4
      ">

        {
          torneos.map(
            torneo => (

              <div
                key={torneo.id}
                onClick={() =>
                  navigate(
                    `/torneos/${torneo.id}`
                  )
                }
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  overflow-hidden
                  cursor-pointer
                "
              >

                {
                  torneo.imagen_url && (

                    <img
                      src={
                        torneo.imagen_url
                      }
                      alt={
                        torneo.nombre
                      }
                      className="
                        w-full
                        h-48
                        object-cover
                      "
                    />

                  )
                }

                <div className="p-4">

                  <h2 className="
                    text-xl
                    font-bold
                  ">
                    {torneo.nombre}
                  </h2>

                  <p className="
                    text-zinc-400
                    mt-2
                  ">
                    {torneo.descripcion}
                  </p>

                </div>

              </div>

            )
          )
        }

      </div>

    </div>

  )

}