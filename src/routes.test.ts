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
    ]
    for (const hash of hashes) {
      expect(hashFromScreen(screenFromHash(hash))).toBe(hash)
    }
  })

  it('la dirección de un ejercicio abre ese tema', () => {
    const screen = screenFromHash('#/primaria/matematicas/u1/decenas-unidades')
    expect(screen.name).toBe('practice')
    if (screen.name === 'practice') expect(screen.topic.name).toMatch(/Decenas y unidades/)
  })
})
