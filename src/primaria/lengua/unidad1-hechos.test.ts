import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem } from '../../types'
import { temasUnidad1 } from './unidad1'

// Tablas de verdad escritas aquí por separado: comparan las tablas del contenido con lo que se sabe, para que un cambio en el
// contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad1.find((x) => x.id === tema)!
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
function facts(tema: string): FactItem[] {
  return bloques(tema, 'facts').flatMap((b) => b.items)
}

// Cada pregunta escrita a mano del tema tiene la respuesta correcta que dice la tabla (y no hay preguntas sin comprobar)
function compruebaHechos(tema: string, esperados: Record<string, string>) {
  const presentes = Object.fromEntries(facts(tema).map((i) => [i.question, i.answer]))
  for (const [pregunta, respuesta] of Object.entries(esperados)) {
    expect(presentes[pregunta], `falta o está mal «${pregunta}»`).toBe(respuesta)
  }
  expect(Object.keys(presentes).sort(), `hay preguntas del tema ${tema} sin comprobar`).toEqual(Object.keys(esperados).sort())
}

describe('Hechos de «Sinónimos y palabras del colegio»', () => {
  const [sinonimos, cosas] = bloques('sinonimos', 'pairs')

  it('cada pareja de sinónimos significa lo mismo, y ninguna palabra se repite en dos parejas', () => {
    const verdad: [string, string][] = [
      ['profesor', 'maestro'],
      ['escuela', 'colegio'],
      ['clase', 'aula'],
      ['bonito', 'hermoso'],
      ['grande', 'enorme'],
      ['contento', 'alegre'],
      ['rápido', 'veloz'],
      ['empezar', 'comenzar'],
      ['cansado', 'agotado'],
      ['casa', 'hogar'],
    ]
    expect(sinonimos.rows.map((f) => [f.askBack.match(/que (\S+)\?$/)![1], f.answerBack])).toEqual(verdad.map(([a, b]) => [b, a]))
    expect(sinonimos.rows.map((f) => [f.ask.match(/que (\S+)\?$/)![1], f.answer])).toEqual(verdad)
    const palabras = verdad.flat()
    expect(new Set(palabras).size).toBe(palabras.length)
  })

  it('cada objeto del colegio sirve para lo que dice la tabla, en los dos sentidos', () => {
    const verdad: [string, string][] = [
      ['el lápiz', 'para escribir y dibujar'],
      ['la goma', 'para borrar'],
      ['la regla', 'para medir y trazar líneas rectas'],
      ['las tijeras', 'para cortar'],
      ['el pegamento', 'para pegar'],
      ['el sacapuntas', 'para sacar punta al lápiz'],
      ['la mochila', 'para llevar los libros y los cuadernos'],
      ['el libro', 'para leer'],
    ]
    expect(cosas.rows.map((f) => [f.answer, f.answerBack])).toEqual(verdad)
    // la pregunta de ida nombra la utilidad y la de vuelta nombra el objeto
    for (const [objeto, uso] of verdad) {
      const fila = cosas.rows.find((f) => f.answer === objeto)!
      expect(fila.askBack, objeto).toContain(objeto)
      expect(fila.ask.toLowerCase(), objeto).toContain(uso.replace(/^para /, ''))
    }
  })

  it('el verbo concuerda con el objeto: «sirve» para uno y «sirven» para varios (las tijeras)', () => {
    for (const fila of cosas.rows) {
      const verbo = ['las tijeras'].includes(fila.answer) ? 'sirven' : 'sirve'
      expect(fila.askBack, fila.answer).toBe(`¿Para qué ${verbo} ${fila.answer}?`)
    }
    expect(cosas.rows.some((f) => f.answer === 'las tijeras')).toBe(true)
  })

  it('las personas del colegio y las oraciones que significan lo mismo son correctas', () => {
    compruebaHechos('sinonimos', {
      '¿Cómo se llama el conjunto de las personas que dan clase en el colegio?': 'el profesorado',
      '¿Cómo se llama el conjunto de los niños y las niñas que van al colegio?': 'el alumnado',
      '¿Quién abre y cierra las puertas del colegio y cuida el edificio?': 'el conserje',
      '¿Quién dirige el colegio?': 'el director o la directora',
      '¿Dónde damos clase?': 'en el aula',
      '¿Qué oración significa lo mismo que «La escuela está cerca de la plaza»?': 'El colegio está cerca de la plaza.',
      '¿Qué oración significa lo mismo que «La clase es muy grande»?': 'El aula es enorme.',
      '¿Qué oración significa lo mismo que «El maestro está muy contento»?': 'El profesor está muy alegre.',
      '¿Qué oración significa lo mismo que «Los alumnos empiezan la clase»?': 'Los alumnos comienzan la clase.',
      '¿Qué oración significa lo mismo que «El perro es muy rápido»?': 'El perro es veloz.',
      '¿Qué oración significa lo mismo que «Es una casa bonita»?': 'Es una casa hermosa.',
    })
  })

  it('las respuestas equivocadas de las oraciones dicen otra cosa (cambian el significado)', () => {
    const oraciones = facts('sinonimos').filter((i) => i.question.startsWith('¿Qué oración significa lo mismo'))
    expect(oraciones).toHaveLength(6)
    for (const item of oraciones) {
      expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
      // ninguna respuesta equivocada usa la misma palabra que la correcta en su lugar (sería otro sinónimo)
      for (const mala of item.wrong) expect(mala, item.question).not.toBe(item.answer)
    }
  })

  it('cada hecho tiene al menos tres respuestas equivocadas, distintas entre sí y de la correcta; y no hay dos preguntas iguales', () => {
    const todos = facts('sinonimos')
    expect(todos.length).toBeGreaterThanOrEqual(11)
    for (const item of todos) {
      expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
      expect(new Set(item.wrong).size, item.question).toBe(item.wrong.length)
      expect(item.wrong, item.question).not.toContain(item.answer)
    }
    const preguntas = todos.map((i) => i.question)
    expect(new Set(preguntas).size).toBe(preguntas.length)
  })
})
