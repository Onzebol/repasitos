import type { FactItem, Group, Member, PairRow, Topic } from '../../types'

// Unidad 1: «Crecemos y cambiamos» (ver docs/conocimiento-del-medio-2-primaria.md). Ejercicios escritos desde cero con el
// vocabulario de la unidad, en el orden de sus cinco saberes. Las preguntas se generan al azar a partir de tablas
// (src/generators.ts: classify, pick-member, sequence, pairs y facts), así que cada sesión es distinta:
//  - lo que es una tabla cerrada (a qué grupo pertenece un alimento, qué tipo de parte del cuerpo es una, el orden de unos
//    pasos, sentido ↔ órgano) se pregunta en varias direcciones y las opciones equivocadas salen de la propia tabla, así
//    que son falsas por construcción;
//  - lo que es un hecho suelto (por ejemplo «los huesos son duros y rígidos») lleva sus propias respuestas equivocadas,
//    escritas a mano y seguras (al menos tres), y se eligen dos al azar.
// Cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión, para que una sesión no repita la
// anterior. Solo se usan elementos que el libro sitúa con claridad (nada de legumbres, arroz, frutos secos o fritos).

// ── Nuestro cuerpo cambia ──────────────────────────────────────────────────────────────────────────────────────────────
// Etapas de la vida (infancia, adolescencia, edad adulta y ancianidad), dientes de leche y definitivos, y lo que cambia al
// crecer (no cambia el color de los ojos).
const CAMBIOS: Group[] = [
  { id: 'cambia', label: 'cambia', question: '¿Qué cambia cuando crecemos?' },
  { id: 'nocambia', label: 'no cambia', question: '¿Qué NO cambia cuando crecemos?' },
]
const COSAS: Member[] = [
  { label: 'la altura', group: 'cambia' },
  { label: 'el número de pie', group: 'cambia' },
  { label: 'la voz', group: 'cambia' },
  { label: 'los dientes', group: 'cambia' },
  { label: 'el peso', group: 'cambia' },
  { label: 'el color de los ojos', group: 'nocambia' },
  { label: 'el día en que nacimos', group: 'nocambia' },
  { label: 'el lugar donde nacimos', group: 'nocambia' },
]

const crecer: FactItem[] = [
  {
    question: '¿Qué hace nuestro cuerpo desde que nacemos?',
    answer: 'crece y se hace más fuerte',
    wrong: ['se hace más pequeño', 'se queda siempre igual', 'se vuelve de otro color', 'desaparece poco a poco'],
  },
  {
    question: '¿Qué pasa cuando llegamos a la edad adulta?',
    answer: 'dejamos de crecer',
    wrong: ['seguimos creciendo mucho', 'volvemos a ser bebés', 'nos salen otra vez los dientes de leche', 'crecemos más rápido que nunca'],
  },
  {
    question: '¿Tenemos dientes cuando nacemos?',
    answer: 'no',
    wrong: ['sí, todos', 'sí, solo los de abajo', 'sí, solo los de arriba', 'sí, solo las muelas'],
    visual: '🦷',
  },
  {
    question: '¿Cómo se llaman los primeros dientes?',
    answer: 'dientes de leche',
    wrong: ['dientes definitivos', 'dientes grandes', 'dientes de pan', 'dientes de lobo'],
    visual: '🦷',
  },
  {
    question: '¿Cómo se llaman los dientes que salen cuando se caen los de leche?',
    answer: 'dientes definitivos',
    wrong: ['dientes de leche', 'dientes de pan', 'dientes de lobo', 'dientes de cuento'],
  },
  {
    question: '¿Qué ocurre primero en la vida de una persona?',
    answer: 'nacemos',
    wrong: ['somos personas adultas', 'somos personas mayores', 'somos adolescentes', 'tenemos nietos'],
  },
  {
    question: '¿Quién es más pequeño?',
    answer: '👶 un bebé',
    wrong: ['🧑 una persona adulta', '🧓 una persona mayor', '🧒 un niño', '🧑 un adolescente'],
  },
  {
    question: '¿Quién ha vivido más años?',
    answer: '🧓 una persona mayor',
    wrong: ['🧒 un niño', '👶 un bebé', '🧑 un adolescente', '🧑 una persona adulta'],
  },
  {
    question: 'Un niño de 7 años está en la etapa de…',
    answer: 'la infancia',
    wrong: ['la adolescencia', 'la ancianidad', 'la edad adulta'],
    visual: '🧒',
  },
  {
    question: 'Las personas muy mayores están en la etapa de…',
    answer: 'la ancianidad',
    wrong: ['la infancia', 'la adolescencia', 'la edad adulta'],
    visual: '🧓',
  },
]

// ── ¿Cómo funciona nuestro cuerpo? ─────────────────────────────────────────────────────────────────────────────────────
// Los cinco sentidos y su órgano (vista-ojos, oído-oídos, olfato-nariz, gusto-lengua, tacto-piel) y las tres funciones
// vitales: relación (conocer lo que nos rodea y reaccionar), nutrición (respirar y alimentarse) y reproducción.
const SENTIDOS_ORGANOS: PairRow[] = [
  { ask: '¿Con qué órgano vemos?', answer: 'con los ojos', askBack: '¿Para qué sentido sirven los ojos?', answerBack: 'la vista', emoji: '👀' },
  { ask: '¿Con qué órgano oímos?', answer: 'con los oídos', askBack: '¿Para qué sentido sirven los oídos?', answerBack: 'el oído', emoji: '👂' },
  { ask: '¿Con qué órgano olemos?', answer: 'con la nariz', askBack: '¿Para qué sentido sirve la nariz?', answerBack: 'el olfato', emoji: '👃' },
  { ask: '¿Con qué órgano notamos los sabores?', answer: 'con la lengua', askBack: '¿Para qué sentido sirve la lengua?', answerBack: 'el gusto', emoji: '👅' },
  {
    ask: '¿Con qué órgano notamos si algo es suave o áspero?',
    answer: 'con la piel',
    askBack: '¿Para qué sentido sirve la piel?',
    answerBack: 'el tacto',
    emoji: '✋',
  },
]

const SENTIDOS: Group[] = [
  { id: 'vista', label: 'la vista' },
  { id: 'oido', label: 'el oído' },
  { id: 'olfato', label: 'el olfato' },
  { id: 'gusto', label: 'el gusto' },
  { id: 'tacto', label: 'el tacto' },
]
const ACCIONES_SENTIDOS: Member[] = [
  { label: 'miramos un dibujo', group: 'vista' },
  { label: 'vemos una película', group: 'vista' },
  { label: 'leemos un cuento', group: 'vista' },
  { label: 'escuchamos música', group: 'oido' },
  { label: 'oímos el timbre del colegio', group: 'oido' },
  { label: 'oímos cantar a un pájaro', group: 'oido' },
  { label: 'olemos una flor', group: 'olfato' },
  { label: 'olemos el pan recién hecho', group: 'olfato' },
  { label: 'olemos un perfume', group: 'olfato' },
  { label: 'probamos un helado', group: 'gusto' },
  { label: 'probamos una sopa', group: 'gusto' },
  { label: 'notamos que un limón es ácido', group: 'gusto' },
  { label: 'tocamos la arena', group: 'tacto' },
  { label: 'acariciamos a un gato', group: 'tacto' },
  { label: 'notamos que el agua está fría', group: 'tacto' },
]

const FUNCIONES: Group[] = [
  { id: 'relacion', label: 'la relación' },
  { id: 'nutricion', label: 'la nutrición' },
  { id: 'reproduccion', label: 'la reproducción' },
]
const ACCIONES_FUNCIONES: Member[] = [
  { label: 'tomamos el desayuno', group: 'nutricion' },
  { label: 'respiramos', group: 'nutricion' },
  { label: 'comemos una manzana', group: 'nutricion' },
  { label: 'bebemos agua', group: 'nutricion' },
  { label: 'comemos pan', group: 'nutricion' },
  { label: 'vemos un semáforo en rojo y paramos', group: 'relacion' },
  { label: 'oímos el timbre y salimos al patio', group: 'relacion' },
  { label: 'olemos una flor', group: 'relacion' },
  { label: 'tocamos algo muy caliente y apartamos la mano', group: 'relacion' },
  { label: 'probamos un caramelo y notamos que es dulce', group: 'relacion' },
  { label: 'una pareja de personas adultas tiene un bebé', group: 'reproduccion' },
  { label: 'una persona adulta tiene una hija', group: 'reproduccion' },
  { label: 'una pareja de personas adultas tiene un hijo', group: 'reproduccion' },
]

const funcionesVitales: FactItem[] = [
  { question: '¿Cuántos sentidos tenemos?', answer: 'cinco', wrong: ['tres', 'siete', 'diez', 'cuatro'] },
  { question: '¿Cuántas funciones vitales realizan las personas?', answer: 'tres', wrong: ['cinco', 'una', 'siete', 'diez'] },
  {
    question: '¿Cuál de estas es una función vital?',
    answer: 'la nutrición',
    wrong: ['la televisión', 'la imaginación', 'la merienda', 'el recreo'],
  },
  {
    question: 'En la función de relación…',
    answer: 'conocemos lo que nos rodea y reaccionamos',
    wrong: ['respiramos y nos alimentamos', 'tenemos hijos o hijas', 'solo comemos'],
  },
  {
    question: 'En la función de nutrición…',
    answer: 'respiramos y nos alimentamos',
    wrong: ['conocemos lo que nos rodea y reaccionamos', 'tenemos hijos o hijas', 'solo vemos y oímos'],
  },
  {
    question: '¿Qué función permite que las personas adultas tengan hijos o hijas?',
    answer: 'la reproducción',
    wrong: ['la nutrición', 'la relación', 'la respiración'],
  },
  {
    question: 'Los órganos de los sentidos nos sirven para…',
    answer: 'conocer lo que pasa a nuestro alrededor',
    wrong: ['tener hijos', 'alimentarnos', 'respirar'],
  },
]

// ── ¿Cómo nos movemos? ─────────────────────────────────────────────────────────────────────────────────────────────────
// Los huesos (esqueleto) son duros y rígidos y están dentro del cuerpo; las articulaciones los unen y dejan doblar el
// cuerpo (hombro, codo, muñeca, rodilla, tobillo); los músculos están bajo la piel, son blandos y elásticos y, con el
// ejercicio, se hacen más fuertes. Los elementos en plural no salen en «¿cuál de estas partes es…?».
const TIPOS_DE_PARTE: Group[] = [
  { id: 'hueso', label: 'hueso', question: '¿Cuál de estas partes es un hueso?' },
  { id: 'articulacion', label: 'articulación', question: '¿Cuál de estas partes es una articulación?' },
  { id: 'musculo', label: 'músculo', question: '¿Cuál de estas partes es un músculo?' },
]
const PARTES: Member[] = [
  { label: 'el cráneo', group: 'hueso' },
  { label: 'las costillas', group: 'hueso', plural: true },
  { label: 'la columna vertebral', group: 'hueso' },
  { label: 'el fémur', group: 'hueso' },
  { label: 'la tibia', group: 'hueso' },
  { label: 'el hombro', group: 'articulacion' },
  { label: 'el codo', group: 'articulacion' },
  { label: 'la muñeca', group: 'articulacion' },
  { label: 'la rodilla', group: 'articulacion' },
  { label: 'el tobillo', group: 'articulacion' },
  { label: 'el bíceps', group: 'musculo' },
  { label: 'el pectoral', group: 'musculo' },
  { label: 'los abdominales', group: 'musculo', plural: true },
  { label: 'el glúteo', group: 'musculo' },
  { label: 'los gemelos', group: 'musculo', plural: true },
]

const huesosYMusculos: FactItem[] = [
  {
    question: '¿Cómo se llama el conjunto de todos los huesos del cuerpo?',
    answer: 'el esqueleto',
    wrong: ['el músculo', 'la articulación', 'la piel', 'el cráneo'],
    visual: '🦴',
  },
  {
    question: '¿Cómo son los huesos?',
    answer: 'duros y rígidos',
    wrong: ['blandos y elásticos', 'blandos como una esponja', 'de goma', 'líquidos'],
    visual: '🦴',
  },
  {
    question: '¿Cómo son los músculos?',
    answer: 'blandos y elásticos',
    wrong: ['duros y rígidos', 'duros como una piedra', 'duros y no se estiran'],
    visual: '💪',
  },
  { question: '¿Dónde están los huesos?', answer: 'dentro del cuerpo', wrong: ['fuera del cuerpo', 'encima de la piel', 'solo en la cabeza', 'solo en las manos'] },
  { question: '¿Dónde están los músculos?', answer: 'debajo de la piel', wrong: ['fuera de la piel', 'dentro de los huesos', 'en el pelo'] },
  { question: '¿Qué une los huesos entre sí?', answer: 'las articulaciones', wrong: ['los músculos', 'la piel', 'el pelo'] },
  {
    question: '¿Para qué sirven las articulaciones?',
    answer: 'para doblar partes del cuerpo',
    wrong: ['para ver', 'para respirar', 'para oír'],
  },
  {
    question: '¿Qué hacen los músculos sin romperse?',
    answer: 'se estiran y se encogen',
    wrong: ['se parten', 'se doblan como un hueso', 'se hacen de piedra'],
  },
  {
    question: '¿Qué trabaja junto con los huesos para que nos movamos?',
    answer: 'los músculos',
    wrong: ['los dientes', 'el pelo', 'las uñas'],
  },
  {
    question: '¿Qué pasa con los músculos cuanto más los usamos?',
    answer: 'son más fuertes',
    wrong: ['son más débiles', 'desaparecen', 'se rompen'],
  },
  {
    question: '¿Qué nos ayuda a tener huesos y músculos sanos?',
    answer: 'hacer ejercicio',
    wrong: ['estar siempre sentados', 'no movernos nunca', 'comer solo dulces'],
    visual: '🏃',
  },
  {
    question: '¿Cuál de estos objetos es elástico como un músculo?',
    answer: '🎈 un globo',
    wrong: ['🔩 un tornillo', '🧱 un ladrillo', '🔨 un martillo'],
  },
]

// ── Necesitamos respirar ───────────────────────────────────────────────────────────────────────────────────────────────
// Respiramos para obtener aire, que lleva oxígeno. El aire entra por la nariz o la boca, pasa por la tráquea y llega a
// los pulmones, que absorben el oxígeno; el resto se expulsa. Inspiración y espiración. La respiración es tranquila al
// leer o dibujar y acelerada al correr o bailar. «La boca» nunca sale como opción equivocada al preguntar por dónde
// entra el aire, porque entra por la nariz o por la boca.
const RITMOS: Group[] = [
  { id: 'tranquila', label: 'tranquila', question: '¿Cuándo respiramos de forma tranquila?' },
  { id: 'acelerada', label: 'acelerada', question: '¿Cuándo respiramos más deprisa?' },
]
const ACTIVIDADES: Member[] = [
  { label: 'leemos un cuento', group: 'tranquila' },
  { label: 'dibujamos un paisaje', group: 'tranquila' },
  { label: 'escuchamos música sentados', group: 'tranquila' },
  { label: 'miramos las nubes tumbados', group: 'tranquila' },
  { label: 'pintamos con acuarelas', group: 'tranquila' },
  { label: 'corremos', group: 'acelerada' },
  { label: 'bailamos', group: 'acelerada' },
  { label: 'saltamos a la comba', group: 'acelerada' },
  { label: 'jugamos al pilla-pilla', group: 'acelerada' },
  { label: 'subimos las escaleras corriendo', group: 'acelerada' },
]

const respirar: FactItem[] = [
  { question: '¿Para qué respiramos?', answer: 'para obtener aire', wrong: ['para ver', 'para oír', 'para digerir la comida'] },
  {
    question: '¿Cómo se llama el gas del aire que necesitamos para vivir?',
    answer: 'el oxígeno',
    wrong: ['el azúcar', 'la sal', 'el agua'],
  },
  {
    question: '¿Por dónde puede entrar el aire en el cuerpo?',
    answer: 'por la nariz o por la boca',
    wrong: ['solo por los ojos', 'por las orejas', 'por los pies'],
    visual: '👃  👄',
  },
  { question: '¿Qué órganos absorben el oxígeno?', answer: 'los pulmones', wrong: ['el estómago', 'los huesos', 'los intestinos'] },
  {
    question: '¿Qué hacemos con el aire que queda en los pulmones?',
    answer: 'lo expulsamos',
    wrong: ['lo tragamos con la comida', 'lo guardamos siempre', 'lo convertimos en comida'],
  },
  { question: 'Inspirar es…', answer: 'tomar aire', wrong: ['expulsar el aire', 'comer', 'beber agua'] },
  { question: 'Espirar es…', answer: 'expulsar el aire', wrong: ['tomar aire', 'comer', 'beber agua'] },
  { question: '¿Qué entra en nuestro cuerpo cuando respiramos?', answer: 'aire', wrong: ['agua', 'comida', 'tierra'] },
  { question: '¿Qué sale de nuestro cuerpo cuando espiramos?', answer: 'aire', wrong: ['comida', 'tierra', 'piedras'] },
  {
    question: 'Después de la nariz o la boca, ¿por qué tubo pasa el aire?',
    answer: 'por la tráquea',
    wrong: ['por el esófago', 'por el ano', 'por el intestino'],
  },
  {
    question: '¿A dónde llega el aire después de pasar por la tráquea?',
    answer: 'a los pulmones',
    wrong: ['al estómago', 'a los intestinos', 'a los huesos'],
  },
  { question: '¿Cuál es el tubo del aire?', answer: 'la tráquea', wrong: ['el esófago', 'el intestino', 'el ano'] },
  {
    question: 'Respirar profundamente nos ayuda a…',
    answer: 'calmarnos',
    wrong: ['correr más', 'ver mejor', 'crecer más rápido'],
  },
  {
    question: 'Para respirar profundo, ¿por dónde tomamos el aire?',
    answer: 'por la nariz',
    wrong: ['por los ojos', 'por las orejas', 'por los pies'],
  },
  {
    question: 'Al espirar, ¿por dónde sacamos el aire poco a poco?',
    answer: 'por la boca',
    wrong: ['por los ojos', 'por las orejas', 'por los pies'],
  },
  {
    question: 'Cuando estamos tranquilos, respiramos…',
    answer: 'despacio',
    wrong: ['muy deprisa', 'sin aire', 'a la carrera'],
  },
]

// ── ¿Cómo nos alimentamos? ─────────────────────────────────────────────────────────────────────────────────────────────
// El camino de los alimentos: boca → esófago → estómago → intestinos → ano. Los dientes trituran, el estómago deshace y en
// los intestinos pasan al cuerpo las sustancias que necesitamos. La tráquea es del aire: solo sale como opción equivocada.
// Los tres grupos de alimentos: frutas y verduras (vitaminas y fibra), pan, pasta y patatas (energía) y lácteos, huevos,
// pescado y carne (ayudan a crecer). Solo alimentos que están claramente en un grupo.
const GRUPOS_ALIMENTOS: Group[] = [
  { id: 'vitaminas', label: 'para tener vitaminas y fibra', question: '¿Cuál de estos alimentos nos aporta vitaminas y fibra?' },
  { id: 'energia', label: 'para tener energía', question: '¿Cuál de estos alimentos nos aporta energía?' },
  { id: 'crecer', label: 'para crecer', question: '¿Cuál de estos alimentos nos ayuda a crecer?' },
]
const ALIMENTOS: Member[] = [
  { emoji: '🥕', label: 'la zanahoria', group: 'vitaminas' },
  { emoji: '🍎', label: 'la manzana', group: 'vitaminas' },
  { emoji: '🍌', label: 'el plátano', group: 'vitaminas' },
  { emoji: '🍊', label: 'la naranja', group: 'vitaminas' },
  { emoji: '🥦', label: 'el brócoli', group: 'vitaminas' },
  { emoji: '🍅', label: 'el tomate', group: 'vitaminas' },
  { emoji: '🥬', label: 'la lechuga', group: 'vitaminas' },
  { emoji: '🍉', label: 'la sandía', group: 'vitaminas' },
  { emoji: '🥝', label: 'el kiwi', group: 'vitaminas' },
  { emoji: '🍍', label: 'la piña', group: 'vitaminas' },
  { emoji: '🍐', label: 'la pera', group: 'vitaminas' },
  { emoji: '🥒', label: 'el pepino', group: 'vitaminas' },
  { emoji: '🍓', label: 'las fresas', group: 'vitaminas', plural: true },
  { emoji: '🍇', label: 'las uvas', group: 'vitaminas', plural: true },
  { emoji: '🍞', label: 'el pan', group: 'energia' },
  { emoji: '🍝', label: 'la pasta', group: 'energia' },
  { emoji: '🥔', label: 'la patata', group: 'energia' },
  { emoji: '🥛', label: 'la leche', group: 'crecer' },
  { emoji: '🐟', label: 'el pescado', group: 'crecer' },
  { emoji: '🍗', label: 'el pollo', group: 'crecer' },
  { emoji: '🧀', label: 'el queso', group: 'crecer' },
  { emoji: '🥩', label: 'la carne', group: 'crecer' },
  { emoji: '🥚', label: 'los huevos', group: 'crecer', plural: true },
]

const digestion: FactItem[] = [
  {
    question: '¿Por dónde entra la comida a nuestro cuerpo?',
    answer: 'por la boca',
    wrong: ['por las orejas', 'por los ojos', 'por la nariz'],
    visual: '👄',
  },
  {
    question: '¿Para qué sirven los dientes al comer?',
    answer: 'para triturar la comida',
    wrong: ['para respirar', 'para oler', 'para ver'],
    visual: '🦷',
  },
  { question: '¿Con qué masticamos la comida?', answer: 'con los dientes', wrong: ['con las orejas', 'con los ojos', 'con la nariz'], visual: '🦷' },
  { question: '¿Dónde se deshace la comida?', answer: 'en el estómago', wrong: ['en los pulmones', 'en las orejas', 'en los huesos'] },
  {
    question: '¿Dónde pasan al cuerpo las sustancias que necesitamos de la comida?',
    answer: 'en los intestinos',
    wrong: ['en los pulmones', 'en los dientes', 'en la nariz', 'en los huesos'],
  },
  {
    question: '¿Por dónde salen los restos que el cuerpo no aprovecha?',
    answer: 'por el ano',
    wrong: ['por la boca', 'por las orejas', 'por los ojos'],
  },
  {
    question: '¿Cómo se llama el proceso en el que la comida se transforma en nutrientes?',
    answer: 'la digestión',
    wrong: ['la respiración', 'la reproducción', 'el movimiento'],
  },
  {
    question: 'Después de la boca, ¿por qué tubo pasa la comida?',
    answer: 'por el esófago',
    wrong: ['por la tráquea', 'por el ano', 'por la nariz'],
  },
  {
    question: '¿Qué ocurre primero con la comida?',
    answer: 'la masticamos con los dientes',
    wrong: ['llega al estómago', 'sale por el ano', 'llega a los intestinos'],
  },
]

const habitos: FactItem[] = [
  {
    question: '¿Qué bebida es mejor para tomar todos los días?',
    answer: '💧 el agua',
    wrong: ['🥤 un refresco', 'una bebida con mucho azúcar', 'un batido muy dulce'],
  },
  {
    question: 'Para alimentarnos bien, ¿qué tenemos que comer?',
    answer: 'alimentos de todos los grupos',
    wrong: ['solo dulces', 'siempre lo mismo', 'solo pan'],
  },
  {
    question: '¿Cuál es una buena merienda?',
    answer: '🍎 una pieza de fruta',
    wrong: ['🍬 muchos caramelos', '🍰 un trozo grande de tarta', '🍟 un cucurucho de patatas fritas'],
  },
  {
    question: '¿Qué menú es más variado?',
    answer: 'pasta con pollo y una manzana',
    wrong: ['pan, pasta y patatas', 'tarta, helado y refresco', 'solo galletas'],
  },
  {
    question: 'Este menú solo tiene pan, pasta y patatas. ¿Qué podemos añadir para que sea más sano?',
    answer: 'fruta o verdura',
    wrong: ['más pan', 'más patatas', 'más pasta'],
  },
]

export const temasUnidad1: Topic[] = [
  {
    id: 'cambiamos',
    name: 'Nuestro cuerpo cambia',
    icon: '👶',
    tint: '#ffe9a8',
    plan: [
      {
        spec: {
          kind: 'sequence',
          id: 'etapas',
          steps: ['la infancia', 'la adolescencia', 'la edad adulta', 'la ancianidad'],
          first: '¿Cuál de estas etapas de la vida es la primera?',
          last: '¿Cuál de estas etapas es la última?',
          after: '¿Qué etapa viene justo después de {step}?',
          before: '¿Qué etapa viene justo antes de {step}?',
        },
        count: 3,
      },
      { spec: { kind: 'pick-member', groups: CAMBIOS, items: COSAS }, count: 3 },
      { spec: { kind: 'facts', items: crecer }, count: 4 },
    ],
  },
  {
    id: 'funciones',
    name: '¿Cómo funciona nuestro cuerpo?',
    icon: '🧠',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'pairs', rows: SENTIDOS_ORGANOS }, count: 2 },
      { spec: { kind: 'classify', question: 'Cuando {item}, ¿qué sentido usamos?', groups: SENTIDOS, items: ACCIONES_SENTIDOS }, count: 3 },
      { spec: { kind: 'classify', question: 'Si {item}, ¿qué función vital se realiza?', groups: FUNCIONES, items: ACCIONES_FUNCIONES }, count: 3 },
      { spec: { kind: 'facts', items: funcionesVitales }, count: 2 },
    ],
  },
  {
    id: 'movimiento',
    name: '¿Cómo nos movemos?',
    icon: '💪',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'pick-member', groups: TIPOS_DE_PARTE, items: PARTES }, count: 3 },
      { spec: { kind: 'classify', question: '{item}: ¿hueso, articulación o músculo?', groups: TIPOS_DE_PARTE, items: PARTES }, count: 3 },
      { spec: { kind: 'facts', items: huesosYMusculos }, count: 4 },
    ],
  },
  {
    id: 'respirar',
    name: 'Necesitamos respirar',
    icon: '💨',
    tint: '#bfe3ff',
    plan: [
      {
        spec: {
          kind: 'sequence',
          id: 'aire',
          steps: ['la nariz o la boca', 'la tráquea', 'los pulmones'],
          extra: ['el esófago', 'el estómago', 'los intestinos'],
          first: '¿Qué viene primero en el camino del aire?',
          last: '¿Qué viene al final del camino del aire?',
          after: '¿Qué viene justo después de {step} en el camino del aire?',
          before: '¿Qué viene justo antes de {step} en el camino del aire?',
        },
        count: 2,
      },
      { spec: { kind: 'pick-member', groups: RITMOS, items: ACTIVIDADES }, count: 3 },
      { spec: { kind: 'facts', items: respirar }, count: 5 },
    ],
  },
  {
    id: 'alimentacion',
    name: '¿Cómo nos alimentamos?',
    icon: '🍎',
    tint: '#b5ecc1',
    plan: [
      {
        spec: {
          kind: 'sequence',
          id: 'comida',
          steps: ['la boca', 'el esófago', 'el estómago', 'los intestinos', 'el ano'],
          extra: ['la tráquea', 'los pulmones'],
          first: '¿Qué parte es la primera del camino de la comida?',
          last: '¿Qué parte es la última del camino de la comida?',
          after: '¿Qué parte va justo después de {step}?',
          before: '¿Qué parte va justo antes de {step}?',
        },
        count: 2,
      },
      { spec: { kind: 'classify', question: '¿Para qué nos sirve comer {item}?', groups: GRUPOS_ALIMENTOS, items: ALIMENTOS }, count: 2 },
      { spec: { kind: 'pick-member', groups: GRUPOS_ALIMENTOS, items: ALIMENTOS }, count: 2 },
      { spec: { kind: 'facts', items: digestion }, count: 3 },
      { spec: { kind: 'facts', items: habitos }, count: 1 },
    ],
  },
]
