import { describe, expect, it } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import { unidadesMatematicas } from './unidades'
import { temasUnidad3 } from './unidad3'

describeUnit('Unidad 3 de Matemáticas', temasUnidad3)

const sesion = (id: string, seed = 3) => buildSession(temasUnidad3.find((topic) => topic.id === id)!.plan, mulberry32(seed))

describe('Unidad 3 de Matemáticas: contenido', () => {
  it('tiene los cuatro temas de la issue y está registrada en la unidad 3', () => {
    expect(temasUnidad3.map((topic) => topic.id)).toEqual(['restas-llevando', 'centenas-decenas-unidades', 'el-litro', 'calculo-mental'])
    expect(unidadesMatematicas.find((unit) => unit.id === 'u3')!.topics).toBe(temasUnidad3)
  })

  it('"Restas llevando" mezcla 4 columnas con llevada (1 con sustraendo de una cifra), 2 de reconocer si una resta lleva y 4 problemas de resta (2 de «cuánto falta»)', () => {
    const session = sesion('restas-llevando')
    const columnas = session.filter((e) => e.type === 'column')
    expect(columnas).toHaveLength(4)
    for (const e of columnas) {
      expect(e.operator).toBe('−')
      expect(e.carry).toBe(true)
    }
    const problemas = session.filter((e) => e.type === 'number')
    expect(problemas).toHaveLength(4)
    expect(problemas.filter((e) => /falta/.test(e.question))).toHaveLength(2)
    expect(columnas.filter((e) => e.bottom < 10)).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && e.question === '¿Qué resta es llevando?')).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && e.question === 'Esta resta, ¿es sin llevar o llevando?')).toHaveLength(1)
  })

  it('"Centenas, decenas y unidades" trabaja siempre con números de tres cifras', () => {
    for (let seed = 0; seed < 100; seed++) {
      for (const e of sesion('centenas-decenas-unidades', seed)) {
        if (e.type === 'number' && !e.question.startsWith('¿Cuántas')) expect(e.answer, e.question).toBeGreaterThanOrEqual(100)
      }
    }
  })

  it('"Centenas, decenas y unidades" incluye 2 pistas de elegir el número que las cumple (más de, menos de, el cero) y sigue en 10', () => {
    const session = sesion('centenas-decenas-unidades')
    expect(session).toHaveLength(10)
    expect(session.filter((e) => e.type === 'choice' && /^¿Qué número tiene \d centenas?/.test(e.question))).toHaveLength(2)
  })

  it('"El litro" pregunta por capacidades y por litros', () => {
    const session = sesion('el-litro')
    expect(session.filter((e) => e.type === 'choice' && /capacidad/.test(e.question))).toHaveLength(4)
    expect(session.filter((e) => e.type === 'choice' && !/capacidad/.test(e.question))).toHaveLength(4)
    expect(session.filter((e) => e.type === 'number' && /litros/.test(e.question))).toHaveLength(2)
  })

  it('"Cálculo mental" suma un dígito a números de dos cifras', () => {
    const session = sesion('calculo-mental')
    expect(session.filter((e) => e.type === 'number' && /^\d\d \+ \d =$/.test(e.question))).toHaveLength(6)
  })

  it('los iconos de los temas y las piezas 🟥🟦🟨 están en la fuente de emojis', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    for (const emoji of [...temasUnidad3.map((topic) => topic.icon), '🟥', '🟦', '🟨']) {
      expect(fuente.has(emoji.replace(/️/g, '')), `${emoji} no está en la fuente`).toBe(true)
    }
  })
})
