import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import { topicFrom } from '../test/topics'
import type { Exercise } from '../types'
import { Practice } from './Practice'

// «Toca los números que tienen 2 unidades»: el 02, 12, 22… 92
const unidades: Exercise = {
  type: 'table-paint',
  question: 'Toca los números que tienen 2 unidades',
  targets: [2, 12, 22, 32, 42, 52, 62, 72, 82, 92],
  answer: 'Acaban en 2',
}
// «Toca el número que tiene 2 decenas y 2 unidades»: solo el 22
const las2: Exercise = { type: 'table-paint', question: 'Toca el número que tiene 2 decenas y 2 unidades', targets: [22], answer: '22' }

const abrir = (exercise: Exercise) => {
  render(<Practice topic={topicFrom([exercise], 'Tabla')} onHome={vi.fn()} onBack={vi.fn()} />)
  return userEvent.setup()
}

const tabla = () => screen.getByRole('group', { name: 'Tabla del 0 al 99' })
const casilla = (numero: string) => within(tabla()).getByRole('button', { name: numero })
const comprobar = () => screen.getByRole('button', { name: 'Comprobar' })

const tocar = async (user: ReturnType<typeof userEvent.setup>, numeros: string[]) => {
  for (const n of numeros) await user.click(casilla(n))
}

const DIEZ = ['02', '12', '22', '32', '42', '52', '62', '72', '82', '92']

describe('TablePaint: colorear tocando en la tabla del 0 al 99', () => {
  it('muestra los cien números como botones con el número como nombre, ninguno marcado, y Comprobar desactivado', () => {
    abrir(unidades)
    const botones = within(tabla()).getAllByRole('button')
    expect(botones).toHaveLength(100)
    expect(botones[0]).toHaveAccessibleName('00')
    expect(botones[99]).toHaveAccessibleName('99')
    for (const boton of botones) expect(boton).toHaveAttribute('aria-pressed', 'false')
    expect(comprobar()).toBeDisabled()
  })

  it('tocar marca la casilla y volver a tocar la desmarca; con alguna marcada se puede comprobar', async () => {
    const user = abrir(unidades)
    await user.click(casilla('27'))
    expect(casilla('27')).toHaveAttribute('aria-pressed', 'true')
    expect(comprobar()).toBeEnabled()
    await user.click(casilla('27'))
    expect(casilla('27')).toHaveAttribute('aria-pressed', 'false')
    expect(comprobar()).toBeDisabled()
  })

  it('al marcar exactamente las que cumplen la condición anima y enseña la tabla con ellas marcadas', async () => {
    const user = abrir(unidades)
    await tocar(user, DIEZ)
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    // la tabla se queda: sin botones y con las diez marcadas
    expect(within(tabla()).queryAllByRole('button')).toHaveLength(0)
    expect(tabla().querySelectorAll('.sel')).toHaveLength(10)
  })

  it('si falta alguna, anima sin decir cuál, deja la selección como estaba y se puede corregir', async () => {
    const user = abrir(unidades)
    await tocar(user, DIEZ.slice(0, 9))
    await user.click(comprobar())
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(screen.queryByText('¡Muy bien!')).not.toBeInTheDocument()
    for (const n of DIEZ.slice(0, 9)) expect(casilla(n)).toHaveAttribute('aria-pressed', 'true')
    expect(casilla('92')).toHaveAttribute('aria-pressed', 'false')
    await user.click(casilla('92'))
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('si sobra alguna también falla, sin quitar las marcadas', async () => {
    const user = abrir(unidades)
    await tocar(user, [...DIEZ, '55'])
    await user.click(comprobar())
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(casilla('55')).toHaveAttribute('aria-pressed', 'true')
    await user.click(casilla('55'))
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('con «2 decenas y 2 unidades» solo vale una casilla, el 22', async () => {
    const user = abrir(las2)
    await tocar(user, ['02'])
    await user.click(comprobar())
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    await user.click(casilla('02'))
    await user.click(casilla('22'))
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('tiene estilos: casillas marcadas y casillas más altas para el dedo', () => {
    expect(css).toMatch(/\.t99 \.c\.sel\s*\{/)
    expect(css).toMatch(/\.t99-pintar \.c,/)
  })
})
