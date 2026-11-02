import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { BlockSpec } from '../../types'
import { temasUnidad1 } from './unidad1'

describeUnit('Unidad 1 de Matemáticas', temasUnidad1)

describe('Unidad 1 de Matemáticas: contenido', () => {
  it('tiene los seis temas del índice, el laboratorio de problemas y el taller de itinerarios', () => {
    expect(temasUnidad1.map((topic) => topic.id)).toEqual([
      'numeros-99',
      'tabla-99',
      'decenas-unidades',
      'mayor-menor',
      'sumas-restas',
      'decena-cercana',
      'problemas',
      'calculo-mental',
      'itinerarios',
    ])
  })

  it('"Planos e itinerarios" sigue las flechas, elige el itinerario y pregunta por dónde pasa el camino', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'itinerarios')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      const preguntas = session.map((e) => e.question)
      expect(preguntas.filter((q) => /^Sigue las flechas desde Repi/.test(q))).toHaveLength(4)
      expect(preguntas.filter((q) => /^¿Qué itinerario lleva a Repi/.test(q))).toHaveLength(3)
      expect(preguntas.filter((q) => q === '¿Por qué sitio pasa Repi?')).toHaveLength(3)
      expect(session.every((e) => e.type === 'choice' && e.route !== undefined)).toBe(true)
    }
  })

  it('"Los signos > y <" completa desigualdades y compara con pueblos, edades y mochilas', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'mayor-menor')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      expect(session.filter((e) => e.type === 'choice' && /recuadro/.test(e.question) && /[<>]/.test(e.visual ?? '') && /❓/.test(e.visual ?? ''))).toHaveLength(2)
      expect(session.filter((e) => e.type === 'choice' && e.text !== undefined)).toHaveLength(2)
    }
  })

  it('"Resolvemos problemas" enseña los pasos: sumar o restar, total o diferencia y problemas de dos pasos', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'problemas')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      expect(session.filter((e) => e.question === '¿Hay que sumar o restar?')).toHaveLength(2)
      expect(session.filter((e) => e.question === '¿Qué hay que calcular?')).toHaveLength(2)
      expect(session.filter((e) => e.type === 'number' && /ahora\?$/.test(e.question) && (e.question.match(/\d+/g) ?? []).length === 3)).toHaveLength(4)
      expect(session.filter((e) => e.type === 'number' && (e.question.match(/\d+/g) ?? []).length === 2)).toHaveLength(2)
    }
  })

  it('"Sumas y restas sin llevar" incluye columnas con un sumando de una cifra, como 83 + 5', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'sumas-restas')!
    for (let seed = 0; seed < 30; seed++) {
      const columnas = buildSession(tema.plan, mulberry32(seed)).filter((e) => e.type === 'column')
      expect(columnas.filter((e) => e.bottom < 10 && e.operator === '+')).toHaveLength(1)
      expect(columnas.filter((e) => e.bottom < 10 && e.operator === '−')).toHaveLength(1)
    }
  })

  it('"Cálculo mental" empieza por las sumas y restas fáciles de un dígito', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'calculo-mental')!
    const modos = tema.plan.map((bloque) => bloque.spec).flatMap((spec) => (spec.kind === 'mental' ? [spec.mode] : []))
    expect(modos).toEqual(expect.arrayContaining(['add-small', 'sub-small', 'add-bridge', 'sub-bridge', 'tens-add', 'tens-sub']))
  })

  it('ningún tema depende de listas fijas: leer y escribir números se generan para todos los números', () => {
    for (const tema of temasUnidad1) {
      expect(tema.plan.some((bloque) => bloque.spec.kind === 'bag'), tema.name).toBe(false)
    }
  })

  it('"Números hasta el 99" lee y escribe números y pregunta por las decenas y las unidades', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'numeros-99')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      const preguntas = session.map((e) => e.question)
      expect(preguntas.filter((q) => /¿Cómo se lee el número/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /Escribe con cifras/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Qué número tiene \d+ decenas?\?/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Qué número tiene \d+ unidad(es)?\?/.test(q))).toHaveLength(1)
      expect(preguntas.filter((q) => /¿Qué número va (antes|después)/.test(q))).toHaveLength(2)
      expect(preguntas.filter((q) => /número (mayor|menor)/.test(q))).toHaveLength(2)
      // la tabla del 0 al 99 tiene su propio tema
      expect(session.some((e) => (e.type === 'choice' && e.table !== undefined) || e.type === 'table-fill')).toBe(false)
    }
  })

  it('"La tabla del 0 al 99" elige sobre la tabla dibujada y completa filas y columnas con el teclado', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'tabla-99')!
    for (let seed = 0; seed < 30; seed++) {
      const session = buildSession(tema.plan, mulberry32(seed))
      const preguntas = session.map((e) => e.question)
      expect(preguntas.filter((q) => /fila amarilla empiezan/.test(q))).toHaveLength(2)
      expect(preguntas.filter((q) => /columna naranja acaban/.test(q))).toHaveLength(2)
      expect(preguntas.filter((q) => q === '¿Qué número falta?')).toHaveLength(2)
      expect(preguntas.filter((q) => q === 'Completa la fila amarilla')).toHaveLength(2)
      expect(preguntas.filter((q) => q === 'Completa la columna naranja')).toHaveLength(2)
      expect(session.filter((e) => e.type === 'choice' && e.table !== undefined)).toHaveLength(6)
      expect(session.filter((e) => e.type === 'table-fill')).toHaveLength(4)
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
