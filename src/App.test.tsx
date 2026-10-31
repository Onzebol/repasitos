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

  it('el inicio no tiene botón para la prueba de los trazos', () => {
    abrir()
    expect(screen.queryByRole('button', { name: /trazos/i })).not.toBeInTheDocument()
  })

  it('#/trazo sigue abriendo la hoja de trazos (solo por dirección)', () => {
    window.location.hash = '#/trazo'
    render(<App />)
    expect(screen.getByRole('list', { name: 'Cifras' })).toBeInTheDocument()
  })

  it('#/voces abre la herramienta de voces, sin botón en el inicio', () => {
    window.location.hash = '#/voces'
    const { unmount } = render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: 'Voces del navegador' })).toBeInTheDocument()
    unmount()
    window.location.hash = ''
    render(<App />)
    expect(screen.queryByRole('button', { name: /voces/i })).not.toBeInTheDocument()
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

  it('las materias sin contenido todavía están desactivadas, en Primaria y en Infantil', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    expect(screen.getByRole('button', { name: 'Matemáticas' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Conocimiento del medio' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Lengua' })).toBeEnabled()
    for (const materia of ['Inglés', 'Música']) {
      expect(screen.getByRole('button', { name: materia })).toBeDisabled()
    }
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    await user.click(screen.getByRole('button', { name: /Infantil/ }))
    expect(screen.getByRole('button', { name: 'Números' })).toBeEnabled()
    for (const materia of ['Crecimiento en armonía', 'Descubrimiento del entorno', 'Letras', 'Inglés', 'Música y plástica']) {
      expect(screen.getByRole('button', { name: materia })).toBeDisabled()
    }
  })

  it('una materia sin contenido abre «¡Muy pronto!» por dirección y se puede volver', async () => {
    window.location.hash = '#/primaria/ingles'
    const user = abrir()
    expect(screen.getByText('¡Muy pronto!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Volver a las materias/ }))
    expect(screen.getByRole('button', { name: 'Matemáticas' })).toBeInTheDocument()
  })

  it('Lengua abre sus 9 unidades: la 1 con su tema y las demás «Muy pronto»', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Lengua' }))
    expect(window.location.hash).toBe('#/primaria/lengua')
    expect(screen.getByRole('button', { name: /Unidad 1/ })).toBeEnabled()
    expect(screen.getAllByText('Muy pronto')).toHaveLength(8)
    await user.click(screen.getByRole('button', { name: /Unidad 1/ }))
    expect(window.location.hash).toBe('#/primaria/lengua/u1')
    await user.click(screen.getByRole('button', { name: /Sinónimos y palabras del colegio/ }))
    expect(window.location.hash).toBe('#/primaria/lengua/u1/sinonimos')
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
  })

  it('Conocimiento del medio abre sus 9 unidades: la 1 con su tema y las demás «Muy pronto»', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Primaria/ }))
    await user.click(screen.getByRole('button', { name: 'Conocimiento del medio' }))
    expect(window.location.hash).toBe('#/primaria/medio')
    expect(screen.getByRole('button', { name: /Unidad 1/ })).toBeEnabled()
    expect(screen.getAllByText('Muy pronto')).toHaveLength(8)
    await user.click(screen.getByRole('button', { name: /Unidad 1/ }))
    expect(window.location.hash).toBe('#/primaria/medio/u1')
    await user.click(screen.getByRole('button', { name: /¿Cómo nos alimentamos\?/ }))
    expect(window.location.hash).toBe('#/primaria/medio/u1/alimentacion')
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
  })

  it('Infantil: Números abre sus temas sin unidades y atrás vuelve a las materias de Infantil', async () => {
    const user = abrir()
    await user.click(screen.getByRole('button', { name: /Infantil/ }))
    await user.click(screen.getByRole('button', { name: 'Números' }))
    expect(window.location.hash).toBe('#/infantil/numeros')
    for (const tema of ['Contar tocando', '¿Cuántos hay?', 'Las cifras', 'Trazo de las cifras']) {
      expect(screen.getByRole('button', { name: new RegExp(tema) })).toBeEnabled()
    }
    await user.click(screen.getByRole('button', { name: /Las cifras/ }))
    expect(window.location.hash).toBe('#/infantil/numeros/las-cifras')
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver atrás' }))
    expect(window.location.hash).toBe('#/infantil/numeros')
    await user.click(screen.getByRole('button', { name: 'Volver atrás' }))
    expect(window.location.hash).toBe('#/infantil')
    expect(screen.getByRole('button', { name: 'Letras' })).toBeDisabled()
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
