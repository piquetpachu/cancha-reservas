import {
  useEffect,
  useState
} from 'react'
import { useNavigate }
from 'react-router-dom'
import {
  getUser
} from '../../services/authService'

import {
  obtenerMisEquipos
} from '../../services/torneoService'

export default function MisEquipos() {

  const [equipos, setEquipos] =
    useState([])

  const [loading, setLoading] =
    useState(true)
  const navigate =
    useNavigate()
  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    try {

      const user =
        await getUser()

      if (!user)
        return

      const data =
        await obtenerMisEquipos(
          user.id
        )

      setEquipos(data)

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
        Mis Equipos
      </h1>

      {
        equipos.length === 0 && (

          <div className="
            bg-zinc-900
            p-6
            rounded-2xl
          ">
            No perteneces a ningún equipo.
          </div>

        )
      }

      <div className="
        space-y-4
      ">

        {
          equipos.map(
            item => (

              <div
  key={item.id}
  onClick={() =>
    navigate(
      `/torneos/futbol/equipo/${item.equipo_id}`
    )
  }
  className="
    bg-zinc-900
    border
    border-zinc-800
    rounded-2xl
    p-4
    cursor-pointer
    hover:border-green-500
    transition
  "
>

                <h2 className="
                  text-xl
                  font-bold
                ">
                  {
                    item
                      .equipos_torneo
                      ?.nombre
                  }
                </h2>

                <p className="
                  text-zinc-400
                  mt-2
                ">
                  Rol:
                  {' '}
                  {item.rol}
                </p>

              </div>

            )
          )
        }

      </div>

    </div>

  )

}