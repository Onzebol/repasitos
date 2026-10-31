import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { IconsScreen } from './IconsScreen'

const abrir = () => {
  const onHome = vi.fn()
  render(<IconsScreen onHome={onHome} />)
  return { user: userEvent.setup(), onHome }
}

describe('IconsScreen: los iconos de la web', () => {
  it('tiene dos apartados: los que usa la aplicación y los que se pueden usar', () => {
    abrir()
    expect(screen.getByRole('heading', { level: 2, name: 'Iconos que usa la aplicación' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Iconos que puedes usar' })).toBeInTheDocument()
  })

  it('vuelve al inicio con el botón de la barra', async () => {
    const { user, onHome } = abrir()
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(onHome).toHaveBeenCalled()
  })

  it('cada icono de la aplicación dice para qué sirve y dónde sale', () => {
    abrir()
    const uso = screen.getByRole('region', { name: 'Iconos que usa la aplicación' })
    expect(within(uso).getByText('Volver atrás')).toBeInTheDocument()
    expect(within(uso).getByText('Escuchar la pregunta en voz alta')).toBeInTheDocument()
    expect(within(uso).getByText('Materia · Números')).toBeInTheDocument()
    expect(within(uso).getAllByText(/Barra superior/).length).toBeGreaterThan(0)
  })

  it('las flechas de la aplicación se ven como dibujo', () => {
    abrir()
    const uso = screen.getByRole('region', { name: 'Iconos que usa la aplicación' })
    expect(uso.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2)
  })

  it('explica cómo se escogen y qué no incluye', () => {
    abrir()
    expect(screen.getByText(/solo caracteres sueltos/i)).toBeInTheDocument()
  })

  it('el catálogo ofrece los emojis de la fuente, por categorías, y marca los que ya se usan', () => {
    abrir()
    const catalogo = screen.getByRole('region', { name: 'Iconos que puedes usar' })
    expect(within(catalogo).getByRole('heading', { level: 3, name: 'Animales' })).toBeInTheDocument()
    expect(within(catalogo).getByRole('button', { name: /^Copiar 🐶/ })).toBeInTheDocument()
    expect(within(catalogo).getByRole('button', { name: /^Copiar 🏠.*en uso/ })).toBeInTheDocument()
    expect(within(catalogo).getByRole('button', { name: /^Copiar 🐶/ }).getAttribute('aria-label')).not.toMatch(/en uso/)
  })

  it('avisa de que ◀ y ▶ no se usan: salen como emoji con cuadrado y para eso está la flecha SVG', () => {
    abrir()
    for (const flecha of ['◀', '▶']) {
      const celda = screen.getByRole('button', { name: new RegExp('^Copiar ' + flecha) })
      expect(celda).toHaveAccessibleName(/no usar/)
      expect(celda).toHaveAttribute('data-used', 'avoid')
    }
  })

  it('al pulsar un icono lo copia y lo avisa', async () => {
    const { user } = abrir()
    await user.click(screen.getByRole('button', { name: /^Copiar 🦊/ }))
    expect(await navigator.clipboard.readText()).toBe('🦊')
    expect(screen.getByRole('status')).toHaveTextContent('Copiado 🦊')
  })

  it('si el navegador no deja copiar, lo dice sin romperse', async () => {
    const { user } = abrir()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('no'))
    await user.click(screen.getByRole('button', { name: /^Copiar 🦊/ }))
    expect(await screen.findByText(/No se ha podido copiar/)).toBeInTheDocument()
  })
})
