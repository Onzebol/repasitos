import type { FactItem, Group, Member, PairRow, Topic } from '../../types'
import { temasUnidad1 } from './unidad1'
import { temasUnidad2 } from './unidad2'

// Unidad 3: «Identificamos plantas» (ver docs/conocimiento-del-medio-2-primaria.md). Igual que las unidades 1 y 2: ejercicios
// escritos desde cero que se generan al azar a partir de tablas (src/generators.ts: classify, pick-member, sequence, pairs y
// facts). Lo que es una tabla cerrada (tipo de tallo, hoja perenne o caduca, con flor o sin ella, para qué sirve cada producto)
// se pregunta en varias direcciones y las opciones equivocadas salen de la propia tabla, así que son falsas por construcción;
// los hechos sueltos llevan sus respuestas equivocadas escritas a mano y seguras. Solo se usan plantas y partes inequívocas
// (nada de coliflor, espárrago, patata, cereales, pan o cartón) y cada bloque tiene al menos el doble de hechos que los que
// toma una sesión.

const planta = (label: string, group: string, emoji?: string): Member => (emoji ? { label, group, emoji } : { label, group })

// ── ¿Qué tienen las plantas en común? ──────────────────────────────────────────────────────────────────────────────────
// Son seres vivos que viven fijos al suelo; hojas, tallo, raíces, flores y frutos con su función.
const PARTES: PairRow[] = [
  {
    ask: '¿Para qué sirven las raíces?',
    answer: 'para sujetar la planta al suelo y absorber agua',
    askBack: '¿Qué parte de la planta la sujeta al suelo y absorbe agua?',
    answerBack: 'las raíces',
  },
  {
    ask: '¿Para qué sirve el tallo?',
    answer: 'para sostener la planta y repartir el agua y el alimento',
    askBack: '¿Qué parte de la planta la sostiene y reparte el agua y el alimento?',
    answerBack: 'el tallo',
  },
  {
    ask: '¿Para qué sirven las hojas?',
    answer: 'para captar la luz y el aire y fabricar alimento',
    askBack: '¿Qué parte de la planta capta la luz y el aire para fabricar alimento?',
    answerBack: 'las hojas',
    emoji: '🍃',
  },
  {
    ask: '¿Para qué sirven los frutos?',
    answer: 'para guardar las semillas',
    askBack: '¿Qué parte de la planta guarda las semillas?',
    answerBack: 'los frutos',
  },
  {
    ask: '¿Para qué sirven las flores?',
    answer: 'para que se formen los frutos',
    askBack: '¿Qué parte de la planta hace que se formen los frutos?',
    answerBack: 'las flores',
    emoji: '🌸',
  },
]

const NECESIDADES: Group[] = [
  { id: 'necesita', label: 'lo necesita', question: '¿Cuál de estas cosas necesita una planta para vivir?' },
  { id: 'no', label: 'no lo necesita', question: '¿Cuál de estas cosas NO necesita una planta para vivir?' },
]
const COSAS: Member[] = [
  { label: 'agua', group: 'necesita' },
  { label: 'luz del sol', group: 'necesita' },
  { label: 'aire', group: 'necesita' },
  { label: 'sustancias de la tierra', group: 'necesita' },
  { label: 'un abrigo', group: 'no' },
  { label: 'una cama', group: 'no' },
  { label: 'una bicicleta', group: 'no' },
  { label: 'un televisor', group: 'no' },
]

const comun: FactItem[] = [
  {
    question: '¿Las plantas son seres vivos?',
    answer: 'sí, nacen, crecen y se reproducen',
    wrong: ['no, porque no se mueven', 'no, porque no comen', 'no, porque no necesitan agua'],
    visual: '🌱',
  },
  { question: 'Las plantas viven…', answer: 'fijas al suelo', wrong: ['andando por el campo', 'volando por el cielo', 'nadando bajo tierra'] },
  {
    question: '¿Cómo se llama el proceso con el que las plantas fabrican su alimento?',
    answer: 'fotosíntesis',
    wrong: ['digestión', 'germinación', 'reproducción'],
  },
  {
    question: '¿De qué color son las partes de la planta que fabrican el alimento?',
    answer: 'verdes',
    wrong: ['rojas', 'azules', 'negras'],
  },
  { question: '¿Qué recibe la planta del sol?', answer: 'luz', wrong: ['leche', 'pan', 'ruido'], visual: '☀️' },
  { question: '¿Qué contienen los frutos?', answer: 'las semillas', wrong: ['las raíces', 'el tallo', 'las hojas'] },
  { question: '¿Qué toman las raíces del suelo?', answer: 'agua y sustancias', wrong: ['solo luz', 'solo aire', 'piedras'] },
  {
    question: '¿Qué tienen en común todas las plantas?',
    answer: 'son seres vivos',
    wrong: ['se desplazan por sí mismas', 'siempre tienen flores', 'siempre tienen frutos'],
  },
  {
    question: 'Las plantas necesitan agua, aire, luz del sol y…',
    answer: 'sustancias de la tierra',
    wrong: ['juguetes', 'ropa', 'chuches'],
  },
  { question: '¿Qué reparte el tallo por la planta?', answer: 'agua y alimento', wrong: ['luz y ruido', 'piedras', 'música'] },
]

// ── ¿Cómo clasificamos las plantas? ────────────────────────────────────────────────────────────────────────────────────
// Por el tallo (árbol, arbusto, hierba), por las hojas (perenne o caduca) y por las flores (con flor o sin ella: helechos
// y musgos).
const TALLOS: Group[] = [
  { id: 'arbol', label: 'árbol', question: '¿Cuál de estas plantas es un árbol?' },
  { id: 'arbusto', label: 'arbusto', question: '¿Cuál de estas plantas es un arbusto?' },
  { id: 'hierba', label: 'hierba', question: '¿Cuál de estas plantas es una hierba?' },
]
const PLANTAS_POR_TALLO: Member[] = [
  planta('la encina', 'arbol'),
  planta('el olivo', 'arbol'),
  planta('el castaño', 'arbol'),
  planta('el roble', 'arbol'),
  planta('el pino', 'arbol', '🌲'),
  planta('la lila', 'arbusto'),
  planta('el rosal', 'arbusto', '🌹'),
  planta('el romero', 'arbusto'),
  planta('el boj', 'arbusto'),
  planta('la amapola', 'hierba'),
  planta('la margarita', 'hierba', '🌼'),
  planta('el trébol', 'hierba'),
  planta('el diente de león', 'hierba'),
]

const HOJAS: Group[] = [
  { id: 'perenne', label: 'hoja perenne', question: '¿Cuál de estos árboles tiene hojas todo el año?' },
  { id: 'caduca', label: 'hoja caduca', question: '¿Cuál de estos árboles pierde las hojas en otoño?' },
]
const ARBOLES_POR_HOJA: Member[] = [
  planta('el pino', 'perenne'),
  planta('la encina', 'perenne'),
  planta('el olivo', 'perenne'),
  planta('el abeto', 'perenne'),
  planta('el roble', 'caduca'),
  planta('el castaño', 'caduca'),
  planta('el nogal', 'caduca'),
  planta('el cerezo', 'caduca'),
]

const FLORES: Group[] = [
  { id: 'conflor', label: 'con flor', question: '¿Cuál de estas plantas tiene flores?' },
  { id: 'sinflor', label: 'sin flor', question: '¿Cuál de estas plantas NO tiene flores?' },
]
const PLANTAS_POR_FLOR: Member[] = [
  planta('el castaño', 'conflor'),
  planta('la lavanda', 'conflor'),
  planta('la violeta', 'conflor'),
  planta('la orquídea', 'conflor'),
  planta('la margarita', 'conflor', '🌼'),
  planta('la amapola', 'conflor'),
  planta('el rosal', 'conflor', '🌹'),
  planta('el helecho', 'sinflor', '🌿'),
  planta('el musgo', 'sinflor'),
]

// El roble (hoja caduca) a lo largo del año
const ESTACIONES: PairRow[] = [
  {
    ask: '¿Qué le pasa al roble en primavera?',
    answer: 'le salen hojas nuevas',
    askBack: '¿Cuándo le salen hojas nuevas al roble?',
    answerBack: 'en primavera',
  },
  {
    ask: '¿Cómo está el roble en verano?',
    answer: 'tiene muchas hojas verdes',
    askBack: '¿Cuándo tiene el roble muchas hojas verdes?',
    answerBack: 'en verano',
  },
  {
    ask: '¿Qué le pasa al roble en otoño?',
    answer: 'las hojas cambian de color y caen',
    askBack: '¿Cuándo cambian de color y caen las hojas del roble?',
    answerBack: 'en otoño',
  },
  {
    ask: '¿Cómo está el roble en invierno?',
    answer: 'se queda sin hojas',
    askBack: '¿Cuándo se queda el roble sin hojas?',
    answerBack: 'en invierno',
  },
]

const clasificar: FactItem[] = [
  { question: '¿Cómo es el tronco de un árbol?', answer: 'grueso y alto', wrong: ['fino y flexible', 'blando y verde', 'bajito y fino'] },
  { question: '¿Cómo es el tallo de una hierba?', answer: 'fino, flexible y verde', wrong: ['grueso y duro', 'muy alto', 'de madera'] },
  { question: '¿Cómo es el tallo de un arbusto?', answer: 'fino y duro', wrong: ['grueso y muy alto', 'verde y blando', 'no tiene tallo'] },
  { question: '¿Qué planta es más alta?', answer: 'el árbol', wrong: ['la hierba', 'la margarita', 'el musgo'] },
  {
    question: 'Las plantas de hoja perenne…',
    answer: 'tienen hojas todo el año',
    wrong: ['pierden las hojas en otoño', 'no tienen hojas', 'solo tienen hojas en verano'],
  },
  {
    question: 'Las plantas de hoja caduca…',
    answer: 'pierden las hojas en otoño',
    wrong: ['tienen hojas todo el año', 'no tienen hojas nunca', 'solo tienen hojas en primavera'],
  },
  {
    question: '¿Qué plantas no tienen flores?',
    answer: 'los helechos y los musgos',
    wrong: ['los rosales', 'las margaritas', 'las amapolas'],
  },
]

// ── Las plantas se reproducen ──────────────────────────────────────────────────────────────────────────────────────────
// Ciclo de una planta con semillas (semilla, brote, planta con flores, fruto con semillas); helechos y musgos se
// reproducen por esporas.
const SEMILLAS_O_ESPORAS: Group[] = [
  { id: 'semillas', label: 'semillas', question: '¿Cuál de estas plantas se reproduce por semillas?' },
  { id: 'esporas', label: 'esporas', question: '¿Cuál de estas plantas se reproduce por esporas?' },
]
const PLANTAS_REPRODUCCION: Member[] = [
  planta('el castaño', 'semillas'),
  planta('el rosal', 'semillas', '🌹'),
  planta('la margarita', 'semillas', '🌼'),
  planta('la amapola', 'semillas'),
  planta('la lavanda', 'semillas'),
  planta('la violeta', 'semillas'),
  planta('el helecho', 'esporas', '🌿'),
  planta('el musgo', 'esporas'),
]

const reproduccion: FactItem[] = [
  { question: '¿Qué necesita una semilla para germinar?', answer: 'agua y calor', wrong: ['solo luz de luna', 'ruido', 'azúcar y sal'], visual: '🌰' },
  { question: '¿Qué sale de la semilla cuando germina?', answer: 'una nueva planta', wrong: ['una piedra', 'un huevo', 'un fruto grande'] },
  {
    question: '¿Qué llevan el viento y los insectos de una flor a otra?',
    answer: 'el polen',
    wrong: ['las raíces', 'la leche', 'el agua del mar'],
  },
  { question: '¿En qué se convierten la mayoría de las flores?', answer: 'en frutos', wrong: ['en raíces', 'en hojas', 'en troncos'] },
  { question: '¿Dónde están las semillas?', answer: 'dentro de los frutos', wrong: ['dentro de las raíces', 'en el tronco', 'en el polen'] },
  { question: '¿Cómo se reproducen los helechos?', answer: 'con esporas', wrong: ['con semillas', 'con huevos', 'con frutos'] },
  {
    question: '¿Tienen semillas los musgos?',
    answer: 'no, se reproducen por esporas',
    wrong: ['sí, dentro de un fruto', 'sí, dentro de una flor', 'sí, en las raíces'],
  },
  { question: '¿Qué hace la semilla al caer al suelo húmedo?', answer: 'germina', wrong: ['vuela', 'se hace fruto', 'se convierte en piedra'] },
]

// ── ¿Por qué son importantes las plantas? ──────────────────────────────────────────────────────────────────────────────
// Alimento, materiales, refugio y oxígeno; plantas silvestres y cultivadas; las tareas del agricultor.
const USOS: Group[] = [
  { id: 'comer', label: 'para comer' },
  { id: 'muebles', label: 'para hacer muebles' },
  { id: 'telas', label: 'para hacer telas' },
]
const PRODUCTOS: Member[] = [
  planta('la manzana', 'comer', '🍎'),
  planta('la lechuga', 'comer', '🥬'),
  planta('la zanahoria', 'comer', '🥕'),
  planta('el tomate', 'comer', '🍅'),
  planta('la naranja', 'comer', '🍊'),
  planta('la fresa', 'comer', '🍓'),
  planta('la madera del roble', 'muebles'),
  planta('la madera del pino', 'muebles'),
  planta('la madera del castaño', 'muebles'),
  planta('el algodón', 'telas'),
  planta('el lino', 'telas'),
]

const ORIGEN: Group[] = [
  { id: 'silvestre', label: 'silvestre', question: '¿Cuál de estas plantas es silvestre?' },
  { id: 'cultivada', label: 'cultivada', question: '¿Cuál de estas plantas es cultivada?' },
]
const PLANTAS_ORIGEN: Member[] = [
  planta('el roble del bosque', 'silvestre'),
  planta('la amapola del campo', 'silvestre'),
  planta('el helecho del bosque', 'silvestre'),
  planta('la encina del monte', 'silvestre'),
  planta('el tomate de la huerta', 'cultivada', '🍅'),
  planta('el trigo del campo', 'cultivada'),
  planta('la lechuga de la huerta', 'cultivada', '🥬'),
  planta('el naranjo del huerto', 'cultivada'),
]

const importancia: FactItem[] = [
  { question: '¿Qué gas respiramos que nos dan las plantas?', answer: 'oxígeno', wrong: ['humo', 'polvo', 'vapor'] },
  {
    question: 'Las plantas silvestres…',
    answer: 'crecen solas en la naturaleza',
    wrong: ['las siembran las personas', 'solo crecen en casa', 'nunca crecen en el bosque'],
  },
  {
    question: 'Las plantas cultivadas…',
    answer: 'las siembran y cuidan las personas',
    wrong: ['crecen solas en la selva', 'no necesitan agua', 'no se pueden comer'],
  },
  { question: '¿Qué dan los árboles a muchos animales?', answer: 'refugio', wrong: ['ruedas', 'electricidad', 'dinero'] },
  { question: '¿Qué persona cuida las plantas del campo?', answer: 'el agricultor', wrong: ['el bombero', 'el panadero', 'el médico'] },
  { question: '¿Qué podemos hacer con la madera de los árboles?', answer: 'muebles', wrong: ['cristal', 'plástico', 'metal'] },
  {
    question: '¿Qué nos dan las plantas?',
    answer: 'alimento, refugio, materiales y oxígeno',
    wrong: ['solo juguetes', 'solo ropa', 'nada'],
  },
  { question: '¿Qué ayudan a limpiar las plantas?', answer: 'el aire', wrong: ['la ropa', 'el coche', 'el mar'] },
  {
    question: '¿Qué hace falta para que una planta cultivada crezca sana?',
    answer: 'regarla y cuidarla',
    wrong: ['no tocarla nunca', 'dejarla sin agua', 'taparla con una caja'],
  },
]

// ── Repaso del primer trimestre ────────────────────────────────────────────────────────────────────────────────────────
// Un poco de cada unidad (¡Cuánto sabes ya!). No copia tablas: toma bloques de las unidades 1, 2 y 3, que ya tienen su
// tabla de verdad independiente en los tests, y añade unos pocos hechos sueltos que mezclan las tres.
const repasoHechos: FactItem[] = [
  { question: '¿Cuál de estos insectos no tiene alas?', answer: 'la pulga', wrong: ['la abeja', 'la mariposa', 'el mosquito'] },
  {
    question: '¿Qué diferencia a un árbol de una hierba?',
    answer: 'el árbol tiene el tronco grueso y alto',
    wrong: ['la hierba tiene el tronco grueso', 'el árbol no tiene tallo', 'la hierba es más alta'],
  },
  {
    question: '¿Cómo se llaman los lugares donde viven los animales?',
    answer: 'hábitats',
    wrong: ['colegios', 'nubes', 'caminos'],
  },
  {
    question: '¿Qué tienen en común las plantas y los animales?',
    answer: 'son seres vivos: nacen, crecen y se reproducen',
    wrong: ['siempre vuelan', 'viven fijos al suelo', 'siempre tienen patas'],
  },
]

const bloqueDe = (temas: Topic[], tema: string, i: number) => temas.find((t) => t.id === tema)!.plan[i].spec

const temasDeLaUnidad: Topic[] = [
  {
    id: 'comun',
    name: '¿Qué tienen las plantas en común?',
    icon: '🌱',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'pairs', rows: PARTES }, count: 2 },
      { spec: { kind: 'pick-member', groups: NECESIDADES, items: COSAS }, count: 3 },
      { spec: { kind: 'facts', items: comun }, count: 5 },
    ],
  },
  {
    id: 'clasificar',
    name: '¿Cómo clasificamos las plantas?',
    icon: '🌳',
    tint: '#d7f0c8',
    plan: [
      { spec: { kind: 'classify', question: '¿Qué tipo de planta es {item}?', groups: TALLOS, items: PLANTAS_POR_TALLO }, count: 3 },
      { spec: { kind: 'pick-member', groups: HOJAS, items: ARBOLES_POR_HOJA }, count: 2 },
      { spec: { kind: 'pick-member', groups: FLORES, items: PLANTAS_POR_FLOR }, count: 1 },
      { spec: { kind: 'pairs', rows: ESTACIONES }, count: 1 },
      { spec: { kind: 'facts', items: clasificar }, count: 3 },
    ],
  },
  {
    id: 'reproduccion',
    name: 'Las plantas se reproducen',
    icon: '🌸',
    tint: '#ffd1dc',
    plan: [
      {
        spec: {
          kind: 'sequence',
          id: 'semilla',
          steps: ['una semilla', 'un brote', 'una planta con flores', 'un fruto con semillas'],
          extra: ['un huevo', 'un nido'],
          first: '¿Qué viene primero en la vida de una planta con semillas?',
          last: '¿Qué viene en último lugar en la vida de una planta con semillas?',
          after: '¿Qué viene justo después de {step} en la vida de una planta?',
          before: '¿Qué viene justo antes de {step} en la vida de una planta?',
        },
        count: 3,
      },
      { spec: { kind: 'pick-member', groups: SEMILLAS_O_ESPORAS, items: PLANTAS_REPRODUCCION }, count: 3 },
      { spec: { kind: 'facts', items: reproduccion }, count: 4 },
    ],
  },
  {
    id: 'importancia',
    name: '¿Por qué son importantes las plantas?',
    icon: '🌾',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'classify', question: '¿Para qué sirve {item}?', groups: USOS, items: PRODUCTOS }, count: 2 },
      { spec: { kind: 'pick-member', groups: ORIGEN, items: PLANTAS_ORIGEN }, count: 2 },
      {
        spec: {
          kind: 'sequence',
          id: 'agricultor',
          steps: ['preparar la tierra y sembrar', 'regar y cuidar las plantas', 'recoger la cosecha'],
          extra: ['cantar una canción', 'dormir la siesta'],
          first: '¿Qué hace primero el agricultor?',
          last: '¿Qué hace el agricultor al final?',
          after: '¿Qué hace el agricultor justo después de {step}?',
          before: '¿Qué hace el agricultor justo antes de {step}?',
        },
        count: 2,
      },
      { spec: { kind: 'facts', items: importancia }, count: 4 },
    ],
  },
]

const repaso: Topic = {
  id: 'repaso',
  name: 'Repaso del primer trimestre',
  icon: '🏁',
  tint: '#cfe8ff',
  plan: [
    { spec: bloqueDe(temasUnidad1, 'funciones', 2), count: 1 },
    { spec: bloqueDe(temasUnidad1, 'movimiento', 1), count: 1 },
    { spec: bloqueDe(temasUnidad1, 'alimentacion', 0), count: 1 },
    { spec: bloqueDe(temasUnidad2, 'vertebrados', 1), count: 1 },
    { spec: bloqueDe(temasUnidad2, 'vertebrados', 0), count: 1 },
    { spec: bloqueDe(temasUnidad2, 'habitat', 2), count: 1 },
    { spec: bloqueDe(temasUnidad2, 'invertebrados', 0), count: 1 },
    { spec: bloqueDe(temasDeLaUnidad, 'clasificar', 0), count: 1 },
    { spec: { kind: 'facts', items: repasoHechos }, count: 2 },
  ],
}

export const temasUnidad3: Topic[] = [...temasDeLaUnidad, repaso]
