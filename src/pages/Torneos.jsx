import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'

import {
  obtenerTorneos
} from '../services/torneoService'

export default function Torneos() {

  const [torneos, setTorneos] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    cargarTorneos()
  }, [])

  async function cargarTorneos() {

    try {

      const data =
        await obtenerTorneos()

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
      ">
        <Navbar />

        <div className="p-6">
          Cargando torneos...
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
        max-w-6xl
        mx-auto
        px-4
        py-6
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <h1 className="
            text-3xl
            font-bold
          ">
            Torneos
          </h1>

          <Link
            to="/dashboard/torneos/nuevo"
            className="
              bg-blue-600
              hover:bg-blue-500
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            Crear torneo
          </Link>

        </div>

        {
          torneos.length === 0 ? (

            <div className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-10
              text-center
            ">
              No hay torneos
            </div>

          ) : (

            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            ">

              {
                torneos.map((torneo) => (

                  <Link
                    key={torneo.id}
                    to={`/torneos/${torneo.id}`}
                    className="
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded-3xl
                      overflow-hidden
                      hover:border-blue-500
                      transition
                    "
                  >

                    <img
                      src={
                        torneo.imagen_url ||
                        'https://placehold.co/600x300'
                      }
                      className="
                        w-full
                        h-52
                        object-cover
                      "
                    />

                    <div className="p-5">

                      <h2 className="
                        text-xl
                        font-bold
                      ">
                        {torneo.nombre}
                      </h2>

                      <p className="
                        text-zinc-400
                        mt-2
                        line-clamp-2
                      ">
                        {torneo.descripcion}
                      </p>

                      <div className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        text-sm
                        text-zinc-500
                      ">

                        <span>
                          {torneo.fecha_inicio}
                        </span>

                        <span>
                          {torneo.clubs?.nombre}
                        </span>

                      </div>

                    </div>

                  </Link>

                ))
              }

            </div>

          )
        }

      </div>

    </div>

  )

}