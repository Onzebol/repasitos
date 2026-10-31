import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import { TopBar } from './TopBar'

// Cuerpo de la regla CSS de un selector
const regla = (selector: string) => {
  const inicio = css.indexOf(`\n${selector} {`)
  return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
}

// jsdom no calcula tamaños: se simulan los de la barra y del título
function simularAnchos({ barra, titulo, lado }: { barra: number; titulo: number; lado: number }) {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(barra)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return this.classList.contains('topbar-measure') ? titulo : lado
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('TopBar', () => {
  it('inicio y volver a la izquierda, sonido a la derecha y el título entre medias', () => {
    render(<TopBar title="Matemáticas · Unidad 1" prompt="hola" onHome={vi.fn()} onBack={vi.fn()} />)
    const izquierda = screen.getByRole('group', { name: 'Navegación' })
    expect(within(izquierda).getByRole('button', { name: 'Volver al inicio' })).toBeInTheDocument()
    expect(within(izquierda).getByRole('button', { name: 'Volver atrás' })).toBeInTheDocument()
    const titulo = screen.getByRole('heading', { name: 'Matemáticas · Unidad 1' })
    const sonido = screen.getByRole('button', { name: 'Escuchar' })
    expect(izquierda.compareDocumentPosition(titulo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(titulo.compareDocumentPosition(sonido) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('sin botón de volver ni título sigue mostrando inicio y sonido', () => {
    render(<TopBar prompt="hola" onHome={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Volver atrás' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Escuchar' })).toBeInTheDocument()
  })

  it('si el título cabe entre los botones se queda en medio', () => {
    simularAnchos({ barra: 1000, titulo: 300, lado: 150 })
    render(<TopBar title="Matemáticas" prompt="hola" onHome={vi.fn()} />)
    expect(screen.getByRole('banner')).toHaveAttribute('data-stacked', 'false')
  })

  it('si no cabe pasa a una segunda línea', () => {
    simularAnchos({ barra: 400, titulo: 300, lado: 150 })
    render(<TopBar title="Matemáticas · Unidad 1 · Decenas y unidades" prompt="hola" onHome={vi.fn()} />)
    expect(screen.getByRole('banner')).toHaveAttribute('data-stacked', 'true')
  })
})

describe('estilos de la barra superior', () => {
  it('los botones redondos no se encogen y se mantienen cuadrados', () => {
    const estilos = regla('.round-button')
    expect(estilos).toMatch(/flex:\s*none|flex-shrink:\s*0/)
    expect(estilos).toMatch(/aspect-ratio:\s*1/)
  })

  it('el icono queda centrado en el botón (sin espacio de línea del emoji)', () => {
    expect(regla('.round-button')).toMatch(/place-items:\s*center/)
    expect(regla('.round-button')).toMatch(/padding:\s*0/)
    expect(regla('.round-button span')).toMatch(/line-height:\s*1/)
  })

  it('los lados miden lo que ocupan sus botones (no se estiran) para poder volver a subir el título', () => {
    expect(regla('.topbar-left')).toMatch(/justify-self:\s*start/)
    expect(regla('.topbar-right')).toMatch(/justify-self:\s*end/)
  })

  it('el título va siempre centrado', () => {
    expect(regla('.topbar-title')).toMatch(/text-align:\s*center/)
  })

  it('apilado, el título ocupa una fila entera debajo de los botones', () => {
    expect(regla('.topbar[data-stacked="true"] .topbar-title')).toMatch(/grid-area:\s*title/)
  })
})
