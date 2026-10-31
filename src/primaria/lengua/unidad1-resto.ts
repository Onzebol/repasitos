import type { FactItem, Group, Member, PairRow, Topic } from '../../types'

// Resto de temas de la unidad 1 de Lengua (el primero, «Sinónimos y palabras del colegio», está en unidad1.ts). Mismas reglas:
// ejercicios escritos desde cero, preguntas generadas desde tablas y respuestas equivocadas que son falsas seguro. Las lecturas
// del libro tienen derechos de autor: los textos de comprensión lectora son propios.

// ── La mayúscula ───────────────────────────────────────────────────────────────────────────────────────────────────────
const NOMBRES: Group[] = [
  { id: 'persona', label: 'una persona' },
  { id: 'animal', label: 'un animal' },
  { id: 'lugar', label: 'un lugar' },
]
const nombre = (label: string, group: string): Member => ({ label, group })
const NOMBRES_PROPIOS: Member[] = [
  ...['Lucía', 'Pablo', 'Marta', 'Hugo', 'Sara', 'Álvaro'].map((n) => nombre(n, 'persona')),
  ...['Pelusa', 'Chispa', 'Bigotes', 'Copito', 'Trueno'].map((n) => nombre(n, 'animal')),
  ...['Madrid', 'Francia', 'Italia', 'Sevilla', 'Portugal', 'Toledo'].map((n) => nombre(n, 'lugar')),
]

// En las preguntas de «qué palabra es…», todas las opciones llevan mayúscula inicial para que no se note cuál es
const REGLAS_MAYUSCULA: FactItem[] = [
  { question: '¿Con qué letra empieza una frase?', answer: 'con mayúscula', wrong: ['con minúscula', 'con un número', 'con un punto'] },
  {
    question: 'Después de un punto, ¿cómo empieza la palabra siguiente?',
    answer: 'con mayúscula',
    wrong: ['con minúscula', 'con un número', 'con una coma'],
  },
  {
    question: '¿Con qué letra empieza el nombre de una persona?',
    answer: 'con mayúscula',
    wrong: ['con minúscula', 'con un número', 'con un punto'],
  },
  {
    question: '¿Qué palabras empiezan siempre con mayúscula?',
    answer: 'los nombres de personas, animales y lugares',
    wrong: ['los verbos', 'los colores', 'todas las palabras de la frase'],
  },
  { question: '¿Qué palabra es un nombre propio?', answer: 'Madrid', wrong: ['Ciudad', 'Mesa', 'Perro'] },
  { question: '¿Qué palabra es el nombre propio de una persona?', answer: 'Marta', wrong: ['Niña', 'Amiga', 'Hermana'] },
  {
    question: '¿Cómo se llama el nombre de una persona, un animal o un lugar en concreto?',
    answer: 'nombre propio',
    wrong: ['nombre común', 'verbo', 'sílaba'],
  },
  { question: '¿Qué palabra es un nombre común?', answer: 'Ciudad', wrong: ['Madrid', 'Francia', 'Rocky'] },
]

// Frases con una sola forma bien escrita: las malas fallan en un nombre propio sin mayúscula, en una palabra común con
// ella o en la palabra que sigue a un punto. Todas empiezan por mayúscula, así que la primera letra no delata la buena.
const frase = (sobre: string, buena: string, malas: string[]): FactItem => ({
  question: `¿Qué frase está bien escrita sobre ${sobre}?`,
  answer: buena,
  wrong: malas,
})
const FRASES_MAYUSCULA: FactItem[] = [
  frase('una amiga y su ciudad', 'Mi amiga Lucía vive en Madrid.', [
    'Mi amiga lucía vive en Madrid.',
    'Mi amiga Lucía vive en madrid.',
    'Mi Amiga Lucía vive en Madrid.',
  ]),
  frase('un perro', 'Mi perro Rocky corre por el parque.', [
    'Mi perro rocky corre por el parque.',
    'Mi Perro Rocky corre por el Parque.',
    'Mi perro Rocky corre por El parque.',
  ]),
  frase('un viaje', 'En verano viajaremos a Francia.', [
    'En verano viajaremos a francia.',
    'En Verano viajaremos a Francia.',
    'En verano Viajaremos a Francia.',
  ]),
  frase('una gata', 'La gata Nube duerme en el sofá.', [
    'La gata nube duerme en el sofá.',
    'La Gata Nube duerme en el Sofá.',
    'La gata Nube Duerme en el sofá.',
  ]),
  frase('un río', 'El río Tajo pasa por Toledo.', [
    'El río tajo pasa por Toledo.',
    'El río Tajo pasa por toledo.',
    'El Río Tajo pasa por Toledo.',
  ]),
  frase('dos amigos', 'Pablo y Marta juegan al fútbol.', [
    'Pablo y marta juegan al fútbol.',
    'Pablo y Marta Juegan al fútbol.',
    'Pablo Y Marta juegan al fútbol.',
  ]),
  frase('una ciudad', 'Hoy llegamos a Sevilla.', ['Hoy llegamos a sevilla.', 'Hoy Llegamos a Sevilla.', 'Hoy llegamos A Sevilla.']),
  frase('el tiempo', 'Hoy llueve. Mañana saldrá el sol.', [
    'Hoy llueve. mañana saldrá el sol.',
    'Hoy llueve. Mañana Saldrá el sol.',
    'Hoy Llueve. Mañana saldrá el sol.',
  ]),
  frase('una abuela', 'Mi abuela vive en Segovia.', ['Mi abuela vive en segovia.', 'Mi Abuela vive en Segovia.', 'Mi abuela Vive en Segovia.']),
]

// ── Describir personas ─────────────────────────────────────────────────────────────────────────────────────────────────
const ASPECTO: Group[] = [
  { id: 'pelo', label: 'el pelo' },
  { id: 'ojos', label: 'los ojos' },
  { id: 'ser', label: 'la forma de ser' },
]
const PALABRAS_DE_PERSONAS: Member[] = [
  ...['rubio', 'pelirrojo', 'rizado', 'liso', 'canoso'].map((p) => nombre(p, 'pelo')),
  ...['azules', 'verdes', 'marrones', 'redondos'].map((p) => nombre(p, 'ojos')),
  ...['simpático', 'tímido', 'generoso', 'travieso', 'valiente', 'cariñoso', 'tranquilo'].map((p) => nombre(p, 'ser')),
]

// Cómo se dice de quien… y qué significa cada palabra (cada significado es distinto de los demás)
const rasgo = (palabra: string, quien: string): PairRow => ({
  ask: `¿Cómo se dice de quien ${quien}?`,
  answer: palabra,
  askBack: `¿Qué significa «${palabra}»?`,
  answerBack: `que ${quien}`,
})
const FORMAS_DE_SER: PairRow[] = [
  rasgo('valiente', 'no tiene miedo'),
  rasgo('generoso', 'comparte lo que tiene'),
  rasgo('tímido', 'le da vergüenza hablar con gente nueva'),
  rasgo('cariñoso', 'da muchos abrazos y besos'),
  rasgo('travieso', 'hace travesuras'),
  rasgo('tranquilo', 'está calmado y sin prisa'),
  rasgo('trabajador', 'se esfuerza mucho'),
  rasgo('simpático', 'es amable y cae bien a todos'),
]

const DESCRIPCIONES: FactItem[] = [
  {
    question: '¿Qué oración describe cómo es el pelo de una niña?',
    answer: 'Tiene el pelo largo y rizado.',
    wrong: ['Tiene un perro muy grande.', 'Va al colegio en autobús.', 'Tiene los ojos azules.'],
  },
  {
    question: '¿Qué oración describe cómo son los ojos de un niño?',
    answer: 'Tiene los ojos verdes.',
    wrong: ['Tiene el pelo rubio.', 'Es muy simpático.', 'Juega al fútbol.'],
  },
  {
    question: '¿Qué oración dice cómo es la forma de ser de una persona?',
    answer: 'Es generosa y cariñosa.',
    wrong: ['Tiene el pelo rubio.', 'Tiene los ojos marrones.', 'Lleva una mochila azul.'],
  },
  {
    question: '¿Qué oración da más detalles sobre el gato?',
    answer: 'El gato negro duerme en el sofá del salón.',
    wrong: ['El gato duerme.', 'El gato.', 'Duerme.'],
  },
  {
    question: '¿Qué oración da más detalles sobre el niño?',
    answer: 'El niño alto y moreno corre por el parque.',
    wrong: ['El niño corre.', 'El niño ríe.', 'Corre.'],
  },
  {
    question: '¿Qué palabra completa mejor «Mi hermana siempre comparte sus juguetes: es muy ___»?',
    answer: 'generosa',
    wrong: ['rizada', 'pelirroja', 'alta'],
  },
  {
    question: '¿Qué palabra completa mejor «Mi primo no tiene miedo a nada: es muy ___»?',
    answer: 'valiente',
    wrong: ['rubio', 'bajo', 'alto'],
  },
  {
    question: '¿Cómo se llama el pelo que no tiene ondas ni rizos?',
    answer: 'liso',
    wrong: ['rizado', 'ondulado', 'tímido'],
  },
  {
    question: '¿Cuál de estas palabras sirve para describir el pelo?',
    answer: 'pelirrojo',
    wrong: ['valiente', 'redondos', 'simpático'],
  },
]

// ── Lenguas de España ──────────────────────────────────────────────────────────────────────────────────────────────────
const LENGUAS: FactItem[] = [
  {
    question: '¿Qué lengua, además del castellano, se habla en Galicia?',
    answer: 'el gallego',
    wrong: ['el francés', 'el japonés', 'el ruso'],
  },
  {
    question: '¿Qué lengua, además del castellano, se habla en Cataluña?',
    answer: 'el catalán',
    wrong: ['el italiano', 'el alemán', 'el chino'],
  },
  {
    question: '¿Qué lengua, además del castellano, se habla en el País Vasco?',
    answer: 'el vasco o euskera',
    wrong: ['el portugués', 'el griego', 'el ruso'],
  },
  {
    question: '¿En qué lugar de España se habla el gallego?',
    answer: 'en Galicia',
    wrong: ['en Cataluña', 'en el País Vasco', 'en Andalucía'],
  },
  {
    question: '¿En qué lugar de España se habla el catalán?',
    answer: 'en Cataluña',
    wrong: ['en Galicia', 'en el País Vasco', 'en Andalucía'],
  },
  {
    question: '¿En qué lugar de España se habla el vasco?',
    answer: 'en el País Vasco',
    wrong: ['en Galicia', 'en Cataluña', 'en Andalucía'],
  },
  { question: '¿Cómo se llama también el castellano?', answer: 'el español', wrong: ['el gallego', 'el catalán', 'el vasco'] },
  { question: '¿Qué lengua se habla en casi toda España?', answer: 'el castellano', wrong: ['el chino', 'el japonés', 'el ruso'] },
  {
    question: '¿Cómo se comunican con las manos algunas personas sordas?',
    answer: 'con la lengua de signos',
    wrong: ['con un teléfono', 'con una radio', 'con una canción'],
  },
  {
    question: '¿Qué lengua se habla en muchos países de América, como México o Argentina?',
    answer: 'el español',
    wrong: ['el japonés', 'el ruso', 'el chino'],
  },
  { question: '¿Para qué sirve una lengua?', answer: 'para comunicarnos', wrong: ['para dormir', 'para correr', 'para cocinar'] },
]

// Cómo se dice «hola» y «gracias» en otras lenguas (ninguna palabra se repite, así que la de otra fila nunca vale)
const dicho = (palabra: string, lengua: string, dicho: string, emoji: string): PairRow => ({
  ask: `¿Cómo se dice «${palabra}» en ${lengua}?`,
  answer: dicho,
  askBack: `¿En qué lengua se dice «${dicho}»?`,
  answerBack: `en ${lengua}`,
  emoji,
})
const HOLA: PairRow[] = [
  dicho('hola', 'inglés', 'Hello', '👋'),
  dicho('hola', 'francés', 'Bonjour', '👋'),
  dicho('hola', 'italiano', 'Ciao', '👋'),
  dicho('hola', 'alemán', 'Hallo', '👋'),
  dicho('hola', 'portugués', 'Olá', '👋'),
  dicho('hola', 'vasco', 'Kaixo', '👋'),
]
const GRACIAS: PairRow[] = [
  dicho('gracias', 'inglés', 'Thank you', '🙏'),
  dicho('gracias', 'francés', 'Merci', '🙏'),
  dicho('gracias', 'italiano', 'Grazie', '🙏'),
  dicho('gracias', 'alemán', 'Danke', '🙏'),
  dicho('gracias', 'portugués', 'Obrigado', '🙏'),
  dicho('gracias', 'vasco', 'Eskerrik asko', '🙏'),
  dicho('gracias', 'catalán', 'Gràcies', '🙏'),
]

// ── Abecedario y sílabas ───────────────────────────────────────────────────────────────────────────────────────────────
const ABECEDARIO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')
const TIPOS_DE_LETRA: Group[] = [
  { id: 'vocal', label: 'una vocal', question: '¿Cuál de estas letras es una vocal?' },
  { id: 'consonante', label: 'una consonante', question: '¿Cuál de estas letras es una consonante?' },
]
const LETRAS: Member[] = [
  ...['A', 'E', 'I', 'O', 'U'].map((l) => nombre(l, 'vocal')),
  ...['B', 'C', 'D', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T'].map((l) => nombre(l, 'consonante')),
]

// Palabras sin diptongos ni hiatos dudosos. Las respuestas equivocadas de «cuántas sílabas» son las otras cantidades.
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
const cantidad = (n: number) => `${n} ${n === 1 ? 'sílaba' : 'sílabas'}`

const CUENTAS: FactItem[] = Object.entries(SILABAS).map(([palabra, separada]) => {
  const n = separada.split('-').length
  return {
    question: `¿Cuántas sílabas tiene «${palabra}»?`,
    answer: cantidad(n),
    wrong: [1, 2, 3, 4, 5].filter((k) => k !== n).map(cantidad),
  }
})

// Separaciones mal hechas: los cortes caen donde no toca, pero las letras son las mismas
const SEPARACIONES_MALAS: Record<string, string[]> = {
  mariposa: ['mar-i-po-sa', 'ma-rip-o-sa', 'mari-po-sa'],
  ventana: ['ve-nta-na', 'vent-a-na', 'ven-tan-a'],
  zapato: ['zap-a-to', 'z-apa-to', 'za-pat-o'],
  chocolate: ['choc-o-la-te', 'cho-col-a-te', 'cho-co-lat-e'],
  camisa: ['cam-i-sa', 'c-ami-sa', 'ca-mis-a'],
  galleta: ['gal-le-ta', 'g-alle-ta', 'ga-llet-a'],
}
const SEPARAR: FactItem[] = Object.entries(SEPARACIONES_MALAS).map(([palabra, malas]) => ({
  question: `¿Cómo se separa en sílabas «${palabra}»?`,
  answer: SILABAS[palabra],
  wrong: malas,
}))

// Formar una palabra con sus sílabas, dadas al revés. Las palabras equivocadas son sílabas en otro orden y no son palabras.
const FORMAR: FactItem[] = ['ventana', 'tomate', 'paloma', 'galleta'].map((palabra) => {
  const trozos = SILABAS[palabra].split('-')
  const dadas = [...trozos].reverse()
  const orden = (...i: number[]) => i.map((k) => trozos[k]).join('')
  return {
    question: `¿Qué palabra se forma con las sílabas ${dadas.slice(0, -1).map((t) => `«${t}»`).join(', ')} y «${dadas.at(-1)}»?`,
    answer: palabra,
    wrong: [orden(2, 1, 0), orden(1, 0, 2), orden(1, 2, 0)],
  }
})

const GENERALES_ABECEDARIO: FactItem[] = [
  { question: '¿Cuántas letras tiene el abecedario?', answer: '27 letras', wrong: ['25 letras', '26 letras', '30 letras'] },
  { question: '¿Cuántas vocales tiene el abecedario?', answer: '5 vocales', wrong: ['3 vocales', '4 vocales', '7 vocales'] },
  { question: '¿Qué son la A, la E, la I, la O y la U?', answer: 'las vocales', wrong: ['las consonantes', 'las sílabas', 'las palabras'] },
  {
    question: '¿Qué es una sílaba?',
    answer: 'cada trozo en que se divide una palabra al decirla',
    wrong: ['cada palabra de una frase', 'una frase corta', 'la última letra de una palabra'],
  },
]

// ── Palabras que riman ─────────────────────────────────────────────────────────────────────────────────────────────────
// Cada familia acaba igual (rima consonante) y ninguna comparte rima asonante con otra, así que una palabra de otra
// familia nunca rima con la que se pide. La palabra que se pide no es de la familia.
const FAMILIAS: { id: string; pide: string; palabras: string[] }[] = [
  { id: 'ato', pide: 'gato', palabras: ['pato', 'plato', 'zapato'] },
  { id: 'asa', pide: 'casa', palabras: ['masa', 'brasa', 'pasa'] },
  { id: 'una', pide: 'luna', palabras: ['cuna', 'laguna', 'aceituna'] },
  { id: 'ol', pide: 'sol', palabras: ['caracol', 'girasol', 'farol'] },
  { id: 'en', pide: 'tren', palabras: ['andén', 'también', 'sartén'] },
  { id: 'elo', pide: 'pelo', palabras: ['cielo', 'hielo', 'vuelo'] },
  { id: 'oca', pide: 'boca', palabras: ['loca', 'roca', 'foca'] },
  { id: 'oto', pide: 'moto', palabras: ['foto', 'roto', 'voto'] },
  { id: 'ote', pide: 'bote', palabras: ['lote', 'trote', 'pote'] },
  { id: 'an', pide: 'pan', palabras: ['volcán', 'capitán', 'plan'] },
]
const GRUPOS_DE_RIMA: Group[] = FAMILIAS.map((f) => ({ id: f.id, label: f.id, question: `¿Qué palabra rima con «${f.pide}»?` }))
const PALABRAS_QUE_RIMAN: Member[] = FAMILIAS.flatMap((f) => f.palabras.map((p) => nombre(p, f.id)))

const rima = (pide: string, rima: string, malas: string[]): FactItem => ({
  question: `¿Con qué palabra rima «${pide}»?`,
  answer: rima,
  wrong: malas,
})
const RIMAS: FactItem[] = [
  rima('rosa', 'mariposa', ['pan', 'sol', 'tren']),
  rima('pelota', 'bota', ['pan', 'sol', 'tren']),
  rima('corazón', 'canción', ['gato', 'luna', 'casa']),
  rima('amarillo', 'castillo', ['gato', 'luna', 'pan']),
  rima('ratón', 'camión', ['luna', 'gato', 'tren']),
  rima('estrella', 'botella', ['gato', 'sol', 'pan']),
  rima('jardín', 'delfín', ['gato', 'luna', 'casa']),
  rima('volar', 'mar', ['gato', 'luna', 'tren']),
  {
    question: '¿Qué significa que dos palabras riman?',
    answer: 'que acaban con los mismos sonidos',
    wrong: ['que significan lo mismo', 'que empiezan igual', 'que son muy largas'],
  },
  {
    question: '¿Cómo se llaman las palabras que significan lo mismo?',
    answer: 'sinónimos',
    wrong: ['rimas', 'vocales', 'sílabas'],
  },
  {
    question: '¿Dónde suelen aparecer las rimas?',
    answer: 'en las poesías y las canciones',
    wrong: ['en los números', 'en los mapas', 'en las señales de tráfico'],
  },
]

// ── Comprensión lectora ────────────────────────────────────────────────────────────────────────────────────────────────
// Textos propios, cortos. Cada pregunta se contesta con una frase del texto y las equivocadas dicen otra cosa.
const LLUVIA =
  'Hoy llueve mucho. Ana no puede ir al parque, así que juega en casa con su hermano. Primero montan un puzle de un barco. Después dibujan un castillo con ceras de colores. Cuando deja de llover, salen a buscar charcos.'
const TORTUGA =
  'La tortuga Lila camina muy despacio. Cada mañana sale de su casa de piedra y va hasta el río para beber agua. Por el camino saluda a una mariquita roja y a un saltamontes verde. Aunque tarda mucho, siempre llega con una sonrisa.'
const SANDWICH =
  'Para hacer un sándwich de queso, primero se cortan dos rebanadas de pan. Después se pone una loncha de queso sobre una rebanada. Por último, se tapa con la otra rebanada. ¡Y a merendar!'
const GRANJA =
  'En la granja de Nico hay una vaca, tres gallinas y un caballo. Por la mañana, Nico da de comer a las gallinas y recoge los huevos. Por la tarde, cepilla al caballo. La vaca le da leche cada día.'
const CAMPO =
  'El domingo, la familia de Sara fue al campo en bicicleta. Había muchas flores amarillas y una mariposa blanca. Sara encontró una piedra con forma de corazón. Al volver a casa, todos merendaron pan con chocolate.'
const NUBE =
  'Una nube pequeña no quería llover. Tenía miedo de caer sola. Un día, un viento amable la llevó hasta otras nubes. Entonces todas juntas hicieron una lluvia suave y las flores del jardín crecieron.'

const leer = (text: string, question: string, answer: string, wrong: string[]): FactItem => ({ text, question, answer, wrong })
const LECTURAS: FactItem[] = [
  leer(LLUVIA, '¿Por qué Ana no va al parque?', 'porque llueve mucho', ['porque está cansada', 'porque es muy tarde', 'porque tiene deberes']),
  leer(LLUVIA, '¿Qué montan primero Ana y su hermano?', 'un puzle de un barco', ['un castillo de arena', 'un puzle de un coche', 'una torre de cubos']),
  leer(LLUVIA, '¿Con qué dibujan el castillo?', 'con ceras de colores', ['con rotuladores', 'con pintura', 'con tizas']),
  leer(LLUVIA, '¿Qué hacen Ana y su hermano cuando deja de llover?', 'salen a buscar charcos', ['se duermen', 'hacen un pastel', 'empiezan a cantar']),
  leer(TORTUGA, '¿Cómo camina la tortuga Lila?', 'muy despacio', ['muy deprisa', 'saltando', 'corriendo']),
  leer(TORTUGA, '¿Adónde va la tortuga cada mañana?', 'al río', ['al mar', 'al colegio', 'a la montaña']),
  leer(TORTUGA, '¿De qué color es la mariquita del cuento?', 'roja', ['verde', 'azul', 'negra']),
  leer(TORTUGA, '¿Cómo llega siempre la tortuga al río?', 'con una sonrisa', ['enfadada', 'sin agua', 'con miedo']),
  leer(SANDWICH, '¿Qué se corta primero para hacer el sándwich?', 'dos rebanadas de pan', ['una loncha de queso', 'un tomate', 'una manzana']),
  leer(SANDWICH, '¿Qué se pone sobre una rebanada?', 'una loncha de queso', ['mermelada', 'un tomate', 'chocolate']),
  leer(SANDWICH, '¿Qué se hace por último con el sándwich?', 'se tapa con la otra rebanada', ['se corta el queso', 'se pone mantequilla', 'se tuesta el pan']),
  leer(SANDWICH, '¿Para qué comida es el sándwich?', 'para merendar', ['para cenar', 'para desayunar', 'para regalar']),
  leer(GRANJA, '¿Cuántas gallinas hay en la granja de Nico?', 'tres', ['dos', 'cuatro', 'una']),
  leer(GRANJA, '¿Qué hace Nico por la tarde?', 'cepilla al caballo', ['recoge los huevos', 'da de comer a las gallinas', 'baña a la vaca']),
  leer(GRANJA, '¿Qué le da la vaca a Nico?', 'leche', ['huevos', 'lana', 'miel']),
  leer(GRANJA, '¿Qué recoge Nico por la mañana?', 'los huevos', ['la lana', 'la fruta', 'las flores']),
  leer(CAMPO, '¿Cómo fue al campo la familia de Sara?', 'en bicicleta', ['en coche', 'en tren', 'andando']),
  leer(CAMPO, '¿De qué color eran las flores?', 'amarillas', ['rojas', 'azules', 'blancas']),
  leer(CAMPO, '¿Qué forma tenía la piedra que encontró Sara?', 'de corazón', ['de estrella', 'de círculo', 'de triángulo']),
  leer(CAMPO, '¿Qué merendaron al volver a casa?', 'pan con chocolate', ['fruta', 'galletas', 'un bocadillo de queso']),
  leer(NUBE, '¿Por qué no quería llover la nube pequeña?', 'tenía miedo de caer sola', ['estaba enfadada', 'tenía mucho sueño', 'no tenía agua']),
  leer(NUBE, '¿Quién llevó a la nube hasta otras nubes?', 'un viento amable', ['un pájaro', 'un avión', 'el sol']),
  leer(NUBE, '¿Qué hicieron todas las nubes juntas?', 'una lluvia suave', ['una tormenta', 'nieve', 'un arcoíris']),
  leer(NUBE, '¿Qué crecieron con la lluvia?', 'las flores del jardín', ['los peces del río', 'las nubes', 'las casas']),
]

export const temasResto: Topic[] = [
  {
    id: 'mayuscula',
    name: 'La mayúscula',
    icon: '✍️',
    tint: '#ffd9d2',
    plan: [
      { spec: { kind: 'classify', question: '¿{item} es el nombre de…?', groups: NOMBRES, items: NOMBRES_PROPIOS }, count: 3 },
      { spec: { kind: 'facts', items: REGLAS_MAYUSCULA }, count: 3 },
      { spec: { kind: 'facts', items: FRASES_MAYUSCULA }, count: 4 },
    ],
  },
  {
    id: 'describir',
    name: 'Describir personas',
    icon: '🧒',
    tint: '#d8ecff',
    plan: [
      {
        spec: { kind: 'classify', question: 'La palabra «{item}» sirve para describir…', groups: ASPECTO, items: PALABRAS_DE_PERSONAS },
        count: 3,
      },
      { spec: { kind: 'pairs', rows: FORMAS_DE_SER }, count: 3 },
      { spec: { kind: 'facts', items: DESCRIPCIONES }, count: 4 },
    ],
  },
  {
    id: 'lenguas',
    name: 'Lenguas de España',
    icon: '🗣️',
    tint: '#e3dbff',
    plan: [
      { spec: { kind: 'facts', items: LENGUAS }, count: 4 },
      { spec: { kind: 'pairs', rows: HOLA }, count: 3 },
      { spec: { kind: 'pairs', rows: GRACIAS }, count: 3 },
    ],
  },
  {
    id: 'abecedario',
    name: 'Abecedario y sílabas',
    icon: '🔤',
    tint: '#d9f4d2',
    plan: [
      {
        spec: {
          kind: 'sequence',
          id: 'abecedario',
          steps: ABECEDARIO,
          first: '¿Con qué letra empieza el abecedario?',
          last: '¿Con qué letra termina el abecedario?',
          after: '¿Qué letra va justo después de la {step}?',
          before: '¿Qué letra va justo antes de la {step}?',
        },
        count: 3,
      },
      { spec: { kind: 'pick-member', groups: TIPOS_DE_LETRA, items: LETRAS }, count: 2 },
      { spec: { kind: 'facts', items: [...CUENTAS, ...SEPARAR, ...FORMAR, ...GENERALES_ABECEDARIO] }, count: 5 },
    ],
  },
  {
    id: 'rimas',
    name: 'Palabras que riman',
    icon: '🎵',
    tint: '#ffe0f0',
    plan: [
      { spec: { kind: 'pick-member', groups: GRUPOS_DE_RIMA, items: PALABRAS_QUE_RIMAN }, count: 6 },
      { spec: { kind: 'facts', items: RIMAS }, count: 4 },
    ],
  },
  {
    id: 'lectura',
    name: 'Comprensión lectora',
    icon: '📖',
    tint: '#fff0c2',
    plan: [{ spec: { kind: 'facts', items: LECTURAS }, count: 10 }],
  },
]
