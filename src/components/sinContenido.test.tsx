import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import type { Subject } from '../types'
import { ListScreen } from './ListScreen'
import type { ListItem } from './ListScreen'
import { SubjectsScreen } from './SubjectsScreen'

vi.mock('../speak', () => ({ speak: vi.fn() }))

// De momento las materias y unidades sin contenido se ocultan solo con CSS: siguen en el DOM y desactivadas. Aquí se carga
// el theme.css real en el documento de prueba para comprobar qué se ve y qué no.
let estilos: HTMLStyleElement
beforeEach(() => {
  estilos = document.createElement('style')
  estilos.textContent = css
  document.head.append(estilos)
})
afterEach(() => estilos.remove())

const visible = (elemento: HTMLElement) => getComputedStyle(elemento.closest('li')!).display !== 'none'

describe('botones sin contenido: ocultos con CSS', () => {
  const materias: Subject[] = [
    { id: 'a', name: 'Con contenido', icon: '🔢', tint: '#fff' },
    { id: 'b', name: 'Sin contenido', icon: '🔤', tint: '#fff' },
  ]

  it.each(['infantil', 'primaria'] as const)('en %s las materias sin contenido no se ven y las demás sí', (profile) => {
    render(<SubjectsScreen profile={profile} subjects={materias} available={(m) => m.id === 'a'} onHome={vi.fn()} onSelect={vi.fn()} />)
    expect(visible(screen.getByRole('button', { name: /Con contenido/ }))).toBe(true)
    // siguen en el DOM y desactivadas (por eso se puede deshacer quitando solo la regla de CSS)
    const oculta = screen.getByRole('button', { name: /Sin contenido/, hidden: true })
    expect(oculta).toBeDisabled()
    expect(visible(oculta)).toBe(false)
  })

  it('las unidades sin temas no se ven y las que tienen temas sí', () => {
    const unidades: ListItem[] = [
      { id: 'u1', name: 'Unidad 1', icon: '1️⃣', tint: '#fff' },
      { id: 'u4', name: 'Unidad 4', icon: '4️⃣', tint: '#fff', disabled: true },
    ]
    render(<ListScreen profile="primaria" title="Matemáticas" items={unidades} onHome={vi.fn()} onBack={vi.fn()} onSelect={vi.fn()} />)
    expect(visible(screen.getByRole('button', { name: /Unidad 1/ }))).toBe(true)
    expect(visible(screen.getByRole('button', { name: /Unidad 4/, hidden: true }))).toBe(false)
  })

  it('la regla está en theme.css y dice que es provisional', () => {
    expect(css).toMatch(/\.subjects > li:has\(> \.subject:disabled\)\s*\{[^}]*display:\s*none/)
    expect(css).toMatch(/provisional/i)
  })
})
