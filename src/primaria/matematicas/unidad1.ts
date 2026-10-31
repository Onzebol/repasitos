import type { ChoiceExercise, NumberExercise, Topic } from '../../types'

const elegir = (question: string, options: string[], answer: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options,
  answer,
})

const numero = (question: string, answer: number): NumberExercise => ({
  type: 'number',
  question,
  answer,
})

// Unidad 1: números hasta el 99, decenas y unidades, signos > y <,
// sumas y restas sin llevar, decena más cercana y cálculo mental.
// Cada tema es un plan de 10 ejercicios: las plantillas (src/generators.ts) crean ejercicios nuevos
// en cada sesión y las listas ("bag") reparten ejercicios escritos a mano.
export const temasUnidad1: Topic[] = [
  {
    id: 'numeros-99',
    name: 'Números hasta el 99',
    icon: '🔢',
    tint: '#ffd1dc',
    plan: [
      { spec: { kind: 'neighbor', mode: 'after', min: 10, max: 99 }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'before', min: 10, max: 99 }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'between', min: 10, max: 99 }, count: 1 },
      { spec: { kind: 'extreme', mode: 'greatest' }, count: 1 },
      { spec: { kind: 'extreme', mode: 'smallest' }, count: 1 },
      {
        spec: {
          kind: 'bag',
          items: [
            elegir('¿Cómo se lee el número 86?', ['ochenta y seis', 'sesenta y ocho', 'ochenta y cinco'], 'ochenta y seis'),
            elegir('¿Cómo se lee el número 54?', ['cincuenta y cuatro', 'cuarenta y cinco', 'cincuenta y cinco'], 'cincuenta y cuatro'),
            elegir('¿Cómo se lee el número 91?', ['noventa y uno', 'diecinueve', 'ochenta y uno'], 'noventa y uno'),
            elegir('¿Cómo se lee el número 73?', ['setenta y tres', 'treinta y siete', 'setenta y dos'], 'setenta y tres'),
          ],
        },
        count: 1,
      },
      { spec: { kind: 'series', step: 10 }, count: 1 },
      { spec: { kind: 'series', step: 1 }, count: 1 },
      {
        spec: {
          kind: 'bag',
          items: [
            numero('Escribe con cifras: setenta y dos', 72),
            numero('Escribe con cifras: cuarenta y cinco', 45),
            numero('Escribe con cifras: noventa y tres', 93),
            numero('Escribe con cifras: sesenta y uno', 61),
            numero('Escribe con cifras: ochenta y ocho', 88),
            numero('Escribe con cifras: cincuenta y siete', 57),
          ],
        },
        count: 2,
      },
    ],
  },
  {
    id: 'decenas-unidades',
    name: 'Decenas y unidades',
    icon: '🧱',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'place-value', ask: 'read' }, count: 3 },
      { spec: { kind: 'place-value', ask: 'tens' }, count: 1 },
      { spec: { kind: 'place-value', ask: 'units' }, count: 1 },
      { spec: { kind: 'place-value', ask: 'compose' }, count: 2 },
      { spec: { kind: 'place-value', ask: 'blocks' }, count: 2 },
      {
        spec: {
          kind: 'bag',
          items: [
            elegir('10 unidades forman 1…', ['decena', 'centena', 'unidad'], 'decena'),
            numero('¿Cuántas unidades tiene 1 decena?', 10),
          ],
        },
        count: 1,
      },
    ],
  },
  {
    id: 'mayor-menor',
    name: 'Los signos > y <',
    icon: '⚖️',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'compare', mode: 'sign' }, count: 5 },
      { spec: { kind: 'compare', mode: 'statement' }, count: 2 },
      { spec: { kind: 'compare', mode: 'order' }, count: 3 },
    ],
  },
  {
    id: 'sumas-restas',
    name: 'Sumas y restas sin llevar',
    icon: '➕',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'column', operator: '+' }, count: 3 },
      { spec: { kind: 'column', operator: '−' }, count: 3 },
      { spec: { kind: 'word-problem', operator: '+' }, count: 2 },
      { spec: { kind: 'word-problem', operator: '−' }, count: 2 },
    ],
  },
  {
    id: 'decena-cercana',
    name: 'La decena más cercana',
    icon: '🎯',
    tint: '#bfe3ff',
    plan: [{ spec: { kind: 'nearest-ten' }, count: 10 }],
  },
  {
    id: 'calculo-mental',
    name: 'Cálculo mental',
    icon: '🧠',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'mental', mode: 'add-bridge' }, count: 3 },
      { spec: { kind: 'mental', mode: 'sub-bridge' }, count: 3 },
      { spec: { kind: 'mental', mode: 'tens-add' }, count: 2 },
      { spec: { kind: 'mental', mode: 'tens-sub' }, count: 2 },
    ],
  },
]
