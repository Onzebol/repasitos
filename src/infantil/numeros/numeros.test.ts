import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import { unidadesInfantil } from '../contenido'
import { temasNumeros, unidadNumeros } from './temas'

describeUnit('Números de Infantil', temasNumeros)

const sesion = (id: string, seed = 3) => buildSession(temasNumeros.find((topic) => topic.id === id)!.plan, mulberry32(seed))

describe('Números de Infantil: contenido', () => {
  it('tiene sus temas y está registrada como la unidad de la materia Números', () => {
    expect(temasNumeros.map((topic) => topic.id)).toEqual(['contar', 'cuantos-hay', 'las-cifras', 'trazo'])
    expect(unidadNumeros.topics).toBe(temasNumeros)
    expect(unidadesInfantil.numeros).toEqual([unidadNumeros])
  })

  it('cada tema tiene nombre, icono y color propios', () => {
    for (const tema of temasNumeros) {
      expect(tema.name.trim()).not.toBe('')
      expect(tema.icon).not.toBe('')
      expect(tema.tint).toMatch(/^#/)
    }
    expect(new Set(temasNumeros.map((t) => t.icon)).size).toBe(temasNumeros.length)
  })

  it('«Contar tocando» son diez grupos de animales, hasta el 7, que se cuentan tocando cada uno', () => {
    for (const e of sesion('contar')) {
      expect(e.type).toBe('choice')
      if (e.type === 'choice') {
        expect(e.tapToCount).toBe(true)
        expect([...(e.visual ?? '')]).toHaveLength(Number(e.answer))
        expect(Number(e.answer)).toBeLessThanOrEqual(7)
      }
    }
  })

  it('«¿Cuántos hay?» son diez dibujos de animales para contar, hasta el 7', () => {
    for (const e of sesion('cuantos-hay')) {
      expect(e.type).toBe('choice')
      if (e.type === 'choice') {
        expect(e.visual).toBeTruthy()
        expect(Number(e.answer)).toBeLessThanOrEqual(7)
      }
    }
  })

  it('«Las cifras» pide tocar cifras del 1 al 9', () => {
    for (const e of sesion('las-cifras')) {
      expect(e.type).toBe('choice')
      if (e.type === 'choice') {
        expect(e.question).toMatch(/^Toca el número [1-9]$/)
        for (const opcion of e.options) expect(Number(opcion)).toBeLessThanOrEqual(9)
      }
    }
  })

  it('«Trazo de las cifras» reparte las diez cifras, del 0 al 9, una vez cada una', () => {
    const cifras = sesion('trazo').map((e) => (e.type === 'trace' ? e.digit : -1))
    expect([...cifras].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
