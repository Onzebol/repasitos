import { describe, expect, it } from 'vitest'
import { arrowAt, DIGITS, pathData, TRAZOS, WIDTH, HEIGHT } from './trazos'
import type { Digit } from './trazos'

const CIFRAS = DIGITS.map((digit) => [digit] as [Digit])

// Cuántos trazos (levantando el dedo) tiene cada cifra en el diseño
const TRAZOS_POR_CIFRA = [1, 1, 1, 1, 2, 1, 1, 2, 1, 1]

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

  it('en el 4 las dos líneas verticales van bien separadas (al menos la mitad del ancho del cuadro)', () => {
    const [brazo, palo] = TRAZOS[4]
    expect(palo[0][0] - brazo[0][0]).toBeGreaterThanOrEqual(WIDTH / 2)
  })

  it('el lazo del 6 termina a la izquierda, donde se junta con el palo, sin dar la vuelta entera', () => {
    const seis = TRAZOS[6][0]
    const [x, y] = seis.at(-1)!
    expect(x).toBeLessThan(40)
    expect(y).toBeGreaterThan(80)
    expect(y).toBeLessThan(110)
    expect(y).toBeLessThan(Math.max(...seis.map(([, py]) => py)))
  })

  it('el 4 es el de la silla invertida: brazo recto hacia abajo y raya a la derecha; luego el palo largo desde arriba', () => {
    const [brazo, palo] = TRAZOS[4]
    // el brazo baja en vertical, sin diagonal, y gira a la derecha formando la raya
    expect(brazo).toHaveLength(3)
    expect(brazo[0][0]).toBe(brazo[1][0])
    expect(brazo[1][1]).toBeGreaterThan(brazo[0][1])
    expect(brazo[2][1]).toBe(brazo[1][1])
    expect(brazo[2][0]).toBeGreaterThan(brazo[1][0])
    // la raya llega justo hasta el palo (como en el cuaderno) y no lo sobrepasa
    expect(brazo[2][0]).toBe(palo[0][0])
    // el palo cae en vertical por la derecha del brazo, hasta pasar por debajo de la raya
    expect(palo[0][0]).toBe(palo[1][0])
    expect(palo[0][0]).toBeGreaterThan(brazo[0][0])
    expect(palo[0][1]).toBeLessThan(brazo[1][1])
    expect(palo[1][1]).toBeGreaterThan(brazo[1][1])
  })

  it('el 5 se hace de un solo trazo: sale arriba a la derecha, va por la raya hacia la izquierda, baja y hace la barriga', () => {
    expect(TRAZOS[5]).toHaveLength(1)
    const [cinco] = TRAZOS[5]
    const [x0, y0] = cinco[0]
    // sale de la esquina superior derecha
    expect(y0).toBeLessThanOrEqual(20)
    expect(x0).toBeGreaterThanOrEqual(65)
    // primero la raya de arriba, hacia la izquierda y sin bajar
    const [x1, y1] = cinco[1]
    expect(y1).toBe(y0)
    expect(x1).toBeLessThan(x0)
    // después baja por la izquierda y acaba en la barriga, en la parte baja y abierta por la izquierda
    const palo = cinco.findIndex(([, y]) => y > 50)
    expect(palo).toBeGreaterThan(1)
    expect(cinco[palo][0]).toBeLessThan(x0)
    expect(Math.max(...cinco.map(([, y]) => y))).toBeGreaterThan(100)
    expect(cinco.at(-1)![1]).toBeGreaterThan(80)
    expect(cinco.at(-1)![0]).toBeLessThan(cinco.slice(1).reduce((m, [x]) => Math.max(m, x), 0))
  })

  it('el 8 es una sola línea cerrada de dos lazos redondos (como el 3): sale de arriba hacia la izquierda y vuelve al punto de salida', () => {
    const [ocho] = TRAZOS[8]
    expect(TRAZOS[8]).toHaveLength(1)
    expect(ocho.at(-1)).toEqual(ocho[0])
    expect(ocho[1][0]).toBeLessThan(ocho[0][0])
    // los dos lazos se tocan en un punto de la línea central, por el que pasa dos veces
    const medio = ocho.filter(([x, y]) => x === 50 && y === 66)
    expect(medio).toHaveLength(2)
  })

  it('en el 8 el lazo de arriba es algo más pequeño que el de abajo y los dos son redondos', () => {
    const [ocho] = TRAZOS[8]
    const ancho = (puntos: [number, number][]) => Math.max(...puntos.map(([x]) => x)) - Math.min(...puntos.map(([x]) => x))
    const arriba = ocho.filter(([, y]) => y <= 66)
    const abajo = ocho.filter(([, y]) => y >= 66)
    expect(ancho(arriba)).toBeLessThan(ancho(abajo))
    expect(Math.min(...ocho.map(([, y]) => y))).toBeLessThan(15)
    expect(Math.max(...ocho.map(([, y]) => y))).toBeGreaterThan(125)
  })

  it('el palo del 9 es recto hasta abajo: acaba en vertical, por el lado derecho del círculo', () => {
    const [nueve] = TRAZOS[9]
    const [x1, y1] = nueve.at(-2)!
    const [x2, y2] = nueve.at(-1)!
    expect(x1).toBe(x2)
    expect(y2).toBeGreaterThan(y1)
    expect(y2).toBeGreaterThan(120)
    expect(x2).toBe(Math.max(...nueve.map(([x]) => x)))
  })

  it('el 7 lleva raya cruzada: primero la raya de arriba y la diagonal, luego una raya horizontal que corta la diagonal', () => {
    const [diagonal, raya] = TRAZOS[7]
    expect(diagonal).toHaveLength(3)
    expect(raya).toHaveLength(2)
    expect(raya[0][1]).toBe(raya[1][1])
    expect(raya[1][0]).toBeGreaterThan(raya[0][0])
    // a la altura de la raya, la diagonal queda entre sus dos extremos
    const [[, y1], [, y2]] = diagonal.slice(1)
    const [[x1], [x2]] = diagonal.slice(1)
    const x = x1 + ((x2 - x1) * (raya[0][1] - y1)) / (y2 - y1)
    expect(raya[0][0]).toBeLessThan(x)
    expect(raya[1][0]).toBeGreaterThan(x)
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
