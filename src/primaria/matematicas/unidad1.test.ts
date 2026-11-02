import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { BlockSpec } from '../../types'
import { temasUnidad1 } from './unidad1'

describeUnit('Unidad 1 de Matemáticas', temasUnidad1)

describe('Unidad 1 de Matemáticas: contenido', () => {
  it('tiene los seis temas del índice', () => {
    expect(temasUnidad1.map((topic) => topic.id)).toEqual([
      'numeros-99',
      'decenas-unidades',
      'mayor-menor',
      'sumas-restas',
      'decena-cercana',
      'calculo-mental',
    ])
  })

  it('ningún tema depende de listas fijas: leer y escribir números se generan para todos los números', () => {
    for (const tema of temasUnidad1) {
      expect(tema.plan.some((bloque) => bloque.spec.kind === 'bag'), tema.name).toBe(false)
    }
  })

  it('"Números hasta el 99" lee y escribe números y pregunta por las decenas y las unidades', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'numeros-99')!
    for (let seed = 0; seed < 30; seed++) {
      const preguntas = buildSession(tema.plan, mulberry32(seed)).map((e) => e.question)
      expect(preguntas.filter((q) => /¿Cómo se lee el número/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /Escribe con cifras/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Qué número tiene \d+ decenas?\?/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Qué número tiene \d+ unidad(es)?\?/.test(q))).toHaveLength(1)
    }
  })

  it('"Decenas y unidades" descompone números y pasa de decenas a unidades y al revés', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'decenas-unidades')!
    for (let seed = 0; seed < 30; seed++) {
      const preguntas = buildSession(tema.plan, mulberry32(seed)).map((e) => e.question)
      expect(preguntas.filter((q) => /^Descompón el/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Qué suma es\?/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Cómo se lee \d+ \+ \d+\?/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /= ❓ unidades/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /= ❓ decenas/.test(q))).toHaveLength(1)
    }
  })

  it('"Sumas y restas sin llevar" mezcla columnas, problemas con texto y elegir el signo de la operación', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'sumas-restas')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      expect(session.filter((e) => e.type === 'column')).toHaveLength(5)
      expect(session.filter((e) => e.type === 'number')).toHaveLength(4)
      const signo = session.filter((e) => e.type === 'choice')
      expect(signo).toHaveLength(1)
      expect(signo[0].question).toMatch(/signo/)
    }
  })

  it('"La decena más cercana" practica la decena, entre qué decenas está, la regla del 5 y el «más o menos»', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'decena-cercana')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      const preguntas = session.map((e) => e.question)
      expect(preguntas.filter((q) => /decena más cercana/.test(q))).toHaveLength(5)
      expect(preguntas.filter((q) => /Entre qué dos decenas/.test(q))).toHaveLength(2)
      expect(preguntas.filter((q) => /cifra de las unidades/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /más o menos/i.test(q))).toHaveLength(2)
    }
  })

  it('"Cálculo mental" incluye series de saltos pequeños, también hacia atrás', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'calculo-mental')!
    const series = tema.plan
      .map((bloque) => bloque.spec)
      .filter((spec): spec is Extract<BlockSpec, { kind: 'series' }> => spec.kind === 'series')
    expect(series.some((spec) => !spec.down)).toBe(true)
    expect(series.some((spec) => spec.down)).toBe(true)
    for (const spec of series) {
      expect([2, 3, 4, 5]).toContain(spec.step)
      expect(spec.max).toBeLessThanOrEqual(20)
    }
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      expect(session.filter((e) => /Completa la serie/.test(e.question))).toHaveLength(4)
    }
  })
})
