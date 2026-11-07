import type { FactItem, Group, Member, PairRow, Topic } from '../../types'
import { temasUnidad1 } from './unidad1'
import { temasUnidad2 } from './unidad2'

// Unidad 3: «¿Te sientes artista?» (ver docs/lengua-2-primaria.md). Mismas reglas que las unidades 1 y 2: ejercicios
// escritos desde cero con el vocabulario y las reglas de la unidad, preguntas generadas desde tablas y respuestas
// equivocadas que son falsas seguro. Las lecturas del libro tienen derechos de autor: el cuento, el diálogo y el poema de
// comprensión lectora son propios. Cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión.

const miembro = (label: string, group: string, emoji?: string): Member => ({ label, group, ...(emoji ? { emoji } : {}) })
// Pares de ida y vuelta: «¿Qué … tiene X?» ↔ «¿Qué … es Y?»
const par = (ask: (a: string) => string, askBack: (b: string) => string) => (a: string, b: string): PairRow => ({
  ask: ask(a),
  answer: b,
  askBack: askBack(b),
  answerBack: a,
})

// ── Palabras del arte ──────────────────────────────────────────────────────────────────────────────────────────────────
// Cada definición describe solo su palabra (no está «cuadro», que también sería un retrato o un paisaje)
const define = par(
  (palabra) => `¿Qué significa «${palabra}»?`,
  (definicion) => `¿Qué palabra significa «${definicion}»?`,
)
const DEFINICIONES: PairRow[] = [
  define('el pincel', 'instrumento con pelitos y un mango largo para pintar'),
  define('el lienzo', 'tela sobre la que se pinta un cuadro'),
  define('el marco', 'borde que rodea un cuadro'),
  define('el retrato', 'pintura o dibujo de una persona'),
  define('el paisaje', 'pintura de un campo, un mar o una montaña'),
  define('el mural', 'pintura grande hecha sobre una pared'),
  define('el museo', 'edificio donde se guardan y se enseñan obras de arte'),
  define('la paleta', 'tabla donde el pintor mezcla los colores'),
  define('el caballete', 'soporte que sujeta el cuadro mientras se pinta'),
  define('la escultura', 'figura hecha de piedra, madera o barro'),
]

// Artes: nada que sea de dos a la vez (no está el escenario, que es también de los conciertos)
const ARTES: Group[] = [
  { id: 'pintura', label: 'con la pintura' },
  { id: 'musica', label: 'con la música' },
  { id: 'teatro', label: 'con el teatro' },
]
const PALABRAS_DEL_ARTE: Member[] = [
  ...['el pincel', 'la paleta', 'el caballete', 'el lienzo', 'las acuarelas', 'el retrato'].map((p) => miembro(p, 'pintura')),
  ...['el concierto', 'la guitarra', 'el piano', 'el tambor', 'la flauta', 'la partitura'].map((p) => miembro(p, 'musica')),
  ...['el telón', 'el actor', 'la actriz', 'el guion', 'la obra de teatro', 'los títeres'].map((p) => miembro(p, 'teatro')),
]

const ARTE: FactItem[] = [
  {
    question: '¿Quién pinta cuadros?',
    answer: 'el pintor o la pintora',
    wrong: ['el cartero o la cartera', 'el panadero o la panadera', 'el bombero o la bombera'],
  },
  {
    question: '¿Quién hace esculturas?',
    answer: 'el escultor o la escultora',
    wrong: ['el cocinero o la cocinera', 'el piloto o la piloto', 'el cartero o la cartera'],
  },
  {
    question: '¿Dónde se pueden ver muchos cuadros y esculturas?',
    answer: 'en un museo',
    wrong: ['en una piscina', 'en una panadería', 'en una gasolinera'],
  },
  { question: '¿Qué colores se mezclan para conseguir el verde?', answer: 'azul y amarillo', wrong: ['rojo y blanco', 'negro y blanco', 'rojo y amarillo'] },
  { question: '¿Qué colores se mezclan para conseguir el naranja?', answer: 'rojo y amarillo', wrong: ['azul y amarillo', 'azul y blanco', 'negro y verde'] },
  { question: '¿Qué color sale al mezclar rojo y blanco?', answer: 'rosa', wrong: ['verde', 'negro', 'azul'] },
  {
    question: '¿Dónde se toca música para mucho público?',
    answer: 'en un concierto',
    wrong: ['en una biblioteca', 'en una frutería', 'en un garaje vacío'],
  },
]

// ── Aumentativos y diminutivos ─────────────────────────────────────────────────────────────────────────────────────────
// Un solo diminutivo y un solo aumentativo por palabra, y solo palabras que se sienten derivadas (no bolsillo ni cajón)
const diminutivo = par(
  (palabra) => `¿Cuál es el diminutivo de «${palabra}»?`,
  (derivada) => `¿De qué palabra es diminutivo «${derivada}»?`,
)
const DIMINUTIVOS: PairRow[] = [
  diminutivo('taza', 'tacita'),
  diminutivo('barca', 'barquita'),
  diminutivo('cuchara', 'cucharilla'),
  diminutivo('vaca', 'vaquita'),
  diminutivo('perro', 'perrito'),
  diminutivo('casa', 'casita'),
  diminutivo('mesa', 'mesita'),
  diminutivo('árbol', 'arbolito'),
  diminutivo('muñeca', 'muñequita'),
  diminutivo('pájaro', 'pajarito'),
]
const aumentativo = par(
  (palabra) => `¿Cuál es el aumentativo de «${palabra}»?`,
  (derivada) => `¿De qué palabra es aumentativo «${derivada}»?`,
)
const AUMENTATIVOS: PairRow[] = [
  aumentativo('cuchara', 'cucharón'),
  aumentativo('perro', 'perrazo'),
  aumentativo('mano', 'manaza'),
  aumentativo('coche', 'cochazo'),
  aumentativo('zapato', 'zapatón'),
  aumentativo('barca', 'barcaza'),
  aumentativo('taza', 'tazón'),
  aumentativo('libro', 'librote'),
]

const TAMANOS: Group[] = [
  { id: 'diminutivo', label: 'un diminutivo', question: '¿Cuál de estas palabras es un diminutivo?' },
  { id: 'aumentativo', label: 'un aumentativo', question: '¿Cuál de estas palabras es un aumentativo?' },
]
const DERIVADAS: Member[] = [
  ...['gatito', 'casita', 'mesilla', 'pelotita', 'florecilla', 'cochecito'].map((p) => miembro(p, 'diminutivo')),
  ...['gigantón', 'cabezón', 'golazo', 'manaza', 'grandote', 'perrazo'].map((p) => miembro(p, 'aumentativo')),
]

const SOBRE_TAMANOS: FactItem[] = [
  {
    question: '¿Qué es un diminutivo?',
    answer: 'una palabra que dice que algo es pequeño',
    wrong: ['una palabra que dice que algo es grande', 'una palabra que significa lo contrario', 'una palabra que rima'],
  },
  {
    question: '¿Qué es un aumentativo?',
    answer: 'una palabra que dice que algo es grande',
    wrong: ['una palabra que dice que algo es pequeño', 'una palabra que significa lo mismo', 'un nombre propio'],
  },
  { question: '¿Con qué terminación se forman muchos diminutivos?', answer: '-ito o -ita', wrong: ['-ón o -ona', '-azo o -aza', '-ero o -era'] },
  { question: '¿Con qué terminación se forman muchos aumentativos?', answer: '-ón o -azo', wrong: ['-ito o -ita', '-illo o -illa', '-ero o -era'] },
  { question: 'Una casa muy pequeña es una…', answer: 'casita', wrong: ['casona', 'casero', 'caserío'] },
  { question: 'Una cuchara muy grande es un…', answer: 'cucharón', wrong: ['cucharilla', 'cucharita', 'cucharada'] },
]

// ── ca, co, cu, que, qui ───────────────────────────────────────────────────────────────────────────────────────────────
// Regla del libro: c delante de a, o, u; qu delante de e, i. Cada palabra tiene el sonido K de una sola forma, sin k, sin
// «cue» ni «cui» y sin una c que suene como z (cinco, catorce o quince mezclarían dos reglas).
const SILABAS: Group[] = [
  { id: 'c', label: 'ca, co o cu', question: '¿Qué palabra se escribe con ca, co o cu?' },
  { id: 'qu', label: 'que o qui', question: '¿Qué palabra se escribe con que o qui?' },
]
const PALABRAS_K: Member[] = [
  ...['casa', 'cama', 'cometa', 'conejo', 'cuna', 'cubo', 'música', 'banco', 'foca', 'vaca', 'calabaza', 'escudo'].map((p) => miembro(p, 'c')),
  ...['queso', 'paquete', 'raqueta', 'máquina', 'mosquito', 'banqueta', 'flequillo', 'esquí', 'chaqueta', 'mantequilla', 'etiqueta', 'pequeño'].map(
    (p) => miembro(p, 'qu'),
  ),
]

// Cómo se escribe: las malas suenan igual pero rompen la regla (c delante de e o i, k, q sin u o qu delante de a, o, u)
const escribe = (que: string, buena: string, malas: string[], visual?: string): FactItem => ({
  question: `¿Cómo se escribe ${que}?`,
  answer: buena,
  wrong: malas,
  ...(visual ? { visual } : {}),
})
const ESCRIBIR_K: FactItem[] = [
  escribe('el nombre de este alimento', 'queso', ['ceso', 'keso', 'qeso'], '🧀'),
  escribe('el nombre de este insecto', 'mosquito', ['moscito', 'moskito', 'mosqito'], '🦟'),
  escribe('el nombre de este animal de la granja', 'vaca', ['vaqa', 'vaka', 'vaqua'], '🐄'),
  escribe('el nombre del mueble para dormir', 'cama', ['qama', 'kama', 'quama'], '🛏️'),
  escribe('el nombre de este animal de orejas largas', 'conejo', ['qonejo', 'konejo', 'quonejo'], '🐇'),
  escribe('el nombre de esta prenda de abrigo', 'chaqueta', ['chaceta', 'chaketa', 'chaqeta'], '🧥'),
  escribe('el número 4', 'cuatro', ['quatro', 'kuatro', 'qatro']),
  escribe('el deporte de deslizarse por la nieve', 'esquí', ['escí', 'eskí', 'esqí'], '⛷️'),
  escribe('el nombre de este cubierto', 'cuchara', ['quchara', 'kuchara', 'qchara'], '🥄'),
  escribe('lo contrario de grande', 'pequeño', ['peceño', 'pekeño', 'peqeño']),
]

// La sílaba que falta: las equivocadas son las otras cuatro, y con ninguna sale otra palabra
const falta = (hueco: string, silaba: string, visual?: string): FactItem => ({
  question: `¿Qué sílaba falta en «${hueco}»?`,
  answer: silaba,
  wrong: ['ca', 'co', 'cu', 'que', 'qui'].filter((s) => s !== silaba),
  ...(visual ? { visual } : {}),
})
const COMPLETAR_K: FactItem[] = [
  falta('ra _ ta', 'que', '🏸'),
  falta('pa _ te', 'que', '📦'),
  falta('_ labaza', 'ca', '🎃'),
  falta('mos _ to', 'qui', '🦟'),
  falta('es _ do', 'cu', '🛡️'),
  falta('ros _ lla', 'qui'),
  falta('pe _ ño', 'que'),
  falta('má _ na', 'qui'),
  falta('_ codrilo', 'co', '🐊'),
]

const REGLA_K: FactItem[] = [
  { question: '¿Delante de qué vocales se escribe c para el sonido K?', answer: 'a, o, u', wrong: ['e, i', 'a, e', 'i, o'] },
  { question: '¿Delante de qué vocales se escribe qu?', answer: 'e, i', wrong: ['a, o, u', 'a, u', 'o, u'] },
  { question: 'En «queso», ¿qué letra va entre la q y la e y no suena?', answer: 'la u', wrong: ['la a', 'la i', 'la o'] },
]

// ── Completar oraciones ────────────────────────────────────────────────────────────────────────────────────────────────
// Elegir el final con sentido (con su punto). Los finales equivocados no tienen sentido en ningún caso.
const termina = (principio: string, buena: string, malas: string[]): FactItem => ({
  question: `¿Cómo termina bien la oración «${principio}…»?`,
  answer: buena,
  wrong: malas,
})
const FINALES: FactItem[] = [
  termina('El pintor moja el pincel', 'en la pintura.', ['en la sopa.', 'en las nubes.', 'en el zapato.']),
  termina('Colgamos el cuadro', 'en la pared.', ['en la sopa.', 'debajo del agua.', 'dentro del bocadillo.']),
  termina('En el museo hay', 'muchos cuadros.', ['un mar con olas.', 'una nube de lluvia.', 'un volcán encendido.']),
  termina('La niña pinta un retrato', 'de su abuela.', ['de un río.', 'de una montaña.', 'de un bosque.']),
  termina('El músico toca la guitarra', 'con los dedos.', ['con la nariz.', 'con las orejas.', 'con el codo de su vecino.']),
  termina('Los actores salen', 'al escenario.', ['a la nevera.', 'al fondo del mar.', 'a la luna.']),
  termina('Mezclo azul y amarillo', 'y sale el verde.', ['y sale el rojo.', 'y sale el negro.', 'y sale el blanco.']),
  termina('El público aplaude', 'al final de la obra.', ['debajo del agua.', 'dentro de una caja.', 'con las orejas.']),
  termina('Lavo los pinceles', 'con agua.', ['con chocolate.', 'con arena.', 'con zumo de naranja.']),
  termina('La bailarina baila', 'en el escenario.', ['dentro de una taza.', 'encima de una nube.', 'dentro del estuche.']),
  termina('El retrato está dentro de', 'un marco dorado.', ['un vaso de leche.', 'un plato de sopa.', 'una pecera.']),
  termina('Pintamos un mural', 'en la pared del patio.', ['en una uña.', 'en un grano de arroz.', 'en una gota de agua.']),
  termina('Para dibujar, uso', 'un lápiz y papel.', ['una cuchara y sopa.', 'un paraguas y botas.', 'un balón y una red.']),
]

// Oraciones completas y bien escritas: las malas se quedan sin terminar, empiezan con minúscula o no llevan punto
const completa = (sobre: string, buena: string): FactItem => {
  const sinPunto = buena.slice(0, -1)
  return {
    question: `¿Qué oración sobre ${sobre} está completa y bien escrita?`,
    answer: buena,
    wrong: [sinPunto.split(' ').slice(0, -1).join(' '), buena[0].toLowerCase() + buena.slice(1), sinPunto],
  }
}
const COMPLETAS: FactItem[] = [
  completa('un pájaro', 'El pájaro canta en el árbol.'),
  completa('una pintora', 'La pintora pinta un paisaje.'),
  completa('un concierto', 'El concierto empieza a las seis.'),
  completa('un museo', 'El museo abre por la mañana.'),
  completa('una flauta', 'Lucía toca la flauta.'),
  completa('un payaso', 'El payaso hace reír a todos.'),
  completa('un mural', 'Pintamos un mural muy grande.'),
  completa('una obra de teatro', 'La obra de teatro fue divertida.'),
]

// ── Sustantivos comunes y propios ──────────────────────────────────────────────────────────────────────────────────────
const NOMBRAN: Group[] = [
  { id: 'persona', label: 'a una persona' },
  { id: 'animal', label: 'a un animal' },
  { id: 'cosa', label: 'a una cosa' },
]
const COMUNES: Member[] = [
  ...['niña', 'maestro', 'bombero', 'abuela', 'médica', 'pintor'].map((p) => miembro(p, 'persona')),
  ...['pato', 'gato', 'caballo', 'ballena', 'mariposa', 'león'].map((p) => miembro(p, 'animal')),
  ...['gorro', 'mesa', 'lápiz', 'pelota', 'cuadro', 'bicicleta'].map((p) => miembro(p, 'cosa')),
]

// Nombre propio ↔ nombre común (cada propio es de una clase distinta, así que no hay dos respuestas posibles)
const propio = par(
  (nombre) => `¿De qué es nombre propio «${nombre}»?`,
  (de) => `¿Cuál es el nombre propio ${de}?`,
)
const PROPIOS: PairRow[] = [
  propio('Madrid', 'de una ciudad'),
  propio('Ebro', 'de un río'),
  propio('Teide', 'de una montaña'),
  propio('España', 'de un país'),
  propio('Mediterráneo', 'de un mar'),
  propio('Atlántico', 'de un océano'),
  propio('Tenerife', 'de una isla'),
  propio('Marte', 'de un planeta'),
]

const SUSTANTIVOS: FactItem[] = [
  {
    question: '¿Para qué sirven los sustantivos?',
    answer: 'para nombrar personas, animales y cosas',
    wrong: ['para decir cómo es algo', 'para unir palabras', 'para contar números'],
  },
  {
    question: '¿A quién nombra un nombre común?',
    answer: 'a cualquier persona, animal o cosa',
    wrong: ['solo a una persona concreta', 'solo a los lugares', 'solo a los números'],
  },
  {
    question: '¿Qué dice un nombre propio?',
    answer: 'cómo se llama una persona, un animal o un lugar concreto',
    wrong: ['cómo es una cosa', 'qué hace una persona', 'cuántas cosas hay'],
  },
  {
    question: '¿Cómo empiezan los nombres propios?',
    answer: 'con mayúscula',
    wrong: ['con minúscula', 'con un número', 'con un punto'],
  },
  {
    question: 'En «Rosa riega una rosa», ¿qué palabra es un nombre propio?',
    answer: 'Rosa, con mayúscula',
    wrong: ['rosa, con minúscula', 'riega', 'una'],
  },
  {
    question: 'En «Paloma da pan a la paloma», ¿qué palabra es el nombre común de un ave?',
    answer: 'paloma, con minúscula',
    wrong: ['Paloma, con mayúscula', 'da', 'la'],
  },
  { question: '¿Qué palabra es un sustantivo?', answer: 'mesa', wrong: ['correr', 'bonito', 'rápido'] },
  { question: '¿Qué palabra es un sustantivo que nombra un animal?', answer: 'gato', wrong: ['saltar', 'blanco', 'dormir'] },
  {
    question: '¿Qué frase tiene bien escrito el nombre propio?',
    answer: 'Mi gato se llama Bigotes.',
    wrong: ['Mi gato se llama bigotes.', 'Mi Gato se llama bigotes.', 'Mi gato se Llama Bigotes.'],
  },
]

// ── Describir objetos ──────────────────────────────────────────────────────────────────────────────────────────────────
// Al describir un objeto se dice su tamaño, su color, sus partes y lo que lo hace especial (palabras sobre una bici)
const DATOS: Group[] = [
  { id: 'tamaño', label: 'su tamaño' },
  { id: 'color', label: 'su color' },
  { id: 'parte', label: 'una de sus partes' },
]
const PALABRAS_DE_LA_BICI: Member[] = [
  ...['pequeña', 'grande', 'enorme', 'diminuta', 'mediana'].map((p) => miembro(p, 'tamaño')),
  ...['roja', 'azul', 'verde', 'amarilla', 'morada', 'blanca'].map((p) => miembro(p, 'color')),
  ...['el manillar', 'el sillín', 'las ruedas', 'el timbre', 'los pedales', 'la cesta'].map((p) => miembro(p, 'parte')),
]

// Partes que solo tiene su objeto entre los de la tabla (no están juntos el piano y el ordenador, que tienen teclas)
const partes = par(
  (objeto) => `¿Qué partes tiene ${objeto}?`,
  (lista) => `¿Qué objeto tiene ${lista}?`,
)
const PARTES: PairRow[] = [
  partes('la bicicleta', 'manillar y pedales'),
  partes('el reloj', 'agujas'),
  partes('el paraguas', 'mango y varillas'),
  partes('el lápiz', 'mina'),
  partes('la silla', 'respaldo y patas'),
  partes('la zapatilla', 'suela y cordones'),
  partes('el libro', 'páginas y portada'),
  partes('la taza', 'asa'),
  partes('el ordenador', 'pantalla y teclado'),
]

const DESCRIBIR: FactItem[] = [
  {
    question: '¿Qué se cuenta al describir un objeto?',
    answer: 'su tamaño, su color, sus partes y lo que lo hace especial',
    wrong: ['solo su nombre', 'la hora que es', 'lo que comimos ayer'],
  },
  {
    question: '¿Qué oración describe el color de una mochila?',
    answer: 'La mochila es roja con rayas blancas.',
    wrong: ['La mochila es muy grande.', 'La mochila tiene dos bolsillos.', 'La mochila pesa poco.'],
  },
  {
    question: '¿Qué oración describe el tamaño de una pelota?',
    answer: 'La pelota es pequeña, como una naranja.',
    wrong: ['La pelota es azul.', 'La pelota tiene estrellas dibujadas.', 'La pelota es de goma.'],
  },
  {
    question: '¿Qué oración habla de las partes de una bicicleta?',
    answer: 'La bicicleta tiene un manillar, un sillín y dos ruedas.',
    wrong: ['La bicicleta es verde.', 'La bicicleta es pequeña.', 'La bicicleta es muy bonita.'],
  },
  { question: '¿Qué palabra dice el tamaño de algo?', answer: 'enorme', wrong: ['amarillo', 'suave', 'morado'] },
  { question: '¿Qué palabra dice el color de algo?', answer: 'morado', wrong: ['grande', 'pequeño', 'diminuto'] },
  {
    question: '¿Cómo se llama la parte de la bicicleta donde nos sentamos?',
    answer: 'el sillín',
    wrong: ['el manillar', 'el pedal', 'el timbre'],
  },
  {
    question: '¿Qué parte de la bicicleta sirve para avisar con un sonido?',
    answer: 'el timbre',
    wrong: ['el sillín', 'el pedal', 'la cesta'],
  },
  {
    question: '¿Qué parte de la bicicleta se agarra con las manos para girar?',
    answer: 'el manillar',
    wrong: ['el sillín', 'el pedal', 'el timbre'],
  },
]

// ── La biblioteca del colegio ──────────────────────────────────────────────────────────────────────────────────────────
const NORMAS: Group[] = [
  { id: 'bien', label: 'se debe hacer', question: '¿Qué se debe hacer en la biblioteca?' },
  { id: 'mal', label: 'no se debe hacer', question: '¿Qué no se debe hacer en la biblioteca?' },
]
const COMPORTAMIENTOS: Member[] = [
  ...[
    'hablar en voz baja',
    'cuidar los libros',
    'devolver los libros a tiempo',
    'dejar cada libro en su sitio',
    'pasar las páginas con cuidado',
    'tener las manos limpias',
    'enseñar el carné para llevarse un libro',
  ].map((p) => miembro(p, 'bien')),
  ...[
    'gritar',
    'escribir en los libros',
    'pintar en los libros',
    'comer encima de los libros',
    'correr entre las estanterías',
    'doblar las páginas',
    'quedarse los libros prestados',
  ].map((p) => miembro(p, 'mal')),
]

// Tipos de libro (no está el cuento: también lo puede ser un cómic o una obra de teatro)
const libro = par(
  (tipo) => `¿Qué tiene ${tipo}?`,
  (contenido) => `¿Qué libro tiene ${contenido}?`,
)
const LIBROS: PairRow[] = [
  libro('un cómic', 'viñetas y bocadillos'),
  libro('un libro de poesía', 'versos que riman'),
  libro('una obra de teatro', 'diálogos para representar'),
  libro('un diccionario', 'palabras ordenadas por el abecedario'),
  libro('un atlas', 'mapas de los países'),
  libro('un libro de recetas', 'cómo se preparan las comidas'),
]

const BIBLIOTECA: FactItem[] = [
  {
    question: '¿Qué hace falta para llevarse un libro prestado de la biblioteca?',
    answer: 'el carné de la biblioteca',
    wrong: ['una entrada de cine', 'un billete de tren', 'un bañador'],
  },
  {
    question: '¿Para qué sirven los libros de consulta?',
    answer: 'para buscar información',
    wrong: ['para colorearlos', 'para hacer aviones de papel', 'para tirarlos'],
  },
  {
    question: '¿Qué hay que hacer con un libro prestado?',
    answer: 'devolverlo a tiempo',
    wrong: ['quedárselo', 'venderlo', 'pintarlo'],
  },
  {
    question: '¿Cómo se llama el sitio del colegio donde hay muchos libros?',
    answer: 'la biblioteca',
    wrong: ['el gimnasio', 'el comedor', 'el patio'],
  },
  {
    question: '¿Dónde se colocan los libros en la biblioteca?',
    answer: 'en las estanterías',
    wrong: ['en el suelo', 'en la nevera', 'en la papelera'],
  },
  {
    question: '¿Para qué sirve la biblioteca del colegio?',
    answer: 'para leer, consultar y llevarse libros prestados',
    wrong: ['para comer', 'para hacer deporte', 'para dormir la siesta'],
  },
]

// ── Comprensión lectora ────────────────────────────────────────────────────────────────────────────────────────────────
// Textos propios y cortos, como los del libro: dos cuentos, dos diálogos y dos poemas. En los diálogos cada intervención va
// en su línea y en los poemas cada verso (la tarjeta de lectura respeta los saltos de línea).
const COLORES =
  'Martina quería pintar el mar, pero solo tenía pintura azul y amarilla. Probó a mezclarlas en la paleta y le salió un verde precioso. Entonces pintó un bosque junto al mar. Su abuelo colgó el cuadro en el salón.'
const GRILLO =
  'Un grillo pequeño quería tocar en el concierto del bosque, pero le daba vergüenza. La rana le prestó un tambor y la ardilla le enseñó a llevar el ritmo. La noche del concierto, el grillo tocó tan bien que todos los animales aplaudieron.'
const MUSEO =
  '—¿Vamos al museo esta tarde? —preguntó Hugo.\n—¡Sí! Quiero ver los cuadros de animales —contestó Sara.\n—Yo prefiero las esculturas de piedra —dijo Hugo.\n—Pues veremos las dos cosas —dijo Sara riendo.'
const DISFRACES =
  '—¿Qué disfraz llevaréis a la función? —preguntó la maestra.\n—Yo seré un pirata con un parche en el ojo —respondió Leo.\n—Y yo, una princesa valiente con una espada de cartón —dijo Ana.'
const PINCEL = 'Con mi pincel de colores\npinto un sol y muchas flores.\nPinto el mar, azul y fresco,\ny un barquito pintoresco.'
const ORQUESTA = 'Toca el tambor: ¡pom, pom, pom!\nSuena la flauta: ¡tirurí!\nLa guitarra canta bajito\ny el piano dice: ¡aquí!'

const leer = (text: string, question: string, answer: string, wrong: string[]): FactItem => ({ text, question, answer, wrong })
const LECTURAS: FactItem[] = [
  leer(COLORES, '¿Qué quería pintar Martina?', 'el mar', ['una casa', 'un gato', 'la luna']),
  leer(COLORES, '¿Qué pinturas tenía Martina?', 'azul y amarilla', ['roja y blanca', 'verde y negra', 'rosa y morada']),
  leer(COLORES, '¿Qué color le salió al mezclarlas?', 'verde', ['naranja', 'morado', 'marrón']),
  leer(COLORES, '¿Dónde colgó el abuelo el cuadro?', 'en el salón', ['en la cocina', 'en el colegio', 'en el museo']),
  leer(GRILLO, '¿Dónde quería tocar el grillo?', 'en el concierto del bosque', ['en el colegio', 'en la playa', 'en la ciudad']),
  leer(GRILLO, '¿Qué le pasaba al grillo al principio?', 'le daba vergüenza', ['tenía hambre', 'estaba enfermo', 'tenía sueño']),
  leer(GRILLO, '¿Qué le prestó la rana al grillo?', 'un tambor', ['una flauta', 'una guitarra', 'un piano']),
  leer(GRILLO, '¿Qué hicieron los animales al final del concierto?', 'aplaudieron', ['se durmieron', 'se fueron a casa', 'se enfadaron']),
  leer(MUSEO, '¿Adónde quieren ir Hugo y Sara?', 'al museo', ['al cine', 'al parque', 'a la piscina']),
  leer(MUSEO, '¿Cuándo quieren ir al museo?', 'esta tarde', ['mañana por la mañana', 'el domingo', 'por la noche']),
  leer(MUSEO, '¿Qué prefiere ver Hugo?', 'las esculturas de piedra', ['los cuadros de animales', 'los coches antiguos', 'los dinosaurios']),
  leer(MUSEO, '¿Qué deciden al final Hugo y Sara?', 'ver las dos cosas', ['volver a casa', 'ver solo los cuadros', 'ir otro día']),
  leer(DISFRACES, '¿Quién pregunta por los disfraces?', 'la maestra', ['el conserje', 'el abuelo de Leo', 'un payaso']),
  leer(DISFRACES, '¿De qué se disfraza Leo?', 'de pirata', ['de princesa', 'de dragón', 'de mago']),
  leer(DISFRACES, '¿Qué lleva Leo en el ojo?', 'un parche', ['unas gafas', 'una pegatina', 'una venda']),
  leer(DISFRACES, '¿De qué es la espada de Ana?', 'de cartón', ['de madera', 'de hierro', 'de plástico']),
  leer(PINCEL, '¿Con qué se pinta en el poema?', 'con un pincel de colores', ['con los dedos', 'con un lápiz', 'con una esponja']),
  leer(PINCEL, '¿Qué se pinta además del sol?', 'muchas flores', ['muchas nubes', 'un tren', 'una casa']),
  leer(PINCEL, '¿Cómo es el mar del poema?', 'azul y fresco', ['verde y caliente', 'gris y oscuro', 'rojo y tranquilo']),
  leer(PINCEL, '¿Qué palabra rima con «colores» en el poema?', 'flores', ['pincel', 'sol', 'mar']),
  leer(ORQUESTA, '¿Qué instrumento hace «pom, pom, pom»?', 'el tambor', ['la flauta', 'el piano', 'la guitarra']),
  leer(ORQUESTA, '¿Cómo suena la flauta del poema?', '¡tirurí!', ['¡pom, pom, pom!', '¡aquí!', '¡miau!']),
  leer(ORQUESTA, '¿Qué instrumento canta bajito?', 'la guitarra', ['el tambor', 'la flauta', 'el piano']),
  leer(ORQUESTA, '¿Qué dice el piano?', '¡aquí!', ['¡tirurí!', '¡pom, pom, pom!', '¡adiós!']),
]

const temasDeLaUnidad: Topic[] = [
  {
    id: 'arte',
    name: 'Palabras del arte',
    icon: '🖌️',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'pairs', rows: DEFINICIONES }, count: 4 },
      { spec: { kind: 'classify', question: '¿Con qué arte tiene que ver «{item}»?', groups: ARTES, items: PALABRAS_DEL_ARTE }, count: 3 },
      { spec: { kind: 'facts', items: ARTE }, count: 3 },
    ],
  },
  {
    id: 'aumentativos',
    name: 'Aumentativos y diminutivos',
    icon: '🔍',
    tint: '#d8ecff',
    plan: [
      { spec: { kind: 'pairs', rows: DIMINUTIVOS }, count: 3 },
      { spec: { kind: 'pairs', rows: AUMENTATIVOS }, count: 3 },
      { spec: { kind: 'pick-member', groups: TAMANOS, items: DERIVADAS }, count: 2 },
      { spec: { kind: 'facts', items: SOBRE_TAMANOS }, count: 2 },
    ],
  },
  {
    id: 'c-qu',
    name: 'ca, co, cu, que, qui',
    icon: '🧀',
    tint: '#fff0c2',
    plan: [
      { spec: { kind: 'pick-member', groups: SILABAS, items: PALABRAS_K }, count: 3 },
      { spec: { kind: 'facts', items: ESCRIBIR_K }, count: 4 },
      { spec: { kind: 'facts', items: COMPLETAR_K }, count: 2 },
      { spec: { kind: 'facts', items: REGLA_K }, count: 1 },
    ],
  },
  {
    id: 'completar',
    name: 'Completar oraciones',
    icon: '🧩',
    tint: '#ffd9d2',
    plan: [
      { spec: { kind: 'facts', items: FINALES }, count: 6 },
      { spec: { kind: 'facts', items: COMPLETAS }, count: 4 },
    ],
  },
  {
    id: 'sustantivos',
    name: 'Sustantivos comunes y propios',
    icon: '🏷️',
    tint: '#d9f4d2',
    plan: [
      { spec: { kind: 'classify', question: '¿A quién o a qué nombra «{item}»?', groups: NOMBRAN, items: COMUNES }, count: 3 },
      { spec: { kind: 'pairs', rows: PROPIOS }, count: 3 },
      { spec: { kind: 'facts', items: SUSTANTIVOS }, count: 4 },
    ],
  },
  {
    id: 'describir',
    name: 'Describir objetos',
    icon: '🚲',
    tint: '#e3dbff',
    plan: [
      { spec: { kind: 'classify', question: 'Al describir una bici, ¿qué dice «{item}»?', groups: DATOS, items: PALABRAS_DE_LA_BICI }, count: 3 },
      { spec: { kind: 'pairs', rows: PARTES }, count: 3 },
      { spec: { kind: 'facts', items: DESCRIBIR }, count: 4 },
    ],
  },
  {
    id: 'biblioteca',
    name: 'La biblioteca del colegio',
    icon: '📚',
    tint: '#ffe0f0',
    plan: [
      { spec: { kind: 'pick-member', groups: NORMAS, items: COMPORTAMIENTOS }, count: 4 },
      { spec: { kind: 'pairs', rows: LIBROS }, count: 3 },
      { spec: { kind: 'facts', items: BIBLIOTECA }, count: 3 },
    ],
  },
  {
    id: 'lectura',
    name: 'Comprensión lectora',
    icon: '📖',
    tint: '#ffe9a8',
    plan: [{ spec: { kind: 'facts', items: LECTURAS }, count: 10 }],
  },
]

// ── Repaso del primer trimestre ────────────────────────────────────────────────────────────────────────────────────────
// Un poco de cada unidad, como en Conocimiento del medio. El libro no trae un repaso del trimestre: el tema es de la web.
// No copia tablas: toma bloques de las unidades 1, 2 y 3, que ya tienen su tabla de verdad independiente en los tests, y
// añade unos pocos hechos que mezclan las tres (sin comprensión lectora, que tiene su tema en cada unidad).
const REPASO: FactItem[] = [
  {
    question: '¿Qué tienen en común «perrito» y «perrazo»?',
    answer: 'vienen de la palabra «perro»',
    wrong: ['significan lo mismo', 'son nombres propios', 'riman con «gato»'],
  },
  {
    question: '¿Qué nombre se escribe siempre con mayúscula?',
    answer: 'el nombre de un río, como Ebro',
    wrong: ['el nombre de un animal, como perro', 'el nombre de una fruta, como pera', 'el nombre de un color, como rojo'],
  },
  { question: '¿Qué es lo contrario de un diminutivo?', answer: 'un aumentativo', wrong: ['un sinónimo', 'un sustantivo', 'un nombre propio'] },
  {
    question: '¿Qué oración tiene bien escritas la mayúscula, la rr y la qu?',
    answer: 'Mi perro Toby come queso.',
    wrong: ['Mi pero Toby come queso.', 'Mi perro toby come queso.', 'Mi perro Toby come ceso.'],
  },
]

const bloqueDe = (temas: Topic[], tema: string, i: number) => temas.find((t) => t.id === tema)!.plan[i].spec

const repaso: Topic = {
  id: 'repaso',
  name: 'Repaso del primer trimestre',
  icon: '🏁',
  tint: '#cfe8ff',
  plan: [
    { spec: bloqueDe(temasUnidad1, 'mayuscula', 2), count: 1 }, // frases con la mayúscula bien puesta
    { spec: bloqueDe(temasUnidad1, 'sinonimos', 0), count: 1 }, // sinónimos
    { spec: bloqueDe(temasUnidad1, 'abecedario', 0), count: 1 }, // orden del abecedario
    { spec: bloqueDe(temasUnidad2, 'erre', 0), count: 1 }, // r suave, r fuerte, rr
    { spec: bloqueDe(temasUnidad2, 'antonimos', 0), count: 1 }, // antónimos (adjetivos)
    { spec: bloqueDe(temasUnidad2, 'oral-escrita', 0), count: 1 }, // lengua oral o escrita
    { spec: bloqueDe(temasDeLaUnidad, 'c-qu', 1), count: 1 }, // cómo se escribe con c o con qu
    { spec: bloqueDe(temasDeLaUnidad, 'aumentativos', 0), count: 1 }, // diminutivos
    { spec: bloqueDe(temasDeLaUnidad, 'sustantivos', 1), count: 1 }, // nombre propio ↔ nombre común
    { spec: { kind: 'facts', items: REPASO }, count: 1 },
  ],
}

export const temasUnidad3: Topic[] = [...temasDeLaUnidad, repaso]
