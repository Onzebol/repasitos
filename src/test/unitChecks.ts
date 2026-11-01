import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../random'
import { buildSession, exerciseKey, SESSION_SIZE } from '../session'
import type { Topic } from '../types'

const SEMILLAS = 100

// Comprobaciones comunes a todas las unidades: planes de 10, sesiones sin repetidos y ejercicios bien hechos.
// Cada unidad las registra con su propio nombre y añade después sus comprobaciones particulares.
export function describeUnit(name: string, topics: Topic[]) {
  describe(`${name}: planes y sesiones`, () => {
    it('los temas tienen identificadores distintos', () => {
      const ids = topics.map((topic) => topic.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it.each(topics.map((topic) => [topic.name, topic] as const))('%s: el plan suma una sesión de 10 ejercicios', (_name, topic) => {
      expect(topic.plan.reduce((total, block) => total + block.count, 0)).toBe(SESSION_SIZE)
      for (const block of topic.plan) {
        expect(block.count).toBeGreaterThan(0)
        if (block.spec.kind === 'bag') expect(block.spec.items.length).toBeGreaterThanOrEqual(block.count)
      }
    })

    it.each(topics.map((topic) => [topic.name, topic] as const))(`%s: cada sesión (${SEMILLAS} semillas) tiene 10 ejercicios distintos y bien hechos`, (_name, topic) => {
      for (let seed = 0; seed < SEMILLAS; seed++) {
        const session = buildSession(topic.plan, mulberry32(seed), [])
        expect(session, `semilla ${seed}`).toHaveLength(SESSION_SIZE)
        expect(new Set(session.map(exerciseKey)).size, `semilla ${seed}`).toBe(SESSION_SIZE)
        for (const exercise of session) {
          if (exercise.type === 'choice') {
            expect(exercise.question.trim()).not.toBe('')
            expect(exercise.options, exercise.question).toContain(exercise.answer)
            expect(new Set(exercise.options).size, exercise.question).toBe(exercise.options.length)
          } else if (exercise.type === 'number') {
            expect(exercise.question.trim()).not.toBe('')
            expect(Number.isInteger(exercise.answer), exercise.question).toBe(true)
            expect(exercise.answer, exercise.question).toBeGreaterThanOrEqual(0)
            expect(exercise.answer, exercise.question).toBeLessThanOrEqual(999)
          } else if (exercise.type === 'trace') {
            expect(exercise.answer, exercise.question).toBe(exercise.digit)
            expect(exercise.question, exercise.question).toContain(String(exercise.digit))
          } else {
            const nombre = `${exercise.top} ${exercise.operator} ${exercise.bottom}`
            expect(exercise.answer, nombre).toBe(exercise.operator === '+' ? exercise.top + exercise.bottom : exercise.top - exercise.bottom)
            const unidades = (exercise.top % 10) + (exercise.bottom % 10)
            // sumas: con llevada las unidades suman 10 o más, sin ella cada columna se resuelve por separado
            // restas: con llevada las unidades del minuendo son menores que las del sustraendo
            if (exercise.operator === '+') {
              if (exercise.carry) expect(unidades, nombre).toBeGreaterThanOrEqual(10)
              else expect(unidades, nombre).toBeLessThan(10)
            } else if (exercise.carry) expect(exercise.top % 10, nombre).toBeLessThan(exercise.bottom % 10)
            else expect(exercise.top % 10, nombre).toBeGreaterThanOrEqual(exercise.bottom % 10)
          }
        }
      }
    })

    it.each(topics.map((topic) => [topic.name, topic] as const))('%s: sesiones sucesivas son distintas', (_name, topic) => {
      const sesiones = Array.from({ length: 5 }, (_, seed) => buildSession(topic.plan, mulberry32(seed), []).map(exerciseKey).join('|'))
      expect(new Set(sesiones).size).toBe(5)
    })

    it('las listas fijas tienen la respuesta entre las opciones y ejercicios distintos', () => {
      for (const topic of topics) {
        for (const { spec } of topic.plan) {
          if (spec.kind !== 'bag') continue
          const claves = spec.items.map(exerciseKey)
          expect(new Set(claves).size, topic.name).toBe(claves.length)
          for (const item of spec.items) {
            if (item.type === 'choice') expect(item.options, item.question).toContain(item.answer)
          }
        }
      }
    })
  })
}
