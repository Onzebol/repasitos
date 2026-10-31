import type { ChoiceExercise, Topic } from '../../types'

const elegir = (question: string, options: string[], answer: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options,
  answer,
})

// Unidad 2: sumas llevando, relación entre la suma y la resta, ordinales hasta el 10.º,
// el 100 y los números del 100 al 199, y cálculo mental con tres sumandos.
// Como en la unidad 1, cada tema es un plan de 10 ejercicios por sesión.
export const temasUnidad2: Topic[] = [
  {
    id: 'sumas-llevando',
    name: 'Sumas llevando',
    icon: '➕',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'column', operator: '+', carry: true }, count: 6 },
      { spec: { kind: 'word-problem', operator: '+', carry: true }, count: 4 },
    ],
  },
  {
    id: 'suma-resta',
    name: 'La suma y la resta',
    icon: '🔄',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'inverse', mode: 'subtract' }, count: 5 },
      { spec: { kind: 'inverse', mode: 'missing' }, count: 3 },
      { spec: { kind: 'inverse', mode: 'operation' }, count: 2 },
    ],
  },
  {
    id: 'ordinales',
    name: 'Ordinales',
    icon: '🥇',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'ordinal', mode: 'position' }, count: 6 },
      { spec: { kind: 'ordinal', mode: 'name' }, count: 4 },
    ],
  },
  {
    id: 'del-100-al-199',
    name: 'Del 100 al 199',
    icon: '💯',
    tint: '#ffd1dc',
    plan: [
      { spec: { kind: 'neighbor', mode: 'after', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'before', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'between', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'extreme', mode: 'greatest', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'compare', mode: 'sign', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'series', step: 1, min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'hundreds', ask: 'read' }, count: 2 },
      { spec: { kind: 'hundreds', ask: 'compose' }, count: 1 },
      {
        spec: {
          kind: 'bag',
          items: [
            elegir('10 decenas forman 1…', ['centena', 'unidad', 'decena'], 'centena'),
            elegir('¿Qué número va después del 99?', ['100', '98', '101'], '100'),
            elegir('El 100 es igual a 10…', ['decenas', 'unidades', 'centenas'], 'decenas'),
          ],
        },
        count: 1,
      },
    ],
  },
  {
    id: 'calculo-mental',
    name: 'Cálculo mental',
    icon: '🧠',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'mental', mode: 'add-three' }, count: 6 },
      { spec: { kind: 'mental', mode: 'add-bridge' }, count: 4 },
    ],
  },
]
