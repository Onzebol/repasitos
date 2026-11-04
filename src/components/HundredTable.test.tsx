import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import { HundredTable } from './HundredTable'

const tabla = () => screen.getByRole('img', { name: /Tabla del 0 al 99/ })

describe('HundredTable: la tabla del 0 al 99', () => {
  it('es una imagen con nombre accesible y sin revelar qué fila, columna o número es', () => {
    render(<HundredTable row={4} col={7} hole={47} />)
    const nombre = tabla().getAttribute('aria-label')!
    // salvo el «0 al 99» del título, ninguna cifra: ni la fila 4, ni la columna 7, ni el 47
    expect(nombre.replace('0 al 99', '')).not.toMatch(/\d/)
    expect(nombre).toMatch(/fila/)
    expect(nombre).toMatch(/columna/)
    expect(nombre).toMatch(/falta/)
  })

  it('muestra los cien números con dos cifras y las cabeceras de decenas y unidades', () => {
    render(<HundredTable />)
    const celdas = within(tabla()).getAllByText(/^\d\d$/)
    expect(celdas).toHaveLength(100)
    expect(celdas[0]).toHaveTextContent('00')
    expect(celdas[99]).toHaveTextContent('99')
    for (let i = 0; i < 10; i++) {
      expect(within(tabla()).getByText(`${i}D`)).toBeInTheDocument()
      expect(within(tabla()).getByText(`${i}U`)).toBeInTheDocument()
    }
  })

  it('marca la fila y la columna, también en sus cabeceras', () => {
    render(<HundredTable row={2} col={5} />)
    for (const n of ['20', '21', '25', '29']) expect(within(tabla()).getByText(n)).toHaveClass('fila')
    for (const n of ['05', '15', '25', '95']) expect(within(tabla()).getByText(n)).toHaveClass('col')
    expect(within(tabla()).getByText('2D')).toHaveClass('fila')
    expect(within(tabla()).getByText('5U')).toHaveClass('col')
    expect(within(tabla()).getByText('34')).not.toHaveClass('fila')
    expect(within(tabla()).getByText('34')).not.toHaveClass('col')
  })

  it('el número que falta se sustituye por ❓ y no se ve', () => {
    render(<HundredTable hole={47} />)
    expect(within(tabla()).queryByText('47')).not.toBeInTheDocument()
    expect(within(tabla()).getByText('❓')).toBeInTheDocument()
    expect(within(tabla()).getAllByText(/^\d\d$/)).toHaveLength(99)
  })

  it('sin marcas no hay fila, columna ni hueco', () => {
    render(<HundredTable />)
    expect(within(tabla()).queryByText('❓')).not.toBeInTheDocument()
    expect(tabla().querySelectorAll('.fila, .col')).toHaveLength(0)
  })

  it('tiene estilos: cuadrícula de 11 columnas y colores para la fila y la columna', () => {
    expect(css).toMatch(/\.t99\s*\{[^}]*grid-template-columns:[^;}]*repeat\(10/)
    expect(css).toMatch(/\.t99 \.c\.fila\s*\{/)
    expect(css).toMatch(/\.t99 \.c\.col\s*\{/)
    expect(css).toMatch(/\.t99 \.c\.hueco\s*\{/)
  })

  describe('del 100 al 199 (from={100})', () => {
    const tabla100 = () => screen.getByRole('img', { name: /Tabla del 100 al 199/ })

    it('muestra los cien números con tres cifras y las cabeceras de decenas 10D… 19D', () => {
      render(<HundredTable from={100} />)
      const celdas = within(tabla100()).getAllByText(/^\d\d\d$/)
      expect(celdas).toHaveLength(100)
      expect(celdas[0]).toHaveTextContent('100')
      expect(celdas[37]).toHaveTextContent('137')
      expect(celdas[99]).toHaveTextContent('199')
      for (let i = 0; i < 10; i++) {
        expect(within(tabla100()).getByText(`${10 + i}D`)).toBeInTheDocument()
        expect(within(tabla100()).getByText(`${i}U`)).toBeInTheDocument()
      }
      expect(within(tabla100()).queryByText('0D')).not.toBeInTheDocument()
    })

    it('la fila y la columna se cuentan desde la tabla (0 a 9) y se marcan con sus cabeceras', () => {
      render(<HundredTable from={100} row={3} col={5} />)
      for (const n of ['130', '135', '139']) expect(within(tabla100()).getByText(n)).toHaveClass('fila')
      for (const n of ['105', '145', '195']) expect(within(tabla100()).getByText(n)).toHaveClass('col')
      expect(within(tabla100()).getByText('13D')).toHaveClass('fila')
      expect(within(tabla100()).getByText('5U')).toHaveClass('col')
    })

    it('el hueco es el número completo (147) y no se ve; el nombre accesible no dice cuál es', () => {
      render(<HundredTable from={100} row={4} col={7} hole={147} />)
      expect(within(tabla100()).queryByText('147')).not.toBeInTheDocument()
      expect(within(tabla100()).getByText('❓')).toBeInTheDocument()
      expect(within(tabla100()).getAllByText(/^\d\d\d$/)).toHaveLength(99)
      expect(tabla100().getAttribute('aria-label')!.replace('100 al 199', '')).not.toMatch(/\d/)
    })

    it('usa casillas más estrechas para caber con tres cifras', () => {
      expect(css).toMatch(/\.t99-ciento\b/)
    })
  })
})
