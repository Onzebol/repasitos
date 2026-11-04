import type { ChoiceExercise, Topic } from '../../types'

const elegir = (question: string, options: string[], answer: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options,
  answer,
})

// Unidad 2: sumas llevando, relación entre la suma y la resta, ordinales hasta el 10º,
// la centena (el 100 y las centenas redondas), los números del 100 al 199 y cálculo mental con tres sumandos.
// Como en la unidad 1, cada tema es un plan de 10 ejercicios por sesión.
export const temasUnidad2: Topic[] = [
  {
    id: 'sumas-llevando',
    name: 'Sumas llevando',
    icon: '➕',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'column', operator: '+', carry: true }, count: 2 },
      { spec: { kind: 'column', operator: '+', carry: true, oneDigit: true }, count: 2 },
      { spec: { kind: 'column', operator: '+', carry: true, addends: 3 }, count: 2 },
      { spec: { kind: 'carry-spot' }, count: 2 },
      { spec: { kind: 'word-problem', operator: '+', carry: true }, count: 2 },
    ],
  },
  {
    id: 'suma-resta',
    name: 'La suma y la resta',
    icon: '🔄',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'inverse', mode: 'both', small: true }, count: 2 },
      { spec: { kind: 'inverse', mode: 'missing' }, count: 1 },
      { spec: { kind: 'inverse', mode: 'missing', round: true }, count: 1 },
      { spec: { kind: 'inverse', mode: 'missing-minuend' }, count: 1 },
      { spec: { kind: 'inverse', mode: 'operation' }, count: 1 },
      { spec: { kind: 'subtraction-terms' }, count: 2 },
      { spec: { kind: 'check-subtraction' }, count: 2 },
    ],
  },
  {
    id: 'ordinales',
    name: 'Ordinales',
    icon: '🥇',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'ordinal', mode: 'position' }, count: 2 },
      { spec: { kind: 'ordinal', mode: 'position', noun: true }, count: 1 },
      { spec: { kind: 'ordinal', mode: 'read' }, count: 1 },
      { spec: { kind: 'ordinal', mode: 'read', feminine: true }, count: 1 },
      { spec: { kind: 'ordinal', mode: 'name' }, count: 1 },
      { spec: { kind: 'ordinal', mode: 'name', feminine: true }, count: 1 },
      { spec: { kind: 'ordinal', mode: 'ranking' }, count: 2 },
      { spec: { kind: 'ordinal', mode: 'floors' }, count: 1 },
    ],
  },
  {
    id: 'la-centena',
    name: 'La centena',
    icon: '🟥',
    tint: '#ffc9c2',
    plan: [
      { spec: { kind: 'hundred-units', ask: 'to-tens' }, count: 2 },
      { spec: { kind: 'hundred-units', ask: 'to-units' }, count: 1 },
      { spec: { kind: 'hundred-units', ask: 'blocks' }, count: 2 },
      { spec: { kind: 'hundred-units', ask: 'match' }, count: 1 },
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
      { spec: { kind: 'number-name', ask: 'read', min: 100, max: 900, step: 100 }, count: 1 },
      { spec: { kind: 'number-name', ask: 'write', min: 100, max: 900, step: 100 }, count: 1 },
      { spec: { kind: 'compare', mode: 'order', min: 100, max: 900, step: 100, count: 6 }, count: 1 },
    ],
  },
  {
    id: 'del-100-al-199',
    name: 'Del 100 al 199',
    icon: '💯',
    tint: '#ffd1dc',
    plan: [
      { spec: { kind: 'neighbor', mode: 'after', min: 100, max: 199, cross: true }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'before', min: 100, max: 199, cross: true }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'between', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'compare', mode: 'height' }, count: 1 },
      { spec: { kind: 'table-99', ask: 'missing', from: 100 }, count: 1 },
      { spec: { kind: 'series', step: 1, cross: true }, count: 1 },
      { spec: { kind: 'hundreds', ask: 'read' }, count: 1 },
      { spec: { kind: 'table-99', ask: 'row', from: 100 }, count: 1 },
      { spec: { kind: 'number-name', ask: 'read', min: 100, max: 199 }, count: 1 },
      { spec: { kind: 'number-name', ask: 'write', min: 100, max: 199 }, count: 1 },
    ],
  },
  {
    id: 'problemas',
    name: 'Problemas',
    icon: '🔍',
    tint: '#c9e7f5',
    plan: [
      { spec: { kind: 'problem-step', ask: 'operation' }, count: 2 },
      { spec: { kind: 'problem-step', ask: 'operation', faltan: true }, count: 1 },
      { spec: { kind: 'problem-step', ask: 'calculate' }, count: 2 },
      { spec: { kind: 'word-problem', operator: '+', carry: true }, count: 2 },
      { spec: { kind: 'word-problem', operator: '−', faltan: true }, count: 2 },
      { spec: { kind: 'word-problem', operator: '−' }, count: 1 },
    ],
  },
  {
    id: 'calculo-mental',
    name: 'Cálculo mental',
    icon: '🧠',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'mental', mode: 'add-three' }, count: 3 },
      { spec: { kind: 'mental', mode: 'missing-three' }, count: 3 },
      { spec: { kind: 'mental', mode: 'compare-ten' }, count: 2 },
      { spec: { kind: 'mental', mode: 'add-bridge' }, count: 2 },
    ],
  },
  {
    // Los rincones matemáticos del libro: el número que falta (desafíos) y las cifras de la tabla del 0 al 99 (lógica)
    id: 'desafios-y-logica',
    name: 'Desafíos y lógica',
    icon: '🧩',
    tint: '#d7f0c8',
    plan: [
      { spec: { kind: 'inverse', mode: 'missing', round: true }, count: 2 },
      { spec: { kind: 'inverse', mode: 'missing-minuend', round: true }, count: 2 },
      { spec: { kind: 'inverse', mode: 'missing' }, count: 1 },
      { spec: { kind: 'inverse', mode: 'missing-minuend' }, count: 1 },
      { spec: { kind: 'digit-count' }, count: 2 },
      { spec: { kind: 'table-paint', ask: 'digit' }, count: 2 },
    ],
  },
]
