import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mulberry32 } from '../random'
import { topicFrom } from '../test/topics'
import type { Topic } from '../types'
import { Practice } from './Practice'

const tema = topicFrom([
  { type: 'choice', question: '¿Qué número va después del 39?', options: ['38', '40', '49'], answer: '40' },
  { type: 'number', question: '23 + 14 =', answer: 37 },
])

// Tema que genera ejercicios distintos cada vez: 10 sumas en columna
const temaGenerado: Topic = {
  id: 'generado',
  name: 'Tema generado',
  icon: '🧪',
  tint: '#fff',
  plan: [{ spec: { kind: 'column', operator: '+' }, count: 10 }],
}

const renderPractice = () => {
  const onHome = vi.fn()
  const onBack = vi.fn()
  render(<Practice topic={tema} onHome={onHome} onBack={onBack} />)
  return { user: userEvent.setup(), onHome, onBack }
}

describe('Practice: ejercicios de elegir', () => {
  it('muestra la pregunta y las opciones', () => {
    renderPractice()
    expect(screen.getByRole('heading', { name: '¿Qué número va después del 39?' })).toBeInTheDocument()
    for (const option of ['38', '40', '49']) {
      expect(screen.getByRole('button', { name: option })).toBeEnabled()
    }
  })

  it('ante un fallo anima, desactiva esa opción y deja volver a intentarlo', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '38' }))
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '38' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '40' })).toBeEnabled()
    expect(screen.queryByText('¡Muy bien!')).not.toBeInTheDocument()
  })

  it('con la respuesta correcta felicita y ofrece Siguiente', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '40' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '38' })).not.toBeInTheDocument()
  })

  it('no hay límite de intentos: se puede fallar varias veces y luego acertar', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '38' }))
    await user.click(screen.getByRole('button', { name: '49' }))
    await user.click(screen.getByRole('button', { name: '40' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })
})

describe('Practice: ejercicios de escribir un número', () => {
  const irAlEjercicioNumerico = async () => {
    const contexto = renderPractice()
    await contexto.user.click(screen.getByRole('button', { name: '40' }))
    await contexto.user.click(screen.getByRole('button', { name: /Siguiente/ }))
    return contexto
  }

  const escribir = async (user: ReturnType<typeof userEvent.setup>, cifras: string) => {
    for (const cifra of cifras) await user.click(screen.getByRole('button', { name: cifra }))
  }

  it('muestra el teclado y la comprobación está desactivada hasta escribir algo', async () => {
    await irAlEjercicioNumerico()
    expect(screen.getByRole('heading', { name: '23 + 14 =' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled()
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('?')
  })

  it('escribe las cifras en el cuadro y permite borrar', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '37')
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('37')
    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('3')
  })

  it('admite como máximo tres cifras', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '12345')
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('123')
  })

  it('ante un número incorrecto anima y vacía el cuadro para reintentar', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '36')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('?')
  })

  it('con el número correcto felicita y muestra la respuesta', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '37')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Terminar/ })).toBeInTheDocument()
  })
})

describe('Practice: final del tema y navegación', () => {
  const terminarTema = async () => {
    const contexto = renderPractice()
    await contexto.user.click(screen.getByRole('button', { name: '40' }))
    await contexto.user.click(screen.getByRole('button', { name: /Siguiente/ }))
    for (const cifra of '37') await contexto.user.click(screen.getByRole('button', { name: cifra }))
    await contexto.user.click(screen.getByRole('button', { name: 'Comprobar' }))
    await contexto.user.click(screen.getByRole('button', { name: /Terminar/ }))
    return contexto
  }

  it('al terminar muestra el cierre con Repetir y Elegir otro tema', async () => {
    await terminarTema()
    expect(screen.getByText('¡Muy bien! Has terminado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Repetir/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Elegir otro tema/ })).toBeInTheDocument()
  })

  it('Repetir vuelve al primer ejercicio', async () => {
    const { user } = await terminarTema()
    await user.click(screen.getByRole('button', { name: /Repetir/ }))
    expect(screen.getByRole('heading', { name: '¿Qué número va después del 39?' })).toBeInTheDocument()
  })

  it('Elegir otro tema y los botones de la barra llaman a la navegación', async () => {
    const { user, onBack, onHome } = await terminarTema()
    await user.click(screen.getByRole('button', { name: /Elegir otro tema/ }))
    expect(onBack).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(onHome).toHaveBeenCalledTimes(1)
  })
})

describe('Practice: sesiones aleatorias', () => {
  const operaciones = () => screen.getByRole('group', { name: /^\d+ \+ \d+$/ }).getAttribute('aria-label')

  const resolverSesion = async (user: ReturnType<typeof userEvent.setup>) => {
    const hechas: string[] = []
    for (let i = 0; i < 10; i++) {
      const [a, b] = operaciones()!.match(/\d+/g)!.map(Number)
      hechas.push(`${a}+${b}`)
      const resultado = String(a + b).padStart(2, '0')
      await user.click(screen.getByRole('button', { name: resultado[1] }))
      await user.click(screen.getByRole('button', { name: resultado[0] }))
      await user.click(screen.getByRole('button', { name: 'Comprobar' }))
      await user.click(screen.getByRole('button', { name: /Siguiente|Terminar/ }))
    }
    return hechas
  }

  it('la sesión tiene 10 ejercicios y no cambia mientras se contesta', async () => {
    render(<Practice topic={temaGenerado} onHome={vi.fn()} onBack={vi.fn()} rng={mulberry32(7)} />)
    const user = userEvent.setup()
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
    const primera = operaciones()
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Unidades' }))
    expect(operaciones()).toBe(primera)
  })

  it('Repetir empieza otra sesión con ejercicios distintos', async () => {
    render(<Practice topic={temaGenerado} onHome={vi.fn()} onBack={vi.fn()} rng={mulberry32(7)} />)
    const user = userEvent.setup()
    const primera = await resolverSesion(user)
    expect(new Set(primera).size).toBe(10)
    await user.click(screen.getByRole('button', { name: /Repetir/ }))
    const segunda = await resolverSesion(user)
    expect(new Set(segunda).size).toBe(10)
    expect(segunda.filter((operacion) => primera.includes(operacion))).toEqual([])
  }, 30000)
})
