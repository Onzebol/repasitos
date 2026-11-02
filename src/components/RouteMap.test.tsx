import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import type { RouteMapData } from '../types'
import { RouteMap } from './RouteMap'

const celdas = [
  ['🌳', '', '🌲', '🌳', ''],
  ['', '🌷', '', '🏪', '🏫'],
  ['', '', '', '⛲', ''],
  ['', '', '', '', ''],
]
const camino: [number, number][] = [
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [1, 3],
  [1, 4],
]
const mapa: RouteMapData = { cells: celdas, start: [2, 0] }

const casillas = (container: HTMLElement) => [...container.querySelectorAll('.rm-cell')]

describe('RouteMap: el mapa de un itinerario', () => {
  it('es una imagen con nombre accesible que no cuenta el camino y dibuja 4 × 5 casillas', () => {
    const { container } = render(<RouteMap map={mapa} />)
    expect(screen.getByRole('img', { name: 'Mapa con Repi' })).toBeInTheDocument()
    expect(casillas(container)).toHaveLength(20)
  })

  it('pone a Repi en la casilla de salida y los dibujos de lugares y adornos en las suyas', () => {
    const { container } = render(<RouteMap map={mapa} />)
    const todas = casillas(container)
    expect(todas[2 * 5 + 0]).toHaveTextContent('🦊')
    expect(screen.getAllByText('🦊')).toHaveLength(1)
    expect(todas[1 * 5 + 4]).toHaveTextContent('🏫')
    expect(todas[2 * 5 + 3]).toHaveTextContent('⛲')
  })

  it('sin camino, ninguna casilla es de arena ni lleva flecha', () => {
    const { container } = render(<RouteMap map={mapa} />)
    expect(container.querySelectorAll('.camino')).toHaveLength(0)
    expect(container.querySelectorAll('svg')).toHaveLength(0)
  })

  it('con camino, tiñe sus casillas de arena', () => {
    const { container } = render(<RouteMap map={{ ...mapa, path: camino }} />)
    expect(container.querySelectorAll('.camino')).toHaveLength(6)
    expect(casillas(container)[1 * 5 + 4]).toHaveClass('camino')
    expect(casillas(container)[0]).not.toHaveClass('camino')
    expect(screen.getByRole('img', { name: 'Mapa con Repi y un camino' })).toBeInTheDocument()
  })

  it('con `arrows`, cada casilla del camino menos la última lleva una flecha hacia la siguiente', () => {
    const { container } = render(<RouteMap map={{ ...mapa, path: camino, arrows: true }} />)
    const flechas = [...container.querySelectorAll('svg')].map((svg) => svg.getAttribute('data-direction'))
    // en el orden en que están las casillas en el mapa (por filas): la de la fila 1 y luego las de la fila 2
    expect(flechas).toEqual(['right', 'right', 'right', 'right', 'up'])
    const ultima = within(casillas(container)[1 * 5 + 4] as HTMLElement)
    expect(ultima.queryByRole('img')).not.toBeInTheDocument()
    expect(casillas(container)[1 * 5 + 4].querySelector('svg')).toBeNull()
  })

  it('tiene estilos: cuadrícula de 5 columnas, casillas de arena y flechas', () => {
    expect(css).toMatch(/\.route-map\s*\{[^}]*grid-template-columns:[^;}]*repeat\(var\(--cols, 5\)/)
    expect(css).toMatch(/\.rm-cell\.camino\s*\{/)
    expect(css).toMatch(/\.rm-arrow\s*\{/)
  })
})
