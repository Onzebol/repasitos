import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
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

  it('"Sumas y restas sin llevar" mezcla columnas y problemas con texto', () => {
    const tema = temasUnidad1.find((topic) => topic.id === 'sumas-restas')!
    const session = buildSession(tema.plan, mulberry32(1))
    expect(session.filter((e) => e.type === 'column')).toHaveLength(6)
    expect(session.filter((e) => e.type === 'number')).toHaveLength(4)
  })
})
