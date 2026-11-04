import { describe, expect, it } from 'vitest'
import { generate } from './generators'
import { mulberry32 } from './random'
import type { BlockSpec, Exercise } from './types'

const SEMILLAS = 300

const muchos = (spec: BlockSpec) => Array.from({ length: SEMILLAS }, (_, seed) => generate(spec, mulberry32(seed)))

function choice(e: Exercise) {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}
function number(e: Exercise) {
  if (e.type !== 'number') throw new Error(`se esperaba escribir un número: ${e.question}`)
  return e
}
function column(e: Exercise) {
  if (e.type !== 'column') throw new Error(`se esperaba una columna: ${e.question}`)
  return e
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

describe('Restas llevando', () => {
  it('en columna: las unidades del minuendo son menores que las del sustraendo, se pide una decena y el resultado es positivo', () => {
    for (const e of muchos({ kind: 'column', operator: '−', carry: true }).map(column)) {
      const nombre = `${e.top} − ${e.bottom}`
      expect(e.carry, nombre).toBe(true)
      expect(e.top % 10, nombre).toBeLessThan(e.bottom % 10)
      expect(e.top, nombre).toBeGreaterThanOrEqual(20)
      expect(e.top, nombre).toBeLessThanOrEqual(99)
      expect(e.bottom, nombre).toBeGreaterThanOrEqual(10)
      // tras pedir una decena, las decenas del minuendo aún alcanzan para restar las del sustraendo
      expect(Math.floor(e.top / 10) - 1, nombre).toBeGreaterThanOrEqual(Math.floor(e.bottom / 10))
      expect(e.answer, nombre).toBe(e.top - e.bottom)
      expect(e.answer, nombre).toBeGreaterThan(0)
    }
  })

  it('el problema de resta llevando tiene la respuesta de una resta que lleva', () => {
    for (const e of muchos({ kind: 'word-problem', operator: '−', carry: true }).map(number)) {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(a % 10, e.question).toBeLessThan(b % 10)
      expect(e.answer, e.question).toBe(a - b)
    }
  })

  it('con sustraendo de una cifra (65 − 8): las unidades del minuendo son menores, se pide una decena y el resultado es positivo', () => {
    const minuendos = new Set<number>()
    for (const e of muchos({ kind: 'column', operator: '−', carry: true, oneDigit: true }).map(column)) {
      const nombre = `${e.top} − ${e.bottom}`
      expect(e.carry, nombre).toBe(true)
      expect(e.bottom, nombre).toBeGreaterThanOrEqual(2)
      expect(e.bottom, nombre).toBeLessThanOrEqual(9)
      expect(e.top % 10, nombre).toBeLessThan(e.bottom)
      expect(e.top, nombre).toBeGreaterThanOrEqual(20)
      expect(e.top, nombre).toBeLessThanOrEqual(99)
      expect(e.answer, nombre).toBe(e.top - e.bottom)
      expect(e.answer, nombre).toBeGreaterThanOrEqual(11)
      minuendos.add(e.top)
    }
    expect(minuendos.size, 'salen muchos minuendos distintos').toBeGreaterThan(30)
  })

  it('el problema de «cuánto falta» con llevada: hace falta un total, ya hay una parte con más unidades y se pregunta cuántos faltan', () => {
    for (const e of muchos({ kind: 'word-problem', operator: '−', carry: true, faltan: true }).map(number)) {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(e.question, e.question).toMatch(/falta/)
      expect(a % 10, e.question).toBeLessThan(b % 10)
      expect(e.answer, e.question).toBe(a - b)
      expect(e.answer, e.question).toBeGreaterThan(0)
    }
  })

  it('las restas sin llevar no llevan', () => {
    for (const e of muchos({ kind: 'column', operator: '−' }).map(column)) {
      expect(e.carry).toBeUndefined()
      expect(e.top % 10).toBeGreaterThanOrEqual(e.bottom % 10)
    }
  })
})

describe('Centenas, decenas y unidades', () => {
  it('leer: el número de 3 cifras tiene sus centenas, decenas y unidades y las opciones no se repiten ni suenan raras', () => {
    for (const e of muchos({ kind: 'cdu', ask: 'read' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n, e.question).toBeGreaterThanOrEqual(100)
      expect(n, e.question).toBeLessThanOrEqual(999)
      const [c, d, u] = [Math.floor(n / 100), Math.floor((n % 100) / 10), n % 10]
      expect(e.answer, e.question).toBe(`${plural(c, 'centena', 'centenas')}, ${plural(d, 'decena', 'decenas')} y ${plural(u, 'unidad', 'unidades')}`)
      expect(e.options, e.question).toHaveLength(3)
      for (const opcion of e.options) expect(opcion).not.toMatch(/\b1 (centenas|decenas|unidades)\b/)
    }
  })

  it('componer: centenas, decenas y unidades con singular y plural correctos', () => {
    for (const e of muchos({ kind: 'cdu', ask: 'compose' }).map(number)) {
      const [c, d, u] = e.question.match(/\d+/g)!.map(Number)
      expect(c, e.question).toBeGreaterThanOrEqual(1)
      expect(e.answer, e.question).toBe(c * 100 + d * 10 + u)
      expect(e.question).toContain(`${plural(c, 'centena', 'centenas')}, ${plural(d, 'decena', 'decenas')} y ${plural(u, 'unidad', 'unidades')}`)
    }
  })

  it('con piezas: 🟥 centena, 🟦 decena y 🟨 unidad se cuentan en el dibujo', () => {
    for (const e of muchos({ kind: 'cdu', ask: 'blocks' }).map(number)) {
      const pieza = (p: string) => [...(e.visual ?? '')].filter((c) => c === p).length
      expect(pieza('🟥'), e.question).toBeGreaterThanOrEqual(1)
      expect(e.answer, e.question).toBe(pieza('🟥') * 100 + pieza('🟦') * 10 + pieza('🟨'))
      expect(e.question).toContain('🟥')
    }
  })

  it('contar: cuántas centenas, decenas o unidades tiene un número de 3 cifras', () => {
    const lugares = new Set<string>()
    for (const e of muchos({ kind: 'cdu', ask: 'count' }).map(number)) {
      const n = Number(e.question.match(/\d+/)![0])
      const lugar = /centenas/.test(e.question) ? 'centenas' : /decenas/.test(e.question) ? 'decenas' : 'unidades'
      lugares.add(lugar)
      const esperado = lugar === 'centenas' ? Math.floor(n / 100) : lugar === 'decenas' ? Math.floor((n % 100) / 10) : n % 10
      expect(e.answer, e.question).toBe(esperado)
    }
    expect([...lugares].sort()).toEqual(['centenas', 'decenas', 'unidades'])
  })

  describe('pistas: elegir el número que cumple la pista', () => {
    // Tabla de verdad independiente del generador: cada pista es una condición sobre las cifras del número.
    // Un lugar que no se nombra (en «1 centena y 5 decenas») vale 0, salvo con «más de» y «menos de», que solo hablan de un lugar
    const cifras = (n: number) => ({ c: Math.floor(n / 100), d: Math.floor((n % 100) / 10), u: n % 10 })
    const cumple = (pregunta: string, n: number): boolean => {
      const { c, d, u } = cifras(n)
      let m = pregunta.match(/^¿Qué número tiene (\d) centenas?, (\d) decenas? y (\d) unidad(?:es)?\?$/)
      if (m) return c === +m[1] && d === +m[2] && u === +m[3]
      m = pregunta.match(/^¿Qué número tiene (\d) centenas? y más de (\d) decenas\?$/)
      if (m) return c === +m[1] && d > +m[2]
      m = pregunta.match(/^¿Qué número tiene (\d) centenas? y menos de (\d) unidades\?$/)
      if (m) return c === +m[1] && u < +m[2]
      m = pregunta.match(/^¿Qué número tiene (\d) centenas? y (\d) decenas?\?$/)
      if (m) return c === +m[1] && d === +m[2] && u === 0
      m = pregunta.match(/^¿Qué número tiene (\d) centenas? y (\d) unidad(?:es)?\?$/)
      if (m) return c === +m[1] && d === 0 && u === +m[2]
      throw new Error(`pista inesperada: ${pregunta}`)
    }

    it('de tres números de tres cifras cumple la pista exactamente uno y es la respuesta', () => {
      for (const e of muchos({ kind: 'cdu', ask: 'clue' }).map(choice)) {
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) expect(opcion, e.question).toMatch(/^[1-9]\d\d$/)
        expect(e.options.filter((o) => cumple(e.question, Number(o))), e.question).toEqual([e.answer])
      }
    })

    it('salen todos los tipos de pista: tres lugares, «más de», «menos de», y un lugar sin nombrar (el cero)', () => {
      const tipos = new Set<string>()
      for (const e of muchos({ kind: 'cdu', ask: 'clue' }).map(choice)) {
        tipos.add(
          /, .* y .*\?$/.test(e.question) ? 'tres' : /más de/.test(e.question) ? 'mas' : /menos de/.test(e.question) ? 'menos' : /decenas?\?$/.test(e.question) ? 'sin-unidades' : 'sin-decenas',
        )
      }
      expect(tipos).toEqual(new Set(['tres', 'mas', 'menos', 'sin-unidades', 'sin-decenas']))
    })

    it('la respuesta correcta sale en las tres posiciones y se usa el singular («1 centena», «1 unidad»)', () => {
      const ejercicios = muchos({ kind: 'cdu', ask: 'clue' }).map(choice)
      expect(new Set(ejercicios.map((e) => e.options.indexOf(e.answer)))).toEqual(new Set([0, 1, 2]))
      for (const e of ejercicios) expect(e.question).not.toMatch(/\b1 (centenas|decenas|unidades)\b/)
    })
  })
})

// Tabla de verdad independiente: de menor a mayor capacidad
const POR_CAPACIDAD = ['una cucharilla', 'un vaso', 'una jarra de agua', 'una garrafa de agua', 'una bañera', 'una piscina']

describe('El litro', () => {
  it('capacidad: la respuesta es el recipiente que tiene más (o menos) capacidad de los tres', () => {
    for (const mode of ['more', 'less'] as const) {
      for (const e of muchos({ kind: 'capacity', mode }).map(choice)) {
        expect(e.options, e.question).toHaveLength(3)
        const lugares = e.options.map((o) => POR_CAPACIDAD.indexOf(o))
        for (const l of lugares) expect(l, e.question).toBeGreaterThanOrEqual(0)
        const buscado = mode === 'more' ? Math.max(...lugares) : Math.min(...lugares)
        expect(e.answer, e.question).toBe(POR_CAPACIDAD[buscado])
        expect(e.question).toBe(mode === 'more' ? '¿Cuál tiene más capacidad?' : '¿Cuál tiene menos capacidad?')
        expect(e.fact, e.question).toBeDefined()
      }
    }
  })

  it('capacidad: salen todos los recipientes y distintas combinaciones', () => {
    const vistos = new Set<string>()
    const combinaciones = new Set<string>()
    for (const e of muchos({ kind: 'capacity', mode: 'more' }).map(choice)) {
      e.options.forEach((o) => vistos.add(o))
      combinaciones.add([...e.options].sort().join('|'))
    }
    expect([...vistos].sort()).toEqual([...POR_CAPACIDAD].sort())
    expect(combinaciones.size).toBeGreaterThan(10)
  })
})

describe('Cálculo mental: sumar un dígito a un número de dos cifras', () => {
  it('sin llevar: las unidades no pasan de 9 y el resultado tiene dos cifras', () => {
    for (const e of muchos({ kind: 'mental', mode: 'add-digit' }).map(number)) {
      const m = e.question.match(/^(\d\d) \+ (\d) =$/)
      expect(m, e.question).not.toBeNull()
      const [a, b] = [Number(m![1]), Number(m![2])]
      expect(b, e.question).toBeGreaterThanOrEqual(1)
      expect(a % 10 + b, e.question).toBeLessThanOrEqual(9)
      expect(e.answer, e.question).toBe(a + b)
    }
  })
})

describe('Problemas de «más que» y «menos que»', () => {
  // Lo que dice el enunciado, leído sin el código del generador: los dos números y si es «más» o «menos»
  const leer = (texto: string) => {
    const [a, b] = texto.match(/\d+/g)!.map(Number)
    const palabra = texto.match(/ (más|menos)\. ¿/)![1]
    return { a, b, mas: palabra === 'más' }
  }

  it('elegir si sumar o restar: «más» es sumar y «menos» es restar, con el texto en la tarjeta de lectura', () => {
    const palabras = new Set<boolean>()
    for (const e of muchos({ kind: 'compare-problem', ask: 'operation' }).map(choice)) {
      expect(e.question).toBe('¿Hay que sumar o restar?')
      expect(e.options.slice().sort()).toEqual(['restar', 'sumar'])
      const { mas } = leer(e.text!)
      expect(e.answer, e.text).toBe(mas ? 'sumar' : 'restar')
      palabras.add(mas)
    }
    expect(palabras).toEqual(new Set([true, false]))
  })

  it('calcular: el resultado es el primer número más o menos el segundo, de dos cifras y sin pasar de 99', () => {
    for (const carry of [false, true]) {
      for (const e of muchos({ kind: 'compare-problem', ask: 'calculate', carry }).map(number)) {
        const { a, b, mas } = leer(e.question)
        expect(e.question).toMatch(/^[^?]*\. ¿(Cuánt[oa]s? )[^?]*\?$/)
        expect(a, e.question).toBeGreaterThanOrEqual(10)
        expect(b, e.question).toBeGreaterThanOrEqual(10)
        expect(e.answer, e.question).toBe(mas ? a + b : a - b)
        expect(e.answer, e.question).toBeGreaterThan(0)
        expect(e.answer, e.question).toBeLessThanOrEqual(99)
        // sin llevar, las unidades no pasan ni piden una decena; llevando, sí
        const lleva = mas ? (a % 10) + (b % 10) >= 10 : a % 10 < b % 10
        expect(lleva, e.question).toBe(carry)
      }
    }
  })

  it('salen todas las historias y tanto «más» como «menos»', () => {
    const historias = new Set<string>()
    const palabras = new Set<boolean>()
    for (const e of muchos({ kind: 'compare-problem', ask: 'calculate' }).map(number)) {
      historias.add(e.question.replace(/\d+/g, '#').replace(/ (más|menos)\./, ' X.'))
      palabras.add(leer(e.question).mas)
    }
    expect(historias.size).toBe(6)
    expect(palabras).toEqual(new Set([true, false]))
  })
})
