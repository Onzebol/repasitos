import type { Topic } from '../../types'

// Unidad 1: números hasta el 99, decenas y unidades, signos > y <,
// sumas y restas sin llevar, decena más cercana y cálculo mental.
// Cada tema es un plan de 10 ejercicios: las plantillas (src/generators.ts) crean ejercicios nuevos
// en cada sesión (también la lectura y la escritura de números: src/numberNames.ts).
export const temasUnidad1: Topic[] = [
  {
    id: 'numeros-99',
    name: 'Números hasta el 99',
    icon: '🔢',
    tint: '#ffd1dc',
    plan: [
      { spec: { kind: 'neighbor', mode: 'after', min: 10, max: 99 }, count: 1 },
      { spec: { kind: 'neighbor', mode: 'between', min: 10, max: 99 }, count: 1 },
      { spec: { kind: 'extreme', mode: 'greatest' }, count: 1 },
      { spec: { kind: 'series', step: 10 }, count: 1 },
      { spec: { kind: 'number-name', ask: 'read' }, count: 1 },
      { spec: { kind: 'number-name', ask: 'write' }, count: 1 },
      { spec: { kind: 'digit-clue', ask: 'tens' }, count: 1 },
      { spec: { kind: 'table-99', ask: 'row' }, count: 1 },
      { spec: { kind: 'table-99', ask: 'column' }, count: 1 },
      { spec: { kind: 'table-99', ask: 'missing' }, count: 1 },
    ],
  },
  {
    id: 'decenas-unidades',
    name: 'Decenas y unidades',
    icon: '🧱',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'place-value', ask: 'read' }, count: 1 },
      { spec: { kind: 'place-value', ask: 'tens' }, count: 1 },
      { spec: { kind: 'place-value', ask: 'units' }, count: 1 },
      { spec: { kind: 'place-value', ask: 'compose' }, count: 1 },
      { spec: { kind: 'place-value', ask: 'blocks' }, count: 1 },
      { spec: { kind: 'decompose', ask: 'sum' }, count: 1 },
      { spec: { kind: 'decompose', ask: 'pieces' }, count: 1 },
      { spec: { kind: 'decompose', ask: 'words' }, count: 1 },
      { spec: { kind: 'tens-units', ask: 'to-units' }, count: 1 },
      { spec: { kind: 'tens-units', ask: 'to-tens' }, count: 1 },
    ],
  },
  {
    id: 'mayor-menor',
    name: 'Los signos > y <',
    icon: '⚖️',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'compare', mode: 'sign' }, count: 3 },
      { spec: { kind: 'compare', mode: 'complete' }, count: 2 },
      { spec: { kind: 'compare', mode: 'statement' }, count: 1 },
      { spec: { kind: 'compare', mode: 'order' }, count: 2 },
      { spec: { kind: 'compare', mode: 'context' }, count: 2 },
    ],
  },
  {
    id: 'sumas-restas',
    name: 'Sumas y restas sin llevar',
    icon: '➕',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'column', operator: '+' }, count: 2 },
      { spec: { kind: 'column', operator: '+', oneDigit: true }, count: 1 },
      { spec: { kind: 'column', operator: '−' }, count: 1 },
      { spec: { kind: 'column', operator: '−', oneDigit: true }, count: 1 },
      { spec: { kind: 'word-problem', operator: '+' }, count: 2 },
      { spec: { kind: 'word-problem', operator: '−' }, count: 2 },
      { spec: { kind: 'operation-sign' }, count: 1 },
    ],
  },
  {
    id: 'decena-cercana',
    name: 'La decena más cercana',
    icon: '🎯',
    tint: '#bfe3ff',
    plan: [
      { spec: { kind: 'nearest-ten' }, count: 5 },
      { spec: { kind: 'nearest-ten', ask: 'between' }, count: 2 },
      { spec: { kind: 'nearest-ten', ask: 'rule' }, count: 1 },
      { spec: { kind: 'nearest-ten', ask: 'approx' }, count: 2 },
    ],
  },
  {
    // Laboratorio de problemas del libro: los pasos para resolver un problema y los de dos pasos
    id: 'problemas',
    name: 'Resolvemos problemas',
    icon: '🧩',
    tint: '#f7c8e0',
    plan: [
      { spec: { kind: 'problem-step', ask: 'operation' }, count: 2 },
      { spec: { kind: 'problem-step', ask: 'calculate' }, count: 2 },
      { spec: { kind: 'word-problem', operator: '+' }, count: 1 },
      { spec: { kind: 'word-problem', operator: '−' }, count: 1 },
      { spec: { kind: 'two-steps', mode: 'add-sub' }, count: 2 },
      { spec: { kind: 'two-steps', mode: 'sub-add' }, count: 2 },
    ],
  },
  {
    id: 'calculo-mental',
    name: 'Cálculo mental',
    icon: '🧠',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'mental', mode: 'add-small' }, count: 1 },
      { spec: { kind: 'mental', mode: 'sub-small' }, count: 1 },
      { spec: { kind: 'mental', mode: 'add-bridge' }, count: 1 },
      { spec: { kind: 'mental', mode: 'sub-bridge' }, count: 1 },
      { spec: { kind: 'mental', mode: 'tens-add' }, count: 1 },
      { spec: { kind: 'mental', mode: 'tens-sub' }, count: 1 },
      // Series de saltos pequeños, como en el libro (+4, +3, −2, −3), entre 0 y 20
      { spec: { kind: 'series', step: 4, min: 0, max: 20 }, count: 1 },
      { spec: { kind: 'series', step: 3, min: 0, max: 20 }, count: 1 },
      { spec: { kind: 'series', step: 2, min: 0, max: 20, down: true }, count: 1 },
      { spec: { kind: 'series', step: 3, min: 0, max: 20, down: true }, count: 1 },
    ],
  },
]
