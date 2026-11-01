import { describe, expect, it } from 'vitest'
import { advance, createGuide, initialState, lift, resample } from '../trace'
import type { TraceState } from '../trace'
import { HEIGHT, WIDTH } from './trazos'
import type { Point, Stroke } from './trazos'
import { ABECEDARIO, TRAZOS_MAYUSCULA, TRAZOS_MINUSCULA } from './trazos-letras'
import type { Letra } from './trazos-letras'

const JUEGOS = [
  ['mayúscula', TRAZOS_MAYUSCULA],
  ['minúscula', TRAZOS_MINUSCULA],
] as const

const LETRAS = ABECEDARIO.map((letra) => [letra] as [Letra])

// Un dedo que recorre cada trazo punto a punto (cada `paso` unidades) y lo levanta al final
function repasar(trazos: Stroke[], paso: number, hasta = trazos.length): TraceState {
  const guide = createGuide(trazos)
  return trazos.slice(0, hasta).reduce((estado, trazo) => {
    let actual = estado
    let anterior: Point | null = null
    for (const punto of resample(trazo, paso)) {
      actual = advance(guide, actual, anterior, punto)
      anterior = punto
    }
    return lift(actual)
  }, initialState)
}

describe('letras con trazo', () => {
  it('son las 27 letras del abecedario (con la ñ), en orden alfabético', () => {
    expect(ABECEDARIO.join('')).toBe('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ')
    expect(ABECEDARIO).toHaveLength(27)
  })
})

describe.each(JUEGOS)('trazos de las letras en %s', (_nombre, trazos) => {
  it.each(LETRAS)('la %s tiene al menos un trazo, cada uno una línea de dos puntos o más', (letra) => {
    expect(trazos[letra].length).toBeGreaterThan(0)
    for (const trazo of trazos[letra]) expect(trazo.length).toBeGreaterThanOrEqual(2)
  })

  it.each(LETRAS)('la %s cabe en el cuadro de dibujo', (letra) => {
    for (const trazo of trazos[letra]) {
      for (const [x, y] of trazo) {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(WIDTH)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThanOrEqual(HEIGHT)
      }
    }
  })

  it.each(LETRAS)('la %s no repite puntos seguidos (daría tramos de longitud cero)', (letra) => {
    for (const trazo of trazos[letra]) {
      trazo.slice(1).forEach(([x, y], i) => expect(x === trazo[i][0] && y === trazo[i][1]).toBe(false))
    }
  })

  it.each(LETRAS)('la %s se completa siguiendo el recorrido, aunque el dedo dé pocos puntos', (letra) => {
    for (const paso of [1, 3, 8]) expect(repasar(trazos[letra], paso).done).toBe(true)
  })

  it.each(LETRAS)('la %s no se da por hecha si falta el último trazo', (letra) => {
    expect(repasar(trazos[letra], 2, trazos[letra].length - 1).done).toBe(false)
  })
})

describe('forma de las mayúsculas', () => {
  // M, N y Ñ son la excepción: su primer palo sube desde abajo
  it.each(LETRAS.filter(([letra]) => !'MNÑ'.includes(letra)))('la %s empieza por arriba (como se escribe)', (letra) => {
    expect(TRAZOS_MAYUSCULA[letra][0][0][1]).toBeLessThanOrEqual(45)
  })

  it('las que se hacen de un solo trazo: C, G, J, L, M, N, S y W', () => {
    for (const letra of ['C', 'G', 'J', 'L', 'M', 'N', 'S', 'W'] as Letra[]) {
      expect(TRAZOS_MAYUSCULA[letra]).toHaveLength(1)
    }
  })

  it('las letras con palo (B, D, F, H, K, P, R) empiezan por el palo: de arriba abajo y en vertical', () => {
    for (const letra of ['B', 'D', 'F', 'H', 'K', 'P', 'R'] as Letra[]) {
      const [arriba, abajo] = TRAZOS_MAYUSCULA[letra][0]
      expect(Math.abs(abajo[0] - arriba[0])).toBeLessThan(1)
      expect(abajo[1]).toBeGreaterThan(arriba[1])
    }
  })

  it('la Ñ es una N con la tilde encima, en un trazo aparte y al final', () => {
    const [ene, tilde] = TRAZOS_MAYUSCULA.Ñ
    expect(TRAZOS_MAYUSCULA.Ñ).toHaveLength(2)
    const altoN = Math.min(...ene.map(([, y]) => y))
    expect(Math.max(...tilde.map(([, y]) => y))).toBeLessThan(altoN)
  })

  it('los trazos curvos giran en sentido contrario a las agujas del reloj: C, G y Q empiezan arriba y pasan por la izquierda antes de bajar', () => {
    for (const letra of ['C', 'G', 'Q'] as Letra[]) {
      const trazo = TRAZOS_MAYUSCULA[letra][0]
      const izquierda = Math.min(...trazo.map(([x]) => x))
      const bajo = Math.max(...trazo.map(([, y]) => y))
      expect(trazo.findIndex(([x]) => x === izquierda)).toBeLessThan(trazo.findIndex(([, y]) => y === bajo))
    }
  })
})

describe('forma de las minúsculas', () => {
  it.each(LETRAS)('la %s empieza por encima de la línea (y = 100)', (letra) => {
    expect(TRAZOS_MINUSCULA[letra][0][0][1]).toBeLessThanOrEqual(100)
  })

  it('las que llevan palo alto (b, d, f, h, k, l, t) llegan más arriba que las demás letras de cuerpo', () => {
    const alto = (letra: Letra) => Math.min(...TRAZOS_MINUSCULA[letra].flat().map(([, y]) => y))
    for (const letra of ['B', 'D', 'F', 'H', 'K', 'L', 'T'] as Letra[]) {
      expect(alto(letra)).toBeLessThan(alto('N'))
    }
  })

  it('las que llevan rabo (f, g, j, p, q, y) bajan más que las demás letras de cuerpo', () => {
    const bajo = (letra: Letra) => Math.max(...TRAZOS_MINUSCULA[letra].flat().map(([, y]) => y))
    for (const letra of ['F', 'G', 'J', 'P', 'Q', 'Y'] as Letra[]) {
      expect(bajo(letra)).toBeGreaterThan(bajo('N'))
    }
  })

  it('las minúsculas de cuerpo (a, c, e, m, n, o, r, s, u, v, w, x) no pasan de la línea de arriba del cuerpo', () => {
    for (const letra of ['A', 'C', 'E', 'M', 'N', 'O', 'R', 'S', 'U', 'V', 'W', 'X'] as Letra[]) {
      expect(Math.min(...TRAZOS_MINUSCULA[letra].flat().map(([, y]) => y))).toBeGreaterThanOrEqual(50)
    }
  })
})

describe('orden de las mayúsculas según Garabatos flechas', () => {
  it('en M y N el primer palo se hace de abajo arriba', () => {
    for (const letra of ['M', 'N', 'Ñ'] as Letra[]) {
      const [abajo, arriba] = TRAZOS_MAYUSCULA[letra][0]
      expect(arriba[1]).toBeLessThan(abajo[1])
    }
  })

  it('la H lleva la raya antes del segundo palo; la Z, tres rayas; la V y la Y, las diagonales hacia el vértice', () => {
    expect(TRAZOS_MAYUSCULA.H[1][0][1]).toBeCloseTo(TRAZOS_MAYUSCULA.H[1][1][1], 0) // raya horizontal
    expect(TRAZOS_MAYUSCULA.Z).toHaveLength(3)
    const [v1, v2] = TRAZOS_MAYUSCULA.V
    expect(v1.at(-1)).toEqual(v2.at(-1))
    const [y1, y2] = TRAZOS_MAYUSCULA.Y
    expect(y1.at(-1)).toEqual(y2.at(-1))
  })
})

describe('enlaces de la letra ligada', () => {
  it.each(LETRAS)('la %s acaba con su cola de salida: el último punto de un trazo es el más a la derecha y queda por encima de la línea', (letra) => {
    const trazos = TRAZOS_MINUSCULA[letra]
    const derecha = Math.max(...trazos.flat().map(([x]) => x))
    expect(trazos.some((t) => t.at(-1)![0] === derecha && t.at(-1)![1] <= 90)).toBe(true)
  })

  it('i y j llevan punto y la ñ, tilde: son el último trazo y quedan por encima del cuerpo', () => {
    for (const letra of ['I', 'J', 'Ñ'] as Letra[]) {
      const ultimo = TRAZOS_MINUSCULA[letra].at(-1)!
      expect(Math.max(...ultimo.map(([, y]) => y))).toBeLessThan(58)
    }
  })
})

describe('minúsculas: trazos continuos', () => {
  it('la a, la d, la g y la k son dos trazos (el óvalo o el lazo, y el palo o el arco con su salida)', () => {
    for (const letra of ['A', 'D', 'G', 'K'] as Letra[]) expect(TRAZOS_MINUSCULA[letra]).toHaveLength(2)
  })

  it('la b, la c, la e, la f, la l, la o, la s, la u, la v y la w se escriben sin levantar el dedo: un solo trazo', () => {
    for (const letra of ['B', 'C', 'E', 'F', 'L', 'O', 'S', 'U', 'V', 'W'] as Letra[]) expect(TRAZOS_MINUSCULA[letra]).toHaveLength(1)
  })
})
