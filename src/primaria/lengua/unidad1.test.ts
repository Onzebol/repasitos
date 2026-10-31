import { describe, expect, it } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { mulberry32 } from '../../random'
import { buildSession, exerciseKey } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { BlockSpec, ChoiceExercise, Topic } from '../../types'
import { temasUnidad1 } from './unidad1'
import { unidadesLengua } from './unidades'

describeUnit('Unidad 1 de Lengua', temasUnidad1)

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
    case 'sequence': {
      const n = spec.steps.length
      return (spec.first ? 1 : 0) + (spec.last ? 1 : 0) + (spec.after ? n - 1 : 0) + (spec.before ? n - 1 : 0)
    }
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

describe('Unidad 1 de Lengua: estructura', () => {
  it('es la primera de las 9 unidades del índice y las demás aún no tienen temas', () => {
    expect(unidadesLengua).toHaveLength(9)
    expect(unidadesLengua.map((unidad) => unidad.id)).toEqual(['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'])
    expect(unidadesLengua[0].topics).toBe(temasUnidad1)
    for (const unidad of unidadesLengua.slice(1)) expect(unidad.topics).toEqual([])
  })

  it('cada unidad lleva el título del libro como nota y un icono que dibuja la fuente de la web', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    expect(unidadesLengua.map((u) => u.note)).toEqual([
      '¿Te gusta aprender?',
      '¿Qué sabes sobre los animales?',
      '¿Te sientes artista?',
      '¿Nos vamos de viaje?',
      '¿A qué jugamos?',
      '¿Dónde es la fiesta?',
      '¿Te interesa la ciencia?',
      '¿Lo hablamos?',
      '¿Concursamos?',
    ])
    for (const unidad of unidadesLengua) {
      expect(unidad.name).toMatch(/^Unidad [1-9]$/)
      expect(fuente.has(unidad.icon.replace(/️/g, '')), `${unidad.icon} no está en la fuente`).toBe(true)
    }
  })

  it('tiene los temas previstos, cada uno con icono y color propios', () => {
    expect(temasUnidad1.map((t) => t.id)).toEqual(['sinonimos', 'mayuscula', 'describir', 'lenguas', 'abecedario', 'rimas', 'lectura'])
    expect(temasUnidad1.map((t) => t.name)).toEqual([
      'Sinónimos y palabras del colegio',
      'La mayúscula',
      'Describir personas',
      'Lenguas de España',
      'Abecedario y sílabas',
      'Palabras que riman',
      'Comprensión lectora',
    ])
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    for (const t of temasUnidad1) expect(fuente.has(t.icon.replace(/️/g, '')), `${t.icon} no está en la fuente`).toBe(true)
    expect(new Set(temasUnidad1.map((t) => t.icon)).size).toBe(temasUnidad1.length)
    for (const t of temasUnidad1) expect(t.tint).toMatch(/^#/)
  })

  it('cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión, para que una sesión no repita la anterior', () => {
    for (const t of temasUnidad1) {
      for (const bloque of t.plan) {
        expect(hechosDe(bloque.spec), `${t.name} (${bloque.spec.kind})`).toBeGreaterThanOrEqual(2 * bloque.count)
      }
    }
  })

  it('una sesión seguida de otra no repite ningún hecho si hay donde elegir', () => {
    for (const t of temasUnidad1) {
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

describe('Unidad 1 de Lengua: lo generado está bien hecho', () => {
  it('todos son de elegir, con la respuesta entre tres opciones distintas y sin textos vacíos', () => {
    for (const t of temasUnidad1) {
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
    for (const t of temasUnidad1) {
      for (let seed = 0; seed < 100; seed++) {
        const hechos = buildSession(t.plan, mulberry32(seed), []).map((e) => (e.type === 'choice' ? e.fact : ''))
        expect(new Set(hechos).size, `${t.name} semilla ${seed}`).toBe(hechos.length)
      }
    }
  })

  it('la gramática es correcta: sin «de el» ni «a el» y con mayúscula al empezar', () => {
    for (const t of temasUnidad1) {
      for (const e of ejercicios(t)) {
        for (const texto of [e.question, ...e.options]) expect(texto, texto).not.toMatch(/\b(de|a) el\b/)
        const primera = e.question.replace(/^¿/, '')[0]
        expect(primera, e.question).toBe(primera.toUpperCase())
      }
    }
  })

  it('todos los emojis de las tablas están en la fuente de la web', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    const texto = JSON.stringify(temasUnidad1.map((t) => t.plan.map((b) => b.spec)))
    const simbolos = [...texto.replace(/️/g, '').matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0])
    expect(simbolos.length).toBeGreaterThanOrEqual(5)
    for (const simbolo of simbolos) expect(fuente.has(simbolo), `${simbolo} no está en la fuente`).toBe(true)
  })

  it('ninguna pregunta se dirige a la persona que contesta para pedirle datos suyos', () => {
    for (const t of temasUnidad1) {
      for (const e of ejercicios(t)) expect(e.question, e.question).not.toMatch(/\b(tu|tus|tuyo|tuya)\b|¿Cómo te llamas|¿Dónde vives/i)
    }
  })
})
