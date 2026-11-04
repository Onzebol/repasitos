import { describe, expect, it } from 'vitest'
import emojiFont from './assets/emoji-font.css?raw'
import { emojisDeLaFuente } from './emojiFont'
import { generate } from './generators'
import { mulberry32 } from './random'
import type { BlockSpec, Exercise } from './types'

const SEMILLAS = 300
const muchos = (spec: BlockSpec) => Array.from({ length: SEMILLAS }, (_, seed) => generate(spec, mulberry32(seed)))

function choice(e: Exercise) {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}
function number(e: Exercise) {
  if (e.type !== 'number') throw new Error(`se esperaba escribir un número: ${e.question}`)
  return e
}

// Cuartos de litro de cada recipiente, escritos a mano (botella 1 l, bol ½ l, vaso ¼ l)
const CUARTOS: Record<string, number> = { '🍼': 4, '🥣': 2, '🥛': 1 }

describe('El litro: medio litro y cuarto de litro', () => {
  it('liter-parts: cuántas jarras de ½ l o vasos de ¼ l llenan N litros (se calcula en cuartos)', () => {
    for (const [part, cuartos, nombre] of [['half', 2, 'jarras de ½ l'], ['quarter', 1, 'vasos de ¼ l']] as const) {
      const ejercicios = muchos({ kind: 'liter-parts', part }).map(number)
      const litros = new Set<number>()
      for (const e of ejercicios) {
        expect(e.question, e.question).toContain(nombre)
        const n = Number(/de (\d+) l/.exec(e.question)![1])
        litros.add(n)
        expect(e.answer, e.question).toBe((n * 4) / cuartos)
      }
      expect(litros.size).toBeGreaterThanOrEqual(2)
    }
  })

  it('liter-sum: la suma da litros enteros, de 2 a 6, con al menos dos clases de recipiente', () => {
    const vistos = new Set<string>()
    for (const e of muchos({ kind: 'liter-sum' }).map(number)) {
      const visual = e.visual!
      const total = [...visual].reduce((s, c) => s + (CUARTOS[c] ?? 0), 0)
      expect(total % 4, visual).toBe(0)
      expect(e.answer, visual).toBe(total / 4)
      expect(e.answer, visual).toBeGreaterThanOrEqual(2)
      expect(e.answer, visual).toBeLessThanOrEqual(6)
      expect(Object.keys(CUARTOS).filter((c) => visual.includes(c)).length, visual).toBeGreaterThanOrEqual(2)
      expect(e.question).toContain('1 l')
      expect(e.question).toContain('½ l')
      expect(e.question).toContain('¼ l')
      vistos.add(visual)
    }
    expect(vistos.size).toBeGreaterThan(30)
  })

  it('liter-label: botella 1 l, bol ½ l y vaso ¼ l, preguntando por la cantidad o por el recipiente', () => {
    const REF: Record<string, string> = { botella: '1 l', bol: '½ l', vaso: '¼ l' }
    for (const e of muchos({ kind: 'liter-label', ask: 'amount' }).map(choice)) {
      const recipiente = Object.keys(REF).find((r) => e.question.includes(r))!
      expect(e.options, e.question).toEqual(expect.arrayContaining(['1 l', '½ l', '¼ l']))
      expect(e.answer, e.question).toBe(REF[recipiente])
    }
    for (const e of muchos({ kind: 'liter-label', ask: 'container' }).map(choice)) {
      const cantidad = Object.values(REF).find((c) => e.question.includes(c))!
      expect(e.options).toHaveLength(3)
      const dicho = Object.keys(REF).find((r) => e.answer.includes(r))!
      expect(REF[dicho], e.question).toBe(cantidad)
    }
  })

  it('liter-compare: el signo corresponde a los litros, con enteros y con fracciones', () => {
    for (const e of muchos({ kind: 'liter-compare' }).map(choice)) {
      const [a, b] = e.visual!.split(/\s+❓\s+/).map((t) => Number(t.replace(' l', '')))
      expect(a).not.toBe(b)
      expect(e.options).toEqual(expect.arrayContaining(['>', '<']))
      expect(e.answer, e.visual).toBe(a > b ? '>' : '<')
    }
    const VALOR: Record<string, number> = { '¼ l': 0.25, '½ l': 0.5, '1 l': 1 }
    for (const e of muchos({ kind: 'liter-compare', fractions: true }).map(choice)) {
      const [a, b] = e.visual!.split(/\s+❓\s+/)
      expect(VALOR[a], e.visual).toBeDefined()
      expect(VALOR[b], e.visual).toBeDefined()
      expect(a).not.toBe(b)
      expect(e.answer, e.visual).toBe(VALOR[a] > VALOR[b] ? '>' : '<')
    }
  })

  it('los dibujos están en la fuente de emojis', () => {
    const fuente = new Set(emojisDeLaFuente(emojiFont))
    for (const c of ['🍼', '🥣', '🥛']) expect(fuente.has(c), c).toBe(true)
  })
})
