import type { Unit } from '../../types'
import { temasUnidad1 } from './unidad1'

// Unidades de Conocimiento del medio de 2º de Primaria (ver docs/conocimiento-del-medio-2-primaria.md).
// Las unidades sin temas se muestran como "Muy pronto".
export const unidadesMedio: Unit[] = [
  { id: 'u1', name: 'Unidad 1', note: 'Crecemos y cambiamos', icon: '🧒', tint: '#ffd1dc', topics: temasUnidad1 },
  { id: 'u2', name: 'Unidad 2', note: 'Clasificamos animales', icon: '🐾', tint: '#ffe9a8', topics: [] },
  { id: 'u3', name: 'Unidad 3', note: 'Identificamos plantas', icon: '🌱', tint: '#cdb9ff', topics: [] },
  { id: 'u4', name: 'Unidad 4', note: 'Observamos el paisaje', icon: '🏞️', tint: '#b5ecc1', topics: [] },
  { id: 'u5', name: 'Unidad 5', note: 'Descubrimos el universo', icon: '🪐', tint: '#bfe3ff', topics: [] },
  { id: 'u6', name: 'Unidad 6', note: 'Necesitamos agua y aire', icon: '💧', tint: '#ffd2b0', topics: [] },
  { id: 'u7', name: 'Unidad 7', note: 'Vivimos en una localidad', icon: '🏘️', tint: '#ffd1dc', topics: [] },
  { id: 'u8', name: 'Unidad 8', note: 'Conocemos nuestra historia', icon: '🏛️', tint: '#ffe9a8', topics: [] },
  { id: 'u9', name: 'Unidad 9', note: 'Hacemos experimentos', icon: '🔬', tint: '#cdb9ff', topics: [] },
]
