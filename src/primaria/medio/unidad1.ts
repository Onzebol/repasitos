import type { ChoiceExercise, Topic } from '../../types'

const elegir = (question: string, options: string[], answer: string, visual?: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options,
  answer,
  visual,
})

// Unidad 1: «Crecemos y cambiamos» (ver docs/conocimiento-del-medio-2-primaria.md). Ejercicios escritos desde cero con el
// vocabulario de la unidad; cada tema es un plan de 10 por sesión. Por ahora solo tiene «¿Cómo nos alimentamos?».

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
