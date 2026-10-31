import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import { unidadesMatematicas } from './unidades'
import { temasUnidad2 } from './unidad2'

describeUnit('Unidad 2 de Matemáticas', temasUnidad2)

const sesion = (id: string) => buildSession(temasUnidad2.find((topic) => topic.id === id)!.plan, mulberry32(3))

describe('Unidad 2 de Matemáticas: contenido', () => {
  it('tiene los cinco temas del índice y está registrada en la unidad 2', () => {
    expect(temasUnidad2.map((topic) => topic.id)).toEqual(['sumas-llevando', 'suma-resta', 'ordinales', 'del-100-al-199', 'calculo-mental'])
    expect(unidadesMatematicas.find((unit) => unit.id === 'u2')!.topics).toBe(temasUnidad2)
  })

  it('"Sumas llevando" mezcla 6 columnas con llevada y 4 problemas', () => {
    const session = sesion('sumas-llevando')
    const columnas = session.filter((e) => e.type === 'column')
    expect(columnas).toHaveLength(6)
    for (const e of columnas) expect(e.carry).toBe(true)
    expect(session.filter((e) => e.type === 'number')).toHaveLength(4)
  })

  it('"La suma y la resta" tiene 5 restas de comprobación, 3 huecos y 2 de elegir', () => {
    const session = sesion('suma-resta')
    expect(session.filter((e) => e.type === 'number' && e.question.includes('Entonces'))).toHaveLength(5)
    expect(session.filter((e) => e.type === 'number' && e.question.startsWith('Completa'))).toHaveLength(3)
    expect(session.filter((e) => e.type === 'choice')).toHaveLength(2)
  })

  it('"Ordinales" combina la fila de dibujos y los nombres', () => {
    const session = sesion('ordinales')
    expect(session.filter((e) => e.type === 'choice' && e.visual)).toHaveLength(6)
    expect(session.filter((e) => e.type === 'choice' && !e.visual)).toHaveLength(4)
  })

  it('"Del 100 al 199" solo trabaja con números de 100 a 199', () => {
    for (let seed = 0; seed < 100; seed++) {
      for (const e of buildSession(temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan, mulberry32(seed))) {
        if (e.type === 'number') expect(e.answer, e.question).toBeGreaterThanOrEqual(100)
      }
    }
  })

  it('"Cálculo mental" suma tres números y pasando la decena', () => {
    const session = sesion('calculo-mental')
    expect(session.filter((e) => e.type === 'number' && /^\d \+ \d \+ \d =$/.test(e.question))).toHaveLength(6)
  })
})
