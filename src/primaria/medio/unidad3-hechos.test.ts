import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem, Member, PairRow } from '../../types'
import { temasUnidad3 } from './unidad3'

// Tablas de verdad escritas aquí por separado: comparan las tablas del contenido con lo que se sabe de las plantas, para que
// un cambio en el contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad3.find((x) => x.id === tema)!
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
const unico = <K extends BlockSpec['kind']>(tema: string, kind: K, i = 0): Tipo<K> => bloques(tema, kind)[i]

function igualQue(items: Member[], verdad: Record<string, string>) {
  expect(Object.fromEntries(items.map((m) => [m.label, m.group]))).toEqual(verdad)
}

describe('Hechos de «¿Qué tienen las plantas en común?»', () => {
  it('cada parte de la planta tiene su función', () => {
    const filas: PairRow[] = unico('comun', 'pairs').rows
    expect(Object.fromEntries(filas.map((f) => [f.answerBack, f.answer]))).toEqual({
      'las raíces': 'para sujetar la planta al suelo y absorber agua',
      'el tallo': 'para sostener la planta y repartir el agua y el alimento',
      'las hojas': 'para captar la luz y el aire y fabricar alimento',
      'los frutos': 'para guardar las semillas',
      'las flores': 'para que se formen los frutos',
    })
    const [raices, tallo, hojas, frutos, flores] = filas
    expect(raices.ask).toMatch(/raíces/)
    expect(tallo.ask).toMatch(/tallo/)
    expect(hojas.ask).toMatch(/hojas/)
    expect(frutos.ask).toMatch(/frutos/)
    expect(flores.ask).toMatch(/flores/)
    expect(raices.askBack).toMatch(/suelo/)
    expect(tallo.askBack).toMatch(/sostiene/)
    expect(hojas.askBack).toMatch(/luz/)
    expect(frutos.askBack).toMatch(/semillas/)
    expect(flores.askBack).toMatch(/frutos/)
  })

  it('qué necesita una planta para vivir y qué no', () => {
    igualQue(unico('comun', 'pick-member').items, {
      agua: 'necesita',
      'luz del sol': 'necesita',
      aire: 'necesita',
      'sustancias de la tierra': 'necesita',
      'un abrigo': 'no',
      'una cama': 'no',
      'una bicicleta': 'no',
      'un televisor': 'no',
    })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('comun', {
      '¿Las plantas son seres vivos?': 'sí, nacen, crecen y se reproducen',
      'Las plantas viven…': 'fijas al suelo',
      '¿Cómo se llama el proceso con el que las plantas fabrican su alimento?': 'fotosíntesis',
      '¿De qué color son las partes de la planta que fabrican el alimento?': 'verdes',
      '¿Qué recibe la planta del sol?': 'luz',
      '¿Qué contienen los frutos?': 'las semillas',
      '¿Qué toman las raíces del suelo?': 'agua y sustancias',
      '¿Qué tienen en común todas las plantas?': 'son seres vivos',
      'Las plantas necesitan agua, aire, luz del sol y…': 'sustancias de la tierra',
      '¿Qué reparte el tallo por la planta?': 'agua y alimento',
    })
  })
})

describe('Hechos de «¿Cómo clasificamos las plantas?»', () => {
  it('cada planta tiene su tipo de tallo', () => {
    igualQue(unico('clasificar', 'classify').items, {
      'la encina': 'arbol',
      'el olivo': 'arbol',
      'el castaño': 'arbol',
      'el roble': 'arbol',
      'el pino': 'arbol',
      'la lila': 'arbusto',
      'el rosal': 'arbusto',
      'el romero': 'arbusto',
      'el boj': 'arbusto',
      'la amapola': 'hierba',
      'la margarita': 'hierba',
      'el trébol': 'hierba',
      'el diente de león': 'hierba',
    })
    expect(unico('clasificar', 'classify').groups.map((g) => g.label)).toEqual(['árbol', 'arbusto', 'hierba'])
  })

  it('hoja perenne o caduca', () => {
    igualQue(unico('clasificar', 'pick-member').items, {
      'el pino': 'perenne',
      'la encina': 'perenne',
      'el olivo': 'perenne',
      'el abeto': 'perenne',
      'el roble': 'caduca',
      'el castaño': 'caduca',
      'el nogal': 'caduca',
      'el cerezo': 'caduca',
    })
  })

  it('con flor o sin flor: solo el helecho y el musgo no tienen', () => {
    igualQue(unico('clasificar', 'pick-member', 1).items, {
      'el castaño': 'conflor',
      'la lavanda': 'conflor',
      'la violeta': 'conflor',
      'la orquídea': 'conflor',
      'la margarita': 'conflor',
      'la amapola': 'conflor',
      'el rosal': 'conflor',
      'el helecho': 'sinflor',
      'el musgo': 'sinflor',
    })
  })

  it('qué hace el roble en cada estación', () => {
    const filas: PairRow[] = unico('clasificar', 'pairs').rows
    expect(Object.fromEntries(filas.map((f) => [f.answerBack, f.answer]))).toEqual({
      'en primavera': 'le salen hojas nuevas',
      'en verano': 'tiene muchas hojas verdes',
      'en otoño': 'las hojas cambian de color y caen',
      'en invierno': 'se queda sin hojas',
    })
    const [primavera, verano, otono, invierno] = filas
    expect(primavera.ask).toMatch(/primavera/)
    expect(verano.ask).toMatch(/verano/)
    expect(otono.ask).toMatch(/otoño/)
    expect(invierno.ask).toMatch(/invierno/)
    expect(primavera.askBack).toMatch(/nuevas/)
    expect(verano.askBack).toMatch(/verdes/)
    expect(otono.askBack).toMatch(/caen/)
    expect(invierno.askBack).toMatch(/sin hojas/)
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('clasificar', {
      '¿Cómo es el tronco de un árbol?': 'grueso y alto',
      '¿Cómo es el tallo de una hierba?': 'fino, flexible y verde',
      '¿Cómo es el tallo de un arbusto?': 'fino y duro',
      '¿Qué planta es más alta?': 'el árbol',
      'Las plantas de hoja perenne…': 'tienen hojas todo el año',
      'Las plantas de hoja caduca…': 'pierden las hojas en otoño',
      '¿Qué plantas no tienen flores?': 'los helechos y los musgos',
    })
  })
})

describe('Hechos de «Las plantas se reproducen»', () => {
  it('la vida de una planta con semillas va de la semilla al fruto con semillas', () => {
    expect(unico('reproduccion', 'sequence').steps).toEqual(['una semilla', 'un brote', 'una planta con flores', 'un fruto con semillas'])
  })

  it('semillas o esporas', () => {
    igualQue(unico('reproduccion', 'pick-member').items, {
      'el castaño': 'semillas',
      'el rosal': 'semillas',
      'la margarita': 'semillas',
      'la amapola': 'semillas',
      'la lavanda': 'semillas',
      'la violeta': 'semillas',
      'el helecho': 'esporas',
      'el musgo': 'esporas',
    })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('reproduccion', {
      '¿Qué necesita una semilla para germinar?': 'agua y calor',
      '¿Qué sale de la semilla cuando germina?': 'una nueva planta',
      '¿Qué llevan el viento y los insectos de una flor a otra?': 'el polen',
      '¿En qué se convierten la mayoría de las flores?': 'en frutos',
      '¿Dónde están las semillas?': 'dentro de los frutos',
      '¿Cómo se reproducen los helechos?': 'con esporas',
      '¿Tienen semillas los musgos?': 'no, se reproducen por esporas',
      '¿Qué hace la semilla al caer al suelo húmedo?': 'germina',
    })
  })
})

describe('Hechos de «¿Por qué son importantes las plantas?»', () => {
  it('para qué sirve cada producto de las plantas', () => {
    igualQue(unico('importancia', 'classify').items, {
      'la manzana': 'comer',
      'la lechuga': 'comer',
      'la zanahoria': 'comer',
      'el tomate': 'comer',
      'la naranja': 'comer',
      'la fresa': 'comer',
      'la madera del roble': 'muebles',
      'la madera del pino': 'muebles',
      'la madera del castaño': 'muebles',
      'el algodón': 'telas',
      'el lino': 'telas',
    })
  })

  it('plantas silvestres y cultivadas', () => {
    igualQue(unico('importancia', 'pick-member').items, {
      'el roble del bosque': 'silvestre',
      'la amapola del campo': 'silvestre',
      'el helecho del bosque': 'silvestre',
      'la encina del monte': 'silvestre',
      'el tomate de la huerta': 'cultivada',
      'el trigo del campo': 'cultivada',
      'la lechuga de la huerta': 'cultivada',
      'el naranjo del huerto': 'cultivada',
    })
  })

  it('las tareas del agricultor van en este orden: sembrar, regar y recoger', () => {
    expect(unico('importancia', 'sequence').steps).toEqual(['preparar la tierra y sembrar', 'regar y cuidar las plantas', 'recoger la cosecha'])
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('importancia', {
      '¿Qué gas respiramos que nos dan las plantas?': 'oxígeno',
      'Las plantas silvestres…': 'crecen solas en la naturaleza',
      'Las plantas cultivadas…': 'las siembran y cuidan las personas',
      '¿Qué dan los árboles a muchos animales?': 'refugio',
      '¿Qué persona cuida las plantas del campo?': 'el agricultor',
      '¿Qué podemos hacer con la madera de los árboles?': 'muebles',
      '¿Qué nos dan las plantas?': 'alimento, refugio, materiales y oxígeno',
      '¿Qué ayudan a limpiar las plantas?': 'el aire',
      '¿Qué hace falta para que una planta cultivada crezca sana?': 'regarla y cuidarla',
    })
  })
})

describe('Respuestas equivocadas de los hechos sueltos', () => {
  const hechos = temasUnidad3.flatMap((t) => facts(t.id))

  it('cada hecho tiene al menos tres respuestas equivocadas, distintas entre sí y de la correcta', () => {
    expect(hechos.length).toBeGreaterThanOrEqual(30)
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
