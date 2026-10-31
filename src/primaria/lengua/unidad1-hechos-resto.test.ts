import { describe, expect, it } from 'vitest'
import type { BlockSpec, FactItem } from '../../types'
import { temasUnidad1 } from './unidad1'

// Tablas de verdad escritas aquí por separado (ver unidad1-hechos.test.ts): comparan las tablas del contenido con lo que se
// sabe, para que un cambio en el contenido no pueda dar por buena una respuesta equivocada.

type Tipo<K extends BlockSpec['kind']> = Extract<BlockSpec, { kind: K }>
function bloques<K extends BlockSpec['kind']>(tema: string, kind: K): Tipo<K>[] {
  const t = temasUnidad1.find((x) => x.id === tema)
  if (!t) throw new Error(`no existe el tema ${tema}`)
  return t.plan.map((b) => b.spec).filter((s): s is Tipo<K> => s.kind === kind)
}
const facts = (tema: string, i = 0): FactItem[] => bloques(tema, 'facts')[i].items

function compruebaHechos(items: FactItem[], esperados: Record<string, string>) {
  const presentes = Object.fromEntries(items.map((i) => [i.question, i.answer]))
  for (const [pregunta, respuesta] of Object.entries(esperados)) {
    expect(presentes[pregunta], `falta o está mal «${pregunta}»`).toBe(respuesta)
  }
  expect(Object.keys(presentes).sort(), 'hay preguntas sin comprobar').toEqual(Object.keys(esperados).sort())
}

function compruebaMalas(items: FactItem[]) {
  for (const item of items) {
    expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
    expect(new Set(item.wrong).size, item.question).toBe(item.wrong.length)
    expect(item.wrong, item.question).not.toContain(item.answer)
  }
  const preguntas = items.map((i) => i.question)
  expect(new Set(preguntas).size, 'preguntas repetidas').toBe(preguntas.length)
}

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

describe('La mayúscula', () => {
  it('los nombres de personas, animales y lugares son lo que dice la tabla', () => {
    const [clasifica] = bloques('mayuscula', 'classify')
    const verdad: Record<string, string> = {
      Lucía: 'persona',
      Pablo: 'persona',
      Marta: 'persona',
      Hugo: 'persona',
      Sara: 'persona',
      Álvaro: 'persona',
      Pelusa: 'animal',
      Chispa: 'animal',
      Bigotes: 'animal',
      Copito: 'animal',
      Trueno: 'animal',
      Madrid: 'lugar',
      Francia: 'lugar',
      Italia: 'lugar',
      Sevilla: 'lugar',
      Portugal: 'lugar',
      Toledo: 'lugar',
    }
    expect(Object.fromEntries(clasifica.items.map((m) => [m.label, m.group]))).toEqual(verdad)
    expect(clasifica.groups.map((g) => [g.id, g.label])).toEqual([
      ['persona', 'una persona'],
      ['animal', 'un animal'],
      ['lugar', 'un lugar'],
    ])
    expect(clasifica.question).toContain('{item}')
  })

  it('las reglas son correctas', () => {
    compruebaHechos(facts('mayuscula', 0), {
      '¿Con qué letra empieza una frase?': 'con mayúscula',
      'Después de un punto, ¿cómo empieza la palabra siguiente?': 'con mayúscula',
      '¿Con qué letra empieza el nombre de una persona?': 'con mayúscula',
      '¿Qué palabras empiezan siempre con mayúscula?': 'los nombres de personas, animales y lugares',
      '¿Qué palabra es un nombre propio?': 'Madrid',
      '¿Qué palabra es el nombre propio de una persona?': 'Marta',
      '¿Cómo se llama el nombre de una persona, un animal o un lugar en concreto?': 'nombre propio',
      '¿Qué palabra es un nombre común?': 'Ciudad',
    })
    compruebaMalas(facts('mayuscula', 0))
  })

  // Comprobador independiente: una frase está bien escrita si cada frase empieza por mayúscula, los nombres propios llevan
  // mayúscula inicial y todas las demás palabras van en minúscula. Debe valer exactamente una de las opciones.
  const PROPIOS = ['Lucía', 'Madrid', 'Rocky', 'Francia', 'Nube', 'Tajo', 'Toledo', 'Pablo', 'Marta', 'Sevilla', 'Segovia']
  function bienEscrita(frase: string): boolean {
    let empieza = true
    for (const palabra of frase.split(' ')) {
      const limpia = palabra.replace(/[.,]/g, '')
      const esPropio = PROPIOS.some((p) => p.toLowerCase() === limpia.toLowerCase())
      const capital = limpia[0] !== limpia[0].toLowerCase()
      if (capital !== (empieza || esPropio)) return false
      if (limpia.slice(1) !== limpia.slice(1).toLowerCase()) return false
      empieza = palabra.endsWith('.')
    }
    return true
  }

  it('el comprobador distingue bien y mal escrito', () => {
    expect(bienEscrita('Mi amiga Lucía vive en Madrid.')).toBe(true)
    expect(bienEscrita('Mi amiga lucía vive en Madrid.')).toBe(false)
    expect(bienEscrita('Mi Amiga Lucía vive en Madrid.')).toBe(false)
    expect(bienEscrita('Hoy llueve. Mañana saldrá el sol.')).toBe(true)
    expect(bienEscrita('Hoy llueve. mañana saldrá el sol.')).toBe(false)
  })

  it('en cada pregunta de frases solo una opción está bien escrita, y todas empiezan por mayúscula', () => {
    const frases = facts('mayuscula', 1)
    expect(frases).toHaveLength(9)
    for (const item of frases) {
      const todas = [item.answer, ...item.wrong]
      expect(todas.filter(bienEscrita), item.question).toEqual([item.answer])
      for (const opcion of todas) expect(opcion[0], `${item.question}: ${opcion}`).toBe(opcion[0].toUpperCase())
      expect(item.question, item.question).toMatch(/^¿Qué frase está bien escrita sobre /)
    }
    compruebaMalas(frases)
  })
})

describe('Describir personas', () => {
  it('cada palabra describe lo que dice la tabla', () => {
    const [clasifica] = bloques('describir', 'classify')
    const verdad: Record<string, string> = {
      rubio: 'pelo',
      pelirrojo: 'pelo',
      rizado: 'pelo',
      liso: 'pelo',
      canoso: 'pelo',
      azules: 'ojos',
      verdes: 'ojos',
      marrones: 'ojos',
      redondos: 'ojos',
      simpático: 'ser',
      tímido: 'ser',
      generoso: 'ser',
      travieso: 'ser',
      valiente: 'ser',
      cariñoso: 'ser',
      tranquilo: 'ser',
    }
    expect(Object.fromEntries(clasifica.items.map((m) => [m.label, m.group]))).toEqual(verdad)
    expect(clasifica.groups.map((g) => [g.id, g.label])).toEqual([
      ['pelo', 'el pelo'],
      ['ojos', 'los ojos'],
      ['ser', 'la forma de ser'],
    ])
  })

  it('cada palabra de la forma de ser significa lo que dice la tabla, en los dos sentidos', () => {
    const [pares] = bloques('describir', 'pairs')
    const verdad: [string, string][] = [
      ['valiente', 'no tiene miedo'],
      ['generoso', 'comparte lo que tiene'],
      ['tímido', 'le da vergüenza hablar con gente nueva'],
      ['cariñoso', 'da muchos abrazos y besos'],
      ['travieso', 'hace travesuras'],
      ['tranquilo', 'está calmado y sin prisa'],
      ['trabajador', 'se esfuerza mucho'],
      ['simpático', 'es amable y cae bien a todos'],
    ]
    expect(pares.rows.map((f) => [f.answer, f.ask])).toEqual(verdad.map(([p, d]) => [p, `¿Cómo se dice de quien ${d}?`]))
    expect(pares.rows.map((f) => [f.askBack, f.answerBack])).toEqual(verdad.map(([p, d]) => [`¿Qué significa «${p}»?`, `que ${d}`]))
  })

  it('las oraciones sobre cómo es una persona son correctas', () => {
    compruebaHechos(facts('describir'), {
      '¿Qué oración describe cómo es el pelo de una niña?': 'Tiene el pelo largo y rizado.',
      '¿Qué oración describe cómo son los ojos de un niño?': 'Tiene los ojos verdes.',
      '¿Qué oración dice cómo es la forma de ser de una persona?': 'Es generosa y cariñosa.',
      '¿Qué oración da más detalles sobre el gato?': 'El gato negro duerme en el sofá del salón.',
      '¿Qué oración da más detalles sobre el niño?': 'El niño alto y moreno corre por el parque.',
      '¿Qué palabra completa mejor «Mi hermana siempre comparte sus juguetes: es muy ___»?': 'generosa',
      '¿Qué palabra completa mejor «Mi primo no tiene miedo a nada: es muy ___»?': 'valiente',
      '¿Cómo se llama el pelo que no tiene ondas ni rizos?': 'liso',
      '¿Cuál de estas palabras sirve para describir el pelo?': 'pelirrojo',
    })
    compruebaMalas(facts('describir'))
  })
})

describe('Lenguas de España', () => {
  it('las lenguas y los lugares son correctos', () => {
    compruebaHechos(facts('lenguas'), {
      '¿Qué lengua, además del castellano, se habla en Galicia?': 'el gallego',
      '¿Qué lengua, además del castellano, se habla en Cataluña?': 'el catalán',
      '¿Qué lengua, además del castellano, se habla en el País Vasco?': 'el vasco o euskera',
      '¿En qué lugar de España se habla el gallego?': 'en Galicia',
      '¿En qué lugar de España se habla el catalán?': 'en Cataluña',
      '¿En qué lugar de España se habla el vasco?': 'en el País Vasco',
      '¿Cómo se llama también el castellano?': 'el español',
      '¿Qué lengua se habla en casi toda España?': 'el castellano',
      '¿Cómo se comunican con las manos algunas personas sordas?': 'con la lengua de signos',
      '¿Qué lengua se habla en muchos países de América, como México o Argentina?': 'el español',
      '¿Para qué sirve una lengua?': 'para comunicarnos',
    })
    compruebaMalas(facts('lenguas'))
  })

  it('los saludos y las palabras de gracias son de la lengua que dice la tabla, en los dos sentidos', () => {
    const [saludos, gracias] = bloques('lenguas', 'pairs')
    const hola: [string, string][] = [
      ['inglés', 'Hello'],
      ['francés', 'Bonjour'],
      ['italiano', 'Ciao'],
      ['alemán', 'Hallo'],
      ['portugués', 'Olá'],
      ['vasco', 'Kaixo'],
    ]
    const merci: [string, string][] = [
      ['inglés', 'Thank you'],
      ['francés', 'Merci'],
      ['italiano', 'Grazie'],
      ['alemán', 'Danke'],
      ['portugués', 'Obrigado'],
      ['vasco', 'Eskerrik asko'],
      ['catalán', 'Gràcies'],
    ]
    const esperado = (tabla: [string, string][], palabra: string) =>
      tabla.map(([lengua, dicho]) => ({
        ask: `¿Cómo se dice «${palabra}» en ${lengua}?`,
        answer: dicho,
        askBack: `¿En qué lengua se dice «${dicho}»?`,
        answerBack: `en ${lengua}`,
      }))
    const sinEmoji = (rows: Tipo<'pairs'>['rows']) => rows.map(({ ask, answer, askBack, answerBack }) => ({ ask, answer, askBack, answerBack }))
    expect(sinEmoji(saludos.rows)).toEqual(esperado(hola, 'hola'))
    expect(sinEmoji(gracias.rows)).toEqual(esperado(merci, 'gracias'))
    // ningún saludo ni agradecimiento se repite entre tablas ni entre lenguas (la respuesta de otra fila nunca sería también buena)
    const dichos = [...hola, ...merci].map(([, d]) => d)
    expect(new Set(dichos).size).toBe(dichos.length)
  })
})

describe('Abecedario y sílabas', () => {
  const ABECEDARIO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

  it('el abecedario tiene 27 letras en su orden, con la Ñ entre la N y la O', () => {
    const [orden] = bloques('abecedario', 'sequence')
    expect(ABECEDARIO).toHaveLength(27)
    expect(orden.steps).toEqual(ABECEDARIO)
    expect(orden.steps.indexOf('Ñ')).toBe(orden.steps.indexOf('N') + 1)
    expect(orden.steps.indexOf('O')).toBe(orden.steps.indexOf('Ñ') + 1)
    expect(orden.first).toBe('¿Con qué letra empieza el abecedario?')
    expect(orden.last).toBe('¿Con qué letra termina el abecedario?')
    expect(orden.after).toBe('¿Qué letra va justo después de la {step}?')
    expect(orden.before).toBe('¿Qué letra va justo antes de la {step}?')
  })

  it('las vocales son A, E, I, O, U y las consonantes de la tabla no son vocales', () => {
    const [letras] = bloques('abecedario', 'pick-member')
    const vocales = letras.items.filter((m) => m.group === 'vocal').map((m) => m.label)
    const consonantes = letras.items.filter((m) => m.group === 'consonante').map((m) => m.label)
    expect(vocales).toEqual(['A', 'E', 'I', 'O', 'U'])
    expect(consonantes.length).toBeGreaterThanOrEqual(8)
    for (const c of consonantes) {
      expect(ABECEDARIO, c).toContain(c)
      expect(vocales, c).not.toContain(c)
    }
    expect(letras.groups.map((g) => [g.id, g.label, g.question])).toEqual([
      ['vocal', 'una vocal', '¿Cuál de estas letras es una vocal?'],
      ['consonante', 'una consonante', '¿Cuál de estas letras es una consonante?'],
    ])
  })

  // Palabras sin diptongos ni hiatos dudosos, con su separación en sílabas
  const SILABAS: Record<string, string> = {
    sol: 'sol',
    pan: 'pan',
    flor: 'flor',
    tren: 'tren',
    mar: 'mar',
    luz: 'luz',
    casa: 'ca-sa',
    mesa: 'me-sa',
    perro: 'pe-rro',
    gato: 'ga-to',
    libro: 'li-bro',
    silla: 'si-lla',
    lápiz: 'lá-piz',
    ventana: 'ven-ta-na',
    tomate: 'to-ma-te',
    zapato: 'za-pa-to',
    camisa: 'ca-mi-sa',
    maleta: 'ma-le-ta',
    paloma: 'pa-lo-ma',
    galleta: 'ga-lle-ta',
    mariposa: 'ma-ri-po-sa',
    elefante: 'e-le-fan-te',
    calabaza: 'ca-la-ba-za',
    chocolate: 'cho-co-la-te',
    bicicleta: 'bi-ci-cle-ta',
  }
  const cuenta = (n: number) => `${n} ${n === 1 ? 'sílaba' : 'sílabas'}`

  it('las palabras de la tabla se separan como dice la separación, y esta suma las letras de la palabra', () => {
    for (const [palabra, separada] of Object.entries(SILABAS)) expect(separada.replace(/-/g, ''), palabra).toBe(palabra)
  })

  it('cuántas sílabas tiene cada palabra, cómo se separa y qué palabra forman unas sílabas son correctos', () => {
    const items = facts('abecedario')
    const esperados: Record<string, string> = {
      '¿Cuántas letras tiene el abecedario?': '27 letras',
      '¿Cuántas vocales tiene el abecedario?': '5 vocales',
      '¿Qué son la A, la E, la I, la O y la U?': 'las vocales',
      '¿Qué es una sílaba?': 'cada trozo en que se divide una palabra al decirla',
    }
    for (const [palabra, separada] of Object.entries(SILABAS)) {
      esperados[`¿Cuántas sílabas tiene «${palabra}»?`] = cuenta(separada.split('-').length)
    }
    const separables = ['mariposa', 'ventana', 'zapato', 'chocolate', 'camisa', 'galleta']
    for (const palabra of separables) esperados[`¿Cómo se separa en sílabas «${palabra}»?`] = SILABAS[palabra]
    const formables = ['ventana', 'tomate', 'paloma', 'galleta']
    for (const palabra of formables) {
      const trozos = SILABAS[palabra].split('-').reverse()
      esperados[`¿Qué palabra se forma con las sílabas ${trozos.slice(0, -1).map((t) => `«${t}»`).join(', ')} y «${trozos.at(-1)}»?`] = palabra
    }
    compruebaHechos(items, esperados)
    compruebaMalas(items)
  })

  it('las separaciones equivocadas siguen sumando las letras de la palabra pero no son la buena', () => {
    for (const item of facts('abecedario').filter((i) => i.question.startsWith('¿Cómo se separa'))) {
      const palabra = item.question.match(/«(.+)»/)![1]
      for (const mala of item.wrong) {
        expect(mala.replace(/-/g, ''), item.question).toBe(palabra)
        expect(mala, item.question).not.toBe(SILABAS[palabra])
      }
    }
  })

  it('las palabras equivocadas de «qué palabra se forma» no son la palabra', () => {
    for (const item of facts('abecedario').filter((i) => i.question.startsWith('¿Qué palabra se forma'))) {
      expect(item.wrong.length, item.question).toBeGreaterThanOrEqual(3)
      for (const mala of item.wrong) expect(Object.keys(SILABAS), mala).not.toContain(mala)
    }
  })

  it('al contar sílabas, la respuesta no es una de las equivocadas y las equivocadas son otras cantidades', () => {
    for (const item of facts('abecedario').filter((i) => i.question.startsWith('¿Cuántas sílabas'))) {
      for (const mala of item.wrong) expect(mala, item.question).toMatch(/^\d sílabas?$/)
      expect(item.wrong, item.question).not.toContain(item.answer)
    }
  })
})

describe('Palabras que riman', () => {
  // Clave de rima asonante de cada palabra (vocales desde la última sílaba con fuerza), escrita a mano
  const CLAVE: Record<string, string> = {
    gato: 'a-o', pato: 'a-o', plato: 'a-o', zapato: 'a-o',
    casa: 'a-a', masa: 'a-a', brasa: 'a-a', pasa: 'a-a',
    luna: 'u-a', cuna: 'u-a', laguna: 'u-a', aceituna: 'u-a',
    sol: 'o', caracol: 'o', girasol: 'o', farol: 'o',
    tren: 'e', andén: 'e', también: 'e', sartén: 'e',
    pelo: 'e-o', cielo: 'e-o', hielo: 'e-o', vuelo: 'e-o',
    boca: 'o-a', loca: 'o-a', roca: 'o-a', foca: 'o-a',
    moto: 'o-o', foto: 'o-o', roto: 'o-o', voto: 'o-o',
    bote: 'o-e', lote: 'o-e', trote: 'o-e', pote: 'o-e',
    pan: 'a', volcán: 'a', capitán: 'a', plan: 'a',
    rosa: 'o-a', mariposa: 'o-a', pelota: 'o-a', bota: 'o-a',
    corazón: 'o', canción: 'o', ratón: 'o', camión: 'o',
    amarillo: 'i-o', castillo: 'i-o',
    estrella: 'e-a', botella: 'e-a',
    jardín: 'i', delfín: 'i',
    volar: 'a', mar: 'a',
  }
  const clave = (palabra: string) => {
    expect(CLAVE[palabra], `falta la clave de «${palabra}»`).toBeDefined()
    return CLAVE[palabra]
  }
  const terminacion = (a: string, b: string) => {
    const x = sinTildes(a)
    const y = sinTildes(b)
    let n = 0
    while (n < Math.min(x.length, y.length) && x[x.length - 1 - n] === y[y.length - 1 - n]) n++
    return n
  }

  it('cada familia de rimas comparte clave y terminación con su palabra, y no hay dos familias con la misma clave', () => {
    const [familias] = bloques('rimas', 'pick-member')
    const claves: string[] = []
    for (const grupo of familias.groups) {
      const pedida = grupo.question!.match(/«(.+)»/)![1]
      const miembros = familias.items.filter((m) => m.group === grupo.id).map((m) => m.label)
      expect(miembros.length, grupo.id).toBeGreaterThanOrEqual(3)
      expect(miembros, grupo.id).not.toContain(pedida)
      claves.push(clave(pedida))
      for (const m of miembros) {
        expect(clave(m), `${m} con ${pedida}`).toBe(clave(pedida))
        expect(terminacion(m, pedida), `${m} con ${pedida}`).toBeGreaterThanOrEqual(2)
      }
    }
    expect(new Set(claves).size, 'dos familias con la misma rima asonante').toBe(claves.length)
    expect(familias.groups).toHaveLength(10)
    expect(familias.items.every((m) => familias.groups.some((g) => g.id === m.group))).toBe(true)
  })

  it('las preguntas de con qué palabra rima: la buena comparte clave y terminación, y las malas ni clave ni terminación de dos letras', () => {
    const items = facts('rimas')
    const rimas = items.filter((i) => i.question.startsWith('¿Con qué palabra rima'))
    expect(rimas).toHaveLength(8)
    for (const item of rimas) {
      const pedida = item.question.match(/«(.+)»/)![1]
      expect(clave(item.answer), item.question).toBe(clave(pedida))
      expect(terminacion(item.answer, pedida), item.question).toBeGreaterThanOrEqual(2)
      for (const mala of item.wrong) {
        expect(clave(mala), `${mala} con ${pedida}`).not.toBe(clave(pedida))
        expect(terminacion(mala, pedida), `${mala} con ${pedida}`).toBeLessThan(2)
      }
    }
    compruebaMalas(items)
  })

  it('las preguntas sobre qué es una rima son correctas', () => {
    const items = facts('rimas').filter((i) => !i.question.startsWith('¿Con qué palabra rima'))
    compruebaHechos(items, {
      '¿Qué significa que dos palabras riman?': 'que acaban con los mismos sonidos',
      '¿Cómo se llaman las palabras que significan lo mismo?': 'sinónimos',
      '¿Dónde suelen aparecer las rimas?': 'en las poesías y las canciones',
    })
  })
})

describe('Comprensión lectora', () => {
  // Cada pregunta con su respuesta y el trozo del texto que la demuestra
  const EVIDENCIA: Record<string, [string, string]> = {
    '¿Por qué Ana no va al parque?': ['porque llueve mucho', 'Hoy llueve mucho'],
    '¿Qué montan primero Ana y su hermano?': ['un puzle de un barco', 'montan un puzle de un barco'],
    '¿Con qué dibujan el castillo?': ['con ceras de colores', 'dibujan un castillo con ceras de colores'],
    '¿Qué hacen Ana y su hermano cuando deja de llover?': ['salen a buscar charcos', 'salen a buscar charcos'],
    '¿Cómo camina la tortuga Lila?': ['muy despacio', 'camina muy despacio'],
    '¿Adónde va la tortuga cada mañana?': ['al río', 'va hasta el río'],
    '¿De qué color es la mariquita del cuento?': ['roja', 'mariquita roja'],
    '¿Cómo llega siempre la tortuga al río?': ['con una sonrisa', 'llega con una sonrisa'],
    '¿Qué se corta primero para hacer el sándwich?': ['dos rebanadas de pan', 'se cortan dos rebanadas de pan'],
    '¿Qué se pone sobre una rebanada?': ['una loncha de queso', 'una loncha de queso sobre una rebanada'],
    '¿Qué se hace por último con el sándwich?': ['se tapa con la otra rebanada', 'se tapa con la otra rebanada'],
    '¿Para qué comida es el sándwich?': ['para merendar', 'a merendar'],
    '¿Cuántas gallinas hay en la granja de Nico?': ['tres', 'tres gallinas'],
    '¿Qué hace Nico por la tarde?': ['cepilla al caballo', 'cepilla al caballo'],
    '¿Qué le da la vaca a Nico?': ['leche', 'La vaca le da leche'],
    '¿Qué recoge Nico por la mañana?': ['los huevos', 'recoge los huevos'],
    '¿Cómo fue al campo la familia de Sara?': ['en bicicleta', 'en bicicleta'],
    '¿De qué color eran las flores?': ['amarillas', 'flores amarillas'],
    '¿Qué forma tenía la piedra que encontró Sara?': ['de corazón', 'con forma de corazón'],
    '¿Qué merendaron al volver a casa?': ['pan con chocolate', 'pan con chocolate'],
    '¿Por qué no quería llover la nube pequeña?': ['tenía miedo de caer sola', 'Tenía miedo de caer sola'],
    '¿Quién llevó a la nube hasta otras nubes?': ['un viento amable', 'un viento amable la llevó'],
    '¿Qué hicieron todas las nubes juntas?': ['una lluvia suave', 'una lluvia suave'],
    '¿Qué crecieron con la lluvia?': ['las flores del jardín', 'las flores del jardín crecieron'],
  }

  it('hay seis textos con cuatro preguntas cada uno, todos propios y sin datos personales', () => {
    const items = facts('lectura')
    expect(items).toHaveLength(24)
    const textos = new Set(items.map((i) => i.text))
    expect(textos.size).toBe(6)
    for (const t of textos) {
      expect(t, 'pregunta sin texto').toBeTruthy()
      expect(items.filter((i) => i.text === t)).toHaveLength(4)
      expect(t!.length, t).toBeLessThanOrEqual(330)
      expect(t, t).not.toMatch(/Irene|Arnedo|Cayetano|Verónica|Toby|Carlitos|Ogrez|Mario Méndez|Jurado|Walsh/i)
    }
  })

  it('cada respuesta está en su texto, con el trozo que la demuestra', () => {
    const items = facts('lectura')
    compruebaHechos(items, Object.fromEntries(Object.entries(EVIDENCIA).map(([pregunta, [respuesta]]) => [pregunta, respuesta])))
    for (const item of items) {
      const [, trozo] = EVIDENCIA[item.question]
      expect(item.text, item.question).toContain(trozo)
    }
    compruebaMalas(items)
  })

  it('las respuestas equivocadas no son lo que dice el texto en esa frase', () => {
    for (const item of facts('lectura')) {
      const [, trozo] = EVIDENCIA[item.question]
      for (const mala of item.wrong) expect(trozo, `${item.question}: ${mala}`).not.toContain(mala)
    }
  })
})
