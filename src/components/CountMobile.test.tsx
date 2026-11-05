import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import type { CountMobileData } from '../types'
import { CountMobile } from './CountMobile'

const datos: CountMobileData = {
  items: [
    { color: 'rojo', big: true },
    { color: 'rojo', big: false },
    { color: 'azul', big: true },
    { color: 'verde', big: false },
  ],
}

describe('CountMobile: el móvil de círculos de colores y tamaños', () => {
  it('es una imagen con un círculo por pieza, cada uno con su color y su tamaño como nombre', () => {
    render(<CountMobile data={datos} />)
    const movil = screen.getByRole('img', { name: /móvil/i })
    const piezas = within(movil).getAllByRole('img')
    expect(piezas.map((p) => p.getAttribute('aria-label'))).toEqual(['círculo rojo grande', 'círculo rojo pequeño', 'círculo azul grande', 'círculo verde pequeño'])
  })

  it('dibuja los grandes y los pequeños con tamaños distintos', () => {
    render(<CountMobile data={datos} />)
    expect(screen.getAllByRole('img', { name: /grande/ })[0]).toHaveClass('count-big')
    expect(screen.getAllByRole('img', { name: /pequeño/ })[0]).toHaveClass('count-small')
    const tamano = (clase: string) => Number(new RegExp(String.raw`\.${clase}\s*\{[^}]*font-size:\s*([\d.]+)rem`).exec(css)?.[1])
    expect(tamano('count-big')).toBeGreaterThan(tamano('count-small') * 1.5)
  })
})
