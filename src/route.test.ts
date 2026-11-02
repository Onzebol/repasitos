import { describe, expect, it } from 'vitest'
import { describeSteps, followSteps, formatSteps, parseSteps, runProgram, stepsFromPath } from './route'

// Un mapa de 4 × 5 con dos árboles que no se pueden cruzar: Repi sale de la casilla [2, 0] y la meta está en [1, 4]
const MAPA = [
  ['🌳', '', '🌲', '🌳', ''],
  ['', '🌷', '', '🏪', '🏫'],
  ['', '', '', '⛲', ''],
  ['', '', '', '', ''],
]
const ARBOLES = ['🌳', '🌲']
const correr = (programa: string) => runProgram(MAPA, [2, 0], [1, 4], parseSteps(programa), ARBOLES)

describe('runProgram: lo que hace Repi al seguir un programa por el mapa', () => {
  it('llega a la meta, pasando por lugares y flores (que no estorban)', () => {
    const resultado = correr('3> 1^ 1>')
    expect(resultado.outcome).toBe('goal')
    expect(resultado.positions).toEqual([[2, 0], [2, 1], [2, 2], [2, 3], [1, 3], [1, 4]])
  })

  it('vale cualquier camino que acabe en la meta, no solo el más corto', () => {
    expect(correr('1^ 4>').outcome).toBe('goal') // por arriba, pisando la flor y la tienda
    expect(correr('1v 4> 2^').outcome).toBe('goal') // dando la vuelta por abajo
  })

  it('un programa que acaba en otra casilla se queda corto', () => {
    const resultado = correr('1>')
    expect(resultado.outcome).toBe('short')
    expect(resultado.positions).toEqual([[2, 0], [2, 1]])
  })

  it('un árbol para a Repi justo antes de él', () => {
    const resultado = correr('2^')
    expect(resultado.outcome).toBe('blocked')
    expect(resultado.positions).toEqual([[2, 0], [1, 0]]) // el [0, 0] es un árbol
  })

  it('el borde del mapa también para a Repi', () => {
    expect(correr('3<').outcome).toBe('edge')
    expect(correr('3<').positions).toEqual([[2, 0]])
    expect(correr('2v 1>').outcome).toBe('edge')
    expect(correr('2v 1>').positions).toEqual([[2, 0], [3, 0]])
  })

  it('un programa vacío deja a Repi en la salida', () => {
    const resultado = runProgram(MAPA, [2, 0], [1, 4], [], ARBOLES)
    expect(resultado.outcome).toBe('short')
    expect(resultado.positions).toEqual([[2, 0]])
  })

  it('si la salida ya es la meta, el programa vacío acierta', () => {
    expect(runProgram(MAPA, [1, 4], [1, 4], [], ARBOLES).outcome).toBe('goal')
  })
})

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
