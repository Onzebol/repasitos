import type { ChoiceExercise, Topic } from '../../types'

const elegir = (question: string, options: string[], answer: string, visual?: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options,
  answer,
  visual,
})

// Unidad 1: «Crecemos y cambiamos» (ver docs/conocimiento-del-medio-2-primaria.md). Ejercicios escritos desde cero con el
// vocabulario de la unidad, en el orden de sus cinco saberes; cada tema es un plan de 10 por sesión con listas escritas a
// mano, y en cada lista hay bastantes más ejercicios de los que se toman para que las sesiones cambien.

// ── Nuestro cuerpo cambia ──────────────────────────────────────────────────────────────────────────────────────────────
// Etapas de la vida (infancia, adolescencia, edad adulta y ancianidad), dientes de leche y definitivos, y lo que cambia al
// crecer (no cambia el color de los ojos). En las preguntas de orden solo se ofrecen las cuatro etapas.
const etapas: ChoiceExercise[] = [
  elegir('¿Cuál de estas etapas de la vida es la primera?', ['la infancia', 'la adolescencia', 'la ancianidad'], 'la infancia'),
  elegir('¿Cuál de estas etapas es la última?', ['la ancianidad', 'la infancia', 'la adolescencia'], 'la ancianidad'),
  elegir('¿Qué etapa viene justo después de la infancia?', ['la adolescencia', 'la ancianidad', 'la edad adulta'], 'la adolescencia'),
  elegir('¿Qué etapa viene justo después de la adolescencia?', ['la edad adulta', 'la infancia', 'la ancianidad'], 'la edad adulta'),
  elegir('¿Qué etapa viene justo después de la edad adulta?', ['la ancianidad', 'la infancia', 'la adolescencia'], 'la ancianidad'),
  elegir('¿Qué etapa viene justo antes de la edad adulta?', ['la adolescencia', 'la ancianidad', 'la infancia'], 'la adolescencia'),
  elegir('Un niño de 7 años está en la etapa de…', ['la infancia', 'la adolescencia', 'la ancianidad'], 'la infancia', '🧒'),
  elegir('Las personas muy mayores están en la etapa de…', ['la ancianidad', 'la infancia', 'la adolescencia'], 'la ancianidad', '🧓'),
  elegir('¿Quién es más pequeño?', ['👶 un bebé', '🧑 una persona adulta', '🧓 una persona mayor'], '👶 un bebé'),
  elegir('¿Quién ha vivido más años?', ['🧓 una persona mayor', '🧒 un niño', '👶 un bebé'], '🧓 una persona mayor'),
  elegir('¿Qué ocurre primero en la vida de una persona?', ['nacemos', 'somos personas adultas', 'somos personas mayores'], 'nacemos'),
]

const crecer: ChoiceExercise[] = [
  elegir(
    '¿Qué hace nuestro cuerpo desde que nacemos?',
    ['crece y se hace más fuerte', 'se hace más pequeño', 'se queda siempre igual'],
    'crece y se hace más fuerte',
  ),
  elegir(
    '¿Qué pasa cuando llegamos a la edad adulta?',
    ['dejamos de crecer', 'seguimos creciendo mucho', 'volvemos a ser bebés'],
    'dejamos de crecer',
  ),
  elegir('¿Tenemos dientes cuando nacemos?', ['no', 'sí, todos', 'sí, solo los de abajo'], 'no', '🦷'),
  elegir('¿Cómo se llaman los primeros dientes?', ['dientes de leche', 'dientes definitivos', 'dientes grandes'], 'dientes de leche', '🦷'),
  elegir(
    '¿Cómo se llaman los dientes que salen cuando se caen los de leche?',
    ['dientes definitivos', 'dientes de leche', 'dientes pequeños'],
    'dientes definitivos',
  ),
  elegir('¿Cuál de estas cosas cambia al crecer?', ['la altura', 'el color de los ojos', 'el día en que nacimos'], 'la altura'),
  elegir(
    '¿Qué cosa de nuestro cuerpo cambia al crecer?',
    ['el número de pie', 'el color de los ojos', 'el día en que nacimos'],
    'el número de pie',
  ),
  elegir(
    '¿Qué cambia en nuestro cuerpo al hacernos mayores?',
    ['la voz', 'el color de los ojos', 'la fecha de nacimiento'],
    'la voz',
  ),
  elegir(
    '¿Qué parte de nuestro cuerpo cambia al crecer?',
    ['los dientes', 'el color de los ojos', 'el día en que nacimos'],
    'los dientes',
  ),
  elegir('¿Qué NO cambia cuando crecemos?', ['el color de los ojos', 'la altura', 'el número de pie'], 'el color de los ojos'),
]

// ── ¿Cómo funciona nuestro cuerpo? ─────────────────────────────────────────────────────────────────────────────────────
// Los cinco sentidos y su órgano (vista-ojos, oído-oídos, olfato-nariz, gusto-lengua, tacto-piel) y las tres funciones
// vitales: relación (conocer lo que nos rodea y reaccionar), nutrición (respirar y alimentarse) y reproducción.
const sentidos: ChoiceExercise[] = [
  elegir('¿Con qué órgano vemos?', ['con los ojos', 'con la nariz', 'con la lengua'], 'con los ojos', '👀'),
  elegir('¿Con qué órgano oímos?', ['con los oídos', 'con los ojos', 'con la piel'], 'con los oídos', '👂'),
  elegir('¿Con qué órgano olemos?', ['con la nariz', 'con la lengua', 'con los ojos'], 'con la nariz', '👃'),
  elegir('¿Con qué órgano notamos los sabores?', ['con la lengua', 'con la nariz', 'con los oídos'], 'con la lengua', '👅'),
  elegir('¿Con qué órgano notamos si algo es suave o áspero?', ['con la piel', 'con los ojos', 'con la lengua'], 'con la piel', '✋'),
  elegir('¿Para qué sentido sirve la nariz?', ['el olfato', 'el gusto', 'la vista'], 'el olfato', '👃'),
  elegir('¿Para qué sentido sirven los ojos?', ['la vista', 'el oído', 'el tacto'], 'la vista', '👀'),
  elegir('¿Para qué sentido sirve la lengua?', ['el gusto', 'el olfato', 'el tacto'], 'el gusto', '👅'),
  elegir('¿Para qué sentido sirve la piel?', ['el tacto', 'la vista', 'el gusto'], 'el tacto', '✋'),
  elegir('¿Para qué sentido sirven los oídos?', ['el oído', 'la vista', 'el olfato'], 'el oído', '👂'),
  elegir('¿Cuántos sentidos tenemos?', ['cinco', 'tres', 'diez'], 'cinco'),
]

const funciones: ChoiceExercise[] = [
  elegir('¿Cuántas funciones vitales realizan las personas?', ['tres', 'cinco', 'una'], 'tres'),
  elegir('¿Cuál de estas es una función vital?', ['la nutrición', 'la televisión', 'la imaginación'], 'la nutrición'),
  elegir(
    'En la función de relación…',
    ['conocemos lo que nos rodea y reaccionamos', 'respiramos y nos alimentamos', 'tenemos hijos o hijas'],
    'conocemos lo que nos rodea y reaccionamos',
  ),
  elegir(
    'En la función de nutrición…',
    ['respiramos y nos alimentamos', 'conocemos lo que nos rodea y reaccionamos', 'tenemos hijos o hijas'],
    'respiramos y nos alimentamos',
  ),
  elegir(
    '¿Qué función permite que las personas adultas tengan hijos o hijas?',
    ['la reproducción', 'la nutrición', 'la relación'],
    'la reproducción',
  ),
  elegir(
    'Si tomamos el desayuno, ¿qué función vital realizamos?',
    ['la nutrición', 'la relación', 'la reproducción'],
    'la nutrición',
    '🥛',
  ),
  elegir('Si respiramos, ¿qué función vital realizamos?', ['la nutrición', 'la relación', 'la reproducción'], 'la nutrición', '💨'),
  elegir(
    'Si vemos un semáforo en rojo y paramos, ¿qué función vital realizamos?',
    ['la relación', 'la nutrición', 'la reproducción'],
    'la relación',
    '🚦',
  ),
  elegir(
    'Si una pareja de personas adultas tiene un bebé, ¿qué función vital realizan?',
    ['la reproducción', 'la nutrición', 'la relación'],
    'la reproducción',
    '👶',
  ),
]

// ── ¿Cómo nos movemos? ─────────────────────────────────────────────────────────────────────────────────────────────────
// Los huesos (esqueleto) son duros y rígidos y están dentro del cuerpo; las articulaciones los unen y dejan doblar el
// cuerpo (hombro, codo, muñeca, rodilla, tobillo); los músculos están bajo la piel, son blandos y elásticos y, con el
// ejercicio, se hacen más fuertes.
const huesos: ChoiceExercise[] = [
  elegir('¿Cómo se llama el conjunto de todos los huesos del cuerpo?', ['el esqueleto', 'el músculo', 'la articulación'], 'el esqueleto', '🦴'),
  elegir('¿Cómo son los huesos?', ['duros y rígidos', 'blandos y elásticos', 'blandos como una esponja'], 'duros y rígidos', '🦴'),
  elegir('¿Dónde están los huesos?', ['dentro del cuerpo', 'fuera del cuerpo', 'encima de la piel'], 'dentro del cuerpo'),
  elegir('¿Qué une los huesos entre sí?', ['las articulaciones', 'los músculos', 'la piel'], 'las articulaciones'),
  elegir(
    '¿Para qué sirven las articulaciones?',
    ['para doblar partes del cuerpo', 'para ver', 'para respirar'],
    'para doblar partes del cuerpo',
  ),
  elegir('¿Qué parte del cuerpo es una articulación?', ['el codo', 'el fémur', 'el cráneo'], 'el codo'),
  elegir('¿Cuál de estas partes es una articulación?', ['la rodilla', 'las costillas', 'la tibia'], 'la rodilla'),
  elegir('¿Cómo se llama el hueso de la cabeza?', ['el cráneo', 'el fémur', 'la tibia'], 'el cráneo'),
  elegir('¿Cuál de estas partes es un hueso?', ['el fémur', 'el codo', 'el hombro'], 'el fémur'),
]

const musculos: ChoiceExercise[] = [
  elegir('¿Cómo son los músculos?', ['blandos y elásticos', 'duros y rígidos', 'duros y no se estiran'], 'blandos y elásticos', '💪'),
  elegir('¿Dónde están los músculos?', ['debajo de la piel', 'dentro de los huesos', 'fuera de la piel'], 'debajo de la piel'),
  elegir('¿Qué hacen los músculos sin romperse?', ['se estiran y se encogen', 'se parten', 'se doblan como un hueso'], 'se estiran y se encogen'),
  elegir('¿Qué trabaja junto con los huesos para que nos movamos?', ['los músculos', 'los dientes', 'el pelo'], 'los músculos'),
  elegir(
    '¿Qué pasa con los músculos cuanto más los usamos?',
    ['son más fuertes', 'son más débiles', 'desaparecen'],
    'son más fuertes',
  ),
  elegir(
    '¿Qué nos ayuda a tener huesos y músculos sanos?',
    ['hacer ejercicio', 'estar siempre sentados', 'no movernos nunca'],
    'hacer ejercicio',
    '🏃',
  ),
  elegir('¿Qué músculo está en el brazo?', ['el bíceps', 'los gemelos', 'el glúteo'], 'el bíceps'),
  elegir('¿Qué músculos están en la pierna?', ['los gemelos', 'el bíceps', 'los abdominales'], 'los gemelos'),
  elegir('¿Cuál de estos objetos es elástico como un músculo?', ['🎈 un globo', '🔩 un tornillo', '🧱 un ladrillo'], '🎈 un globo'),
]

// ── Necesitamos respirar ───────────────────────────────────────────────────────────────────────────────────────────────
// Respiramos para obtener aire, que lleva oxígeno. El aire entra por la nariz o la boca, pasa por la tráquea y llega a
// los pulmones, que absorben el oxígeno; el resto se expulsa. Inspiración y espiración. La respiración es tranquila al
// leer o dibujar y acelerada al correr o bailar. «La boca» nunca sale como opción equivocada al preguntar por dónde
// entra el aire, porque entra por la nariz o por la boca.
const aire: ChoiceExercise[] = [
  elegir('¿Para qué respiramos?', ['para obtener aire', 'para ver', 'para oír'], 'para obtener aire'),
  elegir('¿Cómo se llama el gas del aire que necesitamos para vivir?', ['el oxígeno', 'el azúcar', 'la sal'], 'el oxígeno'),
  elegir(
    '¿Por dónde puede entrar el aire en el cuerpo?',
    ['por la nariz o por la boca', 'solo por los ojos', 'por las orejas'],
    'por la nariz o por la boca',
    '👃  👄',
  ),
  elegir('¿Qué órganos absorben el oxígeno?', ['los pulmones', 'el estómago', 'los huesos'], 'los pulmones'),
  elegir(
    '¿Qué hacemos con el aire que queda en los pulmones?',
    ['lo expulsamos', 'lo tragamos con la comida', 'lo guardamos siempre'],
    'lo expulsamos',
  ),
  elegir('Inspirar es…', ['tomar aire', 'expulsar el aire', 'comer'], 'tomar aire'),
  elegir('Espirar es…', ['expulsar el aire', 'tomar aire', 'beber agua'], 'expulsar el aire'),
  elegir('¿Qué entra en nuestro cuerpo cuando respiramos?', ['aire', 'agua', 'comida'], 'aire'),
  elegir('¿Qué sale de nuestro cuerpo cuando espiramos?', ['aire', 'agua', 'comida'], 'aire'),
]

const caminoDelAire: ChoiceExercise[] = [
  elegir('Después de la nariz o la boca, ¿por qué tubo pasa el aire?', ['por la tráquea', 'por el esófago', 'por el ano'], 'por la tráquea'),
  elegir('¿A dónde llega el aire después de pasar por la tráquea?', ['a los pulmones', 'al estómago', 'a los intestinos'], 'a los pulmones'),
  elegir('¿Qué viene primero en el camino del aire?', ['la nariz o la boca', 'los pulmones', 'la tráquea'], 'la nariz o la boca'),
  elegir('¿Qué viene después de la tráquea?', ['los pulmones', 'la nariz', 'la boca'], 'los pulmones'),
  elegir('¿Qué órgano va justo antes de los pulmones?', ['la tráquea', 'la boca', 'el ano'], 'la tráquea'),
  elegir('¿Qué tubo une la nariz con los pulmones?', ['la tráquea', 'el esófago', 'el intestino'], 'la tráquea'),
  elegir('¿Cuál es el tubo del aire?', ['la tráquea', 'el esófago', 'el intestino'], 'la tráquea'),
]

const respiracion: ChoiceExercise[] = [
  elegir('Cuando leemos o dibujamos, la respiración es…', ['tranquila', 'acelerada', 'muy fuerte'], 'tranquila', '📖'),
  elegir('Cuando corremos o bailamos, la respiración es…', ['acelerada', 'tranquila', 'muy lenta'], 'acelerada', '🏃'),
  elegir('Respirar profundamente nos ayuda a…', ['calmarnos', 'correr más', 'ver mejor'], 'calmarnos'),
  elegir('Para respirar profundo, ¿por dónde tomamos el aire?', ['por la nariz', 'por los ojos', 'por las orejas'], 'por la nariz'),
  elegir('Al espirar, ¿por dónde sacamos el aire poco a poco?', ['por la boca', 'por los ojos', 'por las orejas'], 'por la boca'),
  elegir('¿Qué hace que respiremos más deprisa?', ['correr', 'leer', 'dibujar'], 'correr'),
  elegir('Cuando estamos tranquilos, respiramos…', ['despacio', 'muy deprisa', 'sin aire'], 'despacio'),
]

// ── ¿Cómo nos alimentamos? ─────────────────────────────────────────────────────────────────────────────────────────────
// El camino de los alimentos: boca → esófago → estómago → intestinos → ano. Los dientes trituran, el estómago deshace y en
// los intestinos pasan al cuerpo las sustancias que necesitamos. La tráquea es del aire: solo sale como opción equivocada.
const camino: ChoiceExercise[] = [
  elegir('¿Por dónde entra la comida a nuestro cuerpo?', ['por la boca', 'por las orejas', 'por los ojos'], 'por la boca', '👄'),
  elegir('¿Para qué sirven los dientes al comer?', ['para triturar la comida', 'para respirar', 'para oler'], 'para triturar la comida', '🦷'),
  elegir('¿Con qué masticamos la comida?', ['con los dientes', 'con las orejas', 'con los ojos'], 'con los dientes', '🦷'),
  elegir('Después de la boca, ¿por qué tubo pasa la comida?', ['por el esófago', 'por la tráquea', 'por el ano'], 'por el esófago'),
  elegir('¿Dónde se deshace la comida?', ['en el estómago', 'en los pulmones', 'en las orejas'], 'en el estómago'),
  elegir(
    '¿Dónde pasan al cuerpo las sustancias que necesitamos de la comida?',
    ['en los intestinos', 'en los pulmones', 'en los dientes'],
    'en los intestinos',
  ),
  elegir('¿Por dónde salen los restos que el cuerpo no aprovecha?', ['por el ano', 'por la boca', 'por las orejas'], 'por el ano'),
  elegir(
    '¿Cómo se llama el proceso en el que la comida se transforma en nutrientes?',
    ['la digestión', 'la respiración', 'la reproducción'],
    'la digestión',
  ),
  elegir('¿Qué órgano va justo después del esófago?', ['el estómago', 'la boca', 'el ano'], 'el estómago'),
  elegir('¿Qué órgano va justo antes del estómago?', ['el esófago', 'los intestinos', 'el ano'], 'el esófago'),
  elegir('¿Qué viene después del estómago?', ['los intestinos', 'la boca', 'el esófago'], 'los intestinos'),
  elegir(
    '¿Qué ocurre primero?',
    ['masticamos la comida con los dientes', 'la comida llega al estómago', 'salen los restos por el ano'],
    'masticamos la comida con los dientes',
  ),
  elegir(
    '¿Qué ocurre al final?',
    ['salen los restos por el ano', 'masticamos la comida con los dientes', 'la comida llega al estómago'],
    'salen los restos por el ano',
  ),
]

// Los tres grupos de alimentos: frutas y verduras (vitaminas y fibra), pan, pasta y patatas (energía) y lácteos, huevos,
// pescado y carne (ayudan a crecer). Solo alimentos que están claramente en un grupo.
const VITAMINAS = 'para tener vitaminas y fibra'
const ENERGIA = 'para tener energía'
const CRECER = 'para crecer'
const alimento = (emoji: string, nombre: string, grupo: string) =>
  elegir(`¿Para qué nos sirve comer ${nombre}?`, [VITAMINAS, ENERGIA, CRECER], grupo, emoji)

const grupos: ChoiceExercise[] = [
  alimento('🥕', 'la zanahoria', VITAMINAS),
  alimento('🍎', 'la manzana', VITAMINAS),
  alimento('🍌', 'el plátano', VITAMINAS),
  alimento('🍊', 'la naranja', VITAMINAS),
  alimento('🥦', 'el brócoli', VITAMINAS),
  alimento('🍅', 'el tomate', VITAMINAS),
  alimento('🥬', 'la lechuga', VITAMINAS),
  alimento('🍞', 'el pan', ENERGIA),
  alimento('🍝', 'la pasta', ENERGIA),
  alimento('🥔', 'la patata', ENERGIA),
  alimento('🥛', 'la leche', CRECER),
  alimento('🥚', 'los huevos', CRECER),
  alimento('🐟', 'el pescado', CRECER),
  alimento('🍗', 'el pollo', CRECER),
  alimento('🧀', 'el queso', CRECER),
  alimento('🥩', 'la carne', CRECER),
]

// Alimentarse bien: de todos los grupos, con agua y menús variados.
const habitos: ChoiceExercise[] = [
  elegir('¿Qué bebida es mejor para tomar todos los días?', ['💧 el agua', '🥤 un refresco', 'una bebida con mucho azúcar'], '💧 el agua'),
  elegir(
    'Para alimentarnos bien, ¿qué tenemos que comer?',
    ['alimentos de todos los grupos', 'solo dulces', 'siempre lo mismo'],
    'alimentos de todos los grupos',
  ),
  elegir(
    '¿Cuál es una buena merienda?',
    ['🍎 una pieza de fruta', '🍬 muchos caramelos', '🍰 un trozo grande de tarta'],
    '🍎 una pieza de fruta',
  ),
  elegir(
    '¿Qué menú es más variado?',
    ['pasta con pollo y una manzana', 'pan, pasta y patatas', 'tarta, helado y refresco'],
    'pasta con pollo y una manzana',
  ),
  elegir(
    'Este menú solo tiene pan, pasta y patatas. ¿Qué podemos añadir para que sea más sano?',
    ['fruta o verdura', 'más pan', 'más patatas'],
    'fruta o verdura',
  ),
  elegir('¿Qué alimento nos ayuda a crecer?', ['🥛 la leche', '🍬 los caramelos', '🥤 el refresco'], '🥛 la leche'),
]

export const temasUnidad1: Topic[] = [
  {
    id: 'cambiamos',
    name: 'Nuestro cuerpo cambia',
    icon: '👶',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'bag', items: etapas }, count: 5 },
      { spec: { kind: 'bag', items: crecer }, count: 5 },
    ],
  },
  {
    id: 'funciones',
    name: '¿Cómo funciona nuestro cuerpo?',
    icon: '🧠',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'bag', items: sentidos }, count: 5 },
      { spec: { kind: 'bag', items: funciones }, count: 5 },
    ],
  },
  {
    id: 'movimiento',
    name: '¿Cómo nos movemos?',
    icon: '💪',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'bag', items: huesos }, count: 5 },
      { spec: { kind: 'bag', items: musculos }, count: 5 },
    ],
  },
  {
    id: 'respirar',
    name: 'Necesitamos respirar',
    icon: '💨',
    tint: '#bfe3ff',
    plan: [
      { spec: { kind: 'bag', items: aire }, count: 4 },
      { spec: { kind: 'bag', items: caminoDelAire }, count: 3 },
      { spec: { kind: 'bag', items: respiracion }, count: 3 },
    ],
  },
  {
    id: 'alimentacion',
    name: '¿Cómo nos alimentamos?',
    icon: '🍎',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'bag', items: camino }, count: 4 },
      { spec: { kind: 'bag', items: grupos }, count: 4 },
      { spec: { kind: 'bag', items: habitos }, count: 2 },
    ],
  },
]
