import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import type { CodeTableData } from '../types'
import { CodeTable } from './CodeTable'

const datos: CodeTableData = {
  columns: ['Sábado', 'Domingo'],
  rows: ['Mañana', 'Tarde'],
  cells: [
    ['🏃', '🎮'],
    ['📚', '🎨'],
  ],
  legend: [
    { emoji: '🏃', name: 'correr', number: 3 },
    { emoji: '🎮', name: 'jugar', number: 1 },
    { emoji: '📚', name: 'leer', number: 4 },
    { emoji: '🎨', name: 'pintar', number: 2 },
  ],
}

describe('CodeTable: la tabla de actividades con un número cada una', () => {
  it('es una tabla de verdad, con cabeceras de día y de momento del día', () => {
    render(<CodeTable data={datos} />)
    const tabla = screen.getByRole('table', { name: /actividades/i })
    expect(within(tabla).getByRole('columnheader', { name: 'Sábado' })).toBeInTheDocument()
    expect(within(tabla).getByRole('columnheader', { name: 'Domingo' })).toBeInTheDocument()
    expect(within(tabla).getByRole('rowheader', { name: 'Mañana' })).toBeInTheDocument()
    expect(within(tabla).getByRole('rowheader', { name: 'Tarde' })).toBeInTheDocument()
    expect(within(tabla).getAllByRole('cell')).toHaveLength(4)
  })

  it('cada casilla tiene su actividad con un nombre accesible, en su fila y su columna', () => {
    render(<CodeTable data={datos} />)
    const filas = within(screen.getByRole('table')).getAllByRole('row')
    // cabecera + dos filas
    expect(filas).toHaveLength(3)
    expect(within(filas[1]).getAllByRole('img').map((i) => i.getAttribute('aria-label'))).toEqual(['correr', 'jugar'])
    expect(within(filas[2]).getAllByRole('img').map((i) => i.getAttribute('aria-label'))).toEqual(['leer', 'pintar'])
    expect(within(filas[1]).getAllByRole('img')[0]).toHaveTextContent('🏃')
  })

  it('la leyenda dice el número de cada actividad, de menor a mayor', () => {
    render(<CodeTable data={datos} />)
    const leyenda = screen.getByRole('list', { name: /número de cada actividad/i })
    const elementos = within(leyenda).getAllByRole('listitem')
    expect(elementos.map((li) => li.textContent)).toEqual(['🎮 = 1', '🎨 = 2', '🏃 = 3', '📚 = 4'])
    expect(within(elementos[0]).getByRole('img', { name: 'jugar' })).toBeInTheDocument()
  })

  it('tiene estilos propios', () => {
    expect(css).toMatch(/\.code-table\s*\{/)
    expect(css).toMatch(/\.code-legend\s*\{/)
  })
})
