import { describe, expect, it } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import type { Exercise } from '../../types'
import { CUERPO, INSTRUMENTOS, MAGNITUDES, MAGNITUDES_ELEGIR, PESOS, UNIDADES, temaMedidas, TEMAS_MEDIDAS_ICONO } from './medidas'

const semillas = Array.from({ length: 300 }, (_, i) => i)
const sesion = (seed: number) => buildSession(temaMedidas.plan, mulberry32(seed))
const elegir = (e: Exercise) => {
  if (e.type !== 'choice') throw new Error('se esperaba elegir')
  return e
}

// Tablas de verdad escritas a mano, independientes de los datos
const MAGNITUD_DE: Record<string, 'longitud' | 'peso' | 'capacidad'> = {
  'lo alto que es una puerta': 'longitud',
  'lo largo que es un lápiz': 'longitud',
  'lo lejos que está la escuela': 'longitud',
  'lo que pesa una sandía': 'peso',
  'lo que pesa un perro': 'peso',
  'lo pesada que es una mochila': 'peso',
  'cuánta leche cabe en una jarra': 'capacidad',
  'cuánta agua cabe en una botella': 'capacidad',
  'cuánto zumo cabe en un vaso': 'capacidad',
}
const ETIQUETA_MAGNITUD = { longitud: 'La longitud', peso: 'El peso', capacidad: 'La capacidad' }
const ETIQUETA_INSTRUMENTO = { longitud: 'Una cinta métrica', peso: 'Una báscula', capacidad: 'Un vaso medidor' }
const KILOS: Record<string, number> = {
  'la ballena': 100000,
  'el elefante': 5000,
  'el caballo': 500,
  'el gato': 4,
  'el ratón': 0.02,
  'la mariposa': 0.0005,
  'la hormiga': 0.000003,
}

describe('Tema «Instrumentos y unidades»', () => {
  it('tiene un plan de 10 ejercicios y todas las sesiones son de elegir', () => {
    expect(temaMedidas.plan.reduce((suma, b) => suma + b.count, 0)).toBe(10)
    for (const seed of semillas) {
      const s = sesion(seed)
      expect(s).toHaveLength(10)
      for (const e of s) {
        const c = elegir(e)
        expect(c.options).toHaveLength(3)
        expect(new Set(c.options).size).toBe(3)
        expect(c.options).toContain(c.answer)
      }
    }
  })

  it('no repite un hecho en una sesión', () => {
    for (const seed of semillas) {
      const claves = sesion(seed).map((e) => elegir(e).fact)
      expect(new Set(claves).size).toBe(claves.length)
    }
  })

  it('las magnitudes de las situaciones están bien, tanto al elegir qué medimos como con qué', () => {
    const ver = (tabla: Record<string, string>, pregunta: RegExp) => {
      let vistos = 0
      for (const seed of semillas) {
        for (const e of sesion(seed)) {
          const c = elegir(e)
          const m = pregunta.exec(c.question)
          if (!m) continue
          vistos++
          const situacion = Object.keys(MAGNITUD_DE).find((s) => c.question.toLowerCase().includes(s))
          expect(situacion, c.question).toBeDefined()
          expect(c.answer, c.question).toBe(tabla[MAGNITUD_DE[situacion!]])
        }
      }
      expect(vistos).toBeGreaterThan(0)
    }
    ver(ETIQUETA_MAGNITUD, /^Si queremos saber .*qué medimos\?$/)
    ver(ETIQUETA_INSTRUMENTO, /^Para saber .*qué usamos\?$/)
  })

  it('las tablas de magnitudes y sus instrumentos coinciden con las de verdad', () => {
    for (const m of MAGNITUDES) expect(m.label).toBe(ETIQUETA_MAGNITUD[m.id as keyof typeof ETIQUETA_MAGNITUD])
    for (const m of MAGNITUDES_ELEGIR) expect(m.label).toBe(ETIQUETA_INSTRUMENTO[m.id as keyof typeof ETIQUETA_INSTRUMENTO])
    const situaciones = MAGNITUDES_ELEGIR.length
    expect(situaciones).toBe(3)
  })

  it('instrumentos y unidades: cada pregunta de ida y de vuelta es correcta', () => {
    const instrumento: Record<string, string> = { 'el peso': 'una báscula', 'la longitud': 'una cinta métrica', 'la capacidad': 'un vaso medidor' }
    const unidad: Record<string, string> = { 'el peso': 'en kilos', 'la longitud': 'en metros', 'la capacidad': 'en litros' }
    for (const [filas, tabla] of [[INSTRUMENTOS, instrumento], [UNIDADES, unidad]] as const) {
      expect(filas).toHaveLength(3)
      for (const f of filas) {
        const magnitud = Object.keys(tabla).find((k) => f.askBack.toLowerCase().includes(tabla[k]) || f.ask.toLowerCase().includes(k.replace(/^(el|la) /, '')))
        expect(magnitud, f.ask).toBeDefined()
        expect(f.answer).toBe(tabla[magnitud!])
        expect(f.answerBack).toBe(magnitud)
      }
    }
  })

  it('las medidas del cuerpo solo ofrecen respuestas falsas por construcción', () => {
    expect(CUERPO.length).toBeGreaterThanOrEqual(4)
    for (const h of CUERPO) {
      expect(h.wrong.length).toBeGreaterThanOrEqual(3)
      for (const w of h.wrong) expect(w).not.toBe(h.answer)
      expect(h.wrong.join(' ')).not.toMatch(/palmo|paso|pie|longitud|metro/i)
    }
    expect(CUERPO.find((h) => /largo de una mesa/.test(h.question))!.answer).toBe('con palmos')
  })

  it('en el peso de los animales, la respuesta pesa más (o menos) que todas las demás, al menos 5 veces', () => {
    expect(PESOS.length).toBeGreaterThanOrEqual(6)
    for (const h of PESOS) {
      const mas = /pesa más/.test(h.question)
      const menos = /pesa menos/.test(h.question)
      expect(mas !== menos, h.question).toBe(true)
      expect(KILOS[h.answer], h.answer).toBeDefined()
      expect(h.wrong).toHaveLength(2)
      for (const w of [h.answer, ...h.wrong]) expect(h.question, w).toContain(w.replace(/^(el|la) /, ''))
      for (const w of h.wrong) {
        expect(KILOS[w], w).toBeDefined()
        const razon = mas ? KILOS[h.answer] / KILOS[w] : KILOS[w] / KILOS[h.answer]
        expect(razon, `${h.answer} frente a ${w}`).toBeGreaterThanOrEqual(5)
      }
    }
  })

  it('gramática: empieza por mayúscula y termina en interrogación; el icono está en la fuente de emojis', () => {
    for (const seed of semillas.slice(0, 40)) {
      for (const e of sesion(seed)) {
        expect(e.question).toMatch(/^[¿A-ZÁÉÍÓÚÑ]/)
        expect(e.question).toMatch(/\?$/)
        expect(e.question).not.toMatch(/ de el | a el /)
      }
    }
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    expect(fuente.has(TEMAS_MEDIDAS_ICONO)).toBe(true)
    expect(temaMedidas.icon).toBe(TEMAS_MEDIDAS_ICONO)
  })

  it('la sesión combina los seis tipos de pregunta: magnitud (2), instrumento (2), pares (2), cuerpo (1) y animales (3)', () => {
    const s = sesion(5).map((e) => elegir(e).question)
    expect(s.filter((q) => /^Si queremos saber .*qué medimos\?$/.test(q))).toHaveLength(2)
    expect(s.filter((q) => /^Para saber .*qué usamos\?$/.test(q))).toHaveLength(2)
    expect(s.filter((q) => /pesa (más|menos)/.test(q))).toHaveLength(3)
  })
})
