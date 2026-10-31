import { iconosInterfaz } from './icons'
import type { UiIcon } from './icons'
import { materiasInfantil } from './infantil/materias'
import { unidadesPorMateria } from './primaria/contenido'
import { materiasPrimaria } from './primaria/materias'

export type IconUse = {
  // Carácter o emoji; las flechas dibujadas llevan `flecha` y su `icono` es un identificador ('flecha-izquierda')
  icono: string
  flecha?: 'left' | 'right'
  tipo: 'interfaz' | 'materia' | 'unidad' | 'tema'
  uso: string
  donde: string
}

// Todos los iconos de la aplicación y para qué sirven, sacados de los propios datos y del registro de src/icons.ts:
// si se añade una materia, unidad o tema, aparece solo.
export function usosDeIconos(): IconUse[] {
  const usos: IconUse[] = []

  for (const icono of Object.values<UiIcon>(iconosInterfaz)) {
    const arrow = icono.arrow
    usos.push({
      icono: arrow ? `flecha-${arrow === 'left' ? 'izquierda' : 'derecha'}` : (icono.glyph ?? ''),
      flecha: arrow,
      tipo: 'interfaz',
      uso: icono.uso,
      donde: icono.donde,
    })
  }
  for (const materia of materiasInfantil) {
    usos.push({ icono: materia.icon, tipo: 'materia', uso: materia.name, donde: 'Infantil · lista de materias' })
  }
  for (const materia of materiasPrimaria) {
    usos.push({ icono: materia.icon, tipo: 'materia', uso: materia.name, donde: 'Primaria · lista de materias' })
  }
  for (const [materiaId, unidades] of Object.entries(unidadesPorMateria)) {
    const materia = materiasPrimaria.find((m) => m.id === materiaId)?.name ?? materiaId
    for (const unidad of unidades) {
      usos.push({ icono: unidad.icon, tipo: 'unidad', uso: unidad.name, donde: `Primaria · ${materia} · lista de unidades` })
      for (const tema of unidad.topics) {
        usos.push({ icono: tema.icon, tipo: 'tema', uso: tema.name, donde: `Primaria · ${materia} · ${unidad.name}` })
      }
    }
  }
  return usos
}

export type IconGroup = { icono: string; flecha?: 'left' | 'right'; usos: IconUse[] }

// Junta los usos del mismo icono (➕ sale en una materia y en un tema), por orden de aparición
export function agruparPorIcono(usos: IconUse[]): IconGroup[] {
  const grupos = new Map<string, IconGroup>()
  for (const uso of usos) {
    const grupo = grupos.get(uso.icono) ?? { icono: uso.icono, flecha: uso.flecha, usos: [] }
    grupo.usos.push(uso)
    grupos.set(uso.icono, grupo)
  }
  return [...grupos.values()]
}
