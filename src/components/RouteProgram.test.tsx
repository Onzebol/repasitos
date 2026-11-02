import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import type { RouteProgramExercise } from '../types'
import { RouteProgram } from './RouteProgram'

// Repi sale de la casilla [2, 0]; la meta (el colegio) está en [1, 4]; hay árboles en [0, 0], [0, 2] y [0, 3]
const ejercicio: RouteProgramExercise = {
  type: 'route-program',
  question: 'Programa a Repi para que llegue al colegio',
  route: {
    cells: [
      ['🌳', '', '🌲', '🌳', ''],
      ['', '🌷', '', '🏪', '🏫'],
      ['', '', '', '⛲', ''],
      ['', '', '', '', ''],
    ],
    start: [2, 0],
  },
  goal: [1, 4],
  answer: '3> 1^ 1>',
}

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const abrir = () => {
  const onResult = vi.fn()
  render(<RouteProgram exercise={ejercicio} onResult={onResult} />)
  return { onResult, user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }) }
}

type Usuario = ReturnType<typeof userEvent.setup>
const flecha = (hacia: 'arriba' | 'abajo' | 'izquierda' | 'derecha') => screen.getByRole('button', { name: `Flecha ${hacia}` })
const ir = () => screen.getByRole('button', { name: '¡Ir!' })
const borrar = () => screen.getByRole('button', { name: 'Borrar el último paso' })
const programa = (nombre: string) => screen.getByRole('img', { name: nombre })
// Casilla del mapa (fila * 5 + columna) en la que está Repi
const casillaDeRepi = () => [...document.querySelectorAll('.rm-cell')].findIndex((c) => c.textContent?.includes('🦊'))
const esperar = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms) })

const pulsar = async (user: Usuario, ...direcciones: ('arriba' | 'abajo' | 'izquierda' | 'derecha')[]) => {
  for (const d of direcciones) await user.click(flecha(d))
}

describe('RouteProgram: programar a Repi con flechas', () => {
  it('empieza con el programa vacío, Repi en la salida y ¡Ir! desactivado', () => {
    abrir()
    expect(programa('Programa vacío')).toBeInTheDocument()
    expect(casillaDeRepi()).toBe(2 * 5 + 0)
    expect(ir()).toBeDisabled()
    expect(screen.getByRole('img', { name: 'Mapa con Repi' })).toBeInTheDocument()
    for (const d of ['arriba', 'abajo', 'izquierda', 'derecha'] as const) expect(flecha(d)).toBeEnabled()
  })

  it('los pasos seguidos en la misma dirección se juntan en uno', async () => {
    const { user } = abrir()
    await pulsar(user, 'derecha', 'derecha', 'derecha', 'arriba', 'derecha')
    expect(programa('Programa: 3 pasos a la derecha, 1 paso hacia arriba y 1 paso a la derecha')).toBeInTheDocument()
    expect(ir()).toBeEnabled()
  })

  it('«Borrar el último paso» quita de uno en uno hasta dejar el programa vacío', async () => {
    const { user } = abrir()
    await pulsar(user, 'derecha', 'derecha', 'arriba')
    await user.click(borrar())
    expect(programa('Programa: 2 pasos a la derecha')).toBeInTheDocument()
    await user.click(borrar())
    expect(programa('Programa: 1 paso a la derecha')).toBeInTheDocument()
    await user.click(borrar())
    expect(programa('Programa vacío')).toBeInTheDocument()
    expect(ir()).toBeDisabled()
  })

  it('el programa tiene un máximo de 12 pasos', async () => {
    const { user } = abrir()
    for (let i = 0; i < 14; i++) await pulsar(user, 'derecha')
    expect(programa('Programa: 12 pasos a la derecha')).toBeInTheDocument()
  })

  it('al pulsar ¡Ir! Repi se mueve casilla a casilla, los botones se desactivan y al llegar a la meta se avisa', async () => {
    const { user, onResult } = abrir()
    await pulsar(user, 'derecha', 'derecha', 'derecha', 'arriba', 'derecha')
    await user.click(ir())
    expect(ir()).toBeDisabled()
    expect(flecha('derecha')).toBeDisabled()
    expect(borrar()).toBeDisabled()
    await esperar(400)
    expect(casillaDeRepi()).toBe(2 * 5 + 1)
    expect(onResult).not.toHaveBeenCalled()
    await esperar(3000)
    expect(casillaDeRepi()).toBe(1 * 5 + 4)
    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith(true, '3> 1^ 1>')
  })

  it('vale otro camino que llegue a la meta', async () => {
    const { user, onResult } = abrir()
    await pulsar(user, 'arriba', 'derecha', 'derecha', 'derecha', 'derecha')
    await user.click(ir())
    await esperar(5000)
    expect(onResult).toHaveBeenCalledWith(true, '1^ 4>')
  })

  it('un árbol para a Repi justo antes de él, sin penalizar, y al tocar el programa vuelve a la salida', async () => {
    const { user, onResult } = abrir()
    await pulsar(user, 'arriba', 'arriba')
    await user.click(ir())
    await esperar(3000)
    expect(casillaDeRepi()).toBe(1 * 5 + 0) // el árbol está en [0, 0]
    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith(false, '2^')
    // el programa se conserva y los botones vuelven a funcionar
    expect(programa('Programa: 2 pasos hacia arriba')).toBeInTheDocument()
    expect(ir()).toBeEnabled()
    await pulsar(user, 'derecha')
    expect(casillaDeRepi()).toBe(2 * 5 + 0)
    expect(programa('Programa: 2 pasos hacia arriba y 1 paso a la derecha')).toBeInTheDocument()
  })

  it('salirse del mapa para a Repi y se avisa de que no ha llegado', async () => {
    const { user, onResult } = abrir()
    await pulsar(user, 'izquierda')
    await user.click(ir())
    await esperar(3000)
    expect(casillaDeRepi()).toBe(2 * 5 + 0)
    expect(onResult).toHaveBeenCalledWith(false, '1<')
  })

  it('si Repi acaba en otra casilla, tampoco ha llegado', async () => {
    const { user, onResult } = abrir()
    await pulsar(user, 'derecha')
    await user.click(ir())
    await esperar(3000)
    expect(casillaDeRepi()).toBe(2 * 5 + 1)
    expect(onResult).toHaveBeenCalledWith(false, '1>')
  })

  it('con «reducir movimiento» no hay animación: Repi llega de golpe', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('prefers-reduced-motion'), media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    const { user, onResult } = abrir()
    await pulsar(user, 'derecha', 'derecha', 'derecha', 'arriba', 'derecha')
    await user.click(ir())
    expect(casillaDeRepi()).toBe(1 * 5 + 4)
    expect(onResult).toHaveBeenCalledWith(true, '3> 1^ 1>')
  })

  it('tiene estilos: la paleta de flechas y la ficha vacía del programa', () => {
    expect(css).toMatch(/\.palette\s*\{/)
    expect(css).toMatch(/\.step\.step-empty\s*\{/)
  })
})
