import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminSolicitudes() {

  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

  // 🆕 filtro
  const [filtro, setFiltro] = useState('todas')

  // 🔄 CARGAR DATOS
  useEffect(() => {
    async function load() {
      try {
        const { data: solicitudesData, error } = await supabase
          .from('solicitudes_dueno')
          .select('*')

        if (error) {
          console.error('Error solicitudes:', error)
          return
        }

        const userIds = solicitudesData.map(s => s.user_id)

        const { data: perfiles, error: errorPerfiles } = await supabase
          .from('profiles')
          .select('id, nombre, telefono')
          .in('id', userIds)

        if (errorPerfiles) {
          console.error('Error perfiles:', errorPerfiles)
        }

        const dataFinal = solicitudesData.map(s => {
          const perfil = perfiles?.find(p => p.id === s.user_id)

          return {
            ...s,
            perfil
          }
        })

        setSolicitudes(dataFinal)

      } catch (err) {
        console.error('Error general:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 🆕 FILTRADO
  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtro === 'todas') return true
    return s.estado === filtro
  })

  // ✅ APROBAR
  async function aprobar(s) {
    await supabase
      .from('profiles')
      .update({ rol: 'dueno' })
      .eq('id', s.user_id)

    await supabase
      .from('solicitudes_dueno')
      .update({ estado: 'aprobado' })
      .eq('id', s.id)

    setSolicitudes(prev =>
      prev.map(x =>
        x.id === s.id ? { ...x, estado: 'aprobado' } : x
      )
    )
  }

  // ❌ RECHAZAR
  async function rechazar(s) {
    await supabase
      .from('solicitudes_dueno')
      .update({ estado: 'rechazado' })
      .eq('id', s.id)

    setSolicitudes(prev =>
      prev.map(x =>
        x.id === s.id ? { ...x, estado: 'rechazado' } : x
      )
    )
  }

  // ⏳ LOADING
  if (loading) return <p>Cargando...</p>

  return (
    <div style={{ padding: 20 }}>
      <Navbar />
      <h1>Panel Admin - Solicitudes</h1>

      {/* 🆕 BOTONES FILTRO + PRO */}
      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={() => setFiltro('todas')}
          style={{ background: filtro === 'todas' ? '#ddd' : '' }}
        >
          Todas
        </button>

        <button 
          onClick={() => setFiltro('pendiente')}
          style={{ background: filtro === 'pendiente' ? '#ddd' : '' }}
        >
          Pendientes
        </button>

        <button 
          onClick={() => setFiltro('aprobado')}
          style={{ background: filtro === 'aprobado' ? '#ddd' : '' }}
        >
          Aprobadas
        </button>

        <button 
          onClick={() => setFiltro('rechazado')}
          style={{ background: filtro === 'rechazado' ? '#ddd' : '' }}
        >
          Rechazadas
        </button>
      </div>

      {/* 🆕 CONTADOR */}
      <p>Total: {solicitudesFiltradas.length}</p>

      {solicitudesFiltradas.length === 0 && (
        <p>No hay solicitudes</p>
      )}

      {solicitudesFiltradas.map(s => (
        <div
          key={s.id}
          style={{
            border: '1px solid #ccc',
            padding: 10,
            marginBottom: 10
          }}
        >
          <p><strong>Nombre:</strong> {s.perfil?.nombre || 'Sin nombre'}</p>
          <p><strong>Teléfono:</strong> {s.perfil?.telefono || 'Sin teléfono'}</p>
          <p><strong>Estado:</strong> {s.estado}</p>

          {s.estado === 'pendiente' && (
            <>
              <button onClick={() => aprobar(s)}>
                Aprobar
              </button>

              <button onClick={() => rechazar(s)}>
                Rechazar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}