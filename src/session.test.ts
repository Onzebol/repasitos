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

  it('el orden de las opciones no cambia la clave', () => {
    expect(exerciseKey(eleccion('P', 'a', 'b', 'c'))).toBe(exerciseKey({ ...eleccion('P', 'a', 'c', 'b') }))
  })

  it('dos signos con distintos números tienen claves distintas', () => {
    const signo = (visual: string): Exercise => ({ ...eleccion('¿Qué signo va en el recuadro?', '>', '<'), visual })
    expect(exerciseKey(signo('47  ❓  52'))).not.toBe(exerciseKey(signo('83  ❓  38')))
  })
})
