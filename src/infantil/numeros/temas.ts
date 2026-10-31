import type { Topic, Unit } from '../../types'

// Números de 3º de Infantil (#10): se cuenta hasta el 7 y se reconocen y escriben las cifras hasta el 9 (cuadernos de
// Edelvives). Casi sin texto: dibujos, cifras grandes y la pregunta en voz alta. Ejercicios escritos desde cero.
export const temasNumeros: Topic[] = [
  {
    id: 'contar',
    name: 'Contar tocando',
    icon: '👆',
    tint: '#bfe3ff',
    plan: [{ spec: { kind: 'how-many', min: 1, max: 7, tap: true }, count: 10 }],
  },
  {
    id: 'cuantos-hay',
    name: '¿Cuántos hay?',
    icon: '🐶',
    tint: '#ffd1dc',
    plan: [{ spec: { kind: 'how-many', min: 1, max: 7 }, count: 10 }],
  },
  {
    id: 'cantidad-numero',
    name: '¿Dónde hay…?',
    icon: '🍎',
    tint: '#ffd2b0',
    plan: [{ spec: { kind: 'group', min: 1, max: 7 }, count: 10 }],
  },
  {
    id: 'las-cifras',
    name: 'Las cifras',
    icon: '🔢',
    tint: '#cdb9ff',
    plan: [{ spec: { kind: 'digit', min: 1, max: 9 }, count: 10 }],
  },
  {
    id: 'antes-despues',
    name: 'Antes y después',
    icon: '🚂',
    tint: '#b5ecc1',
    plan: [
      { spec: { kind: 'next-number', mode: 'after', min: 1, max: 9 }, count: 4 },
      { spec: { kind: 'next-number', mode: 'before', min: 1, max: 9 }, count: 3 },
      { spec: { kind: 'next-number', mode: 'between', min: 1, max: 9 }, count: 3 },
    ],
  },
  {
    id: 'mas-menos',
    name: 'Más y menos',
    icon: '⚖️',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'more-less', mode: 'more', min: 1, max: 7 }, count: 5 },
      { spec: { kind: 'more-less', mode: 'less', min: 1, max: 7 }, count: 5 },
    ],
  },
  {
    id: 'trazo',
    name: 'Trazo de las cifras',
    icon: '✏️',
    tint: '#ffe9a8',
    plan: [{ spec: { kind: 'trace', min: 0, max: 9 }, count: 10 }],
  },
]

// En Infantil no hay unidades: Números muestra sus temas directamente (ver src/routes.ts)
export const unidadNumeros: Unit = {
  id: 'numeros',
  name: 'Números',
  note: '',
  icon: '🔢',
  tint: '#b5ecc1',
  topics: temasNumeros,
}
