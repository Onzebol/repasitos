import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession, exerciseKey, SESSION_SIZE } from '../../session'
import { temasUnidad1 } from './unidad1'

const SEMILLAS = 100

describe('datos de la unidad 1 de Matemáticas', () => {
  it('tiene los seis temas del índice, con identificadores distintos', () => {
    expect(temasUnidad1).toHaveLength(6)
    const ids = temasUnidad1.map((topic) => topic.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(temasUnidad1.map((topic) => [topic.name, topic] as const))('%s: el plan suma una sesión de 10 ejercicios', (_name, topic) => {
    expect(topic.plan.reduce((total, block) => total + block.count, 0)).toBe(SESSION_SIZE)
    for (const block of topic.plan) {
      expect(block.count).toBeGreaterThan(0)
      if (block.spec.kind === 'bag') expect(block.spec.items.length).toBeGreaterThanOrEqual(block.count)
    }
  })

  it.each(temasUnidad1.map((topic) => [topic.name, topic] as const))('%s: cada sesión (%s semillas) tiene 10 ejercicios distintos y bien hechos', (_name, topic) => {
    for (let seed = 0; seed < SEMILLAS; seed++) {
      const session = buildSession(topic.plan, mulberry32(seed))
      expect(session, `semilla ${seed}`).toHaveLength(SESSION_SIZE)
      expect(new Set(session.map(exerciseKey)).size, `semilla ${seed}`).toBe(SESSION_SIZE)
      for (const exercise of session) {
        expect(exercise.type === 'column' || exercise.question.trim() !== '').toBe(true)
        if (exercise.type === 'choice') {
          expect(exercise.options, exercise.question).toContain(exercise.answer)
          expect(new Set(exercise.options).size, exercise.question).toBe(exercise.options.length)
        } else if (exercise.type === 'number') {
          expect(Number.isInteger(exercise.answer), exercise.question).toBe(true)
          expect(exercise.answer, exercise.question).toBeGreaterThanOrEqual(0)
          expect(exercise.answer, exercise.question).toBeLessThanOrEqual(999)
        } else {
          const esperado = exercise.operator === '+' ? exercise.top + exercise.bottom : exercise.top - exercise.bottom
          expect(exercise.answer).toBe(esperado)
        }
      }
    }
  })

  it.each(temasUnidad1.map((topic) => [topic.name, topic] as const))('%s: sesiones sucesivas son distintas', (_name, topic) => {
    const sesiones = Array.from({ length: 5 }, (_, seed) => buildSession(topic.plan, mulberry32(seed)).map(exerciseKey).join('|'))
    expect(new Set(sesiones).size).toBe(5)
  })

  it('"Sumas y restas sin llevar" mezcla columnas y problemas con texto', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'sumas-restas')!
    const session = buildSession(tema.plan, mulberry32(1))
    expect(session.filter((e) => e.type === 'column')).toHaveLength(6)
    expect(session.filter((e) => e.type === 'number')).toHaveLength(4)
  })

  it('las listas fijas tienen la respuesta entre las opciones y ejercicios distintos', () => {
    for (const topic of temasUnidad1) {
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
