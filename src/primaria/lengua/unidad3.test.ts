import { describe, expect, it, vi } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { mulberry32 } from '../../random'
import { buildSession, exerciseKey } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { BlockSpec, ChoiceExercise, Topic } from '../../types'
import { temasUnidad3 } from './unidad3'
import { unidadesLengua } from './unidades'

// Cada comprobación genera 150 sesiones de cada tema: con toda la batería a la vez puede pasar de los 5 s por defecto
vi.setConfig({ testTimeout: 30_000 })

describeUnit('Unidad 3 de Lengua', temasUnidad3)

// Cuántos hechos distintos puede preguntar un bloque (cada uno cuenta una vez, aunque se pregunte de varias formas)
function hechosDe(spec: BlockSpec): number {
  switch (spec.kind) {
    case 'facts':
    case 'classify':
      return spec.items.length
    case 'pick-member':
      return spec.items.filter((m) => !m.plural).length
    case 'pairs':
      return spec.rows.length
    default:
      throw new Error(`bloque inesperado: ${spec.kind}`)
  }
}

// Muchas sesiones de un tema (cada una con su semilla)
const SESIONES = 150
function ejercicios(t: Topic): ChoiceExercise[] {
  return Array.from({ length: SESIONES }, (_, seed) => buildSession(t.plan, mulberry32(seed), [])).flatMap((sesion) =>
    sesion.map((e) => {
      if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
      return e
    }),
  )
}

describe('Unidad 3 de Lengua: estructura', () => {
  it('es la tercera unidad del índice', () => {
    expect(unidadesLengua[2].id).toBe('u3')
    expect(unidadesLengua[2].topics).toBe(temasUnidad3)
  })

  it('tiene los temas previstos, cada uno con icono y color propios', () => {
    expect(temasUnidad3.map((t) => t.id)).toEqual(['arte', 'aumentativos', 'c-qu', 'completar', 'sustantivos', 'describir', 'biblioteca', 'lectura'])
    expect(temasUnidad3.map((t) => t.name)).toEqual([
      'Palabras del arte',
      'Aumentativos y diminutivos',
      'ca, co, cu, que, qui',
      'Completar oraciones',
      'Sustantivos comunes y propios',
      'Describir objetos',
      'La biblioteca del colegio',
      'Comprensión lectora',
    ])
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    for (const t of temasUnidad3) expect(fuente.has(t.icon.replace(/️/g, '')), `${t.icon} no está en la fuente`).toBe(true)
    expect(new Set(temasUnidad3.map((t) => t.icon)).size).toBe(temasUnidad3.length)
    for (const t of temasUnidad3) expect(t.tint).toMatch(/^#/)
  })

  it('cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión, para que una sesión no repita la anterior', () => {
    for (const t of temasUnidad3) {
      for (const bloque of t.plan) {
        expect(hechosDe(bloque.spec), `${t.name} (${bloque.spec.kind})`).toBeGreaterThanOrEqual(2 * bloque.count)
      }
    }
  })

  it('una sesión seguida de otra no repite ningún hecho si hay donde elegir', () => {
    for (const t of temasUnidad3) {
      let repetidos = 0
      for (let seed = 0; seed < 100; seed++) {
        const rng = mulberry32(seed)
        const primera = buildSession(t.plan, rng, [])
        const segunda = buildSession(t.plan, rng, primera.map(exerciseKey))
        const hechos = new Set(primera.map((e) => (e.type === 'choice' ? e.fact : '')))
        repetidos += segunda.filter((e) => e.type === 'choice' && hechos.has(e.fact)).length
      }
      expect(repetidos, t.name).toBe(0)
    }
  })
})

describe('Unidad 3 de Lengua: lo generado está bien hecho', () => {
  it('todos son de elegir, con la respuesta entre tres opciones distintas y sin textos vacíos', () => {
    for (const t of temasUnidad3) {
      for (const e of ejercicios(t)) {
        expect(e.question.trim(), `${t.name}: enunciado`).not.toBe('')
        expect(e.options, e.question).toHaveLength(3)
        expect(new Set(e.options).size, e.question).toBe(3)
        expect(e.options, e.question).toContain(e.answer)
        for (const opcion of e.options) expect(opcion.trim(), e.question).not.toBe('')
        expect(e.fact, e.question).toBeDefined()
      }
    }
  })

  it('en una sesión no sale el mismo hecho dos veces', () => {
    for (const t of temasUnidad3) {
      for (let seed = 0; seed < 100; seed++) {
        const hechos = buildSession(t.plan, mulberry32(seed), []).map((e) => (e.type === 'choice' ? e.fact : ''))
        expect(new Set(hechos).size, `${t.name} semilla ${seed}`).toBe(hechos.length)
      }
    }
  })

  it('la gramática es correcta: sin «de el» ni «a el» y con mayúscula al empezar', () => {
    for (const t of temasUnidad3) {
      for (const e of ejercicios(t)) {
        for (const texto of [e.question, ...e.options, e.text ?? '']) expect(texto, texto).not.toMatch(/\b(de|a) el\b/)
        const primera = e.question.replace(/^¿/, '')[0]
        expect(primera, e.question).toBe(primera.toUpperCase())
      }
    }
  })

  it('todos los emojis de las tablas están en la fuente de la web', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    const texto = JSON.stringify(temasUnidad3.map((t) => t.plan.map((b) => b.spec)))
    const simbolos = [...texto.replace(/️/g, '').matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0])
    expect(simbolos.length).toBeGreaterThanOrEqual(5)
    for (const simbolo of simbolos) expect(fuente.has(simbolo), `${simbolo} no está en la fuente`).toBe(true)
  })

  it('ninguna pregunta se dirige a la persona que contesta para pedirle datos suyos', () => {
    for (const t of temasUnidad3) {
      for (const e of ejercicios(t)) expect(e.question, e.question).not.toMatch(/\b(tu|tus|tuyo|tuya)\b|¿Cómo te llamas|¿Dónde vives/i)
    }
  })
})
