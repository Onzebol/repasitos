import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem, Member, PairRow } from '../../types'
import { temasUnidad2 } from './unidad2'

// Tablas de verdad escritas aquí por separado: comparan las tablas del contenido con lo que se sabe de los animales, para que
// un cambio en el contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad2.find((x) => x.id === tema)!
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
const unico = <K extends BlockSpec['kind']>(tema: string, kind: K, i = 0): Tipo<K> => bloques(tema, kind)[i]

function igualQue(items: Member[], verdad: Record<string, string>) {
  expect(Object.fromEntries(items.map((m) => [m.label, m.group]))).toEqual(verdad)
}

const MAMIFEROS = ['el conejo', 'la vaca', 'el delfín', 'el murciélago', 'el elefante', 'el perro', 'la ballena', 'el león', 'el mono']
const AVES = ['la gallina', 'el águila', 'el pingüino', 'el pato', 'el búho', 'el loro', 'el cisne', 'el flamenco', 'el avestruz']
const PECES = ['la trucha', 'el tiburón', 'el pez payaso', 'el pez globo']
const REPTILES = ['la serpiente', 'el cocodrilo', 'la tortuga', 'el lagarto']
const ANFIBIOS = ['la rana', 'la salamandra', 'el sapo', 'el tritón']
const INVERTEBRADOS = ['la hormiga', 'la abeja', 'la mariposa', 'el mosquito', 'la mariquita', 'la mosca', 'la araña', 'el caracol', 'el cangrejo', 'la medusa', 'la lombriz', 'el pulpo']
const todos = (nombres: string[], grupo: string) => Object.fromEntries(nombres.map((n) => [n, grupo]))

describe('Hechos de «Vertebrados e invertebrados»', () => {
  it('cada animal está en su grupo de vertebrados', () => {
    igualQue(unico('vertebrados', 'classify').items, {
      ...todos(MAMIFEROS, 'mamiferos'),
      ...todos(AVES, 'aves'),
      ...todos(PECES, 'peces'),
      ...todos(REPTILES, 'reptiles'),
      ...todos(ANFIBIOS, 'anfibios'),
    })
  })

  it('los grupos de vertebrados son cinco y se llaman como el libro', () => {
    const grupos = unico('vertebrados', 'classify').groups
    expect(grupos.map((g) => g.label)).toEqual(['mamíferos', 'aves', 'peces', 'reptiles', 'anfibios'])
    expect(grupos.map((g) => g.id)).toEqual(['mamiferos', 'aves', 'peces', 'reptiles', 'anfibios'])
  })

  it('vertebrado o invertebrado: los cinco grupos son vertebrados y el resto no tiene huesos', () => {
    igualQue(unico('vertebrados', 'pick-member').items, {
      ...todos([...MAMIFEROS, ...AVES, ...PECES, ...REPTILES, ...ANFIBIOS], 'vertebrado'),
      ...todos(INVERTEBRADOS, 'invertebrado'),
    })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('vertebrados', {
      '¿Qué tienen los vertebrados dentro del cuerpo?': 'un esqueleto de huesos',
      '¿Cuántos grupos de vertebrados hay?': 'cinco',
      'Los invertebrados…': 'no tienen esqueleto de huesos',
      '¿Cuál de estos grupos es de vertebrados?': 'los peces',
      '¿Cómo se llaman los huesos de la columna vertebral?': 'vértebras',
    })
  })
})

describe('Hechos de «Mamíferos y aves»', () => {
  it('cada característica es de mamíferos o de aves', () => {
    igualQue(unico('mamiferos-aves', 'pick-member').items, {
      'tiene pelo': 'mamifero',
      'sus crías maman': 'mamifero',
      'nace del vientre de su madre': 'mamifero',
      'es un animal vivíparo': 'mamifero',
      'tiene plumas': 'ave',
      'tiene pico': 'ave',
      'nace de un huevo': 'ave',
      'es un animal ovíparo': 'ave',
    })
  })

  it('cada animal es mamífero o ave (el murciélago y el delfín son mamíferos; el pingüino y el avestruz, aves)', () => {
    igualQue(unico('mamiferos-aves', 'pick-member', 1).items, { ...todos(MAMIFEROS, 'mamifero'), ...todos(AVES, 'ave') })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('mamiferos-aves', {
      '¿Qué es un animal vivíparo?': 'el que nace del vientre de su madre',
      '¿Qué es un animal ovíparo?': 'el que nace de un huevo',
      '¿De qué se alimentan las crías de los mamíferos al principio?': 'de la leche de su madre',
      '¿Qué mamífero tiene alas?': 'el murciélago',
      '¿Qué mamífero vive en el agua y tiene aletas?': 'el delfín',
      'El pingüino es un ave que…': 'no vuela y nada muy bien',
      '¿Cuántas patas tienen las aves?': 'dos',
      'El avestruz es un ave que…': 'no puede volar',
    })
  })
})

describe('Hechos de «Peces, reptiles y anfibios»', () => {
  it('cada animal está en su grupo', () => {
    igualQue(unico('peces-reptiles-anfibios', 'classify').items, {
      ...todos(PECES, 'peces'),
      ...todos(REPTILES, 'reptiles'),
      ...todos(ANFIBIOS, 'anfibios'),
    })
    expect(unico('peces-reptiles-anfibios', 'pick-member').items).toBe(unico('peces-reptiles-anfibios', 'classify').items)
  })

  it('el ciclo de la rana va del huevo a la rana adulta', () => {
    expect(unico('peces-reptiles-anfibios', 'sequence').steps).toEqual(['un huevo', 'un renacuajo', 'una rana con patas', 'una rana adulta'])
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('peces-reptiles-anfibios', {
      '¿Cómo respiran los peces?': 'con branquias',
      '¿Qué cubre el cuerpo de los peces?': 'escamas',
      '¿Qué tienen los peces en lugar de patas?': 'aletas',
      '¿Cómo es la piel de los anfibios?': 'desnuda y húmeda',
      '¿Qué anfibio tiene cola?': 'la salamandra',
      '¿Dónde viven las crías de las ranas?': 'en el agua',
      '¿Cómo se llaman las crías de la rana?': 'renacuajos',
      '¿Qué reptil no tiene patas?': 'la serpiente',
      '¿Qué reptil tiene caparazón?': 'la tortuga',
    })
  })
})

describe('Hechos de «Los invertebrados»', () => {
  it('insectos y animales que no lo son', () => {
    igualQue(unico('invertebrados', 'pick-member').items, {
      'la hormiga': 'insecto',
      'la abeja': 'insecto',
      'la mariposa': 'insecto',
      'el mosquito': 'insecto',
      'la mariquita': 'insecto',
      'la mosca': 'insecto',
      'la araña': 'noinsecto',
      'el caracol': 'noinsecto',
      'el cangrejo': 'noinsecto',
      'la medusa': 'noinsecto',
      'la lombriz': 'noinsecto',
      'el pulpo': 'noinsecto',
    })
  })

  it('qué invertebrados viven en el agua y cuáles no', () => {
    igualQue(unico('invertebrados', 'pick-member', 1).items, {
      'la medusa': 'agua',
      'el pulpo': 'agua',
      'el cangrejo de mar': 'agua',
      'el calamar': 'agua',
      'el mejillón': 'agua',
      'la lombriz': 'fuera',
      'la hormiga': 'fuera',
      'el caracol de jardín': 'fuera',
      'la abeja': 'fuera',
      'la mariposa': 'fuera',
    })
  })

  it('el ciclo de la mariposa va del huevo a la mariposa', () => {
    expect(unico('invertebrados', 'sequence').steps).toEqual(['un huevo', 'una oruga', 'un capullo', 'una mariposa'])
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('invertebrados', {
      '¿Cuántas patas tiene un insecto?': 'seis',
      '¿Cuántas patas tiene una araña?': 'ocho',
      '¿Cuántas antenas tiene un insecto?': 'dos',
      '¿La araña es un insecto?': 'no, tiene ocho patas',
      '¿Qué tienen casi todos los insectos adultos?': 'alas',
      '¿Qué invertebrado tiene el cuerpo blando como gelatina y tentáculos?': 'la medusa',
      '¿Qué invertebrado lleva concha?': 'el caracol',
      '¿Qué invertebrado tiene pinzas?': 'el cangrejo',
    })
  })
})

describe('Hechos de «¿Dónde viven los animales?»', () => {
  it('cada animal vive en su hábitat', () => {
    igualQue(unico('habitat', 'classify').items, {
      'la ballena': 'mar',
      'el tiburón': 'mar',
      'el pez payaso': 'mar',
      'el pulpo': 'mar',
      'la trucha': 'rio',
      'la nutria': 'rio',
      'el castor': 'rio',
      'la rana': 'rio',
      'el camello': 'desierto',
      'el dromedario': 'desierto',
      'el pingüino': 'polo',
      'el oso polar': 'polo',
      'la morsa': 'polo',
      'el ciervo': 'bosque',
      'el jabalí': 'bosque',
      'la ardilla': 'bosque',
      'el lobo': 'bosque',
      'el loro': 'selva',
      'el perezoso': 'selva',
      'el tucán': 'selva',
    })
    expect(unico('habitat', 'classify').groups.map((g) => g.id)).toEqual(['mar', 'rio', 'desierto', 'polo', 'bosque', 'selva'])
  })

  it('cada animal tiene su adaptación', () => {
    const filas: PairRow[] = unico('habitat', 'pairs').rows
    expect(Object.fromEntries(filas.map((f) => [f.answerBack, f.answer]))).toEqual({
      'el pez': 'con las branquias',
      'el oso polar': 'su pelo grueso',
      'el erizo': 'con sus púas',
      'el conejo': 'para oír bien los peligros',
      'la cabra montés': 'con sus patas fuertes y pezuñas',
      'el camello': 'reservas de grasa',
    })
    const [pez, oso, erizo, conejo, cabra, camello] = filas
    expect(pez.ask).toMatch(/respira el pez/)
    expect(oso.ask).toMatch(/oso polar/)
    expect(erizo.ask).toMatch(/erizo/)
    expect(conejo.ask).toMatch(/conejo/)
    expect(cabra.ask).toMatch(/cabra montés/)
    expect(camello.ask).toMatch(/camello/)
    expect(pez.askBack).toMatch(/branquias/)
    expect(oso.askBack).toMatch(/frío/)
    expect(erizo.askBack).toMatch(/púas/)
    expect(conejo.askBack).toMatch(/orejas/)
    expect(cabra.askBack).toMatch(/pezuñas/)
    expect(camello.askBack).toMatch(/joroba/)
  })

  it('qué come cada animal: herbívoro, carnívoro u omnívoro', () => {
    const verdad = {
      'el conejo': 'herbivoro',
      'la vaca': 'herbivoro',
      'el caballo': 'herbivoro',
      'la oveja': 'herbivoro',
      'el león': 'carnivoro',
      'el lobo': 'carnivoro',
      'el águila': 'carnivoro',
      'el búho': 'carnivoro',
      'el tiburón': 'carnivoro',
      'el oso pardo': 'omnivoro',
      'el jabalí': 'omnivoro',
      'el cerdo': 'omnivoro',
      'la gallina': 'omnivoro',
    }
    const comer = unico('habitat', 'classify', 1)
    igualQue(comer.items, verdad)
    expect(comer.groups.map((g) => g.label)).toEqual(['herbívoro', 'carnívoro', 'omnívoro'])
    expect(unico('habitat', 'pick-member').items).toBe(comer.items)
  })

  it('la cadena de alimentos va de la hierba al conejo y al lobo', () => {
    expect(unico('habitat', 'sequence').steps).toEqual(['la hierba', 'un conejo', 'un lobo'])
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('habitat', {
      '¿Cómo se llama el lugar donde vive un animal?': 'su hábitat',
      '¿Qué hacen los animales en su hábitat?': 'comen, se refugian y tienen crías',
      '¿Cómo se llama el animal que come solo plantas?': 'herbívoro',
      '¿Cómo se llama el animal que come otros animales?': 'carnívoro',
      '¿Cómo se llama el animal que come plantas y animales?': 'omnívoro',
      '¿Cómo se llaman los animales que viven en el agua?': 'los acuáticos',
      'Los animales terrestres viven…': 'en la tierra',
    })
  })
})

describe('Respuestas equivocadas de los hechos sueltos', () => {
  const hechos = temasUnidad2.flatMap((t) => facts(t.id))

  it('cada hecho tiene al menos tres respuestas equivocadas, distintas entre sí y de la correcta', () => {
    expect(hechos.length).toBeGreaterThanOrEqual(35)
    for (const item of hechos) {
      expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
      expect(new Set(item.wrong).size, item.question).toBe(item.wrong.length)
      expect(item.wrong, item.question).not.toContain(item.answer)
    }
  })

  it('no hay dos preguntas iguales en toda la unidad', () => {
    const preguntas = hechos.map((i) => i.question)
    expect(new Set(preguntas).size).toBe(preguntas.length)
  })
})

// ── utilidades ────────────────────────────────────────────────────────────────────────────────────────────────────────
function facts(tema: string): FactItem[] {
  return bloques(tema, 'facts').flatMap((b) => b.items)
}

function compruebaHechos(tema: string, esperados: Record<string, string>) {
  const presentes = Object.fromEntries(facts(tema).map((i) => [i.question, i.answer]))
  for (const [pregunta, respuesta] of Object.entries(esperados)) {
    expect(presentes[pregunta], `falta o está mal «${pregunta}»`).toBe(respuesta)
  }
  expect(Object.keys(presentes).sort(), `hay preguntas del tema ${tema} sin comprobar`).toEqual(Object.keys(esperados).sort())
}
