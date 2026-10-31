import { describe, expect, it } from 'vitest'
import { capitaliza, contrae, generate } from './generators'
import { mulberry32 } from './random'
import { exerciseKey } from './session'
import type { BlockSpec, ChoiceExercise, Exercise, FactItem, Group, Member, PairRow } from './types'

// Generadores de preguntas a partir de tablas (hechos de Conocimiento del medio): se prueban con tablas pequeñas inventadas

const SEMILLAS = 300
const muchos = (spec: BlockSpec) => Array.from({ length: SEMILLAS }, (_, seed) => generate(spec, mulberry32(seed))).map(choice)
function choice(e: Exercise): ChoiceExercise {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}

const GRUPOS: Group[] = [
  { id: 'v', label: 'vitaminas', question: '¿Cuál de estos alimentos da vitaminas?' },
  { id: 'e', label: 'energía', question: '¿Cuál de estos alimentos da energía?' },
  { id: 'c', label: 'crecer', question: '¿Cuál de estos alimentos ayuda a crecer?' },
]
const MIEMBROS: Member[] = [
  { label: 'la manzana', group: 'v', emoji: '🍎' },
  { label: 'la pera', group: 'v', emoji: '🍐' },
  { label: 'el kiwi', group: 'v', emoji: '🥝' },
  { label: 'el pan', group: 'e', emoji: '🍞' },
  { label: 'la pasta', group: 'e', emoji: '🍝' },
  { label: 'la patata', group: 'e', emoji: '🥔' },
  { label: 'la leche', group: 'c', emoji: '🥛' },
  { label: 'el queso', group: 'c', emoji: '🧀' },
  { label: 'los huevos', group: 'c', emoji: '🥚', plural: true },
  { label: 'el aceite', group: 'e' },
]
const grupoDe = (etiqueta: string) => MIEMBROS.find((m) => m.label === etiqueta)!.group
const etiquetaDe = (opcion: string) => opcion.replace(/^\p{Extended_Pictographic}\s*/u, '')

describe('contrae y capitaliza', () => {
  it('«de el» pasa a «del» y «a el» a «al», sin tocar «de la», «del» ni palabras que terminan en de o a', () => {
    expect(contrae('¿Qué viene justo después de el esófago?')).toBe('¿Qué viene justo después del esófago?')
    expect(contrae('Va a el ano')).toBe('Va al ano')
    expect(contrae('después de la boca, del ano y de los pulmones; casa el lunes')).toBe('después de la boca, del ano y de los pulmones; casa el lunes')
    expect(contrae('Hace de el todo')).toBe('Hace del todo')
  })

  it('pone en mayúscula la primera letra, también tras la apertura de interrogación', () => {
    expect(capitaliza('¿qué es el codo?')).toBe('¿Qué es el codo?')
    expect(capitaliza('el codo: ¿hueso o músculo?')).toBe('El codo: ¿hueso o músculo?')
    expect(capitaliza('Ya está')).toBe('Ya está')
  })
})

describe('generate: classify (de un elemento a su categoría)', () => {
  const spec: BlockSpec = { kind: 'classify', question: '¿Para qué nos sirve comer {item}?', groups: GRUPOS, items: MIEMBROS }
  const ejercicios = muchos(spec)

  it('pregunta por un elemento de la tabla y la respuesta es su categoría', () => {
    for (const e of ejercicios) {
      const miembro = MIEMBROS.find((m) => e.question === `¿Para qué nos sirve comer ${m.label}?`)
      expect(miembro, e.question).toBeDefined()
      expect(e.answer).toBe(GRUPOS.find((g) => g.id === miembro!.group)!.label)
      expect(e.visual).toBe(miembro!.emoji)
    }
  })

  it('con tres categorías las ofrece todas, y salen todos los elementos', () => {
    for (const e of ejercicios) expect([...e.options].sort()).toEqual(['crecer', 'energía', 'vitaminas'])
    expect(new Set(ejercicios.map((e) => e.question)).size).toBe(MIEMBROS.length)
  })

  it('con más de tres categorías ofrece la correcta y dos de las otras', () => {
    const cinco: Group[] = ['uno', 'dos', 'tres', 'cuatro', 'cinco'].map((id) => ({ id, label: id, question: `¿Es ${id}?` }))
    const items: Member[] = cinco.flatMap((g) => [{ label: `a ${g.id}`, group: g.id }, { label: `b ${g.id}`, group: g.id }])
    for (const e of muchos({ kind: 'classify', question: '{item}: ¿cuál?', groups: cinco, items })) {
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      expect(e.options).toContain(e.answer)
      expect(e.answer).toBe(e.question.replace(/^[AB] (\w+): ¿cuál\?$/, '$1').toLowerCase())
    }
  })

  it('la identidad del hecho es la del elemento (no se repite en una sesión aunque cambien las opciones)', () => {
    for (const e of ejercicios) {
      const miembro = MIEMBROS.find((m) => e.question.includes(m.label))!
      expect(e.fact).toBe(`member:${miembro.group}:${miembro.label}`)
    }
  })

  it('si no salen tres opciones lo avisa en vez de dar un ejercicio mal hecho', () => {
    const dos = GRUPOS.slice(0, 2)
    expect(() => generate({ kind: 'classify', question: '{item}', groups: dos, items: MIEMBROS.filter((m) => m.group !== 'c') }, mulberry32(1))).toThrow()
  })
})

describe('generate: pick-member (de una categoría a uno de sus elementos)', () => {
  const spec: BlockSpec = { kind: 'pick-member', groups: GRUPOS, items: MIEMBROS }
  const ejercicios = muchos(spec)
  const texto = (m: Member) => (m.emoji ? `${m.emoji} ${m.label}` : m.label)

  it('la respuesta es un elemento de la categoría por la que se pregunta y las otras dos opciones son de otras categorías', () => {
    for (const e of ejercicios) {
      const grupo = GRUPOS.find((g) => g.question === e.question)!
      expect(grupo, e.question).toBeDefined()
      expect(grupoDe(etiquetaDe(e.answer))).toBe(grupo.id)
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      expect(e.options).toContain(e.answer)
      for (const opcion of e.options.filter((o) => o !== e.answer)) expect(grupoDe(etiquetaDe(opcion))).not.toBe(grupo.id)
    }
  })

  it('las opciones llevan el dibujo delante cuando el elemento lo tiene', () => {
    for (const e of ejercicios) {
      for (const opcion of e.options) expect(MIEMBROS.some((m) => texto(m) === opcion)).toBe(true)
    }
  })

  it('los elementos en plural no salen nunca (la pregunta está en singular)', () => {
    for (const e of ejercicios) for (const opcion of e.options) expect(opcion).not.toMatch(/huevos/)
  })

  it('salen todas las categorías y la identidad del hecho coincide con la de classify', () => {
    expect(new Set(ejercicios.map((e) => e.question)).size).toBe(3)
    for (const e of ejercicios) {
      const miembro = MIEMBROS.find((m) => texto(m) === e.answer)!
      expect(e.fact).toBe(`member:${miembro.group}:${miembro.label}`)
    }
  })
})

describe('generate: sequence (primero, último, justo antes y justo después)', () => {
  const PASOS = ['la boca', 'el esófago', 'el estómago', 'los intestinos', 'el ano']
  const spec: BlockSpec = {
    kind: 'sequence',
    id: 'camino',
    steps: PASOS,
    first: '¿Qué parte es la primera?',
    last: '¿Qué parte es la última?',
    after: '¿Qué parte va justo después de {step}?',
    before: '¿Qué parte va justo antes de {step}?',
  }
  const ejercicios = muchos(spec)
  const sinArticulo = (p: string) => p

  it('cada pregunta tiene la respuesta que marca el orden', () => {
    for (const e of ejercicios) {
      if (e.question === '¿Qué parte es la primera?') expect(e.answer).toBe(PASOS[0])
      else if (e.question === '¿Qué parte es la última?') expect(e.answer).toBe(PASOS.at(-1))
      else {
        const despues = /^¿Qué parte va justo después (?:de|del) (.+)\?$/.exec(e.question)
        const antes = /^¿Qué parte va justo antes (?:de|del) (.+)\?$/.exec(e.question)
        const paso = (texto: string) => PASOS.findIndex((p) => sinArticulo(p) === texto || p === `el ${texto}`)
        if (despues) {
          const i = paso(despues[1])
          expect(i, e.question).toBeGreaterThanOrEqual(0)
          expect(e.answer).toBe(PASOS[i + 1])
        } else {
          expect(antes, e.question).not.toBeNull()
          const i = paso(antes![1])
          expect(e.answer).toBe(PASOS[i - 1])
        }
      }
    }
  })

  it('«de el» sale siempre como «del»', () => {
    expect(ejercicios.some((e) => /después del esófago|antes del estómago|del ano/.test(e.question))).toBe(true)
    for (const e of ejercicios) expect(e.question).not.toMatch(/ de el /)
  })

  it('hay tres opciones distintas de la secuencia con la respuesta entre ellas', () => {
    for (const e of ejercicios) {
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      expect(e.options).toContain(e.answer)
      for (const opcion of e.options) expect(PASOS).toContain(opcion)
    }
  })

  it('el paso por el que se pregunta nunca es una de las opciones', () => {
    for (const e of ejercicios) {
      const referido = /(?:después|antes) (?:de|del) (.+)\?$/.exec(e.question)?.[1]
      if (!referido) continue
      const paso = PASOS.find((p) => p === referido || p === `el ${referido}`)!
      expect(e.options, e.question).not.toContain(paso)
    }
  })

  it('no se pregunta por antes del primero ni por después del último', () => {
    for (const e of ejercicios) {
      expect(e.question).not.toMatch(/antes de la boca/)
      expect(e.question).not.toMatch(/después del ano/)
    }
  })

  it('salen todos los hechos: primero, último, 4 «después» y 4 «antes»', () => {
    expect(new Set(ejercicios.map((e) => e.fact)).size).toBe(10)
    expect(new Set(ejercicios.map((e) => e.fact))).toContain('seq:camino:first:0')
    expect(new Set(ejercicios.map((e) => e.fact))).toContain('seq:camino:after:3')
    expect(new Set(ejercicios.map((e) => e.fact))).toContain('seq:camino:before:4')
  })

  it('con solo tres pasos hacen falta opciones de fuera (extra), que son siempre falsas, y se pueden pedir solo algunas preguntas', () => {
    const tres: BlockSpec = { kind: 'sequence', id: 'aire', steps: ['a', 'b', 'c'], extra: ['x', 'y'], after: '¿Qué va después de {step}?' }
    const lista = muchos(tres)
    for (const e of lista) {
      expect(e.options).toHaveLength(3)
      expect(['b', 'c']).toContain(e.answer)
      for (const opcion of e.options) expect(['a', 'b', 'c', 'x', 'y']).toContain(opcion)
      const referido = /después de (\w)\?$/.exec(e.question)![1]
      expect(e.options).not.toContain(referido)
    }
    expect(lista.some((e) => e.options.includes('x') || e.options.includes('y'))).toBe(true)
    expect(new Set(lista.map((e) => e.fact)).size).toBe(2)
  })

  it('si no hay opciones equivocadas suficientes lo avisa', () => {
    const tres: BlockSpec = { kind: 'sequence', id: 'corto', steps: ['a', 'b', 'c'], after: '¿Qué va después de {step}?' }
    expect(() => Array.from({ length: 50 }, (_, seed) => generate(tres, mulberry32(seed)))).toThrow()
  })
})

describe('generate: pairs (pares que se preguntan en los dos sentidos)', () => {
  const FILAS: PairRow[] = [
    { ask: '¿Con qué vemos?', answer: 'con los ojos', askBack: '¿Para qué sirven los ojos?', answerBack: 'la vista', emoji: '👀' },
    { ask: '¿Con qué oímos?', answer: 'con los oídos', askBack: '¿Para qué sirven los oídos?', answerBack: 'el oído', emoji: '👂' },
    { ask: '¿Con qué olemos?', answer: 'con la nariz', askBack: '¿Para qué sirve la nariz?', answerBack: 'el olfato', emoji: '👃' },
    { ask: '¿Con qué saboreamos?', answer: 'con la lengua', askBack: '¿Para qué sirve la lengua?', answerBack: 'el gusto', emoji: '👅' },
  ]
  const ejercicios = muchos({ kind: 'pairs', rows: FILAS })

  it('cada pregunta tiene su respuesta en los dos sentidos', () => {
    for (const e of ejercicios) {
      const fila = FILAS.find((f) => f.ask === e.question || f.askBack === e.question)!
      expect(fila, e.question).toBeDefined()
      expect(e.answer).toBe(fila.ask === e.question ? fila.answer : fila.answerBack)
      expect(e.visual).toBe(fila.emoji)
    }
    expect(new Set(ejercicios.map((e) => e.question)).size).toBe(8)
  })

  it('las opciones equivocadas son las respuestas de las otras filas en ese mismo sentido', () => {
    for (const e of ejercicios) {
      const adelante = FILAS.some((f) => f.ask === e.question)
      const respuestas = FILAS.map((f) => (adelante ? f.answer : f.answerBack))
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      for (const opcion of e.options) expect(respuestas).toContain(opcion)
    }
  })

  it('los dos sentidos de una misma fila son el mismo hecho', () => {
    const hechos = ejercicios.map((e) => e.fact)
    expect(new Set(hechos)).toEqual(new Set(FILAS.map((f) => `pair:${f.ask}`)))
    for (const e of ejercicios) {
      const fila = FILAS.find((f) => f.ask === e.question || f.askBack === e.question)!
      expect(e.fact).toBe(`pair:${fila.ask}`)
    }
  })

  it('dos tablas de pares distintas no comparten hechos aunque sus filas estén en la misma posición', () => {
    const otras: PairRow[] = [
      { ask: '¿Qué usamos para borrar?', answer: 'la goma', askBack: '¿Para qué sirve la goma?', answerBack: 'para borrar' },
      { ask: '¿Qué usamos para cortar?', answer: 'las tijeras', askBack: '¿Para qué sirven las tijeras?', answerBack: 'para cortar' },
      { ask: '¿Qué usamos para pegar?', answer: 'el pegamento', askBack: '¿Para qué sirve el pegamento?', answerBack: 'para pegar' },
    ]
    const propios = new Set(ejercicios.map((e) => e.fact))
    for (const e of muchos({ kind: 'pairs', rows: otras })) expect(propios.has(e.fact), e.fact).toBe(false)
  })
})

describe('generate: facts (preguntas escritas con sus respuestas equivocadas)', () => {
  const ITEMS: FactItem[] = [
    { question: '¿Cómo son los huesos?', answer: 'duros y rígidos', wrong: ['blandos', 'de goma', 'líquidos', 'elásticos'], visual: '🦴' },
    { question: '¿Dónde están los huesos?', answer: 'dentro del cuerpo', wrong: ['fuera del cuerpo', 'encima de la piel', 'solo en la cabeza'] },
  ]
  const ejercicios = muchos({ kind: 'facts', items: ITEMS })

  it('ofrece la respuesta y dos de las equivocadas de esa pregunta, nunca de otra', () => {
    for (const e of ejercicios) {
      const item = ITEMS.find((i) => i.question === e.question)!
      expect(e.answer).toBe(item.answer)
      expect(e.options).toHaveLength(3)
      expect(new Set(e.options).size).toBe(3)
      for (const opcion of e.options.filter((o) => o !== e.answer)) expect(item.wrong).toContain(opcion)
      expect(e.visual).toBe(item.visual)
    }
  })

  it('con cuatro respuestas equivocadas las combinaciones cambian de una vez a otra', () => {
    const combos = new Set(ejercicios.filter((e) => e.question === ITEMS[0].question).map((e) => [...e.options].sort().join('|')))
    expect(combos.size).toBeGreaterThan(3)
  })

  it('cada pregunta es un hecho distinto', () => {
    expect(new Set(ejercicios.map((e) => e.fact))).toEqual(new Set(ITEMS.map((i) => `fact:${i.question}`)))
  })

  it('si una pregunta tiene menos de dos respuestas equivocadas lo avisa', () => {
    expect(() => generate({ kind: 'facts', items: [{ question: '¿?', answer: 'a', wrong: ['b'] }] }, mulberry32(1))).toThrow()
  })
})

describe('exerciseKey con identidad de hecho', () => {
  const base: ChoiceExercise = { type: 'choice', question: '¿Qué es?', options: ['a', 'b', 'c'], answer: 'a' }

  it('el mismo hecho con otras opciones u otro orden es el mismo ejercicio', () => {
    const uno = { ...base, fact: 'x' }
    const otro = { ...base, options: ['a', 'd', 'e'], question: 'Otra forma de preguntar', fact: 'x' }
    expect(exerciseKey(uno)).toBe(exerciseKey(otro))
  })

  it('hechos distintos son ejercicios distintos', () => {
    expect(exerciseKey({ ...base, fact: 'x' })).not.toBe(exerciseKey({ ...base, fact: 'y' }))
  })

  it('sin identidad de hecho la clave es la de siempre (pregunta, dibujo, respuesta y opciones ordenadas)', () => {
    expect(exerciseKey({ ...base, visual: '🍎', options: ['c', 'a', 'b'] })).toBe(
      JSON.stringify(['choice', '¿Qué es?', '🍎', 'a', ['a', 'b', 'c']]),
    )
  })
})

describe('gramática de todo lo generado', () => {
  const specs: BlockSpec[] = [
    { kind: 'classify', question: '{item}: ¿cuál?', groups: GRUPOS, items: MIEMBROS },
    { kind: 'pick-member', groups: GRUPOS, items: MIEMBROS },
    { kind: 'sequence', id: 's', steps: ['la boca', 'el esófago', 'el estómago'], extra: ['la tráquea', 'los pulmones'], after: '¿Qué hay justo después de {step}?', before: '¿Qué hay justo antes de {step}?' },
  ]
  it('ninguna pregunta lleva «de el» ni «a el» y todas empiezan con mayúscula', () => {
    for (const spec of specs) {
      for (const e of muchos(spec)) {
        expect(e.question).not.toMatch(/ de el | a el /)
        expect(e.question.replace(/^¿/, '')[0]).toBe(e.question.replace(/^¿/, '')[0].toUpperCase())
      }
    }
  })
})

describe('generate: facts con texto para leer', () => {
  it('el ejercicio lleva el texto del hecho, y sin texto no lo lleva', () => {
    const items: FactItem[] = [
      { question: '¿Adónde va?', answer: 'al río', wrong: ['al mar', 'al cole', 'a casa'], text: 'La tortuga va al río.' },
      { question: '¿Cómo es?', answer: 'grande', wrong: ['pequeño', 'alto', 'bajo'] },
    ]
    for (const e of muchos({ kind: 'facts', items })) {
      const item = items.find((i) => i.question === e.question)!
      expect(e.text).toBe(item.text)
    }
  })
})
