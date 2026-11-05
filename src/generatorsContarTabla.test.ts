import { describe, expect, it } from 'vitest'
import { generate } from './generators'
import { mulberry32 } from './random'
import { exerciseKey } from './session'
import type { BlockSpec, ChoiceExercise } from './types'

const SEMILLAS = 300
const muchos = (spec: BlockSpec): ChoiceExercise[] =>
  Array.from({ length: SEMILLAS }, (_, seed) => {
    const e = generate(spec, mulberry32(seed))
    if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
    return e
  })

// Cuenta a mano, sin usar el generador: cuántos círculos cumplen las condiciones de la pregunta
function contar(e: ChoiceExercise) {
  const items = e.countMobile!.items
  const color = /\b(rojos|azules|verdes)\b/.exec(e.question)?.[1]
  const tamano = /\b(grandes|pequeños)\b/.exec(e.question)?.[1]
  const nombre = { rojos: 'rojo', azules: 'azul', verdes: 'verde' } as const
  return items.filter((i) => (color === undefined || i.color === nombre[color as keyof typeof nombre]) && (tamano === undefined || i.big === (tamano === 'grandes'))).length
}

describe('Contar con dos criterios (count-table)', () => {
  for (const ask of ['cell', 'size', 'color'] as const) {
    it(`${ask}: la respuesta es lo que se cuenta en el dibujo y las opciones son tres números distintos`, () => {
      for (const e of muchos({ kind: 'count-table', ask })) {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options).toContain(e.answer)
        expect(Number(e.answer), e.question).toBe(contar(e))
        for (const o of e.options) expect(Number(o)).toBeGreaterThanOrEqual(0)
        const m = /^¿Cuántos círculos (.+) hay\?$/.exec(e.question)
        expect(m, e.question).not.toBeNull()
        const criterios = m![1].split(' ').length
        expect(criterios).toBe(ask === 'cell' ? 2 : 1)
      }
    })
  }

  it('cada casilla (color y tamaño) tiene de 1 a 5 círculos y salen los tres colores y los dos tamaños', () => {
    for (const e of muchos({ kind: 'count-table', ask: 'cell' })) {
      const items = e.countMobile!.items
      for (const color of ['rojo', 'azul', 'verde'] as const) {
        for (const big of [true, false]) {
          const n = items.filter((i) => i.color === color && i.big === big).length
          expect(n).toBeGreaterThanOrEqual(1)
          expect(n).toBeLessThanOrEqual(5)
        }
      }
      expect(items.length).toBeLessThanOrEqual(30)
    }
  })

  it('la pregunta cambia entre ejercicios y el dibujo cuenta para distinguirlos', () => {
    const ejercicios = muchos({ kind: 'count-table', ask: 'cell' })
    expect(new Set(ejercicios.map((e) => e.question)).size).toBe(6)
    expect(new Set(ejercicios.map(exerciseKey)).size).toBeGreaterThan(250)
  })
})
