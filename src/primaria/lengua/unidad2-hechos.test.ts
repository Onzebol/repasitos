import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem, PairRow } from '../../types'
import { temasUnidad2 } from './unidad2'

// Tablas de verdad escritas aquí por separado: comparan las tablas del contenido con lo que se sabe, para que un cambio en
// el contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad2.find((x) => x.id === tema)
  if (!t) throw new Error(`no existe el tema ${tema}`)
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
const facts = (tema: string, i = 0): FactItem[] => bloques(tema, 'facts')[i].items
const pares = (tema: string, i = 0): PairRow[] => bloques(tema, 'pairs')[i].rows

function compruebaMalas(items: FactItem[]) {
  for (const item of items) {
    expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
    expect(new Set(item.wrong).size, item.question).toBe(item.wrong.length)
    expect(item.wrong, item.question).not.toContain(item.answer)
  }
  const preguntas = items.map((i) => i.question)
  expect(new Set(preguntas).size, 'preguntas repetidas').toBe(preguntas.length)
}

// Una tabla de pares de ida y vuelta: la pregunta de vuelta pregunta por la respuesta de ida, y nada se repite
function compruebaPares(rows: PairRow[], verdad: [string, string][], ida: (a: string) => string, vuelta: (b: string) => string) {
  expect(rows.map((r) => [r.ask, r.answer, r.askBack, r.answerBack])).toEqual(verdad.map(([a, b]) => [ida(a), b, vuelta(b), a]))
  const todas = verdad.flat()
  expect(new Set(todas).size, 'palabras repetidas').toBe(todas.length)
}

describe('Palabras de la granja', () => {
  it('cada animal vive donde dice la tabla', () => {
    compruebaPares(
      pares('granja'),
      [
        ['el caballo', 'la cuadra'],
        ['el cerdo', 'la pocilga'],
        ['la gallina', 'el gallinero'],
        ['la oveja', 'el redil'],
        ['el conejo', 'la conejera'],
        ['la abeja', 'la colmena'],
        ['la paloma', 'el palomar'],
        ['el perro', 'la caseta'],
      ],
      (animal) => `¿Dónde vive ${animal} en la granja?`,
      (lugar) => `¿Qué animal vive en ${lugar}?`,
    )
  })

  it('los animales domésticos y salvajes son lo que dice la tabla', () => {
    const [elige] = bloques('granja', 'pick-member')
    expect(Object.fromEntries(elige.items.map((m) => [m.label, m.group]))).toEqual({
      'el perro': 'domestico',
      'el gato': 'domestico',
      'la vaca': 'domestico',
      'la oveja': 'domestico',
      'la gallina': 'domestico',
      'el caballo': 'domestico',
      'el cerdo': 'domestico',
      'el león': 'salvaje',
      'el lobo': 'salvaje',
      'el tigre': 'salvaje',
      'la jirafa': 'salvaje',
      'el elefante': 'salvaje',
      'el cocodrilo': 'salvaje',
      'la cebra': 'salvaje',
    })
    expect(elige.groups.map((g) => g.question)).toEqual(['¿Cuál de estos animales es doméstico?', '¿Cuál de estos animales es salvaje?'])
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('granja')))
})

describe('Antónimos', () => {
  const contrario = (p: string) => `¿Cuál es el contrario de «${p}»?`
  it('los adjetivos de la tabla son contrarios', () => {
    compruebaPares(
      pares('antonimos', 0),
      [
        ['grande', 'pequeño'],
        ['alegre', 'triste'],
        ['gordo', 'delgado'],
        ['lleno', 'vacío'],
        ['duro', 'blando'],
        ['rápido', 'lento'],
        ['limpio', 'sucio'],
        ['largo', 'corto'],
        ['mojado', 'seco'],
        ['frío', 'caliente'],
      ],
      contrario,
      contrario,
    )
  })

  it('los verbos de la tabla son contrarios', () => {
    compruebaPares(
      pares('antonimos', 1),
      [
        ['empezar', 'acabar'],
        ['subir', 'bajar'],
        ['abrir', 'cerrar'],
        ['ganar', 'perder'],
        ['entrar', 'salir'],
        ['encender', 'apagar'],
        ['reír', 'llorar'],
        ['meter', 'sacar'],
        ['recordar', 'olvidar'],
        ['comprar', 'vender'],
      ],
      contrario,
      contrario,
    )
  })

  it('los contrarios con in- o im- se forman añadiendo esas letras delante', () => {
    const rows = pares('antonimos', 2)
    expect(rows.length).toBeGreaterThanOrEqual(6)
    for (const r of rows) {
      expect(r.ask).toBe(contrario(r.answerBack))
      expect(r.askBack).toBe(contrario(r.answer))
      // delante de p o b se escribe im-
      expect(r.answer).toBe(`${/^[pb]/.test(r.answerBack) ? 'im' : 'in'}${r.answerBack}`)
    }
  })

  it('ninguna palabra está en dos tablas de antónimos', () => {
    const todas = bloques('antonimos', 'pairs').flatMap((b) => b.rows.flatMap((r) => [r.answer, r.answerBack]))
    expect(new Set(todas).size).toBe(todas.length)
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('antonimos')))
})

describe('La r y la rr', () => {
  // Regla del libro: rr solo entre vocales y suena fuerte; la r al principio suena fuerte; la r sola entre vocales o al final
  // suena suave. Las palabras con r detrás de n, l o s no entran (el libro no las explica).
  const sonido = (palabra: string): string => {
    if (palabra.includes('rr')) return 'fuerte-rr'
    if (palabra.startsWith('r')) return 'fuerte-r'
    return 'suave'
  }

  it('cada palabra tiene una sola R y se clasifica por la regla', () => {
    const [clasifica] = bloques('erre', 'classify')
    expect(clasifica.groups.map((g) => [g.id, g.label])).toEqual([
      ['suave', 'suave, con una r'],
      ['fuerte-r', 'fuerte, con una r'],
      ['fuerte-rr', 'fuerte, con rr'],
    ])
    for (const m of clasifica.items) {
      expect(m.label.replace(/rr/g, 'R').replace(/[^rR]/g, ''), `${m.label}: una sola R`).toHaveLength(1)
      expect(m.label, m.label).not.toMatch(/[nls]r/)
      expect(m.group, m.label).toBe(sonido(m.label))
    }
    for (const g of clasifica.groups) expect(clasifica.items.filter((m) => m.group === g.id).length, g.id).toBeGreaterThanOrEqual(6)
  })

  it('en las frases, las malas solo cambian una r por rr o al revés', () => {
    const frases = facts('erre', 0)
    compruebaMalas(frases)
    const sinDobles = (s: string) => s.replace(/([rR])r/g, '$1')
    for (const f of frases) {
      expect(f.answer[0], f.answer).toBe(f.answer[0].toUpperCase())
      for (const mala of f.wrong) {
        expect(sinDobles(mala), mala).toBe(sinDobles(f.answer))
        expect(mala[0], mala).toBe(mala[0].toUpperCase())
      }
    }
  })

  it('las palabras que cambian con r o rr significan lo que dice la tabla', () => {
    const verdad: Record<string, string> = {
      caro: 'que cuesta mucho dinero',
      carro: 'vehículo con ruedas del que tira un animal',
      pera: 'fruta verde o amarilla',
      perra: 'la hembra del perro',
      coro: 'grupo de personas que cantan juntas',
      corro: 'círculo de personas cogidas de la mano',
      cero: 'el número 0',
      cerro: 'monte pequeño',
      coral: 'animal del mar que forma rocas de colores',
      corral: 'sitio cerrado donde están los animales de la granja',
    }
    const rows = pares('erre')
    expect(Object.fromEntries(rows.map((r) => [r.answer, r.answerBack]))).toEqual(verdad)
    for (const r of rows) {
      expect(r.ask).toBe(`¿Qué palabra significa «${r.answerBack}»?`)
      expect(r.askBack).toBe(`¿Qué significa «${r.answer}»?`)
    }
  })
})

describe('Unir oraciones', () => {
  it('la buena une las dos oraciones con «y» en una sola', () => {
    const unir = facts('unir', 0)
    compruebaMalas(unir)
    for (const f of unir) {
      expect(f.answer, f.answer).toMatch(/ y /)
      expect(f.answer.match(/\./g), f.answer).toHaveLength(1)
      expect(f.answer.endsWith('.'), f.answer).toBe(true)
    }
  })

  it('al separar las palabras, la buena tiene las mismas letras que la frase junta', () => {
    const separar = facts('unir', 1)
    compruebaMalas(separar)
    for (const f of separar) {
      const junta = f.question.match(/«(.+)»/)?.[1]
      expect(junta, f.question).toBeDefined()
      expect(junta, f.question).not.toMatch(/ /)
      expect(f.answer.replace(/ /g, '').toLowerCase()).toBe(junta!.toLowerCase())
      for (const mala of f.wrong) expect(mala.replace(/ /g, '').toLowerCase(), mala).toBe(junta!.toLowerCase())
    }
  })
})

describe('La lengua oral y la escrita', () => {
  it('cada acción es oral o escrita según la tabla', () => {
    const [elige] = bloques('oral-escrita', 'pick-member')
    const verdad: Record<string, string> = {
      'contar un cuento': 'oral',
      'hablar por teléfono': 'oral',
      'saludar a un amigo': 'oral',
      'preguntar algo a la maestra': 'oral',
      'contar lo que pasó en el recreo': 'oral',
      'cantar una canción': 'oral',
      'explicar un juego a los compañeros': 'oral',
      'escribir la fecha en la pizarra': 'escrita',
      'escribir una carta': 'escrita',
      'escribir un mensaje en el chat': 'escrita',
      'hacer la lista de la compra': 'escrita',
      'escribir un resumen': 'escrita',
      'rellenar una ficha': 'escrita',
      'mandar una postal': 'escrita',
    }
    expect(Object.fromEntries(elige.items.map((m) => [m.label, m.group]))).toEqual(verdad)
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('oral-escrita')))
})

describe('Símbolos y cómic', () => {
  it('cada símbolo significa lo que dice la tabla', () => {
    const verdad: Record<string, string> = {
      '🚻': 'aseos',
      '♿': 'sitio preparado para sillas de ruedas',
      '🚭': 'prohibido fumar',
      '♻️': 'reciclar',
      '🚰': 'agua para beber',
      '🅿️': 'aparcamiento',
      '⚠️': 'cuidado, peligro',
      '📵': 'prohibido usar el móvil',
      '🚯': 'no tirar basura',
      'ℹ️': 'información',
    }
    const rows = pares('simbolos')
    expect(Object.fromEntries(rows.map((r) => [r.answerBack, r.answer]))).toEqual(verdad)
    for (const r of rows) {
      expect(r.ask).toBe(`¿Qué significa el símbolo ${r.answerBack}?`)
      expect(r.askBack).toBe(`¿Qué símbolo significa «${r.answer}»?`)
    }
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => {
    for (const b of bloques('simbolos', 'facts')) compruebaMalas(b.items)
  })
})

describe('Comprensión lectora', () => {
  it('cada texto tiene cuatro preguntas distintas con tres respuestas equivocadas', () => {
    const lecturas = facts('lectura')
    compruebaMalas(lecturas)
    const porTexto = new Map<string, number>()
    for (const l of lecturas) {
      expect(l.text, l.question).toBeDefined()
      porTexto.set(l.text!, (porTexto.get(l.text!) ?? 0) + 1)
    }
    expect(porTexto.size).toBeGreaterThanOrEqual(6)
    for (const n of porTexto.values()) expect(n).toBe(4)
  })
})
