import { describe, expect, it } from 'vitest'
import { generate } from './generators'
import { mulberry32 } from './random'
import type { BlockSpec, Exercise } from './types'

const SEMILLAS = 300

// Crea muchos ejercicios de una plantilla, uno por semilla
const muchos = (spec: BlockSpec) => Array.from({ length: SEMILLAS }, (_, seed) => generate(spec, mulberry32(seed)))

function choice(e: Exercise) {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}
function number(e: Exercise) {
  if (e.type !== 'number') throw new Error(`se esperaba escribir un número: ${e.question}`)
  return e
}

// Lo que debe cumplir todo ejercicio, sea cual sea la plantilla
function esValido(e: Exercise) {
  expect(e.question.trim(), 'enunciado').not.toBe('')
  if (e.type === 'choice') {
    expect(e.options, e.question).toContain(e.answer)
    expect(new Set(e.options).size, e.question).toBe(e.options.length)
  } else if (e.type === 'number') {
    expect(Number.isInteger(e.answer), e.question).toBe(true)
    expect(e.answer, e.question).toBeGreaterThanOrEqual(0)
    expect(e.answer, e.question).toBeLessThanOrEqual(999)
  } else if (e.type === 'trace') {
    expect(Number.isInteger(e.digit), e.question).toBe(true)
    expect(e.digit, e.question).toBeGreaterThanOrEqual(0)
    expect(e.digit, e.question).toBeLessThanOrEqual(9)
    expect(e.answer, e.question).toBe(e.digit)
    expect(e.question, e.question).toContain(String(e.digit))
  } else {
    const nombre = `${e.top} ${e.operator} ${e.bottom}`
    expect(e.top, nombre).toBeGreaterThanOrEqual(10)
    expect(e.top, nombre).toBeLessThanOrEqual(99)
    expect(e.bottom, nombre).toBeGreaterThanOrEqual(10)
    expect(e.bottom, nombre).toBeLessThanOrEqual(99)
    expect(e.answer, nombre).toBe(e.operator === '+' ? e.top + e.bottom : e.top - e.bottom)
    expect(e.answer, nombre).toBeGreaterThan(0)
    expect(e.answer, nombre).toBeLessThanOrEqual(e.carry ? 199 : 99)
    if (e.carry) {
      // llevando: las unidades suman 10 o más
      expect(e.operator, nombre).toBe('+')
      expect((e.top % 10) + (e.bottom % 10), nombre).toBeGreaterThanOrEqual(10)
    } else if (e.operator === '+') {
      // sin llevar: cada columna se resuelve por separado
      expect((e.top % 10) + (e.bottom % 10), nombre).toBeLessThan(10)
    } else {
      expect(e.top % 10, nombre).toBeGreaterThanOrEqual(e.bottom % 10)
      expect(Math.floor(e.top / 10), nombre).toBeGreaterThanOrEqual(Math.floor(e.bottom / 10))
    }
  }
}

const SPECS: BlockSpec[] = [
  { kind: 'neighbor', mode: 'after', min: 10, max: 99 },
  { kind: 'neighbor', mode: 'before', min: 10, max: 99 },
  { kind: 'neighbor', mode: 'between', min: 10, max: 99 },
  { kind: 'extreme', mode: 'greatest' },
  { kind: 'extreme', mode: 'smallest' },
  { kind: 'series', step: 1 },
  { kind: 'series', step: 10 },
  { kind: 'place-value', ask: 'read' },
  { kind: 'place-value', ask: 'tens' },
  { kind: 'place-value', ask: 'units' },
  { kind: 'place-value', ask: 'compose' },
  { kind: 'place-value', ask: 'blocks' },
  { kind: 'compare', mode: 'sign' },
  { kind: 'compare', mode: 'statement' },
  { kind: 'compare', mode: 'order' },
  { kind: 'column', operator: '+' },
  { kind: 'column', operator: '−' },
  { kind: 'column', operator: '+', carry: true },
  { kind: 'word-problem', operator: '+' },
  { kind: 'word-problem', operator: '−' },
  { kind: 'word-problem', operator: '+', carry: true },
  { kind: 'nearest-ten' },
  { kind: 'mental', mode: 'add-bridge' },
  { kind: 'mental', mode: 'sub-bridge' },
  { kind: 'mental', mode: 'tens-add' },
  { kind: 'mental', mode: 'tens-sub' },
  { kind: 'inverse', mode: 'subtract' },
  { kind: 'inverse', mode: 'missing' },
  { kind: 'inverse', mode: 'operation' },
  { kind: 'ordinal', mode: 'position' },
  { kind: 'ordinal', mode: 'name' },
  { kind: 'neighbor', mode: 'after', min: 100, max: 199 },
  { kind: 'neighbor', mode: 'before', min: 100, max: 199 },
  { kind: 'neighbor', mode: 'between', min: 100, max: 199 },
  { kind: 'extreme', mode: 'greatest', min: 100, max: 199 },
  { kind: 'extreme', mode: 'smallest', min: 100, max: 199 },
  { kind: 'compare', mode: 'sign', min: 100, max: 199 },
  { kind: 'compare', mode: 'order', min: 100, max: 199 },
  { kind: 'series', step: 1, min: 100, max: 199 },
  { kind: 'series', step: 10, min: 100, max: 199 },
  { kind: 'hundreds', ask: 'read' },
  { kind: 'hundreds', ask: 'compose' },
  { kind: 'mental', mode: 'add-three' },
]

const ORDINALES = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo']

describe('generate: todo ejercicio generado es válido', () => {
  it.each(SPECS.map((spec) => [JSON.stringify(spec), spec] as const))('%s', (_nombre, spec) => {
    for (const e of muchos(spec)) esValido(e)
  })

  it('con la misma semilla sale el mismo ejercicio y con otras salen distintos', () => {
    for (const spec of SPECS) {
      expect(generate(spec, mulberry32(11))).toEqual(generate(spec, mulberry32(11)))
      const distintos = new Set(muchos(spec).map((e) => JSON.stringify(e)))
      expect(distintos.size, JSON.stringify(spec)).toBeGreaterThan(5)
    }
  })

  it('una lista fija no se genera: se toma del plan', () => {
    expect(() => generate({ kind: 'bag', items: [] }, mulberry32(1))).toThrow()
  })
})

describe('generate: trazo guiado de cifras', () => {
  it('por defecto salen las cifras del 0 al 9 y salen todas', () => {
    const digitos = muchos({ kind: 'trace' }).map((e) => {
      if (e.type !== 'trace') throw new Error('se esperaba trazar')
      return e.digit
    })
    expect(new Set(digitos)).toEqual(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
  })

  it('respeta el rango pedido (por ejemplo solo hasta el 7)', () => {
    for (const e of muchos({ kind: 'trace', min: 1, max: 7 })) {
      if (e.type !== 'trace') throw new Error('se esperaba trazar')
      expect(e.digit).toBeGreaterThanOrEqual(1)
      expect(e.digit).toBeLessThanOrEqual(7)
    }
  })
})

describe('generate: reglas de cada plantilla', () => {
  it('después, antes y entre dan el vecino correcto', () => {
    for (const e of muchos({ kind: 'neighbor', mode: 'after', min: 10, max: 99 }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(e.answer, e.question).toBe(String(n + 1))
    }
    for (const e of muchos({ kind: 'neighbor', mode: 'before', min: 10, max: 99 }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(e.answer, e.question).toBe(String(n - 1))
    }
    for (const e of muchos({ kind: 'neighbor', mode: 'between', min: 10, max: 99 }).map(choice)) {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(b - a, e.question).toBe(2)
      expect(e.answer, e.question).toBe(String(a + 1))
    }
  })

  it('respeta el rango pedido', () => {
    for (const e of muchos({ kind: 'neighbor', mode: 'after', min: 40, max: 49 }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n).toBeGreaterThanOrEqual(40)
      expect(n).toBeLessThanOrEqual(49)
    }
  })

  it('mayor y menor señalan el número correcto entre tres distintos', () => {
    for (const e of muchos({ kind: 'extreme', mode: 'greatest' }).map(choice)) {
      expect(e.options).toHaveLength(3)
      expect(e.answer, e.question).toBe(String(Math.max(...e.options.map(Number))))
    }
    for (const e of muchos({ kind: 'extreme', mode: 'smallest' }).map(choice)) {
      expect(e.answer, e.question).toBe(String(Math.min(...e.options.map(Number))))
    }
  })

  it('las series continúan de 1 en 1 o de 10 en 10', () => {
    for (const paso of [1, 10] as const) {
      for (const e of muchos({ kind: 'series', step: paso }).map(number)) {
        const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
        expect(b - a, e.question).toBe(paso)
        expect(c - b, e.question).toBe(paso)
        expect(e.answer, e.question).toBe(c + paso)
      }
    }
  })

  it('decenas y unidades: leer un número da la descomposición correcta, con singular y plural', () => {
    for (const e of muchos({ kind: 'place-value', ask: 'read' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      const d = Math.floor(n / 10)
      const u = n % 10
      expect(e.answer, e.question).toBe(`${d} ${d === 1 ? 'decena' : 'decenas'} y ${u} ${u === 1 ? 'unidad' : 'unidades'}`)
      for (const opcion of e.options) expect(opcion).not.toMatch(/\b1 (decenas|unidades)\b/)
    }
  })

  it('contar decenas o unidades da la cifra correcta (también 0)', () => {
    const vistos = new Set<number>()
    for (const e of muchos({ kind: 'place-value', ask: 'units' }).map(number)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(e.answer, e.question).toBe(n % 10)
      vistos.add(e.answer)
    }
    expect(vistos.has(0)).toBe(true)
    for (const e of muchos({ kind: 'place-value', ask: 'tens' }).map(number)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(e.answer, e.question).toBe(Math.floor(n / 10))
    }
  })

  it('componer un número a partir de decenas y unidades', () => {
    for (const e of muchos({ kind: 'place-value', ask: 'compose' }).map(number)) {
      const [d, u] = e.question.match(/\d+/g)!.map(Number)
      expect(e.answer, e.question).toBe(d * 10 + u)
      expect(e.question).not.toMatch(/\b1 (decenas|unidades)\b/)
    }
  })

  it('las piezas dibujadas coinciden con el número', () => {
    for (const e of muchos({ kind: 'place-value', ask: 'blocks' }).map(number)) {
      const decenas = [...(e.visual ?? '')].filter((c) => c === '🟦').length
      const unidades = [...(e.visual ?? '')].filter((c) => c === '🟨').length
      expect(e.answer).toBe(decenas * 10 + unidades)
      expect(unidades).toBeGreaterThan(0)
    }
  })

  it('el signo, la frase correcta y el orden son verdad', () => {
    for (const e of muchos({ kind: 'compare', mode: 'sign' }).map(choice)) {
      const [a, b] = e.visual!.match(/\d+/g)!.map(Number)
      expect(a).not.toBe(b)
      expect(e.answer, e.visual).toBe(a > b ? '>' : '<')
    }
    for (const e of muchos({ kind: 'compare', mode: 'statement' }).map(choice)) {
      const [a, op, b] = e.answer.split(' ')
      expect(op === '>' ? Number(a) > Number(b) : Number(a) < Number(b), e.answer).toBe(true)
      for (const opcion of e.options.filter((o) => o !== e.answer)) {
        const [x, o, y] = opcion.split(' ')
        expect(o === '>' ? Number(x) > Number(y) : Number(x) < Number(y), opcion).toBe(false)
      }
    }
    for (const e of muchos({ kind: 'compare', mode: 'order' }).map(choice)) {
      const numeros = e.question.match(/\d+/g)!.map(Number)
      expect(e.answer, e.question).toBe([...numeros].sort((a, b) => a - b).join(', '))
    }
  })

  it('los problemas se resuelven sin llevar y con el resultado correcto', () => {
    for (const operador of ['+', '−'] as const) {
      for (const e of muchos({ kind: 'word-problem', operator: operador }).map(number)) {
        const [a, b] = e.question.match(/\d+/g)!.map(Number)
        expect(e.answer, e.question).toBe(operador === '+' ? a + b : a - b)
        if (operador === '+') expect((a % 10) + (b % 10), e.question).toBeLessThan(10)
        else expect(a % 10, e.question).toBeGreaterThanOrEqual(b % 10)
        expect(e.answer, e.question).toBeGreaterThan(0)
      }
    }
  })

  it('los problemas llevando suman con llevada en las unidades', () => {
    const resultados = muchos({ kind: 'word-problem', operator: '+', carry: true }).map(number).map((e) => {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(e.answer, e.question).toBe(a + b)
      expect((a % 10) + (b % 10), e.question).toBeGreaterThanOrEqual(10)
      expect(e.answer, e.question).toBeLessThanOrEqual(199)
      return e.answer
    })
    expect(resultados.some((r) => r >= 100)).toBe(true)
  })

  it('un problema de resta no puede llevar en esta plantilla', () => {
    expect(() => generate({ kind: 'word-problem', operator: '−', carry: true }, mulberry32(1))).toThrow()
  })

  it('la resta que comprueba una suma da el otro sumando', () => {
    for (const e of muchos({ kind: 'inverse', mode: 'subtract' }).map(number)) {
      const [a, b, c, c2, b2] = e.question.match(/\d+/g)!.map(Number)
      expect(a + b, e.question).toBe(c)
      expect([c2, b2], e.question).toEqual([c, b])
      expect(e.answer, e.question).toBe(a)
      expect(c, e.question).toBeLessThanOrEqual(99)
    }
  })

  it('el sumando que falta completa la suma', () => {
    for (const e of muchos({ kind: 'inverse', mode: 'missing' }).map(number)) {
      const [a, c] = e.question.match(/\d+/g)!.map(Number)
      expect(a + e.answer, e.question).toBe(c)
      expect(e.answer, e.question).toBeGreaterThanOrEqual(10)
    }
  })

  it('la operación que comprueba la suma es la única resta válida entre las opciones', () => {
    for (const e of muchos({ kind: 'inverse', mode: 'operation' }).map(choice)) {
      const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
      expect(a + b, e.question).toBe(c)
      expect(e.answer, e.question).toBe(`${c} − ${b}`)
      const comprueba = (opcion: string) => {
        const [x, signo, y] = opcion.split(' ')
        // comprueba la suma: se resta un sumando del total
        return signo === '−' && Number(x) === c && (Number(y) === a || Number(y) === b)
      }
      expect(e.options.filter(comprueba), e.question).toEqual([e.answer])
    }
  })

  it('los números del 100 al 199 se quedan en ese rango en todas las plantillas', () => {
    const numeros = (texto: string) => (texto.match(/\d+/g) ?? []).map(Number)
    const enRango = (n: number, contexto: string) => {
      expect(n, contexto).toBeGreaterThanOrEqual(100)
      expect(n, contexto).toBeLessThanOrEqual(199)
    }
    for (const modo of ['after', 'before', 'between'] as const) {
      // el número del enunciado está en rango (los distractores pueden salirse por poco)
      for (const e of muchos({ kind: 'neighbor', mode: modo, min: 100, max: 199 })) {
        numeros(e.question).forEach((n) => enRango(n, e.question))
      }
    }
    for (const modo of ['greatest', 'smallest'] as const) {
      for (const e of muchos({ kind: 'extreme', mode: modo, min: 100, max: 199 }).map(choice)) {
        e.options.map(Number).forEach((n) => enRango(n, e.question))
      }
    }
    for (const e of muchos({ kind: 'compare', mode: 'sign', min: 100, max: 199 })) {
      numeros(e.type === 'choice' ? (e.visual ?? '') : '').forEach((n) => enRango(n, e.question))
    }
    for (const e of muchos({ kind: 'compare', mode: 'order', min: 100, max: 199 })) {
      numeros(e.question).forEach((n) => enRango(n, e.question))
    }
    for (const paso of [1, 10] as const) {
      for (const e of muchos({ kind: 'series', step: paso, min: 100, max: 199 }).map(number)) {
        numeros(e.question).forEach((n) => enRango(n, e.question))
        enRango(e.answer, e.question)
      }
    }
  })

  it('el siguiente de un número de 100 a 199 se calcula bien', () => {
    for (const e of muchos({ kind: 'neighbor', mode: 'after', min: 100, max: 199 }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n).toBeLessThan(199)
      expect(e.answer).toBe(String(n + 1))
    }
  })

  it('centenas: leer un número de 100 a 199 da 1 centena y sus decenas y unidades', () => {
    for (const e of muchos({ kind: 'hundreds', ask: 'read' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n, e.question).toBeGreaterThanOrEqual(100)
      expect(n, e.question).toBeLessThanOrEqual(199)
      const d = Math.floor((n % 100) / 10)
      const u = n % 10
      expect(e.answer, e.question).toBe(`1 centena, ${d} ${d === 1 ? 'decena' : 'decenas'} y ${u} ${u === 1 ? 'unidad' : 'unidades'}`)
      for (const opcion of e.options) expect(opcion).not.toMatch(/\b1 (decenas|unidades|centenas)\b/)
    }
  })

  it('centenas: componer un número a partir de una centena, decenas y unidades', () => {
    for (const e of muchos({ kind: 'hundreds', ask: 'compose' }).map(number)) {
      const [c, d, u] = e.question.match(/\d+/g)!.map(Number)
      expect(c).toBe(1)
      expect(e.answer, e.question).toBe(100 + d * 10 + u)
      expect(e.question).not.toMatch(/\b1 (decenas|unidades)\b/)
    }
  })

  it('sumar tres números de una cifra', () => {
    for (const e of muchos({ kind: 'mental', mode: 'add-three' }).map(number)) {
      const m = e.question.match(/^(\d) \+ (\d) \+ (\d) =$/)
      expect(m, e.question).not.toBeNull()
      expect(e.answer, e.question).toBe(Number(m![1]) + Number(m![2]) + Number(m![3]))
      expect(e.answer, e.question).toBeGreaterThanOrEqual(10)
      expect(e.answer, e.question).toBeLessThanOrEqual(25)
    }
  })

  it('ordinales: el dibujo es una fila de 10 distintos y la respuesta es el que ocupa ese lugar', () => {
    const vistos = new Set<string>()
    for (const e of muchos({ kind: 'ordinal', mode: 'position' }).map(choice)) {
      const fila = [...e.visual!]
      expect(fila, e.question).toHaveLength(10)
      expect(new Set(fila).size, e.question).toBe(10)
      const lugar = ORDINALES.findIndex((palabra) => e.question.includes(` ${palabra}?`))
      expect(lugar, e.question).toBeGreaterThanOrEqual(0)
      expect(e.answer, e.question).toBe(fila[lugar])
      for (const opcion of e.options) expect(fila, e.question).toContain(opcion)
      vistos.add(ORDINALES[lugar])
    }
    expect(vistos.size).toBe(10)
  })

  it('ordinales: el nombre se asocia con su número, con opciones distintas', () => {
    for (const e of muchos({ kind: 'ordinal', mode: 'name' }).map(choice)) {
      const lugar = ORDINALES.findIndex((palabra) => e.question.includes(`"${palabra}"`))
      expect(lugar, e.question).toBeGreaterThanOrEqual(0)
      expect(e.answer, e.question).toBe(`${lugar + 1}.º`)
      for (const opcion of e.options) {
        const n = Number(opcion.replace('.º', ''))
        expect(n).toBeGreaterThanOrEqual(1)
        expect(n).toBeLessThanOrEqual(10)
      }
    }
  })

  it('la decena más cercana es la más cercana y nunca hay empate', () => {
    for (const e of muchos({ kind: 'nearest-ten' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n % 10, e.question).not.toBe(5)
      expect(n % 10, e.question).not.toBe(0)
      expect(e.answer, e.question).toBe(String(Math.round(n / 10) * 10))
      expect(e.options, e.question).toHaveLength(2)
    }
  })

  it('las sumas llevando salen marcadas, llevan en las unidades y a veces pasan de 99', () => {
    const resultados = muchos({ kind: 'column', operator: '+', carry: true }).map((e) => {
      if (e.type !== 'column') throw new Error('se esperaba una columna')
      expect(e.carry).toBe(true)
      return e.answer
    })
    expect(resultados.some((r) => r < 100)).toBe(true)
    expect(resultados.some((r) => r >= 100)).toBe(true)
  })

  it('las columnas sin llevar no llevan la marca', () => {
    for (const operator of ['+', '−'] as const) {
      for (const e of muchos({ kind: 'column', operator })) {
        expect(e.type === 'column' && e.carry).toBeFalsy()
      }
    }
  })

  it('el cálculo mental da el resultado correcto', () => {
    for (const modo of ['add-bridge', 'sub-bridge', 'tens-add', 'tens-sub'] as const) {
      for (const e of muchos({ kind: 'mental', mode: modo }).map(number)) {
        const m = e.question.match(/^(\d+) ([+−]) (\d+) =$/)
        expect(m, e.question).not.toBeNull()
        const [, a, op, b] = m!
        expect(e.answer, e.question).toBe(op === '+' ? Number(a) + Number(b) : Number(a) - Number(b))
        if (modo === 'add-bridge') expect(e.answer).toBeGreaterThan(10)
        if (modo === 'sub-bridge') expect(e.answer).toBeLessThan(10)
        if (modo.startsWith('tens')) expect(Number(a) % 10 + (Number(b) % 10)).toBe(0)
        expect(e.answer).toBeGreaterThanOrEqual(0)
        expect(e.answer).toBeLessThanOrEqual(100)
      }
    }
  })
})
