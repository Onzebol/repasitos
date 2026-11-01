import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TracePreview } from './TracePreview'

vi.mock('../speak', () => ({ speak: vi.fn() }))

describe('TracePreview: hoja con el recorrido de cada cifra', () => {
  it('muestra las diez cifras con su recorrido', () => {
    render(<TracePreview onHome={vi.fn()} />)
    const lista = screen.getByRole('list', { name: 'Cifras' })
    expect(within(lista).getAllByRole('listitem')).toHaveLength(10)
    for (let digit = 0; digit <= 9; digit++) {
      expect(within(lista).getByRole('img', { name: new RegExp(`^Cifra ${digit}:`) })).toBeInTheDocument()
    }
  })

  it('cada cifra explica en texto cuántos trazos tiene (el 4 y el 7, dos; el 5, uno)', () => {
    render(<TracePreview onHome={vi.fn()} />)
    expect(screen.getByRole('img', { name: /^Cifra 4: 2 trazos/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^Cifra 5: 1 trazo$/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^Cifra 7: 2 trazos/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^Cifra 6: 1 trazo$/ })).toBeInTheDocument()
  })

  it('marca también el punto de llegada de cada trazo, como el punto verde de los cuadernos', () => {
    render(<TracePreview onHome={vi.fn()} />)
    const siete = screen.getByRole('img', { name: /^Cifra 7:/ })
    expect(siete.querySelectorAll('[data-end]')).toHaveLength(2)
  })

  it('cada cifra se puede probar: abre el ejercicio de trazo y, al terminar, vuelve a la hoja', async () => {
    const user = userEvent.setup()
    render(<TracePreview onHome={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Probar el número 4' }))
    expect(screen.getByRole('img', { name: 'Repasa el número 4 con el dedo' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Cifras' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ya lo he hecho' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Volver a la hoja/ }))
    expect(screen.getByRole('list', { name: 'Cifras' })).toBeInTheDocument()
  })

  it('marca el punto de salida y el orden de cada trazo', () => {
    render(<TracePreview onHome={vi.fn()} />)
    const cuatro = screen.getByRole('img', { name: /^Cifra 4:/ })
    expect(cuatro.querySelectorAll('[data-start]')).toHaveLength(2)
    expect(cuatro.textContent).toContain('1')
    expect(cuatro.textContent).toContain('2')
  })
})

describe('TracePreview: consonantes', () => {
  it('muestra las 22 consonantes en mayúscula y en minúscula con su recorrido', () => {
    render(<TracePreview onHome={vi.fn()} />)
    for (const nombre of ['Consonantes en mayúscula', 'Consonantes en minúscula']) {
      const lista = screen.getByRole('list', { name: nombre })
      expect(within(lista).getAllByRole('listitem')).toHaveLength(22)
    }
    expect(screen.getByRole('img', { name: /^Letra B mayúscula: 3 trazos$/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^Letra ñ minúscula: 3 trazos$/ })).toBeInTheDocument()
  })
})
