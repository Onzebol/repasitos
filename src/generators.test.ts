import { describe, expect, it } from 'vitest'
import emojiFont from './assets/emoji-font.css?raw'
import { emojisDeLaFuente } from './emojiFont'
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
  } else if (e.type === 'table-paint') {
    expect(e.targets.length, e.question).toBeGreaterThanOrEqual(1)
    expect(e.targets, e.question).toEqual([...e.targets].sort((a, b) => a - b))
    expect(new Set(e.targets).size, e.question).toBe(e.targets.length)
    for (const n of e.targets) expect(Number.isInteger(n) && n >= 0 && n <= 99, e.question).toBe(true)
  } else if (e.type === 'route-program') {
    expect(e.route.cells, e.question).toHaveLength(4)
    expect(e.answer, e.question).toMatch(/^(\d+[<>^v] ?)+$/)
  } else if (e.type === 'table-fill') {
    expect(e.blanks, e.question).toHaveLength(5)
    expect(new Set(e.blanks).size, e.question).toBe(5)
    for (const hueco of e.blanks) expect(Number.isInteger(hueco) && hueco >= 0 && hueco <= 9, e.question).toBe(true)
  } else if (e.third !== undefined) {
    // Tres sumandos de una o dos cifras, sin pasar de 99
    const nombre = `${e.top} + ${e.bottom} + ${e.third}`
    expect(e.operator, nombre).toBe('+')
    for (const n of [e.top, e.bottom, e.third]) expect(Number.isInteger(n) && n >= 1 && n <= 99, nombre).toBe(true)
    expect(e.answer, nombre).toBe(e.top + e.bottom + e.third)
    expect(e.answer, nombre).toBeLessThanOrEqual(99)
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
  { kind: 'code-table', ask: 'cell' },
  { kind: 'code-table', ask: 'line' },
  { kind: 'code-table', ask: 'decode' },
  { kind: 'table-fill', ask: 'row' },
  { kind: 'table-fill', ask: 'column' },
  { kind: 'route-program' },
  { kind: 'table-paint', ask: 'units' },
  { kind: 'table-paint', ask: 'tens' },
  { kind: 'table-paint', ask: 'both' },
  { kind: 'table-paint', ask: 'digit' },
  { kind: 'digit-count' },
  { kind: 'hidden-info' },
  { kind: 'score-table', ask: 'hole' },
  { kind: 'score-table', ask: 'round' },
  { kind: 'score-table', ask: 'single' },
  { kind: 'score-table', ask: 'winner' },
  { kind: 'shape-sum', ask: 'sum' },
  { kind: 'shape-sum', ask: 'find' },
  { kind: 'number-name', ask: 'read' },
  { kind: 'number-name', ask: 'write' },
  { kind: 'number-name', ask: 'read', min: 100, max: 199 },
  { kind: 'number-name', ask: 'write', min: 100, max: 199 },
  { kind: 'number-name', ask: 'read', min: 100, max: 900, step: 100 },
  { kind: 'number-name', ask: 'write', min: 100, max: 900, step: 100 },
  { kind: 'decompose', ask: 'sum' },
  { kind: 'decompose', ask: 'pieces' },
  { kind: 'decompose', ask: 'words' },
  { kind: 'tens-units', ask: 'to-units' },
  { kind: 'tens-units', ask: 'to-tens' },
  { kind: 'hundred-units', ask: 'to-tens' },
  { kind: 'hundred-units', ask: 'to-units' },
  { kind: 'hundred-units', ask: 'blocks' },
  { kind: 'hundred-units', ask: 'match' },
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
  { kind: 'compare', mode: 'height' },
  { kind: 'compare', mode: 'order', min: 100, max: 900, step: 100, count: 6 },
  { kind: 'column', operator: '+' },
  { kind: 'column', operator: '−' },
  { kind: 'column', operator: '+', oneDigit: true },
  { kind: 'column', operator: '−', oneDigit: true },
  { kind: 'problem-step', ask: 'operation' },
  { kind: 'compare-problem', ask: 'operation' },
  { kind: 'compare-problem', ask: 'calculate' },
  { kind: 'compare-problem', ask: 'calculate', carry: true },
  { kind: 'chain', ask: 'second' },
  { kind: 'chain', ask: 'third' },
  { kind: 'problem-step', ask: 'calculate' },
  { kind: 'problem-step', ask: 'operation', faltan: true },
  { kind: 'problem-step', ask: 'calculate', faltan: true },
  { kind: 'word-problem', operator: '−', faltan: true },
  { kind: 'two-steps', mode: 'add-sub' },
  { kind: 'two-steps', mode: 'sub-add' },
  { kind: 'mental', mode: 'add-small' },
  { kind: 'mental', mode: 'sub-small' },
  { kind: 'column', operator: '+', carry: true },
  { kind: 'column', operator: '+', carry: true, addends: 3 },
  { kind: 'flag-numbers', ask: 'max-min' },
  { kind: 'flag-numbers', ask: 'two-largest' },
  { kind: 'flag-numbers', ask: 'three-smallest' },
  { kind: 'column', operator: '+', carry: true, oneDigit: true },
  { kind: 'carry-spot' },
  { kind: 'carry-spot', operator: '−' },
  { kind: 'carry-spot', operator: '−', ask: 'type' },
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
  { kind: 'subtraction-terms' },
  { kind: 'check-subtraction' },
  { kind: 'inverse', mode: 'both' },
  { kind: 'inverse', mode: 'both', small: true },
  { kind: 'family', ask: 'sum' },
  { kind: 'family', ask: 'subtract' },
  { kind: 'family', ask: 'sum', drawing: true },
  { kind: 'family', ask: 'subtract', drawing: true },
  { kind: 'inverse', mode: 'missing', small: true },
  { kind: 'inverse', mode: 'missing', round: true },
  { kind: 'inverse', mode: 'missing-minuend' },
  { kind: 'inverse', mode: 'missing-minuend', round: true },
  { kind: 'ordinal', mode: 'position' },
  { kind: 'ordinal', mode: 'name' },
  { kind: 'ordinal', mode: 'read' },
  { kind: 'ordinal', mode: 'read', feminine: true },
  { kind: 'ordinal', mode: 'name', feminine: true },
  { kind: 'ordinal', mode: 'position', noun: true },
  { kind: 'ordinal', mode: 'ranking' },
  { kind: 'ordinal', mode: 'floors' },
  { kind: 'neighbor', mode: 'after', min: 100, max: 199 },
  { kind: 'neighbor', mode: 'before', min: 100, max: 199 },
  { kind: 'neighbor', mode: 'between', min: 100, max: 199 },
  { kind: 'extreme', mode: 'greatest', min: 100, max: 199 },
  { kind: 'extreme', mode: 'smallest', min: 100, max: 199 },
  { kind: 'compare', mode: 'sign', min: 100, max: 199 },
  { kind: 'compare', mode: 'order', min: 100, max: 199 },
  { kind: 'series', step: 1, min: 100, max: 199 },
  { kind: 'series', step: 10, min: 100, max: 199 },
  { kind: 'series', step: 100, min: 100, max: 900 },
  { kind: 'series', step: 100, min: 100, max: 900, down: true },
  { kind: 'series', step: 1, cross: true },
  { kind: 'series', step: 10, cross: true },
  { kind: 'series', step: 1, cross: true, down: true },
  { kind: 'neighbor', mode: 'after', min: 90, max: 110, cross: true },
  { kind: 'neighbor', mode: 'before', min: 90, max: 110, cross: true },
  { kind: 'neighbor', mode: 'between', min: 90, max: 110, cross: true },
  { kind: 'hundreds', ask: 'read' },
  { kind: 'hundreds', ask: 'compose' },
  { kind: 'mental', mode: 'add-three' },
  { kind: 'mental', mode: 'missing-three' },
  { kind: 'mental', mode: 'compare-ten' },
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
      // Cruzar el 99 → 100 (`cross`) tiene por diseño pocas variantes: después del 98, 99 o 100, entre el 99 y el 101…
      const minimo = 'cross' in spec && spec.cross ? 1 : 5
      expect(distintos.size, JSON.stringify(spec)).toBeGreaterThan(minimo)
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

  it('las series de 100 en 100 suben y bajan por las centenas redondas, de 100 a 900', () => {
    const empiezan = new Set<number>()
    for (const down of [false, true]) {
      for (const e of muchos({ kind: 'series', step: 100, min: 100, max: 900, down }).map(number)) {
        const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
        const signo = down ? -1 : 1
        expect(b - a, e.question).toBe(signo * 100)
        expect(c - b, e.question).toBe(signo * 100)
        expect(e.answer, e.question).toBe(c + signo * 100)
        for (const n of [a, b, c, e.answer]) {
          expect(n % 100, e.question).toBe(0)
          expect(n, e.question).toBeGreaterThanOrEqual(100)
          expect(n, e.question).toBeLessThanOrEqual(900)
        }
        empiezan.add(down ? -a : a)
      }
    }
    // suben desde 100 hasta 600 y bajan desde 900 hasta 400: salen todas las salidas posibles
    expect(empiezan).toEqual(new Set([100, 200, 300, 400, 500, 600, -400, -500, -600, -700, -800, -900]))
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

  describe('compare height: alturas que cruzan el 99 → 100', () => {
    it('la respuesta es el monumento más alto o más bajo y siempre se mezclan números de dos y de tres cifras', () => {
      const preguntas = new Set<string>()
      for (const e of muchos({ kind: 'compare', mode: 'height' }).map(choice)) {
        expect(e.text, e.question).toMatch(/^Alturas: .+ \d+ m, .+ \d+ m, .+ \d+ m\.$/)
        expect(e.options, e.question).toHaveLength(3)
        const valor = (nombre: string) => Number(e.text!.match(new RegExp(`${nombre} (\\d+) m`))![1])
        const valores = e.options.map(valor)
        expect(new Set(valores).size, e.text).toBe(3)
        for (const v of valores) {
          expect(v, e.text).toBeGreaterThanOrEqual(80)
          expect(v, e.text).toBeLessThanOrEqual(199)
        }
        // la trampa de «el 9 es mayor que el 1»: al menos un número de dos cifras y otro de tres
        expect(valores.some((v) => v < 100), e.text).toBe(true)
        expect(valores.some((v) => v >= 100), e.text).toBe(true)
        const alto = e.question === '¿Qué monumento es más alto?'
        const bajo = e.question === '¿Qué monumento es más bajo?'
        expect(alto !== bajo, e.question).toBe(true)
        expect(valor(e.answer), e.text).toBe(alto ? Math.max(...valores) : Math.min(...valores))
        preguntas.add(e.question)
      }
      expect(preguntas.size).toBe(2)
    })

    it('el más bajo tiene dos cifras y el más alto tres: la respuesta cruza el 99 → 100 en las dos preguntas', () => {
      for (const e of muchos({ kind: 'compare', mode: 'height' }).map(choice)) {
        const respuesta = Number(e.text!.match(new RegExp(`${e.answer} (\\d+) m`))![1])
        // el más bajo siempre es de dos cifras (hay al menos uno) y el más alto siempre de tres
        expect(respuesta < 100, e.question).toBe(e.question.endsWith('más bajo?'))
      }
    })
  })

  describe('cruzar el 99 → 100 (cross: true)', () => {
    const numeros = (texto: string) => texto.match(/\d+/g)!.map(Number)

    describe('series', () => {
      const serie = (spec: BlockSpec) => muchos(spec).map(number).map((e) => ({ e, termino: [...numeros(e.question), e.answer] }))

      it('con salto 1 la serie contiene siempre el 99 y el 100 seguidos y es consecutiva', () => {
        const empiezan = new Set<number>()
        for (const { e, termino } of serie({ kind: 'series', step: 1, cross: true })) {
          expect(termino, e.question).toHaveLength(4)
          expect(termino, e.question).toContain(99)
          expect(termino, e.question).toContain(100)
          termino.forEach((n, i) => i === 0 || expect(n - termino[i - 1], e.question).toBe(1))
          empiezan.add(termino[0])
        }
        expect(empiezan).toEqual(new Set([97, 98, 99]))
      })

      it('hacia atrás: baja de uno en uno por el 100 y el 99', () => {
        const empiezan = new Set<number>()
        for (const { e, termino } of serie({ kind: 'series', step: 1, cross: true, down: true })) {
          expect(termino, e.question).toContain(99)
          expect(termino, e.question).toContain(100)
          termino.forEach((n, i) => i === 0 || expect(termino[i - 1] - n, e.question).toBe(1))
          empiezan.add(termino[0])
        }
        expect(empiezan).toEqual(new Set([100, 101, 102]))
      })

      it('de 10 en 10 pasa de menos de 100 a 100 o más y es consecutiva', () => {
        for (const { e, termino } of serie({ kind: 'series', step: 10, cross: true })) {
          expect(Math.min(...termino), e.question).toBeLessThan(100)
          expect(Math.max(...termino), e.question).toBeGreaterThanOrEqual(100)
          termino.forEach((n, i) => i === 0 || expect(n - termino[i - 1], e.question).toBe(10))
        }
      })

      it('sin cross las series de siempre no cambian (siguen dentro del rango)', () => {
        for (const e of muchos({ kind: 'series', step: 1, min: 100, max: 199 } as BlockSpec).map(number)) {
          expect(e.answer, e.question).toBeGreaterThanOrEqual(100)
        }
      })
    })

    describe('vecinos', () => {
      it.each(['after', 'before', 'between'] as const)('%s: el 99 o el 100 aparece siempre en la pregunta o en la respuesta y es correcta', (mode) => {
        const respuestas = new Set<number>()
        for (const e of muchos({ kind: 'neighbor', mode, min: 90, max: 110, cross: true }).map(choice)) {
          const preguntados = numeros(e.question)
          const respuesta = Number(e.answer)
          respuestas.add(respuesta)
          expect([...preguntados, respuesta].some((n) => n === 99 || n === 100), e.question).toBe(true)
          if (mode === 'after') expect(respuesta, e.question).toBe(preguntados[0] + 1)
          if (mode === 'before') expect(respuesta, e.question).toBe(preguntados[0] - 1)
          if (mode === 'between') expect(respuesta, e.question).toBe((preguntados[0] + preguntados[1]) / 2)
          expect(e.options, e.question).toHaveLength(3)
        }
        // sale la pregunta de cada lado de la frontera
        if (mode === 'after') expect(respuestas).toEqual(new Set([99, 100, 101]))
        if (mode === 'before') expect(respuestas).toEqual(new Set([98, 99, 100]))
        if (mode === 'between') expect(respuestas).toEqual(new Set([99, 100]))
      })
    })
  })

  describe('compare order con seis centenas (400, 900, 700, 100, 500 y 300)', () => {
    const spec = { kind: 'compare', mode: 'order', min: 100, max: 900, step: 100, count: 6 } as const
    const creciente = (numeros: number[]) => numeros.every((n, i) => i === 0 || numeros[i - 1] < n)

    it('seis centenas redondas distintas, con tres opciones de las que solo una está ordenada de menor a mayor', () => {
      for (const e of muchos(spec).map(choice)) {
        const numeros = e.question.match(/\d+/g)!.map(Number)
        expect(numeros, e.question).toHaveLength(6)
        expect(new Set(numeros).size, e.question).toBe(6)
        for (const n of numeros) expect(n % 100 === 0 && n >= 100 && n <= 900, e.question).toBe(true)
        expect(e.options, e.question).toHaveLength(3)
        const ordenadas = e.options.filter((opcion) => creciente(opcion.split(', ').map(Number)))
        expect(ordenadas, e.options.join(' | ')).toEqual([e.answer])
        for (const opcion of e.options) {
          expect(opcion.split(', ').map(Number).sort((a, b) => a - b), `${e.question} → ${opcion}`).toEqual([...numeros].sort((a, b) => a - b))
        }
      }
    })

    it('el enunciado desordenado no sale ya ordenado y menciona los seis números', () => {
      const desordenados = muchos(spec).map(choice).filter((e) => !creciente(e.question.match(/\d+/g)!.map(Number)))
      expect(desordenados.length).toBeGreaterThan(SEMILLAS * 0.9)
    })
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

  describe('problemas de «¿cuántos faltan?» (faltan: true)', () => {
    // El enunciado sin los números: así se cuentan las historias distintas
    const plantilla = (texto: string) => texto.replace(/\d+/g, 'N')

    it('el problema escrito es una resta de completar: el total, lo que ya hay y se pregunta cuántos faltan', () => {
      const historias = new Set<string>()
      for (const e of muchos({ kind: 'word-problem', operator: '−', faltan: true }).map(number)) {
        const [a, b] = e.question.match(/\d+/g)!.map(Number)
        expect(e.question, e.question).toMatch(/falta/)
        expect(e.question, e.question).toMatch(/\?$/)
        expect(a, e.question).toBeGreaterThan(b)
        expect(e.answer, e.question).toBe(a - b)
        // sin llevar, como el resto de problemas de restar
        expect(a % 10, e.question).toBeGreaterThanOrEqual(b % 10)
        historias.add(plantilla(e.question))
      }
      expect(historias.size).toBeGreaterThanOrEqual(4)
    })

    it('con llevada se pide una decena, como en las otras restas', () => {
      for (const e of muchos({ kind: 'word-problem', operator: '−', carry: true, faltan: true }).map(number)) {
        const [a, b] = e.question.match(/\d+/g)!.map(Number)
        expect(e.question, e.question).toMatch(/falta/)
        expect(e.answer, e.question).toBe(a - b)
        expect(a % 10, e.question).toBeLessThan(b % 10)
      }
    })

    it('los pasos del problema: hay que restar y se calcula la diferencia', () => {
      for (const e of muchos({ kind: 'problem-step', ask: 'operation', faltan: true }).map(choice)) {
        expect(e.text, e.question).toMatch(/falta/)
        expect(e.question).toBe('¿Hay que sumar o restar?')
        expect(e.answer, e.text).toBe('restar')
      }
      for (const e of muchos({ kind: 'problem-step', ask: 'calculate', faltan: true }).map(choice)) {
        expect(e.text, e.question).toMatch(/falta/)
        expect(e.question).toBe('¿Qué hay que calcular?')
        expect(e.answer, e.text).toBe('la diferencia')
      }
    })

    it('las historias de quitar de siempre no mencionan lo que falta (cada tipo de resta es distinto)', () => {
      for (const e of muchos({ kind: 'word-problem', operator: '−' }).map(number)) expect(e.question, e.question).not.toMatch(/falta/)
    })

    it('hay también historias de juntar dos cantidades «en total» de otro mes o semana (al menos seis en total)', () => {
      const historias = new Set(muchos({ kind: 'word-problem', operator: '+' }).map(number).map((e) => plantilla(e.question)))
      expect(historias.size).toBeGreaterThanOrEqual(6)
      expect([...historias].filter((h) => /en total/.test(h)).length).toBeGreaterThanOrEqual(3)
    })
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

  describe('la familia de la suma y la resta (elegir la operación)', () => {
    // verdad independiente del código: «6 + 2 = 8» o «8 − 6 = 2» es cierta si el cálculo sale
    const cierta = (operacion: string) => {
      const [, x, signo, y, z] = operacion.match(/^(\d+) ([+−]) (\d+) = (\d+)$/)!
      return (signo === '+' ? Number(x) + Number(y) : Number(x) - Number(y)) === Number(z)
    }
    const CIRCULOS = ['🟣', '🟢', '🔵', '🟡', '🟠', '🔴']

    it('los círculos de colores salen de la fuente de emojis', () => {
      const fuente = new Set(emojisDeLaFuente(emojiFont))
      for (const c of CIRCULOS) expect(fuente.has(c), c).toBe(true)
    })

    for (const [ask, signo, pregunta] of [['sum', '+', 'suma'], ['subtract', '−', 'resta']] as const) {
      it(`con tres números, ¿qué ${pregunta} sale?: solo una de las tres opciones es cierta y usa los tres números`, () => {
        const ordenes = new Set<string>()
        const posicionDelMayor = new Set<number>()
        for (const e of muchos({ kind: 'family', ask }).map(choice)) {
          expect(e.question).toMatch(new RegExp(`^Con \\d+, \\d+ y \\d+, ¿qué ${pregunta} sale\\?$`))
          const numeros = e.question.match(/\d+/g)!.map(Number)
          const [menor, medio, mayor] = [...numeros].sort((a, b) => a - b)
          expect(menor + medio, e.question).toBe(mayor)
          expect(new Set(numeros).size, e.question).toBe(3)
          expect(mayor, e.question).toBeLessThanOrEqual(20)
          expect(e.options).toHaveLength(3)
          expect(e.options.filter(cierta), e.question).toEqual([e.answer])
          for (const opcion of e.options) {
            expect(opcion).toContain(` ${signo} `)
            expect([...opcion.matchAll(/\d+/g)].map((m) => Number(m[0])).sort((a, b) => a - b), opcion).toEqual([menor, medio, mayor])
          }
          ordenes.add(e.answer)
          posicionDelMayor.add(numeros.indexOf(mayor))
        }
        expect(ordenes.size, 'salen operaciones distintas').toBeGreaterThan(20)
        // el orden en que salen los números no delata cuál es el total
        expect(posicionDelMayor.size).toBe(3)
      })

      it(`con un dibujo de dos colores, ¿qué ${pregunta} sale?: los números son los de cada color y el total`, () => {
        for (const e of muchos({ kind: 'family', ask, drawing: true }).map(choice)) {
          const [uno, otro] = e.visual!.split('  ')
          const [a, b] = [[...uno].length, [...otro].length]
          expect(CIRCULOS, e.visual).toContain([...uno][0])
          expect(CIRCULOS, e.visual).toContain([...otro][0])
          expect(new Set([...uno]).size, e.visual).toBe(1)
          expect(new Set([...otro]).size, e.visual).toBe(1)
          expect([...uno][0], e.visual).not.toBe([...otro][0])
          expect(a, e.visual).not.toBe(b)
          expect(a + b, e.visual).toBeLessThanOrEqual(12)
          expect(e.question).toBe(ask === 'sum' ? '¿Qué suma cuenta todos los dibujos?' : `Si quitamos los ${[...otro][0]}, ¿qué resta sale?`)
          expect(e.options).toHaveLength(3)
          expect(e.options.filter(cierta), e.visual).toEqual([e.answer])
          for (const opcion of e.options) {
            expect(opcion).toContain(` ${signo} `)
            expect([...opcion.matchAll(/\d+/g)].map((m) => Number(m[0])).sort((x, y) => x - y), opcion).toEqual([Math.min(a, b), Math.max(a, b), a + b].sort((x, y) => x - y))
          }
          // la resta quita el otro color: lo que queda es el primero
          if (ask === 'subtract') expect(e.answer).toBe(`${a + b} − ${b} = ${a}`)
        }
      })
    }
  })

  describe('tabla de actividades con números (información con números)', () => {
    const ACTIVIDADES = ['🏃', '🎮', '📚', '🎨', '⚽', '🚲', '🏊', '🎵']

    // Lo que dice la tabla, leído sin el código del generador: número de la actividad de cada casilla
    const numeroEn = (e: ReturnType<typeof choice>, fila: number, columna: number) => {
      const tabla = e.codeTable!
      return tabla.legend.find((l) => l.emoji === tabla.cells[fila][columna])!.number
    }

    it('las actividades salen de la fuente de emojis', () => {
      const fuente = new Set(emojisDeLaFuente(emojiFont))
      for (const a of ACTIVIDADES) expect(fuente.has(a), a).toBe(true)
    })

    it('la tabla es de 2 × 2 con cuatro actividades distintas y los números del 1 al 4 sin repetir, uno por actividad', () => {
      const vistas = new Set<string>()
      for (const ask of ['cell', 'line', 'decode'] as const) {
        for (const e of muchos({ kind: 'code-table', ask }).map(choice)) {
          const t = e.codeTable!
          expect(t.columns).toEqual(['Sábado', 'Domingo'])
          expect(t.rows).toEqual(['Mañana', 'Tarde'])
          const emojis = t.cells.flat()
          expect(t.cells.map((fila) => fila.length)).toEqual([2, 2])
          expect(new Set(emojis).size).toBe(4)
          for (const emoji of emojis) expect(ACTIVIDADES).toContain(emoji)
          expect(t.legend.map((l) => l.number)).toEqual([1, 2, 3, 4])
          expect(new Set(t.legend.map((l) => l.emoji))).toEqual(new Set(emojis))
          for (const l of t.legend) expect(l.name.length).toBeGreaterThan(0)
          vistas.add(JSON.stringify(t.legend))
        }
      }
      expect(vistas.size, 'los números y las actividades cambian de un ejercicio a otro').toBeGreaterThan(50)
    })

    it('una casilla: la respuesta es el número de la actividad de ese día y ese momento, entre tres números distintos del 1 al 4', () => {
      const casillas = new Set<string>()
      for (const e of muchos({ kind: 'code-table', ask: 'cell' }).map(choice)) {
        const [, dia, momento] = e.question.match(/^¿Qué hizo el (sábado|domingo) por la (mañana|tarde)\? Elige su número\.$/)!
        const esperado = numeroEn(e, momento === 'mañana' ? 0 : 1, dia === 'sábado' ? 0 : 1)
        expect(e.answer, e.question).toBe(String(esperado))
        expect(e.options).toHaveLength(3)
        for (const opcion of e.options) expect([1, 2, 3, 4]).toContain(Number(opcion))
        casillas.add(`${dia} ${momento}`)
      }
      expect(casillas.size).toBe(4)
    })

    it('una fila o una columna: dos números, en el orden que dice la pregunta; la pareja al revés y otra pareja son opciones falsas', () => {
      const preguntas = new Set<string>()
      for (const e of muchos({ kind: 'code-table', ask: 'line' }).map(choice)) {
        let esperado: number[]
        const dia = e.question.match(/^¿Qué hizo el (sábado|domingo), primero por la mañana y después por la tarde\? Elige sus números\.$/)
        const momento = e.question.match(/^¿Qué hizo cada día por la (mañana|tarde), primero el sábado y después el domingo\? Elige sus números\.$/)
        if (dia) {
          const c = dia[1] === 'sábado' ? 0 : 1
          esperado = [numeroEn(e, 0, c), numeroEn(e, 1, c)]
        } else if (momento) {
          const f = momento[1] === 'mañana' ? 0 : 1
          esperado = [numeroEn(e, f, 0), numeroEn(e, f, 1)]
        } else throw new Error(`pregunta inesperada: ${e.question}`)
        expect(e.answer, e.question).toBe(`${esperado[0]} y ${esperado[1]}`)
        expect(e.options).toHaveLength(3)
        expect(e.options).toContain(`${esperado[1]} y ${esperado[0]}`)
        for (const opcion of e.options) expect(opcion).toMatch(/^[1-4] y [1-4]$/)
        preguntas.add(e.question)
      }
      expect(preguntas.size, 'dos días y dos momentos').toBe(4)
    })

    it('descodificar: «las actividades 3 y 1, en ese orden» son los dibujos de esos números; los nombres accesibles van en las etiquetas', () => {
      for (const e of muchos({ kind: 'code-table', ask: 'decode' }).map(choice)) {
        const [, n1, n2] = e.question.match(/^Las actividades ([1-4]) y ([1-4]), en ese orden\. ¿Qué dibujos son\?$/)!
        expect(n1).not.toBe(n2)
        const t = e.codeTable!
        const dibujo = (n: string) => t.legend.find((l) => l.number === Number(n))!
        const [uno, otro] = [dibujo(n1), dibujo(n2)]
        expect(e.answer).toBe(`${uno.emoji} ${otro.emoji}`)
        expect(e.options).toHaveLength(3)
        expect(e.options).toContain(`${otro.emoji} ${uno.emoji}`)
        for (const opcion of e.options) {
          for (const emoji of opcion.split(' ')) expect(ACTIVIDADES).toContain(emoji)
          expect(e.labels![opcion], opcion).toMatch(/^\S.* y \S.*$/)
        }
        expect(e.labels![e.answer]).toBe(`${uno.name} y ${otro.name}`)
      }
    })
  })

  describe('tabla de puntuaciones: ¿quién ganó?', () => {
    const NOMBRES = Object.fromEntries(ANIMALES.map((a) => [a.emoji, a.singular]))

    // Lo que dice la tabla, leído sin el código del generador
    const filas = (e: Exercise) => {
      const tabla = e.type === 'choice' || e.type === 'number' ? e.scoreTable : undefined
      if (!tabla) throw new Error(`falta la tabla: ${e.question}`)
      return tabla.players
    }

    it('tres jugadores distintos (animales con su nombre), dos partidas y el total', () => {
      for (const ask of ['hole', 'round', 'single', 'winner'] as const) {
        for (const e of muchos({ kind: 'score-table', ask })) {
          const t = (e as { scoreTable: { columns: string[]; players: { emoji: string; name: string; values: (number | null)[] }[] } }).scoreTable
          expect(t.columns).toEqual(['1ª partida', '2ª partida', 'Total'])
          expect(t.players).toHaveLength(3)
          expect(new Set(t.players.map((p) => p.emoji)).size).toBe(3)
          for (const p of t.players) {
            expect(p.name).toBe(NOMBRES[p.emoji])
            expect(p.values).toHaveLength(3)
          }
        }
      }
    })

    it('hueco: una sola casilla vacía; la respuesta es lo que hace falta para que el total sea la suma de las dos partidas (sumar o restar)', () => {
      const huecos = new Set<number>()
      for (const e of muchos({ kind: 'score-table', ask: 'hole' }).map(number)) {
        expect(e.question).toBe('Completa la tabla: ¿qué número falta?')
        const jugadores = filas(e)
        const casillas = jugadores.flatMap((p, i) => p.values.map((v, j) => ({ v, i, j })))
        const vacias = casillas.filter((c) => c.v === null)
        expect(vacias, 'una sola casilla vacía').toHaveLength(1)
        const { i, j } = vacias[0]
        const [x, y, total] = jugadores[i].values
        const esperado = j === 2 ? x! + y! : j === 0 ? total! - y! : total! - x!
        expect(e.answer, e.question).toBe(esperado)
        // las otras dos filas son cuentas bien hechas
        for (const [k, p] of jugadores.entries()) if (k !== i) expect(p.values[0]! + p.values[1]!).toBe(p.values[2])
        expect(e.answer).toBeGreaterThanOrEqual(15)
        expect(jugadores.flatMap((p) => p.values).filter((v) => v !== null).every((v) => v! <= 99)).toBe(true)
        huecos.add(j)
      }
      expect(huecos, 'el hueco está en las dos partidas y en el total').toEqual(new Set([0, 1, 2]))
    })

    it('las tablas completas son cuentas bien hechas, sin empates de total ni de puntos en una partida, y de dos cifras', () => {
      for (const ask of ['round', 'single', 'winner'] as const) {
        for (const e of muchos({ kind: 'score-table', ask }).map(choice)) {
          const jugadores = filas(e)
          for (const p of jugadores) {
            expect(p.values.every((v) => v !== null)).toBe(true)
            expect(p.values[0]! + p.values[1]!).toBe(p.values[2])
            expect(p.values[2]!).toBeLessThanOrEqual(99)
          }
          const partidas = jugadores.flatMap((p) => [p.values[0]!, p.values[1]!])
          expect(new Set(partidas).size, 'ninguna puntuación se repite').toBe(6)
          expect(new Set(jugadores.map((p) => p.values[2])).size, 'no hay empates de total').toBe(3)
        }
      }
    })

    it('¿quién ganó?: gana el jugador con más puntos en total; las opciones son los tres animales', () => {
      const ganadores = new Set<string>()
      for (const e of muchos({ kind: 'score-table', ask: 'winner' }).map(choice)) {
        expect(e.question).toBe('¿Quién ganó? Gana quien suma más puntos.')
        const jugadores = filas(e)
        const mejor = [...jugadores].sort((a, b) => b.values[2]! - a.values[2]!)[0]
        expect(e.answer).toBe(mejor.emoji)
        expect(new Set(e.options)).toEqual(new Set(jugadores.map((p) => p.emoji)))
        for (const p of jugadores) expect(e.labels![p.emoji]).toBe(p.name)
        ganadores.add(jugadores.indexOf(mejor).toString())
      }
      expect(ganadores.size, 'el ganador no está siempre en la misma fila').toBe(3)
    })

    it('una sola partida: gana quien hizo más puntos en una partida, no siempre quien ganó en total', () => {
      let distintos = 0
      for (const e of muchos({ kind: 'score-table', ask: 'single' }).map(choice)) {
        expect(e.question).toBe('¿Quién hizo más puntos en una sola partida?')
        const jugadores = filas(e)
        const mejor = [...jugadores].sort((a, b) => Math.max(b.values[0]!, b.values[1]!) - Math.max(a.values[0]!, a.values[1]!))[0]
        expect(e.answer).toBe(mejor.emoji)
        expect(new Set(e.options)).toEqual(new Set(jugadores.map((p) => p.emoji)))
        const ganador = [...jugadores].sort((a, b) => b.values[2]! - a.values[2]!)[0]
        if (ganador.emoji !== mejor.emoji) distintos++
      }
      expect(distintos, 'a veces el mejor de una partida no es el ganador').toBeGreaterThan(30)
    })

    it('partida: la pregunta nombra al animal y la respuesta es la partida con más puntos (nunca iguales)', () => {
      const respuestas = new Set<string>()
      for (const e of muchos({ kind: 'score-table', ask: 'round' }).map(choice)) {
        const [, articulo, nombre] = e.question.match(/^¿En qué partida hizo más puntos (el|la) (.+)\?$/)!
        const jugador = filas(e).find((p) => p.name === nombre)!
        expect(jugador, e.question).toBeDefined()
        expect(articulo).toBe(ANIMALES.find((a) => a.singular === nombre)!.fem ? 'la' : 'el')
        const esperado = jugador.values[0]! > jugador.values[1]! ? '1ª partida' : '2ª partida'
        expect(e.answer).toBe(esperado)
        expect(new Set(e.options)).toEqual(new Set(['1ª partida', '2ª partida', 'Las dos iguales']))
        respuestas.add(esperado)
      }
      expect(respuestas.size).toBe(2)
    })
  })

  describe('figuras con valores', () => {
    // tabla de referencia escrita a mano, independiente del código: cada figura y cómo se nombra
    const FIGURAS: Record<string, string> = { '🟩': 'cuadrado verde', '🔺': 'triángulo rojo', '🔵': 'círculo azul', '🟡': 'círculo amarillo' }
    // valores que se muestran en la leyenda («🟩 = 3  🔺 = 4 …»)
    const leyenda = (visual: string) => Object.fromEntries([...visual.matchAll(/(\S+) = (\d+)/gu)].map(([, figura, valor]) => [figura, Number(valor)]))

    it('las figuras salen de la fuente de emojis', () => {
      const fuente = new Set(emojisDeLaFuente(emojiFont))
      for (const figura of Object.keys(FIGURAS)) expect(fuente.has(figura), figura).toBe(true)
    })

    it('sumar dos figuras: la respuesta es la suma de sus valores, que cambian en cada ejercicio', () => {
      const repetidas = new Set<boolean>()
      const valoresDeLaPrimera = new Set<number>()
      for (const e of muchos({ kind: 'shape-sum', ask: 'sum' }).map(number)) {
        const valores = leyenda(e.visual!)
        expect(Object.keys(valores).sort(), e.visual).toEqual(Object.keys(FIGURAS).sort())
        expect(new Set(Object.values(valores)).size, `valores distintos: ${e.visual}`).toBe(4)
        for (const v of Object.values(valores)) {
          expect(v, e.visual).toBeGreaterThanOrEqual(2)
          expect(v, e.visual).toBeLessThanOrEqual(9)
        }
        const [, f1, f2] = e.question.match(/^(\S+) \+ (\S+) =$/u)!
        expect(valores[f1], e.question).toBeDefined()
        expect(valores[f2], e.question).toBeDefined()
        expect(e.answer, `${e.question} ${e.visual}`).toBe(valores[f1] + valores[f2])
        repetidas.add(f1 === f2)
        valoresDeLaPrimera.add(valores['🟩'])
      }
      expect(repetidas, 'salen sumas de dos figuras distintas y de la misma figura dos veces').toEqual(new Set([true, false]))
      expect(valoresDeLaPrimera.size, 'el valor de una figura cambia de un ejercicio a otro').toBeGreaterThan(4)
    })

    it('qué figura falta: una sola de las tres opciones completa la suma', () => {
      for (const e of muchos({ kind: 'shape-sum', ask: 'find' }).map(choice)) {
        const valores = leyenda(e.visual!)
        expect(Object.keys(valores).sort(), e.visual).toEqual(Object.keys(FIGURAS).sort())
        expect(new Set(Object.values(valores)).size, e.visual).toBe(4)
        const [, f1, suma] = e.question.match(/^¿Qué figura falta\? (\S+) \+ ❓ = (\d+)$/u)!
        expect(valores[f1], e.question).toBeDefined()
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) {
          expect(valores[opcion], opcion).toBeDefined()
          expect(e.labels![opcion], opcion).toBe(FIGURAS[opcion])
        }
        const queCompletan = e.options.filter((opcion) => valores[f1] + valores[opcion] === Number(suma))
        expect(queCompletan, `${e.question} ${e.visual}`).toEqual([e.answer])
      }
    })
  })

  it('la información oculta: la resta sin llevar da el número del deporte que practica, y la suma es una trampa', () => {
    // tabla de referencia escrita a mano, independiente del código: dibujo de cada deporte y su nombre
    const DEPORTES: Record<string, string> = {
      '🏀': 'baloncesto',
      '⚽': 'fútbol',
      '🎾': 'tenis',
      '🏊': 'natación',
      '🏐': 'voleibol',
      '🚴': 'ciclismo',
      '🏓': 'tenis de mesa',
      '🏸': 'bádminton',
    }
    const fuente = new Set(emojisDeLaFuente(emojiFont))
    for (const emoji of Object.keys(DEPORTES)) expect(fuente.has(emoji), emoji).toBe(true)
    const trampas = new Set<boolean>()
    const deportes = new Set<string>()
    for (const e of muchos({ kind: 'hidden-info' }).map(choice)) {
      const [, a, b] = e.visual!.match(/^(\d+)\s+−\s+(\d+)\s+=\s+❓$/)!.map(Number)
      const resultado = a - b
      // resta sin llevar de dos cifras con resultado de dos cifras
      expect(a % 10, e.visual).toBeGreaterThanOrEqual(b % 10)
      expect(Math.floor(a / 10), e.visual).toBeGreaterThanOrEqual(Math.floor(b / 10))
      expect(resultado, e.visual).toBeGreaterThanOrEqual(10)
      expect(e.question).toMatch(/^¿Qué deporte practica (Lucía|Pablo|Marta|Hugo|Sara|Iván)\? Resta y averígualo\.$/)

      // la tabla, escrita en el texto: cuatro deportes con números de dos cifras distintos
      const tabla = [...e.text!.matchAll(/(\p{Extended_Pictographic}) ([a-záéíóúñ ]+?) (\d+)/gu)].map(([, emoji, nombre, numero]) => ({ emoji, nombre, numero: Number(numero) }))
      expect(tabla, e.text).toHaveLength(4)
      expect(new Set(tabla.map((t) => t.numero)).size, e.text).toBe(4)
      expect(new Set(tabla.map((t) => t.emoji)).size, e.text).toBe(4)
      for (const t of tabla) {
        expect(DEPORTES[t.emoji], e.text).toBe(t.nombre)
        expect(t.numero, e.text).toBeGreaterThanOrEqual(10)
        expect(t.numero, e.text).toBeLessThanOrEqual(99)
        deportes.add(t.emoji)
      }

      // la respuesta es el deporte cuyo número es el resultado de la resta
      expect(tabla.find((t) => t.numero === resultado)?.emoji, e.visual).toBe(e.answer)
      expect(e.options, e.visual).toHaveLength(3)
      expect(e.options).toContain(e.answer)
      for (const opcion of e.options) {
        expect(tabla.some((t) => t.emoji === opcion), `${opcion} está en la tabla`).toBe(true)
        expect(e.labels![opcion], opcion).toBe(DEPORTES[opcion])
      }
      // si la suma cabe en la tabla (≤ 99), hay un deporte con ese número y es una opción equivocada
      const hayTrampa = a + b <= 99
      trampas.add(hayTrampa)
      if (hayTrampa) {
        const trampa = tabla.find((t) => t.numero === a + b)
        expect(trampa, `${e.visual}: falta el deporte de la suma`).toBeDefined()
        expect(e.options, e.visual).toContain(trampa!.emoji)
      }
    }
    expect(trampas, 'salen restas con y sin trampa de suma').toEqual(new Set([true, false]))
    expect(deportes.size, 'salen los ocho deportes').toBe(8)
  })

  it('colorear en la tabla, unidades: los diez números que acaban en la cifra, y nada más', () => {
    const cifras = new Set<number>()
    for (const e of muchos({ kind: 'table-paint', ask: 'units' })) {
      if (e.type !== 'table-paint') throw new Error('se esperaba colorear la tabla')
      const [, texto] = e.question.match(/^Toca los números que tienen (\d) unidad(?:es)?$/)!
      const unidades = Number(texto)
      expect(e.question).toBe(`Toca los números que tienen ${unidades} ${unidades === 1 ? 'unidad' : 'unidades'}`)
      expect(unidades).toBeGreaterThanOrEqual(1)
      // tabla de verdad independiente: de los cien números, los que acaban en esa cifra
      expect(e.targets, e.question).toEqual(Array.from({ length: 100 }, (_, i) => i).filter((i) => i % 10 === unidades))
      expect(e.targets).toHaveLength(10)
      expect(e.answer).toBe(`Acaban en ${unidades}`)
      cifras.add(unidades)
    }
    expect(cifras.size).toBe(9)
  })

  describe('números del 0 al 99 que incluyen una cifra (rincón de la lógica)', () => {
    // Tabla de verdad independiente: se escribe cada casilla tal como sale en la tabla (00, 01… 99) y se busca la cifra en el texto
    const conLaCifra = (cifra: number) =>
      Array.from({ length: 100 }, (_, i) => i).filter((i) => String(i).padStart(2, '0').includes(String(cifra)))

    it('colorear: los 19 números que tienen la cifra en las decenas o en las unidades, y nada más', () => {
      const cifras = new Set<number>()
      for (const e of muchos({ kind: 'table-paint', ask: 'digit' })) {
        if (e.type !== 'table-paint') throw new Error('se esperaba colorear la tabla')
        const m = e.question.match(/^Toca todos los números que incluyen el ([1-9])$/)
        expect(m, e.question).not.toBeNull()
        const cifra = Number(m![1])
        expect(e.targets, e.question).toEqual(conLaCifra(cifra))
        expect(e.targets, e.question).toHaveLength(19)
        expect(e.answer).toBe(`Hay 19 números con el ${cifra}`)
        cifras.add(cifra)
      }
      // salen las nueve cifras (la 0 queda fuera: solo habría 10 y las otras reglas no valen)
      expect(cifras).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    })

    it('estimar sin mirar la tabla: 10, 19 o 25, y la respuesta es siempre 19 para las cifras del 1 al 9', () => {
      const cifras = new Set<number>()
      const posiciones = new Set<number>()
      for (const e of muchos({ kind: 'digit-count' }).map(choice)) {
        const m = e.question.match(/^Sin mirar la tabla: ¿cuántos números del 0 al 99 incluyen el ([1-9])\?$/)
        expect(m, e.question).not.toBeNull()
        const cifra = Number(m![1])
        expect([...e.options].sort(), e.question).toEqual(['10', '19', '25'])
        // coincide con la tabla de verdad: de verdad hay 19 números con esa cifra
        expect(e.answer, e.question).toBe(String(conLaCifra(cifra).length))
        expect(e.answer).toBe('19')
        cifras.add(cifra)
        posiciones.add(e.options.indexOf(e.answer))
      }
      expect(cifras.size).toBe(9)
      expect(posiciones).toEqual(new Set([0, 1, 2]))
    })
  })

  it('colorear en la tabla, decenas: los diez números de la fila de esa decena, y nada más', () => {
    const cifras = new Set<number>()
    for (const e of muchos({ kind: 'table-paint', ask: 'tens' })) {
      if (e.type !== 'table-paint') throw new Error('se esperaba colorear la tabla')
      const [, texto] = e.question.match(/^Toca los números que tienen (\d) decenas?$/)!
      const decenas = Number(texto)
      expect(e.question).toBe(`Toca los números que tienen ${decenas} ${decenas === 1 ? 'decena' : 'decenas'}`)
      expect(decenas).toBeGreaterThanOrEqual(1)
      expect(e.targets, e.question).toEqual(Array.from({ length: 100 }, (_, i) => i).filter((i) => Math.floor(i / 10) === decenas))
      expect(e.answer).toBe(`Empiezan por ${decenas}`)
      cifras.add(decenas)
    }
    expect(cifras.size).toBe(9)
  })

  it('colorear en la tabla, las dos condiciones: un solo número, el que tiene esas decenas y esas unidades', () => {
    const numeros = new Set<number>()
    for (const e of muchos({ kind: 'table-paint', ask: 'both' })) {
      if (e.type !== 'table-paint') throw new Error('se esperaba colorear la tabla')
      const [, d, u] = e.question.match(/^Toca el número que tiene (\d) decenas? y (\d) unidad(?:es)?$/)!
      expect(e.targets, e.question).toEqual([Number(d) * 10 + Number(u)])
      expect(e.answer).toBe(String(Number(d) * 10 + Number(u)))
      expect(Number(d)).toBeGreaterThanOrEqual(1)
      expect(Number(u)).toBeGreaterThanOrEqual(1)
      numeros.add(e.targets[0])
    }
    expect(numeros.size, 'salen muchos números distintos').toBeGreaterThan(30)
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

  it('tabla del 100 al 199, fila: los números de la fila empiezan por 10… 19 (la decena con el 1 delante)', () => {
    const filas = new Set<number>()
    for (const e of muchos({ kind: 'table-99', ask: 'row', from: 100 }).map(choice)) {
      const fila = e.table!.row!
      expect(e.table, e.question).toEqual({ from: 100, row: fila })
      expect(fila).toBeGreaterThanOrEqual(0)
      expect(fila).toBeLessThanOrEqual(9)
      // la fila 3 es la de los 130 a 139: empiezan por 13
      expect(e.answer).toBe(String(10 + fila))
      expect(e.options).toHaveLength(3)
      for (const opcion of e.options) {
        expect(Number(opcion)).toBeGreaterThanOrEqual(10)
        expect(Number(opcion)).toBeLessThanOrEqual(19)
      }
      filas.add(fila)
    }
    expect(filas.size).toBe(10)
  })

  it('tabla del 100 al 199, columna: acaban en la cifra de las unidades', () => {
    const columnas = new Set<number>()
    for (const e of muchos({ kind: 'table-99', ask: 'column', from: 100 }).map(choice)) {
      const col = e.table!.col!
      expect(e.table, e.question).toEqual({ from: 100, col })
      expect(e.answer).toBe(String(col))
      for (const opcion of e.options) expect(Number(opcion)).toBeLessThanOrEqual(9)
      columnas.add(col)
    }
    expect(columnas.size).toBe(10)
  })

  it('tabla del 100 al 199, número que falta: está entre 100 y 199, en su fila y columna, con el de las cifras cambiadas', () => {
    const huecos = new Set<number>()
    for (const e of muchos({ kind: 'table-99', ask: 'missing', from: 100 }).map(choice)) {
      const { row, col, hole } = e.table!
      expect(e.table!.from).toBe(100)
      expect(hole).toBeGreaterThanOrEqual(100)
      expect(hole).toBeLessThanOrEqual(199)
      expect(row, e.question).toBe(Math.floor((hole! - 100) / 10))
      expect(col, e.question).toBe(hole! % 10)
      expect(e.answer).toBe(String(hole))
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      for (const opcion of e.options) {
        expect(Number(opcion)).toBeGreaterThanOrEqual(100)
        expect(Number(opcion)).toBeLessThanOrEqual(199)
      }
      // 147 y 174: las dos últimas cifras cambiadas
      if (col !== 0 && col !== row) expect(e.options).toContain(String(100 + col! * 10 + row!))
      huecos.add(hole!)
    }
    expect(huecos.size).toBeGreaterThan(30)
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

  describe('number-name de 100 a 199 (ciento…)', () => {
    const rango = { min: 100, max: 199 } as const
    // Tabla independiente: una opción equivocada es el nombre de un número cercano, nunca una palabra inventada
    const parecidos = (n: number) => {
      const base = Math.floor(n / 100) * 100
      const resto = n % 100
      const cambiado = base + (resto % 10) * 10 + Math.floor(resto / 10)
      return [n - 10, n - 1, n + 1, n + 10, cambiado]
    }

    it('leer: la respuesta es el nombre del número y las otras dos son nombres de números parecidos del mismo rango', () => {
      const numeros = new Set<number>()
      for (const e of muchos({ kind: 'number-name', ask: 'read', ...rango }).map(choice)) {
        const n = Number(e.question.match(/\d+/)![0])
        numeros.add(n)
        expect(n, e.question).toBeGreaterThanOrEqual(100)
        expect(n, e.question).toBeLessThanOrEqual(199)
        expect(e.answer, e.question).toBe(nombreNumero(n))
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options.filter((o) => o !== e.answer)) {
          const otro = parecidos(n).find((m) => m >= 100 && m <= 199 && nombreNumero(m) === opcion)
          expect(otro, `${e.question} → ${opcion}`).toBeDefined()
        }
      }
      // salen números de todas las decenas, también el 100 y los de 101 a 109
      expect(new Set([...numeros].map((n) => Math.floor((n % 100) / 10))).size).toBe(10)
      expect(numeros.has(100) || [...numeros].some((n) => n < 110)).toBe(true)
    })

    it('escribir: la respuesta es el número que dice el nombre, entre 100 y 199', () => {
      for (const e of muchos({ kind: 'number-name', ask: 'write', ...rango }).map(number)) {
        const nombre = e.question.replace('Escribe con cifras: ', '')
        expect(nombreNumero(e.answer), e.question).toBe(nombre)
        expect(e.answer, e.question).toBeGreaterThanOrEqual(100)
        expect(e.answer, e.question).toBeLessThanOrEqual(199)
      }
    })
  })

  describe('number-name de centenas redondas (cien, doscientos… novecientos)', () => {
    const centenas = { min: 100, max: 900, step: 100 } as const
    const NOMBRES = ['cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos']

    it('leer: la respuesta es el nombre de la centena y las otras dos son nombres de otras centenas', () => {
      const vistos = new Set<number>()
      for (const e of muchos({ kind: 'number-name', ask: 'read', ...centenas }).map(choice)) {
        const n = Number(e.question.match(/\d+/)![0])
        vistos.add(n)
        expect(n % 100, e.question).toBe(0)
        expect(e.answer, e.question).toBe(NOMBRES[n / 100 - 1])
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) expect(NOMBRES, `${e.question} → ${opcion}`).toContain(opcion)
      }
      expect(vistos).toEqual(new Set([100, 200, 300, 400, 500, 600, 700, 800, 900]))
    })

    it('escribir: la respuesta es la centena que dice el nombre', () => {
      const vistos = new Set<number>()
      for (const e of muchos({ kind: 'number-name', ask: 'write', ...centenas }).map(number)) {
        const nombre = e.question.replace('Escribe con cifras: ', '')
        expect(e.answer % 100, e.question).toBe(0)
        expect(nombre, e.question).toBe(NOMBRES[e.answer / 100 - 1])
        vistos.add(e.answer)
      }
      expect(vistos.size).toBe(9)
    })
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

  describe('hundred-units: centenas ↔ decenas ↔ unidades (1 C = 10 D = 100 U)', () => {
    const cantidad = (texto: string) => Number(texto.match(/\d+/)![0])

    it('to-tens: n centenas son 10·n decenas, con singular y plural', () => {
      for (const e of muchos({ kind: 'hundred-units', ask: 'to-tens' }).map(number)) {
        const n = cantidad(e.question)
        expect(n, e.question).toBeGreaterThanOrEqual(1)
        expect(n, e.question).toBeLessThanOrEqual(9)
        expect(e.question, e.question).toBe(`${n} ${n === 1 ? 'centena' : 'centenas'} = ❓ decenas`)
        expect(e.answer, e.question).toBe(n * 10)
      }
    })

    it('to-units: n centenas son 100·n unidades', () => {
      for (const e of muchos({ kind: 'hundred-units', ask: 'to-units' }).map(number)) {
        const n = cantidad(e.question)
        expect(n, e.question).toBeGreaterThanOrEqual(1)
        expect(n, e.question).toBeLessThanOrEqual(9)
        expect(e.question, e.question).toBe(`${n} ${n === 1 ? 'centena' : 'centenas'} = ❓ unidades`)
        expect(e.answer, e.question).toBe(n * 100)
      }
    })

    it('blocks: cada 🟥 es una centena y se pregunta por las unidades', () => {
      for (const e of muchos({ kind: 'hundred-units', ask: 'blocks' }).map(number)) {
        expect(e.question, e.question).toBe('🟥 es una centena. ¿Cuántas unidades son?')
        const placas = [...(e.visual ?? '')].filter((c) => c === '🟥').length
        expect(e.visual, e.question).toBe('🟥'.repeat(placas))
        expect(placas, e.question).toBeGreaterThanOrEqual(2)
        expect(placas, e.question).toBeLessThanOrEqual(9)
        expect(e.answer, e.question).toBe(placas * 100)
      }
    })

    it('match: elegir el número entre tres (la respuesta, el de las decenas o centenas contadas y el de las centenas)', () => {
      const preguntas = new Set<string>()
      for (const e of muchos({ kind: 'hundred-units', ask: 'match' }).map(choice)) {
        const [, n, unidad] = e.question.match(/^¿Qué número es (\d+) (decenas|centenas)\?$/) ?? []
        expect(n, e.question).toBeDefined()
        preguntas.add(unidad)
        // Tabla de verdad: 9 centenas = 90 decenas = 900 unidades
        const unidades = unidad === 'centenas' ? Number(n) * 100 : Number(n) * 10
        expect(e.answer, e.question).toBe(String(unidades))
        expect(e.options, e.question).toHaveLength(3)
        // las equivocadas son los errores típicos: repetir la cantidad o contar centenas
        expect(e.options, e.question).toContain(n)
        expect(e.options, e.question).toContain(String(unidades / 100))
      }
      expect(preguntas).toEqual(new Set(['decenas', 'centenas']))
    })

    it('las centenas van de 1 a 9 y salen todas', () => {
      const vistas = new Set(muchos({ kind: 'hundred-units', ask: 'to-units' }).map(number).map((e) => e.answer / 100))
      expect(vistas).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    })
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

  it('both: de a + b = c salen las dos restas, c − a o c − b', () => {
    const quitados = new Set<'primero' | 'segundo'>()
    for (const e of muchos({ kind: 'inverse', mode: 'both' }).map(number)) {
      const [a, b, c, c2, x] = e.question.match(/\d+/g)!.map(Number)
      expect(a + b, e.question).toBe(c)
      expect(c2, e.question).toBe(c)
      expect([a, b], e.question).toContain(x)
      expect(e.answer, e.question).toBe(c - x)
      // la respuesta es el otro sumando
      expect(e.answer, e.question).toBe(x === a ? b : a)
      quitados.add(x === a ? 'primero' : 'segundo')
    }
    expect(quitados).toEqual(new Set(['primero', 'segundo']))
  })

  it('small: los números de la suma no pasan de 20, como 7 + 4 = 11', () => {
    for (const e of muchos({ kind: 'inverse', mode: 'both', small: true }).map(number)) {
      const [a, b, c] = e.question.match(/\d+/g)!.map(Number)
      expect(a + b, e.question).toBe(c)
      expect(Math.min(a, b), e.question).toBeGreaterThanOrEqual(2)
      expect(c, e.question).toBeLessThanOrEqual(20)
    }
    for (const modo of ['missing', 'missing-minuend'] as const) {
      for (const e of muchos({ kind: 'inverse', mode: modo, small: true }).map(number)) {
        for (const n of [...e.question.match(/\d+/g)!.map(Number), e.answer]) expect(n, e.question).toBeLessThanOrEqual(20)
      }
    }
  })

  it('round: con decenas redondas todos los números son múltiplos de 10', () => {
    for (const modo of ['both', 'missing', 'missing-minuend'] as const) {
      for (const e of muchos({ kind: 'inverse', mode: modo, round: true }).map(number)) {
        for (const n of [...e.question.match(/\d+/g)!.map(Number), e.answer]) {
          expect(n % 10, e.question).toBe(0)
          expect(n, e.question).toBeGreaterThanOrEqual(10)
          expect(n, e.question).toBeLessThanOrEqual(90)
        }
      }
    }
  })

  it('missing-minuend: el minuendo que falta es el resultado más el sustraendo (▢ − 10 = 20)', () => {
    for (const e of muchos({ kind: 'inverse', mode: 'missing-minuend' }).map(number)) {
      const m = e.question.match(/^Completa: ▢ − (\d+) = (\d+)$/)
      expect(m, e.question).not.toBeNull()
      const [b, resultado] = [Number(m![1]), Number(m![2])]
      expect(e.answer - b, e.question).toBe(resultado)
      expect(e.answer, e.question).toBeLessThanOrEqual(99)
      expect(b, e.question).toBeGreaterThanOrEqual(10)
      expect(resultado, e.question).toBeGreaterThanOrEqual(10)
    }
  })

  it('el sumando que falta completa la suma', () => {
    for (const e of muchos({ kind: 'inverse', mode: 'missing' }).map(number)) {
      const [a, c] = e.question.match(/\d+/g)!.map(Number)
      expect(a + e.answer, e.question).toBe(c)
      expect(e.answer, e.question).toBeGreaterThanOrEqual(10)
    }
  })

  describe('subtraction-terms: minuendo, sustraendo y diferencia', () => {
    // Tabla independiente del generador: en a − b = c, a es el minuendo, b el sustraendo y c la diferencia
    const TERMINOS = ['minuendo', 'sustraendo', 'diferencia']
    const leer = (pregunta: string) => {
      const m = pregunta.match(/^En (\d+) − (\d+) = (\d+), (?:¿cuál es el (\w+)\?|¿cómo se llama el (\d+)\?)$/)
      if (!m) throw new Error(`pregunta inesperada: ${pregunta}`)
      return { numeros: [Number(m[1]), Number(m[2]), Number(m[3])], termino: m[4], numero: m[5] === undefined ? undefined : Number(m[5]) }
    }

    it('la resta está bien hecha, sus tres números son distintos y la respuesta es el término correcto', () => {
      for (const e of muchos({ kind: 'subtraction-terms' }).map(choice)) {
        const { numeros, termino, numero } = leer(e.question)
        const [a, b, c] = numeros
        expect(a - b, e.question).toBe(c)
        expect(new Set(numeros).size, e.question).toBe(3)
        for (const n of numeros) expect(n, e.question).toBeGreaterThanOrEqual(10)
        if (termino !== undefined) {
          // por el nombre: se elige uno de los tres números
          expect([...e.options].sort(), e.question).toEqual(numeros.map(String).sort())
          expect(e.answer, e.question).toBe(String(numeros[TERMINOS.indexOf(termino)]))
        } else {
          // por el número: se elige uno de los tres nombres
          expect([...e.options].sort(), e.question).toEqual([...TERMINOS].sort())
          expect(e.answer, e.question).toBe(TERMINOS[numeros.indexOf(numero!)])
        }
      }
    })

    it('se pregunta en las dos direcciones y por los tres términos', () => {
      const lecturas = muchos({ kind: 'subtraction-terms' }).map(choice).map((e) => leer(e.question))
      expect(lecturas.some((l) => l.termino !== undefined)).toBe(true)
      expect(lecturas.some((l) => l.numero !== undefined)).toBe(true)
      // el término por el que se pregunta: el que nombra la pregunta o el que es la respuesta
      const terminos = new Set(muchos({ kind: 'subtraction-terms' }).map(choice).map((e) => leer(e.question).termino ?? e.answer))
      expect(terminos).toEqual(new Set(TERMINOS))
    })
  })

  describe('check-subtraction: ¿está bien hecha la resta?', () => {
    const leer = (visual: string | undefined) => {
      const m = visual?.match(/^(\d+) − (\d+) = (\d+)$/)
      if (!m) throw new Error(`resta inesperada: ${visual}`)
      return { a: Number(m[1]), b: Number(m[2]), resultado: Number(m[3]) }
    }

    it('responde Sí solo si la resta está bien: el resultado más el sustraendo da el minuendo', () => {
      for (const e of muchos({ kind: 'check-subtraction' }).map(choice)) {
        const { a, b, resultado } = leer(e.visual)
        expect(e.question).toBe('¿Está bien hecha la resta?')
        expect([...e.options].sort()).toEqual(['No', 'Sí'])
        expect(a, e.visual).toBeGreaterThan(b)
        expect(resultado, e.visual).toBeGreaterThanOrEqual(1)
        expect(resultado, e.visual).toBeLessThanOrEqual(99)
        // la comprobación con la suma
        expect(e.answer, e.visual).toBe(resultado + b === a ? 'Sí' : 'No')
      }
    })

    it('hay restas bien y mal hechas, y las malas fallan de varias formas', () => {
      const lecturas = muchos({ kind: 'check-subtraction' }).map(choice)
      const respuestas = lecturas.map((e) => e.answer)
      expect(respuestas.filter((r) => r === 'Sí').length).toBeGreaterThan(SEMILLAS / 4)
      expect(respuestas.filter((r) => r === 'No').length).toBeGreaterThan(SEMILLAS / 4)
      const errores = new Set(
        lecturas
          .filter((e) => e.answer === 'No')
          .map((e) => {
            const { a, b, resultado } = leer(e.visual)
            return resultado - (a - b)
          }),
      )
      expect(errores.size).toBeGreaterThan(2)
    })
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
      expect(e.answer, e.question).toBe(`${lugar + 1}º`)
      for (const opcion of e.options) {
        const n = Number(opcion.replace('º', ''))
        expect(n).toBeGreaterThanOrEqual(1)
        expect(n).toBeLessThanOrEqual(10)
      }
    }
  })

  describe('ordinales: de símbolo a palabra, femenino y «el tercer…»', () => {
    // Tablas escritas a mano, independientes del generador (masculino y femenino, 1º a 10º)
    const MASCULINO = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo']
    const FEMENINO = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta', 'séptima', 'octava', 'novena', 'décima']

    it('leer, masculino: «¿Cómo se lee 8º?» → octavo, con otras palabras del mismo género y sin formas también válidas (tercer)', () => {
      const vistos = new Set<number>()
      for (const e of muchos({ kind: 'ordinal', mode: 'read' }).map(choice)) {
        const m = e.question.match(/^¿Cómo se lee (\d+)º\?$/)
        expect(m, e.question).not.toBeNull()
        const n = Number(m![1])
        vistos.add(n)
        expect(e.answer, e.question).toBe(MASCULINO[n - 1])
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) expect(MASCULINO, `${e.question} → ${opcion}`).toContain(opcion)
        expect(e.options.some((o) => o === 'tercer' || o === 'primer'), e.question).toBe(false)
      }
      expect(vistos.size).toBe(10)
    })

    it('leer, femenino: «¿Cómo se lee 3ª?» → tercera, con las otras opciones también en femenino', () => {
      const vistos = new Set<number>()
      for (const e of muchos({ kind: 'ordinal', mode: 'read', feminine: true }).map(choice)) {
        const m = e.question.match(/^¿Cómo se lee (\d+)ª\?$/)
        expect(m, e.question).not.toBeNull()
        const n = Number(m![1])
        vistos.add(n)
        expect(e.answer, e.question).toBe(FEMENINO[n - 1])
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) expect(FEMENINO, `${e.question} → ${opcion}`).toContain(opcion)
      }
      expect(vistos.size).toBe(10)
    })

    it('escribir, femenino: «¿Cómo se escribe "novena"?» → 9ª y todas las opciones llevan la ª', () => {
      for (const e of muchos({ kind: 'ordinal', mode: 'name', feminine: true }).map(choice)) {
        const palabra = e.question.match(/^¿Cómo se escribe "([a-zéáíóú]+)"\?$/)![1]
        const n = FEMENINO.indexOf(palabra) + 1
        expect(n, e.question).toBeGreaterThanOrEqual(1)
        expect(e.answer, e.question).toBe(`${n}ª`)
        for (const opcion of e.options) expect(opcion, e.question).toMatch(/^(10|[1-9])ª$/)
      }
    })

    it('el nombre masculino de siempre sigue con la º', () => {
      for (const e of muchos({ kind: 'ordinal', mode: 'name' }).map(choice)) {
        for (const opcion of e.options) expect(opcion, e.question).toMatch(/º$/)
      }
    })

    it('con sustantivo: «el tercer dibujo» y «la tercera figura» (apócope primer y tercer solo delante de un masculino)', () => {
      const vistos = new Set<string>()
      for (const e of muchos({ kind: 'ordinal', mode: 'position', noun: true }).map(choice)) {
        const m = e.question.match(/^Desde la izquierda, ¿cuál es (el|la) ([a-zéáíóú]+) (dibujo|figura)\?$/)
        expect(m, e.question).not.toBeNull()
        const [, articulo, palabra, sustantivo] = m!
        // concordancia: el … dibujo y la … figura
        expect(sustantivo, e.question).toBe(articulo === 'el' ? 'dibujo' : 'figura')
        const lugar = articulo === 'el' ? [...MASCULINO.map((p) => (p === 'primero' ? 'primer' : p === 'tercero' ? 'tercer' : p))].indexOf(palabra) : FEMENINO.indexOf(palabra)
        expect(lugar, e.question).toBeGreaterThanOrEqual(0)
        // el apócope solo delante de un sustantivo masculino: nunca «primero dibujo» ni «tercer figura»
        expect(e.question).not.toMatch(/ (primero|tercero) (dibujo)/)
        expect(e.question).not.toMatch(/ (primer|tercer) figura/)
        // la respuesta es el dibujo de ese lugar de la fila de diez
        const fila = [...e.visual!]
        expect(fila, e.question).toHaveLength(10)
        expect(new Set(fila).size, e.question).toBe(10)
        expect(e.answer, e.question).toBe(fila[lugar])
        for (const opcion of e.options) expect(fila, e.question).toContain(opcion)
        vistos.add(`${articulo} ${palabra}`)
      }
      // salen las dos concordancias y las dos formas con apócope
      expect(vistos.has('el primer')).toBe(true)
      expect(vistos.has('el tercer')).toBe(true)
      expect(vistos.has('la primera')).toBe(true)
      expect(vistos.has('la tercera')).toBe(true)
      expect(vistos.has('el segundo')).toBe(true)
    })
  })

  describe('ordinales para razonar: una clasificación y los pisos de un edificio', () => {
    describe('ranking: la lista de llegada de nueve animales', () => {
      const fuente = new Set(emojisDeLaFuente(emojiFont))
      // La lista de llegada en la tarjeta de lectura: «Llegada: 1º 🐘 · 2º 🐰 · … · 9º 🐷»
      const lista = (texto: string) => {
        const m = texto.match(/^Llegada: (.+)$/)
        expect(m, texto).not.toBeNull()
        const puestos = m![1].split(' · ').map((p) => p.match(/^(\d)º (\S+)$/))
        expect(puestos, texto).toHaveLength(9)
        return puestos.map((p, i) => {
          expect(p, texto).not.toBeNull()
          expect(Number(p![1]), texto).toBe(i + 1)
          return p![2]
        })
      }

      it('la lista tiene nueve animales distintos, numerados del 1º al 9º, y todos están en la fuente de emojis', () => {
        for (const e of muchos({ kind: 'ordinal', mode: 'ranking' }).map(choice)) {
          const animales = lista(e.text!)
          expect(new Set(animales).size, e.text).toBe(9)
          for (const animal of animales) expect(fuente.has(animal), `${animal} no está en la fuente`).toBe(true)
        }
      })

      it('las tres preguntas (quién llegó, en qué puesto, cuántos llegaron después) se resuelven con la lista', () => {
        const tipos = new Set<number>()
        const puestos = new Set<number>()
        for (const e of muchos({ kind: 'ordinal', mode: 'ranking' }).map(choice)) {
          const animales = lista(e.text!)
          expect(e.options, e.question).toHaveLength(3)
          const quien = e.question.match(/^¿Quién llegó el (\d)º\?$/)
          const puesto = e.question.match(/^¿En qué puesto llegó el (\S+)\?$/)
          const despues = e.question.match(/^Si el (\S+) llegó el (\d)º, ¿cuántos llegaron después\?$/)
          expect([quien, puesto, despues].filter(Boolean), e.question).toHaveLength(1)
          if (quien) {
            tipos.add(0)
            // la respuesta es el animal de ese puesto y las otras opciones también están en la lista
            expect(e.answer, e.question).toBe(animales[Number(quien[1]) - 1])
            for (const opcion of e.options) expect(animales, e.question).toContain(opcion)
            puestos.add(Number(quien[1]))
          } else if (puesto) {
            tipos.add(1)
            expect(animales, e.question).toContain(puesto[1])
            expect(e.answer, e.question).toBe(`${animales.indexOf(puesto[1]) + 1}º`)
            for (const opcion of e.options) expect(opcion, e.question).toMatch(/^[1-9]º$/)
          } else {
            tipos.add(2)
            const [, animal, p] = despues!
            expect(animales.indexOf(animal) + 1, e.question).toBe(Number(p))
            // después = total − puesto, con el puesto del 1º al 8º (el 9º no tiene a nadie detrás)
            expect(Number(p), e.question).toBeLessThanOrEqual(8)
            expect(e.answer, e.question).toBe(String(9 - Number(p)))
            for (const opcion of e.options) expect(Number(opcion), e.question).toBeGreaterThanOrEqual(1)
          }
        }
        expect(tipos).toEqual(new Set([0, 1, 2]))
        expect(puestos.size).toBeGreaterThanOrEqual(7)
      })
    })

    describe('floors: un piso por encima o por debajo', () => {
      it('un o dos pisos, por encima o por debajo, entre el 1º y el 10º, con tres opciones y una sola correcta', () => {
        const casos = new Set<string>()
        for (const e of muchos({ kind: 'ordinal', mode: 'floors' }).map(choice)) {
          const m = e.question.match(/^¿Qué piso está (un piso|dos pisos) por (encima|debajo) del (\d+)º\?$/)
          expect(m, e.question).not.toBeNull()
          const distancia = m![1] === 'un piso' ? 1 : 2
          const base = Number(m![3])
          expect(base, e.question).toBeGreaterThanOrEqual(1)
          expect(base, e.question).toBeLessThanOrEqual(10)
          const esperado = m![2] === 'encima' ? base + distancia : base - distancia
          expect(esperado, e.question).toBeGreaterThanOrEqual(1)
          expect(esperado, e.question).toBeLessThanOrEqual(10)
          expect(e.answer, e.question).toBe(`${esperado}º`)
          expect(e.options, e.question).toHaveLength(3)
          for (const opcion of e.options) {
            const n = Number(opcion.replace('º', ''))
            expect(opcion, e.question).toMatch(/^(10|[1-9])º$/)
            expect(n >= 1 && n <= 10, e.question).toBe(true)
          }
          casos.add(`${distancia} ${m![2]}`)
        }
        // salen los cuatro casos: un piso y dos pisos, por encima y por debajo
        expect(casos).toEqual(new Set(['1 encima', '1 debajo', '2 encima', '2 debajo']))
      })

      it('salen el 1º y el 10º como piso de partida y como respuesta', () => {
        const ejercicios = muchos({ kind: 'ordinal', mode: 'floors' }).map(choice)
        expect(ejercicios.some((e) => / del 10º\?$/.test(e.question))).toBe(true)
        expect(ejercicios.some((e) => / del 1º\?$/.test(e.question))).toBe(true)
        expect(ejercicios.some((e) => e.answer === '10º')).toBe(true)
        expect(ejercicios.some((e) => e.answer === '1º')).toBe(true)
      })

      it('una de las opciones equivocadas es la del lado contrario (encima ↔ debajo) cuando cabe', () => {
        let conTrampa = 0
        for (const e of muchos({ kind: 'ordinal', mode: 'floors' }).map(choice)) {
          const m = e.question.match(/^¿Qué piso está (un piso|dos pisos) por (encima|debajo) del (\d+)º\?$/)!
          const distancia = m[1] === 'un piso' ? 1 : 2
          const base = Number(m[3])
          const contrario = m[2] === 'encima' ? base - distancia : base + distancia
          if (contrario >= 1 && contrario <= 10) {
            expect(e.options, e.question).toContain(`${contrario}º`)
            conTrampa++
          }
        }
        expect(conTrampa).toBeGreaterThan(SEMILLAS / 2)
      })
    })
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

  describe('los números de la bandera: operar según una pista', () => {
    const CONSIGNAS = {
      'max-min': 'Suma el número mayor y el menor.',
      'two-largest': 'Resta los dos números mayores.',
      'three-smallest': 'Suma los tres números menores.',
    } as const

    // Lo que dice el enunciado, leído sin el código del generador: los cuatro números ordenados de menor a mayor
    const numerosDe = (texto: string) => {
      const [, lista] = texto.match(/^🚩 Números de la bandera: (.+)$/u)!
      return lista.split(' · ').map(Number).sort((a, b) => a - b)
    }
    const columna = (e: Exercise) => {
      if (e.type !== 'column') throw new Error(`se esperaba una columna: ${e.question}`)
      return e
    }

    it('la bandera sale de la fuente de emojis', () => {
      expect(new Set(emojisDeLaFuente(emojiFont)).has('🚩')).toBe(true)
    })

    for (const [ask, consigna] of Object.entries(CONSIGNAS) as [keyof typeof CONSIGNAS, string][]) {
      it(`${consigna} se calcula en columna con los números que dice la pista y da un resultado de dos cifras`, () => {
        for (const e of muchos({ kind: 'flag-numbers', ask }).map(columna)) {
          expect(e.question).toBe(consigna)
          const [n1, n2, n3, n4] = numerosDe(e.text!)
          expect(new Set([n1, n2, n3, n4]).size, e.text).toBe(4)
          for (const n of [n1, n2, n3, n4]) expect(n >= 10 && n <= 99, e.text).toBe(true)
          if (ask === 'max-min') {
            expect([e.operator, e.top, e.bottom, e.third], e.text).toEqual(['+', n4, n1, undefined])
            expect(e.answer).toBe(n4 + n1)
          } else if (ask === 'two-largest') {
            expect([e.operator, e.top, e.bottom, e.third], e.text).toEqual(['−', n4, n3, undefined])
            expect(e.answer).toBe(n4 - n3)
            // sin pedir una decena y de dos cifras
            expect(n4 % 10, e.text).toBeGreaterThanOrEqual(n3 % 10)
            expect(e.answer, e.text).toBeGreaterThanOrEqual(10)
          } else {
            expect([e.operator, e.top, e.bottom, e.third], e.text).toEqual(['+', n3, n2, n1])
            expect(e.answer).toBe(n1 + n2 + n3)
          }
          expect(e.answer, e.text).toBeLessThanOrEqual(99)
          // la llevada va marcada solo si las unidades suman 10 o más
          if (e.operator === '+') {
            const unidades = e.top % 10 + e.bottom % 10 + (e.third ?? 0) % 10
            expect(e.carry === true, e.text).toBe(unidades >= 10)
          } else expect(e.carry, e.text).toBeUndefined()
        }
      })
    }

    it('las tres consignas dan resultados de hasta 99 con los mismos cuatro números, que salen mezclados', () => {
      const posiciones = new Set<number>()
      const llevan = new Set<boolean>()
      for (const e of muchos({ kind: 'flag-numbers', ask: 'max-min' }).map(columna)) {
        const [n1, n2, n3, n4] = numerosDe(e.text!)
        expect(n4 + n1).toBeLessThanOrEqual(99)
        expect(n1 + n2 + n3).toBeLessThanOrEqual(99)
        expect(n4 - n3).toBeGreaterThanOrEqual(10)
        expect(n4 % 10).toBeGreaterThanOrEqual(n3 % 10)
        posiciones.add(e.text!.split(': ')[1].split(' · ').map(Number).indexOf(n4))
        llevan.add(e.carry === true)
      }
      expect(posiciones.size, 'el mayor no está siempre en el mismo sitio').toBe(4)
      expect(llevan.size, 'a veces se lleva y a veces no').toBe(2)
    })
  })

  describe('tres sumandos en columna (15 + 14 + 7)', () => {
    const tres = () =>
      muchos({ kind: 'column', operator: '+', carry: true, addends: 3 }).map((e) => {
        if (e.type !== 'column' || e.third === undefined) throw new Error('se esperaba una columna de tres sumandos')
        return { ...e, third: e.third }
      })
    // Tabla de verdad independiente: lo que se lleva a las decenas es la suma de las unidades entre 10
    const llevada = (e: { top: number; bottom: number; third: number }) => Math.floor(((e.top % 10) + (e.bottom % 10) + (e.third % 10)) / 10)

    it('la respuesta es la suma de los tres, va marcada con llevada y las unidades suman 10 o más', () => {
      for (const e of tres()) {
        const nombre = `${e.top} + ${e.bottom} + ${e.third}`
        expect(e.carry, nombre).toBe(true)
        expect(e.answer, nombre).toBe(e.top + e.bottom + e.third)
        expect(llevada(e), nombre).toBeGreaterThanOrEqual(1)
      }
    })

    it('mezcla sumandos de una y de dos cifras, y se lleva una decena o dos', () => {
      const todos = tres()
      expect(todos.some((e) => [e.top, e.bottom, e.third].some((n) => n < 10))).toBe(true)
      expect(todos.some((e) => [e.top, e.bottom, e.third].some((n) => n >= 10))).toBe(true)
      expect(new Set(todos.map(llevada))).toEqual(new Set([1, 2]))
    })

    it('el resultado nunca llega a 100, así que no hace falta la centena', () => {
      for (const e of tres()) expect(e.answer, `${e.top} + ${e.bottom} + ${e.third}`).toBeLessThanOrEqual(99)
    })

    it('las columnas de dos números no llevan tercer sumando', () => {
      for (const e of muchos({ kind: 'column', operator: '+', carry: true })) expect(e.type === 'column' && e.third).toBeUndefined()
    })
  })

  it('un sumando de una cifra llevando (87 + 9): las unidades suman 10 o más y a veces pasa de 99', () => {
    const resultados = muchos({ kind: 'column', operator: '+', carry: true, oneDigit: true }).map((e) => {
      if (e.type !== 'column') throw new Error('se esperaba una columna')
      const nombre = `${e.top} + ${e.bottom}`
      expect(e.carry, nombre).toBe(true)
      expect(e.bottom, nombre).toBeGreaterThanOrEqual(1)
      expect(e.bottom, nombre).toBeLessThan(10)
      expect(e.top, nombre).toBeGreaterThanOrEqual(10)
      expect((e.top % 10) + e.bottom, nombre).toBeGreaterThanOrEqual(10)
      expect(e.answer, nombre).toBe(e.top + e.bottom)
      return e.answer
    })
    expect(resultados.some((r) => r < 100)).toBe(true)
    expect(resultados.some((r) => r >= 100)).toBe(true)
  })

  describe('carry-spot: elegir la suma que lleva', () => {
    // Tabla de verdad independiente del generador: una suma lleva si las unidades suman 10 o más
    const lleva = (suma: string) => {
      const [a, b] = suma.split(' + ').map(Number)
      return (a % 10) + (b % 10) >= 10
    }

    it('de tres sumas lleva exactamente una y esa es la respuesta', () => {
      for (const e of muchos({ kind: 'carry-spot' }).map(choice)) {
        expect(e.question).toBe('¿Qué suma es llevando?')
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) expect(opcion, e.question).toMatch(/^\d\d \+ \d\d$/)
        expect(e.options.filter(lleva), e.options.join(' | ')).toEqual([e.answer])
      }
    })

    it('ninguna suma pasa de 99, así que el tamaño del resultado no delata cuál lleva', () => {
      for (const e of muchos({ kind: 'carry-spot' }).map(choice)) {
        for (const opcion of e.options) {
          const [a, b] = opcion.split(' + ').map(Number)
          expect(a + b, opcion).toBeLessThanOrEqual(99)
        }
      }
    })

    it('la suma que lleva sale en las tres posiciones', () => {
      const posiciones = new Set(muchos({ kind: 'carry-spot' }).map(choice).map((e) => e.options.indexOf(e.answer)))
      expect(posiciones).toEqual(new Set([0, 1, 2]))
    })
  })

  describe('carry-spot con restas: elegir la resta que lleva y decir si una resta lleva', () => {
    // Tabla de verdad independiente del generador: una resta lleva si las unidades del minuendo son menores que las del sustraendo
    const lleva = (resta: string) => {
      const [a, b] = resta.split(' − ').map(Number)
      return a % 10 < b % 10
    }

    it('de tres restas lleva exactamente una y esa es la respuesta; todas de dos cifras y con resultado positivo', () => {
      for (const e of muchos({ kind: 'carry-spot', operator: '−' }).map(choice)) {
        expect(e.question).toBe('¿Qué resta es llevando?')
        expect(e.options, e.question).toHaveLength(3)
        for (const opcion of e.options) {
          expect(opcion, e.question).toMatch(/^\d\d − \d\d$/)
          const [a, b] = opcion.split(' − ').map(Number)
          expect(a - b, opcion).toBeGreaterThan(0)
        }
        expect(e.options.filter(lleva), e.options.join(' | ')).toEqual([e.answer])
      }
    })

    it('la resta que lleva sale en las tres posiciones y hay restas sin llevar con decenas grandes', () => {
      const ejercicios = muchos({ kind: 'carry-spot', operator: '−' }).map(choice)
      expect(new Set(ejercicios.map((e) => e.options.indexOf(e.answer)))).toEqual(new Set([0, 1, 2]))
      // trampa: una resta sin llevar con las decenas del sustraendo de 5 o más (95 − 21 no lleva aunque lo parezca)
      expect(ejercicios.some((e) => e.options.some((o) => !lleva(o) && Number(o.split(' − ')[1]) >= 50))).toBe(true)
    })

    it('«¿sin llevar o llevando?»: la resta ya hecha tiene bien el resultado y la respuesta es la que dice la regla', () => {
      const respuestas = new Set<string>()
      for (const e of muchos({ kind: 'carry-spot', operator: '−', ask: 'type' }).map(choice)) {
        expect(e.question).toBe('Esta resta, ¿es sin llevar o llevando?')
        const [, a, b, c] = e.visual!.match(/^(\d\d) − (\d\d) = (\d+)$/)!
        expect(Number(a) - Number(b), e.visual).toBe(Number(c))
        expect(e.options.slice().sort()).toEqual(['Llevando', 'Sin llevar'])
        expect(e.answer, e.visual).toBe(lleva(`${a} − ${b}`) ? 'Llevando' : 'Sin llevar')
        respuestas.add(e.answer)
      }
      expect(respuestas).toEqual(new Set(['Llevando', 'Sin llevar']))
    })
  })

  it('las columnas sin llevar no llevan la marca', () => {
    for (const operator of ['+', '−'] as const) {
      for (const e of muchos({ kind: 'column', operator })) {
        expect(e.type === 'column' && e.carry).toBeFalsy()
      }
    }
  })

  describe('cálculo mental con tres sumandos (unidad 2)', () => {
    describe('missing-three: el sumando que falta', () => {
      // «5 + 1 + ▢ = 10», «4 + ▢ + 3 = 11» o al revés, «12 = 6 + 5 + ▢»
      const NORMAL = /^Completa: (\d+|▢) \+ (\d+|▢) \+ (\d+|▢) = (\d+)$/
      const AL_REVES = /^Completa: (\d+) = (\d+|▢) \+ (\d+|▢) \+ (\d+|▢)$/
      const leer = (pregunta: string) => {
        const normal = pregunta.match(NORMAL)
        const reves = pregunta.match(AL_REVES)
        expect(normal !== null || reves !== null, pregunta).toBe(true)
        const [terminos, total] = normal ? [normal.slice(1, 4), normal[4]] : [reves!.slice(2, 5), reves![1]]
        return { terminos, total: Number(total), alReves: reves !== null }
      }

      it('hay un solo hueco, los sumandos y el total son del libro (total de 10 a 13) y la respuesta completa la suma', () => {
        const huecos = new Set<number>()
        const direcciones = new Set<boolean>()
        const totales = new Set<number>()
        for (const e of muchos({ kind: 'mental', mode: 'missing-three' }).map(number)) {
          const { terminos, total, alReves } = leer(e.question)
          expect(terminos.filter((t) => t === '▢'), e.question).toHaveLength(1)
          expect(total, e.question).toBeGreaterThanOrEqual(10)
          expect(total, e.question).toBeLessThanOrEqual(13)
          const conocidos = terminos.filter((t) => t !== '▢').map(Number)
          expect(conocidos, e.question).toHaveLength(2)
          for (const n of conocidos) expect(n >= 1 && n <= 9, e.question).toBe(true)
          expect(e.answer, e.question).toBe(total - conocidos[0] - conocidos[1])
          expect(e.answer, e.question).toBeGreaterThanOrEqual(1)
          expect(e.answer, e.question).toBeLessThanOrEqual(9)
          huecos.add(terminos.indexOf('▢'))
          direcciones.add(alReves)
          totales.add(total)
        }
        // el hueco sale en las tres posiciones, de las dos maneras y con los cuatro totales
        expect(huecos).toEqual(new Set([0, 1, 2]))
        expect(direcciones).toEqual(new Set([true, false]))
        expect(totales).toEqual(new Set([10, 11, 12, 13]))
      })
    })

    describe('compare-ten: el resultado, ¿menor o mayor que 10?', () => {
      it('de tres números del 1 al 6, nunca da 10 y la respuesta es el signo correcto', () => {
        const signos = new Set<string>()
        for (const e of muchos({ kind: 'mental', mode: 'compare-ten' }).map(choice)) {
          expect(e.question).toBe('¿Qué signo va en el recuadro?')
          const m = e.visual!.match(/^(\d+) \+ (\d+) \+ (\d+)  ❓  10$/)
          expect(m, e.visual).not.toBeNull()
          const numeros = m!.slice(1, 4).map(Number)
          for (const n of numeros) expect(n >= 1 && n <= 6, e.visual).toBe(true)
          const suma = numeros[0] + numeros[1] + numeros[2]
          expect(suma, e.visual).not.toBe(10)
          expect([...e.options].sort(), e.visual).toEqual(['<', '>'])
          expect(e.answer, e.visual).toBe(suma > 10 ? '>' : '<')
          signos.add(e.answer)
        }
        expect(signos).toEqual(new Set(['<', '>']))
      })

      it('salen sumas que se quedan cerca de 10 por los dos lados (9 y 11) y lejos (6 y 15)', () => {
        const sumas = new Set(
          muchos({ kind: 'mental', mode: 'compare-ten' }).map(choice).map((e) => e.visual!.match(/\d+/g)!.slice(0, 3).map(Number).reduce((a, b) => a + b, 0)),
        )
        expect(sumas.has(9)).toBe(true)
        expect(sumas.has(11)).toBe(true)
        expect(Math.min(...sumas)).toBeLessThanOrEqual(6)
        expect(Math.max(...sumas)).toBeGreaterThanOrEqual(15)
      })
    })
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
