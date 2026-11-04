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

// Una resta lleva si las unidades del minuendo son menores que las del sustraendo (escrito a mano, sin usar los generadores)
const lleva = (minuendo: number, sustraendo: number) => minuendo % 10 < sustraendo % 10

describe('Completar la resta para que lleve o no lleve', () => {
  it('minuend-digit: de tres minuendos solo uno cumple la condición y la resta siempre es posible', () => {
    for (const carry of [false, true]) {
      const ejercicios = muchos({ kind: 'borrow-condition', ask: 'minuend-digit', carry }).map(choice)
      const decenas = new Set<number>()
      for (const e of ejercicios) {
        const m = /^(\d)❓ − (\d\d)$/.exec(e.visual!)
        expect(m, e.visual).not.toBeNull()
        const t = Number(m![1])
        const sustraendo = Number(m![2])
        decenas.add(t)
        expect(e.question, e.visual).toContain(carry ? 'llevando' : 'sin llevar')
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        for (const o of e.options) {
          const minuendo = Number(o)
          expect(Math.floor(minuendo / 10), e.visual).toBe(t) // solo cambia la cifra de las unidades
          expect(minuendo, e.visual).toBeGreaterThan(sustraendo)
          expect(lleva(minuendo, sustraendo) === carry, `${o} − ${sustraendo}`).toBe(o === e.answer)
          // tras pedir una decena aún alcanzan las decenas
          expect(Math.floor(minuendo / 10) - 1, e.visual).toBeGreaterThanOrEqual(Math.floor(sustraendo / 10))
        }
      }
      expect(decenas.size).toBeGreaterThan(3)
    }
  })

  it('subtrahend: de tres sustraendos solo uno cumple la condición y siempre se puede restar', () => {
    for (const carry of [false, true]) {
      const ejercicios = muchos({ kind: 'borrow-condition', ask: 'subtrahend', carry }).map(choice)
      const minuendos = new Set<number>()
      for (const e of ejercicios) {
        const m = /^(\d\d) − ❓$/.exec(e.visual!)
        expect(m, e.visual).not.toBeNull()
        const minuendo = Number(m![1])
        minuendos.add(minuendo)
        expect(e.question, e.visual).toContain(carry ? 'llevando' : 'sin llevar')
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        for (const o of e.options) {
          const sustraendo = Number(o)
          expect(sustraendo, e.visual).toBeGreaterThanOrEqual(10)
          expect(Math.floor(minuendo / 10) - 1, `${minuendo} − ${o}`).toBeGreaterThanOrEqual(Math.floor(sustraendo / 10))
          expect(lleva(minuendo, sustraendo) === carry, `${minuendo} − ${o}`).toBe(o === e.answer)
        }
      }
      expect(minuendos.size).toBeGreaterThan(10)
    }
  })
})
