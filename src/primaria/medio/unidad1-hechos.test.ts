import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem, Member, PairRow } from '../../types'
import { temasUnidad1 } from './unidad1'

// Tablas de verdad escritas aquí por separado (y contrastadas con lo que enseña el libro): comparan las tablas del contenido
// con lo que se sabe, para que un cambio en el contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad1.find((x) => x.id === tema)!
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
const unico = <K extends BlockSpec['kind']>(tema: string, kind: K, i = 0): Tipo<K> => bloques(tema, kind)[i]

// Una tabla de elementos y sus categorías, comparada con la independiente (mismo contenido, sin faltar ni sobrar nada)
function igualQue(items: Member[], verdad: Record<string, string>, clave: (m: Member) => string = (m) => m.label) {
  expect(Object.fromEntries(items.map((m) => [clave(m), m.group]))).toEqual(verdad)
}

describe('Hechos de «Nuestro cuerpo cambia»', () => {
  it('las etapas van en este orden: infancia, adolescencia, edad adulta y ancianidad', () => {
    expect(unico('cambiamos', 'sequence').steps).toEqual(['la infancia', 'la adolescencia', 'la edad adulta', 'la ancianidad'])
  })

  it('al crecer cambian la altura, el pie, la voz, los dientes y el peso; no cambia el color de los ojos, ni cuándo ni dónde nacimos', () => {
    igualQue(unico('cambiamos', 'pick-member').items, {
      'la altura': 'cambia',
      'el número de pie': 'cambia',
      'la voz': 'cambia',
      'los dientes': 'cambia',
      'el peso': 'cambia',
      'el color de los ojos': 'nocambia',
      'el día en que nacimos': 'nocambia',
      'el lugar donde nacimos': 'nocambia',
    })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('cambiamos', {
      '¿Qué hace nuestro cuerpo desde que nacemos?': 'crece y se hace más fuerte',
      '¿Qué pasa cuando llegamos a la edad adulta?': 'dejamos de crecer',
      '¿Tenemos dientes cuando nacemos?': 'no',
      '¿Cómo se llaman los primeros dientes?': 'dientes de leche',
      '¿Cómo se llaman los dientes que salen cuando se caen los de leche?': 'dientes definitivos',
      '¿Qué ocurre primero en la vida de una persona?': 'nacemos',
      '¿Quién es más pequeño?': '👶 un bebé',
      '¿Quién ha vivido más años?': '🧓 una persona mayor',
      'Un niño de 7 años está en la etapa de…': 'la infancia',
      'Las personas muy mayores están en la etapa de…': 'la ancianidad',
    })
  })
})

describe('Hechos de «¿Cómo funciona nuestro cuerpo?»', () => {
  it('cada sentido tiene su órgano', () => {
    const filas: PairRow[] = unico('funciones', 'pairs').rows
    expect(Object.fromEntries(filas.map((f) => [f.answerBack, f.answer]))).toEqual({
      'la vista': 'con los ojos',
      'el oído': 'con los oídos',
      'el olfato': 'con la nariz',
      'el gusto': 'con la lengua',
      'el tacto': 'con la piel',
    })
  })

  it('las preguntas de pares nombran el órgano y el sentido que dicen sus respuestas', () => {
    const [ojos, oidos, nariz, lengua, piel] = unico('funciones', 'pairs').rows
    expect(ojos.askBack).toMatch(/ojos/)
    expect(oidos.askBack).toMatch(/oídos/)
    expect(nariz.askBack).toMatch(/nariz/)
    expect(lengua.askBack).toMatch(/lengua/)
    expect(piel.askBack).toMatch(/piel/)
    expect(ojos.ask).toMatch(/vemos/)
    expect(oidos.ask).toMatch(/oímos/)
    expect(nariz.ask).toMatch(/olemos/)
    expect(lengua.ask).toMatch(/sabores/)
    expect(piel.ask).toMatch(/suave o áspero/)
  })

  it('cada acción usa su sentido', () => {
    igualQue(bloques('funciones', 'classify')[0].items, {
      'miramos un dibujo': 'vista',
      'vemos una película': 'vista',
      'leemos un cuento': 'vista',
      'escuchamos música': 'oido',
      'oímos el timbre del colegio': 'oido',
      'oímos cantar a un pájaro': 'oido',
      'olemos una flor': 'olfato',
      'olemos el pan recién hecho': 'olfato',
      'olemos un perfume': 'olfato',
      'probamos un helado': 'gusto',
      'probamos una sopa': 'gusto',
      'notamos que un limón es ácido': 'gusto',
      'tocamos la arena': 'tacto',
      'acariciamos a un gato': 'tacto',
      'notamos que el agua está fría': 'tacto',
    })
  })

  it('respirar y comer son nutrición; ver, oír, oler y tocar y reaccionar son relación; tener hijos es reproducción', () => {
    igualQue(bloques('funciones', 'classify')[1].items, {
      'tomamos el desayuno': 'nutricion',
      respiramos: 'nutricion',
      'comemos una manzana': 'nutricion',
      'bebemos agua': 'nutricion',
      'comemos pan': 'nutricion',
      'vemos un semáforo en rojo y paramos': 'relacion',
      'oímos el timbre y salimos al patio': 'relacion',
      'olemos una flor': 'relacion',
      'tocamos algo muy caliente y apartamos la mano': 'relacion',
      'probamos un caramelo y notamos que es dulce': 'relacion',
      'una pareja de personas adultas tiene un bebé': 'reproduccion',
      'una persona adulta tiene una hija': 'reproduccion',
      'una pareja de personas adultas tiene un hijo': 'reproduccion',
    })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('funciones', {
      '¿Cuántos sentidos tenemos?': 'cinco',
      '¿Cuántas funciones vitales realizan las personas?': 'tres',
      '¿Cuál de estas es una función vital?': 'la nutrición',
      'En la función de relación…': 'conocemos lo que nos rodea y reaccionamos',
      'En la función de nutrición…': 'respiramos y nos alimentamos',
      '¿Qué función permite que las personas adultas tengan hijos o hijas?': 'la reproducción',
      'Los órganos de los sentidos nos sirven para…': 'conocer lo que pasa a nuestro alrededor',
    })
  })
})

describe('Hechos de «¿Cómo nos movemos?»', () => {
  it('cada parte es del tipo que le corresponde: hueso, articulación o músculo', () => {
    igualQue(unico('movimiento', 'classify').items, {
      'el cráneo': 'hueso',
      'las costillas': 'hueso',
      'la columna vertebral': 'hueso',
      'el fémur': 'hueso',
      'la tibia': 'hueso',
      'el hombro': 'articulacion',
      'el codo': 'articulacion',
      'la muñeca': 'articulacion',
      'la rodilla': 'articulacion',
      'el tobillo': 'articulacion',
      'el bíceps': 'musculo',
      'el pectoral': 'musculo',
      'los abdominales': 'musculo',
      'el glúteo': 'musculo',
      'los gemelos': 'musculo',
    })
  })

  it('las dos formas de preguntar usan la misma tabla y los elementos en plural van marcados', () => {
    expect(unico('movimiento', 'pick-member').items).toBe(unico('movimiento', 'classify').items)
    const plurales = unico('movimiento', 'classify').items.filter((m) => m.plural).map((m) => m.label)
    expect(plurales.sort()).toEqual(['las costillas', 'los abdominales', 'los gemelos'])
  })

  it('las preguntas por tipo dicen el tipo correcto', () => {
    const grupos = unico('movimiento', 'pick-member').groups
    expect(grupos.find((g) => g.id === 'hueso')!.question).toMatch(/es un hueso\?$/)
    expect(grupos.find((g) => g.id === 'articulacion')!.question).toMatch(/es una articulación\?$/)
    expect(grupos.find((g) => g.id === 'musculo')!.question).toMatch(/es un músculo\?$/)
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('movimiento', {
      '¿Cómo se llama el conjunto de todos los huesos del cuerpo?': 'el esqueleto',
      '¿Cómo son los huesos?': 'duros y rígidos',
      '¿Cómo son los músculos?': 'blandos y elásticos',
      '¿Dónde están los huesos?': 'dentro del cuerpo',
      '¿Dónde están los músculos?': 'debajo de la piel',
      '¿Qué une los huesos entre sí?': 'las articulaciones',
      '¿Para qué sirven las articulaciones?': 'para doblar partes del cuerpo',
      '¿Qué hacen los músculos sin romperse?': 'se estiran y se encogen',
      '¿Qué trabaja junto con los huesos para que nos movamos?': 'los músculos',
      '¿Qué pasa con los músculos cuanto más los usamos?': 'son más fuertes',
      '¿Qué nos ayuda a tener huesos y músculos sanos?': 'hacer ejercicio',
      '¿Cuál de estos objetos es elástico como un músculo?': '🎈 un globo',
    })
  })
})

describe('Hechos de «Necesitamos respirar»', () => {
  it('el camino del aire es nariz o boca, tráquea y pulmones, y lo de fuera son órganos de la comida', () => {
    const camino = unico('respirar', 'sequence')
    expect(camino.steps).toEqual(['la nariz o la boca', 'la tráquea', 'los pulmones'])
    expect(camino.extra).toEqual(['el esófago', 'el estómago', 'los intestinos'])
    for (const extra of camino.extra!) expect(camino.steps).not.toContain(extra)
  })

  it('al leer o dibujar la respiración es tranquila y al correr o bailar, acelerada', () => {
    igualQue(unico('respirar', 'pick-member').items, {
      'leemos un cuento': 'tranquila',
      'dibujamos un paisaje': 'tranquila',
      'escuchamos música sentados': 'tranquila',
      'miramos las nubes tumbados': 'tranquila',
      'pintamos con acuarelas': 'tranquila',
      corremos: 'acelerada',
      bailamos: 'acelerada',
      'saltamos a la comba': 'acelerada',
      'jugamos al pilla-pilla': 'acelerada',
      'subimos las escaleras corriendo': 'acelerada',
    })
  })

  it('los hechos sueltos son correctos', () => {
    compruebaHechos('respirar', {
      '¿Para qué respiramos?': 'para obtener aire',
      '¿Cómo se llama el gas del aire que necesitamos para vivir?': 'el oxígeno',
      '¿Por dónde puede entrar el aire en el cuerpo?': 'por la nariz o por la boca',
      '¿Qué órganos absorben el oxígeno?': 'los pulmones',
      '¿Qué hacemos con el aire que queda en los pulmones?': 'lo expulsamos',
      'Inspirar es…': 'tomar aire',
      'Espirar es…': 'expulsar el aire',
      '¿Qué entra en nuestro cuerpo cuando respiramos?': 'aire',
      '¿Qué sale de nuestro cuerpo cuando espiramos?': 'aire',
      'Después de la nariz o la boca, ¿por qué tubo pasa el aire?': 'por la tráquea',
      '¿A dónde llega el aire después de pasar por la tráquea?': 'a los pulmones',
      '¿Cuál es el tubo del aire?': 'la tráquea',
      'Respirar profundamente nos ayuda a…': 'calmarnos',
      'Para respirar profundo, ¿por dónde tomamos el aire?': 'por la nariz',
      'Al espirar, ¿por dónde sacamos el aire poco a poco?': 'por la boca',
      'Cuando estamos tranquilos, respiramos…': 'despacio',
    })
  })

  it('«la boca» nunca es una respuesta equivocada al preguntar por dónde entra el aire (entra por la nariz o por la boca)', () => {
    for (const item of facts('respirar')) {
      if (/entrar|entra el aire|tomamos el aire/.test(item.question)) {
        for (const mala of item.wrong) expect(mala, item.question).not.toMatch(/boca/)
      }
    }
  })

  it('la tráquea es el tubo del aire y el esófago el de la comida: no se confunden', () => {
    for (const item of [...facts('respirar'), ...facts('alimentacion')]) {
      if (/\btubo\b/.test(item.question)) {
        const aire = /aire/.test(item.question)
        expect(item.answer, item.question).toMatch(aire ? /tráquea/ : /esófago/)
      }
    }
  })
})

describe('Hechos de «¿Cómo nos alimentamos?»', () => {
  it('el camino de los alimentos es boca, esófago, estómago, intestinos y ano, y lo de fuera son órganos del aire', () => {
    const camino = unico('alimentacion', 'sequence')
    expect(camino.steps).toEqual(['la boca', 'el esófago', 'el estómago', 'los intestinos', 'el ano'])
    expect(camino.extra).toEqual(['la tráquea', 'los pulmones'])
    for (const extra of camino.extra!) expect(camino.steps).not.toContain(extra)
  })

  it('cada alimento está en su grupo: frutas y verduras (vitaminas y fibra); pan, pasta y patatas (energía); lácteos, huevos, pescado y carne (crecer)', () => {
    const verdad: Record<string, string> = {
      '🥕': 'vitaminas', '🍎': 'vitaminas', '🍌': 'vitaminas', '🍊': 'vitaminas', '🥦': 'vitaminas', '🍅': 'vitaminas',
      '🥬': 'vitaminas', '🍉': 'vitaminas', '🥝': 'vitaminas', '🍍': 'vitaminas', '🍐': 'vitaminas', '🥒': 'vitaminas',
      '🍓': 'vitaminas', '🍇': 'vitaminas',
      '🍞': 'energia', '🍝': 'energia', '🥔': 'energia',
      '🥛': 'crecer', '🐟': 'crecer', '🍗': 'crecer', '🧀': 'crecer', '🥩': 'crecer', '🥚': 'crecer',
    }
    const clasificar = unico('alimentacion', 'classify')
    igualQue(clasificar.items, verdad, (m) => m.emoji!)
    expect(unico('alimentacion', 'pick-member').items).toBe(clasificar.items)
  })

  it('los grupos se llaman y se preguntan como el libro', () => {
    const grupos = unico('alimentacion', 'classify').groups
    expect(grupos.map((g) => g.label)).toEqual(['para tener vitaminas y fibra', 'para tener energía', 'para crecer'])
    expect(grupos.map((g) => g.id)).toEqual(['vitaminas', 'energia', 'crecer'])
  })

  it('los hechos sueltos de la digestión son correctos', () => {
    compruebaHechos('alimentacion', {
      '¿Por dónde entra la comida a nuestro cuerpo?': 'por la boca',
      '¿Para qué sirven los dientes al comer?': 'para triturar la comida',
      '¿Con qué masticamos la comida?': 'con los dientes',
      '¿Dónde se deshace la comida?': 'en el estómago',
      '¿Dónde pasan al cuerpo las sustancias que necesitamos de la comida?': 'en los intestinos',
      '¿Por dónde salen los restos que el cuerpo no aprovecha?': 'por el ano',
      '¿Cómo se llama el proceso en el que la comida se transforma en nutrientes?': 'la digestión',
      'Después de la boca, ¿por qué tubo pasa la comida?': 'por el esófago',
      '¿Qué ocurre primero con la comida?': 'la masticamos con los dientes',
      '¿Qué bebida es mejor para tomar todos los días?': '💧 el agua',
      'Para alimentarnos bien, ¿qué tenemos que comer?': 'alimentos de todos los grupos',
      '¿Cuál es una buena merienda?': '🍎 una pieza de fruta',
      '¿Qué menú es más variado?': 'pasta con pollo y una manzana',
      'Este menú solo tiene pan, pasta y patatas. ¿Qué podemos añadir para que sea más sano?': 'fruta o verdura',
    })
  })

  it('la tráquea solo sale como respuesta equivocada y para la comida (nunca de respuesta)', () => {
    for (const item of facts('alimentacion')) expect(item.answer).not.toMatch(/tráquea|pulmones/)
  })
})

describe('Respuestas equivocadas de los hechos sueltos', () => {
  const todos = temasUnidad1.flatMap((t) => facts(t.id))

  it('cada hecho tiene al menos tres respuestas equivocadas, distintas entre sí y de la correcta', () => {
    expect(todos.length).toBeGreaterThanOrEqual(55)
    for (const item of todos) {
      expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
      expect(new Set(item.wrong).size, item.question).toBe(item.wrong.length)
      expect(item.wrong, item.question).not.toContain(item.answer)
    }
  })

  it('no hay dos preguntas iguales en toda la unidad', () => {
    const preguntas = todos.map((i) => i.question)
    expect(new Set(preguntas).size).toBe(preguntas.length)
  })
})

// ── utilidades ────────────────────────────────────────────────────────────────────────────────────────────────────────
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
