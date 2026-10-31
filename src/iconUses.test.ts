import { describe, expect, it } from 'vitest'
import { agruparPorIcono, usosDeIconos } from './iconUses'
import { iconosInterfaz } from './icons'
import { materiasInfantil } from './infantil/materias'
import { unidadesPorMateria } from './primaria/contenido'
import { materiasPrimaria } from './primaria/materias'

describe('usosDeIconos: qué icono se usa y para qué', () => {
  const usos = usosDeIconos()

  it('recoge cada materia de Infantil y de Primaria con su icono y su nombre', () => {
    for (const materia of [...materiasInfantil, ...materiasPrimaria]) {
      expect(usos).toContainEqual(expect.objectContaining({ icono: materia.icon, tipo: 'materia', uso: materia.name }))
    }
  })

  it('recoge cada unidad y cada tema de Primaria', () => {
    for (const unidades of Object.values(unidadesPorMateria)) {
      for (const unidad of unidades) {
        expect(usos).toContainEqual(expect.objectContaining({ icono: unidad.icon, tipo: 'unidad', uso: unidad.name }))
        for (const tema of unidad.topics) {
          expect(usos).toContainEqual(expect.objectContaining({ icono: tema.icon, tipo: 'tema', uso: tema.name }))
        }
      }
    }
  })

  it('recoge todos los iconos de la interfaz, cada uno con su función', () => {
    for (const icono of Object.values(iconosInterfaz)) {
      expect(icono.uso).not.toBe('')
      expect(icono.donde).not.toBe('')
      expect(usos).toContainEqual(expect.objectContaining({ tipo: 'interfaz', uso: icono.uso }))
    }
  })

  it('todos los usos explican dónde aparecen', () => {
    for (const uso of usos) expect(uso.donde).not.toBe('')
  })
})

describe('agruparPorIcono', () => {
  it('junta los usos del mismo icono y mantiene el orden de aparición', () => {
    const grupos = agruparPorIcono([
      { icono: '➕', tipo: 'materia', uso: 'Matemáticas', donde: 'a' },
      { icono: '🔢', tipo: 'tema', uso: 'Números', donde: 'b' },
      { icono: '➕', tipo: 'tema', uso: 'Sumas', donde: 'c' },
    ])
    expect(grupos.map((grupo) => grupo.icono)).toEqual(['➕', '🔢'])
    expect(grupos[0].usos.map((uso) => uso.uso)).toEqual(['Matemáticas', 'Sumas'])
  })

  it('en los datos reales hay iconos repetidos (por eso se agrupan)', () => {
    expect(agruparPorIcono(usosDeIconos()).some((grupo) => grupo.usos.length > 1)).toBe(true)
  })
})
