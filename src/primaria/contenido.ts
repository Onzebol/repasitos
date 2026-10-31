import type { Unit } from '../types'
import { unidadesMatematicas } from './matematicas/unidades'
import { unidadesMedio } from './medio/unidades'

// Materias de Primaria que ya tienen unidades con ejercicios, por id de materia
export const unidadesPorMateria: Record<string, Unit[]> = {
  matematicas: unidadesMatematicas,
  medio: unidadesMedio,
}
