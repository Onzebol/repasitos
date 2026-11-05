import type { FactItem, Group, Member, PairRow, Topic } from '../../types'

// Unidad 2: «Clasificamos animales» (ver docs/conocimiento-del-medio-2-primaria.md). Igual que la unidad 1: ejercicios
// escritos desde cero que se generan al azar a partir de tablas (src/generators.ts: classify, pick-member, sequence, pairs
// y facts). Lo que es una tabla cerrada (a qué grupo pertenece un animal, qué come, dónde vive) se pregunta en varias
// direcciones y las opciones equivocadas salen de la propia tabla, así que son falsas por construcción; los hechos sueltos
// llevan sus respuestas equivocadas escritas a mano y seguras. Solo se usan animales inequívocos (nada de insecto palo,
// escarabajo o ratón) y cada bloque tiene al menos el doble de hechos que los que toma una sesión.

const animal = (label: string, group: string, emoji?: string): Member => (emoji ? { label, group, emoji } : { label, group })

// ── Vertebrados e invertebrados ────────────────────────────────────────────────────────────────────────────────────────
// Los cinco grupos de vertebrados y, aparte, invertebrados (sin esqueleto de huesos). Hay animales sin emoji propio.
const GRUPOS_VERTEBRADOS: Group[] = [
  { id: 'mamiferos', label: 'mamíferos', question: '¿Cuál de estos animales es un mamífero?' },
  { id: 'aves', label: 'aves', question: '¿Cuál de estos animales es un ave?' },
  { id: 'peces', label: 'peces', question: '¿Cuál de estos animales es un pez?' },
  { id: 'reptiles', label: 'reptiles', question: '¿Cuál de estos animales es un reptil?' },
  { id: 'anfibios', label: 'anfibios', question: '¿Cuál de estos animales es un anfibio?' },
]

const MAMIFEROS: Member[] = [
  animal('el conejo', 'mamiferos', '🐰'),
  animal('la vaca', 'mamiferos', '🐄'),
  animal('el delfín', 'mamiferos', '🐬'),
  animal('el murciélago', 'mamiferos', '🦇'),
  animal('el elefante', 'mamiferos', '🐘'),
  animal('el perro', 'mamiferos', '🐕'),
  animal('la ballena', 'mamiferos', '🐋'),
  animal('el león', 'mamiferos', '🦁'),
  animal('el mono', 'mamiferos', '🐒'),
]
const AVES: Member[] = [
  animal('la gallina', 'aves', '🐔'),
  animal('el águila', 'aves', '🦅'),
  animal('el pingüino', 'aves', '🐧'),
  animal('el pato', 'aves', '🦆'),
  animal('el búho', 'aves', '🦉'),
  animal('el loro', 'aves', '🦜'),
  animal('el cisne', 'aves', '🦢'),
  animal('el flamenco', 'aves', '🦩'),
  animal('el avestruz', 'aves'),
]
const PECES: Member[] = [
  animal('la trucha', 'peces', '🐟'),
  animal('el tiburón', 'peces', '🦈'),
  animal('el pez payaso', 'peces', '🐠'),
  animal('el pez globo', 'peces', '🐡'),
]
const REPTILES: Member[] = [
  animal('la serpiente', 'reptiles', '🐍'),
  animal('el cocodrilo', 'reptiles', '🐊'),
  animal('la tortuga', 'reptiles', '🐢'),
  animal('el lagarto', 'reptiles', '🦎'),
]
const ANFIBIOS: Member[] = [
  animal('la rana', 'anfibios', '🐸'),
  animal('la salamandra', 'anfibios'),
  animal('el sapo', 'anfibios'),
  animal('el tritón', 'anfibios'),
]
const INVERTEBRADOS: Member[] = [
  animal('la hormiga', 'invertebrado', '🐜'),
  animal('la abeja', 'invertebrado', '🐝'),
  animal('la mariposa', 'invertebrado', '🦋'),
  animal('el mosquito', 'invertebrado', '🦟'),
  animal('la mariquita', 'invertebrado', '🐞'),
  animal('la mosca', 'invertebrado', '🪰'),
  animal('la araña', 'invertebrado', '🕷️'),
  animal('el caracol', 'invertebrado', '🐌'),
  animal('el cangrejo', 'invertebrado', '🦀'),
  animal('la medusa', 'invertebrado', '🪼'),
  animal('la lombriz', 'invertebrado', '🪱'),
  animal('el pulpo', 'invertebrado', '🐙'),
]

const VERTEBRADOS_POR_GRUPO: Member[] = [...MAMIFEROS, ...AVES, ...PECES, ...REPTILES, ...ANFIBIOS]

const VERTEBRADO_O_NO: Group[] = [
  { id: 'vertebrado', label: 'vertebrado', question: '¿Cuál de estos animales es un vertebrado?' },
  { id: 'invertebrado', label: 'invertebrado', question: '¿Cuál de estos animales es un invertebrado?' },
]
const ANIMALES_VERTEBRADO_O_NO: Member[] = [...VERTEBRADOS_POR_GRUPO.map((a) => ({ ...a, group: 'vertebrado' })), ...INVERTEBRADOS]

const vertebrados: FactItem[] = [
  {
    question: '¿Qué tienen los vertebrados dentro del cuerpo?',
    answer: 'un esqueleto de huesos',
    wrong: ['solo músculos y piel', 'un cuerpo de gelatina', 'una concha de madera'],
    visual: '🦴',
  },
  { question: '¿Cuántos grupos de vertebrados hay?', answer: 'cinco', wrong: ['tres', 'siete', 'diez'] },
  {
    question: 'Los invertebrados…',
    answer: 'no tienen esqueleto de huesos',
    wrong: ['tienen huesos por todo el cuerpo', 'tienen una columna vertebral', 'siempre tienen plumas'],
  },
  {
    question: '¿Cuál de estos grupos es de vertebrados?',
    answer: 'los peces',
    wrong: ['los insectos', 'los caracoles', 'las medusas'],
  },
  {
    question: '¿Cómo se llaman los huesos de la columna vertebral?',
    answer: 'vértebras',
    wrong: ['costillas', 'muelas', 'uñas'],
  },
]

// ── Los mamíferos y las aves ───────────────────────────────────────────────────────────────────────────────────────────
// Mamíferos: vivíparos, pelo, las crías maman. Aves: ovíparas, plumas, pico. Casos curiosos: el murciélago (mamífero con
// alas), el delfín (mamífero acuático), el pingüino y el avestruz (aves que no vuelan).
const MAMIFERO_O_AVE: Group[] = [
  { id: 'mamifero', label: 'mamífero', question: '¿Cuál de estas cosas es propia de un mamífero?' },
  { id: 'ave', label: 'ave', question: '¿Cuál de estas cosas es propia de un ave?' },
]
const CARACTERISTICAS: Member[] = [
  { label: 'tiene pelo', group: 'mamifero' },
  { label: 'sus crías maman', group: 'mamifero' },
  { label: 'nace del vientre de su madre', group: 'mamifero' },
  { label: 'es un animal vivíparo', group: 'mamifero' },
  { label: 'tiene plumas', group: 'ave' },
  { label: 'tiene pico', group: 'ave' },
  { label: 'nace de un huevo', group: 'ave' },
  { label: 'es un animal ovíparo', group: 'ave' },
]
const MAMIFERO_O_AVE_ANIMALES: Group[] = [
  { id: 'mamifero', label: 'mamífero', question: '¿Cuál de estos animales es un mamífero?' },
  { id: 'ave', label: 'ave', question: '¿Cuál de estos animales es un ave?' },
]
const ANIMALES_MAMIFEROS_Y_AVES: Member[] = [...MAMIFEROS.map((a) => ({ ...a, group: 'mamifero' })), ...AVES.map((a) => ({ ...a, group: 'ave' }))]

const mamiferosYAves: FactItem[] = [
  {
    question: '¿Qué es un animal vivíparo?',
    answer: 'el que nace del vientre de su madre',
    wrong: ['el que nace de un huevo', 'el que vive en el agua', 'el que tiene alas'],
  },
  {
    question: '¿Qué es un animal ovíparo?',
    answer: 'el que nace de un huevo',
    wrong: ['el que nace del vientre de su madre', 'el que no tiene huesos', 'el que bebe leche'],
  },
  {
    question: '¿De qué se alimentan las crías de los mamíferos al principio?',
    answer: 'de la leche de su madre',
    wrong: ['de insectos', 'de huevos', 'de hierba'],
  },
  {
    question: '¿Qué mamífero tiene alas?',
    answer: 'el murciélago',
    wrong: ['el pingüino', 'la gallina', 'el águila'],
    visual: '🦇',
  },
  {
    question: '¿Qué mamífero vive en el agua y tiene aletas?',
    answer: 'el delfín',
    wrong: ['el tiburón', 'el pingüino', 'la trucha'],
    visual: '🐬',
  },
  {
    question: 'El pingüino es un ave que…',
    answer: 'no vuela y nada muy bien',
    wrong: ['vuela más alto que el águila', 'vive en el desierto', 'tiene pelo'],
    visual: '🐧',
  },
  { question: '¿Cuántas patas tienen las aves?', answer: 'dos', wrong: ['cuatro', 'seis', 'ocho'] },
  {
    question: 'El avestruz es un ave que…',
    answer: 'no puede volar',
    wrong: ['vive en el agua', 'da leche a sus crías', 'tiene cuatro patas'],
  },
]

// ── Peces, reptiles y anfibios ─────────────────────────────────────────────────────────────────────────────────────────
const PECES_REPTILES_ANFIBIOS: Group[] = [
  { id: 'peces', label: 'peces', question: '¿Cuál de estos animales es un pez?' },
  { id: 'reptiles', label: 'reptiles', question: '¿Cuál de estos animales es un reptil?' },
  { id: 'anfibios', label: 'anfibios', question: '¿Cuál de estos animales es un anfibio?' },
]
const ANIMALES_PECES_REPTILES_ANFIBIOS: Member[] = [...PECES, ...REPTILES, ...ANFIBIOS]

const pecesReptilesAnfibios: FactItem[] = [
  { question: '¿Cómo respiran los peces?', answer: 'con branquias', wrong: ['con la nariz', 'con los dientes', 'con las aletas'], visual: '🐟' },
  { question: '¿Qué cubre el cuerpo de los peces?', answer: 'escamas', wrong: ['plumas', 'pelo', 'una piel fina sin nada'] },
  { question: '¿Qué tienen los peces en lugar de patas?', answer: 'aletas', wrong: ['alas', 'pezuñas', 'garras'] },
  {
    question: '¿Cómo es la piel de los anfibios?',
    answer: 'desnuda y húmeda',
    wrong: ['cubierta de plumas', 'cubierta de pelo', 'cubierta de escamas duras'],
  },
  { question: '¿Qué anfibio tiene cola?', answer: 'la salamandra', wrong: ['la rana', 'el sapo', 'la tortuga'] },
  { question: '¿Dónde viven las crías de las ranas?', answer: 'en el agua', wrong: ['en un nido', 'en una cueva seca', 'en el desierto'], visual: '🐸' },
  { question: '¿Cómo se llaman las crías de la rana?', answer: 'renacuajos', wrong: ['gazapos', 'polluelos', 'cachorros'] },
  { question: '¿Qué reptil no tiene patas?', answer: 'la serpiente', wrong: ['el lagarto', 'el cocodrilo', 'la tortuga'], visual: '🐍' },
  { question: '¿Qué reptil tiene caparazón?', answer: 'la tortuga', wrong: ['la serpiente', 'el lagarto', 'el cocodrilo'], visual: '🐢' },
]

// ── Los animales invertebrados ─────────────────────────────────────────────────────────────────────────────────────────
// Insectos: seis patas, dos antenas y casi todos con alas. La araña no es un insecto (ocho patas).
const INSECTO_O_NO: Group[] = [
  { id: 'insecto', label: 'insecto', question: '¿Cuál de estos animales es un insecto?' },
  { id: 'noinsecto', label: 'no es un insecto', question: '¿Cuál de estos animales NO es un insecto?' },
]
const INSECTOS: Member[] = [
  animal('la hormiga', 'insecto', '🐜'),
  animal('la abeja', 'insecto', '🐝'),
  animal('la mariposa', 'insecto', '🦋'),
  animal('el mosquito', 'insecto', '🦟'),
  animal('la mariquita', 'insecto', '🐞'),
  animal('la mosca', 'insecto', '🪰'),
  animal('la araña', 'noinsecto', '🕷️'),
  animal('el caracol', 'noinsecto', '🐌'),
  animal('el cangrejo', 'noinsecto', '🦀'),
  animal('la medusa', 'noinsecto', '🪼'),
  animal('la lombriz', 'noinsecto', '🪱'),
  animal('el pulpo', 'noinsecto', '🐙'),
]

const AGUA_O_NO: Group[] = [
  { id: 'agua', label: 'vive en el agua', question: '¿Cuál de estos animales vive en el agua?' },
  { id: 'fuera', label: 'vive fuera del agua', question: '¿Cuál de estos animales NO vive en el agua?' },
]
const INVERTEBRADOS_DONDE: Member[] = [
  animal('la medusa', 'agua', '🪼'),
  animal('el pulpo', 'agua', '🐙'),
  animal('el cangrejo de mar', 'agua', '🦀'),
  animal('el calamar', 'agua', '🦑'),
  animal('el mejillón', 'agua'),
  animal('la lombriz', 'fuera', '🪱'),
  animal('la hormiga', 'fuera', '🐜'),
  animal('el caracol de jardín', 'fuera', '🐌'),
  animal('la abeja', 'fuera', '🐝'),
  animal('la mariposa', 'fuera', '🦋'),
]

const invertebrados: FactItem[] = [
  { question: '¿Cuántas patas tiene un insecto?', answer: 'seis', wrong: ['cuatro', 'ocho', 'dos'], visual: '🐜' },
  { question: '¿Cuántas patas tiene una araña?', answer: 'ocho', wrong: ['seis', 'cuatro', 'diez'], visual: '🕷️' },
  { question: '¿Cuántas antenas tiene un insecto?', answer: 'dos', wrong: ['cuatro', 'ocho', 'ninguna'] },
  {
    question: '¿La araña es un insecto?',
    answer: 'no, tiene ocho patas',
    wrong: ['sí, porque tiene seis patas', 'sí, porque tiene antenas', 'no, porque tiene alas'],
  },
  { question: '¿Qué tienen casi todos los insectos adultos?', answer: 'alas', wrong: ['aletas', 'plumas', 'pelo'] },
  {
    question: '¿Qué invertebrado tiene el cuerpo blando como gelatina y tentáculos?',
    answer: 'la medusa',
    wrong: ['el cangrejo', 'el caracol', 'la abeja'],
  },
  { question: '¿Qué invertebrado lleva concha?', answer: 'el caracol', wrong: ['la medusa', 'la lombriz', 'la hormiga'] },
  { question: '¿Qué invertebrado tiene pinzas?', answer: 'el cangrejo', wrong: ['la mariposa', 'la medusa', 'el caracol'], visual: '🦀' },
]

// ── ¿Dónde viven los animales? ─────────────────────────────────────────────────────────────────────────────────────────
// Hábitat, adaptaciones y qué comen (herbívoros, carnívoros y omnívoros, con animales inequívocos).
const HABITATS: Group[] = [
  { id: 'mar', label: 'en el mar' },
  { id: 'rio', label: 'en un río, lago o charca' },
  { id: 'desierto', label: 'en el desierto' },
  { id: 'polo', label: 'en los polos' },
  { id: 'bosque', label: 'en el bosque' },
  { id: 'selva', label: 'en la selva' },
]
const ANIMALES_HABITAT: Member[] = [
  animal('la ballena', 'mar', '🐋'),
  animal('el tiburón', 'mar', '🦈'),
  animal('el pez payaso', 'mar', '🐠'),
  animal('el pulpo', 'mar', '🐙'),
  animal('la trucha', 'rio', '🐟'),
  animal('la nutria', 'rio', '🦦'),
  animal('el castor', 'rio', '🦫'),
  animal('la rana', 'rio', '🐸'),
  animal('el camello', 'desierto', '🐪'),
  animal('el dromedario', 'desierto'),
  animal('el pingüino', 'polo', '🐧'),
  animal('el oso polar', 'polo'),
  animal('la morsa', 'polo'),
  animal('el ciervo', 'bosque', '🦌'),
  animal('el jabalí', 'bosque', '🐗'),
  animal('la ardilla', 'bosque', '🐿️'),
  animal('el lobo', 'bosque', '🐺'),
  animal('el loro', 'selva', '🦜'),
  animal('el perezoso', 'selva', '🦥'),
  animal('el tucán', 'selva'),
]

const ADAPTACIONES: PairRow[] = [
  {
    ask: '¿Con qué respira el pez dentro del agua?',
    answer: 'con las branquias',
    askBack: '¿Qué animal respira con branquias?',
    answerBack: 'el pez',
    emoji: '🐟',
  },
  {
    ask: '¿Qué protege del frío al oso polar?',
    answer: 'su pelo grueso',
    askBack: '¿Qué animal tiene un pelo muy grueso para aguantar el frío?',
    answerBack: 'el oso polar',
  },
  {
    ask: '¿Con qué se defiende el erizo?',
    answer: 'con sus púas',
    askBack: '¿Qué animal se defiende con púas?',
    answerBack: 'el erizo',
    emoji: '🦔',
  },
  {
    ask: '¿Para qué le sirven al conejo sus orejas grandes?',
    answer: 'para oír bien los peligros',
    askBack: '¿Qué animal tiene orejas grandes para oír los peligros?',
    answerBack: 'el conejo',
    emoji: '🐇',
  },
  {
    ask: '¿Cómo trepa la cabra montés por las rocas?',
    answer: 'con sus patas fuertes y pezuñas',
    askBack: '¿Qué animal trepa por las rocas con pezuñas fuertes?',
    answerBack: 'la cabra montés',
    emoji: '🐐',
  },
  {
    ask: '¿Qué guarda el camello en su joroba?',
    answer: 'reservas de grasa',
    askBack: '¿Qué animal guarda grasa en su joroba?',
    answerBack: 'el camello',
    emoji: '🐪',
  },
]

const ALIMENTACION: Group[] = [
  { id: 'herbivoro', label: 'herbívoro', question: '¿Cuál de estos animales es herbívoro?' },
  { id: 'carnivoro', label: 'carnívoro', question: '¿Cuál de estos animales es carnívoro?' },
  { id: 'omnivoro', label: 'omnívoro', question: '¿Cuál de estos animales es omnívoro?' },
]
const QUE_COMEN: Member[] = [
  animal('el conejo', 'herbivoro', '🐇'),
  animal('la vaca', 'herbivoro', '🐄'),
  animal('el caballo', 'herbivoro', '🐴'),
  animal('la oveja', 'herbivoro', '🐑'),
  animal('el león', 'carnivoro', '🦁'),
  animal('el lobo', 'carnivoro', '🐺'),
  animal('el águila', 'carnivoro', '🦅'),
  animal('el búho', 'carnivoro', '🦉'),
  animal('el tiburón', 'carnivoro', '🦈'),
  animal('el oso pardo', 'omnivoro', '🐻'),
  animal('el jabalí', 'omnivoro', '🐗'),
  animal('el cerdo', 'omnivoro', '🐖'),
  animal('la gallina', 'omnivoro', '🐔'),
]

const habitat: FactItem[] = [
  { question: '¿Cómo se llama el lugar donde vive un animal?', answer: 'su hábitat', wrong: ['su disfraz', 'su colegio', 'su camino'] },
  {
    question: '¿Qué hacen los animales en su hábitat?',
    answer: 'comen, se refugian y tienen crías',
    wrong: ['solo duermen', 'solo juegan', 'solo se esconden'],
  },
  { question: '¿Cómo se llama el animal que come solo plantas?', answer: 'herbívoro', wrong: ['carnívoro', 'omnívoro', 'invertebrado'] },
  { question: '¿Cómo se llama el animal que come otros animales?', answer: 'carnívoro', wrong: ['herbívoro', 'omnívoro', 'vertebrado'] },
  { question: '¿Cómo se llama el animal que come plantas y animales?', answer: 'omnívoro', wrong: ['herbívoro', 'carnívoro', 'vivíparo'] },
  {
    question: '¿Cómo se llaman los animales que viven en el agua?',
    answer: 'los acuáticos',
    wrong: ['los terrestres', 'los herbívoros', 'los voladores'],
  },
  { question: 'Los animales terrestres viven…', answer: 'en la tierra', wrong: ['en el mar', 'en los ríos', 'en las charcas'] },
]

export const temasUnidad2: Topic[] = [
  {
    id: 'vertebrados',
    name: 'Vertebrados e invertebrados',
    icon: '🦴',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'pick-member', groups: VERTEBRADO_O_NO, items: ANIMALES_VERTEBRADO_O_NO }, count: 3 },
      { spec: { kind: 'classify', question: '¿A qué grupo pertenece {item}?', groups: GRUPOS_VERTEBRADOS, items: VERTEBRADOS_POR_GRUPO }, count: 3 },
      { spec: { kind: 'pick-member', groups: GRUPOS_VERTEBRADOS, items: VERTEBRADOS_POR_GRUPO }, count: 2 },
      { spec: { kind: 'facts', items: vertebrados }, count: 2 },
    ],
  },
  {
    id: 'mamiferos-aves',
    name: 'Los mamíferos y las aves',
    icon: '🐘',
    tint: '#ffd1dc',
    plan: [
      { spec: { kind: 'pick-member', groups: MAMIFERO_O_AVE, items: CARACTERISTICAS }, count: 4 },
      { spec: { kind: 'pick-member', groups: MAMIFERO_O_AVE_ANIMALES, items: ANIMALES_MAMIFEROS_Y_AVES }, count: 3 },
      { spec: { kind: 'facts', items: mamiferosYAves }, count: 3 },
    ],
  },
  {
    id: 'peces-reptiles-anfibios',
    name: 'Peces, reptiles y anfibios',
    icon: '🐸',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'classify', question: '¿A qué grupo pertenece {item}?', groups: PECES_REPTILES_ANFIBIOS, items: ANIMALES_PECES_REPTILES_ANFIBIOS }, count: 3 },
      { spec: { kind: 'pick-member', groups: PECES_REPTILES_ANFIBIOS, items: ANIMALES_PECES_REPTILES_ANFIBIOS }, count: 2 },
      {
        spec: {
          kind: 'sequence',
          id: 'rana',
          steps: ['un huevo', 'un renacuajo', 'una rana con patas', 'una rana adulta'],
          extra: ['un nido', 'un polluelo'],
          first: '¿Qué viene primero en la vida de una rana?',
          last: '¿Qué viene en último lugar en la vida de una rana?',
          after: '¿Qué viene justo después de {step} en la vida de una rana?',
          before: '¿Qué viene justo antes de {step} en la vida de una rana?',
        },
        count: 2,
      },
      { spec: { kind: 'facts', items: pecesReptilesAnfibios }, count: 3 },
    ],
  },
  {
    id: 'invertebrados',
    name: 'Los animales invertebrados',
    icon: '🐌',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'pick-member', groups: INSECTO_O_NO, items: INSECTOS }, count: 4 },
      { spec: { kind: 'pick-member', groups: AGUA_O_NO, items: INVERTEBRADOS_DONDE }, count: 1 },
      {
        spec: {
          kind: 'sequence',
          id: 'mariposa',
          steps: ['un huevo', 'una oruga', 'un capullo', 'una mariposa'],
          first: '¿Qué viene primero en la vida de una mariposa?',
          last: '¿Qué viene en último lugar en la vida de una mariposa?',
          after: '¿Qué viene justo después de {step} en la vida de una mariposa?',
          before: '¿Qué viene justo antes de {step} en la vida de una mariposa?',
        },
        count: 2,
      },
      { spec: { kind: 'facts', items: invertebrados }, count: 3 },
    ],
  },
  {
    id: 'habitat',
    name: '¿Dónde viven los animales?',
    icon: '🌍',
    tint: '#bfe3ff',
    plan: [
      { spec: { kind: 'classify', question: '¿Dónde vive {item}?', groups: HABITATS, items: ANIMALES_HABITAT }, count: 2 },
      { spec: { kind: 'pairs', rows: ADAPTACIONES }, count: 2 },
      { spec: { kind: 'classify', question: '{item}: ¿herbívoro, carnívoro u omnívoro?', groups: ALIMENTACION, items: QUE_COMEN }, count: 2 },
      { spec: { kind: 'pick-member', groups: ALIMENTACION, items: QUE_COMEN }, count: 1 },
      {
        spec: {
          kind: 'sequence',
          id: 'cadena',
          steps: ['la hierba', 'un conejo', 'un lobo'],
          extra: ['la nube', 'una piedra'],
          first: 'En la cadena «la hierba, un conejo, un lobo», ¿qué va primero?',
          last: 'En la cadena «la hierba, un conejo, un lobo», ¿qué va al final?',
          after: '¿Qué animal come {step}?',
          before: '¿Qué come {step}?',
        },
        count: 1,
      },
      { spec: { kind: 'facts', items: habitat }, count: 2 },
    ],
  },
]
