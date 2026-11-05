import { describe, expect, it } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { mulberry32 } from '../../random'
import { buildSession, exerciseKey } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { BlockSpec, ChoiceExercise, Topic } from '../../types'
import { temasUnidad3 } from './unidad3'
import { unidadesMedio } from './unidades'

describeUnit('Unidad 3 de Conocimiento del medio', temasUnidad3)

const tema = (id: string): Topic => temasUnidad3.find((t) => t.id === id)!

// Cuántos hechos distintos puede preguntar un bloque (cada uno cuenta una vez, aunque se pregunte de varias formas)
function hechosDe(spec: BlockSpec): number {
  switch (spec.kind) {
    case 'facts':
      return spec.items.length
    case 'classify':
      return spec.items.length
    case 'pick-member':
      return spec.items.filter((m) => !m.plural).length
    case 'pairs':
      return spec.rows.length
    case 'sequence': {
      const n = spec.steps.length
      return (spec.first ? 1 : 0) + (spec.last ? 1 : 0) + (spec.after ? n - 1 : 0) + (spec.before ? n - 1 : 0)
    }
    default:
      throw new Error(`bloque inesperado: ${spec.kind}`)
  }
}

const SESIONES = 150
function ejercicios(t: Topic): ChoiceExercise[] {
  return Array.from({ length: SESIONES }, (_, seed) => buildSession(t.plan, mulberry32(seed), [])).flatMap((sesion) =>
    sesion.map((e) => {
      if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
      return e
    }),
  )
}

describe('Unidad 3 de Conocimiento del medio: estructura', () => {
  it('es la tercera de las 9 unidades del índice y se llama como el libro', () => {
    expect(unidadesMedio[2].id).toBe('u3')
    expect(unidadesMedio[2].note).toBe('Identificamos plantas')
    expect(unidadesMedio[2].topics).toBe(temasUnidad3)
  })

  it('tiene los cuatro temas de la unidad y el repaso del trimestre, en el orden del libro, con icono y color propios', () => {
    expect(temasUnidad3.map((t) => t.id)).toEqual(['comun', 'clasificar', 'reproduccion', 'importancia', 'repaso'])
    expect(temasUnidad3.map((t) => t.name)).toEqual([
      '¿Qué tienen las plantas en común?',
      '¿Cómo clasificamos las plantas?',
      'Las plantas se reproducen',
      '¿Por qué son importantes las plantas?',
      'Repaso del primer trimestre',
    ])
    expect(new Set(temasUnidad3.map((t) => t.icon)).size).toBe(5)
    for (const t of temasUnidad3) expect(t.tint).toMatch(/^#/)
  })

  it('cada sesión mezcla los bloques de cada tema como está previsto', () => {
    const cuentas = (id: string) => tema(id).plan.map((b) => b.count)
    expect(cuentas('comun')).toEqual([2, 3, 5])
    expect(cuentas('clasificar')).toEqual([3, 2, 1, 1, 3])
    expect(cuentas('reproduccion')).toEqual([3, 3, 4])
    expect(cuentas('importancia')).toEqual([2, 2, 2, 4])
    expect(cuentas('repaso')).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 2])
  })

  it('cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión, para que una sesión no repita la anterior', () => {
    for (const t of temasUnidad3) {
      for (const bloque of t.plan) {
        expect(hechosDe(bloque.spec), `${t.name} (${bloque.spec.kind})`).toBeGreaterThanOrEqual(2 * bloque.count)
      }
    }
  })

  it('una sesión seguida de otra no repite ningún hecho si hay donde elegir (todos los temas)', () => {
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

describe('Unidad 3 de Conocimiento del medio: lo generado está bien hecho', () => {
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

  it('la gramática es correcta: sin «de el» ni «a el» y con mayúscula al empezar', () => {
    for (const t of temasUnidad3) {
      for (const e of ejercicios(t)) {
        for (const texto of [e.question, ...e.options]) expect(texto, texto).not.toMatch(/\b(de|a) el\b/)
        const primera = e.question.replace(/^¿/, '')[0]
        expect(primera, e.question).toBe(primera.toUpperCase())
      }
    }
  })

  it('todos los emojis de las tablas están en la fuente de la web', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    const texto = JSON.stringify(temasUnidad3.map((t) => t.plan.map((b) => b.spec)))
    const simbolos = [...texto.replace(/️/g, '').matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0])
    expect(simbolos.length).toBeGreaterThan(20)
    for (const simbolo of simbolos) expect(fuente.has(simbolo), `${simbolo} no está en la fuente`).toBe(true)
    for (const t of temasUnidad3) expect(fuente.has(t.icon.replace(/️/g, '')), `${t.icon} no está en la fuente`).toBe(true)
  })

  it('ninguna pregunta habla de la persona que contesta ni de su familia (no se piden datos personales)', () => {
    for (const t of temasUnidad3) {
      for (const e of ejercicios(t)) expect(e.question, e.question).not.toMatch(/\btu\b|\btus\b|\bmi\b|\bmis\b/i)
    }
  })

  it('los dos sentidos de una pregunta de pares, y los de una tabla de clasificar y elegir, comparten hecho (no salen los dos en una sesión)', () => {
    for (const t of temasUnidad3) {
      for (let seed = 0; seed < 100; seed++) {
        const hechos = buildSession(t.plan, mulberry32(seed), []).map((e) => (e.type === 'choice' ? e.fact : ''))
        expect(new Set(hechos).size, `${t.name} semilla ${seed}`).toBe(hechos.length)
      }
    }
  })
})
