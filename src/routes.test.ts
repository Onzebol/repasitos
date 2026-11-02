import { describe, expect, it } from 'vitest'
import { hashFromScreen, hasContent, screenFromHash } from './routes'

describe('routes: dirección ↔ pantalla', () => {
  it('sin dirección o desconocida se muestra el inicio', () => {
    expect(screenFromHash('')).toEqual({ name: 'home' })
    expect(screenFromHash('#/')).toEqual({ name: 'home' })
    expect(screenFromHash('#/nada')).toEqual({ name: 'home' })
    expect(screenFromHash('#/primaria/nada')).toEqual({ name: 'home' })
    expect(screenFromHash('#/primaria/matematicas/u99')).toEqual({ name: 'home' })
    expect(screenFromHash('#/primaria/matematicas/u2/tema')).toEqual({ name: 'home' })
    expect(screenFromHash('#/iconos/otra')).toEqual({ name: 'home' })
    expect(screenFromHash('#/infantil/numeros/tema-que-no-existe')).toEqual({ name: 'home' })
    expect(screenFromHash('#/infantil/numeros/cuantos-hay/otra')).toEqual({ name: 'home' })
  })

  it('cada pantalla tiene su dirección y se recupera al leerla', () => {
    const hashes = [
      '#/',
      '#/infantil',
      '#/primaria',
      '#/infantil/numeros',
      '#/infantil/numeros/cuantos-hay',
      '#/infantil/letras',
      '#/primaria/lengua',
      '#/primaria/matematicas',
      '#/primaria/matematicas/u1',
      '#/primaria/matematicas/u1/decenas-unidades',
      '#/primaria/lengua/u1',
      '#/primaria/lengua/u1/sinonimos',
      '#/primaria/medio',
      '#/primaria/medio/u1',
      '#/primaria/medio/u1/alimentacion',
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

  it('en Infantil Números abre directamente sus temas (sin unidades) y cada pantalla sabe su perfil', () => {
    const temas = screenFromHash('#/infantil/numeros')
    expect(temas.name).toBe('topics')
    if (temas.name === 'topics') {
      expect(temas.profile).toBe('infantil')
      expect(temas.unit.topics.map((t) => t.id)).toEqual(['contar', 'cuantos-hay', 'cantidad-numero', 'las-cifras', 'antes-despues', 'mas-menos', 'trazo'])
    }
    const practica = screenFromHash('#/infantil/numeros/las-cifras')
    expect(practica.name).toBe('practice')
    if (practica.name === 'practice') {
      expect(practica.profile).toBe('infantil')
      expect(practica.topic.id).toBe('las-cifras')
    }
    const primaria = screenFromHash('#/primaria/matematicas/u1')
    expect(primaria.name === 'topics' && primaria.profile).toBe('primaria')
  })

  it('una materia de Infantil sin contenido sigue abriendo «Muy pronto» por dirección', () => {
    expect(screenFromHash('#/infantil/ingles').name).toBe('subject')
  })

  it('hasContent dice qué materias tienen ejercicios', () => {
    const materia = (id: string) => ({ id, name: '', icon: '', tint: '' })
    expect(hasContent('infantil', materia('numeros'))).toBe(true)
    expect(hasContent('infantil', materia('letras'))).toBe(true)
    expect(hasContent('infantil', materia('ingles'))).toBe(false)
    expect(hasContent('primaria', materia('matematicas'))).toBe(true)
    expect(hasContent('primaria', materia('lengua'))).toBe(true)
    expect(hasContent('primaria', materia('medio'))).toBe(true)
    expect(hasContent('primaria', materia('ingles'))).toBe(false)
  })

  it('Lengua abre sus unidades: solo la 1 tiene temas y las demás vuelven al inicio', () => {
    const unidades = screenFromHash('#/primaria/lengua')
    expect(unidades.name).toBe('units')
    if (unidades.name === 'units') expect(unidades.units).toHaveLength(9)
    expect(screenFromHash('#/primaria/lengua/u1').name).toBe('topics')
    expect(screenFromHash('#/primaria/lengua/u2')).toEqual({ name: 'home' })
  })

  it('Conocimiento del medio abre sus unidades: solo la 1 tiene temas y las demás vuelven al inicio', () => {
    const unidades = screenFromHash('#/primaria/medio')
    expect(unidades.name).toBe('units')
    if (unidades.name === 'units') expect(unidades.units).toHaveLength(9)
    expect(screenFromHash('#/primaria/medio/u1').name).toBe('topics')
    expect(screenFromHash('#/primaria/medio/u2')).toEqual({ name: 'home' })
  })

  it('la dirección de un ejercicio abre ese tema', () => {
    const screen = screenFromHash('#/primaria/matematicas/u1/decenas-unidades')
    expect(screen.name).toBe('practice')
    if (screen.name === 'practice') expect(screen.topic.name).toMatch(/Decenas y unidades/)
  })
})
