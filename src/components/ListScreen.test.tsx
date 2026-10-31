import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { speak } from '../speak'
import type { Profile } from '../types'
import { ListScreen } from './ListScreen'
import type { ListItem } from './ListScreen'

vi.mock('../speak', () => ({ speak: vi.fn() }))

const items: ListItem[] = [
  { id: 'uno', name: '¿Cuántos hay?', icon: '🐶', tint: '#fff' },
  { id: 'dos', name: 'Las cifras', icon: '🔢', tint: '#fff' },
]

const abrir = (profile: Profile) => {
  const onSelect = vi.fn()
  render(<ListScreen profile={profile} title="Números" items={items} onHome={vi.fn()} onBack={vi.fn()} onSelect={onSelect} />)
  return { onSelect }
}

beforeEach(() => {
  vi.mocked(speak).mockClear()
})

describe('ListScreen: temas y unidades', () => {
  it.each(['infantil', 'primaria'] as const)('en %s muestra el título de la pantalla y el nombre de cada tarjeta a la vista', (profile) => {
    abrir(profile)
    expect(screen.getByRole('heading', { name: 'Números' })).toBeInTheDocument()
    for (const item of items) expect(screen.getByText(item.name)).not.toHaveClass('sr-only')
  })

  it.each(['infantil', 'primaria'] as const)('en %s tocar una tarjeta la abre y no suena nada', async (profile) => {
    const { onSelect } = abrir(profile)
    await userEvent.setup().click(screen.getByRole('button', { name: /Las cifras/ }))
    expect(onSelect).toHaveBeenCalledWith('dos')
    expect(speak).not.toHaveBeenCalled()
  })

  it('la clase de la pantalla es la del perfil, para que se apliquen sus estilos', () => {
    const { container } = render(
      <ListScreen profile="infantil" title="Números" items={items} onHome={vi.fn()} onBack={vi.fn()} onSelect={vi.fn()} />,
    )
    expect(container.querySelector('main')).toHaveClass('screen', 'infantil')
  })
})
