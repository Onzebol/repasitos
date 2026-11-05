import { describe, expect, it } from 'vitest'
import { generate } from './generators'
import { mulberry32 } from './random'
import type { BlockSpec, Exercise } from './types'

const SEMILLAS = 300
const muchos = (spec: BlockSpec) => Array.from({ length: SEMILLAS }, (_, seed) => generate(spec, mulberry32(seed)))

function number(e: Exercise) {
  if (e.type !== 'number') throw new Error(`se esperaba escribir: ${e.question}`)
  return e
}
function choice(e: Exercise) {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}

describe('Desagrupar una decena (regroup)', () => {
  it('units: «53 = 4 decenas y ❓ unidades» pide las unidades tras pasar una decena', () => {
    const vistos = new Set<number>()
    for (const e of muchos({ kind: 'regroup', ask: 'units' }).map(number)) {
      const m = /^Desagrupamos una decena de (\d\d)\. \1 = (\d) decenas? y ❓ unidades$/.exec(e.question)
      expect(m, e.question).not.toBeNull()
      const n = Number(m![1])
      vistos.add(n)
      expect(n % 10, e.question).toBeLessThan(9)
      expect(n, e.question).toBeGreaterThanOrEqual(20)
      // 53 = 4 decenas y 13 unidades: las dos formas valen lo mismo
      expect(Number(m![2]) * 10 + e.answer, e.question).toBe(n)
      expect(e.answer, e.question).toBeGreaterThanOrEqual(10)
    }
    expect(vistos.size).toBeGreaterThan(15)
  })

  it('tens: «53 = ❓ decenas y 13 unidades» pide las decenas que quedan', () => {
    for (const e of muchos({ kind: 'regroup', ask: 'tens' }).map(number)) {
      const m = /^Desagrupamos una decena de (\d\d)\. \1 = ❓ decenas y (\d\d) unidades$/.exec(e.question)
      expect(m, e.question).not.toBeNull()
      const n = Number(m![1])
      expect(e.answer * 10 + Number(m![2]), e.question).toBe(n)
      expect(Number(m![2]), e.question).toBeGreaterThanOrEqual(10)
      expect(e.answer, e.question).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('El primer paso de una resta llevando (borrow-step)', () => {
  it('elige desagrupar entre tres pasos, solo uno correcto, cuando las unidades de arriba son menores', () => {
    for (const e of muchos({ kind: 'borrow-step' }).map(choice)) {
      const m = /^En (\d\d) − (\d\d), como (\d) > (\d), ¿qué hacemos primero\?$/.exec(e.question)
      expect(m, e.question).not.toBeNull()
      const [minuendo, sustraendo, mayor, menor] = m!.slice(1).map(Number)
      expect(minuendo % 10).toBe(menor)
      expect(sustraendo % 10).toBe(mayor)
      expect(mayor).toBeGreaterThan(menor)
      expect(Math.floor(minuendo / 10)).toBeGreaterThan(Math.floor(sustraendo / 10))
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      const bien = `Desagrupamos una decena: ${menor} pasa a ${menor + 10} unidades`
      expect(e.answer).toBe(bien)
      expect(e.options).toContain(bien)
      expect(e.options.filter((o) => o.startsWith('Desagrupamos'))).toHaveLength(1)
    }
  })
})
