import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Subject } from '../types'
import { SubjectsScreen } from './SubjectsScreen'

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

  it('en Infantil, sin texto, las desactivadas solo se ven apagadas', () => {
    abrir('infantil')
    expect(screen.queryByText('Muy pronto')).not.toBeInTheDocument()
  })
})
