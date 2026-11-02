import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import { topicFrom } from '../test/topics'
import type { Exercise } from '../types'
import { Practice } from './Practice'

// Fila de las 4 decenas (40 a 49): se escriben el 42, 43, 45, 47 y 48 y los otros cinco vienen dados
const fila: Exercise = { type: 'table-fill', question: 'Completa la fila amarilla', line: 'row', index: 4, blanks: [2, 3, 5, 7, 8], answer: '40 a 49' }
// Columna de las 2 unidades (02, 12… 92): se escriben el 12, 32, 42, 62 y 92 y el 02, 22, 52, 72 y 82 vienen dados
const columna: Exercise = { type: 'table-fill', question: 'Completa la columna naranja', line: 'column', index: 2, blanks: [1, 3, 4, 6, 9], answer: '02 a 92' }

const abrir = (exercise: Exercise) => {
  render(<Practice topic={topicFrom([exercise], 'Tabla')} onHome={vi.fn()} onBack={vi.fn()} />)
  return userEvent.setup()
}

const teclas = async (user: ReturnType<typeof userEvent.setup>, cifras: string) => {
  for (const cifra of cifras) await user.click(screen.getByRole('button', { name: cifra }))
}

const hueco = (nombre: string) => screen.getByRole('button', { name: nombre })
const comprobar = () => screen.getByRole('button', { name: 'Comprobar' })

describe('TableFill: completar una fila o una columna de la tabla del 0 al 99', () => {
  it('muestra solo la fila, con sus cabeceras, los números dados y cinco huecos sin respuesta', () => {
    abrir(fila)
    const tira = screen.getByRole('group', { name: 'Fila de las 4 decenas' })
    for (let u = 0; u < 10; u++) expect(within(tira).getByText(`${u}U`)).toBeInTheDocument()
    expect(within(tira).getByText('4D')).toBeInTheDocument()
    for (const dado of ['40', '41', '44', '46', '49']) expect(within(tira).getByText(dado)).toBeInTheDocument()
    expect(within(tira).getAllByRole('button')).toHaveLength(5)
    for (const hueco of within(tira).getAllByRole('button')) expect(hueco).toHaveTextContent('?')
    // no se ve la tabla entera: solo esta fila
    expect(within(tira).queryByText('50')).not.toBeInTheDocument()
  })

  it('en una columna las cabeceras son las decenas y la de la izquierda es la unidad', () => {
    abrir(columna)
    const tira = screen.getByRole('group', { name: 'Columna de las 2 unidades' })
    for (let d = 0; d < 10; d++) expect(within(tira).getByText(`${d}D`)).toBeInTheDocument()
    expect(within(tira).getByText('2U')).toBeInTheDocument()
    for (const dado of ['02', '22', '52', '72', '82']) expect(within(tira).getByText(dado)).toBeInTheDocument()
    expect(within(tira).getAllByRole('button')).toHaveLength(5)
  })

  it('los huecos se nombran por su sitio: decenas y unidades', () => {
    abrir(fila)
    expect(hueco('Decenas 4, unidades 2')).toBeInTheDocument()
    expect(hueco('Decenas 4, unidades 8')).toBeInTheDocument()
  })

  it('escribe de dos en dos cifras y pasa solo al siguiente hueco', async () => {
    const user = abrir(fila)
    expect(hueco('Decenas 4, unidades 2')).toHaveAttribute('aria-pressed', 'true')
    await teclas(user, '4')
    expect(hueco('Decenas 4, unidades 2')).toHaveTextContent('4')
    await teclas(user, '2')
    expect(hueco('Decenas 4, unidades 2')).toHaveTextContent('42')
    expect(hueco('Decenas 4, unidades 3')).toHaveAttribute('aria-pressed', 'true')
    expect(hueco('Decenas 4, unidades 2')).toHaveAttribute('aria-pressed', 'false')
  })

  it('se puede tocar otro hueco para escribir en él, y Borrar quita la última cifra', async () => {
    const user = abrir(fila)
    await user.click(hueco('Decenas 4, unidades 7'))
    await teclas(user, '4')
    expect(hueco('Decenas 4, unidades 7')).toHaveTextContent('4')
    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(hueco('Decenas 4, unidades 7')).toHaveTextContent('?')
  })

  it('Comprobar está desactivado hasta rellenar los cinco huecos con dos cifras', async () => {
    const user = abrir(fila)
    expect(comprobar()).toBeDisabled()
    await teclas(user, '42434547')
    expect(comprobar()).toBeDisabled()
    await teclas(user, '4')
    expect(comprobar()).toBeDisabled()
    await teclas(user, '8')
    expect(comprobar()).toBeEnabled()
  })

  it('al acertar anima y deja ver la fila completa', async () => {
    const user = abrir(fila)
    await teclas(user, '4243454748')
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    const tira = screen.getByRole('group', { name: 'Fila de las 4 decenas' })
    for (let u = 0; u < 10; u++) expect(within(tira).getByText(`4${u}`)).toBeInTheDocument()
    expect(within(tira).queryByText('?')).not.toBeInTheDocument()
  })

  it('al fallar anima, vacía solo los huecos equivocados y deja volver a intentarlo', async () => {
    const user = abrir(fila)
    await teclas(user, '4243454799') // el último (48) está mal
    await user.click(comprobar())
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(screen.queryByText('¡Muy bien!')).not.toBeInTheDocument()
    expect(hueco('Decenas 4, unidades 2')).toHaveTextContent('42')
    expect(hueco('Decenas 4, unidades 7')).toHaveTextContent('47')
    expect(hueco('Decenas 4, unidades 8')).toHaveTextContent('?')
    expect(hueco('Decenas 4, unidades 8')).toHaveAttribute('aria-pressed', 'true')
    await teclas(user, '48')
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('una columna se completa igual', async () => {
    const user = abrir(columna)
    await teclas(user, '1232426292')
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('tiene estilos para los huecos activos y para los botones de la tabla', () => {
    expect(css).toMatch(/\.t99 \.c\.activo\s*\{/)
    expect(css).toMatch(/\.t99 button\.c\s*\{/)
  })
})
