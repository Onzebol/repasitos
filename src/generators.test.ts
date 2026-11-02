import { describe, expect, it } from 'vitest'
import { generate } from './generators'
import { ANIMALES } from './infantil/animales'
import { nombreNumero } from './numberNames'
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
function esValido(e: Exercise, spec?: BlockSpec) {
  expect(e.question.trim(), 'enunciado').not.toBe('')
  // Con `oneDigit` el segundo número es de una cifra (83 + 5)
  const unaCifra = spec?.kind === 'column' && spec.oneDigit === true
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
  } else if (e.type === 'route-program') {
    expect(e.route.cells, e.question).toHaveLength(4)
    expect(e.answer, e.question).toMatch(/^(\d+[<>^v] ?)+$/)
  } else if (e.type === 'table-fill') {
    expect(e.blanks, e.question).toHaveLength(5)
    expect(new Set(e.blanks).size, e.question).toBe(5)
    for (const hueco of e.blanks) expect(Number.isInteger(hueco) && hueco >= 0 && hueco <= 9, e.question).toBe(true)
  } else {
    const nombre = `${e.top} ${e.operator} ${e.bottom}`
    expect(e.top, nombre).toBeGreaterThanOrEqual(10)
    expect(e.top, nombre).toBeLessThanOrEqual(99)
    expect(e.bottom, nombre).toBeGreaterThanOrEqual(unaCifra ? 1 : 10)
    expect(e.bottom, nombre).toBeLessThanOrEqual(unaCifra ? 9 : 99)
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
  { kind: 'series', step: 4, min: 0, max: 20 },
  { kind: 'series', step: 3, min: 0, max: 20, down: true },
  { kind: 'operation-sign' },
  { kind: 'table-99', ask: 'row' },
  { kind: 'table-99', ask: 'column' },
  { kind: 'table-99', ask: 'missing' },
  { kind: 'route', ask: 'where' },
  { kind: 'route', ask: 'which' },
  { kind: 'route', ask: 'passes' },
  { kind: 'table-fill', ask: 'row' },
  { kind: 'table-fill', ask: 'column' },
  { kind: 'route-program' },
  { kind: 'number-name', ask: 'read' },
  { kind: 'number-name', ask: 'write' },
  { kind: 'decompose', ask: 'sum' },
  { kind: 'decompose', ask: 'pieces' },
  { kind: 'decompose', ask: 'words' },
  { kind: 'tens-units', ask: 'to-units' },
  { kind: 'tens-units', ask: 'to-tens' },
  { kind: 'digit-clue', ask: 'tens' },
  { kind: 'digit-clue', ask: 'units' },
  { kind: 'place-value', ask: 'read' },
  { kind: 'place-value', ask: 'tens' },
  { kind: 'place-value', ask: 'units' },
  { kind: 'place-value', ask: 'compose' },
  { kind: 'place-value', ask: 'blocks' },
  { kind: 'compare', mode: 'sign' },
  { kind: 'compare', mode: 'statement' },
  { kind: 'compare', mode: 'order' },
  { kind: 'compare', mode: 'complete' },
  { kind: 'compare', mode: 'context' },
  { kind: 'column', operator: '+' },
  { kind: 'column', operator: '−' },
  { kind: 'column', operator: '+', oneDigit: true },
  { kind: 'column', operator: '−', oneDigit: true },
  { kind: 'problem-step', ask: 'operation' },
  { kind: 'problem-step', ask: 'calculate' },
  { kind: 'two-steps', mode: 'add-sub' },
  { kind: 'two-steps', mode: 'sub-add' },
  { kind: 'mental', mode: 'add-small' },
  { kind: 'mental', mode: 'sub-small' },
  { kind: 'column', operator: '+', carry: true },
  { kind: 'word-problem', operator: '+' },
  { kind: 'word-problem', operator: '−' },
  { kind: 'word-problem', operator: '+', carry: true },
  { kind: 'nearest-ten' },
  { kind: 'nearest-ten', ask: 'between' },
  { kind: 'nearest-ten', ask: 'rule' },
  { kind: 'nearest-ten', ask: 'approx' },
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
    for (const e of muchos(spec)) esValido(e, spec)
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

describe('generate: ¿cuántos hay? (Infantil)', () => {
  const ejercicios = () => muchos({ kind: 'how-many' }).map(choice)

  it('dibuja tantos animales como dice la respuesta, del 1 al 7 por defecto', () => {
    for (const e of ejercicios()) {
      const dibujos = [...(e.visual ?? '')]
      expect(dibujos.length, e.question).toBe(Number(e.answer))
      expect(new Set(dibujos).size, 'todos del mismo animal').toBe(1)
      expect(Number(e.answer)).toBeGreaterThanOrEqual(1)
      expect(Number(e.answer)).toBeLessThanOrEqual(7)
    }
  })

  it('la pregunta nombra al animal con su género y su plural', () => {
    for (const e of ejercicios()) {
      const animal = ANIMALES.find((a) => a.emoji === [...(e.visual ?? '')][0])
      expect(animal, e.visual).toBeDefined()
      expect(e.question).toBe(`¿Cuánt${animal!.fem ? 'as' : 'os'} ${animal!.plural} hay?`)
    }
  })

  it('ofrece tres cifras distintas entre las que está la respuesta, todas dentro del rango', () => {
    for (const e of ejercicios()) {
      expect(e.options).toHaveLength(3)
      expect(e.options).toContain(e.answer)
      for (const opcion of e.options) {
        expect(Number(opcion)).toBeGreaterThanOrEqual(1)
        expect(Number(opcion)).toBeLessThanOrEqual(7)
      }
    }
  })

  it('respeta el rango pedido y salen todas las cantidades', () => {
    const respuestas = muchos({ kind: 'how-many', min: 2, max: 5 }).map((e) => Number(choice(e).answer))
    expect(new Set(respuestas)).toEqual(new Set([2, 3, 4, 5]))
  })

  it('con tap: true hay que contar tocando cada dibujo antes de elegir la cifra; sin tap, no', () => {
    for (const e of muchos({ kind: 'how-many', tap: true }).map(choice)) {
      expect(e.tapToCount).toBe(true)
      expect([...(e.visual ?? '')].length).toBe(Number(e.answer))
    }
    for (const e of ejercicios()) expect(e.tapToCount).toBeFalsy()
  })

  it('usa todos los animales de la lista, para que las sesiones no se repitan', () => {
    const usados = new Set(ejercicios().map((e) => [...(e.visual ?? '')][0]))
    expect(usados.size).toBe(ANIMALES.length)
  })
})

describe('generate: las cifras (Infantil)', () => {
  const ejercicios = (spec: BlockSpec = { kind: 'digit' }) => muchos(spec).map(choice)

  it('pide tocar una cifra del 1 al 9 por defecto, con tres cifras distintas entre las que está', () => {
    for (const e of ejercicios()) {
      expect(e.question).toBe(`Toca el número ${e.answer}`)
      expect(e.options).toHaveLength(3)
      expect(e.options).toContain(e.answer)
      for (const opcion of e.options) {
        expect(Number(opcion)).toBeGreaterThanOrEqual(1)
        expect(Number(opcion)).toBeLessThanOrEqual(9)
      }
    }
  })

  it('respeta el rango pedido y salen todas las cifras', () => {
    const respuestas = ejercicios({ kind: 'digit', min: 0, max: 4 }).map((e) => Number(e.answer))
    expect(new Set(respuestas)).toEqual(new Set([0, 1, 2, 3, 4]))
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

  it('las series pueden saltar de 2 a 5 y bajar, sin salirse del rango', () => {
    for (const paso of [2, 3, 4, 5] as const) {
      for (const down of [false, true]) {
        for (const e of muchos({ kind: 'series', step: paso, min: 0, max: 20, down }).map(number)) {
          const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
          const signo = down ? -1 : 1
          expect(b - a, e.question).toBe(signo * paso)
          expect(c - b, e.question).toBe(signo * paso)
          expect(e.answer, e.question).toBe(c + signo * paso)
          for (const n of [a, b, c, e.answer]) {
            expect(n, e.question).toBeGreaterThanOrEqual(0)
            expect(n, e.question).toBeLessThanOrEqual(20)
          }
        }
      }
    }
  })

  it('las series hacia atrás por defecto también salen de dos cifras y bajan de 1 en 1 o de 10 en 10', () => {
    for (const paso of [1, 10] as const) {
      for (const e of muchos({ kind: 'series', step: paso, down: true }).map(number)) {
        const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
        expect(a - b, e.question).toBe(paso)
        expect(b - c, e.question).toBe(paso)
        expect(e.answer, e.question).toBe(c - paso)
        expect(e.answer, e.question).toBeGreaterThanOrEqual(10)
      }
    }
  })

  it('elegir el signo: la operación escrita es cierta con el signo de la respuesta y falsa con el otro', () => {
    const vistos = new Set<string>()
    for (const e of muchos({ kind: 'operation-sign' }).map(choice)) {
      const [a, b, c] = e.visual!.match(/\d+/g)!.map(Number)
      expect([...e.options].sort(), e.question).toEqual(['+', '−'])
      const suma = a + b === c
      const resta = a - b === c
      expect(suma !== resta, e.visual).toBe(true) // solo una de las dos es cierta
      expect(e.answer, e.visual).toBe(suma ? '+' : '−')
      // sin llevar y con números de dos cifras, como en la unidad 1
      for (const n of [a, b]) {
        expect(n, e.visual).toBeGreaterThanOrEqual(10)
        expect(n, e.visual).toBeLessThanOrEqual(99)
      }
      expect(c, e.visual).toBeGreaterThan(0)
      expect(c, e.visual).toBeLessThanOrEqual(99)
      if (suma) expect((a % 10) + (b % 10), e.visual).toBeLessThan(10)
      else {
        expect(a % 10, e.visual).toBeGreaterThanOrEqual(b % 10)
        expect(Math.floor(a / 10), e.visual).toBeGreaterThanOrEqual(Math.floor(b / 10))
      }
      vistos.add(e.answer)
    }
    expect(vistos).toEqual(new Set(['+', '−']))
  })

  it('completar una desigualdad: solo una de las tres opciones hace cierta la comparación, en las cuatro formas', () => {
    const formas = new Set<string>()
    for (const e of muchos({ kind: 'compare', mode: 'complete' }).map(choice)) {
      const m = e.visual!.match(/^(\d+|❓)\s+([<>])\s+(\d+|❓)$/)
      expect(m, e.visual).not.toBeNull()
      const [, izquierda, signo, derecha] = m!
      formas.add(`${izquierda === '❓' ? 'hueco' : 'número'}${signo}`)
      const cumple = (x: number) => {
        const [l, r] = [izquierda === '❓' ? x : Number(izquierda), derecha === '❓' ? x : Number(derecha)]
        return signo === '>' ? l > r : l < r
      }
      expect(e.options.map(Number).filter(cumple), e.visual).toEqual([Number(e.answer)])
      expect(e.options, e.visual).toHaveLength(3)
      for (const opcion of e.options) {
        expect(Number(opcion), e.visual).toBeGreaterThanOrEqual(10)
        expect(Number(opcion), e.visual).toBeLessThanOrEqual(99)
      }
    }
    expect(formas).toEqual(new Set(['número>', 'número<', 'hueco>', 'hueco<']))
  })

  it('comparar en contexto: pueblos, edades y mochilas; la respuesta es el nombre con el valor mayor o menor', () => {
    const contextos = new Set<string>()
    for (const e of muchos({ kind: 'compare', mode: 'context' }).map(choice)) {
      expect(e.text, e.question).toBeTruthy()
      expect(e.options, e.question).toHaveLength(3)
      const valor = (nombre: string) => Number(e.text!.match(new RegExp(`${nombre} (\\d+)`))![1])
      const valores = e.options.map(valor)
      expect(new Set(valores).size, e.text).toBe(3)
      const [mayor, menor] = [/más lejos|mayor|pesa más/.test(e.question), /más cerca|menor|pesa menos/.test(e.question)]
      expect(mayor !== menor, e.question).toBe(true)
      expect(valor(e.answer), e.question).toBe(mayor ? Math.max(...valores) : Math.min(...valores))
      for (const v of valores) {
        expect(v, e.text).toBeGreaterThanOrEqual(10)
        expect(v, e.text).toBeLessThanOrEqual(99)
      }
      contextos.add(/pueblo/.test(e.question) ? 'pueblos' : /Quién/.test(e.question) ? 'edades' : 'mochilas')
    }
    expect(contextos).toEqual(new Set(['pueblos', 'edades', 'mochilas']))
  })

  it('un sumando de una cifra: sumas y restas sin llevar como 83 + 5 y 87 − 5', () => {
    for (const operator of ['+', '−'] as const) {
      for (const e of muchos({ kind: 'column', operator, oneDigit: true })) {
        if (e.type !== 'column') throw new Error('se esperaba una columna')
        expect(e.bottom, `${e.top} ${operator} ${e.bottom}`).toBeLessThan(10)
        expect(e.carry, `${e.top} ${operator} ${e.bottom}`).toBeUndefined()
        // el resultado sigue con dos cifras: las decenas del primer número no cambian
        expect(e.answer, `${e.top} ${operator} ${e.bottom}`).toBeGreaterThanOrEqual(10)
        expect(Math.floor(e.answer / 10), `${e.top} ${operator} ${e.bottom}`).toBe(Math.floor(e.top / 10))
      }
    }
  })

  it('pasos de un problema: elegir sumar o restar y el total o la diferencia a partir de un texto', () => {
    for (const ask of ['operation', 'calculate'] as const) {
      for (const e of muchos({ kind: 'problem-step', ask }).map(choice)) {
        const texto = e.text!
        const suma = /regalan|llegan|en total|por la tarde/.test(texto)
        const resta = /Saco|me como|se bajan|se pinchan/.test(texto)
        expect(suma !== resta, texto).toBe(true)
        const [a, b] = texto.match(/\d+/g)!.map(Number)
        expect(suma ? (a % 10) + (b % 10) < 10 : a % 10 >= b % 10 && a > b, texto).toBe(true)
        if (ask === 'operation') {
          expect(e.question).toBe('¿Hay que sumar o restar?')
          expect([...e.options].sort()).toEqual(['restar', 'sumar'])
          expect(e.answer, texto).toBe(suma ? 'sumar' : 'restar')
        } else {
          expect(e.question).toBe('¿Qué hay que calcular?')
          expect([...e.options].sort()).toEqual(['el total', 'la diferencia'])
          expect(e.answer, texto).toBe(suma ? 'el total' : 'la diferencia')
        }
      }
    }
  })

  it('problemas de dos pasos: sumar y restar (o restar y sumar) sin llevar y sin salirse de 1 a 99', () => {
    for (const mode of ['add-sub', 'sub-add'] as const) {
      for (const e of muchos({ kind: 'two-steps', mode }).map(number)) {
        const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
        const intermedio = mode === 'add-sub' ? a + b : a - b
        expect(e.answer, e.question).toBe(mode === 'add-sub' ? a + b - c : a - b + c)
        for (const n of [intermedio, e.answer]) {
          expect(n, e.question).toBeGreaterThanOrEqual(1)
          expect(n, e.question).toBeLessThanOrEqual(99)
        }
        if (mode === 'add-sub') {
          expect((a % 10) + (b % 10), e.question).toBeLessThan(10)
          expect(intermedio % 10, e.question).toBeGreaterThanOrEqual(c % 10)
        } else {
          expect(a % 10, e.question).toBeGreaterThanOrEqual(b % 10)
          expect((intermedio % 10) + (c % 10), e.question).toBeLessThan(10)
        }
      }
    }
  })

  it('cálculo mental fácil: sumas que no pasan de 10 y restas de números hasta el 10', () => {
    for (const e of muchos({ kind: 'mental', mode: 'add-small' }).map(number)) {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(e.question).toMatch(/^\d \+ \d =$/)
      expect(a, e.question).toBeGreaterThanOrEqual(1)
      expect(b, e.question).toBeGreaterThanOrEqual(1)
      expect(e.answer, e.question).toBe(a + b)
      expect(e.answer, e.question).toBeLessThanOrEqual(10)
    }
    for (const e of muchos({ kind: 'mental', mode: 'sub-small' }).map(number)) {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(e.question).toMatch(/^\d+ − \d =$/)
      expect(a, e.question).toBeLessThanOrEqual(10)
      expect(b, e.question).toBeGreaterThanOrEqual(1)
      expect(b, e.question).toBeLessThan(a)
      expect(e.answer, e.question).toBe(a - b)
    }
  })

  it('completar una fila de la tabla: de las decenas 1 a 9, con cinco huecos ordenados entre los diez números', () => {
    const filas = new Set<number>()
    for (const e of muchos({ kind: 'table-fill', ask: 'row' })) {
      if (e.type !== 'table-fill') throw new Error('se esperaba completar la tabla')
      expect(e.question).toBe('Completa la fila amarilla')
      expect(e.line).toBe('row')
      expect(e.index, e.answer).toBeGreaterThanOrEqual(1) // la fila 0 empieza por «0»
      expect(e.index, e.answer).toBeLessThanOrEqual(9)
      expect(e.blanks, e.answer).toEqual([...e.blanks].sort((a, b) => a - b))
      expect(e.answer).toBe(`${e.index * 10} a ${e.index * 10 + 9}`)
      filas.add(e.index)
    }
    expect(filas.size).toBe(9)
  })

  it('completar una columna de la tabla: de las unidades 0 a 9, sin pedir nunca el número de una cifra (02)', () => {
    const columnas = new Set<number>()
    const huecos = new Set<number>()
    for (const e of muchos({ kind: 'table-fill', ask: 'column' })) {
      if (e.type !== 'table-fill') throw new Error('se esperaba completar la tabla')
      expect(e.question).toBe('Completa la columna naranja')
      expect(e.line).toBe('column')
      expect(e.index, e.answer).toBeGreaterThanOrEqual(0)
      expect(e.index, e.answer).toBeLessThanOrEqual(9)
      expect(e.blanks, e.answer).toEqual([...e.blanks].sort((a, b) => a - b))
      expect(e.blanks, e.answer).not.toContain(0) // la casilla de arriba (02) siempre viene dada
      expect(e.answer).toBe(`${String(e.index).padStart(2, '0')} a ${90 + e.index}`)
      columnas.add(e.index)
      e.blanks.forEach((h) => huecos.add(h))
    }
    expect(columnas.size).toBe(10)
    expect(huecos.size, 'salen todas las posiciones del 1 al 9').toBe(9)
  })

  it('tabla del 99, fila: todos los números de la fila empiezan por la cifra de las decenas', () => {
    const filas = new Set<number>()
    for (const e of muchos({ kind: 'table-99', ask: 'row' }).map(choice)) {
      expect(e.question).toBe('Todos los números de la fila amarilla empiezan por…')
      const fila = e.table!.row!
      expect(e.table, e.question).toEqual({ row: fila })
      expect(fila, e.question).toBeGreaterThanOrEqual(1)
      expect(fila, e.question).toBeLessThanOrEqual(9)
      expect(e.answer).toBe(String(fila))
      expect(e.options).toHaveLength(3)
      for (const opcion of e.options) expect(Number(opcion)).toBeGreaterThanOrEqual(1)
      filas.add(fila)
    }
    expect(filas.size).toBe(9)
  })

  it('tabla del 99, columna: todos los números de la columna acaban en la cifra de las unidades', () => {
    const columnas = new Set<number>()
    for (const e of muchos({ kind: 'table-99', ask: 'column' }).map(choice)) {
      expect(e.question).toBe('Todos los números de la columna naranja acaban en…')
      const col = e.table!.col!
      expect(e.table, e.question).toEqual({ col })
      expect(col, e.question).toBeGreaterThanOrEqual(0)
      expect(col, e.question).toBeLessThanOrEqual(9)
      expect(e.answer).toBe(String(col))
      expect(e.options).toHaveLength(3)
      for (const opcion of e.options) {
        expect(Number(opcion)).toBeGreaterThanOrEqual(0)
        expect(Number(opcion)).toBeLessThanOrEqual(9)
      }
      columnas.add(col)
    }
    expect(columnas.size).toBe(10)
  })

  it('tabla del 99, número que falta: el hueco está en su fila y columna y las otras opciones son números parecidos', () => {
    for (const e of muchos({ kind: 'table-99', ask: 'missing' }).map(choice)) {
      expect(e.question).toBe('¿Qué número falta?')
      const { row, col, hole } = e.table!
      expect(hole, e.question).toBeGreaterThanOrEqual(10)
      expect(hole, e.question).toBeLessThanOrEqual(99)
      expect(row, e.question).toBe(Math.floor(hole! / 10))
      expect(col, e.question).toBe(hole! % 10)
      expect(e.answer).toBe(String(hole))
      expect(e.options).toHaveLength(3)
      for (const opcion of e.options) {
        expect(Number(opcion)).toBeGreaterThanOrEqual(10)
        expect(Number(opcion)).toBeLessThanOrEqual(99)
      }
      // si las cifras son distintas y la de las unidades no es 0, una opción es el número con las cifras cambiadas (47 y 74)
      if (hole! % 10 !== 0 && hole! % 10 !== row) {
        expect(e.options, e.question).toContain(String((hole! % 10) * 10 + row!))
      }
    }
  })

  it('leer un número: la respuesta es su nombre y las otras dos opciones son nombres de otros números', () => {
    const numeros = new Set<number>()
    for (const e of muchos({ kind: 'number-name', ask: 'read' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      numeros.add(n)
      expect(n, e.question).toBeGreaterThanOrEqual(10)
      expect(n, e.question).toBeLessThanOrEqual(99)
      expect(e.answer, e.question).toBe(nombreNumero(n))
      expect(e.options, e.question).toHaveLength(3)
      for (const opcion of e.options) {
        const otro = Array.from({ length: 90 }, (_, i) => i + 10).find((m) => nombreNumero(m) === opcion)
        expect(otro, `${e.question} → ${opcion}`).toBeDefined()
      }
    }
    // salen números de todas las decenas, también del 10 al 19
    expect(new Set([...numeros].map((n) => Math.floor(n / 10))).size).toBe(9)
  })

  it('escribir con cifras: la respuesta es el número que dice el nombre', () => {
    for (const e of muchos({ kind: 'number-name', ask: 'write' }).map(number)) {
      const nombre = e.question.replace('Escribe con cifras: ', '')
      expect(nombreNumero(e.answer), e.question).toBe(nombre)
    }
  })

  it('descomponer en una suma: falta la decena o la unidad y se escribe con cifras', () => {
    const faltan = new Set<string>()
    for (const e of muchos({ kind: 'decompose', ask: 'sum' }).map(number)) {
      const coincidencia = e.question.match(/(\d+) = (\d+|❓) \+ (\d+|❓)/)
      expect(coincidencia, e.question).not.toBeNull()
      const [, total, a, b] = coincidencia!
      const [conocido, falta] = a === '❓' ? [Number(b), 'primero'] : [Number(a), 'segundo']
      faltan.add(falta)
      expect(conocido + e.answer, e.question).toBe(Number(total))
      // un sumando es la decena (acaba en 0) y el otro la unidad (una cifra, no 0)
      const [decena, unidad] = [conocido, e.answer].sort((x, y) => y - x)
      expect(decena % 10, e.question).toBe(0)
      expect(unidad, e.question).toBeGreaterThanOrEqual(1)
      expect(unidad, e.question).toBeLessThanOrEqual(9)
    }
    expect(faltan).toEqual(new Set(['primero', 'segundo']))
  })

  it('«4 decenas y 3 unidades»: la respuesta es la suma 40 + 3 y las otras no valen', () => {
    for (const e of muchos({ kind: 'decompose', ask: 'pieces' }).map(choice)) {
      const [d, u] = e.question.match(/\d+/g)!.map(Number)
      expect(d, e.question).not.toBe(u)
      expect(e.question, e.question).toContain(d === 1 ? '1 decena' : `${d} decenas`)
      expect(e.question, e.question).toContain(u === 1 ? '1 unidad' : `${u} unidades`)
      expect(e.answer, e.question).toBe(`${d * 10} + ${u}`)
      expect(e.options, e.question).toHaveLength(3)
      for (const opcion of e.options.filter((o) => o !== e.answer)) {
        const [x, y] = opcion.split(' + ').map(Number)
        expect(x * 1 + y * 1 === d * 10 + u, `${e.question} → ${opcion}`).toBe(false)
      }
    }
  })

  it('«30 + 4»: la respuesta es cómo se lee ese número', () => {
    for (const e of muchos({ kind: 'decompose', ask: 'words' }).map(choice)) {
      const [a, b] = e.question.match(/\d+/g)!.map(Number)
      expect(a % 10, e.question).toBe(0)
      expect(b, e.question).toBeGreaterThanOrEqual(1)
      expect(b, e.question).toBeLessThanOrEqual(9)
      expect(e.answer, e.question).toBe(nombreNumero(a + b))
      expect(e.options, e.question).toHaveLength(3)
    }
  })

  it('decenas ↔ unidades: 1 decena son 10 unidades, con singular y plural', () => {
    for (const e of muchos({ kind: 'tens-units', ask: 'to-units' }).map(number)) {
      const d = Number(e.question.match(/\d+/)![0])
      expect(d, e.question).toBeGreaterThanOrEqual(1)
      expect(d, e.question).toBeLessThanOrEqual(9)
      expect(e.question, e.question).toContain(d === 1 ? '1 decena' : `${d} decenas`)
      expect(e.question, e.question).toMatch(/unidades/)
      expect(e.answer, e.question).toBe(d * 10)
    }
    for (const e of muchos({ kind: 'tens-units', ask: 'to-tens' }).map(number)) {
      const u = Number(e.question.match(/\d+/)![0])
      expect(u % 10, e.question).toBe(0)
      expect(u, e.question).toBeGreaterThanOrEqual(10)
      expect(u, e.question).toBeLessThanOrEqual(90)
      expect(e.question, e.question).toContain(`${u} unidades`)
      expect(e.question, e.question).toMatch(/decenas/)
      expect(e.answer, e.question).toBe(u / 10)
    }
  })

  it('«¿Qué número tiene 3 decenas?» y «…7 unidades?»: solo la respuesta cumple la condición', () => {
    for (const lugar of ['tens', 'units'] as const) {
      for (const e of muchos({ kind: 'digit-clue', ask: lugar }).map(choice)) {
        const cifra = Number(e.question.match(/\d+/)![0])
        const palabra = lugar === 'tens' ? (cifra === 1 ? 'decena' : 'decenas') : cifra === 1 ? 'unidad' : 'unidades'
        expect(e.question, e.question).toContain(`${cifra} ${palabra}`)
        const cumple = (opcion: string) => (lugar === 'tens' ? Math.floor(Number(opcion) / 10) : Number(opcion) % 10) === cifra
        expect(e.options.filter(cumple), e.question).toEqual([e.answer])
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) {
          expect(Number(opcion), e.question).toBeGreaterThanOrEqual(10)
          expect(Number(opcion), e.question).toBeLessThanOrEqual(99)
        }
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

  it('la decena más cercana también se pregunta para el 6, 7, 8 y 9 (la de arriba es el 10)', () => {
    const pequenos = muchos({ kind: 'nearest-ten' })
      .map(choice)
      .filter((e) => Number(e.question.match(/\d+/)![0]) < 10)
    expect(pequenos.length).toBeGreaterThan(0)
    for (const e of pequenos) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n, e.question).toBeGreaterThanOrEqual(6)
      expect(e.answer, e.question).toBe('10')
      expect(e.options, e.question).not.toContain('0')
    }
  })

  it('«¿Entre qué dos decenas está…?» da dos decenas seguidas que rodean al número', () => {
    for (const e of muchos({ kind: 'nearest-ten', ask: 'between' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n % 10, e.question).not.toBe(0)
      const bajo = Math.floor(n / 10) * 10
      expect(e.answer, e.question).toBe(`${bajo} y ${bajo + 10}`)
      expect(e.options, e.question).toHaveLength(3)
      for (const opcion of e.options) {
        const [x, y] = opcion.split(' y ').map(Number)
        expect(y - x, opcion).toBe(10)
        expect(x % 10, opcion).toBe(0)
        expect(x, opcion).toBeGreaterThanOrEqual(0)
        expect(y, opcion).toBeLessThanOrEqual(100)
      }
    }
  })

  it('la regla del 5: la cifra de las unidades es mayor o menor que 5 y nunca igual', () => {
    const respuestas = new Set<string>()
    for (const e of muchos({ kind: 'nearest-ten', ask: 'rule' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n % 10, e.question).not.toBe(5)
      expect([...e.options].sort(), e.question).toEqual(['mayor que 5', 'menor que 5'])
      expect(e.answer, e.question).toBe(n % 10 > 5 ? 'mayor que 5' : 'menor que 5')
      respuestas.add(e.answer)
    }
    expect(respuestas.size).toBe(2)
  })

  it('«más o menos»: la respuesta es la decena más cercana y las otras opciones son otras decenas', () => {
    for (const e of muchos({ kind: 'nearest-ten', ask: 'approx' }).map(choice)) {
      const n = Number(e.question.match(/\d+/)![0])
      expect(n % 10, e.question).not.toBe(5)
      expect(n % 10, e.question).not.toBe(0)
      expect(e.question, e.question).toMatch(/más o menos/i)
      expect(e.answer, e.question).toBe(String(Math.round(n / 10) * 10))
      expect(e.options, e.question).toHaveLength(3)
      for (const opcion of e.options) {
        expect(Number(opcion) % 10, e.question).toBe(0)
        expect(Number(opcion), e.question).toBeGreaterThanOrEqual(0)
        expect(Number(opcion), e.question).toBeLessThanOrEqual(100)
      }
      // la otra decena que rodea al número también es una opción equivocada
      const bajo = Math.floor(n / 10) * 10
      expect(e.options, e.question).toContain(String(Math.round(n / 10) * 10 === bajo ? bajo + 10 : bajo))
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
