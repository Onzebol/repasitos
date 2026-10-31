import { describe, expect, it } from 'vitest'
import { generate } from './generators'
import { ANIMALES } from './infantil/animales'
import { mulberry32 } from './random'
import type { BlockSpec, ChoiceExercise, Exercise } from './types'

const SEMILLAS = 300

const muchos = (spec: BlockSpec) => Array.from({ length: SEMILLAS }, (_, seed) => generate(spec, mulberry32(seed)))

function choice(e: Exercise): ChoiceExercise {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}

// Cuántos dibujos tiene un grupo (cada opción es el mismo animal repetido) y de qué animal es
const cuantos = (grupo: string) => [...grupo].length
const animalDe = (grupo: string) => ANIMALES.find((a) => a.emoji === [...grupo][0])!

describe('ANIMALES: nombres para las etiquetas', () => {
  it('cada animal tiene singular y plural', () => {
    for (const animal of ANIMALES) {
      expect(animal.singular.trim()).not.toBe('')
      expect(animal.plural.trim()).not.toBe('')
      expect(animal.singular).not.toBe(animal.plural)
    }
  })
})

describe('generate: ¿dónde hay…? (cantidad ↔ número, Infantil)', () => {
  const ejercicios = (spec: BlockSpec = { kind: 'group' }) => muchos(spec).map(choice)

  it('dice el número y pide el grupo que lo tiene: tres grupos del mismo animal, el correcto entre ellos', () => {
    for (const e of ejercicios()) {
      const n = Number(e.visual)
      expect(e.question).toBe(`¿Dónde hay ${n}?`)
      expect(e.options).toHaveLength(3)
      expect(e.options).toContain(e.answer)
      expect(cuantos(e.answer)).toBe(n)
      const animales = new Set(e.options.map((o) => animalDe(o).emoji))
      expect(animales.size, 'mismo animal en todos los grupos').toBe(1)
      expect(new Set(e.options.map(cuantos)).size, 'cantidades distintas').toBe(3)
      for (const opcion of e.options) {
        expect(cuantos(opcion)).toBeGreaterThanOrEqual(1)
        expect(cuantos(opcion)).toBeLessThanOrEqual(7)
      }
    }
  })

  it('cada grupo lleva una etiqueta para los lectores de pantalla con su cantidad y el animal', () => {
    for (const e of ejercicios()) {
      for (const opcion of e.options) {
        const animal = animalDe(opcion)
        const k = cuantos(opcion)
        expect(e.labels?.[opcion]).toBe(`${k} ${k === 1 ? animal.singular : animal.plural}`)
      }
    }
  })

  it('respeta el rango pedido y salen todas las cantidades', () => {
    const cantidades = ejercicios({ kind: 'group', min: 2, max: 5 }).map((e) => Number(e.visual))
    expect(new Set(cantidades)).toEqual(new Set([2, 3, 4, 5]))
  })
})

describe('generate: antes, después y el que falta (Infantil)', () => {
  const ejercicios = (mode: 'after' | 'before' | 'between', min?: number, max?: number) =>
    muchos({ kind: 'next-number', mode, min, max }).map(choice)

  it('después: el siguiente número, con tres cifras distintas del 1 al 9', () => {
    for (const e of ejercicios('after')) {
      const n = Number(/(\d+)\?$/.exec(e.question)![1])
      expect(e.question).toBe(`¿Qué número va después del ${n}?`)
      expect(Number(e.answer)).toBe(n + 1)
    }
  })

  it('antes: el número anterior', () => {
    for (const e of ejercicios('before')) {
      const n = Number(/(\d+)\?$/.exec(e.question)![1])
      expect(e.question).toBe(`¿Qué número va antes del ${n}?`)
      expect(Number(e.answer)).toBe(n - 1)
    }
  })

  it('el que falta: el del medio entre dos números que se ven', () => {
    for (const e of ejercicios('between')) {
      const [a, , b] = (e.visual ?? '').split(/\s+/)
      expect(e.question).toBe('¿Qué número falta?')
      expect(e.visual).toBe(`${a}  ?  ${b}`)
      expect(Number(b)).toBe(Number(a) + 2)
      expect(Number(e.answer)).toBe(Number(a) + 1)
    }
  })

  it('las opciones son tres cifras distintas dentro del rango y la respuesta está entre ellas', () => {
    for (const modo of ['after', 'before', 'between'] as const) {
      for (const e of ejercicios(modo)) {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options).toContain(e.answer)
        for (const opcion of e.options) {
          expect(Number(opcion)).toBeGreaterThanOrEqual(1)
          expect(Number(opcion)).toBeLessThanOrEqual(9)
        }
      }
    }
  })

  it('respeta el rango pedido (por ejemplo solo hasta el 5) y salen todas las respuestas posibles', () => {
    const respuestas = ejercicios('after', 1, 5).map((e) => Number(e.answer))
    expect(new Set(respuestas)).toEqual(new Set([2, 3, 4, 5]))
    const anteriores = ejercicios('before', 1, 5).map((e) => Number(e.answer))
    expect(new Set(anteriores)).toEqual(new Set([1, 2, 3, 4]))
  })
})

describe('generate: más y menos (Infantil)', () => {
  const ejercicios = (mode: 'more' | 'less') => muchos({ kind: 'more-less', mode }).map(choice)

  it('más: dos grupos del mismo animal con cantidades distintas y la respuesta es el mayor', () => {
    for (const e of ejercicios('more')) {
      expect(e.question).toBe('¿Dónde hay más?')
      expect(e.options).toHaveLength(2)
      const [a, b] = e.options.map(cuantos)
      expect(a).not.toBe(b)
      expect(cuantos(e.answer)).toBe(Math.max(a, b))
      expect(new Set(e.options.map((o) => animalDe(o).emoji)).size).toBe(1)
    }
  })

  it('menos: la respuesta es el grupo con menos dibujos', () => {
    for (const e of ejercicios('less')) {
      expect(e.question).toBe('¿Dónde hay menos?')
      const [a, b] = e.options.map(cuantos)
      expect(cuantos(e.answer)).toBe(Math.min(a, b))
    }
  })

  it('las cantidades van del 1 al 7 y los dos grupos llevan etiqueta accesible', () => {
    for (const modo of ['more', 'less'] as const) {
      for (const e of ejercicios(modo)) {
        for (const opcion of e.options) {
          expect(cuantos(opcion)).toBeGreaterThanOrEqual(1)
          expect(cuantos(opcion)).toBeLessThanOrEqual(7)
          const animal = animalDe(opcion)
          const k = cuantos(opcion)
          expect(e.labels?.[opcion]).toBe(`${k} ${k === 1 ? animal.singular : animal.plural}`)
        }
      }
    }
  })
})
