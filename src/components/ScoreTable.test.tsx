import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import type { ScoreTableData } from '../types'
import { ScoreTable } from './ScoreTable'

const datos: ScoreTableData = {
  columns: ['1ª partida', '2ª partida', 'Total'],
  players: [
    { emoji: '🦊', name: 'zorro', values: [52, null, 97] },
    { emoji: '🐻', name: 'oso', values: [41, 55, 96] },
    { emoji: '🐧', name: 'pingüino', values: [53, 42, 95] },
  ],
}

describe('ScoreTable: la tabla de puntos de tres jugadores', () => {
  it('es una tabla con cabeceras de partida y un jugador por fila, con el nombre del animal', () => {
    render(<ScoreTable data={datos} />)
    const tabla = screen.getByRole('table', { name: /puntos/i })
    for (const c of datos.columns) expect(within(tabla).getByRole('columnheader', { name: c })).toBeInTheDocument()
    const filas = within(tabla).getAllByRole('row')
    expect(filas).toHaveLength(4)
    expect(within(filas[1]).getByRole('rowheader')).toHaveTextContent('🦊')
    expect(within(filas[1]).getByRole('img', { name: 'zorro' })).toBeInTheDocument()
    expect(within(filas[2]).getByRole('img', { name: 'oso' })).toBeInTheDocument()
  })

  it('enseña los puntos de cada casilla y el hueco como ❓', () => {
    render(<ScoreTable data={datos} />)
    const tabla = screen.getByRole('table')
    expect(within(tabla).getAllByRole('cell').map((c) => c.textContent)).toEqual(['52', '❓', '97', '41', '55', '96', '53', '42', '95'])
  })

  it('con `fill` el hueco se rellena con ese número', () => {
    render(<ScoreTable data={datos} fill={45} />)
    const tabla = screen.getByRole('table')
    expect(within(tabla).queryByText('❓')).not.toBeInTheDocument()
    expect(within(tabla).getAllByRole('cell')[1]).toHaveTextContent('45')
  })

  it('tiene estilos propios', () => {
    expect(css).toMatch(/\.score-table\s*\{/)
  })
})
