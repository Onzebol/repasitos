import { describe, expect, it } from 'vitest'
import { hashFromScreen, screenFromHash } from './routes'

describe('routes: dirección ↔ pantalla', () => {
  it('sin dirección o desconocida se muestra el inicio', () => {
    expect(screenFromHash('')).toEqual({ name: 'home' })
    expect(screenFromHash('#/')).toEqual({ name: 'home' })
    expect(screenFromHash('#/nada')).toEqual({ name: 'home' })
    expect(screenFromHash('#/primaria/nada')).toEqual({ name: 'home' })
    expect(screenFromHash('#/primaria/matematicas/u99')).toEqual({ name: 'home' })
    expect(screenFromHash('#/primaria/matematicas/u2/tema')).toEqual({ name: 'home' })
    expect(screenFromHash('#/iconos/otra')).toEqual({ name: 'home' })
  })

  it('cada pantalla tiene su dirección y se recupera al leerla', () => {
    const hashes = [
      '#/',
      '#/infantil',
      '#/primaria',
      '#/infantil/numeros',
      '#/primaria/lengua',
      '#/primaria/matematicas',
      '#/primaria/matematicas/u1',
      '#/primaria/matematicas/u1/decenas-unidades',
      '#/iconos',
      '#/trazo',
      '#/voces',
    ]
    for (const hash of hashes) {
      expect(hashFromScreen(screenFromHash(hash))).toBe(hash)
    }
  })

  it('#/iconos abre la página de iconos (solo por dirección, sin botón en el inicio)', () => {
    expect(screenFromHash('#/iconos')).toEqual({ name: 'icons' })
    expect(hashFromScreen({ name: 'icons' })).toBe('#/iconos')
  })

  it('#/iconos abre la página de iconos (solo por dirección, sin botón en el inicio)', () => {
    expect(screenFromHash('#/iconos')).toEqual({ name: 'icons' })
    expect(hashFromScreen({ name: 'icons' })).toBe('#/iconos')
    expect(screenFromHash('#/iconos/otra')).toEqual({ name: 'home' })
  })

  it('#/voces abre la herramienta para probar voces (solo por dirección)', () => {
    expect(screenFromHash('#/voces')).toEqual({ name: 'voices' })
    expect(hashFromScreen({ name: 'voices' })).toBe('#/voces')
    expect(screenFromHash('#/voces/otra')).toEqual({ name: 'home' })
  })

  it('#/trazo abre la hoja de trazos de las cifras (solo por dirección)', () => {
    expect(screenFromHash('#/trazo')).toEqual({ name: 'trace' })
    expect(hashFromScreen({ name: 'trace' })).toBe('#/trazo')
    expect(screenFromHash('#/trazo/otra')).toEqual({ name: 'home' })
  })

  it('la dirección de un ejercicio abre ese tema', () => {
    const screen = screenFromHash('#/primaria/matematicas/u1/decenas-unidades')
    expect(screen.name).toBe('practice')
    if (screen.name === 'practice') expect(screen.topic.name).toMatch(/Decenas y unidades/)
  })
})
