import { describe, expect, it } from 'vitest'
import { describeSteps, followSteps, formatSteps, parseSteps, stepsFromPath } from './route'

describe('parseSteps y formatSteps: instrucciones con número y flecha («3> 1^ 1>»)', () => {
  it('leen número y dirección: > derecha, < izquierda, ^ arriba y v abajo', () => {
    expect(parseSteps('3> 1^ 1>')).toEqual([
      { n: 3, dir: '>' },
      { n: 1, dir: '^' },
      { n: 1, dir: '>' },
    ])
    expect(parseSteps('2< 4v')).toEqual([
      { n: 2, dir: '<' },
      { n: 4, dir: 'v' },
    ])
  })

  it('formatSteps deshace parseSteps', () => {
    for (const texto of ['3> 1^ 1>', '1v', '2< 4v 1>']) expect(formatSteps(parseSteps(texto))).toBe(texto)
  })

  it('rechazan lo que no es una instrucción', () => {
    for (const roto of ['', '3', '>', '0>', '3x', '3> 1', '-1>']) expect(() => parseSteps(roto), roto).toThrow()
  })
})

describe('followSteps: las casillas por las que pasa un itinerario', () => {
  it('cuenta filas hacia abajo y columnas hacia la derecha, empezando en la casilla de salida', () => {
    expect(followSteps([3, 0], parseSteps('3> 1^ 1>'))).toEqual([
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [2, 3],
      [2, 4],
    ])
    expect(followSteps([0, 4], parseSteps('2< 1v'))).toEqual([
      [0, 4],
      [0, 3],
      [0, 2],
      [1, 2],
    ])
  })

  it('un itinerario vacío se queda en la salida', () => {
    expect(followSteps([1, 1], [])).toEqual([[1, 1]])
  })
})

describe('stepsFromPath: de un camino de casillas contiguas a instrucciones', () => {
  it('junta los pasos seguidos en la misma dirección', () => {
    const camino: [number, number][] = [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [2, 3],
      [2, 4],
    ]
    expect(formatSteps(stepsFromPath(camino))).toBe('3> 1^ 1>')
  })

  it('es lo contrario de followSteps cuando dos pasos seguidos no repiten dirección', () => {
    for (const texto of ['3> 1^ 1>', '2v 2< 1^', '1> 1v']) {
      expect(formatSteps(stepsFromPath(followSteps([0, 0], parseSteps(texto))))).toBe(texto)
    }
  })

  it('rechaza saltos: las casillas tienen que ser contiguas', () => {
    expect(() => stepsFromPath([[0, 0], [0, 2]])).toThrow()
    expect(() => stepsFromPath([[0, 0], [1, 1]])).toThrow()
    expect(() => stepsFromPath([[0, 0], [0, 0]])).toThrow()
  })
})

describe('describeSteps: el itinerario dicho con palabras (para lectores de pantalla y la voz)', () => {
  it('usa singular y plural y une con comas y «y»', () => {
    expect(describeSteps(parseSteps('3> 1^ 1>'))).toBe('3 pasos a la derecha, 1 paso hacia arriba y 1 paso a la derecha')
    expect(describeSteps(parseSteps('2v'))).toBe('2 pasos hacia abajo')
    expect(describeSteps(parseSteps('1< 2^'))).toBe('1 paso a la izquierda y 2 pasos hacia arriba')
  })
})
