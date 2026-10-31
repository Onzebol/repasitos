import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TracePreview } from './TracePreview'

describe('TracePreview: hoja con el recorrido de cada cifra', () => {
  it('muestra las diez cifras con su recorrido', () => {
    render(<TracePreview onHome={vi.fn()} />)
    const lista = screen.getByRole('list', { name: 'Cifras' })
    expect(within(lista).getAllByRole('listitem')).toHaveLength(10)
    for (let digit = 0; digit <= 9; digit++) {
      expect(within(lista).getByRole('img', { name: new RegExp(`^Cifra ${digit}:`) })).toBeInTheDocument()
    }
  })

  it('cada cifra explica en texto cuántos trazos tiene (el 4 y el 5, dos)', () => {
    render(<TracePreview onHome={vi.fn()} />)
    expect(screen.getByRole('img', { name: /^Cifra 4: 2 trazos/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^Cifra 5: 2 trazos/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^Cifra 7: 1 trazo/ })).toBeInTheDocument()
  })

  it('marca el punto de salida y el orden de cada trazo', () => {
    render(<TracePreview onHome={vi.fn()} />)
    const cuatro = screen.getByRole('img', { name: /^Cifra 4:/ })
    expect(cuatro.querySelectorAll('[data-start]')).toHaveLength(2)
    expect(cuatro.textContent).toContain('1')
    expect(cuatro.textContent).toContain('2')
  })
})
