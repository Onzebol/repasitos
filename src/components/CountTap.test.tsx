import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import { speak } from '../speak'
import { CountTap } from './CountTap'

vi.mock('../speak', () => ({ speak: vi.fn() }))

beforeEach(() => {
  vi.mocked(speak).mockClear()
})

// Cuerpo de la regla CSS de un selector
const regla = (selector: string) => {
  const inicio = css.indexOf(`\n${selector} {`)
  return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
}

const abrir = (emojis: string[]) => {
  const onDone = vi.fn()
  render(<CountTap emojis={emojis} onDone={onDone} />)
  return { user: userEvent.setup(), onDone }
}

describe('CountTap: contar tocando cada dibujo', () => {
  it('muestra un botón por dibujo, todos sin contar', () => {
    abrir(['🐶', '🐶', '🐶'])
    expect(screen.getAllByRole('button', { name: 'Contar' })).toHaveLength(3)
  })

  it('al tocar uno lo marca con su número, en el orden en que se tocan, y lo dice en voz alta', async () => {
    const { user } = abrir(['🐶', '🐶', '🐶'])
    const botones = screen.getAllByRole('button', { name: 'Contar' })
    await user.click(botones[2])
    expect(screen.getByRole('button', { name: 'Contado 1' })).toHaveTextContent('1')
    expect(speak).toHaveBeenLastCalledWith('1')
    await user.click(botones[0])
    expect(screen.getByRole('button', { name: 'Contado 2' })).toBeInTheDocument()
    expect(speak).toHaveBeenLastCalledWith('2')
  })

  it('un dibujo ya contado no se vuelve a contar', async () => {
    const { user } = abrir(['🐶', '🐶', '🐶'])
    await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
    expect(screen.getByRole('button', { name: 'Contado 1' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Contado 1' }))
    expect(speak).toHaveBeenCalledTimes(1)
    expect(screen.getAllByRole('button', { name: 'Contar' })).toHaveLength(2)
  })

  it('avisa una sola vez, al contar el último, y los dibujos se quedan con sus números', async () => {
    const { user, onDone } = abrir(['🐱', '🐱'])
    await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
    expect(onDone).not.toHaveBeenCalled()
    await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Contado 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Contado 2' })).toBeInTheDocument()
  })

  it('con un solo dibujo se acaba al contarlo', async () => {
    const { user, onDone } = abrir(['🐸'])
    await user.click(screen.getByRole('button', { name: 'Contar' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('los dibujos van en un grupo con nombre para los lectores de pantalla', () => {
    abrir(['🐶', '🐶'])
    expect(screen.getByRole('group', { name: 'Dibujos para contar' })).toBeInTheDocument()
  })
})

describe('estilos de contar tocando', () => {
  it('los dibujos son grandes para el dedo y el marcado muestra su número', () => {
    expect(regla('.count-item')).toMatch(/min-width:\s*\d+(\.\d+)?rem/)
    expect(regla('.count-item')).toMatch(/min-height:\s*\d+(\.\d+)?rem/)
    expect(regla('.count-item[data-counted="true"]')).toMatch(/background/)
  })
})
