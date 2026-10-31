import type { Unit } from '../types'
import { unidadNumeros } from './numeros/temas'

// Materias de Infantil que ya tienen ejercicios, por id de materia. Cada una tiene una sola «unidad» que no se
// muestra: la materia abre directamente sus temas.
export const unidadesInfantil: Record<string, Unit[]> = {
  numeros: [unidadNumeros],
}
