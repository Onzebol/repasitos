import type { Unit } from '../../types'
import { temasUnidad1 } from './unidad1'

// Unidades de Lengua de 2º de Primaria (ver docs/lengua-2-primaria.md).
// Las unidades sin temas se muestran como "Muy pronto".
export const unidadesLengua: Unit[] = [
  { id: 'u1', name: 'Unidad 1', note: '¿Te gusta aprender?', icon: '🎒', tint: '#ffd1dc', topics: temasUnidad1 },
  { id: 'u2', name: 'Unidad 2', note: '¿Qué sabes sobre los animales?', icon: '🐄', tint: '#ffe9a8', topics: [] },
  { id: 'u3', name: 'Unidad 3', note: '¿Te sientes artista?', icon: '🎨', tint: '#cdb9ff', topics: [] },
  { id: 'u4', name: 'Unidad 4', note: '¿Nos vamos de viaje?', icon: '🚆', tint: '#b5ecc1', topics: [] },
  { id: 'u5', name: 'Unidad 5', note: '¿A qué jugamos?', icon: '🎲', tint: '#bfe3ff', topics: [] },
  { id: 'u6', name: 'Unidad 6', note: '¿Dónde es la fiesta?', icon: '🎡', tint: '#ffd2b0', topics: [] },
  { id: 'u7', name: 'Unidad 7', note: '¿Te interesa la ciencia?', icon: '🔬', tint: '#ffd1dc', topics: [] },
  { id: 'u8', name: 'Unidad 8', note: '¿Lo hablamos?', icon: '💬', tint: '#ffe9a8', topics: [] },
  { id: 'u9', name: 'Unidad 9', note: '¿Concursamos?', icon: '🏆', tint: '#cdb9ff', topics: [] },
]
