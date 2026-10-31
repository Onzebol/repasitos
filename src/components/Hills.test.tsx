import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import { Hills } from './Hills'

// Cuerpo de la regla CSS de un selector
const regla = (selector: string) => {
  const inicio = css.indexOf(`\n${selector} {`)
  return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
}

describe('Hills: el fondo no cambia con el scroll', () => {
  it('es un dibujo decorativo, oculto para los lectores de pantalla', () => {
    const { container } = render(<Hills />)
    expect(container.querySelector('svg.hills')).toHaveAttribute('aria-hidden', 'true')
  })

  it('las colinas van fijas a la ventana, no a la página, para que no se muevan ni se estiren al hacer scroll', () => {
    expect(regla('.hills')).toMatch(/position:\s*fixed/)
  })

  it('su altura es una parte de la ventana (svh) y no un porcentaje del contenido, que crece con el scroll', () => {
    const estilos = regla('.hills')
    expect(estilos).toMatch(/height:\s*\d+svh/)
    expect(estilos).not.toMatch(/height:\s*\d+%/)
  })

  it('están pegadas abajo y no tapan los toques sobre el contenido', () => {
    const estilos = regla('.hills')
    expect(estilos).toMatch(/bottom:\s*0/)
    expect(estilos).toMatch(/pointer-events:\s*none/)
  })
})
