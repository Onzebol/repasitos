import type { Exercise, Topic } from '../types'

// Tema de prueba con ejercicios fijos y en este orden: cada uno es una bolsa de un solo elemento
export const topicFrom = (exercises: Exercise[], name = 'Tema de prueba'): Topic => ({
  id: 'prueba',
  name,
  icon: '🧪',
  tint: '#fff',
  plan: exercises.map((item) => ({ spec: { kind: 'bag', items: [item] }, count: 1 })),
})
