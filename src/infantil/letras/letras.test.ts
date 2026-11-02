import { describe, expect, it } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { ChoiceExercise } from '../../types'
import { unidadesInfantil } from '../contenido'
import { ABECEDARIO } from '../trazos-letras'
import { RIMAS, SONIDOS } from './palabras'
import { temasLetras, unidadLetras } from './temas'

describeUnit('Letras de Infantil', temasLetras)

const SEMILLAS = 100
const sesion = (id: string, seed: number) => buildSession(temasLetras.find((topic) => topic.id === id)!.plan, mulberry32(seed), [])
const elegir = (id: string, seed: number) => sesion(id, seed).filter((e): e is ChoiceExercise => e.type === 'choice')

// Tablas de verdad escritas aquí por separado: la rima asonante (vocales desde la sílaba tónica) de cada terminación.
// Si dos familias compartieran asonancia, una opción equivocada «sonaría» a rima.
const ASONANCIA: Record<string, string> = {
  ato: 'a-o',
  ana: 'a-a',
  illo: 'i-o',
  eta: 'e-a',
  ente: 'e-e',
  ón: 'o',
  osa: 'o-a',
  uga: 'u-a',
}

// Sonido con el que empieza una palabra en castellano (de España), a partir de su ortografía: c suave, qu y k son /k/,
// ce, ci y z son /z/, v suena como b, gue y gui son /g/, ge, gi y j son /j/, la h no suena.
function sonidoInicial(palabra: string): string {
  const p = palabra.toLowerCase()
  if (p.startsWith('qu') || p.startsWith('k')) return 'c'
  if (/^c[ei]/.test(p) || p.startsWith('z')) return 'z'
  if (p.startsWith('c')) return 'c'
  if (p.startsWith('v')) return 'b'
  if (/^gu[ei]/.test(p)) return 'g'
  if (/^g[ei]/.test(p) || p.startsWith('j')) return 'j'
  return p[0]
}

describe('Letras de Infantil: contenido', () => {
  it('tiene sus temas y está registrada como la unidad de la materia Letras', () => {
    expect(temasLetras.map((topic) => topic.id)).toEqual(['rimas', 'sonido-inicial', 'trazo-vocales', 'trazo-consonantes', 'trazo-resto'])
    expect(unidadLetras.topics).toBe(temasLetras)
    expect(unidadesInfantil.letras).toEqual([unidadLetras])
  })

  it('cada tema tiene nombre, icono y color propios', () => {
    for (const tema of temasLetras) {
      expect(tema.name.trim()).not.toBe('')
      expect(tema.icon).not.toBe('')
      expect(tema.tint).toMatch(/^#/)
    }
    expect(new Set(temasLetras.map((t) => t.icon)).size).toBe(temasLetras.length)
  })

  it('todos los dibujos están en la fuente de emojis de la web', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    for (const { emoji, palabra } of [...RIMAS.flatMap((r) => r.palabras), ...SONIDOS]) {
      expect(fuente.has(emoji), `${palabra} ${emoji}`).toBe(true)
    }
  })

  it('cada dibujo se escribe con un solo carácter y no se repite dentro de una tabla', () => {
    for (const lista of [RIMAS.flatMap((r) => r.palabras), SONIDOS]) {
      for (const { emoji, palabra } of lista) expect([...emoji], palabra).toHaveLength(1)
      expect(new Set(lista.map((p) => p.emoji)).size).toBe(lista.length)
      expect(new Set(lista.map((p) => p.palabra)).size).toBe(lista.length)
    }
  })
})

describe('Letras de Infantil: tabla de rimas', () => {
  it('hay las familias esperadas, cada una con al menos dos palabras', () => {
    expect(RIMAS.map((r) => r.terminacion).sort()).toEqual(Object.keys(ASONANCIA).sort())
    for (const rima of RIMAS) expect(rima.palabras.length, rima.terminacion).toBeGreaterThanOrEqual(2)
  })

  it('todas las palabras de una familia acaban igual que ella (rima consonante)', () => {
    for (const rima of RIMAS) {
      for (const { palabra } of rima.palabras) expect(palabra.endsWith(rima.terminacion), `${palabra} / -${rima.terminacion}`).toBe(true)
    }
  })

  it('las familias no comparten rima asonante entre sí', () => {
    expect(new Set(Object.values(ASONANCIA)).size).toBe(RIMAS.length)
  })
})

describe('Letras de Infantil: tabla de sonidos iniciales', () => {
  it('el sonido de cada palabra coincide con el que sale de su ortografía', () => {
    for (const { palabra, sonido } of SONIDOS) expect(sonido, palabra).toBe(sonidoInicial(palabra))
  })

  it('cada sonido tiene al menos tres palabras y hay al menos ocho sonidos distintos', () => {
    const porSonido = new Map<string, number>()
    for (const { sonido } of SONIDOS) porSonido.set(sonido, (porSonido.get(sonido) ?? 0) + 1)
    expect(porSonido.size).toBeGreaterThanOrEqual(8)
    for (const [sonido, n] of porSonido) expect(n, sonido).toBeGreaterThanOrEqual(3)
  })
})

describe('Letras de Infantil: «Rimas»', () => {
  const rimaDe = (palabra: string) => RIMAS.find((r) => r.palabras.some((p) => p.palabra === palabra))!
  const porEmoji = (emoji: string) => [...RIMAS.flatMap((r) => r.palabras), ...SONIDOS].find((p) => p.emoji === emoji)!

  it('pregunta qué rima con una palabra, con tres dibujos como opciones y su nombre accesible', () => {
    for (let seed = 0; seed < SEMILLAS; seed++) {
      for (const e of elegir('rimas', seed)) {
        expect(e.question, e.question).toMatch(/^¿Qué rima con \p{L}+\?$/u)
        expect(e.options).toHaveLength(3)
        expect(e.visual).toBeTruthy()
        for (const opcion of e.options) expect(e.labels?.[opcion], opcion).toBeTruthy()
      }
    }
  })

  it('la respuesta es de la misma familia que la palabra y las otras dos opciones son de otras familias', () => {
    for (let seed = 0; seed < SEMILLAS; seed++) {
      for (const e of elegir('rimas', seed)) {
        const palabra = /con (\p{L}+)\?/u.exec(e.question)![1]
        const familia = rimaDe(palabra)
        expect(e.visual, e.question).toBe(familia.palabras.find((p) => p.palabra === palabra)!.emoji)
        const respuesta = e.labels![e.answer]
        expect(respuesta, e.question).not.toBe(palabra)
        expect(rimaDe(respuesta), `${palabra} / ${respuesta}`).toBe(familia)
        for (const opcion of e.options.filter((o) => o !== e.answer)) {
          const otra = e.labels![opcion]
          expect(rimaDe(otra).terminacion, `${palabra} / ${otra}`).not.toBe(familia.terminacion)
          expect(ASONANCIA[rimaDe(otra).terminacion], `${palabra} / ${otra}`).not.toBe(ASONANCIA[familia.terminacion])
        }
      }
    }
  })

  it('el nombre accesible de cada opción es la palabra de su dibujo', () => {
    for (const e of elegir('rimas', 7)) for (const opcion of e.options) expect(e.labels![opcion]).toBe(porEmoji(opcion).palabra)
  })

  it('en 100 sesiones salen todas las familias', () => {
    const vistas = new Set<string>()
    for (let seed = 0; seed < SEMILLAS; seed++) for (const e of elegir('rimas', seed)) vistas.add(rimaDe(/con (\p{L}+)\?/u.exec(e.question)![1]).terminacion)
    expect([...vistas].sort()).toEqual(RIMAS.map((r) => r.terminacion).sort())
  })
})

describe('Letras de Infantil: «Sonido inicial»', () => {
  const porEmoji = (emoji: string) => SONIDOS.find((p) => p.emoji === emoji)!

  it('pregunta qué dibujo empieza igual que una palabra, con tres dibujos como opciones y su nombre accesible', () => {
    for (let seed = 0; seed < SEMILLAS; seed++) {
      for (const e of elegir('sonido-inicial', seed)) {
        expect(e.question, e.question).toMatch(/^¿Cuál empieza igual que \p{L}+\?$/u)
        expect(e.options).toHaveLength(3)
        expect(e.visual).toBeTruthy()
        for (const opcion of e.options) expect(e.labels?.[opcion], opcion).toBeTruthy()
      }
    }
  })

  it('la respuesta empieza con el mismo sonido que la palabra y las otras dos opciones, con sonidos distintos entre sí y de él', () => {
    for (let seed = 0; seed < SEMILLAS; seed++) {
      for (const e of elegir('sonido-inicial', seed)) {
        const palabra = /que (\p{L}+)\?/u.exec(e.question)![1]
        const sonido = sonidoInicial(palabra)
        expect(porEmoji(e.visual!).palabra, e.question).toBe(palabra)
        expect(e.labels![e.answer], e.question).not.toBe(palabra)
        expect(sonidoInicial(e.labels![e.answer]), `${palabra} / ${e.labels![e.answer]}`).toBe(sonido)
        const otras = e.options.filter((o) => o !== e.answer).map((o) => sonidoInicial(e.labels![o]))
        for (const otro of otras) expect(otro, e.question).not.toBe(sonido)
        expect(new Set(otras).size, e.question).toBe(2)
      }
    }
  })

  it('en 100 sesiones salen todos los sonidos', () => {
    const vistos = new Set<string>()
    for (let seed = 0; seed < SEMILLAS; seed++) for (const e of elegir('sonido-inicial', seed)) vistos.add(sonidoInicial(/que (\p{L}+)\?/u.exec(e.question)![1]))
    expect([...vistos].sort()).toEqual([...new Set(SONIDOS.map((s) => s.sonido))].sort())
  })
})

describe('Letras de Infantil: trazo de letras con el dedo (#99)', () => {
  const trazos = ['trazo-vocales', 'trazo-consonantes', 'trazo-resto']
  const letrasDe = (id: string, seed: number) => sesion(id, seed).map((e) => (e.type === 'trace' ? e : null))

  it('hay un tema por tanda y cada ejercicio es de trazar una letra', () => {
    for (const id of trazos) {
      expect(temasLetras.some((t) => t.id === id), id).toBe(true)
      for (const e of letrasDe(id, 1)) expect(e?.letter, id).toBeDefined()
    }
  })

  it('las tres tandas reparten las 27 letras sin repetir ninguna, con la k y la ñ, vocales primero', () => {
    const todas = trazos.flatMap((id) => {
      const plan = temasLetras.find((t) => t.id === id)!.plan
      return plan.flatMap((b) => (b.spec.kind === 'trace' ? (b.spec.letters ?? []) : []))
    })
    const unicas = [...new Set(todas)]
    expect(unicas.sort()).toEqual([...ABECEDARIO].sort())
    expect(unicas).toContain('K')
    expect(todas.slice(0, 5)).toEqual(['A', 'E', 'I', 'O', 'U'])
  })

  it('cada tanda se hace en minúscula y en mayúscula, 10 ejercicios sin repetir', () => {
    for (const id of trazos) {
      for (let seed = 0; seed < SEMILLAS; seed++) {
        const ej = letrasDe(id, seed)
        expect(ej).toHaveLength(10)
        expect(ej.some((e) => e?.lowercase)).toBe(true)
        expect(ej.some((e) => !e?.lowercase)).toBe(true)
        expect(new Set(ej.map((e) => e!.answer)).size).toBe(10)
      }
    }
  })

  it('las vocales salen todas, en las dos formas', () => {
    expect(new Set(letrasDe('trazo-vocales', 3).map((e) => e!.answer))).toEqual(new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']))
  })
})
