import type { Unit } from '../../types'
import { temasUnidad1 } from './unidad1'

// Unidades de Matemáticas de 2º de Primaria (ver docs/matematicas-2-primaria.md).
// Las unidades sin temas se muestran como "Muy pronto".
export const unidadesMatematicas: Unit[] = [
  { id: 'u1', name: 'Unidad 1', note: 'Números hasta el 99 · sumas y restas', icon: '🚌', tint: '#ffd1dc', topics: temasUnidad1 },
  { id: 'u2', name: 'Unidad 2', note: 'Sumas llevando · números hasta el 199', icon: '🚴', tint: '#ffe9a8', topics: [] },
  { id: 'u3', name: 'Unidad 3', note: 'Restas llevando · el litro', icon: '🐠', tint: '#cdb9ff', topics: [] },
  { id: 'u4', name: 'Unidad 4', note: 'Números hasta el 399 · el metro', icon: '🩺', tint: '#b5ecc1', topics: [] },
  { id: 'u5', name: 'Unidad 5', note: 'Números hasta el 799 · el kilogramo', icon: '🛒', tint: '#bfe3ff', topics: [] },
  { id: 'u6', name: 'Unidad 6', note: 'Números hasta el 999 · figuras planas', icon: '🎲', tint: '#ffd2b0', topics: [] },
  { id: 'u7', name: 'Unidad 7', note: 'Euros · restas de tres cifras', icon: '🛍️', tint: '#ffd1dc', topics: [] },
  { id: 'u8', name: 'Unidad 8', note: 'El reloj · simetría · cuerpos geométricos', icon: '🏫', tint: '#ffe9a8', topics: [] },
  { id: 'u9', name: 'Unidad 9', note: 'Multiplicar · doble y mitad', icon: '🏖️', tint: '#cdb9ff', topics: [] },
]
