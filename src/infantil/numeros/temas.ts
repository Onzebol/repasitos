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
    id: 'las-cifras',
    name: 'Las cifras',
    icon: '🔢',
    tint: '#cdb9ff',
    plan: [{ spec: { kind: 'digit', min: 1, max: 9 }, count: 10 }],
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
