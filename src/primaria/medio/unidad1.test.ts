import { describe, expect, it } from 'vitest'
import emojiCss from '../../assets/emoji-font.css?raw'
import { emojisDeLaFuente } from '../../emojiFont'
import { exerciseKey } from '../../session'
import { describeUnit } from '../../test/unitChecks'
import type { ChoiceExercise, Exercise, Topic } from '../../types'
import { temasUnidad1 } from './unidad1'
import { unidadesMedio } from './unidades'

describeUnit('Unidad 1 de Conocimiento del medio', temasUnidad1)

// Las listas de ejercicios escritas a mano de un tema, con cuántos se toman por sesión
const bolsas = (tema: Topic) =>
  tema.plan.flatMap((bloque) => (bloque.spec.kind === 'bag' ? [{ items: bloque.spec.items, count: bloque.count }] : []))
const todos: Exercise[] = temasUnidad1.flatMap((tema) => bolsas(tema).flatMap((bolsa) => bolsa.items))
const elegir = (e: Exercise): ChoiceExercise => {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}
const alimentacion = temasUnidad1.find((tema) => tema.id === 'alimentacion')!

describe('Unidad 1 de Conocimiento del medio: estructura', () => {
  it('es la primera de las 9 unidades del índice y las demás aún no tienen temas', () => {
    expect(unidadesMedio).toHaveLength(9)
    expect(unidadesMedio.map((unidad) => unidad.id)).toEqual(['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'])
    expect(unidadesMedio[0].topics).toBe(temasUnidad1)
    for (const unidad of unidadesMedio.slice(1)) expect(unidad.topics).toEqual([])
  })

  it('cada unidad lleva el título del libro como nota', () => {
    expect(unidadesMedio[0].note).toBe('Crecemos y cambiamos')
    for (const unidad of unidadesMedio) {
      expect(unidad.name).toMatch(/^Unidad [1-9]$/)
      expect(unidad.note.trim()).not.toBe('')
      expect(unidad.icon).not.toBe('')
    }
  })

  it('incluye el tema «¿Cómo nos alimentamos?» (los cinco temas están en unidad1-temas.test.ts)', () => {
    expect(alimentacion.name).toBe('¿Cómo nos alimentamos?')
  })

  it('cada sesión mezcla 4 del camino de los alimentos, 4 de los grupos y 2 de buenos hábitos', () => {
    expect(bolsas(alimentacion).map((bolsa) => bolsa.count)).toEqual([4, 4, 2])
  })

  it('cada lista tiene bastantes más ejercicios de los que se toman, para que las sesiones cambien', () => {
    for (const bolsa of bolsas(alimentacion)) expect(bolsa.items.length).toBeGreaterThanOrEqual(bolsa.count + 4)
  })
})

describe('Unidad 1 de Conocimiento del medio: ejercicios bien hechos', () => {
  it('todos son de elegir, con la respuesta entre tres opciones distintas y sin textos vacíos', () => {
    expect(todos.length).toBeGreaterThanOrEqual(30)
    for (const e of todos.map(elegir)) {
      expect(e.question.trim(), 'enunciado').not.toBe('')
      expect(e.options, e.question).toHaveLength(3)
      expect(new Set(e.options).size, e.question).toBe(3)
      expect(e.options, e.question).toContain(e.answer)
      for (const opcion of e.options) expect(opcion.trim(), e.question).not.toBe('')
    }
  })

  it('no hay ejercicios repetidos', () => {
    const claves = todos.map(exerciseKey)
    expect(new Set(claves).size).toBe(claves.length)
  })

  it('los emojis que se usan son los que dibuja la fuente de la web', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    const texto = todos.flatMap((e) => (e.type === 'choice' ? [e.question, e.visual ?? '', ...e.options] : [])).join('')
    for (const simbolo of texto.replace(/️/g, '').matchAll(/\p{Extended_Pictographic}/gu)) {
      expect(fuente.has(simbolo[0]), `${simbolo[0]} no está en la fuente`).toBe(true)
    }
  })

  it('no se pone nada que el libro no sitúe con claridad en un grupo de alimentos', () => {
    expect(JSON.stringify(todos)).not.toMatch(/legumbre|lenteja|garbanzo|alubia|arroz|frutos secos|nueces|almendra/i)
  })
})

describe('«¿Cómo nos alimentamos?»: grupos de alimentos', () => {
  const VITAMINAS = 'para tener vitaminas y fibra'
  const ENERGIA = 'para tener energía'
  const CRECER = 'para crecer'
  const GRUPO_DE: Record<string, string> = {
    '🥕': VITAMINAS, '🍎': VITAMINAS, '🍌': VITAMINAS, '🍊': VITAMINAS, '🥦': VITAMINAS, '🍅': VITAMINAS, '🥬': VITAMINAS,
    '🍞': ENERGIA, '🍝': ENERGIA, '🥔': ENERGIA,
    '🥛': CRECER, '🥚': CRECER, '🐟': CRECER, '🍗': CRECER, '🧀': CRECER, '🥩': CRECER,
  }
  const grupos = bolsas(alimentacion)[1].items.map(elegir)

  it('hay un ejercicio por alimento, con su dibujo, y todos los alimentos de la tabla', () => {
    expect(grupos.map((e) => e.visual).sort()).toEqual(Object.keys(GRUPO_DE).sort())
  })

  it('cada alimento está en su grupo (frutas y verduras: vitaminas y fibra; pan, pasta y patatas: energía; lácteos, huevos, pescado y carne: crecer)', () => {
    for (const e of grupos) expect(e.answer, `${e.visual} ${e.question}`).toBe(GRUPO_DE[e.visual!])
  })

  it('las tres opciones son siempre los tres grupos', () => {
    for (const e of grupos) expect([...e.options].sort()).toEqual([CRECER, ENERGIA, VITAMINAS].sort())
  })
})

describe('«¿Cómo nos alimentamos?»: el camino de los alimentos', () => {
  const camino = bolsas(alimentacion)[0].items.map(elegir)
  const respuesta = (pregunta: string) => camino.find((e) => e.question === pregunta)?.answer

  it('el camino es boca, esófago, estómago, intestinos y ano', () => {
    expect(respuesta('Después de la boca, ¿por qué tubo pasa la comida?')).toBe('por el esófago')
    expect(respuesta('¿Qué órgano va justo antes del estómago?')).toBe('el esófago')
    expect(respuesta('¿Qué órgano va justo después del esófago?')).toBe('el estómago')
    expect(respuesta('¿Qué viene después del estómago?')).toBe('los intestinos')
    expect(respuesta('¿Por dónde salen los restos que el cuerpo no aprovecha?')).toBe('por el ano')
  })

  it('cada órgano hace lo suyo: los dientes trituran, el estómago deshace y los intestinos absorben', () => {
    expect(respuesta('¿Para qué sirven los dientes al comer?')).toBe('para triturar la comida')
    expect(respuesta('¿Dónde se deshace la comida?')).toBe('en el estómago')
    expect(respuesta('¿Dónde pasan al cuerpo las sustancias que necesitamos de la comida?')).toBe('en los intestinos')
  })

  it('el proceso se llama digestión y la comida entra por la boca', () => {
    expect(respuesta('¿Cómo se llama el proceso en el que la comida se transforma en nutrientes?')).toBe('la digestión')
    expect(respuesta('¿Por dónde entra la comida a nuestro cuerpo?')).toBe('por la boca')
  })

  it('«qué ocurre primero» y «qué ocurre al final» tienen una sola respuesta posible', () => {
    expect(respuesta('¿Qué ocurre primero?')).toBe('masticamos la comida con los dientes')
    expect(respuesta('¿Qué ocurre al final?')).toBe('salen los restos por el ano')
  })

  it('la tráquea solo aparece como opción equivocada (es del aire, no de la comida)', () => {
    for (const e of camino) {
      if (e.options.some((o) => /tráquea/.test(o))) expect(e.answer).not.toMatch(/tráquea/)
    }
  })
})
