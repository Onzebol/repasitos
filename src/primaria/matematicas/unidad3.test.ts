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
    expect(temasUnidad3.map((topic) => topic.id)).toEqual(['restas-llevando', 'centenas-decenas-unidades', 'el-litro', 'mas-menos-que', 'desafios-y-logica', 'calculo-mental'])
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

  it('"Centenas, decenas y unidades" incluye una serie de 100 en 100 hacia arriba y otra hacia abajo, y sigue en 10', () => {
    const plan = temasUnidad3.find((topic) => topic.id === 'centenas-decenas-unidades')!.plan
    expect(plan.filter((bloque) => bloque.spec.kind === 'series').map((bloque) => bloque.spec)).toEqual([
      { kind: 'series', step: 100, min: 100, max: 900 },
      { kind: 'series', step: 100, min: 100, max: 900, down: true },
    ])
    const session = sesion('centenas-decenas-unidades')
    expect(session).toHaveLength(10)
    const series = session.filter((e) => e.question.startsWith('Completa la serie: '))
    expect(series).toHaveLength(2)
    for (const e of series) expect(e.type === 'number' && e.answer % 100, e.question).toBe(0)
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

  it('"Más que, menos que" elige sumar o restar con el texto a la vista y calcula, con y sin llevada', () => {
    const session = sesion('mas-menos-que')
    expect(session).toHaveLength(10)
    const elegir = session.filter((e) => e.type === 'choice')
    expect(elegir).toHaveLength(3)
    for (const e of elegir) expect(e.type === 'choice' && e.text, e.question).toMatch(/(más|menos)\. ¿/)
    expect(session.filter((e) => e.type === 'number')).toHaveLength(7)
  })

  it('"Desafíos y lógica" encadena «más que» y «menos que»: 5 de cuántos rojos y 5 de cuántos azules, con el texto a la vista', () => {
    const session = sesion('desafios-y-logica')
    expect(session).toHaveLength(10)
    expect(session.filter((e) => e.question === '¿Cuántos peces rojos hay?')).toHaveLength(5)
    expect(session.filter((e) => e.question === '¿Cuántos peces azules hay?')).toHaveLength(5)
    for (const e of session) expect(e.type === 'choice' && e.text, e.question).toBeTruthy()
  })

  it('"El litro" pregunta por capacidades y por litros', () => {
    const session = sesion('el-litro')
    expect(session.filter((e) => e.type === 'choice' && /capacidad/.test(e.question))).toHaveLength(4)
    expect(session.filter((e) => e.type === 'choice' && !/capacidad/.test(e.question))).toHaveLength(4)
    expect(session.filter((e) => e.type === 'number' && /litros/.test(e.question))).toHaveLength(2)
  })

  it('"Cálculo mental" suma un dígito (detrás, delante, con el hueco), decenas redondas con unidades y figuras de 1, 2, 10 y 20', () => {
    const session = sesion('calculo-mental')
    expect(session).toHaveLength(10)
    const preguntas = session.map((e) => e.question)
    // el dígito que falta
    expect(preguntas.filter((q) => q.startsWith('Completa: ') && q.includes('▢'))).toHaveLength(1)
    // las figuras: una suma que se escribe y una figura que falta, con los valores 1, 2, 10 y 20 en la leyenda
    const figuras = session.filter((e) => (e.type === 'number' || e.type === 'choice') && e.visual?.includes(' = 20'))
    expect(figuras).toHaveLength(2)
    // el resto son siete operaciones escritas de dos números (sumar un dígito, decenas con unidades y decenas con decenas)
    const operaciones = preguntas.filter((q) => /^\d+ [+−] \d+ =$/.test(q))
    expect(operaciones).toHaveLength(7)
    // decenas con decenas (30 + 40, 70 − 20) y decenas con unidades (30 + 3, 5 + 60)
    expect(operaciones.filter((q) => /^\d0 [+−] \d0 =$/.test(q)).length).toBeGreaterThanOrEqual(2)
    expect(operaciones.filter((q) => /^(\d0 \+ \d|\d \+ \d0) =$/.test(q)).length).toBeGreaterThanOrEqual(2)
  })

  it('los iconos de los temas y las piezas 🟥🟦🟨 están en la fuente de emojis', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    for (const emoji of [...temasUnidad3.map((topic) => topic.icon), '🟥', '🟦', '🟨']) {
      expect(fuente.has(emoji.replace(/️/g, '')), `${emoji} no está en la fuente`).toBe(true)
    }
  })
})
