import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem, PairRow } from '../../types'
import { temasUnidad1 } from './unidad1'
import { temasUnidad2 } from './unidad2'
import { temasUnidad3 } from './unidad3'

// Tablas de verdad escritas aquí por separado: comparan las tablas del contenido con lo que se sabe, para que un cambio en
// el contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad3.find((x) => x.id === tema)
  if (!t) throw new Error(`no existe el tema ${tema}`)
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
const facts = (tema: string, i = 0): FactItem[] => bloques(tema, 'facts')[i].items
const pares = (tema: string, i = 0): PairRow[] => bloques(tema, 'pairs')[i].rows
const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function compruebaMalas(items: FactItem[]) {
  for (const item of items) {
    expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
    expect(new Set(item.wrong).size, item.question).toBe(item.wrong.length)
    expect(item.wrong, item.question).not.toContain(item.answer)
  }
  const preguntas = items.map((i) => i.question)
  expect(new Set(preguntas).size, 'preguntas repetidas').toBe(preguntas.length)
}

// Pares de ida y vuelta: la pregunta de vuelta pregunta por la respuesta de ida, y nada se repite
function compruebaPares(rows: PairRow[], verdad: [string, string][], ida: (a: string) => string, vuelta: (b: string) => string) {
  expect(rows.map((r) => [r.ask, r.answer, r.askBack, r.answerBack])).toEqual(verdad.map(([a, b]) => [ida(a), b, vuelta(b), a]))
  const todas = verdad.flat()
  expect(new Set(todas).size, 'repetidos').toBe(todas.length)
}

const miembros = (tema: string, kind: 'classify' | 'pick-member', i = 0) =>
  Object.fromEntries(bloques(tema, kind)[i].items.map((m) => [m.label, m.group]))

describe('Palabras del arte', () => {
  it('cada palabra significa lo que dice la tabla', () => {
    compruebaPares(
      pares('arte'),
      [
        ['el pincel', 'instrumento con pelitos y un mango largo para pintar'],
        ['el lienzo', 'tela sobre la que se pinta un cuadro'],
        ['el marco', 'borde que rodea un cuadro'],
        ['el retrato', 'pintura o dibujo de una persona'],
        ['el paisaje', 'pintura de un campo, un mar o una montaña'],
        ['el mural', 'pintura grande hecha sobre una pared'],
        ['el museo', 'edificio donde se guardan y se enseñan obras de arte'],
        ['la paleta', 'tabla donde el pintor mezcla los colores'],
        ['el caballete', 'soporte que sujeta el cuadro mientras se pinta'],
        ['la escultura', 'figura hecha de piedra, madera o barro'],
      ],
      (palabra) => `¿Qué significa «${palabra}»?`,
      (definicion) => `¿Qué palabra significa «${definicion}»?`,
    )
  })

  it('cada palabra es de la pintura, de la música o del teatro', () => {
    expect(miembros('arte', 'classify')).toEqual({
      'el pincel': 'pintura',
      'la paleta': 'pintura',
      'el caballete': 'pintura',
      'el lienzo': 'pintura',
      'las acuarelas': 'pintura',
      'el retrato': 'pintura',
      'el concierto': 'musica',
      'la guitarra': 'musica',
      'el piano': 'musica',
      'el tambor': 'musica',
      'la flauta': 'musica',
      'la partitura': 'musica',
      'el telón': 'teatro',
      'el actor': 'teatro',
      'la actriz': 'teatro',
      'el guion': 'teatro',
      'la obra de teatro': 'teatro',
      'los títeres': 'teatro',
    })
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('arte')))
})

describe('Aumentativos y diminutivos', () => {
  // La palabra derivada empieza por la palabra sin su última vocal (con c → qu y z → c delante de e o i) y acaba en la
  // terminación de su clase
  function raiz(palabra: string, derivada: string): string {
    const r = sinTildes(palabra).replace(/[aeo]$/, '')
    const vocal = sinTildes(derivada).charAt(r.length)
    if (/[ei]/.test(vocal) || sinTildes(derivada).slice(r.length - 1).startsWith('qu')) {
      if (r.endsWith('c')) return `${r.slice(0, -1)}qu`
      if (r.endsWith('z')) return `${r.slice(0, -1)}c`
    }
    return r
  }
  const DIMINUTIVO = /(it|ill)[oa]$/
  const AUMENTATIVO = /(ón|ot[ea]|az[oa])$/

  it('los diminutivos se forman con -ito, -ita, -illo o -illa', () => {
    const rows = pares('aumentativos', 0)
    expect(rows.length).toBeGreaterThanOrEqual(8)
    for (const r of rows) {
      expect(r.ask).toBe(`¿Cuál es el diminutivo de «${r.answerBack}»?`)
      expect(r.askBack).toBe(`¿De qué palabra es diminutivo «${r.answer}»?`)
      expect(r.answer, r.answer).toMatch(DIMINUTIVO)
      expect(sinTildes(r.answer).startsWith(raiz(r.answerBack, r.answer)), `${r.answerBack} → ${r.answer}`).toBe(true)
    }
  })

  it('los aumentativos se forman con -ón, -ote, -azo o -aza', () => {
    const rows = pares('aumentativos', 1)
    expect(rows.length).toBeGreaterThanOrEqual(8)
    for (const r of rows) {
      expect(r.ask).toBe(`¿Cuál es el aumentativo de «${r.answerBack}»?`)
      expect(r.askBack).toBe(`¿De qué palabra es aumentativo «${r.answer}»?`)
      expect(r.answer, r.answer).toMatch(AUMENTATIVO)
      expect(sinTildes(r.answer).startsWith(raiz(r.answerBack, r.answer)), `${r.answerBack} → ${r.answer}`).toBe(true)
    }
  })

  it('al elegir, cada palabra es diminutivo o aumentativo según su terminación', () => {
    const [elige] = bloques('aumentativos', 'pick-member')
    for (const m of elige.items) expect(m.group, m.label).toBe(DIMINUTIVO.test(m.label) ? 'diminutivo' : AUMENTATIVO.test(m.label) ? 'aumentativo' : '?')
    expect(elige.items.filter((m) => m.group === 'diminutivo').length).toBeGreaterThanOrEqual(5)
    expect(elige.items.filter((m) => m.group === 'aumentativo').length).toBeGreaterThanOrEqual(5)
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('aumentativos')))
})

describe('ca, co, cu, que, qui', () => {
  // Regla del libro: c delante de a, o, u; qu delante de e, i. Cada palabra tiene el sonido K de una sola forma, sin k y sin
  // «cue» ni «cui».
  const forma = (p: string) => {
    const conC = /c[aouáóú]/.test(p)
    const conQu = /qu[eiéí]/.test(p)
    if (conC && !conQu) return 'c'
    if (conQu && !conC) return 'qu'
    return '?'
  }

  it('cada palabra va con c o con qu según la regla', () => {
    const [elige] = bloques('c-qu', 'pick-member')
    for (const m of elige.items) {
      expect(m.label, m.label).not.toMatch(/k|cu[ei]/)
      expect(m.group, m.label).toBe(forma(m.label))
    }
    expect(elige.items.filter((m) => m.group === 'c').length).toBeGreaterThanOrEqual(6)
    expect(elige.items.filter((m) => m.group === 'qu').length).toBeGreaterThanOrEqual(6)
  })

  it('al escribir una palabra, la buena cumple la regla y las malas no', () => {
    const escribir = facts('c-qu', 0)
    compruebaMalas(escribir)
    const cumple = (palabra: string) => {
      const p = sinTildes(palabra)
      return !/k|q[^u]|q$|qu[aou]|c[ei]/.test(p) && /c[aou]|qu[ei]/.test(p)
    }
    for (const f of escribir) {
      expect(cumple(f.answer), f.answer).toBe(true)
      // las malas suenan igual: c delante de e o i (suena distinto), k, q sin u o qu delante de a, o, u
      for (const mala of f.wrong) expect(cumple(mala), mala).toBe(false)
    }
  })

  it('la sílaba que falta es la que pide la vocal de la palabra', () => {
    const completar = facts('c-qu', 1)
    compruebaMalas(completar)
    const verdad: Record<string, string> = {
      raqueta: 'que',
      paquete: 'que',
      calabaza: 'ca',
      mosquito: 'qui',
      escudo: 'cu',
      rosquilla: 'qui',
      pequeño: 'que',
      máquina: 'qui',
      cocodrilo: 'co',
    }
    const vistos: Record<string, string> = {}
    for (const f of completar) {
      const hueco = f.question.match(/«(.+)»/)?.[1]
      expect(hueco, f.question).toBeDefined()
      const palabra = hueco!.replace(' _ ', f.answer).replace(/^_ /, f.answer).replace(/ _$/, f.answer)
      vistos[palabra] = f.answer
      expect([...f.wrong].sort()).toEqual(['ca', 'co', 'cu', 'que', 'qui'].filter((s) => s !== f.answer).sort())
    }
    expect(vistos).toEqual(verdad)
  })

  it('las reglas tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('c-qu', 2)))
})

describe('Completar oraciones', () => {
  it('los finales empiezan en minúscula y acaban en punto', () => {
    const completar = facts('completar', 0)
    compruebaMalas(completar)
    for (const f of completar) {
      for (const final of [f.answer, ...f.wrong]) {
        expect(final, final).toMatch(/^[a-záéíóúñ¡]/)
        expect(final.endsWith('.'), final).toBe(true)
      }
    }
  })

  it('las oraciones bien escritas empiezan con mayúscula y acaban en punto, y cada mala falla en algo', () => {
    const completas = facts('completar', 1)
    compruebaMalas(completas)
    const bienEscrita = (s: string) => /^[A-ZÁÉÍÓÚÑ]/.test(s) && s.endsWith('.')
    for (const f of completas) {
      expect(bienEscrita(f.answer), f.answer).toBe(true)
      for (const mala of f.wrong) {
        const incompleta = f.answer.startsWith(mala) && mala.length < f.answer.length - 1
        expect(!bienEscrita(mala) || incompleta, mala).toBe(true)
      }
    }
  })
})

describe('Sustantivos comunes y propios', () => {
  it('cada nombre común nombra a una persona, un animal o una cosa', () => {
    expect(miembros('sustantivos', 'classify')).toEqual({
      'niña': 'persona',
      'maestro': 'persona',
      'bombero': 'persona',
      'abuela': 'persona',
      'médica': 'persona',
      'pintor': 'persona',
      'pato': 'animal',
      'gato': 'animal',
      'caballo': 'animal',
      'ballena': 'animal',
      'mariposa': 'animal',
      'león': 'animal',
      'gorro': 'cosa',
      'mesa': 'cosa',
      'lápiz': 'cosa',
      'pelota': 'cosa',
      'cuadro': 'cosa',
      'bicicleta': 'cosa',
    })
  })

  it('cada nombre propio es de lo que dice la tabla', () => {
    compruebaPares(
      pares('sustantivos'),
      [
        ['Madrid', 'de una ciudad'],
        ['Ebro', 'de un río'],
        ['Teide', 'de una montaña'],
        ['España', 'de un país'],
        ['Mediterráneo', 'de un mar'],
        ['Atlántico', 'de un océano'],
        ['Tenerife', 'de una isla'],
        ['Marte', 'de un planeta'],
      ],
      (propio) => `¿De qué es nombre propio «${propio}»?`,
      (de) => `¿Cuál es el nombre propio ${de}?`,
    )
    for (const r of pares('sustantivos')) expect(r.answerBack[0], r.answerBack).toBe(r.answerBack[0].toUpperCase())
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('sustantivos')))
})

describe('Describir objetos', () => {
  it('cada palabra dice el tamaño, el color o una parte', () => {
    expect(miembros('describir', 'classify')).toEqual({
      pequeña: 'tamaño',
      grande: 'tamaño',
      enorme: 'tamaño',
      diminuta: 'tamaño',
      mediana: 'tamaño',
      roja: 'color',
      azul: 'color',
      verde: 'color',
      amarilla: 'color',
      morada: 'color',
      blanca: 'color',
      'el manillar': 'parte',
      'el sillín': 'parte',
      'las ruedas': 'parte',
      'el timbre': 'parte',
      'los pedales': 'parte',
      'la cesta': 'parte',
    })
  })

  it('cada objeto tiene las partes que dice la tabla', () => {
    compruebaPares(
      pares('describir'),
      [
        ['la bicicleta', 'manillar y pedales'],
        ['el reloj', 'agujas'],
        ['el paraguas', 'mango y varillas'],
        ['el lápiz', 'mina'],
        ['la silla', 'respaldo y patas'],
        ['la zapatilla', 'suela y cordones'],
        ['el libro', 'páginas y portada'],
        ['la taza', 'asa'],
        ['el ordenador', 'pantalla y teclado'],
      ],
      (objeto) => `¿Qué partes tiene ${objeto}?`,
      (partes) => `¿Qué objeto tiene ${partes}?`,
    )
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('describir')))
})

describe('La biblioteca del colegio', () => {
  it('cada norma es lo que se debe o no se debe hacer', () => {
    expect(miembros('biblioteca', 'pick-member')).toEqual({
      'hablar en voz baja': 'bien',
      'cuidar los libros': 'bien',
      'devolver los libros a tiempo': 'bien',
      'dejar cada libro en su sitio': 'bien',
      'pasar las páginas con cuidado': 'bien',
      'tener las manos limpias': 'bien',
      'enseñar el carné para llevarse un libro': 'bien',
      'gritar': 'mal',
      'escribir en los libros': 'mal',
      'pintar en los libros': 'mal',
      'comer encima de los libros': 'mal',
      'correr entre las estanterías': 'mal',
      'doblar las páginas': 'mal',
      'quedarse los libros prestados': 'mal',
    })
  })

  it('cada libro tiene lo que dice la tabla', () => {
    compruebaPares(
      pares('biblioteca'),
      [
        ['un cómic', 'viñetas y bocadillos'],
        ['un libro de poesía', 'versos que riman'],
        ['una obra de teatro', 'diálogos para representar'],
        ['un diccionario', 'palabras ordenadas por el abecedario'],
        ['un atlas', 'mapas de los países'],
        ['un libro de recetas', 'cómo se preparan las comidas'],
      ],
      (libro) => `¿Qué tiene ${libro}?`,
      (contenido) => `¿Qué libro tiene ${contenido}?`,
    )
  })

  it('los hechos tienen al menos tres respuestas equivocadas distintas', () => compruebaMalas(facts('biblioteca')))
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

  it('los diálogos ponen cada intervención en su línea y los poemas cada verso', () => {
    const textos = [...new Set(facts('lectura').map((l) => l.text!))]
    const dialogos = textos.filter((t) => t.startsWith('—'))
    expect(dialogos.length).toBeGreaterThanOrEqual(2)
    for (const d of dialogos) for (const linea of d.split('\n')) expect(linea, linea).toMatch(/^—/)
    // una raya que abre otra intervención va siempre al principio de una línea
    for (const d of dialogos) expect(d, d).not.toMatch(/[^\n]—[¿¡A-ZÁÉÍÓÚ]/)
    const poemas = textos.filter((t) => !t.startsWith('—') && t.split('\n').length >= 4)
    expect(poemas.length).toBeGreaterThanOrEqual(2)
    for (const t of textos) expect(t, t).not.toContain(' / ')
  })
})

describe('Repaso del primer trimestre', () => {
  // El repaso no copia tablas: usa bloques de las unidades 1 a 3, que ya tienen su tabla de verdad independiente
  const origen = (temas: typeof temasUnidad1, tema: string, i: number) => temas.find((t) => t.id === tema)!.plan[i].spec
  const repaso = temasUnidad3.find((t) => t.id === 'repaso')!
  // los hechos propios del repaso son su último bloque (los demás son de las unidades)
  const propios = () => bloques('repaso', 'facts').at(-1)!.items

  it('toma un ejercicio de tres bloques de cada unidad, sin duplicar sus tablas, y uno de hechos propios', () => {
    const esperados = [
      origen(temasUnidad1, 'mayuscula', 2),
      origen(temasUnidad1, 'sinonimos', 0),
      origen(temasUnidad1, 'abecedario', 0),
      origen(temasUnidad2, 'erre', 0),
      origen(temasUnidad2, 'antonimos', 0),
      origen(temasUnidad2, 'oral-escrita', 0),
      origen(temasUnidad3, 'c-qu', 1),
      origen(temasUnidad3, 'aumentativos', 0),
      origen(temasUnidad3, 'sustantivos', 1),
    ]
    expect(repaso.plan).toHaveLength(esperados.length + 1)
    esperados.forEach((spec, i) => expect(repaso.plan[i].spec, `bloque ${i}`).toBe(spec))
    expect(repaso.plan[esperados.length].spec.kind).toBe('facts')
    expect(repaso.plan.map((b) => b.count)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  })

  it('los hechos sueltos son correctos y tienen tres respuestas equivocadas', () => {
    const hechos = propios()
    compruebaMalas(hechos)
    expect(Object.fromEntries(hechos.map((f) => [f.question, f.answer]))).toEqual({
      '¿Qué tienen en común «perrito» y «perrazo»?': 'vienen de la palabra «perro»',
      '¿Qué nombre se escribe siempre con mayúscula?': 'el nombre de un río, como Ebro',
      '¿Qué es lo contrario de un diminutivo?': 'un aumentativo',
      '¿Qué oración tiene bien escritas la mayúscula, la rr y la qu?': 'Mi perro Toby come queso.',
    })
  })

  it('sus preguntas no son las mismas que las de los temas de las unidades, para no repetir un hecho', () => {
    const deLasUnidades = [...temasUnidad1, ...temasUnidad2, ...temasUnidad3.filter((t) => t.id !== 'repaso')]
      .flatMap((t) => t.plan)
      .flatMap((b) => (b.spec.kind === 'facts' ? b.spec.items.map((f) => f.question) : []))
    for (const f of propios()) expect(deLasUnidades, f.question).not.toContain(f.question)
  })
})
