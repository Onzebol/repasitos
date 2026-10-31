import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import { MARGIN, TRAZOS, VIEWBOX } from '../infantil/trazos'
import type { Digit, Stroke } from '../infantil/trazos'
import { speak } from '../speak'
import { resample } from '../trace'
import { TraceExercise } from './TraceExercise'

vi.mock('../speak', () => ({ speak: vi.fn() }))

// Cuerpo de la regla CSS de un selector
const regla = (selector: string) => {
  const inicio = css.indexOf(`\n${selector} {`)
  return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
}

// jsdom no calcula tamaños: el dibujo ocupa justo su cuadro visible, así que la pantalla es el dibujo más el margen
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: VIEWBOX.width,
    bottom: VIEWBOX.height,
    width: VIEWBOX.width,
    height: VIEWBOX.height,
    toJSON: () => ({}),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.mocked(speak).mockClear()
})

const superficie = () => screen.getByRole('img', { name: /Repasa el número/ })

// Mueve el dedo por un trazo: pulsa, recorre los puntos y suelta
function dibujar(trazo: Stroke, paso = 2) {
  const puntos = resample(trazo, paso).map(([x, y]) => ({ clientX: x + MARGIN, clientY: y + MARGIN }))
  const [primero, ...resto] = puntos
  fireEvent.pointerDown(superficie(), { ...primero, pointerId: 1 })
  for (const punto of resto) fireEvent.pointerMove(superficie(), { ...punto, pointerId: 1 })
  fireEvent.pointerUp(superficie(), { ...puntos.at(-1), pointerId: 1 })
}

const abrir = (digit: Digit) => {
  const onDone = vi.fn()
  render(<TraceExercise digit={digit} onDone={onDone} />)
  return { onDone }
}

describe('TraceExercise: repasar la cifra con el dedo', () => {
  it('muestra la cifra para repasar con una descripción para los lectores de pantalla', () => {
    abrir(4)
    expect(screen.getByRole('img', { name: 'Repasa el número 4 con el dedo' })).toBeInTheDocument()
  })

  it('al repasar la cifra siguiendo el recorrido la da por hecha, una sola vez, y la dice en voz alta', () => {
    const { onDone } = abrir(7)
    for (const trazo of TRAZOS[7]) dibujar(trazo)
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledWith('7')
  })

  it('una cifra de dos trazos se completa con los dos, en orden', () => {
    const { onDone } = abrir(4)
    dibujar(TRAZOS[4][0])
    expect(onDone).not.toHaveBeenCalled()
    dibujar(TRAZOS[4][1])
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('si se levanta el dedo a medias no se da por hecha', () => {
    const { onDone } = abrir(1)
    const puntos = resample(TRAZOS[1][0], 2).slice(0, 15)
    fireEvent.pointerDown(superficie(), { clientX: puntos[0][0] + MARGIN, clientY: puntos[0][1] + MARGIN, pointerId: 1 })
    for (const [x, y] of puntos.slice(1)) fireEvent.pointerMove(superficie(), { clientX: x + MARGIN, clientY: y + MARGIN, pointerId: 1 })
    fireEvent.pointerUp(superficie(), { pointerId: 1 })
    expect(onDone).not.toHaveBeenCalled()
  })

  it('un dedo que se sale del camino recibe un «¡Casi!» amable y se puede volver a intentar', () => {
    const { onDone } = abrir(1)
    const puntos = resample(TRAZOS[1][0], 2)
    fireEvent.pointerDown(superficie(), { clientX: puntos[0][0] + MARGIN, clientY: puntos[0][1] + MARGIN, pointerId: 1 })
    for (const [x, y] of puntos.slice(1, 12)) fireEvent.pointerMove(superficie(), { clientX: x + MARGIN, clientY: y + MARGIN, pointerId: 1 })
    fireEvent.pointerMove(superficie(), { clientX: 2 + MARGIN, clientY: 138 + MARGIN, pointerId: 1 })
    expect(screen.getByRole('status')).toHaveTextContent('¡Casi! Inténtalo otra vez')
    fireEvent.pointerUp(superficie(), { pointerId: 1 })
    dibujar(TRAZOS[1][0])
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('sin tocar nada no hay avisos', () => {
    abrir(3)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('captura el puntero para seguir el dedo aunque se salga del dibujo', () => {
    const capturar = vi.fn()
    Object.defineProperty(Element.prototype, 'setPointerCapture', { configurable: true, value: capturar })
    abrir(1)
    fireEvent.pointerDown(superficie(), { clientX: 30 + MARGIN, clientY: 40 + MARGIN, pointerId: 5 })
    expect(capturar).toHaveBeenCalledWith(5)
    Reflect.deleteProperty(Element.prototype, 'setPointerCapture')
  })

  it('«Ya lo he hecho» da por hecha la cifra para quien no pueda trazarla', async () => {
    const { onDone } = abrir(5)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ya lo he hecho' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('al terminar ya no deja seguir trazando ni repite el aviso de hecho', () => {
    const { onDone } = abrir(1)
    dibujar(TRAZOS[1][0])
    act(() => dibujar(TRAZOS[1][0]))
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})

describe('estilos del trazo para tableta', () => {
  it('la superficie no se desplaza ni se amplía con el dedo y no selecciona texto', () => {
    const estilos = regla('.trace-surface')
    expect(estilos).toMatch(/touch-action:\s*none/)
    expect(estilos).toMatch(/user-select:\s*none/)
  })

  it('con movimiento reducido la salida no late', () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*\{[^}]*\.trace-start/)
  })
})
