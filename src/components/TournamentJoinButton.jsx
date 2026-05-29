import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

import { getUser } from '../services/authService'

export default function TournamentJoinButton({
  torneo
}) {

  const [loading, setLoading] =
    useState(false)

  const [inscripto, setInscripto] =
    useState(false)

  const [user, setUser] =
    useState(null)

  useEffect(() => {

    checkInscripcion()

  }, [])

  async function checkInscripcion() {

    const u = await getUser()

    if (!u) return

    setUser(u)

    const { data } = await supabase
      .from('inscripciones_torneo')
      .select('*')
      .eq('torneo_id', torneo.id)
      .eq('usuario_id', u.id)
      .maybeSingle()

    if (data) {
      setInscripto(true)
    }

  }

  async function handleJoin() {

    try {

      setLoading(true)

      if (!user) {
        alert('Debes iniciar sesión')
        return
      }

      // VALIDAR PERFIL
      const { data: profile } =
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

      if (
        !profile.nombre ||
        !profile.telefono ||
        !profile.dni
      ) {

        alert(
          'Completa tu perfil antes de inscribirte'
        )

        return
      }

      // CONTAR PARTICIPANTES
      const { count } = await supabase
        .from('inscripciones_torneo')
        .select('*', {
          count: 'exact',
          head: true
        })
        .eq('torneo_id', torneo.id)

      if (
        count >= torneo.cupo_maximo
      ) {

        alert('Torneo lleno')

        return
      }

      const { error } =
        await supabase
          .from(
            'inscripciones_torneo'
          )
          .insert({
            torneo_id: torneo.id,
            usuario_id: user.id
          })

      if (error) {

        alert(error.message)

        return

      }

      setInscripto(true)

      alert(
        'Inscripción realizada'
      )

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  async function handleCancel() {

    const ok = confirm(
      '¿Cancelar inscripción?'
    )

    if (!ok) return

    const { error } =
      await supabase
        .from(
          'inscripciones_torneo'
        )
        .delete()
        .eq('torneo_id', torneo.id)
        .eq('usuario_id', user.id)

    if (error) {

      alert(error.message)

      return

    }

    setInscripto(false)

  }

  if (inscripto) {

    return (
      <button
        onClick={handleCancel}
        className="
          bg-red-600
          hover:bg-red-500
          transition
          px-5
          py-3
          rounded-xl
          font-semibold
        "
      >
        Cancelar inscripción
      </button>
    )

  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="
        bg-blue-600
        hover:bg-blue-500
        transition
        px-5
        py-3
        rounded-xl
        font-semibold
      "
    >
      {
        loading
          ? 'Inscribiendo...'
          : 'Inscribirse'
      }
    </button>
  )

}