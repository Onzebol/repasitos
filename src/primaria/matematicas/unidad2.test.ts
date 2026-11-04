import { describe, expect, it } from 'vitest'
import { mulberry32 } from '../../random'
import { buildSession } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import { unidadesMatematicas } from './unidades'
import { temasUnidad2 } from './unidad2'

describeUnit('Unidad 2 de Matemáticas', temasUnidad2)

const sesion = (id: string) => buildSession(temasUnidad2.find((topic) => topic.id === id)!.plan, mulberry32(3))

describe('Unidad 2 de Matemáticas: contenido', () => {
  it('tiene los temas del índice y está registrada en la unidad 2', () => {
    expect(temasUnidad2.map((topic) => topic.id)).toEqual([
      'sumas-llevando',
      'suma-resta',
      'ordinales',
      'la-centena',
      'del-100-al-199',
      'problemas',
      'calculo-mental',
      'informacion-con-numeros',
      'desafios-y-logica',
    ])
    expect(unidadesMatematicas.find((unit) => unit.id === 'u2')!.topics).toBe(temasUnidad2)
  })

  it('"Información con números" lee una casilla de la tabla, dos números de un día o un momento y descodifica dibujos, con la tabla siempre a la vista', () => {
    const session = sesion('informacion-con-numeros')
    expect(session).toHaveLength(10)
    const preguntas = session.map((e) => e.question)
    expect(preguntas.filter((q) => q.startsWith('¿Qué hizo el ') && q.endsWith(' Elige su número.'))).toHaveLength(4)
    expect(preguntas.filter((q) => q.endsWith('Elige sus números.'))).toHaveLength(3)
    expect(preguntas.filter((q) => q.startsWith('Las actividades '))).toHaveLength(3)
    for (const e of session) expect(e.type === 'choice' && e.codeTable, e.question).toBeTruthy()
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

  it('"La suma y la resta" tiene 1 resta de una suma, 2 sumandos que faltan, 1 minuendo que falta, 1 resta que comprueba, 1 de términos, 1 de resta bien hecha y 3 de elegir la operación de una familia', () => {
    const session = sesion('suma-resta')
    expect(session.filter((e) => e.type === 'number' && e.question.includes('Entonces'))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'number' && /^Completa: \d+ \+ ▢/.test(e.question))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'number' && e.question.startsWith('Completa: ▢ −'))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && e.question.startsWith('¿Qué resta comprueba'))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && /^En \d+ − \d+ = \d+, ¿/.test(e.question))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && e.question === '¿Está bien hecha la resta?')).toHaveLength(1)
    expect(session).toHaveLength(10)
  })

  it('"La suma y la resta" escribe la familia: una suma y una resta con tres números y una resta con un dibujo de dos colores', () => {
    const session = sesion('suma-resta')
    expect(session.filter((e) => e.type === 'choice' && /^Con \d+, \d+ y \d+, ¿qué suma sale\?$/.test(e.question))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && /^Con \d+, \d+ y \d+, ¿qué resta sale\?$/.test(e.question))).toHaveLength(1)
    expect(session.filter((e) => e.type === 'choice' && e.visual && /^Si quitamos los .+, ¿qué resta sale\?$/u.test(e.question))).toHaveLength(1)
  })

  it('"La suma y la resta" empieza con una resta de una suma pequeña, hasta 20', () => {
    const [primero] = sesion('suma-resta')
    if (primero.type !== 'number') throw new Error('se esperaba escribir un número')
    expect(Math.max(...primero.question.match(/\d+/g)!.map(Number)), primero.question).toBeLessThanOrEqual(20)
  })

  it('"Ordinales" combina la fila de dibujos (sola y con «el tercer dibujo»), leer símbolos y escribir nombres, en masculino y femenino', () => {
    const session = sesion('ordinales')
    expect(session).toHaveLength(10)
    expect(session.filter((e) => e.type === 'choice' && e.visual)).toHaveLength(3)
    expect(session.filter((e) => e.type === 'choice' && !e.visual)).toHaveLength(7)
    const preguntas = session.map((e) => e.question)
    // la fila de dibujos: 2 con «el quinto» y 1 con sustantivo
    expect(preguntas.filter((q) => /^Desde la izquierda, ¿cuál es el \S+\?$/.test(q))).toHaveLength(2)
    expect(preguntas.filter((q) => /^Desde la izquierda, ¿cuál es (el|la) \S+ (dibujo|figura)\?$/.test(q))).toHaveLength(1)
    // razonar con ordinales: la lista de llegada (con su texto de lectura) y los pisos de un edificio
    const llegada = session.filter((e) => e.type === 'choice' && e.text?.startsWith('Llegada: '))
    expect(llegada).toHaveLength(2)
    expect(preguntas.filter((q) => /^¿Qué piso está (un piso|dos pisos) por (encima|debajo) del \d+º\?$/.test(q))).toHaveLength(1)
    // símbolo → palabra: uno en masculino y otro en femenino
    expect(preguntas.filter((q) => /^¿Cómo se lee \d+º\?$/.test(q))).toHaveLength(1)
    expect(preguntas.filter((q) => /^¿Cómo se lee \d+ª\?$/.test(q))).toHaveLength(1)
    // palabra → símbolo: uno en masculino y otro en femenino
    const escribir = session.filter((e) => e.type === 'choice' && e.question.startsWith('¿Cómo se escribe'))
    expect(escribir).toHaveLength(2)
    expect(escribir.filter((e) => e.type === 'choice' && e.answer.endsWith('º'))).toHaveLength(1)
    expect(escribir.filter((e) => e.type === 'choice' && e.answer.endsWith('ª'))).toHaveLength(1)
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

  it('"Del 100 al 199" dibuja la tabla del 100 al 199: el número que falta y la cifra por la que empieza una fila', () => {
    const plan = temasUnidad2.find((topic) => topic.id === 'del-100-al-199')!.plan
    expect(plan.filter((bloque) => bloque.spec.kind === 'table-99').map((bloque) => bloque.spec)).toEqual([
      { kind: 'table-99', ask: 'missing', from: 100 },
      { kind: 'table-99', ask: 'row', from: 100 },
    ])
    for (let seed = 0; seed < 50; seed++) {
      const tablas = buildSession(plan, mulberry32(seed)).filter((e) => e.type === 'choice' && e.table)
      expect(tablas).toHaveLength(2)
      for (const e of tablas) expect(e.type === 'choice' && e.table?.from).toBe(100)
    }
    expect(sesion('del-100-al-199')).toHaveLength(10)
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

  it('"Desafíos y lógica" busca el número que falta (con decenas redondas y normal) y razona sobre las cifras de la tabla', () => {
    const session = sesion('desafios-y-logica')
    expect(session).toHaveLength(10)
    // el número que falta en una suma o en una resta: seis ejercicios escritos, al menos cuatro con decenas redondas
    const faltan = session.filter((e) => e.type === 'number' && e.question.startsWith('Completa: '))
    expect(faltan).toHaveLength(6)
    const redondos = faltan.filter((e) => e.question.match(/\d+/g)!.every((n) => Number(n) % 10 === 0) && e.type === 'number' && e.answer % 10 === 0)
    expect(redondos.length).toBeGreaterThanOrEqual(4)
    expect(faltan.filter((e) => e.question.startsWith('Completa: ▢ −'))).toHaveLength(3)
    // estimar sin mirar la tabla (elegir) y después comprobarlo tocando en la tabla
    expect(session.filter((e) => e.type === 'choice' && e.question.startsWith('Sin mirar la tabla: '))).toHaveLength(2)
    expect(session.filter((e) => e.type === 'table-paint' && e.question.startsWith('Toca todos los números que incluyen el '))).toHaveLength(2)
    // en el plan, estimar va antes que comprobar
    const tipos = temasUnidad2.find((topic) => topic.id === 'desafios-y-logica')!.plan.map((bloque) => bloque.spec.kind)
    expect(tipos.indexOf('digit-count')).toBeLessThan(tipos.indexOf('table-paint'))
  })
})
