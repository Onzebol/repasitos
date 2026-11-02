import { describe, expect, it } from 'vitest'
import { mulberry32 } from './random'
import { buildSession, exerciseKey, SESSION_SIZE } from './session'
import type { ChoiceExercise, Exercise, PlanBlock } from './types'

const eleccion = (question: string, answer: string, ...otras: string[]): ChoiceExercise => ({
  type: 'choice',
  question,
  options: [answer, ...otras],
  answer,
})

const plan: PlanBlock[] = [
  { spec: { kind: 'column', operator: '+' }, count: 3 },
  { spec: { kind: 'column', operator: '−' }, count: 3 },
  { spec: { kind: 'compare', mode: 'sign' }, count: 4 },
]

const claves = (session: Exercise[]) => session.map(exerciseKey)

// Una sesión de trazo reparte las diez cifras sin repetir ninguna, con cualquier semilla
describe('buildSession: trazo guiado', () => {
  it('10 ejercicios del 0 al 9 son las diez cifras, cada una una vez', () => {
    const trazo: PlanBlock[] = [{ spec: { kind: 'trace' }, count: SESSION_SIZE }]
    for (let seed = 0; seed < 300; seed++) {
      const digitos = buildSession(trazo, mulberry32(seed)).map((e) => (e.type === 'trace' ? e.digit : -1))
      expect([...digitos].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    }
  })
})

describe('buildSession: sesiones de 10', () => {
  it('SESSION_SIZE es 10', () => {
    expect(SESSION_SIZE).toBe(10)
  })

  it('crea tantos ejercicios como suman los bloques, en el orden del plan', () => {
    const session = buildSession(plan, mulberry32(1))
    expect(session).toHaveLength(10)
    expect(session.slice(0, 3).map((e) => e.type)).toEqual(['column', 'column', 'column'])
    expect(session.slice(3, 6).every((e) => e.type === 'column' && e.operator === '−')).toBe(true)
    expect(session.slice(6).every((e) => e.type === 'choice')).toBe(true)
  })

  it('no repite ejercicios dentro de una sesión (300 semillas)', () => {
    for (let seed = 0; seed < 300; seed++) {
      const session = buildSession(plan, mulberry32(seed))
      expect(new Set(claves(session)).size, `semilla ${seed}`).toBe(session.length)
    }
  })

  it('la misma semilla da la misma sesión y otra semilla da otra distinta', () => {
    expect(buildSession(plan, mulberry32(5))).toEqual(buildSession(plan, mulberry32(5)))
    expect(buildSession(plan, mulberry32(5))).not.toEqual(buildSession(plan, mulberry32(6)))
  })

  it('reparte las listas fijas sin repetir elementos y los toma de la lista', () => {
    const items = [1, 2, 3, 4, 5].map((n) => eleccion(`Pregunta ${n}`, 'sí', 'no'))
    for (let seed = 0; seed < 50; seed++) {
      const session = buildSession([{ spec: { kind: 'bag', items }, count: 4 }], mulberry32(seed))
      expect(new Set(session.map((e) => e.question)).size).toBe(4)
      for (const e of session) expect(items.map((i) => i.question)).toContain(e.question)
    }
  })

  it('baraja el orden de las opciones de los ejercicios de elegir, sin perder ninguna', () => {
    const orden = new Set<string>()
    for (let seed = 0; seed < 100; seed++) {
      const [e] = buildSession([{ spec: { kind: 'bag', items: [eleccion('P', 'a', 'b', 'c')] }, count: 1 }], mulberry32(seed))
      if (e.type !== 'choice') throw new Error('se esperaba elegir')
      expect([...e.options].sort()).toEqual(['a', 'b', 'c'])
      expect(e.answer).toBe('a')
      orden.add(e.options.join(''))
    }
    expect(orden.size).toBeGreaterThan(3)
  })

  it('con ejercicios a evitar, no repite los de la sesión anterior si hay donde elegir', () => {
    const items = Array.from({ length: 20 }, (_, n) => eleccion(`Pregunta ${n}`, 'sí', 'no'))
    const bolsa: PlanBlock[] = [{ spec: { kind: 'bag', items }, count: 10 }]
    const primera = buildSession(bolsa, mulberry32(1))
    const segunda = buildSession(bolsa, mulberry32(1), claves(primera))
    expect(segunda.map((e) => e.question).filter((q) => primera.some((p) => p.question === q))).toEqual([])
  })

  it('si no hay más remedio, repite antes que quedarse sin sesión', () => {
    const items = Array.from({ length: 10 }, (_, n) => eleccion(`Pregunta ${n}`, 'sí', 'no'))
    const bolsa: PlanBlock[] = [{ spec: { kind: 'bag', items }, count: 10 }]
    const primera = buildSession(bolsa, mulberry32(1))
    expect(buildSession(bolsa, mulberry32(2), claves(primera))).toHaveLength(10)
  })

  it('falla con un error claro si el plan pide más ejercicios distintos de los que existen', () => {
    const items = [eleccion('Única', 'sí', 'no')]
    expect(() => buildSession([{ spec: { kind: 'bag', items }, count: 2 }], mulberry32(1))).toThrow(/distintos/)
  })
})

describe('exerciseKey: identifica un ejercicio por sus datos, no por el enunciado', () => {
  it('dos columnas distintas tienen claves distintas aunque el enunciado sea el mismo', () => {
    const a: Exercise = { type: 'column', question: 'Suma en columna', operator: '+', top: 23, bottom: 14, answer: 37 }
    const b: Exercise = { ...a, top: 24, answer: 38 }
    expect(exerciseKey(a)).not.toBe(exerciseKey(b))
  })

  it('dos mapas para programar a Repi, o con otra meta, son ejercicios distintos', () => {
    const celdas = [['🌳', '', ''], ['', '🏫', '']]
    const programa: Exercise = { type: 'route-program', question: 'Programa a Repi para que llegue al colegio', route: { cells: celdas, start: [0, 1] }, goal: [1, 1], answer: '1v' }
    expect(exerciseKey(programa)).not.toBe(exerciseKey({ ...programa, route: { cells: celdas, start: [0, 2] } }))
    expect(exerciseKey(programa)).not.toBe(exerciseKey({ ...programa, goal: [1, 2] }))
    expect(exerciseKey(programa)).not.toBe(exerciseKey({ ...programa, route: { cells: [['🌲', '', ''], ['', '🏫', '']], start: [0, 1] } }))
    expect(exerciseKey(programa)).toBe(exerciseKey({ ...programa }))
  })

  it('dos filas o columnas de la tabla, o con otros huecos, son ejercicios distintos', () => {
    const fila: Exercise = { type: 'table-fill', question: 'Completa la fila amarilla', line: 'row', index: 4, blanks: [2, 3, 5, 7, 8], answer: '40 a 49' }
    expect(exerciseKey(fila)).not.toBe(exerciseKey({ ...fila, index: 5, answer: '50 a 59' }))
    expect(exerciseKey(fila)).not.toBe(exerciseKey({ ...fila, blanks: [1, 3, 5, 7, 8] }))
    expect(exerciseKey(fila)).not.toBe(exerciseKey({ ...fila, line: 'column', question: 'Completa la columna naranja' }))
    expect(exerciseKey(fila)).toBe(exerciseKey({ ...fila }))
  })

  it('la misma pregunta con otro mapa o con otras instrucciones es otro ejercicio', () => {
    const celdas = [['🌳', '', ''], ['', '🏫', '']]
    const conMapa = (steps: string, start: [number, number]): Exercise => ({ ...eleccion('Sigue las flechas desde Repi. ¿Dónde llegas?', '🏫', '🏪'), steps, route: { cells: celdas, start } })
    expect(exerciseKey(conMapa('2> 1v', [0, 0]))).not.toBe(exerciseKey(conMapa('1> 1v', [0, 0])))
    expect(exerciseKey(conMapa('2> 1v', [0, 0]))).not.toBe(exerciseKey(conMapa('2> 1v', [0, 1])))
    expect(exerciseKey(conMapa('2> 1v', [0, 0]))).toBe(exerciseKey(conMapa('2> 1v', [0, 0])))
  })

  it('la misma pregunta con otra tabla del 0 al 99 es otro ejercicio', () => {
    const conTabla = (table: { row?: number; col?: number; hole?: number }): Exercise => ({ ...eleccion('¿Qué número falta?', '47', '74'), table })
    expect(exerciseKey(conTabla({ hole: 47 }))).not.toBe(exerciseKey(conTabla({ hole: 48 })))
    expect(exerciseKey(conTabla({ row: 4 }))).not.toBe(exerciseKey(conTabla({ row: 5 })))
    expect(exerciseKey(conTabla({ hole: 47, row: 4 }))).toBe(exerciseKey(conTabla({ hole: 47, row: 4 })))
  })

  it('dos preguntas iguales con distinto texto de lectura tienen claves distintas', () => {
    const conTexto = (text: string): Exercise => ({ ...eleccion('¿Hay que sumar o restar?', 'sumar', 'restar'), text })
    expect(exerciseKey(conTexto('Tengo 23 pegatinas y me regalan 14.'))).not.toBe(exerciseKey(conTexto('En el parque hay 41 niños y llegan 25 más.')))
    expect(exerciseKey(conTexto('Tengo 23 pegatinas y me regalan 14.'))).toBe(exerciseKey(conTexto('Tengo 23 pegatinas y me regalan 14.')))
  })

  it('el orden de las opciones no cambia la clave', () => {
    expect(exerciseKey(eleccion('P', 'a', 'b', 'c'))).toBe(exerciseKey({ ...eleccion('P', 'a', 'c', 'b') }))
  })

  it('dos signos con distintos números tienen claves distintas', () => {
    const signo = (visual: string): Exercise => ({ ...eleccion('¿Qué signo va en el recuadro?', '>', '<'), visual })
    expect(exerciseKey(signo('47  ❓  52'))).not.toBe(exerciseKey(signo('83  ❓  38')))
  })
})
