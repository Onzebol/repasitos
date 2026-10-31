import { describe, expect, it } from 'vitest'
import { DIGITS, TRAZOS } from './infantil/trazos'
import type { Digit, Point, Stroke } from './infantil/trazos'
import { mulberry32 } from './random'
import { advance, createGuide, initialState, lift, resample, toSvgPoint, traced } from './trace'
import type { Guide, TraceState } from './trace'

const CIFRAS = DIGITS.map((digit) => [digit] as [Digit])
const dist = ([ax, ay]: Point, [bx, by]: Point) => Math.hypot(ax - bx, ay - by)

// Simula un dedo: recorre los puntos en orden, con el punto anterior de cada movimiento
function mover(guide: Guide, estado: TraceState, puntos: Point[]): TraceState {
  let actual = estado
  let anterior: Point | null = null
  for (const punto of puntos) {
    actual = advance(guide, actual, anterior, punto)
    anterior = punto
  }
  return actual
}

// Un trazo entero con puntos cada `paso` unidades (y algo de temblor opcional), levantando el dedo al final
function trazar(guide: Guide, estado: TraceState, trazo: Stroke, paso: number, temblor = 0, semilla = 0): TraceState {
  const rng = mulberry32(semilla)
  const puntos = resample(trazo, paso).map(([x, y]): Point => [x + (rng() * 2 - 1) * temblor, y + (rng() * 2 - 1) * temblor])
  return lift(mover(guide, estado, puntos))
}

function trazarCifra(digit: Digit, paso: number, temblor = 0, semilla = 0): TraceState {
  const guide = createGuide(TRAZOS[digit])
  return TRAZOS[digit].reduce((estado, trazo) => trazar(guide, estado, trazo, paso, temblor, semilla), initialState)
}

describe('resample: puntos a la misma distancia a lo largo del trazo', () => {
  it('incluye el primer y el último punto', () => {
    const puntos = resample([[0, 0], [10, 0], [10, 10]], 3)
    expect(puntos[0]).toEqual([0, 0])
    expect(puntos.at(-1)).toEqual([10, 10])
  })

  it('separa los puntos lo mismo en rectas y en esquinas (mide por longitud, no por número de puntos)', () => {
    const puntos = resample([[0, 0], [100, 0]], 4)
    expect(puntos).toHaveLength(26)
    puntos.slice(1, -1).forEach((punto, i) => expect(dist(puntos[i], punto)).toBeCloseTo(4, 5))
    // en una esquina la longitud recorrida (no la línea recta) es la que se reparte: 20 de largo cada 4 = 5 tramos
    const esquina = resample([[0, 0], [10, 0], [10, 10]], 4)
    expect(esquina).toHaveLength(6)
    expect(esquina[3]).toEqual([10, 2])
  })
})

describe('seguimiento del trazo con el dedo', () => {
  it('al principio no hay nada recorrido', () => {
    expect(initialState).toEqual({ stroke: 0, reached: -1, done: false, slipped: false })
  })

  it.each(CIFRAS)('la cifra %i se completa siguiendo el recorrido', (digit) => {
    expect(trazarCifra(digit, 1).done).toBe(true)
  })

  it.each(CIFRAS)('la cifra %i se completa aunque el dedo dé pocos puntos (cada 3 y cada 8 unidades)', (digit) => {
    expect(trazarCifra(digit, 3).done).toBe(true)
    expect(trazarCifra(digit, 8).done).toBe(true)
  })

  it.each(CIFRAS)('la cifra %i se completa con el pulso algo torcido (hasta 4 unidades)', (digit) => {
    for (let semilla = 0; semilla < 10; semilla++) {
      expect(trazarCifra(digit, 2, 4, semilla).done).toBe(true)
    }
  })

  it.each(CIFRAS)('la cifra %i no se completa al revés: la salida marca el sentido', (digit) => {
    const guide = createGuide(TRAZOS[digit])
    const alReves = [...TRAZOS[digit]].map((trazo) => [...trazo].reverse())
    const estado = alReves.reduce((e, trazo) => trazar(guide, e, trazo, 2), initialState)
    expect(estado.done).toBe(false)
    expect(estado.stroke).toBe(0)
  })

  it.each([4, 5, 7] as Digit[])('en la cifra %i hay que hacer los trazos en orden: el segundo no vale primero', (digit) => {
    const guide = createGuide(TRAZOS[digit])
    const estado = trazar(guide, initialState, TRAZOS[digit][1], 2)
    expect(estado.done).toBe(false)
    expect(estado.stroke).toBe(0)
    expect(estado.reached).toBe(-1)
  })

  it('tocar lejos de la salida no empieza el trazo', () => {
    const guide = createGuide(TRAZOS[1])
    const mitad = resample(TRAZOS[1][0], 2).slice(20)
    const estado = mover(guide, initialState, mitad)
    expect(estado.reached).toBe(-1)
    expect(estado.slipped).toBe(false)
  })

  it('saltar de la salida a la llegada de un trazo recto de un golpe no cuenta', () => {
    const guide = createGuide(TRAZOS[4])
    const [brazo, palo] = TRAZOS[4]
    const hecho = trazar(guide, initialState, brazo, 2)
    const estado = mover(guide, hecho, [palo[0], palo.at(-1)!])
    expect(estado.done).toBe(false)
    expect(estado.stroke).toBe(1)
    expect(estado.reached).toBeLessThan(guide[1].length - 1)
  })

  it('si el dedo se sale del camino se repite solo ese trazo, avisando con slipped', () => {
    const guide = createGuide(TRAZOS[4])
    const [brazo, palo] = TRAZOS[4]
    const hecho = trazar(guide, initialState, brazo, 2)
    expect(hecho.stroke).toBe(1)
    const mitadPalo = resample(palo, 2).slice(0, 25)
    const medio = mover(guide, hecho, mitadPalo)
    expect(medio.reached).toBeGreaterThan(5)
    const fuera = advance(guide, medio, mitadPalo.at(-1)!, [0, 140])
    expect(fuera).toEqual({ stroke: 1, reached: -1, done: false, slipped: true })
    // y se puede volver a hacer ese trazo sin repetir el primero
    expect(trazar(guide, fuera, palo, 2).done).toBe(true)
  })

  it('el aviso slipped se quita en cuanto el dedo vuelve a avanzar bien', () => {
    const guide = createGuide(TRAZOS[1])
    const puntos = resample(TRAZOS[1][0], 2)
    const medio = mover(guide, initialState, puntos.slice(0, 10))
    const fuera = advance(guide, medio, puntos[9], [0, 140])
    expect(fuera.slipped).toBe(true)
    const otra = mover(guide, fuera, puntos)
    expect(otra.slipped).toBe(false)
  })

  it('levantar el dedo a medio trazo lo reinicia sin penalizar', () => {
    const guide = createGuide(TRAZOS[7])
    const puntos = resample(TRAZOS[7][0], 2)
    const medio = mover(guide, initialState, puntos.slice(0, 15))
    expect(medio.reached).toBeGreaterThan(5)
    expect(lift(medio)).toEqual({ stroke: 0, reached: -1, done: false, slipped: false })
    expect(trazar(guide, lift(medio), TRAZOS[7][0], 2).stroke).toBe(1)
  })

  it('cuando la cifra está completa los demás movimientos no cambian nada', () => {
    const guide = createGuide(TRAZOS[1])
    const hecho = trazar(guide, initialState, TRAZOS[1][0], 2)
    expect(hecho.done).toBe(true)
    expect(advance(guide, hecho, [0, 0], [99, 99])).toBe(hecho)
    expect(lift(hecho)).toBe(hecho)
  })

  it('en el 8, que se cruza consigo mismo, no se salta de un lazo al otro', () => {
    const guide = createGuide(TRAZOS[8])
    const puntos = resample(TRAZOS[8][0], 2)
    // se sale por la salida, se baja hasta justo antes del cruce y se intenta cerrar saltando a la llegada
    const hastaElCruce = puntos.slice(0, Math.floor(puntos.length * 0.25))
    const estado = mover(guide, initialState, [...hastaElCruce, puntos.at(-3)!])
    expect(estado.done).toBe(false)
  })
})

describe('toSvgPoint: de la pantalla al cuadro de dibujo', () => {
  const vista = { x: -8, y: -8, width: 116, height: 156 }

  it('con el dibujo a su tamaño, resta la posición del cuadro y el margen', () => {
    expect(toSvgPoint({ left: 10, top: 20, width: 116, height: 156 }, vista, 10, 20)).toEqual([-8, -8])
    const [x, y] = toSvgPoint({ left: 10, top: 20, width: 116, height: 156 }, vista, 60, 70)
    expect(x).toBeCloseTo(42, 9)
    expect(y).toBeCloseTo(42, 9)
  })

  it('si el dibujo se ve más grande (tableta) lo escala', () => {
    const [x, y] = toSvgPoint({ left: 10, top: 20, width: 232, height: 312 }, vista, 126, 176)
    expect(x).toBeCloseTo(50, 9)
    expect(y).toBeCloseTo(70, 9)
  })

  it('con un cuadro sin tamaño (aún sin pintar) no revienta', () => {
    expect(toSvgPoint({ left: 0, top: 0, width: 0, height: 0 }, vista, 5, 5)).toEqual([-8, -8])
  })
})

describe('traced: lo ya recorrido, para pintarlo', () => {
  it('sin empezar no hay nada; al avanzar crece el trazo actual y se conservan los terminados', () => {
    const guide = createGuide(TRAZOS[4])
    expect(traced(guide, initialState)).toEqual([[]])
    const [brazo, palo] = TRAZOS[4]
    const parcial = mover(guide, initialState, resample(brazo, 2).slice(0, 10))
    const [enCurso] = traced(guide, parcial)
    expect(enCurso.length).toBe(parcial.reached + 1)
    const entre = trazar(guide, initialState, brazo, 2)
    const lineas = traced(guide, mover(guide, entre, resample(palo, 2).slice(0, 10)))
    expect(lineas).toHaveLength(2)
    expect(lineas[0].at(-1)).toEqual(guide[0].at(-1))
  })

  it('al terminar la cifra todos los trazos están completos', () => {
    const guide = createGuide(TRAZOS[5])
    const hecho = trazarCifra(5, 2)
    const lineas = traced(guide, hecho)
    expect(lineas).toHaveLength(2)
    lineas.forEach((linea, i) => expect(linea).toEqual(guide[i]))
  })
})
