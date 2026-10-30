import { describe, expect, it } from 'vitest'
import { temasUnidad1 } from './unidad1'

describe('datos de la unidad 1 de Matemáticas', () => {
  it('tiene los seis temas del índice, con identificadores distintos', () => {
    expect(temasUnidad1).toHaveLength(6)
    const ids = temasUnidad1.map((topic) => topic.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(temasUnidad1.map((topic) => [topic.name, topic] as const))('%s tiene ejercicios y enunciados', (_name, topic) => {
    expect(topic.exercises.length).toBeGreaterThanOrEqual(8)
    for (const exercise of topic.exercises) {
      expect(exercise.question.trim()).not.toBe('')
    }
  })

  it('en los ejercicios de elegir, la respuesta está entre las opciones y no hay opciones repetidas', () => {
    for (const topic of temasUnidad1) {
      for (const exercise of topic.exercises) {
        if (exercise.type !== 'choice') continue
        expect(exercise.options, exercise.question).toContain(exercise.answer)
        expect(new Set(exercise.options).size, exercise.question).toBe(exercise.options.length)
      }
    }
  })

  it('en los ejercicios de escribir, la respuesta es un número entero que cabe en el teclado', () => {
    for (const topic of temasUnidad1) {
      for (const exercise of topic.exercises) {
        if (exercise.type !== 'number') continue
        expect(Number.isInteger(exercise.answer), exercise.question).toBe(true)
        expect(exercise.answer, exercise.question).toBeGreaterThanOrEqual(0)
        expect(exercise.answer, exercise.question).toBeLessThanOrEqual(999)
      }
    }
  })

  it('las sumas y restas escritas como "a + b =" tienen el resultado correcto', () => {
    let operaciones = 0
    for (const topic of temasUnidad1) {
      for (const exercise of topic.exercises) {
        if (exercise.type !== 'number') continue
        const match = exercise.question.match(/^(\d+) ([+−]) (\d+) =$/)
        if (!match) continue
        operaciones++
        const [, a, signo, b] = match
        const esperado = signo === '+' ? Number(a) + Number(b) : Number(a) - Number(b)
        expect(exercise.answer, exercise.question).toBe(esperado)
      }
    }
    expect(operaciones).toBeGreaterThan(10)
  })

  it('las decenas más cercanas elegidas son realmente las más cercanas', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'decena-cercana')
    expect(tema).toBeDefined()
    for (const exercise of tema!.exercises) {
      if (exercise.type !== 'choice') continue
      const n = Number(exercise.question.match(/\d+/)![0])
      const mas_cercana = Math.round(n / 10) * 10
      expect(exercise.answer, exercise.question).toBe(String(mas_cercana))
    }
  })
})
