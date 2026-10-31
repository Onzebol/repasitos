import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  window.location.hash = ''
})

const abrir = () => {
  render(<App />)
  return userEvent.setup()
}

describe('App: navegación', () => {
  it('#/iconos abre la página de iconos y se vuelve al inicio con el botón de la barra', async () => {
    window.location.hash = '#/iconos'
    const user = abrir()
    expect(screen.getByRole('heading', { level: 2, name: 'Iconos que usa la aplicación' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(screen.getByText('¡Hola! ¿Quién repasa hoy?')).toBeInTheDocument()
  })

  // TEMPORAL (#50): se quita junto con el botón cuando el trazo esté probado en el móvil
  it('el inicio tiene un botón temporal que abre la prueba de los trazos', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Prueba de trazos/ }))
    expect(window.location.hash).toBe('#/trazo')
    expect(screen.getByRole('list', { name: 'Cifras' })).toBeInTheDocument()
  })

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

  it('Matemáticas abre las unidades: las hechas activas y las demás "Muy pronto"', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    expect(screen.getByRole('button', { name: /Unidad 1/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Unidad 2/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Unidad 3/ })).toBeDisabled()
    expect(screen.getAllByText('Muy pronto')).toHaveLength(7)
  })

  it('de la unidad 1 se llega a los ejercicios de un tema y el botón de inicio vuelve al principio', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    await user.click(screen.getByRole('button', { name: /Unidad 1/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    await user.click(screen.getByRole('button', { name: /Decenas y unidades/ }))
    expect(screen.getByRole('heading', { name: 'Decenas y unidades' })).toBeInTheDocument()
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
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

describe('App: historial del navegador', () => {
  it('atrás del navegador vuelve a cada pantalla anterior', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    await user.click(screen.getByRole('button', { name: /Unidad 1/ }))
    await user.click(screen.getByRole('button', { name: /Decenas y unidades/ }))
    expect(window.location.hash).toBe('#/primaria/matematicas/u1/decenas-unidades')

    act(() => window.history.back())
    expect(await screen.findByRole('button', { name: /Números hasta el 99/ })).toBeInTheDocument()
    act(() => window.history.back())
    expect(await screen.findByRole('button', { name: /Unidad 2/ })).toBeInTheDocument()
    act(() => window.history.back())
    expect(await screen.findByRole('button', { name: 'Lengua' })).toBeInTheDocument()
    act(() => window.history.back())
    expect(await screen.findByText('¡Hola! ¿Quién repasa hoy?')).toBeInTheDocument()
  })

  it('una dirección concreta abre esa pantalla', () => {
    window.location.hash = '#/primaria/matematicas/u1/decenas-unidades'
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Decenas y unidades' })).toBeInTheDocument()
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
  })

  it('una dirección desconocida abre el inicio', () => {
    window.location.hash = '#/primaria/matematicas/u77'
    render(<App />)
    expect(screen.getByText('¡Hola! ¿Quién repasa hoy?')).toBeInTheDocument()
  })

  it('los botones de la pantalla actualizan la dirección', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    expect(window.location.hash).toBe('#/primaria')
    await user.click(screen.getByRole('button', { name: 'Matemáticas' }))
    await user.click(screen.getByRole('button', { name: 'Volver atrás' }))
    expect(window.location.hash).toBe('#/primaria')
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(window.location.hash).toBe('#/')
  })
})
