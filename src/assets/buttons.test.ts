import { describe, expect, it } from 'vitest'
import css from './theme.css?raw'

// Cuerpo de la regla CSS de un selector (el selector debe estar solo, al principio de la línea)
const regla = (selector: string) => {
  const inicio = css.indexOf(`\n${selector} {`)
  return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
}

const px = (texto: string, patron: RegExp) => {
  const encontrado = patron.exec(texto)
  return encontrado ? Number(encontrado[1]) : NaN
}

// Botones con sombra "de relieve": al pulsar bajan y la sombra se acorta lo mismo, así se hunden
// (el borde inferior de la sombra se queda quieto). Si la sombra bajara con el botón no parecería pulsado.
const BOTONES: [string, string][] = [
  ['.round-button', '.round-button:active'],
  ['.action', '.action:active'],
  ['.option', '.option:active:not(:disabled)'],
  ['.key', '.key:active:not(:disabled)'],
  ['.profile', '.profile:active'],
  ['.subject', '.subject:active'],
  ['.trace-try', '.trace-try:active'],
  ['.count-item', '.count-item:active:not(:disabled)'],
]

describe('botones: efecto de pulsar', () => {
  it.each(BOTONES)('%s: al pulsar baja y la sombra se acorta lo mismo que baja', (reposo, pulsado) => {
    const sombraReposo = px(regla(reposo), /box-shadow:\s*0\s+(\d+)px/)
    const baja = px(regla(pulsado), /translateY\((\d+)px\)/)
    const sombraPulsado = px(regla(pulsado), /box-shadow:\s*0\s+(\d+)px/)
    expect(sombraReposo).toBeGreaterThan(0)
    expect(baja).toBeGreaterThan(0)
    expect(sombraPulsado).toBe(sombraReposo - baja)
  })

  it('los botones redondos usan la misma sombra que los botones de las unidades, en reposo y al pulsar', () => {
    const sombra = (estilos: string) => /box-shadow:\s*([^;]+);/.exec(estilos)?.[1]
    const baja = (estilos: string) => /translateY\(([^)]+)\)/.exec(estilos)?.[1]
    expect(sombra(regla('.round-button'))).toBeDefined()
    expect(sombra(regla('.round-button'))).toBe(sombra(regla('.subject')))
    expect(sombra(regla('.round-button:active'))).toBe(sombra(regla('.subject:active')))
    expect(baja(regla('.round-button:active'))).toBe(baja(regla('.subject:active')))
  })

  it('con movimiento reducido ningún botón se mueve al pulsar', () => {
    const reducido = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    for (const selector of ['.round-button:active', '.action:active', '.subject:active']) {
      expect(css).toContain(selector)
    }
    expect(reducido).toMatch(/\.round-button:active/)
    expect(reducido).toMatch(/\.action:active/)
  })
})
