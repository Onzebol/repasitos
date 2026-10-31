import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { speak } from '../speak'
import type { Subject } from '../types'
import { SubjectsScreen } from './SubjectsScreen'

vi.mock('../speak', () => ({ speak: vi.fn() }))

const materias: Subject[] = [
  { id: 'a', name: 'Con contenido', icon: '🔢', tint: '#fff' },
  { id: 'b', name: 'Sin contenido', icon: '🔤', tint: '#fff' },
]

const abrir = (profile: 'infantil' | 'primaria') => {
  const onSelect = vi.fn()
  render(
    <SubjectsScreen
      profile={profile}
      subjects={materias}
      available={(materia) => materia.id === 'a'}
      onHome={vi.fn()}
      onSelect={onSelect}
    />,
  )
  return { onSelect }
}

describe('SubjectsScreen: materias con y sin contenido', () => {
  it.each(['infantil', 'primaria'] as const)('en %s las materias sin contenido están desactivadas y no se pueden abrir', async (perfil) => {
    const { onSelect } = abrir(perfil)
    expect(screen.getByRole('button', { name: 'Con contenido' })).toBeEnabled()
    const sinContenido = screen.getByRole('button', { name: 'Sin contenido' })
    expect(sinContenido).toBeDisabled()
    await userEvent.setup().click(sinContenido)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('las que tienen contenido se abren', async () => {
    const { onSelect } = abrir('primaria')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Con contenido' }))
    expect(onSelect).toHaveBeenCalledWith(materias[0])
  })

  it('en Primaria las desactivadas dicen «Muy pronto»', () => {
    abrir('primaria')
    expect(screen.getByText('Muy pronto')).toBeInTheDocument()
  })

  it('en Infantil las desactivadas solo se ven apagadas, sin el texto «Muy pronto»', () => {
    abrir('infantil')
    expect(screen.queryByText('Muy pronto')).not.toBeInTheDocument()
  })
})

describe('SubjectsScreen en Infantil: títulos a la vista y sin sonido por defecto', () => {
  it('muestra el título de la pantalla y el nombre de cada materia, a la vista (no solo para lectores de pantalla)', () => {
    abrir('infantil')
    expect(screen.getByRole('heading', { name: 'Elige una materia' })).toBeInTheDocument()
    for (const nombre of ['Con contenido', 'Sin contenido']) {
      const texto = screen.getByText(nombre)
      expect(texto).not.toHaveClass('sr-only')
    }
  })

  it('al tocar una materia no suena nada: la voz solo sale con el botón de sonido', async () => {
    vi.mocked(speak).mockClear()
    const { onSelect } = abrir('infantil')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Con contenido' }))
    expect(onSelect).toHaveBeenCalled()
    expect(speak).not.toHaveBeenCalled()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Escuchar' }))
    expect(speak).toHaveBeenCalledWith('Elige una materia')
  })
})
