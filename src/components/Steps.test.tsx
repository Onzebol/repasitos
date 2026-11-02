import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import css from '../assets/theme.css?raw'
import { Steps } from './Steps'

describe('Steps: instrucciones con número y flecha', () => {
  it('dibuja una ficha por instrucción, con su número y su flecha SVG', () => {
    const { container } = render(<Steps value="3> 1^ 2v 1<" />)
    for (const n of ['3', '1', '2']) expect(screen.getAllByText(n).length).toBeGreaterThan(0)
    const flechas = [...container.querySelectorAll('svg')].map((svg) => svg.getAttribute('data-direction'))
    expect(flechas).toEqual(['right', 'up', 'down', 'left'])
  })

  it('no escribe flechas como texto (◀ ▶ salen como emoji con la fuente de emojis)', () => {
    const { container } = render(<Steps value="3> 1^" />)
    expect(container.textContent).not.toMatch(/[→↑↓←◀▶>^]/)
  })

  it('las fichas tienen su propio estilo', () => {
    expect(css).toMatch(/\.steps\s*\{/)
    expect(css).toMatch(/\.step\s*\{/)
  })
})
