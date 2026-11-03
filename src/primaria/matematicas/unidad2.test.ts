import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import { unidadesMatematicas } from './unidades'
import { temasUnidad2 } from './unidad2'

describeUnit('Unidad 2 de Matemáticas', temasUnidad2)

const sesion = (id: string) => buildSession(temasUnidad2.find((topic) => topic.id === id)!.plan, mulberry32(3))

describe('Unidad 2 de Matemáticas: contenido', () => {
  it('tiene los siete temas del índice y está registrada en la unidad 2', () => {
    expect(temasUnidad2.map((topic) => topic.id)).toEqual(['sumas-llevando', 'suma-resta', 'ordinales', 'la-centena', 'del-100-al-199', 'problemas', 'calculo-mental'])
    expect(unidadesMatematicas.find((unit) => unit.id === 'u2')!.topics).toBe(temasUnidad2)
  })

  it('"Problemas" mezcla los pasos (sumar o restar, qué se calcula) y problemas de sumar y de restar, con «¿cuántos faltan?»', () => {
    const session = sesion('problemas')
    expect(session).toHaveLength(10)
    const pasos = session.filter((e) => e.type === 'choice')
    expect(pasos.filter((e) => e.question === '¿Hay que sumar o restar?')).toHaveLength(3)
    expect(pasos.filter((e) => e.question === '¿Qué hay que calcular?')).toHaveLength(2)
    expect(pasos).toHaveLength(5)
    const problemas = session.filter((e) => e.type === 'number')
    expect(problemas).toHaveLength(5)
    // de «cuántos faltan»: un paso y dos problemas escritos
    expect(pasos.filter((e) => e.type === 'choice' && /falta/.test(e.text ?? ''))).toHaveLength(1)
    expect(problemas.filter((e) => /falta/.test(e.question))).toHaveLength(2)
    // de sumar con llevada (2) y de restar (1 de quitar): el resultado cuadra con la historia
    expect(problemas.filter((e) => /falta/.test(e.question) === false)).toHaveLength(3)
  })

  it('"Sumas llevando" mezcla 6 columnas con llevada (2 con un sumando de una cifra y 2 de tres sumandos), 2 de elegir la que lleva y 2 problemas', () => {
    const session = sesion('sumas-llevando')
    const columnas = session.filter((e) => e.type === 'column')
    expect(columnas).toHaveLength(6)
    for (const e of columnas) expect(e.carry).toBe(true)
    expect(columnas.filter((e) => e.third !== undefined)).toHaveLength(2)
    // los de tres sumandos pueden tener un segundo sumando de una cifra: solo cuentan los de dos números
    expect(columnas.filter((e) => e.third === undefined && e.bottom < 10)).toHaveLength(2)
    expect(session.filter((e) => e.type === 'choice' && e.question === '¿Qué suma es llevando?')).toHaveLength(2)
    expect(session.filter((e) => e.type === 'number')).toHaveLength(2)
  })

  it('"La suma y la resta" tiene 2 restas de una suma, 2 sumandos que faltan, 1 minuendo que falta, 1 resta que comprueba, 2 de términos y 2 de resta bien hecha', () => {
    const session = sesion('suma-resta')
    expect(session.filter((e) => e.type === 'number' && e.question.includes('Entonces'))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'number' && /^Completa: \d+ \+ ▢/.test(e.question))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'number' && e.question.startsWith('Completa: ▢ −'))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && e.question.startsWith('¿Qué resta comprueba'))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && /^En \d+ − \d+ = \d+, ¿/.test(e.question))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'choice' && e.question === '¿Está bien hecha la resta?')).toHaveLength(2)
    expect(session).toHaveLength(10)
  })

  it('"La suma y la resta" empieza con sumas pequeñas, hasta 20', () => {
    const [primero, segundo] = sesion('suma-resta')
    for (const e of [primero, segundo]) {
      if (e.type !== 'number') throw new Error('se esperaba escribir un número')
      expect(Math.max(...e.question.match(/\d+/g)!.map(Number)), e.question).toBeLessThanOrEqual(20)
    }
  })

  it('"Ordinales" combina la fila de dibujos y los nombres', () => {
    const session = sesion('ordinales')
    expect(session.filter((e) => e.type === 'choice' && e.visual)).toHaveLength(6)
    expect(session.filter((e) => e.type === 'choice' && !e.visual)).toHaveLength(4)
  })

  it('"La centena" pasa de centenas a decenas y unidades, lee y escribe las centenas y recoge las preguntas sobre el 100', () => {
    const plan = temasUnidad2.find((topic) => topic.id === 'la-centena')!.plan
    expect(plan.map((bloque) => bloque.spec.kind)).toEqual(['hundred-units', 'hundred-units', 'hundred-units', 'hundred-units', 'bag', 'number-name', 'number-name', 'compare'])
    const session = sesion('la-centena')
    expect(session).toHaveLength(10)
    expect(session.filter((e) => e.type === 'number' && /decenas$/.test(e.question))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'number' && /unidades$/.test(e.question))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'number' && e.visual?.includes('🟥'))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'choice' && /^¿Qué número es \d+ (decenas|centenas)\?$/.test(e.question))).toHaveLength(1)
    // ordenar seis centenas de menor a mayor
    const ordenar = session.filter((e) => e.type === 'choice' && e.question.startsWith('Ordena de menor a mayor: '))
    expect(ordenar).toHaveLength(1)
    expect(ordenar[0].question.match(/\d+/g)).toHaveLength(6)
    expect(session.filter((e) => e.type === 'choice' && /^(10 decenas forman|¿Qué número va después del 99|El 100 es igual)/.test(e.question))).toHaveLength(1)
    // las centenas redondas se leen (elegir) y se escriben (cien, doscientos…)
    const leer = session.filter((e) => e.type === 'choice' && /^¿Cómo se lee el número \d+\?$/.test(e.question))
    expect(leer).toHaveLength(1)
    expect(Number(leer[0].question.match(/\d+/)![0]) % 100).toBe(0)
    const escribir = session.filter((e) => e.type === 'number' && e.question.startsWith('Escribe con cifras: '))
    expect(escribir).toHaveLength(1)
    expect(escribir[0].type === 'number' && escribir[0].answer % 100).toBe(0)
  })

  it('"Del 100 al 199" lee y escribe con letras números de 100 a 199 (ciento…)', () => {
    const plan = temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan
    expect(plan.filter((bloque) => bloque.spec.kind === 'number-name').map((bloque) => bloque.count)).toEqual([1, 1])
    const session = sesion('del-100-al-199')
    const leer = session.filter((e) => e.type === 'choice' && /^¿Cómo se lee el número \d+\?$/.test(e.question))
    expect(leer).toHaveLength(1)
    expect(Number(leer[0].question.match(/\d+/)![0])).toBeGreaterThanOrEqual(100)
    const escribir = session.filter((e) => e.type === 'number' && e.question.startsWith('Escribe con cifras: '))
    expect(escribir).toHaveLength(1)
    expect(escribir[0].type === 'number' && escribir[0].answer).toBeGreaterThanOrEqual(100)
    expect(escribir[0].question).toMatch(/ciento|cien$/)
  })

  it('"Del 100 al 199" compara alturas que cruzan el 99 → 100 (monumentos de 96 y 101 m)', () => {
    const plan = temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan
    expect(plan.filter((bloque) => bloque.spec.kind === 'compare' && bloque.spec.mode === 'height').map((bloque) => bloque.count)).toEqual([1])
    const session = sesion('del-100-al-199')
    const alturas = session.filter((e) => e.type === 'choice' && /^¿Qué monumento es más (alto|bajo)\?$/.test(e.question))
    expect(alturas).toHaveLength(1)
    expect(session).toHaveLength(10)
  })

  it('"Del 100 al 199" cruza el 99 → 100: después del 98, 99 o 100, antes del 99, 100 o 101 y una serie que pasa por el 100', () => {
    const plan = temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan
    const cruzan = plan.filter((bloque) => ('cross' in bloque.spec && bloque.spec.cross) === true)
    expect(cruzan.map((bloque) => bloque.spec.kind).sort()).toEqual(['neighbor', 'neighbor', 'series'])
    const session = sesion('del-100-al-199')
    expect(session).toHaveLength(10)
    const despues = session.filter((e) => e.type === 'choice' && /^¿Qué número va después del (98|99|100)\?$/.test(e.question))
    const antes = session.filter((e) => e.type === 'choice' && /^¿Qué número va antes del (99|100|101)\?$/.test(e.question))
    expect(despues).toHaveLength(1)
    expect(antes).toHaveLength(1)
    const series = session.filter((e) => e.type === 'number' && e.question.startsWith('Completa la serie: '))
    expect(series).toHaveLength(1)
    const terminos = [...series[0].question.match(/\d+/g)!.map(Number), series[0].type === 'number' ? series[0].answer : -1]
    expect(terminos).toContain(99)
    expect(terminos).toContain(100)
  })

  it('"Del 100 al 199" ya no lleva las preguntas sobre la centena (están en "La centena")', () => {
    const plan = temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan
    expect(plan.some((bloque) => bloque.spec.kind === 'bag')).toBe(false)
    expect(plan.reduce((suma, bloque) => suma + bloque.count, 0)).toBe(10)
  })

  it('"Del 100 al 199" solo trabaja con números de 100 a 199', () => {
    for (let seed = 0; seed < 100; seed++) {
      for (const e of buildSession(temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan, mulberry32(seed))) {
        if (e.type === 'number') expect(e.answer, e.question).toBeGreaterThanOrEqual(100)
      }
    }
  })

  it('"Cálculo mental" suma tres números, busca el sumando que falta, compara con 10 y suma pasando la decena', () => {
    const session = sesion('calculo-mental')
    expect(session).toHaveLength(10)
    expect(session.filter((e) => e.type === 'number' && /^\d \+ \d \+ \d =$/.test(e.question))).toHaveLength(3)
    expect(session.filter((e) => e.type === 'number' && /^Completa: .*▢/.test(e.question) && e.question.split('+').length === 3)).toHaveLength(3)
    expect(session.filter((e) => e.type === 'choice' && /^\d \+ \d \+ \d  ❓  10$/.test(e.visual ?? ''))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'number' && /^\d \+ \d =$/.test(e.question))).toHaveLength(2)
  })
})
