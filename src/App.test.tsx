import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

const abrir = () => {
  render(<App />)
  return userEvent.setup()
}

describe('App: navegación', () => {
  it('empieza en el inicio con los dos perfiles', () => {
    abrir()
    expect(screen.getByText('¡Hola! ¿Quién repasa hoy?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Infantil/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Primaria/ })).toBeInTheDocument()
  })

  it('Primaria muestra sus cinco materias', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    for (const materia of ['Lengua', 'Matemáticas', 'Conocimiento del medio', 'Inglés', 'Música']) {
      expect(screen.getByRole('button', { name: materia })).toBeInTheDocument()
    }
  })

  it('Infantil muestra sus seis materias (con nombre accesible)', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Infantil/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Números' })).toBeInTheDocument()
  })

  it('una materia sin contenido todavía abre "¡Muy pronto!" y se puede volver', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Lengua' }))
    expect(screen.getByText('¡Muy pronto!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Volver a las materias/ }))
    expect(screen.getByRole('button', { name: 'Matemáticas' })).toBeInTheDocument()
  })

  it('Matemáticas abre las unidades: la 1 activa y las demás "Muy pronto"', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    expect(screen.getByRole('button', { name: /Unidad 1/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Unidad 2/ })).toBeDisabled()
    expect(screen.getAllByText('Muy pronto')).toHaveLength(8)
  })

  it('de la unidad 1 se llega a los ejercicios de un tema y el botón de inicio vuelve al principio', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    await user.click(screen.getByRole('button', { name: /Unidad 1/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    await user.click(screen.getByRole('button', { name: /Decenas y unidades/ }))
    expect(screen.getByRole('heading', { name: 'El número 47 tiene…' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(screen.getByText('¡Hola! ¿Quién repasa hoy?')).toBeInTheDocument()
  })

  it('el botón atrás de la pantalla vuelve al paso anterior', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    await user.click(screen.getByRole('button', { name: /Unidad 1/ }))
    await user.click(screen.getByRole('button', { name: 'Volver atrás' }))
    expect(screen.getByRole('button', { name: /Unidad 2/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver atrás' }))
    expect(screen.getByRole('button', { name: 'Lengua' })).toBeInTheDocument()
  })
})
