import { describe, expect, it } from 'vitest'
import { arrowAt, DIGITS, pathData, TRAZOS, WIDTH, HEIGHT } from './trazos'
import type { Digit } from './trazos'

const CIFRAS = DIGITS.map((digit) => [digit] as [Digit])

// Cuántos trazos (levantando el dedo) tiene cada cifra en el diseño
const TRAZOS_POR_CIFRA = [1, 1, 1, 1, 2, 2, 1, 1, 1, 1]

describe('trazos de las cifras', () => {
  it('hay un recorrido para cada cifra del 0 al 9', () => {
    expect(DIGITS).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const digit of DIGITS) expect(TRAZOS[digit].length).toBeGreaterThan(0)
  })

  it.each(CIFRAS)('la cifra %i tiene los trazos previstos y cada uno es una línea de al menos dos puntos', (digit) => {
    expect(TRAZOS[digit]).toHaveLength(TRAZOS_POR_CIFRA[digit])
    for (const stroke of TRAZOS[digit]) expect(stroke.length).toBeGreaterThanOrEqual(2)
  })

  it.each(CIFRAS)('la cifra %i cabe en el cuadro de dibujo', (digit) => {
    for (const stroke of TRAZOS[digit]) {
      for (const [x, y] of stroke) {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(WIDTH)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThanOrEqual(HEIGHT)
      }
    }
  })

  it.each(CIFRAS)('la cifra %i empieza por arriba (como se escribe)', (digit) => {
    const [x, y] = TRAZOS[digit][0][0]
    expect(y).toBeLessThanOrEqual(45)
    expect(x).toBeGreaterThan(0)
  })

  it('el 0 y el 6 se escriben en sentido contrario a las agujas del reloj: empiezan arriba y bajan por la izquierda', () => {
    for (const digit of [0, 6] as Digit[]) {
      const stroke = TRAZOS[digit][0]
      const [startX] = stroke[0]
      const izquierda = Math.min(...stroke.map(([x]) => x))
      const idxIzquierda = stroke.findIndex(([x]) => x === izquierda)
      expect(izquierda).toBeLessThan(startX)
      // la parte más a la izquierda se alcanza antes que la parte más baja
      const bajo = Math.max(...stroke.map(([, y]) => y))
      expect(idxIzquierda).toBeLessThan(stroke.findIndex(([, y]) => y === bajo))
    }
  })

  it('el 4 se hace en dos trazos: primero la diagonal con la raya, luego el palo desde arriba', () => {
    const [primero, segundo] = TRAZOS[4]
    expect(primero[0][1]).toBeLessThan(primero[primero.length - 1][1])
    expect(primero[primero.length - 1][0]).toBeGreaterThan(primero[1][0])
    expect(segundo[0][1]).toBeLessThan(segundo[segundo.length - 1][1])
    expect(segundo[0][0]).toBe(segundo[segundo.length - 1][0])
  })

  it('el 5 se hace en dos trazos: primero el cuerpo, al final la raya de arriba', () => {
    const [cuerpo, raya] = TRAZOS[5]
    expect(raya).toHaveLength(2)
    expect(raya[0][1]).toBe(raya[1][1])
    expect(raya[1][0]).toBeGreaterThan(raya[0][0])
    expect(Math.max(...cuerpo.map(([, y]) => y))).toBeGreaterThan(100)
  })

  it('el 7 no lleva raya cruzada: un solo trazo con la raya de arriba y la diagonal', () => {
    expect(TRAZOS[7]).toHaveLength(1)
  })

  it('ninguna cifra tiene puntos repetidos seguidos (daría tramos de longitud cero)', () => {
    for (const digit of DIGITS) {
      for (const stroke of TRAZOS[digit]) {
        stroke.slice(1).forEach(([x, y], i) => {
          const [px, py] = stroke[i]
          expect(x === px && y === py).toBe(false)
        })
      }
    }
  })
})

describe('pathData', () => {
  it('convierte un trazo en el texto de un camino SVG', () => {
    expect(pathData([[1, 2], [3.5, 4], [5, 6]])).toBe('M1 2L3.5 4L5 6')
  })
})

describe('arrowAt', () => {
  it('da el punto y el ángulo de la flecha a una fracción del trazo', () => {
    const horizontal: [number, number][] = [[0, 10], [100, 10]]
    expect(arrowAt(horizontal, 0.25)).toEqual({ x: 25, y: 10, angle: 0 })
  })

  it('el ángulo sigue la dirección del tramo (hacia abajo son 90 grados)', () => {
    const vertical: [number, number][] = [[10, 0], [10, 100]]
    expect(arrowAt(vertical, 0.5)).toEqual({ x: 10, y: 50, angle: 90 })
  })

  it('mide la fracción por la longitud, no por el número de puntos', () => {
    const quebrada: [number, number][] = [[0, 0], [10, 0], [10, 90]] // 10 + 90 = 100
    const { x, y } = arrowAt(quebrada, 0.5)
    expect([x, y]).toEqual([10, 40])
  })
})
